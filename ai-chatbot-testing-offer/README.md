# I test your AI chatbot or agent and send a bug + eval report in 48 hours

A productized QA offer by [Shreyanshu Santosh](https://github.com/shreyanshuankit). This page describes the service. A recorded sample report, from an unsolicited test of a public demo (not a client engagement), is in [sample-report/REPORT.md](./sample-report/REPORT.md).

This is original evaluation work. It does not use employer code or data. There are no client names, testimonials, or performance guarantees on this page.

## Who it's for

Startups and product teams who are shipping a chatbot, RAG assistant, or tool-using agent and want an independent check before a launch, a demo, or a paid rollout.

## What gets tested

| Area | What I look for |
|------|-----------------|
| Hallucination and factuality | Confident answers that are wrong, or precise numbers and citations that were never established |
| Grounding and faithfulness | Answers that drift from the knowledge base, FAQ, or documents you provide |
| Prompt injection and jailbreak resistance | Attempts to override instructions, including requests to reveal a system prompt or to follow a harmless policy-violating format |
| PII and system-prompt leakage | Invented or leaked admin contacts, stored user data, API keys, or hidden instructions |
| Refusal and safety behaviour | Whether clearly disallowed requests are refused, and whether ordinary safe requests are still answered |
| Off-topic handling | Gibberish, impossible real-world actions, and other inputs the bot should not pretend to have completed |
| Multi-turn consistency | Whether facts, corrections, and style instructions survive later turns |
| Tone | Professional, appropriate replies under frustration or when empathy is required |
| Latency and error handling | Slow or failed replies, empty input, and over-long input |

The exact mix depends on the tier and on what you can share. If you do not provide a knowledge base, grounding is limited to citation honesty and to facts that can be checked without your docs. The sample report shows that situation.

## What you send

- A bot URL or an API I can call, plus any access notes (for example, a header or a test workspace).
- Optionally, the docs, FAQ, or policy the bot should stay faithful to.
- A short description of what the bot is allowed and not allowed to do.

I do not need production secrets. A staging or demo endpoint is enough.

## What you get in 48 hours

- A bug report: title, severity, steps to reproduce, expected vs actual, and evidence pointing at the logged response.
- An eval scorecard: pass/fail counts per category, taken from the recorded run.
- A test-case sheet you can re-run (the prompts, plus the verdict rule for each case).
- A short list of the highest-value fixes.

Every number in the report comes from that run. If the bot does well, the report says so.

## Pricing

Prices are for one chatbot or agent, one environment, and a report delivered within 48 hours of a complete access pack (URL or API, plus any docs you want included).

| Tier | India | Abroad | Scope |
|------|-------|--------|-------|
| Basic | ₹5,000 | $100 | Up to 30 cases across factuality, injection, leakage, refusal and safety, off-topic handling, and error handling. Bug report and scorecard. |
| Standard | ₹6,500 | $125 | Up to 50 cases, plus grounding against your docs or FAQ, multi-turn consistency, tone, and latency. Adds the test-case sheet. |
| Plus | ₹8,000 | $150 | Up to 80 cases, deeper injection and refusal coverage, and a prioritized fix list with a suggested re-check for each fix. |

Travel, production incident response, and ongoing retainers are outside this offer.

## Process

1. You share the URL or API, the tier, and any docs or constraints.
2. I confirm the scope in writing (what will be tested, and what will not).
3. I run the cases, with modest pacing, against the agreed endpoint.
4. You receive the report and the supporting logs within 48 hours.

## Sample

The sample at [sample-report/REPORT.md](./sample-report/REPORT.md) is an unsolicited evaluation of a public open demo. It is not client work, and it is not a claim about how your bot will score.

## Contact

Get in touch via the [GitHub profile](https://github.com/shreyanshuankit).
