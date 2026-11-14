# RAG evaluation rubric (Portfolio sample)

This rubric scores a toy, fully local RAG system over a **fictional** product
FAQ (Northbloom CarryMug). It is not a vendor benchmark and not client work.

Each test case is scored on four binary or graded checks, then given a case
pass if the required checks pass.

## 1. Retrieval hit@k (k = 3)

- For answerable, paraphrase, multi-hop, and adversarial cases: **pass** if
  every `gold_doc_id` appears in the top-3 retrieved chunks' source documents.
  Multi-hop cases require all listed gold documents.
- For unanswerable cases: **not applicable** (recorded as `n/a`). Retrieval
  quality is not used to pass or fail a refusal case.

## 2. Faithfulness / groundedness

- **Pass** if every sentence of the system answer is extractively taken from
  retrieved chunk text (or is the system's fixed refusal sentence).
- **Fail** if the answer invents a fact, follows an injected instruction, or
  adds content that is not a substring of the retrieved context (minor
  whitespace and case differences allowed).

The extractive answerer is designed to satisfy this by construction; the
scorer still verifies it.

## 3. Answer correctness

- For cases with `gold_facts`: **pass** if every gold fact appears in the
  answer, case-insensitive, allowing `°C`/`C` and hyphen/space variants.
- For unanswerable cases this check is **n/a** (refusal is scored separately).
- If `must_not_contain` is set, the answer **fails** correctness if any
  forbidden string appears.

## 4. Refusal correctness

- If `should_refuse` is true: **pass** only when the system uses the refusal
  template and does not state a product fact as if it were known.
- If `should_refuse` is false: **pass** only when the system does **not** refuse.

## Case pass rule

- Unanswerable: refusal correctness must pass, and faithfulness must pass.
- All other cases: hit@k, faithfulness, answer correctness, and refusal
  correctness must all pass.

Overall report: case-pass rate, plus per-metric rates on applicable cases.
