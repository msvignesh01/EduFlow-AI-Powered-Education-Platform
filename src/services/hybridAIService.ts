import { GoogleGenerativeAI } from '@google/generative-ai';
import { ollamaService } from './ollamaService';

interface AIResponse {
  text: string;
  model: 'gemini' | 'ollama';
  tokens?: number;
  responseTime: number;
}

interface AIError {
  message: string;
  code?: string;
  model: 'gemini' | 'ollama';
}

class HybridAIService {
  private geminiAI?: GoogleGenerativeAI;
  private geminiModel?: any;
  private preferredModel: 'gemini' | 'ollama' | 'auto' = 'auto';

  constructor() {
    const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
    if (!apiKey) {
      console.warn('⚠️ Gemini API key not found');
    } else {
      this.geminiAI = new GoogleGenerativeAI(apiKey);
      this.geminiModel = this.geminiAI.getGenerativeModel({ 
        model: "gemini-2.0-flash-exp",
        generationConfig: {
          temperature: 0.7,
          topK: 40,
          topP: 0.95,
          maxOutputTokens: 8192,
        },
      });
    }
  }

  // Set preferred AI model
  setPreferredModel(model: 'gemini' | 'ollama' | 'auto'): void {
    this.preferredModel = model;
  }

  // Get available models
  async getAvailableModels(): Promise<{ gemini: boolean; ollama: boolean; ollamaModels: string[] }> {
    const ollamaAvailable = await ollamaService.checkAvailability();
    const ollamaModels = ollamaAvailable ? await ollamaService.getModels() : [];
    
    return {
      gemini: !!this.geminiModel,
      ollama: ollamaAvailable,
      ollamaModels
    };
  }

  // Smart model selection
  private async selectModel(forceModel?: 'gemini' | 'ollama'): Promise<'gemini' | 'ollama'> {
    if (forceModel) return forceModel;
    
    switch (this.preferredModel) {
      case 'gemini':
        return this.geminiModel ? 'gemini' : 'ollama';
      case 'ollama':
        return (await ollamaService.checkAvailability()) ? 'ollama' : 'gemini';
      case 'auto':
      default:
        // Auto-select based on availability and task type
        const ollamaAvailable = await ollamaService.checkAvailability();
        
        // Prefer Ollama for privacy-sensitive tasks, Gemini for complex reasoning
        if (ollamaAvailable && this.geminiModel) {
          // Use Ollama for local processing when available
          return 'ollama';
        } else if (this.geminiModel) {
          return 'gemini';
        } else if (ollamaAvailable) {
          return 'ollama';
        } else {
          throw new Error('No AI models available');
        }
    }
  }

  // Generate text response
  async generateText(prompt: string, forceModel?: 'gemini' | 'ollama'): Promise<AIResponse> {
    const startTime = Date.now();
    const selectedModel = await this.selectModel(forceModel);

    try {
      let text: string;
      
      if (selectedModel === 'gemini') {
        const result = await this.geminiModel.generateContent(prompt);
        text = result.response.text();
      } else {
        text = await ollamaService.generateResponse(prompt);
      }

      return {
        text,
        model: selectedModel,
        responseTime: Date.now() - startTime
      };
    } catch (error: any) {
      console.error(`Error with ${selectedModel}:`, error);
      
      // Fallback to the other model
      const fallbackModel = selectedModel === 'gemini' ? 'ollama' : 'gemini';
      
      try {
        let text: string;
        
        if (fallbackModel === 'gemini' && this.geminiModel) {
          const result = await this.geminiModel.generateContent(prompt);
          text = result.response.text();
        } else {
          text = await ollamaService.generateResponse(prompt);
        }

        console.log(`✅ Fallback to ${fallbackModel} successful`);
        
        return {
          text,
          model: fallbackModel,
          responseTime: Date.now() - startTime
        };
      } catch (fallbackError: any) {
        throw {
          message: `Both AI models failed. ${selectedModel}: ${error.message}, ${fallbackModel}: ${fallbackError.message}`,
          code: 'AI_SERVICES_UNAVAILABLE',
          model: selectedModel
        } as AIError;
      }
    }
  }

  // Generate streaming response
  async generateStreamingText(
    prompt: string,
    onChunk: (chunk: string, model: 'gemini' | 'ollama') => void,
    forceModel?: 'gemini' | 'ollama'
  ): Promise<void> {
    const selectedModel = await this.selectModel(forceModel);

    try {
      if (selectedModel === 'gemini') {
        const result = await this.geminiModel.generateContentStream(prompt);
        
        for await (const chunk of result.stream) {
          const chunkText = chunk.text();
          if (chunkText) {
            onChunk(chunkText, 'gemini');
          }
        }
      } else {
        await ollamaService.generateStreamingResponse(prompt, (chunk) => {
          onChunk(chunk, 'ollama');
        });
      }
    } catch (error: any) {
      console.error(`Streaming error with ${selectedModel}:`, error);
      throw {
        message: error.message,
        model: selectedModel
      } as AIError;
    }
  }

  // Educational features
  async generateQuiz(
    topic: string, 
    difficulty: 'easy' | 'medium' | 'hard' = 'medium',
    questionCount: number = 5
  ): Promise<any> {
    const prompt = `Create an educational quiz about "${topic}" with ${questionCount} multiple-choice questions at ${difficulty} difficulty level.

Format the response as valid JSON:
{
  "title": "Quiz about ${topic}",
  "topic": "${topic}",
  "difficulty": "${difficulty}",
  "questions": [
    {
      "question": "Question text here",
      "options": ["A) First option", "B) Second option", "C) Third option", "D) Fourth option"],
      "correct": 0,
      "explanation": "Detailed explanation of why this answer is correct"
    }
  ]
}

Requirements:
- Exactly ${questionCount} questions
- Educational and accurate content
- Clear, unambiguous questions
- Plausible distractors in wrong answers
- Helpful explanations`;

    try {
      const response = await this.generateText(prompt);
      
      // Extract JSON from response
      let jsonStr = response.text;
      
      // Try to find JSON in the response
      const jsonMatch = jsonStr.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        jsonStr = jsonMatch[0];
      }
      
      // Clean up common JSON formatting issues
      jsonStr = jsonStr
        .replace(/```json\n?/g, '')
        .replace(/```\n?/g, '')
        .replace(/^\s*|\s*$/g, '');
      
      const quiz = JSON.parse(jsonStr);
      
      // Validate quiz structure
      if (!quiz.questions || !Array.isArray(quiz.questions)) {
        throw new Error('Invalid quiz format');
      }
      
      return quiz;
    } catch (error: any) {
      console.error('Error generating quiz:', error);
      
      // Fallback: create a simple quiz structure
      return {
        title: `Quiz about ${topic}`,
        topic,
        difficulty,
        questions: [{
          question: `What is an important concept related to ${topic}?`,
          options: [
            "A) This is a generated fallback question",
            "B) Due to AI processing error",
            "C) Please try again",
            "D) Or contact support"
          ],
          correct: 0,
          explanation: "This is a fallback question due to an AI processing error. Please try generating the quiz again."
        }],
        error: true,
        originalError: error.message
      };
    }
  }

  // Analyze study materials
  async analyzeStudyMaterial(text: string, analysisType: 'summary' | 'key_points' | 'concepts' = 'summary'): Promise<AIResponse> {
    let prompt = '';
    
    switch (analysisType) {
      case 'summary':
        prompt = `Please provide a comprehensive summary of the following study material. Focus on the main ideas, key concepts, and important details:

${text}

Summary:`;
        break;
      case 'key_points':
        prompt = `Extract the key points from the following study material as a bullet list:

${text}

Key Points:`;
        break;
      case 'concepts':
        prompt = `Identify and explain the main concepts from the following study material:

${text}

Main Concepts:`;
        break;
    }

    return await this.generateText(prompt);
  }

  // Answer questions about uploaded content
  async answerQuestion(question: string, context: string): Promise<AIResponse> {
    const prompt = `Based on the following context, please answer the question accurately and completely. If the answer is not clearly available in the context, please say so.

Context:
${context}

Question: ${question}

Answer:`;

    return await this.generateText(prompt);
  }

  // Generate study recommendations
  async generateStudyRecommendations(
    subject: string,
    currentLevel: string,
    goals: string,
    timeAvailable: string
  ): Promise<AIResponse> {
    const prompt = `As an educational AI tutor, please create personalized study recommendations for a student with the following profile:

Subject: ${subject}
Current Level: ${currentLevel}
Goals: ${goals}
Time Available: ${timeAvailable}

Please provide:
1. Specific study plan with timeline
2. Recommended resources and materials
3. Key topics to focus on
4. Study techniques that would be most effective
5. Milestones and progress checkpoints

Study Recommendations:`;

    return await this.generateText(prompt);
  }

  // Check AI service health
  async healthCheck(): Promise<{
    gemini: { available: boolean; error?: string };
    ollama: { available: boolean; error?: string; models?: string[] };
  }> {
    const result = {
      gemini: { available: false, error: undefined as string | undefined },
      ollama: { available: false, error: undefined as string | undefined, models: undefined as string[] | undefined }
    };

    // Check Gemini
    try {
      if (this.geminiModel) {
        await this.geminiModel.generateContent('Test');
        result.gemini.available = true;
      } else {
        result.gemini.error = 'API key not configured';
      }
    } catch (error: any) {
      result.gemini.error = error.message;
    }

    // Check Ollama
    try {
      const available = await ollamaService.checkAvailability();
      result.ollama.available = available;
      if (available) {
        result.ollama.models = await ollamaService.getModels();
      } else {
        result.ollama.error = 'Server not available';
      }
    } catch (error: any) {
      result.ollama.error = error.message;
    }

    return result;
  }
}

export const hybridAIService = new HybridAIService();
export default hybridAIService;
