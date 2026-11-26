# Gapstars AI Native Full Stack Engineering Challenge

Equipment Desk is a small internal tool for approving staff equipment reservations. It uses Next.js App Router, React, TypeScript, Prisma, PostgreSQL and GitHub Actions. The data is fictional.

We use this take-home for the Senior AI Native Full Stack Engineer role. You are expected to use an AI coding assistant of your choice. Show where it helped, what you checked and where you had to change course. Free tools are fine.

## Timebox

Aim for **four hours**. Prioritise reliable approvals, then deliver the smallest useful activity history. If work remains at the end, explain the gap, the risk and what you would do next. A focused submission can advance without the optional work. Starting and verifying the app locally is sufficient. Cloud accounts, live AI APIs and a mobile build are outside the exercise.

## Quick start

Use Node.js 24 and Docker with Compose. If you already have PostgreSQL, use a dedicated local database and set its connection string in `.env`.

```sh
cp .env.example .env
docker compose up -d --wait db
npm ci
npm run db:migrate
npm run db:seed
npm run dev
```

Open [http://127.0.0.1:3000](http://127.0.0.1:3000). The seed includes a dock with multiple units, two people waiting for the last portable monitor, an out-of-stock headset and one historical approval. The seed skips a database that already has equipment. To replay the original fixtures, use a fresh disposable database.

`npm test`, `npm run typecheck` and `npm run build` are the local checks used by CI. The GitHub Actions job supplies a disposable PostgreSQL instance and applies migrations and seed. The baseline tests cover ID parsing. Add verification for the behaviour you change. After editing the Prisma schema, regenerate the client with `npx prisma generate`.

| Where | What it contains |
| --- | --- |
| `src/app/` | Reservations UI, activity placeholder and API routes |
| `src/lib/reservations.ts` | Reservation reads and approval writes |
| `prisma/` | Schema, migration and fictional seed data |
| `.github/workflows/ci.yml` | Continuous integration |

## Your work

### 1. Make approvals reliable

The desk sometimes sees inventory change twice when an approval is retried. Reproduce the issue, find its cause and fix the approval path.

- Each reservation is for one unit. Approving a pending reservation with stock available changes its status and deducts one unit together.
- Retrying an already approved reservation returns success without another stock change, including when the first approval used the final unit.
- If requests overlap, only one approval may consume the final unit. A pending reservation with no stock returns HTTP 409 and stays pending. Keep the existing invalid-ID and missing-ID responses.
- The reservations screen should reflect the result without a manual reload and explain a stock conflict.
- Add runnable regression coverage for retries and show how you verified the last-unit case with overlapping requests. Include the commands someone else can run.

The existing endpoints are `GET /api/reservations` and `POST /api/reservations/:id/approve`.

### 2. Ship a small activity history

Give desk staff a way to see recent approvals and filter by equipment.

- Add a forward migration that works with existing data. Preserve existing reservations and inventory. Start recording new approvals from the time the feature ships.
- Record one activity entry per successful new approval. Save it with the approval and stock update. Retries and rejected approvals should add no entry.
- Provide a read API and a usable `/activity` page. Show the reservation reference, equipment name and approval time, with the latest 25 first. Support an equipment filter and handle an empty history, no matching results and a failed load. Choose and document the API shape.
- In `DECISIONS.md`, add a brief release note covering migration order, rollback, one production metric and what would influence a Cloud Run or GKE choice. A few bullets are enough.

### Optional

Describe how a mobile client could safely retry the approval after losing its connection. If you have time to implement more, strengthen the database-backed regression coverage.

## Submission

Open a PR against the starter branch in a **private copy** you control. Share the PR link with your recruiting contact and give the named reviewers access. GitHub forks of a public repo are public, so create a separate private repository and push a clone to it. Keep the starter revision as the base for the review.

Include:

- A short PR summary with what works, what remains and how to run your checks.
- [DECISIONS.md](DECISIONS.md) with your diagnosis, assumptions, trade-offs, cuts and production release note.
- [AI_USAGE.md](AI_USAGE.md) with a short, concrete account of how you directed and verified AI assistance. Use your own words and link examples to the work.
- A brief chronological work trace. Use natural commit checkpoints or a few entries in `DECISIONS.md` made while working. A few accurate checkpoints are enough.
- Tests you added or changed.

Use the fictional data provided. Keep credentials, private code and personal data out of your submission and AI tools. Be ready to walk through the code, tests and decisions in your own words.
