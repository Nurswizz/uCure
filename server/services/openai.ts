import OpenAI from "openai";
import dotenv from "dotenv";

dotenv.config();

// the newest OpenAI model is "gpt-4o" which was released May 13, 2024. do not change this unless explicitly requested by the user
const openai = new OpenAI({ 
  apiKey: process.env.OPENAI_API_KEY || process.env.OPENAI_API_KEY_ENV_VAR || "default_key"
});

export interface HealthAnalysisResult {
  analysis: string;
  urgencyLevel: 'low' | 'medium' | 'high';
  possibleCauses: string[];
  healthTips: string[];
  seekImmediateCare: boolean;
}

export async function analyzeSymptoms(content: string, type: 'text' | 'image' | 'voice'): Promise<HealthAnalysisResult> {
  try {
    let messages: any[] = [];
    
    const systemPrompt = `You are a medical AI assistant helping people in rural areas understand their symptoms. 
    Analyze the provided symptoms and respond with a JSON object containing:
    - analysis: detailed explanation of what the symptoms might indicate
    - urgencyLevel: 'low', 'medium', or 'high' based on severity
    - possibleCauses: array of potential causes
    - healthTips: array of actionable health recommendations
    - seekImmediateCare: boolean indicating if immediate medical attention is needed
    
    Always remind users that this is not a substitute for professional medical advice.
    Be empathetic and use clear, simple language suitable for rural communities.`;

    messages.push({
      role: "system",
      content: systemPrompt
    });

    if (type === 'image') {
      messages.push({
        role: "user",
        content: [
          {
            type: "text",
            text: "Please analyze this medical image and provide health insights. Focus on visible symptoms and conditions."
          },
          {
            type: "image_url",
            image_url: {
              url: content // content should be data:image/jpeg;base64,... format
            }
          }
        ]
      });
    } else {
      messages.push({
        role: "user",
        content: `Please analyze these symptoms: ${content}`
      });
    }

    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages,
      response_format: { type: "json_object" },
      max_tokens: 1000,
    });

    const result = JSON.parse(response.choices[0].message.content || '{}');


    return {
      analysis: result.analysis || "Unable to analyze symptoms at this time.",
      urgencyLevel: (result.urgencyLevel === 'low' || result.urgencyLevel === 'medium' || result.urgencyLevel === 'high')
        ? result.urgencyLevel
        : 'medium',
      possibleCauses: result.possibleCauses || [],
      healthTips: result.healthTips || [],
      seekImmediateCare: result.seekImmediateCare || false
    };
  } catch (error) {
    console.error('OpenAI analysis error:', error);
    throw new Error('Failed to analyze symptoms. Please try again.');
  }
}

import fs from "fs";
import path from "path";
import { promisify } from "util";
const writeFileAsync = promisify(fs.writeFile);
const unlinkAsync = promisify(fs.unlink);
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export async function transcribeAudio(audioBuffer: Buffer): Promise<string> {
  const tempFilePath = path.join(__dirname, `temp-audio-${Date.now()}.wav`);
  try {
    // Write buffer to a temporary file
    await writeFileAsync(tempFilePath, audioBuffer);

    const transcription = await openai.audio.transcriptions.create({
      file: fs.createReadStream(tempFilePath),
      model: "whisper-1",
    });

    return transcription.text;
  } catch (error) {
    console.error('Audio transcription error:', error);
    throw new Error('Failed to transcribe audio. Please try again.');
  } finally {
    // Clean up the temporary file
    if (fs.existsSync(tempFilePath)) {
      await unlinkAsync(tempFilePath);
    }
  }
}
