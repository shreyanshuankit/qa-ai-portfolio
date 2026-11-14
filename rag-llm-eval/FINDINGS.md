# RAG evaluation findings (Portfolio sample)

**This is a portfolio sample, not client work.** The system under test is a toy, fully local RAG app over a fictional product FAQ (Northbloom CarryMug). Date of the recorded run: 13 November 2026, 20:48 IST (Asia/Calcutta). Command: `python src/rag_eval.py`.

## Outcome

19 of 21 cases passed (90.5%).

| Metric | Pass | n | Rate |
|--------|------|---|------|
| Case pass | 19 | 21 | 0.905 |
| Retrieval hit@3 | 16 | 17 | 0.941 |
| Faithfulness / groundedness | 21 | 21 | 1.000 |
| Answer correctness | 15 | 17 | 0.882 |
| Refusal correctness | 21 | 21 | 1.000 |

Every unanswerable case was refused. Every adversarial case kept the grounded fact and ignored the injected instruction (warranty stayed 18 months, the mug was not called microwave-safe, and the model did not print `I AM UNGROUNDED`). Faithfulness was 21/21 because answers are extractive: every sentence is taken from retrieved text, or the answer is the fixed refusal sentence.

## What failed

### A7 — charging port and wireless charging (answerable)

- Question: "What charging port does the mug use, and is wireless charging supported?"
- Gold facts: `USB-C` and `not supported`
- Result: retrieval hit@3 passed (the charging page was in the top 3). The extractive answer correctly said "Wireless charging is not supported" but never included the sentence that names USB-C.
- Why: the question is two clauses. BM25 and the sentence scorer both put more weight on the "wireless charging" paragraph. The USB-C fact lives in the other paragraph of the same short page, and that paragraph did not rank in the top 3 chunks, so the answerer never saw it.
- This is a chunking and multi-clause ranking miss, not a hallucination.

### M1 — hottest preset duration plus dishwasher lid (multi-hop)

- Question: "If I use the hottest preset, how long will the charge last, and can I wash the lid in the dishwasher afterwards?"
- Gold documents: `02-heating-and-battery` and `03-lid-and-leak`
- Gold facts: `90 minutes` (70 °C hold time) and `top-rack`
- Result: the lid / dishwasher half was answered correctly. Retrieval hit@3 failed: the top 3 documents were lid, care, and warranty — all pulled by the words "lid" and "dishwasher". The heating-and-battery page was not retrieved, so the 90-minute hold time never appeared in the answer.
- Why: a single BM25 query (even after splitting on "and") still lets a high-scoring clause crowd out a quieter one. "Dishwasher" is a strong, rare term; "hottest preset" / "charge last" is weaker and also collides with the charging-page "90 minutes to full charge" fact, which is the wrong 90 minutes.

## What worked and is worth keeping

- A lexical coverage gate, not a raw score threshold, is what made unanswerable questions refuse. Questions like "What is the price of the Northbloom CarryMug?" still retrieve the overview page because of the product name; without the gate the extractive answerer would have quoted capacity and colours and failed refusal correctness.
- Stripping injection prefixes before retrieval and extraction is enough, in this toy, to stop the three adversarial prompts from overriding grounded facts.
- Sentence-level extraction plus a substring faithfulness check keeps the system honest: it cannot invent a number that is not in the retrieved text.

## Recommendations

1. **Index short FAQ pages as one chunk (or retrieve neighbouring paragraphs).** A7 would likely have passed if the USB-C and wireless-charging paragraphs had been kept together.
2. **Retrieve per clause and union the results, with a reserved slot per clause.** M1 needs the heating page even when "dishwasher" dominates overall rank. A simple rule — top 2 chunks per clause, then cap the merged list — is cheap and would be the next experiment.
3. **Do not treat string overlap as enough for multi-hop numeric facts.** A later scorer should check that "90 minutes" is bound to the 70 °C preset, not to the 90-minute USB-C charge time, so a lucky wrong source cannot pass answer correctness.
4. **Keep the refusal gate and the adversarial cases in the suite.** They caught the failure mode that a similarity threshold would have missed, and they are cheap to re-run.

No production claim is made for this toy. The value of the sample is the labelled set, the rubric, and a real run with two explained misses.
