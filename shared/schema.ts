import { pgTable, text, serial, integer, boolean, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

export const symptomSubmissions = pgTable("symptom_submissions", {
  id: serial("id").primaryKey(),
  sessionId: text("session_id").notNull(),
  type: text("type").notNull(), // 'photo', 'voice', 'text'
  content: text("content").notNull(), // base64 image, transcribed text, or direct text
  originalFilename: text("original_filename"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const symptomAnalyses = pgTable("symptom_analyses", {
  id: serial("id").primaryKey(),
  submissionId: integer("submission_id").references(() => symptomSubmissions.id).notNull(),
  analysis: text("analysis").notNull(), // JSON string of analysis results
  urgencyLevel: text("urgency_level").notNull(), // 'low', 'medium', 'high'
  possibleCauses: text("possible_causes").notNull(), // JSON array of causes
  healthTips: text("health_tips").notNull(), // JSON array of tips
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

export const insertSymptomSubmissionSchema = createInsertSchema(symptomSubmissions).omit({
  id: true,
  createdAt: true,
});

export const insertSymptomAnalysisSchema = createInsertSchema(symptomAnalyses).omit({
  id: true,
  createdAt: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;
export type SymptomSubmission = typeof symptomSubmissions.$inferSelect;
export type InsertSymptomSubmission = z.infer<typeof insertSymptomSubmissionSchema>;
export type SymptomAnalysis = typeof symptomAnalyses.$inferSelect;
export type InsertSymptomAnalysis = z.infer<typeof insertSymptomAnalysisSchema>;
