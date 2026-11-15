# QA engineer who tests AI agents, RAG and LLM apps, plus Playwright and API automation

Portfolio samples by Shreyanshu Santosh, a senior QA engineer. Each folder is original work against public practice targets, or a fictional product FAQ in the RAG eval. None of it is client work, and none of it uses employer code or data.

**Offer:** [I test your AI chatbot or agent and send a bug + eval report in 48 hours](./ai-chatbot-testing-offer/README.md). A recorded sample report is in [ai-chatbot-testing-offer/sample-report/REPORT.md](./ai-chatbot-testing-offer/sample-report/REPORT.md).

The numbers below come from recorded local runs on 13 November 2026 and, for the chatbot offer sample, 15 November 2026 (Asia/Calcutta). Public demo APIs can be rate-limited or briefly unavailable, so a later run may differ.

## Projects

| Project | What it shows | Stack | Recorded result | Folder |
|---------|---------------|-------|-----------------|--------|
| REST Assured API suite | Auth, booking CRUD, JSON Schema, and negative cases on Restful Booker | Java 17, TestNG 7.10, Maven, REST Assured 5.5 | 15/15 passed in 35.68 s (20:48 IST) | [rest-assured-api-suite](./rest-assured-api-suite/) |
| RAG / LLM eval | Local BM25 retrieval plus a deterministic extractive answerer, with a labelled rubric and failure analysis | Python, rank-bm25 | 19/21 cases passed (90.5%); two real misses explained in FINDINGS.md (20:48 IST) | [rag-llm-eval](./rag-llm-eval/) |
| Postman collection | Chained auth and booking requests, plus negative cases, run with Newman | Postman Collection v2.1, Newman 4.6.1 | 12 requests and 18 assertions, 0 failed, in 8.4 s (20:49 IST) | [postman-api-collection](./postman-api-collection/) |
| Playwright UI + API | Swag Labs UI (page objects) plus ReqRes and Restful Booker API tests, with a sample CI workflow and run evidence | Playwright 1.65, TypeScript, GitHub Actions | 22/22 passed in 19.2 s (13 UI + 9 API, 20:50 IST) | [playwright-ui-api](./playwright-ui-api/) |
| AI chatbot testing offer | Productized 48-hour bug + eval report, plus a recorded sample against a public no-key text API | Python, public classic chat-completions API | 35/38 cases passed (92.1%); three real misses explained in REPORT.md (11:04–11:43 IST, 15 Nov) | [ai-chatbot-testing-offer](./ai-chatbot-testing-offer/) |

## How to run

Commands assume you start at the repository root.

**REST Assured API suite** — JDK 17 and Maven 3.9+:

```bash
cd rest-assured-api-suite && mvn test
```

**RAG / LLM eval** — Python 3.11+:

```bash
cd rag-llm-eval
python3 -m venv .venv && source .venv/bin/activate && pip install -r requirements.txt
python src/rag_eval.py
```

**Postman collection** — Node.js 18+ (Newman is listed in `package.json`):

```bash
cd postman-api-collection
npm ci
npx newman run Restful-Booker.postman_collection.json -e Restful-Booker.postman_environment.json --delay-request 200 -r cli,html --reporter-html-export newman-report.html
```

**Playwright UI + API** — Node.js 18+ (20 recommended):

```bash
cd playwright-ui-api
npm ci && npx playwright install chromium
npx playwright test
```

**AI chatbot testing offer sample** — Python 3.11+ (re-runs the public Pollinations Classic API; anonymous text requests must be spaced about 45–50 seconds apart):

```bash
cd ai-chatbot-testing-offer
python3 -m venv .venv && source .venv/bin/activate && pip install -r requirements.txt
python sample-report/run_eval.py
```

## What this demonstrates

- **REST Assured.** Request and response spec builders, token auth, booking CRUD, JSON Schema checks, and negative cases. The suite also records two quirks of this public demo: a create with a missing body returns HTTP 500 rather than 400, and a default `Content-Type` with a charset makes the API respond HTTP 418. Only bookings created by the suite are updated or deleted.
- **RAG / LLM eval.** A fully local, free evaluation loop (no paid API and no hosted LLM) over a fictional FAQ. The recorded run scored retrieval hit@3 at 16/17, faithfulness 21/21, answer correctness 15/17, and refusal correctness 21/21. The two failures are explained in [rag-llm-eval/FINDINGS.md](./rag-llm-eval/FINDINGS.md): A7 dropped the USB-C fact on a two-clause question, and M1 missed the heating page when "dishwasher" dominated BM25. Every unanswerable and adversarial case was handled correctly. The findings include recommended fixes, which is the kind of analysis a client would get from an LLM/RAG evaluation.
- **Postman.** The same Restful Booker coverage as a Collection v2.1 a client can import, with `token` and `bookingid` chained across requests, plus Newman CLI and HTML reports from the recorded run.
- **Playwright.** Page objects for login, inventory, cart and checkout (including an 8% tax calculation), API tests against ReqRes and Restful Booker, and a sample GitHub Actions workflow at [.github/workflows/playwright.yml](./.github/workflows/playwright.yml). Screenshots, CLI output, an HTML report, and two short videos from the 20:50 IST run are in [playwright-ui-api/evidence](./playwright-ui-api/evidence/).
- **AI chatbot testing offer.** A one-page offer and a 38-case sample against the public Pollinations Classic text API (GPT-OSS 20B, anonymous tier). The recorded run scored 35/38. The three misses — an invented refund window, a citation probe that hit an output-token limit, and a whitespace-only prompt that was answered as a normal turn — are explained in [ai-chatbot-testing-offer/sample-report/REPORT.md](./ai-chatbot-testing-offer/sample-report/REPORT.md). Contact for the offer is via the GitHub profile only.

Published demo credentials (`standard_user` / `secret_sauce` on Swag Labs, and `admin` / `password123` on Restful Booker) are used only against those public practice services. They are not secrets from any employer or client. ReqRes is called without a personal API key.

## Services

Available for QA audits, API and Playwright automation, LLM/RAG evaluation, and the 48-hour AI chatbot testing offer.

## License

MIT. Swag Labs, ReqRes, Restful Booker, and the Pollinations Classic text API remain the property of their owners and are used here only as public practice targets. The RAG corpus is fictional.
