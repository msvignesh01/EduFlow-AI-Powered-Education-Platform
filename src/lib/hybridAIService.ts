// Premium Hybrid AI Service - Gemini 2.0 + Gemma 3 (API + Local)
import { GoogleGenerativeAI } from '@google/generative-ai';

// AI Model Types and Providers
export type AIModel = 'gemini-2.0-flash' | 'gemma-3-api' | 'gemma-3-local' | 'auto';
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

// Enhanced Hybrid AI Service Class
class HybridAIService {
  private geminiAI: GoogleGenerativeAI;
  private networkStatus: NetworkStatus;
  private config: AIConfig;
  private lastHealthCheck = 0;
  private healthCheckInterval = 30000; // 30 seconds

  constructor() {
    this.geminiAI = new GoogleGenerativeAI(import.meta.env.VITE_GEMINI_API_KEY);
    this.config = {
      preferredModel: 'auto',
      preferredProvider: 'auto',
      fallbackToOffline: true,
      fallbackToAlternateAPI: true,
      maxRetries: 3,
      timeout: 30000,
      ollamaEndpoint: 'http://localhost:11434'
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

  private async initializeService(): Promise<void> {
    // Set up network status monitoring
    window.addEventListener('online', () => {
      this.networkStatus.isOnline = true;
      this.checkServiceHealth();
    });
    
    window.addEventListener('offline', () => {
      this.networkStatus.isOnline = false;
    });

    // Initial health check
    await this.checkServiceHealth();
  }

  // Health Check for All AI Services
  private async checkServiceHealth(): Promise<void> {
    const now = Date.now();
    if (now - this.lastHealthCheck < this.healthCheckInterval) {
      return; // Skip if checked recently
    }

    this.lastHealthCheck = now;
    this.networkStatus.lastChecked = now;

    try {
      // Check Gemini availability
      this.networkStatus.isGeminiAvailable = await this.checkGeminiHealth();
      
      // Check Gemma API availability  
      this.networkStatus.isGemmaAPIAvailable = await this.checkGemmaAPIHealth();
      
      // Check Ollama availability
      this.networkStatus.isOllamaAvailable = await this.checkOllamaHealth();
      
      console.log('🔍 AI Services Health Check:', this.networkStatus);
    } catch (error) {
      console.warn('❌ Health check failed:', error);
    }
  }

  private async checkGeminiHealth(): Promise<boolean> {
    try {
      const model = this.geminiAI.getGenerativeModel({ 
        model: 'gemini-2.0-flash-exp' 
      });
      await model.generateContent('Health check');
      return true;
    } catch {
      return false;
    }
  }

  private async checkGemmaAPIHealth(): Promise<boolean> {
    try {
      const response = await fetch('https://generativelanguage.googleapis.com/v1beta/models', {
        headers: {
          'Authorization': `Bearer ${import.meta.env.VITE_GEMINI_API_KEY}`
        },
        signal: AbortSignal.timeout(5000)
      });
      return response.ok;
    } catch {
      return false;
    }
  }

  private async checkOllamaHealth(): Promise<boolean> {
    try {
      const response = await fetch(`${this.config.ollamaEndpoint}/api/tags`, {
        signal: AbortSignal.timeout(3000)
      });
      return response.ok;
    } catch {
      return false;
    }
  }

  // Smart Model Selection
  private selectBestModel(): { model: AIModel; provider: AIProvider } {
    // If user specified a preference and it's available
    if (this.config.preferredModel !== 'auto') {
      const isAvailable = this.isModelAvailable(this.config.preferredModel);
      if (isAvailable) {
        return {
          model: this.config.preferredModel,
          provider: this.getProviderForModel(this.config.preferredModel)
        };
      }
    }

    // Auto-selection based on availability and performance
    if (this.networkStatus.isGeminiAvailable) {
      return { model: 'gemini-2.0-flash', provider: 'google-gemini' };
    }
    
    if (this.networkStatus.isGemmaAPIAvailable) {
      return { model: 'gemma-3-api', provider: 'google-gemma' };
    }
    
    if (this.networkStatus.isOllamaAvailable) {
      return { model: 'gemma-3-local', provider: 'ollama' };
    }

    // Fallback to any available option
    throw new Error('No AI services available');
  }

  private isModelAvailable(model: AIModel): boolean {
    switch (model) {
      case 'gemini-2.0-flash':
        return this.networkStatus.isGeminiAvailable;
      case 'gemma-3-api':
        return this.networkStatus.isGemmaAPIAvailable;
      case 'gemma-3-local':
        return this.networkStatus.isOllamaAvailable;
      default:
        return false;
    }
  }

  private getProviderForModel(model: AIModel): AIProvider {
    switch (model) {
      case 'gemini-2.0-flash':
        return 'google-gemini';
      case 'gemma-3-api':
        return 'google-gemma';
      case 'gemma-3-local':
        return 'ollama';
      default:
        return 'auto';
    }
  }

  // Generate Content with Intelligent Routing
  public async generateContent(
    prompt: string,
    options: Partial<AIConfig> = {}
  ): Promise<AIResponse> {
    const startTime = Date.now();
    const config = { ...this.config, ...options };

    // Health check if needed
    await this.checkServiceHealth();

    try {
      const { model, provider } = this.selectBestModel();
      console.log(`🤖 Using ${model} via ${provider}`);

      let content: string;
      let isOffline = false;

      switch (provider) {
        case 'google-gemini':
          content = await this.generateWithGemini(prompt);
          break;
        case 'google-gemma':
          content = await this.generateWithGemmaAPI(prompt);
          break;
        case 'ollama':
          content = await this.generateWithOllama(prompt);
          isOffline = true;
          break;
        default:
          throw new Error('No provider available');
      }

      const processingTime = Date.now() - startTime;

      return {
        content,
        model,
        provider,
        isOffline,
        processingTime,
        confidence: this.calculateConfidence(provider, processingTime)
      };

    } catch (error) {
      console.error('❌ AI Generation failed:', error);
      
      // Try fallback if enabled
      if (config.fallbackToOffline && this.networkStatus.isOllamaAvailable) {
        return this.generateWithFallback(prompt, startTime);
      }
      
      throw error;
    }
  }

  private async generateWithGemini(prompt: string): Promise<string> {
    const model = this.geminiAI.getGenerativeModel({
      model: 'gemini-2.0-flash-exp',
      generationConfig: {
        temperature: 0.7,
        topP: 0.8,
        topK: 40,
        maxOutputTokens: 4096,
      },
    });

    const result = await model.generateContent(prompt);
    const response = await result.response;
    return response.text();
  }

  private async generateWithGemmaAPI(prompt: string): Promise<string> {
    const response = await fetch('https://generativelanguage.googleapis.com/v1beta/models/gemma-2-2b-it:generateContent', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${import.meta.env.VITE_GEMINI_API_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        contents: [{
          parts: [{ text: prompt }]
        }],
        generationConfig: {
          temperature: 0.7,
          topP: 0.8,
          topK: 40,
          maxOutputTokens: 2048
        }
      }),
      signal: AbortSignal.timeout(this.config.timeout)
    });

    if (!response.ok) {
      throw new Error(`Gemma API error: ${response.status}`);
    }

    const data = await response.json();
    return data.candidates[0]?.content?.parts[0]?.text || 'No response generated';
  }

  private async generateWithOllama(prompt: string): Promise<string> {
    const response = await fetch(`${this.config.ollamaEndpoint}/api/generate`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: 'gemma2:3b', // or gemma2:7b for better quality
        prompt: prompt,
        stream: false,
        options: {
          temperature: 0.7,
          top_p: 0.8,
          top_k: 40
        }
      }),
      signal: AbortSignal.timeout(this.config.timeout)
    });

    if (!response.ok) {
      throw new Error(`Ollama error: ${response.status}`);
    }

    const data = await response.json();
    return data.response || 'No response generated';
  }

  private async generateWithFallback(prompt: string, startTime: number): Promise<AIResponse> {
    console.log('🔄 Attempting fallback to local model...');
    
    try {
      const content = await this.generateWithOllama(prompt);
      const processingTime = Date.now() - startTime;

      return {
        content,
        model: 'gemma-3-local',
        provider: 'ollama',
        isOffline: true,
        processingTime,
        confidence: 0.8 // Lower confidence for fallback
      };
    } catch (error) {
      console.error('❌ Fallback also failed:', error);
      throw new Error('All AI services unavailable');
    }
  }

  private calculateConfidence(provider: AIProvider, processingTime: number): number {
    // Base confidence by provider
    let confidence = 0.9;
    switch (provider) {
      case 'google-gemini':
        confidence = 0.95;
        break;
      case 'google-gemma':
        confidence = 0.9;
        break;
      case 'ollama':
        confidence = 0.85;
        break;
    }

    // Adjust for processing time (faster = higher confidence)
    if (processingTime < 2000) confidence += 0.05;
    else if (processingTime > 10000) confidence -= 0.1;

    return Math.max(0.5, Math.min(1.0, confidence));
  }

  // Configuration Methods
  public updateConfig(newConfig: Partial<AIConfig>): void {
    this.config = { ...this.config, ...newConfig };
    console.log('🔧 AI Config updated:', this.config);
  }

  public getStatus(): NetworkStatus {
    return { ...this.networkStatus };
  }

  public async forceHealthCheck(): Promise<NetworkStatus> {
    this.lastHealthCheck = 0; // Reset to force check
    await this.checkServiceHealth();
    return this.getStatus();
  }

  // Stream Generation (for real-time responses)
  public async *generateStream(prompt: string): AsyncGenerator<string, void, unknown> {
    // Implementation for streaming responses
    // This would be used for real-time chat experiences
    const response = await this.generateContent(prompt);
    
    // Simulate streaming by yielding chunks
    const words = response.content.split(' ');
    for (let i = 0; i < words.length; i++) {
      yield words.slice(0, i + 1).join(' ');
      await new Promise(resolve => setTimeout(resolve, 50)); // Simulate delay
    }
  }
}

// Export singleton instance
export const hybridAI = new HybridAIService();
export default hybridAI;
