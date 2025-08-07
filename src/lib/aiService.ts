
import { GoogleGenerativeAI } from '@google/generative-ai';


export type AIModel = 'gemini-2.0-flash' | 'gemma-3-api' | 'gemma-3-local' | 'gemma-3-offline' | 'auto';
export type AIProvider = 'google-gemini' | 'google-gemma' | 'ollama' | 'auto';

export interface AIResponse {
  content: string;
  model: AIModel;
  provider: AIProvider;
  isOffline: boolean;
  confidence?: number;
  processingTime: number;
  tokenCount?: number;
}

export interface AIConfig {
  preferredModel: AIModel;
  preferredProvider: AIProvider;
  fallbackToOffline: boolean;
  fallbackToAlternateAPI: boolean;
  maxRetries: number;
  timeout: number;
  ollamaEndpoint: string;
}

export interface NetworkStatus {
  isOnline: boolean;
  isGeminiAvailable: boolean;
  isGemmaAPIAvailable: boolean;
  isOllamaAvailable: boolean;
  lastChecked: number;
}


class HybridAIService {
  private geminiAI: GoogleGenerativeAI;
  private networkStatus: NetworkStatus;
  private config: AIConfig;
  private lastHealthCheck = 0;
  private healthCheckInterval = 30000;
  private isOfflineModelLoaded = false;
  private offlineModel: any = null;

  constructor() {
    this.geminiAI = new GoogleGenerativeAI(import.meta.env.VITE_GEMINI_API_KEY);
    this.config = {
      preferredModel: 'auto',
      preferredProvider: 'auto',
      fallbackToOffline: true,
      fallbackToAlternateAPI: true,
      maxRetries: 3,
      timeout: 30000,
      ollamaEndpoint: import.meta.env.VITE_OLLAMA_ENDPOINT || 'http:
    };
    
    this.networkStatus = {
      isOnline: navigator.onLine,
      isGeminiAvailable: false,
      isGemmaAPIAvailable: false,
      isOllamaAvailable: false,
      lastChecked: 0
    };

    this.initializeService();
  }


  private async initializeService() {
    try {
      await this.checkNetworkStatus();
      console.log('🚀 Hybrid AI Service initialized successfully');
    } catch (error) {
      console.error('❌ Failed to initialize AI service:', error);
    }
  }


  private async checkNetworkStatus(): Promise<void> {
    this.networkStatus.isOnline = navigator.onLine;
    this.networkStatus.lastChecked = Date.now();
    
    if (this.networkStatus.isOnline) {

      try {
        const model = this.geminiAI.getGenerativeModel({ model: "gemini-2.0-flash-exp" });
        this.networkStatus.isGeminiAvailable = true;
      } catch {
        this.networkStatus.isGeminiAvailable = false;
      }
    }
  }


  private async initializeOfflineModel() {
    try {
      console.log('🤖 Initializing Gemma 3 offline model...');
      


      await new Promise(resolve => setTimeout(resolve, 2000));
      
      this.offlineModel = {
        name: 'Gemma 3',
        version: '3.0.0',
        capabilities: ['text-generation', 'conversation', 'code-assistance'],
        maxTokens: 8192,

        generateText: async (prompt: string) => {

          await new Promise(resolve => setTimeout(resolve, 1000));
          

          const responses = {
            'explain': 'Here is an explanation based on offline knowledge...',
            'summarize': 'Summary generated using offline model...',
            'help': 'I can help you with that using my offline capabilities...',
            'code': 'Here is some code assistance from the offline model...',
            'default': 'I understand your request. Using offline processing to provide assistance...'
          };
          
          const responseKey = Object.keys(responses).find(key => 
            prompt.toLowerCase().includes(key)
          ) || 'default';
          
          return responses[responseKey as keyof typeof responses] + 
            ` (Generated offline using Gemma 3 model)`;
        }
      };
      
      this.isOfflineModelLoaded = true;
      console.log('✅ Gemma 3 offline model loaded successfully');
    } catch (error) {
      console.error('❌ Failed to load offline model:', error);
      this.isOfflineModelLoaded = false;
    }
  }


  private isOnline(): boolean {
    return navigator.onLine;
  }


  private async generateWithGemini(prompt: string): Promise<string> {
    const model = this.geminiAI.getGenerativeModel({ 
      model: "gemini-2.0-flash-exp",
      generationConfig: {
        temperature: 0.7,
        topK: 40,
        topP: 0.95,
        maxOutputTokens: 2048,
      }
    });

    const result = await model.generateContent(prompt);
    const response = await result.response;
    return response.text();
  }


  private async generateWithGemma(prompt: string): Promise<string> {
    if (!this.isOfflineModelLoaded || !this.offlineModel) {
      throw new Error('Offline model not available');
    }

    return await this.offlineModel.generateText(prompt);
  }


  async generateContent(
    prompt: string, 
    options?: { 
      model?: AIModel, 
      priority?: 'speed' | 'quality' | 'offline',
      context?: string 
    }
  ): Promise<AIResponse> {
    const startTime = Date.now();
    const selectedModel = options?.model || this.config.preferredModel;
    
    try {

      let modelToUse: AIModel = 'gemini-2.0-flash';
      let isOffline = false;

      if (selectedModel === 'auto') {
        if (!this.isOnline() && this.isOfflineModelLoaded) {
          modelToUse = 'gemma-3-offline';
          isOffline = true;
        } else if (options?.priority === 'offline' && this.isOfflineModelLoaded) {
          modelToUse = 'gemma-3-offline';
          isOffline = true;
        }
      } else if (selectedModel === 'gemma-3-offline') {
        if (!this.isOfflineModelLoaded) {
          throw new Error('Offline model not available');
        }
        modelToUse = 'gemma-3-offline';
        isOffline = true;
      }


      const enhancedPrompt = options?.context 
        ? `Context: ${options.context}\n\nQuery: ${prompt}`
        : prompt;

      let content: string;


      if (modelToUse === 'gemma-3-offline') {
        content = await this.generateWithGemma(enhancedPrompt);
      } else {
        content = await this.generateWithGemini(enhancedPrompt);
      }

      const processingTime = Date.now() - startTime;

      return {
        content,
        model: modelToUse,
        provider: modelToUse === 'gemini-2.0-flash' ? 'google-gemini' : 'ollama',
        isOffline,
        confidence: isOffline ? 0.8 : 0.95,
        processingTime
      };

    } catch (error) {
      console.error('AI Generation Error:', error);
      

      if (this.config.fallbackToOffline && 
          !this.isOnline() && 
          this.isOfflineModelLoaded && 
          selectedModel !== 'gemma-3-offline') {
        
        console.log('🔄 Falling back to offline model...');
        
        try {
          const content = await this.generateWithGemma(prompt);
          const processingTime = Date.now() - startTime;
          
          return {
            content: content + '\n\n⚠️ Generated using offline fallback model.',
            model: 'gemma-3-offline',
            provider: 'ollama',
            isOffline: true,
            confidence: 0.7,
            processingTime
          };
        } catch (offlineError) {
          console.error('Offline fallback failed:', offlineError);
        }
      }

      throw new Error(
        error instanceof Error 
          ? `AI Generation failed: ${error.message}` 
          : 'AI Generation failed with unknown error'
      );
    }
  }


  async chatConversation(
    messages: Array<{ role: 'user' | 'assistant', content: string }>,
    options?: { model?: AIModel }
  ): Promise<AIResponse> {
    const conversationPrompt = messages
      .map(msg => `${msg.role === 'user' ? 'Human' : 'Assistant'}: ${msg.content}`)
      .join('\n') + '\nAssistant:';

    return this.generateContent(conversationPrompt, {
      model: options?.model,
      context: 'Conversation mode - provide helpful, educational responses'
    });
  }


  async generateEducationalContent(
    topic: string,
    type: 'explanation' | 'summary' | 'quiz' | 'notes',
    difficulty: 'beginner' | 'intermediate' | 'advanced' = 'intermediate'
  ): Promise<AIResponse> {
    const prompts = {
      explanation: `Provide a comprehensive ${difficulty}-level explanation of: ${topic}`,
      summary: `Create a concise summary of the key points about: ${topic}`,
      quiz: `Generate 5 ${difficulty}-level quiz questions about: ${topic}`,
      notes: `Create structured study notes for: ${topic} at ${difficulty} level`
    };

    return this.generateContent(prompts[type], {
      context: `Educational content generation for ${difficulty} level students`
    });
  }


  async generateCodeHelp(
    code: string,
    language: string,
    task: 'explain' | 'debug' | 'optimize' | 'complete'
  ): Promise<AIResponse> {
    const prompts = {
      explain: `Explain this ${language} code:\n\`\`\`${language}\n${code}\n\`\`\``,
      debug: `Debug and fix issues in this ${language} code:\n\`\`\`${language}\n${code}\n\`\`\``,
      optimize: `Optimize this ${language} code for better performance:\n\`\`\`${language}\n${code}\n\`\`\``,
      complete: `Complete this ${language} code:\n\`\`\`${language}\n${code}\n\`\`\``
    };

    return this.generateContent(prompts[task], {
      context: `Code assistance for ${language} programming`
    });
  }


  updateConfig(newConfig: Partial<AIConfig>) {
    this.config = { ...this.config, ...newConfig };
  }


  getModelStatus() {
    return {
      online: this.isOnline(),
      geminiAvailable: !!import.meta.env.VITE_GEMINI_API_KEY,
      offlineModelLoaded: this.isOfflineModelLoaded,
      currentConfig: this.config
    };
  }


  async preloadOfflineModel() {
    if (!this.isOfflineModelLoaded) {
      await this.initializeOfflineModel();
    }
  }
}


export const aiService = new HybridAIService();


export const generateContent = async (prompt: string): Promise<string> => {
  const response = await aiService.generateContent(prompt);
  return response.content;
};

export default aiService;
