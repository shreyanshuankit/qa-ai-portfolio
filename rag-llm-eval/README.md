# LLM / RAG evaluation sample (Portfolio sample)

**This is a portfolio sample, not client work.** It was built as an original demonstration for Shreyanshu Santosh (Senior QA Engineer). It is not a past engagement, and it does not use employer code or data.

The knowledge base describes **Northbloom CarryMug**, a made-up self-heating travel mug. Every corpus file is labelled fictional. Nothing in it is a real product, company, or brand.

The system is fully local and free: **BM25 retrieval** plus a **deterministic extractive answerer**. There is no paid API and no hosted LLM. If the question's focus terms are not attested in the retrieved text, the system refuses with a fixed sentence rather than guessing.

## How to run

Prerequisites: Python 3.11+.

```bash
python3 -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
python src/rag_eval.py
```

This retrieves, answers, scores all evaluation cases, and writes:

- `results/eval_results.csv` — per-case answers and rubric scores
- `results/summary.json` — roll-up rates and the failing cases

## Evaluation set (21 cases)

| Category | Cases | What they test |
|----------|-------|----------------|
| Answerable | A1–A8 | Facts stated in a single FAQ page |
| Paraphrase | P1–P3 | Same facts, different wording |
| Multi-hop | M1–M3 | Answers that need two facts, sometimes two pages |
| Unanswerable | U1–U4 | Price, pink colour, airlines, CEO — must refuse |
| Adversarial | X1–X3 | Prompt injection that tries to override warranty, microwave safety, or the answer text |

The rubric (`eval/rubric.md`) scores retrieval hit@3, faithfulness/groundedness, answer correctness, and refusal correctness.

## Sample results (actual run)

- Date: 13 November 2026, 20:48 IST (Asia/Calcutta)
- Command: `python src/rag_eval.py`
- Environment: Python 3.13.5, rank-bm25 0.2.2, Linux
- Outcome: **19 of 21 cases passed** (90.5%)

| Metric | Result |
|--------|--------|
| Case pass | 19 / 21 (0.905) |
| Retrieval hit@3 (applicable) | 16 / 17 (0.941) |
| Faithfulness | 21 / 21 (1.000) |
| Answer correctness (applicable) | 15 / 17 (0.882) |
| Refusal correctness | 21 / 21 (1.000) |

| Category | Passed |
|----------|--------|
| Answerable | 7 / 8 |
| Paraphrase | 3 / 3 |
| Multi-hop | 2 / 3 |
| Unanswerable | 4 / 4 |
| Adversarial | 3 / 3 |

The two failures (A7, M1) and the recommended fixes are in the findings report.

## Layout

```
corpus/                 fictional Northbloom CarryMug FAQ
eval/test_cases.json    21 labelled cases
eval/rubric.md          scoring rules
src/rag_eval.py         retriever, extractive answerer, scorer
results/                CSV + JSON from the recorded run
```
