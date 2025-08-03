// Premium Offline-First Chat Component with Dual AI Support
import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Send, 
  Bot, 
  User, 
  Wifi, 
  WifiOff, 
  Brain, 
  Zap,
  Download,
  Settings,
  MessageSquare,
  Clock,
  CheckCircle,
  AlertCircle
} from 'lucide-react';
import { Button } from '../ui/Button';
import { Card } from '../ui/Card';
import { aiService, AIResponse } from '../../lib/aiService';
import { storageService } from '../../lib/storageService';
import { cn } from '../../utils/cn';

interface Message {
  id: string;
  content: string;
  role: 'user' | 'assistant';
  timestamp: number;
  model?: string;
  isOffline?: boolean;
  status: 'sending' | 'sent' | 'error';
}

interface ChatSession {
  id: string;
  title: string;
  messages: Message[];
  createdAt: number;
  updatedAt: number;
}

export const PremiumAIChat: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [currentSession, setCurrentSession] = useState<ChatSession | null>(null);
  const [preferredModel, setPreferredModel] = useState<'auto' | 'gemini-2.0-flash' | 'gemma-3-offline'>('auto');
  const [showSettings, setShowSettings] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  // Monitor online/offline status
  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);
    
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  // Auto-scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Load saved session on mount
  useEffect(() => {
    loadLastSession();
  }, []);

  // Save session when messages change
  useEffect(() => {
    if (messages.length > 0 && currentSession) {
      saveCurrentSession();
    }
  }, [messages, currentSession]);

  const loadLastSession = async () => {
    try {
      const lastSession = await storageService.getItem<ChatSession>('last_chat_session');
      if (lastSession) {
        setCurrentSession(lastSession);
        setMessages(lastSession.messages);
      } else {
        createNewSession();
      }
    } catch (error) {
      console.error('Failed to load session:', error);
      createNewSession();
    }
  };

  const createNewSession = () => {
    const newSession: ChatSession = {
      id: `session_${Date.now()}`,
      title: 'New Chat Session',
      messages: [],
      createdAt: Date.now(),
      updatedAt: Date.now()
    };
    setCurrentSession(newSession);
    setMessages([]);
  };

  const saveCurrentSession = async () => {
    if (!currentSession) return;

    const updatedSession: ChatSession = {
      ...currentSession,
      messages,
      updatedAt: Date.now(),
      title: messages.length > 0 ? 
        messages[0].content.substring(0, 50) + (messages[0].content.length > 50 ? '...' : '') :
        'New Chat Session'
    };

    await storageService.setItem('last_chat_session', updatedSession);
    setCurrentSession(updatedSession);
  };

  const sendMessage = async () => {
    if (!inputValue.trim() || isLoading) return;

    const userMessage: Message = {
      id: `msg_${Date.now()}_user`,
      content: inputValue.trim(),
      role: 'user',
      timestamp: Date.now(),
      status: 'sent'
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsLoading(true);

    // Create pending assistant message
    const assistantMessageId = `msg_${Date.now()}_assistant`;
    const pendingMessage: Message = {
      id: assistantMessageId,
      content: '',
      role: 'assistant',
      timestamp: Date.now(),
      status: 'sending'
    };

    setMessages(prev => [...prev, pendingMessage]);

    try {
      // Check cache first
      const cachedResponse = await storageService.getCachedAIResponse(
        userMessage.content, 
        preferredModel
      );

      let aiResponse: AIResponse;

      if (cachedResponse && isOnline) {
        // Use cached response but still mark as sent
        aiResponse = {
          content: cachedResponse,
          model: preferredModel === 'auto' ? 'gemini-2.0-flash' : preferredModel,
          isOffline: false,
          processingTime: 50
        };
      } else {
        // Generate new response
        aiResponse = await aiService.generateContent(userMessage.content, {
          model: preferredModel,
          priority: isOnline ? 'quality' : 'offline'
        });

        // Cache the response
        await storageService.cacheAIResponse(
          userMessage.content,
          aiResponse.content,
          aiResponse.model
        );
      }

      // Update the pending message
      setMessages(prev => prev.map(msg => 
        msg.id === assistantMessageId ? {
          ...msg,
          content: aiResponse.content,
          model: aiResponse.model,
          isOffline: aiResponse.isOffline,
          status: 'sent' as const
        } : msg
      ));

    } catch (error) {
      console.error('AI Response error:', error);
      
      // Update message with error status
      setMessages(prev => prev.map(msg => 
        msg.id === assistantMessageId ? {
          ...msg,
          content: 'Sorry, I encountered an error processing your request. Please try again.',
          status: 'error' as const
        } : msg
      ));
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const clearChat = () => {
    setMessages([]);
    createNewSession();
  };

  const exportChat = async () => {
    if (!currentSession) return;

    const exportData = {
      session: currentSession,
      exportDate: new Date().toISOString(),
      version: '1.0.0'
    };

    const blob = new Blob([JSON.stringify(exportData, null, 2)], {
      type: 'application/json'
    });

    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `chat_session_${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const getModelIcon = (model?: string, isOffline?: boolean) => {
    if (isOffline || model === 'gemma-3-offline') {
      return <Brain className="w-4 h-4 text-purple-500" />;
    }
    return <Zap className="w-4 h-4 text-blue-500" />;
  };

  const getStatusIcon = (status: Message['status']) => {
    switch (status) {
      case 'sending':
        return <Clock className="w-3 h-3 text-gray-400 animate-spin" />;
      case 'sent':
        return <CheckCircle className="w-3 h-3 text-green-500" />;
      case 'error':
        return <AlertCircle className="w-3 h-3 text-red-500" />;
    }
  };

  return (
    <div className="flex flex-col h-full max-w-4xl mx-auto">
      {/* Header */}
      <Card className="p-4 mb-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="p-2 rounded-lg bg-gradient-to-r from-blue-500 to-purple-600">
              <MessageSquare className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                Premium AI Assistant
              </h2>
              <div className="flex items-center space-x-2 text-sm text-gray-500">
                {isOnline ? (
                  <><Wifi className="w-4 h-4 text-green-500" /> Online</>
                ) : (
                  <><WifiOff className="w-4 h-4 text-orange-500" /> Offline Mode</>
                )}
                <span>•</span>
                <span>Model: {preferredModel}</span>
              </div>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowSettings(!showSettings)}
              leftIcon={<Settings size={16} />}
            >
              Settings
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={exportChat}
              leftIcon={<Download size={16} />}
            >
              Export
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={clearChat}
            >
              Clear
            </Button>
          </div>
        </div>

        {/* Settings Panel */}
        <AnimatePresence>
          {showSettings && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="mt-4 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg"
            >
              <h3 className="text-sm font-medium mb-3">AI Model Preference</h3>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { value: 'auto', label: 'Auto', desc: 'Smart selection' },
                  { value: 'gemini-2.0-flash', label: 'Gemini 2.0', desc: 'Online only' },
                  { value: 'gemma-3-offline', label: 'Gemma 3', desc: 'Offline capable' }
                ].map((option) => (
                  <button
                    key={option.value}
                    onClick={() => setPreferredModel(option.value as any)}
                    className={cn(
                      'p-3 rounded-lg border-2 text-left transition-colors',
                      preferredModel === option.value
                        ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                        : 'border-gray-200 dark:border-gray-700 hover:border-gray-300'
                    )}
                  >
                    <div className="font-medium text-sm">{option.label}</div>
                    <div className="text-xs text-gray-500">{option.desc}</div>
                  </button>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </Card>

      {/* Messages */}
      <Card className="flex-1 p-4 overflow-hidden">
        <div className="h-full overflow-y-auto space-y-4">
          <AnimatePresence>
            {messages.map((message) => (
              <motion.div
                key={message.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className={cn(
                  'flex space-x-3',
                  message.role === 'user' ? 'justify-end' : 'justify-start'
                )}
              >
                {message.role === 'assistant' && (
                  <div className="flex-shrink-0">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center">
                      <Bot className="w-4 h-4 text-white" />
                    </div>
                  </div>
                )}

                <div
                  className={cn(
                    'max-w-lg p-4 rounded-2xl',
                    message.role === 'user'
                      ? 'bg-blue-500 text-white ml-auto'
                      : 'bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white'
                  )}
                >
                  <div className="text-sm leading-relaxed whitespace-pre-wrap">
                    {message.content || (
                      <div className="flex items-center space-x-2">
                        <div className="animate-pulse">Thinking...</div>
                        {isLoading && (
                          <div className="flex space-x-1">
                            <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                            <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-100"></div>
                            <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-200"></div>
                          </div>
                        )}
                      </div>
                    )}
                  </div>

                  {message.role === 'assistant' && message.content && (
                    <div className="flex items-center justify-between mt-2 pt-2 border-t border-gray-200 dark:border-gray-700">
                      <div className="flex items-center space-x-2 text-xs text-gray-500">
                        {getModelIcon(message.model, message.isOffline)}
                        <span>
                          {message.isOffline ? 'Offline' : 'Online'} • {message.model}
                        </span>
                      </div>
                      <div className="flex items-center space-x-1">
                        {getStatusIcon(message.status)}
                      </div>
                    </div>
                  )}
                </div>

                {message.role === 'user' && (
                  <div className="flex-shrink-0">
                    <div className="w-8 h-8 rounded-full bg-gray-300 dark:bg-gray-600 flex items-center justify-center">
                      <User className="w-4 h-4 text-gray-600 dark:text-gray-300" />
                    </div>
                  </div>
                )}
              </motion.div>
            ))}
          </AnimatePresence>
          <div ref={messagesEndRef} />
        </div>
      </Card>

      {/* Input */}
      <Card className="p-4 mt-4">
        <div className="flex space-x-3">
          <textarea
            ref={inputRef}
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder={isOnline ? "Ask me anything..." : "Ask me anything (offline mode)..."}
            className="flex-1 resize-none bg-transparent border-none outline-none text-gray-900 dark:text-white placeholder-gray-500"
            rows={1}
            style={{ minHeight: '20px', maxHeight: '120px' }}
          />
          <Button
            onClick={sendMessage}
            disabled={!inputValue.trim() || isLoading}
            leftIcon={<Send size={16} />}
            className="shrink-0"
          >
            Send
          </Button>
        </div>
      </Card>
    </div>
  );
};
