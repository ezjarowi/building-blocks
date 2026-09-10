import { jsonb, pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core";

export const assessments = pgTable("assessments", {
  id: uuid("id").defaultRandom().primaryKey(),
  typeCode: text("type_code").notNull(),
  temperament: text("temperament").notNull(),
  stack: jsonb("stack").$type<string[]>().notNull(),
  answers: jsonb("answers").$type<{ questionId: string; optionId: string }[]>().notNull(),
  result: jsonb("result").notNull(),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
});
