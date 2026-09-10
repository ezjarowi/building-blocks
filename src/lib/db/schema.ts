import {
  boolean,
  integer,
  jsonb,
  pgTable,
  text,
  timestamp,
  uuid,
} from "drizzle-orm/pg-core";

export const people = pgTable("people", {
  id: uuid("id").defaultRandom().primaryKey(),
  name: text("name").notNull(),
  expectedType: text("expected_type"),
  notes: text("notes"),
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
  verified: boolean("verified").notNull().default(false),
  createdAt: timestamp("created_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
});

export const adminLockouts = pgTable("admin_lockouts", {
  ip: text("ip").primaryKey(),
  failures: integer("failures").notNull().default(0),
  lockedUntil: timestamp("locked_until", { withTimezone: true }),
  updatedAt: timestamp("updated_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
});
