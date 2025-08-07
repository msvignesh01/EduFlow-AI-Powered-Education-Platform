
import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Send, 
  Bot, 
  User, 
  Wifi, 
  WifiOff, 
  Brain, 
  Zap,
  RefreshCw,
  Settings
} from 'lucide-react';
import { useHybridAI } from '../../hooks/useHybridAI';
import { AIServiceStatus } from '../ai/AIServiceStatus';
import { AIResponse } from '../../lib/hybridAIService';

interface Message {
  id: string;
  content: string;
  isUser: boolean;
  timestamp: Date;
  aiResponse?: AIResponse;
}

interface HybridAIChatProps {
  placeholder?: string;
  showStatus?: boolean;
  enableStreaming?: boolean;
  className?: string;
}

export const HybridAIChat = ({
  placeholder = "Ask me anything... I work online and offline!",
  showStatus = true,
  enableStreaming = true,
  className = ""
}: HybridAIChatProps) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [streamingContent, setStreamingContent] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const {
    generateContent,
    generateStream,
    isLoading,
    error,
    networkStatus,
    isOnline,
    hasAnyAI,
    bestAvailableModel
  } = useHybridAI({ autoHealthCheck: true });


  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, streamingContent]);


  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const addMessage = (content: string, isUser: boolean, aiResponse?: AIResponse): Message => {
    const message: Message = {
      id: Date.now().toString(),
      content,
      isUser,
      timestamp: new Date(),
      aiResponse
    };
    setMessages(prev => [...prev, message]);
    return message;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputValue.trim() || isLoading || !hasAnyAI) return;

    const userMessage = inputValue.trim();
    setInputValue('');
    

    addMessage(userMessage, true);

    try {
      if (enableStreaming) {

        setStreamingContent('');
        const generator = generateStream(userMessage);
        let fullContent = '';
        
        for await (const chunk of generator) {
          fullContent = chunk;
          setStreamingContent(chunk);
        }
        
        setStreamingContent('');
        

        const response = await generateContent(userMessage);
        addMessage(fullContent || response.content, false, response);
      } else {

        const response = await generateContent(userMessage);
        addMessage(response.content, false, response);
      }
    } catch (err) {
      console.error('Chat error:', err);
      addMessage(
        'Sorry, I encountered an error. Please try again or check your connection.',
        false
      );
    }
  };

  const getModelIcon = (model?: string) => {
    if (!model) return <Bot className="w-4 h-4" />;
    if (model.includes('gemini')) return <Zap className="w-4 h-4 text-blue-500" />;
    if (model.includes('gemma')) return <Brain className="w-4 h-4 text-green-500" />;
    return <Bot className="w-4 h-4" />;
  };

  const getModelBadge = (aiResponse?: AIResponse) => {
    if (!aiResponse) return null;
    
    const isOffline = aiResponse.isOffline;
    const model = aiResponse.model;
    const processingTime = Math.round(aiResponse.processingTime);
    
    return (
      <div className="flex items-center space-x-2 mt-2">
        <div className={`flex items-center space-x-1 px-2 py-1 rounded-full text-xs ${
          isOffline 
            ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300'
            : 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300'
        }`}>
          {getModelIcon(model)}
          <span>{aiResponse.provider}</span>
          {isOffline && <WifiOff className="w-3 h-3" />}
          {!isOffline && <Wifi className="w-3 h-3" />}
        </div>
        
        <div className="text-xs text-gray-500">
          {processingTime}ms
        </div>
        
        {aiResponse.confidence && (
          <div className="text-xs text-gray-500">
            {Math.round(aiResponse.confidence * 100)}% confidence
          </div>
        )}
      </div>
    );
  };

  return (
    <div className={`flex flex-col h-full bg-white/5 dark:bg-black/5 rounded-xl border border-white/20 dark:border-white/10 ${className}`}>
      {
}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        <AnimatePresence>
          {messages.map((message) => (
            <motion.div
              key={message.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className={`flex ${message.isUser ? 'justify-end' : 'justify-start'}`}
            >
              <div className={`max-w-[80%] rounded-xl p-3 ${
                message.isUser
                  ? 'bg-primary-500 text-white'
                  : 'bg-white/10 dark:bg-black/10 backdrop-blur-md'
              }`}>
                <div className="flex items-start space-x-2">
                  {!message.isUser && (
                    <div className="mt-1">
                      {getModelIcon(message.aiResponse?.model)}
                    </div>
                  )}
                  <div className="flex-1">
                    <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                    {!message.isUser && getModelBadge(message.aiResponse)}
                  </div>
                  {message.isUser && (
                    <User className="w-4 h-4 mt-1 text-white" />
                  )}
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>

        {
}
        {isLoading && !streamingContent && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex justify-start"
          >
            <div className="rounded-xl p-3 bg-white/10 dark:bg-black/10 backdrop-blur-md">
              <div className="flex items-center space-x-2">
                <RefreshCw className="w-4 h-4 animate-spin" />
                <span className="text-sm text-gray-600 dark:text-gray-400">
                  Thinking with {bestAvailableModel}...
                </span>
              </div>
            </div>
          </motion.div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {
}
      <form onSubmit={handleSubmit} className="p-4 border-t border-white/10">
        <div className="flex items-center space-x-2">
          <div className="flex-1 relative">
            <input
              ref={inputRef}
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder={hasAnyAI ? placeholder : "No AI services available"}
              disabled={isLoading || !hasAnyAI}
              className="w-full px-4 py-3 bg-white/10 dark:bg-black/10 border border-white/20 dark:border-white/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500/50 disabled:opacity-50"
            />
            
            {
}
        <div className="flex items-center justify-between mt-2 text-xs text-gray-600 dark:text-gray-400">
          <span>
            {hasAnyAI ? `Ready with ${bestAvailableModel}` : 'No AI available'}
          </span>
          <span>
            {messages.length} message{messages.length !== 1 ? 's' : ''}
          </span>
        </div>
      </form>
    </div>
  );
};

export default HybridAIChat;
