// React Hook for Hybrid AI Service
import { useState, useEffect, useCallback } from 'react';
import { hybridAI, AIResponse, NetworkStatus, AIModel, AIProvider } from '../lib/hybridAIService';

export interface UseHybridAIOptions {
  preferredModel?: AIModel;
  preferredProvider?: AIProvider;
  autoHealthCheck?: boolean;
  enableStreaming?: boolean;
}

export interface UseHybridAIReturn {
  // State
  isLoading: boolean;
  error: string | null;
  response: AIResponse | null;
  networkStatus: NetworkStatus;
  
  // Actions
  generateContent: (prompt: string) => Promise<AIResponse>;
  generateStream: (prompt: string) => AsyncGenerator<string, void, unknown>;
  clearResponse: () => void;
  refreshStatus: () => Promise<NetworkStatus>;
  
  // Configuration
  updateConfig: (config: any) => void;
  
  // Convenience
  isOnline: boolean;
  hasAnyAI: boolean;
  bestAvailableModel: string;
}

export const useHybridAI = (options: UseHybridAIOptions = {}): UseHybridAIReturn => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [response, setResponse] = useState<AIResponse | null>(null);
  const [networkStatus, setNetworkStatus] = useState<NetworkStatus>({
    isOnline: navigator.onLine,
    isGeminiAvailable: false,
    isGemmaAPIAvailable: false,
    isOllamaAvailable: false,
    lastChecked: 0
  });

  // Initialize and setup
  useEffect(() => {
    const initializeAI = async () => {
      try {
        // Apply user preferences
        if (options.preferredModel || options.preferredProvider) {
          hybridAI.updateConfig({
            preferredModel: options.preferredModel || 'auto',
            preferredProvider: options.preferredProvider || 'auto'
          });
        }

        // Initial status check
        const status = await hybridAI.forceHealthCheck();
        setNetworkStatus(status);
      } catch (err) {
        setError('Failed to initialize AI service');
        console.error('AI initialization error:', err);
      }
    };

    initializeAI();

    // Auto health check if enabled
    let interval: NodeJS.Timeout | null = null;
    if (options.autoHealthCheck !== false) {
      interval = setInterval(async () => {
        try {
          const status = hybridAI.getStatus();
          setNetworkStatus(status);
        } catch (err) {
          console.warn('Auto health check failed:', err);
        }
      }, 30000); // Check every 30 seconds
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [options.preferredModel, options.preferredProvider, options.autoHealthCheck]);

  // Generate content
  const generateContent = useCallback(async (prompt: string, forceMode: boolean = false): Promise<AIResponse> => {
    if (!prompt.trim()) {
      throw new Error('Prompt cannot be empty');
    }

    setIsLoading(true);
    setError(null);

    try {
      const result = await hybridAI.generateContent(prompt, {}, forceMode);
      setResponse(result);
      
      // Update network status after successful call
      const status = hybridAI.getStatus();
      setNetworkStatus(status);
      
      return result;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'AI generation failed';
      console.error('🚨 AI Generation Error:', errorMessage);
      
      // Try with force mode if regular mode failed
      if (!forceMode && errorMessage.includes('No AI services available')) {
        console.warn('⚠️ Retrying with force mode...');
        try {
          const retryResult = await hybridAI.generateContent(prompt, {}, true);
          setResponse(retryResult);
          return retryResult;
        } catch (retryErr) {
          console.error('🚨 Force mode also failed:', retryErr);
        }
      }
      
      setError(errorMessage);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Generate streaming content
  const generateStream = useCallback(async function* (prompt: string): AsyncGenerator<string, void, unknown> {
    if (!prompt.trim()) {
      throw new Error('Prompt cannot be empty');
    }

    setIsLoading(true);
    setError(null);

    try {
      const generator = hybridAI.generateStream(prompt);
      for await (const chunk of generator) {
        yield chunk;
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'AI streaming failed';
      setError(errorMessage);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Clear current response
  const clearResponse = useCallback(() => {
    setResponse(null);
    setError(null);
  }, []);

  // Refresh network status
  const refreshStatus = useCallback(async (): Promise<NetworkStatus> => {
    try {
      const status = await hybridAI.forceHealthCheck();
      setNetworkStatus(status);
      return status;
    } catch (err) {
      setError('Failed to refresh status');
      throw err;
    }
  }, []);

  // Update AI configuration
  const updateConfig = useCallback((config: any) => {
    hybridAI.updateConfig(config);
  }, []);

  // Computed values
  const isOnline = networkStatus.isOnline;
  const hasAnyAI = networkStatus.isGeminiAvailable || 
                   networkStatus.isGemmaAPIAvailable || 
                   networkStatus.isOllamaAvailable;
  
  const bestAvailableModel = networkStatus.isGeminiAvailable ? 'Gemini 2.0 Flash' :
                            networkStatus.isGemmaAPIAvailable ? 'Gemma 3 API' :
                            networkStatus.isOllamaAvailable ? 'Gemma 3 Local' :
                            'None Available';

  return {
    // State
    isLoading,
    error,
    response,
    networkStatus,
    
    // Actions
    generateContent,
    generateStream,
    clearResponse,
    refreshStatus,
    
    // Configuration
    updateConfig,
    
    // Convenience
    isOnline,
    hasAnyAI,
    bestAvailableModel
  };
};

// Convenience hooks for specific models
export const useGemini = () => useHybridAI({ 
  preferredModel: 'gemini-2.0-flash',
  preferredProvider: 'google-gemini' 
});

export const useGemmaAPI = () => useHybridAI({ 
  preferredModel: 'gemma-3-api',
  preferredProvider: 'google-gemma' 
});

export const useGemmaLocal = () => useHybridAI({ 
  preferredModel: 'gemma-3-local',
  preferredProvider: 'ollama' 
});

export default useHybridAI;
