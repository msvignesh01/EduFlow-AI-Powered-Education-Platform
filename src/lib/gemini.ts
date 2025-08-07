
import { aiService } from './aiService';


export const generateContent = async (prompt: string): Promise<string> => {
  try {
    const response = await aiService.generateContent(prompt, {
      model: 'gemini-2.0-flash',
      priority: 'quality'
    });
    
    return response.content;
  } catch (error) {
    console.error('Gemini API Error:', error);
    throw new Error(error instanceof Error ? error.message : 'Failed to generate content with Gemini');
  }
};


export const generateContentWithFallback = async (prompt: string): Promise<{
  content: string;
  model: string;
  isOffline: boolean;
}> => {
  try {
    const response = await aiService.generateContent(prompt, {
      model: 'auto'
    });
    
    return {
      content: response.content,
      model: response.model,
      isOffline: response.isOffline
    };
  } catch (error) {
    console.error('AI Generation Error:', error);
    throw new Error(error instanceof Error ? error.message : 'Failed to generate content');
  }
};


export { aiService } from './aiService';
