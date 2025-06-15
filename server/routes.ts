import type { Express } from "express";
import { Request, Response} from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { analyzeSymptoms, transcribeAudio } from "./services/openai";
import { insertSymptomSubmissionSchema, insertSymptomAnalysisSchema } from "@shared/schema";
import multer from "multer";
import { z } from "zod";
import { register, login } from "./services/auth";


// Configure multer for file uploads
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB limit
  },
  fileFilter: (req: Request, file: Express.Multer.File, cb) => {
    if (file.mimetype.startsWith('image/') || file.mimetype.startsWith('audio/')) {
      cb(null, true);
    } else {
      cb(new Error('Only image and audio files are allowed'));
    }
  }
});

export async function registerRoutes(app: Express): Promise<void> {

  // Submit text symptoms
  app.post("/api/symptoms/text", async (req, res) => {
    console.log("Here it is ");
    try {
      const { sessionId, content } = req.body;
      
      if (!sessionId || !content) {
        return res.status(400).json({ message: "Session ID and content are required" });
      }

      // Create symptom submission
      const submission = await storage.createSymptomSubmission({
        sessionId,
        type: 'text',
        content,
        originalFilename: null
      });

      // Analyze symptoms with OpenAI
      const analysisResult = await analyzeSymptoms(content, 'text');
      
      // Save analysis
      const analysis = await storage.createSymptomAnalysis({
        submissionId: submission.id,
        analysis: analysisResult.analysis,
        urgencyLevel: analysisResult.urgencyLevel,
        possibleCauses: JSON.stringify(analysisResult.possibleCauses),
        healthTips: JSON.stringify(analysisResult.healthTips)
      });

      res.json({ 
        submission, 
        analysis: {
          ...analysis,
          possibleCauses: analysisResult.possibleCauses,
          healthTips: analysisResult.healthTips,
          seekImmediateCare: analysisResult.seekImmediateCare
        }
      });
    } catch (error: unknown) {
      console.error('Text symptom submission error:', error);
      if (error instanceof Error) {
        res.status(500).json({ message: error.message });
      } else {
        res.status(500).json({ message: 'An unknown error occurred' });
      }
    }
  });

  // Submit image symptoms
  app.post("/api/symptoms/image", upload.single('image'), async (req, res) => {
    try {
      const { sessionId } = req.body;
      const file = req.file;
      
      if (!sessionId || !file) {
        return res.status(400).json({ message: "Session ID and image file are required" });
      }

      // Convert image to base64 for OpenAI
      const base64Image = file.buffer.toString('base64');
      const dataUrl = `data:${file.mimetype};base64,${base64Image}`;

      // Create symptom submission
      const submission = await storage.createSymptomSubmission({
        sessionId,
        type: 'photo',
        content: dataUrl,
        originalFilename: file.originalname
      });

      // Analyze image with OpenAI
      const analysisResult = await analyzeSymptoms(dataUrl, 'image');
      
      // Save analysis
      const analysis = await storage.createSymptomAnalysis({
        submissionId: submission.id,
        analysis: analysisResult.analysis,
        urgencyLevel: analysisResult.urgencyLevel,
        possibleCauses: JSON.stringify(analysisResult.possibleCauses),
        healthTips: JSON.stringify(analysisResult.healthTips)
      });

      res.json({ 
        submission, 
        analysis: {
          ...analysis,
          possibleCauses: analysisResult.possibleCauses,
          healthTips: analysisResult.healthTips,
          seekImmediateCare: analysisResult.seekImmediateCare
        }
      });
    } catch (error: unknown) {  
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: error.errors.map(e => e.message).join(', ') });
      }
      if (error instanceof Error) {
      console.error('Image symptom submission error:', error);
      res.status(500).json({ message: error.message });
      } else {
        console.error('Image symptom submission error:', error);
        res.status(500).json({ message: 'An unknown error occurred' });
      }
    }
  });

  // Submit audio symptoms
  app.post("/api/symptoms/audio", upload.single('audio'), async (req, res) => {
    try {
      const { sessionId } = req.body;
      const file = req.file;
      
      if (!sessionId || !file) {
        return res.status(400).json({ message: "Session ID and audio file are required" });
      }

      // Transcribe audio with OpenAI Whisper
      const transcribedText = await transcribeAudio(file.buffer);

      // Create symptom submission
      const submission = await storage.createSymptomSubmission({
        sessionId,
        type: 'voice',
        content: transcribedText,
        originalFilename: file.originalname
      });

      // Analyze transcribed text with OpenAI
      const analysisResult = await analyzeSymptoms(transcribedText, 'voice');
      
      // Save analysis
      const analysis = await storage.createSymptomAnalysis({
        submissionId: submission.id,
        analysis: analysisResult.analysis,
        urgencyLevel: analysisResult.urgencyLevel,
        possibleCauses: JSON.stringify(analysisResult.possibleCauses),
        healthTips: JSON.stringify(analysisResult.healthTips)
      });

      res.json({ 
        submission, 
        analysis: {
          ...analysis,
          possibleCauses: analysisResult.possibleCauses,
          healthTips: analysisResult.healthTips,
          seekImmediateCare: analysisResult.seekImmediateCare,
          transcribedText
        }
      });
    } catch (error: unknown) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: error.errors.map(e => e.message).join(', ') });
      }
      if (error instanceof Error) {
        console.error('Audio symptom submission error:', error);
        res.status(500).json({ message: error.message });
      }
      else {
        console.error('Audio symptom submission error:', error);
        res.status(500).json({ message: 'An unknown error occurred' });
      }
    }
  });

  // Get analysis by submission ID
  app.get("/api/analysis/:submissionId", async (req, res) => {
    try {
      const submissionId = parseInt(req.params.submissionId);
      
      if (isNaN(submissionId)) {
        return res.status(400).json({ message: "Invalid submission ID" });
      }

      const analysis = await storage.getSymptomAnalysis(submissionId);
      
      if (!analysis) {
        return res.status(404).json({ message: "Analysis not found" });
      }

      res.json({
        ...analysis,
        possibleCauses: JSON.parse(analysis.possibleCauses),
        healthTips: JSON.parse(analysis.healthTips)
      });
    } catch (error: unknown) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: error.errors.map(e => e.message).join(', ') });
      }
      if (error instanceof Error) {
        console.error('Get analysis error:', error);
        res.status(500).json({ message: error.message });
      } else {
        console.error('Get analysis error:', error);
        res.status(500).json({ message: 'An unknown error occurred' });
      }
    }
  });

  // Get session history
  app.get("/api/session/:sessionId", async (req, res) => {
    try {
      const { sessionId } = req.params;
      
      const submissions = await storage.getSymptomSubmissionsBySession(sessionId);
      
      const submissionsWithAnalyses = await Promise.all(
        submissions.map(async (submission) => {
          const analysis = await storage.getSymptomAnalysis(submission.id);
          return {
            submission,
            analysis: analysis ? {
              ...analysis,
              possibleCauses: JSON.parse(analysis.possibleCauses),
              healthTips: JSON.parse(analysis.healthTips)
            } : null
          };
        })
      );

      res.json(submissionsWithAnalyses);
    } catch (error: unknown) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: error.errors.map(e => e.message).join(', ') });
      }
      if (error instanceof Error) {
        console.error('Get session history error:', error);
        res.status(500).json({ message: error.message });
      } else {
        console.error('Get session history error:', error);
        res.status(500).json({ message: 'An unknown error occurred' });
      }
    }
  });

  // Authentication routes

  app.post("/api/auth/register", async (req, res) => {
    const { username, password } = req.body;
    const result = await register(username, password);
    console.log(result);
    if (result.success) {
      res.status(201).json({ user: result.user, message: "User registered successfully", success: true});
    } else {
      
      res.status(400).json({ message: result.message, success: false });
    }
  });

  app.post("/api/auth/login", async (req, res) => {
    const { username, password } = req.body;
    const result = await login(username, password);
    if (result.success) {
      res.json({ user: result.user, token: result.token, message: "User signed in successfully", success: true });
    } else {
      res.status(401).json({ message: result.message, success: false });
    }
  });

}
