import { jsonb, pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core";

export const people = pgTable("people", {
  id: uuid("id").defaultRandom().primaryKey(),
  name: text("name").notNull(),
  createdAt: timestamp("created_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
});

export const invites = pgTable("invites", {
  id: uuid("id").defaultRandom().primaryKey(),
  token: text("token").notNull().unique(),
  personId: uuid("person_id")
    .notNull()
    .references(() => people.id),
  createdAt: timestamp("created_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
});

export const assessments = pgTable("assessments", {
  id: uuid("id").defaultRandom().primaryKey(),
  typeCode: text("type_code").notNull(),
  temperament: text("temperament").notNull(),
  stack: jsonb("stack").$type<string[]>().notNull(),
  answers: jsonb("answers")
    .$type<{ questionId: string; optionId: string }[]>()
    .notNull(),
  result: jsonb("result").notNull(),
  respondentName: text("respondent_name"),
  personId: uuid("person_id").references(() => people.id),
  inviteId: uuid("invite_id").references(() => invites.id),
  gitSha: text("git_sha"),
  createdAt: timestamp("created_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
});
