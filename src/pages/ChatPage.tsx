import React, { useState, useRef, useEffect } from 'react';
import { 
  Send,
  Paperclip,
  Bot,
  User,
  Info,
  Lightbulb,
  Trash,
  Clock,
  X
} from 'lucide-react';
import { Card, CardHeader, CardContent, CardFooter } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { ChatMessage } from '../types';

export const ChatPage: React.FC = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: '1',
      sender: 'assistant',
      content: 'Hello! I can help you understand your learning materials. Upload a presentation or ask me questions about your study topics.',
      timestamp: new Date(),
    },
  ]);
  
  const [input, setInput] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const [uploadFileName, setUploadFileName] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };
  
  useEffect(() => {
    scrollToBottom();
  }, [messages]);
  
  const handleSendMessage = () => {
    if (input.trim() === '') return;
    
    // Add user message
    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      sender: 'user',
      content: input,
      timestamp: new Date(),
    };
    
    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    
    // Simulate AI response after a short delay
    setTimeout(() => {
      const aiResponse: ChatMessage = {
        id: (Date.now() + 1).toString(),
        sender: 'assistant',
        content: getAIResponse(input),
        timestamp: new Date(),
      };
      
      setMessages((prev) => [...prev, aiResponse]);
    }, 1000);
  };
  
  const getAIResponse = (userInput: string): string => {
    const lowercasedInput = userInput.toLowerCase();
    
    if (lowercasedInput.includes('hello') || lowercasedInput.includes('hi')) {
      return 'Hello! How can I help with your studies today?';
    } else if (lowercasedInput.includes('thank')) {
      return 'You\'re welcome! Is there anything else you\'d like to know?';
    } else if (lowercasedInput.includes('explain') || lowercasedInput.includes('what is')) {
      return 'That\'s a great question! The concept you\'re asking about involves several key principles. I\'d be happy to break it down for you step by step. What specific aspects would you like me to focus on?';
    } else if (uploadFileName) {
      return `I've analyzed your presentation "${uploadFileName}". It contains information about learning methodologies and effective study techniques. Which specific topic would you like me to explain in more detail?`;
    } else {
      return 'I understand you\'re asking about this topic. To provide the most helpful information, could you share some context about what you\'re currently studying or what specific aspects you\'d like to understand better?';
    }
  };
  
  const handleFileUpload = () => {
    setIsUploading(true);
    
    // Simulate file upload
    setTimeout(() => {
      const filename = 'Learning_Strategies_Presentation.pptx';
      setUploadFileName(filename);
      setIsUploading(false);
      
      // Add system message about file upload
      const fileMessage: ChatMessage = {
        id: Date.now().toString(),
        sender: 'assistant',
        content: `File "${filename}" has been uploaded successfully. I'm analyzing the content...`,
        timestamp: new Date(),
      };
      
      setMessages((prev) => [...prev, fileMessage]);
      
      // Simulate analysis completion
      setTimeout(() => {
        const analysisMessage: ChatMessage = {
          id: (Date.now() + 1).toString(),
          sender: 'assistant',
          content: `I've analyzed the presentation "${filename}". It covers effective learning strategies, including spaced repetition, active recall, and the Feynman technique. What specific part would you like me to explain?`,
          timestamp: new Date(),
        };
        
        setMessages((prev) => [...prev, analysisMessage]);
      }, 2000);
    }, 1500);
  };
  
  const clearChat = () => {
    setMessages([
      {
        id: '1',
        sender: 'assistant',
        content: 'Hello! I can help you understand your learning materials. Upload a presentation or ask me questions about your study topics.',
        timestamp: new Date(),
      },
    ]);
    setUploadFileName('');
  };
  
  const removeUploadedFile = () => {
    setUploadFileName('');
  };
  
  const formatTime = (date: Date): string => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className="min-h-[calc(100vh-8rem)] flex flex-col animate-fadeIn">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">AI Learning Assistant</h1>
        <p className="mt-1 text-gray-500 dark:text-gray-400">
          Upload presentations or ask questions to enhance your understanding
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 flex-1">
        <div className="lg:col-span-3 flex flex-col">
          <Card className="flex-1 flex flex-col">
            <CardHeader title="Chat" />
            <CardContent className="flex-1 overflow-y-auto h-[calc(100vh-18rem)]">
              <div className="space-y-4">
                {messages.map((message) => (
                  <div
                    key={message.id}
                    className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div
                      className={`
                        max-w-[80%] rounded-lg p-4 flex
                        ${message.sender === 'user'
                          ? 'bg-blue-500 text-white'
                          : 'bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white'
                        }
                      `}
                    >
                      <div className="mr-3 mt-1">
                        {message.sender === 'user' ? (
                          <User size={18} className="text-white" />
                        ) : (
                          <Bot size={18} className="text-blue-500 dark:text-blue-400" />
                        )}
                      </div>
                      <div className="flex-1">
                        <div className="text-sm mb-1">
                          {message.content}
                        </div>
                        <div className="text-xs opacity-70 text-right">
                          {formatTime(message.timestamp)}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
                <div ref={messagesEndRef} />
              </div>
            </CardContent>
            <CardFooter className="border-t border-gray-100 dark:border-gray-800 pt-4">
              <div className="flex items-center w-full space-x-2">
                <button
                  className="p-2 rounded-full text-gray-500 hover:text-gray-700 hover:bg-gray-100 dark:text-gray-400 dark:hover:text-gray-200 dark:hover:bg-gray-800"
                  onClick={handleFileUpload}
                  disabled={isUploading}
                >
                  <Paperclip size={20} />
                </button>
                <input
                  type="text"
                  placeholder="Type your message..."
                  className="flex-1 border border-gray-300 dark:border-gray-700 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:text-white"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      handleSendMessage();
                    }
                  }}
                />
                <Button
                  onClick={handleSendMessage}
                  disabled={input.trim() === ''}
                  rightIcon={<Send size={16} />}
                >
                  Send
                </Button>
              </div>
            </CardFooter>
          </Card>
        </div>
        
        <div className="space-y-6">
          <Card>
            <CardHeader title="Chat Options" />
            <CardContent className="space-y-4">
              <Button
                variant="outline"
                leftIcon={<Trash size={16} />}
                onClick={clearChat}
                fullWidth
              >
                Clear Conversation
              </Button>
              
              {uploadFileName && (
                <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <p className="text-sm font-medium text-blue-700 dark:text-blue-400">Uploaded File</p>
                    <button
                      className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                      onClick={removeUploadedFile}
                    >
                      <X size={16} />
                    </button>
                  </div>
                  <p className="text-xs text-gray-600 dark:text-gray-300 truncate">
                    {uploadFileName}
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader title="Learning Tips" />
            <CardContent className="space-y-4">
              <div className="flex items-start space-x-3">
                <div className="p-2 bg-yellow-100 dark:bg-yellow-900/20 rounded-lg">
                  <Lightbulb size={18} className="text-yellow-600 dark:text-yellow-400" />
                </div>
                <div>
                  <p className="text-sm text-gray-800 dark:text-gray-200">
                    Use the Feynman Technique: Explain a concept in simple terms to deepen understanding.
                  </p>
                </div>
              </div>
              
              <div className="flex items-start space-x-3">
                <div className="p-2 bg-blue-100 dark:bg-blue-900/20 rounded-lg">
                  <Clock size={18} className="text-blue-600 dark:text-blue-400" />
                </div>
                <div>
                  <p className="text-sm text-gray-800 dark:text-gray-200">
                    Spaced repetition helps retain information longer - review material at increasing intervals.
                  </p>
                </div>
              </div>
              
              <div className="flex items-start space-x-3">
                <div className="p-2 bg-purple-100 dark:bg-purple-900/20 rounded-lg">
                  <Info size={18} className="text-purple-600 dark:text-purple-400" />
                </div>
                <div>
                  <p className="text-sm text-gray-800 dark:text-gray-200">
                    Active recall is more effective than passive review - test yourself regularly.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}; 


