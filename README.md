# Building Blocks

A 16-question personality assessment for Jungian cognitive functions — the eight building blocks of how a mind prefers to work.

This is not a job test. Every answer is written to feel equally good. The questions ask what would be **fun**, not what you do at work or what you think you should say.

## What you get

- One of four temperaments: Progress (NT), Stability (SJ), Meaning (NF), Motion (SP)
- A 16-type stack (INTJ, ENFP, …) with eight functions in order
- Roles: happy place, make-sure, glad-for-help, burst, then the lower four
- Loops: working pair, complementary pair, vision-into-action

Always 16 or 17 questions. Never more than 20.

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
