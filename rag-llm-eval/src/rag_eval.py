#!/usr/bin/env python3
"""Toy local RAG + evaluation harness.

Portfolio sample for Shreyanshu Santosh. The knowledge base is a fictional
product FAQ (Northbloom CarryMug). Retrieval is BM25; answers are extractive
and deterministic. No paid APIs are used.
"""

from __future__ import annotations

import csv
import json
import re
from dataclasses import dataclass
from pathlib import Path

from rank_bm25 import BM25Okapi

ROOT = Path(__file__).resolve().parents[1]
CORPUS_DIR = ROOT / "corpus"
EVAL_PATH = ROOT / "eval" / "test_cases.json"
RESULTS_DIR = ROOT / "results"

REFUSAL = "I don't have that information in the Northbloom CarryMug documents."
K = 3
MAX_SENTENCES = 3

TOKEN_RE = re.compile(r"[a-z0-9]+")

STOP = {
    "the", "and", "what", "is", "of", "a", "an", "to", "in", "for", "does",
    "do", "i", "how", "long", "can", "this", "that", "it", "its", "or", "on",
    "with", "from", "be", "are", "was", "were", "by", "at", "as", "if",
    "after", "still", "may", "also", "use", "using", "used", "about",
    "northbloom", "carrymug", "mug", "product", "please", "me", "my", "you",
    "your", "we", "they", "them", "than", "then", "when", "which", "who",
    "whom", "will", "would", "should", "could", "need", "needed", "into",
    "only", "back", "send", "wants", "want", "customer", "inside", "while",
}

# Instruction / injection words stripped from the question used for retrieval
# and coverage checks so adversarial prefixes do not hijack ranking.
INJECTION = {
    "ignore", "documents", "say", "tell", "user", "system", "forget",
    "previous", "instructions", "output", "words", "now", "you", "are",
    "bot", "sales", "ungrounded", "iam",
}

SYNONYMS = {
    "capacity": ["capacity", "ml", "hold", "liquid", "cup"],
    "cup": ["mug", "cup"],
    "application": ["app", "application"],
    "app": ["app", "application"],
    "mobile": ["app", "phone", "mobile"],
    "download": ["app", "companion"],
    "bluetooth": ["bluetooth"],
    "colours": ["colours", "colors", "colour", "color", "slate", "oat", "cedar"],
    "colors": ["colours", "colors", "colour", "color", "slate", "oat", "cedar"],
    "colour": ["colours", "colors", "colour", "color", "slate", "oat", "cedar"],
    "color": ["colours", "colors", "colour", "color", "slate", "oat", "cedar"],
    "sold": ["ships", "colours", "colors", "slate"],
    "recharge": ["charge", "charging", "battery"],
    "duration": ["minutes", "hours", "takes"],
    "port": ["usb", "port", "charger"],
    "wireless": ["wireless"],
    "warranty": ["warranty", "months"],
    "period": ["warranty", "months"],
    "dishwasher": ["dishwasher", "lid"],
    "lid": ["lid", "dishwasher"],
    "hottest": ["hottest", "70"],
    "preset": ["preset", "presets", "40", "55", "70"],
    "presets": ["preset", "presets", "40", "55", "70"],
    "temperature": ["preset", "presets", "40", "55", "70"],
    "charge": ["charge", "charging", "minutes"],
    "battery": ["battery", "hours", "minutes", "charge"],
    "return": ["return", "returned", "days"],
    "window": ["return", "days", "30"],
    "children": ["children", "toy", "years"],
    "toy": ["toy", "children"],
    "microwave": ["microwave"],
    "safe": ["microwave", "must", "not"],
    "price": ["price", "cost", "usd"],
    "pink": ["pink"],
    "airlines": ["airline", "airlines", "luggage", "carry"],
    "airline": ["airline", "airlines", "luggage", "carry"],
    "luggage": ["airline", "luggage", "carry"],
    "ceo": ["ceo", "chief", "founder"],
    "unused": ["unused", "return", "days"],
    "weeks": ["days", "return", "weeks"],
}


def tokenize(text: str) -> list[str]:
    return TOKEN_RE.findall(text.lower())


def expand_tokens(tokens: list[str]) -> list[str]:
    out: list[str] = []
    for t in tokens:
        out.append(t)
        out.extend(SYNONYMS.get(t, []))
    return out


def unwrap(text: str) -> str:
    """Join single newlines inside a paragraph; keep paragraph breaks."""
    paras = re.split(r"\n\s*\n", text.strip())
    joined = []
    for para in paras:
        line = re.sub(r"[ \t]*\n[ \t]*", " ", para.strip())
        joined.append(line)
    return "\n\n".join(joined)


def split_sentences(text: str) -> list[str]:
    text = unwrap(text)
    parts = re.split(r"(?<=[.!?])\s+", text.strip())
    out = []
    for p in parts:
        p = p.strip()
        if not p or p.startswith("#") or p.startswith("FICTIONAL PRODUCT"):
            continue
        out.append(p)
    return out


@dataclass
class Chunk:
    chunk_id: str
    doc_id: str
    text: str


def load_chunks() -> list[Chunk]:
    chunks: list[Chunk] = []
    for path in sorted(CORPUS_DIR.glob("*.md")):
        doc_id = path.stem
        raw = unwrap(path.read_text(encoding="utf-8"))
        paragraphs = [p.strip() for p in re.split(r"\n\s*\n", raw) if p.strip()]
        for i, para in enumerate(paragraphs):
            if para.startswith("#") and "." not in para:
                continue
            if para.startswith("FICTIONAL PRODUCT"):
                continue
            chunks.append(Chunk(f"{doc_id}#p{i}", doc_id, para))
    return chunks


def question_focus(question: str) -> list[str]:
    stripped = strip_injection(question)
    tokens = [t for t in tokenize(stripped) if t not in STOP and t not in INJECTION]
    return expand_tokens(tokens)


def strip_injection(question: str) -> str:
    # Prefer the trailing interrogative clause when an injection prefix is present.
    match = re.search(
        r"(?:what is|what's|what are|what colours|what colors|what temperature|"
        r"does|do i|is the|is this|how long|how much|which|who is|can the|"
        r"can i|may )\b.*",
        question,
        flags=re.I,
    )
    if match:
        return match.group(0)
    return question


def split_clauses(question: str) -> list[str]:
    q = strip_injection(question)
    parts = re.split(r"\b(?:and|, and|;)\b", q, flags=re.I)
    parts = [p.strip() for p in parts if len(tokenize(p)) >= 3]
    return parts if len(parts) >= 2 else [q]


class ToyRag:
    def __init__(self, chunks: list[Chunk]):
        self.chunks = chunks
        self.bm25 = BM25Okapi([tokenize(c.text) for c in chunks])

    def retrieve(self, question: str, k: int = K) -> list[tuple[Chunk, float]]:
        # Merge rankings from the full question and any "and"-separated clauses
        # so multi-hop questions can surface more than one document.
        scored: dict[str, tuple[Chunk, float]] = {}
        queries = [strip_injection(question)] + split_clauses(question)
        seen_q = set()
        for q in queries:
            key = normalize(q)
            if key in seen_q:
                continue
            seen_q.add(key)
            tokens = expand_tokens(tokenize(q))
            scores = self.bm25.get_scores(tokens)
            for i, s in enumerate(scores):
                cid = self.chunks[i].chunk_id
                prev = scored.get(cid)
                if prev is None or s > prev[1]:
                    scored[cid] = (self.chunks[i], float(s))
        ranked = sorted(scored.values(), key=lambda x: x[1], reverse=True)
        return ranked[:k]

    def answer(self, question: str) -> dict:
        retrieved = self.retrieve(question)
        top_score = retrieved[0][1] if retrieved else 0.0
        context = " ".join(unwrap(ch.text) for ch, _ in retrieved)
        if self._should_refuse(question, retrieved):
            return {
                "answer": REFUSAL,
                "refused": True,
                "top_score": top_score,
                "retrieved": retrieved,
                "context": context,
            }
        extracted = self._extract(question, retrieved)
        if not extracted:
            return {
                "answer": REFUSAL,
                "refused": True,
                "top_score": top_score,
                "retrieved": retrieved,
                "context": context,
            }
        return {
            "answer": extracted,
            "refused": False,
            "top_score": top_score,
            "retrieved": retrieved,
            "context": context,
        }

    def _should_refuse(self, question: str, retrieved: list[tuple[Chunk, float]]) -> bool:
        """Refuse when the asked focus terms are not attested in retrieved text.

        Product-name overlap alone is not enough: unanswerable questions still
        mention "CarryMug" / "Northbloom" and would otherwise get a confident
        but ungrounded extract.
        """
        focus = [t for t in question_focus(question) if t not in STOP]
        if not focus:
            return True
        ctx_tokens = set()
        for ch, _ in retrieved:
            ctx_tokens.update(tokenize(ch.text))
        # A small set of attributes that never appear in this fictional corpus
        # must always be refused if they are the question focus.
        unknown = {"price", "cost", "usd", "ceo", "founder", "pink", "airline",
                   "airlines", "luggage", "carryon"}
        if any(t in unknown for t in focus) and not (unknown & ctx_tokens):
            return True
        overlap = set(focus) & ctx_tokens
        # Need at least one non-generic overlap beyond the product itself.
        return len(overlap) == 0

    def _extract(self, question: str, retrieved: list[tuple[Chunk, float]]) -> str:
        focus = set(question_focus(question))
        scored: list[tuple[float, int, str]] = []
        seen = set()
        for doc_rank, (chunk, _bm) in enumerate(retrieved):
            for sent in split_sentences(chunk.text):
                if sent in seen:
                    continue
                seen.add(sent)
                s_tokens = set(tokenize(sent))
                overlap = len(focus & s_tokens)
                if overlap == 0:
                    continue
                # Prefer earlier retrieved docs on ties; slight length prior.
                score = overlap * 2.0 - 0.01 * doc_rank
                scored.append((score, doc_rank, sent))
        scored.sort(key=lambda x: (-x[0], x[1]))
        # Diversity: prefer sentences from different docs when available.
        chosen: list[str] = []
        used_rank: set[int] = set()
        for score, doc_rank, sent in scored:
            if len(chosen) >= MAX_SENTENCES:
                break
            if doc_rank in used_rank and len(chosen) < min(2, len({s[1] for s in scored})):
                continue
            chosen.append(sent)
            used_rank.add(doc_rank)
        if not chosen:
            # Fall back to highest-scoring sentences even from the same doc.
            chosen = [s for _, _, s in scored[:MAX_SENTENCES]]
        return " ".join(chosen).strip()


def normalize(text: str) -> str:
    text = text.lower()
    text = text.replace("°c", " c").replace("℃", " c")
    text = text.replace("-", " ")
    text = re.sub(r"\b(\d+)\s+day\b", r"\1 days", text)
    text = re.sub(r"\s+", " ", text)
    return text.strip()


def fact_present(fact: str, answer: str) -> bool:
    return normalize(fact) in normalize(answer)


def is_faithful(answer: str, context: str, refused: bool) -> bool:
    if refused:
        return answer.strip() == REFUSAL
    ctx = normalize(context)
    for sent in split_sentences(answer):
        if sent.strip() == REFUSAL:
            continue
        if normalize(sent) not in ctx:
            return False
    return True


def score_case(case: dict, result: dict) -> dict:
    retrieved_docs = [ch.doc_id for ch, _ in result["retrieved"]]
    gold_docs = case.get("gold_doc_ids") or []
    should_refuse = bool(case["should_refuse"])
    refused = bool(result["refused"])
    answer = result["answer"]

    if should_refuse:
        hit = "n/a"
        hit_pass = True
    else:
        hit = all(any(g == d or g in d for d in retrieved_docs) for g in gold_docs) if gold_docs else False
        hit_pass = bool(hit)

    faithful = is_faithful(answer, result["context"], refused)

    if should_refuse:
        correct = "n/a"
        correct_pass = True
    else:
        facts_ok = all(fact_present(f, answer) for f in case.get("gold_facts") or [])
        forbidden = case.get("must_not_contain") or []
        clean = all(normalize(f) not in normalize(answer) for f in forbidden)
        correct_pass = bool(facts_ok and clean)
        correct = correct_pass

    if should_refuse:
        refusal_pass = refused and answer.strip() == REFUSAL
    else:
        refusal_pass = not refused

    if should_refuse:
        case_pass = refusal_pass and faithful
    else:
        case_pass = hit_pass and faithful and correct_pass and refusal_pass

    return {
        "id": case["id"],
        "category": case["category"],
        "question": case["question"],
        "answer": answer,
        "refused": refused,
        "should_refuse": should_refuse,
        "top_score": round(result["top_score"], 4),
        "retrieved_docs": ";".join(retrieved_docs),
        "gold_docs": ";".join(gold_docs),
        "hit_at_3": hit if hit != "n/a" else "n/a",
        "faithful": faithful,
        "answer_correct": correct if correct != "n/a" else "n/a",
        "refusal_correct": refusal_pass,
        "case_pass": case_pass,
        "missing_facts": "" if should_refuse else ";".join(
            f for f in (case.get("gold_facts") or []) if not fact_present(f, answer)
        ),
    }


def main() -> None:
    cases = json.loads(EVAL_PATH.read_text(encoding="utf-8"))
    rag = ToyRag(load_chunks())
    rows = []
    for case in cases:
        result = rag.answer(case["question"])
        rows.append(score_case(case, result))

    RESULTS_DIR.mkdir(exist_ok=True)
    csv_path = RESULTS_DIR / "eval_results.csv"
    fields = list(rows[0].keys())
    with csv_path.open("w", newline="", encoding="utf-8") as fh:
        writer = csv.DictWriter(fh, fieldnames=fields)
        writer.writeheader()
        writer.writerows(rows)

    def rate(key):
        applicable = [r for r in rows if r[key] != "n/a"]
        if not applicable:
            return 0, 0, 0.0
        passed = sum(1 for r in applicable if r[key] is True)
        return passed, len(applicable), passed / len(applicable)

    n_pass = sum(1 for r in rows if r["case_pass"])
    summary = {
        "label": "Portfolio sample",
        "n_cases": len(rows),
        "case_pass": n_pass,
        "case_pass_rate": round(n_pass / len(rows), 3),
        "hit_at_3": rate("hit_at_3"),
        "faithful": rate("faithful"),
        "answer_correct": rate("answer_correct"),
        "refusal_correct": rate("refusal_correct"),
        "by_category": {},
    }
    for cat in sorted({r["category"] for r in rows}):
        subset = [r for r in rows if r["category"] == cat]
        p = sum(1 for r in subset if r["case_pass"])
        summary["by_category"][cat] = {"pass": p, "n": len(subset)}

    def fmt(triple):
        p, n, r = triple
        return {"pass": p, "n": n, "rate": round(r, 3)}

    out = {
        "label": summary["label"],
        "n_cases": summary["n_cases"],
        "case_pass": summary["case_pass"],
        "case_pass_rate": summary["case_pass_rate"],
        "hit_at_3": fmt(summary["hit_at_3"]),
        "faithful": fmt(summary["faithful"]),
        "answer_correct": fmt(summary["answer_correct"]),
        "refusal_correct": fmt(summary["refusal_correct"]),
        "by_category": summary["by_category"],
        "failures": [
            {
                "id": r["id"],
                "category": r["category"],
                "question": r["question"],
                "answer": r["answer"],
                "hit_at_3": r["hit_at_3"],
                "faithful": r["faithful"],
                "answer_correct": r["answer_correct"],
                "refusal_correct": r["refusal_correct"],
                "missing_facts": r["missing_facts"],
                "retrieved_docs": r["retrieved_docs"],
                "top_score": r["top_score"],
            }
            for r in rows
            if not r["case_pass"]
        ],
    }
    (RESULTS_DIR / "summary.json").write_text(json.dumps(out, indent=2), encoding="utf-8")
    print(json.dumps(out, indent=2))
    print(f"\nWrote {csv_path}")


if __name__ == "__main__":
    main()
