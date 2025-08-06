// Ollama Service for Gemma 3 12B Local AI Model
interface OllamaResponse {
  model: string;
  created_at: string;
  response: string;
  done: boolean;
  context?: number[];
  total_duration?: number;
  load_duration?: number;
  prompt_eval_count?: number;
  prompt_eval_duration?: number;
  eval_count?: number;
  eval_duration?: number;
}

interface OllamaStreamResponse {
  model: string;
  created_at: string;
  response: string;
  done: boolean;
}

interface ChatMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

class OllamaService {
  private baseUrl: string;
  private model: string;
  private isAvailable: boolean = false;

  constructor() {
    this.baseUrl = import.meta.env.VITE_OLLAMA_ENDPOINT || 'http://localhost:11434';
    this.model = import.meta.env.VITE_OLLAMA_MODEL || 'gemma2:27b';
    this.checkAvailability();
  }

  // Check if Ollama server is available
  async checkAvailability(): Promise<boolean> {
    try {
      const response = await fetch(`${this.baseUrl}/api/tags`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      
      if (response.ok) {
        const data = await response.json();
        this.isAvailable = true;
        
        // Check if our model is available
        const modelExists = data.models?.some((m: any) => m.name === this.model);
        if (!modelExists) {
          console.warn(`⚠️ Model ${this.model} not found. Available models:`, data.models?.map((m: any) => m.name));
        }
        
        console.log('🦙 Ollama server is available');
        return true;
      }
      
      this.isAvailable = false;
      return false;
    } catch (error) {
      console.log('ℹ️ Ollama server not available:', error);
      this.isAvailable = false;
      return false;
    }
  }

  // Get available models
  async getModels(): Promise<string[]> {
    try {
      const response = await fetch(`${this.baseUrl}/api/tags`);
      if (response.ok) {
        const data = await response.json();
        return data.models?.map((m: any) => m.name) || [];
      }
      return [];
    } catch (error) {
      console.error('Error fetching models:', error);
      return [];
    }
  }

  // Generate response (non-streaming)
  async generateResponse(prompt: string, context?: number[]): Promise<string> {
    if (!this.isAvailable) {
      await this.checkAvailability();
      if (!this.isAvailable) {
        throw new Error('Ollama server is not available');
      }
    }

    try {
      const response = await fetch(`${this.baseUrl}/api/generate`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: this.model,
          prompt: prompt,
          context: context,
          stream: false,
          options: {
            temperature: 0.7,
            top_k: 40,
            top_p: 0.9,
            repeat_penalty: 1.1,
            num_ctx: 4096,
          }
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data: OllamaResponse = await response.json();
      return data.response;
    } catch (error) {
      console.error('Error generating response:', error);
      throw error;
    }
  }

  // Generate streaming response
  async generateStreamingResponse(
    prompt: string, 
    onChunk: (chunk: string) => void,
    context?: number[]
  ): Promise<void> {
    if (!this.isAvailable) {
      await this.checkAvailability();
      if (!this.isAvailable) {
        throw new Error('Ollama server is not available');
      }
    }

    try {
      const response = await fetch(`${this.baseUrl}/api/generate`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: this.model,
          prompt: prompt,
          context: context,
          stream: true,
          options: {
            temperature: 0.7,
            top_k: 40,
            top_p: 0.9,
            repeat_penalty: 1.1,
            num_ctx: 4096,
          }
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const reader = response.body?.getReader();
      if (!reader) {
        throw new Error('Failed to get response reader');
      }

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const chunk = new TextDecoder().decode(value);
        const lines = chunk.split('\n').filter(line => line.trim());

        for (const line of lines) {
          try {
            const data: OllamaStreamResponse = JSON.parse(line);
            if (data.response) {
              onChunk(data.response);
            }
            if (data.done) {
              return;
            }
          } catch (parseError) {
            console.warn('Failed to parse chunk:', line);
          }
        }
      }
    } catch (error) {
      console.error('Error generating streaming response:', error);
      throw error;
    }
  }

  // Chat with conversation context
  async chat(messages: ChatMessage[]): Promise<string> {
    // Convert messages to a single prompt for Gemma
    const conversationPrompt = this.formatChatPrompt(messages);
    return await this.generateResponse(conversationPrompt);
  }

  // Chat with streaming
  async chatStream(
    messages: ChatMessage[], 
    onChunk: (chunk: string) => void
  ): Promise<void> {
    const conversationPrompt = this.formatChatPrompt(messages);
    await this.generateStreamingResponse(conversationPrompt, onChunk);
  }

  // Format chat messages into a prompt
  private formatChatPrompt(messages: ChatMessage[]): string {
    let prompt = '';
    
    for (const message of messages) {
      switch (message.role) {
        case 'system':
          prompt += `System: ${message.content}\n\n`;
          break;
        case 'user':
          prompt += `User: ${message.content}\n\n`;
          break;
        case 'assistant':
          prompt += `Assistant: ${message.content}\n\n`;
          break;
      }
    }
    
    // Add final prompt for assistant response
    prompt += 'Assistant: ';
    return prompt;
  }

  // Educational content generation
  async generateQuiz(topic: string, difficulty: 'easy' | 'medium' | 'hard' = 'medium'): Promise<any> {
    const prompt = `Generate a ${difficulty} level quiz about ${topic}. 
Format as JSON with this structure:
{
  "title": "Quiz Title",
  "questions": [
    {
      "question": "Question text",
      "options": ["A) Option 1", "B) Option 2", "C) Option 3", "D) Option 4"],
      "correct": 0,
      "explanation": "Why this answer is correct"
    }
  ]
}

Generate 5 questions. Be educational and accurate.`;

    try {
      const response = await this.generateResponse(prompt);
      // Try to extract JSON from response
      const jsonMatch = response.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        return JSON.parse(jsonMatch[0]);
      }
      throw new Error('Failed to parse quiz JSON');
    } catch (error) {
      console.error('Error generating quiz:', error);
      throw error;
    }
  }

  // Study material summarization
  async summarizeText(text: string, length: 'short' | 'medium' | 'long' = 'medium'): Promise<string> {
    const lengthInstructions = {
      short: 'in 2-3 sentences',
      medium: 'in 1-2 paragraphs',
      long: 'in 3-4 paragraphs'
    };

    const prompt = `Please summarize the following text ${lengthInstructions[length]}. Focus on the key concepts and main ideas:

${text}

Summary:`;

    return await this.generateResponse(prompt);
  }

  // Educational explanation
  async explainConcept(concept: string, level: 'beginner' | 'intermediate' | 'advanced' = 'intermediate'): Promise<string> {
    const prompt = `Explain the concept of "${concept}" at a ${level} level. 
Provide a clear, educational explanation with examples if helpful. 
Make it engaging and easy to understand.

Explanation:`;

    return await this.generateResponse(prompt);
  }

  // Pull/download a model
  async pullModel(modelName: string, onProgress?: (progress: string) => void): Promise<void> {
    try {
      const response = await fetch(`${this.baseUrl}/api/pull`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: modelName,
          stream: true
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const reader = response.body?.getReader();
      if (!reader) {
        throw new Error('Failed to get response reader');
      }

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const chunk = new TextDecoder().decode(value);
        const lines = chunk.split('\n').filter(line => line.trim());

        for (const line of lines) {
          try {
            const data = JSON.parse(line);
            if (onProgress && data.status) {
              onProgress(data.status);
            }
          } catch (parseError) {
            console.warn('Failed to parse progress chunk:', line);
          }
        }
      }
    } catch (error) {
      console.error('Error pulling model:', error);
      throw error;
    }
  }

  // Get server info
  async getServerInfo(): Promise<any> {
    try {
      const response = await fetch(`${this.baseUrl}/api/version`);
      if (response.ok) {
        return await response.json();
      }
      return null;
    } catch (error) {
      console.error('Error getting server info:', error);
      return null;
    }
  }

  // Health check
  get isServerAvailable(): boolean {
    return this.isAvailable;
  }

  // Get current model
  get currentModel(): string {
    return this.model;
  }

  // Set model
  setModel(modelName: string): void {
    this.model = modelName;
  }
}

export const ollamaService = new OllamaService();
export default ollamaService;
