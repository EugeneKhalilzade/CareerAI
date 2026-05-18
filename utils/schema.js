import { pgTable, serial, text, varchar } from "drizzle-orm/pg-core";

export const MockInterview = pgTable('mockInterview', {
  id: serial("id").primaryKey(),
  jsonMockResp: text("jsonMockResp").notNull(),
  jobPosition: varchar("jobPosition").notNull(),
  jobDesc: varchar("jobDesc").notNull(),
  jobExperience: varchar("jobExperience").notNull(),
  createdBy: varchar("createdBy").notNull(),
  createdAt: varchar("createdAt"),
  mockId: varchar("mockId").notNull()
});

export const UserAnswer = pgTable('useAnswer', {
  id: serial('id').primaryKey(),
  mockIdRef: varchar("mockId").notNull(),
  question: varchar('question').notNull(),
  correctAns: text('correctAns'),
  userAns: text('userAns'),
  feedback: text('feedback'),
  rating: varchar('rating'),
  userEmail: varchar('userEmail'),
  createdAt: varchar('createdAt')
});

export const CalendarEvent = pgTable('calendarEvent', {
  id: serial('id').primaryKey(),
  title: varchar('title').notNull(),
  notes: text('notes'),
  date: varchar('date').notNull(),       // YYYY-MM-DD
  time: varchar('time'),                 // HH:MM (optional)
  type: varchar('type').notNull(),       // 'note' | 'interview'
  userEmail: varchar('userEmail').notNull(),
  createdAt: varchar('createdAt'),
});

