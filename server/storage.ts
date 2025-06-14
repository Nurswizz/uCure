import { 
  users, 
  symptomSubmissions, 
  symptomAnalyses,
  type User, 
  type InsertUser,
  type SymptomSubmission,
  type InsertSymptomSubmission,
  type SymptomAnalysis,
  type InsertSymptomAnalysis
} from "@shared/schema";

export interface IStorage {
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  createSymptomSubmission(submission: InsertSymptomSubmission): Promise<SymptomSubmission>;
  getSymptomSubmission(id: number): Promise<SymptomSubmission | undefined>;
  getSymptomSubmissionsBySession(sessionId: string): Promise<SymptomSubmission[]>;
  
  createSymptomAnalysis(analysis: InsertSymptomAnalysis): Promise<SymptomAnalysis>;
  getSymptomAnalysis(submissionId: number): Promise<SymptomAnalysis | undefined>;
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private symptomSubmissions: Map<number, SymptomSubmission>;
  private symptomAnalyses: Map<number, SymptomAnalysis>;
  private currentUserId: number;
  private currentSubmissionId: number;
  private currentAnalysisId: number;

  constructor() {
    this.users = new Map();
    this.symptomSubmissions = new Map();
    this.symptomAnalyses = new Map();
    this.currentUserId = 1;
    this.currentSubmissionId = 1;
    this.currentAnalysisId = 1;
  }

  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.currentUserId++;
    const user: User = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }

  async createSymptomSubmission(insertSubmission: InsertSymptomSubmission): Promise<SymptomSubmission> {
    const id = this.currentSubmissionId++;
    const submission: SymptomSubmission = {
      ...insertSubmission,
      id,
      createdAt: new Date(),
      originalFilename: insertSubmission.originalFilename ?? null,
    };
    this.symptomSubmissions.set(id, submission);
    return submission;
  }

  async getSymptomSubmission(id: number): Promise<SymptomSubmission | undefined> {
    return this.symptomSubmissions.get(id);
  }

  async getSymptomSubmissionsBySession(sessionId: string): Promise<SymptomSubmission[]> {
    return Array.from(this.symptomSubmissions.values()).filter(
      (submission) => submission.sessionId === sessionId
    );
  }

  async createSymptomAnalysis(insertAnalysis: InsertSymptomAnalysis): Promise<SymptomAnalysis> {
    const id = this.currentAnalysisId++;
    const analysis: SymptomAnalysis = {
      ...insertAnalysis,
      id,
      createdAt: new Date(),
    };
    this.symptomAnalyses.set(id, analysis);
    return analysis;
  }

  async getSymptomAnalysis(submissionId: number): Promise<SymptomAnalysis | undefined> {
    return Array.from(this.symptomAnalyses.values()).find(
      (analysis) => analysis.submissionId === submissionId
    );
  }
}

export const storage = new MemStorage();
