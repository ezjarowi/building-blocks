# Benson's Talent Blueprint

A personality assessment for eight cognitive building blocks — what a mind actually prefers, in order.

This is not a job test and not a letter-dichotomy quiz. Every answer is written to feel equally good. The questions ask what would be **fun**, not what you do at work or what you think you should say.

## What you get

- One of four temperaments: Progress (NT), Stability (SJ), Meaning (NF), Motion (SP)
- A 16-type stack with eight functions in order
- Roles: happy place, make-sure, relief, burst, then the lower four (i/e mirror)
- Loops: working pair, complementary pair, vision-into-action

The stack is a lock: once happy-place and make-sure are known, child and burst are predicted and confirmed. Clean path is about 9–10 questions. Never more than 20.

## Local

```bash
npm install
cp .env.example .env.local
# DATABASE_URL is provisioned via Vercel + Neon
npx vercel env pull .env.local --yes
npm run db:push
npm run dev
```

## Stack

Next.js, Neon Postgres, Drizzle, Vercel.
