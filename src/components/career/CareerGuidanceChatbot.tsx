import React, { useState, useRef, useEffect } from 'react';
import { Send, User, Bot, Briefcase, GraduationCap, ScrollText } from 'lucide-react';
import Button from '../ui/Button';
import Input from '../ui/Input';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../ui/Card';
import { CareerPath } from '../../types';

// Mock career paths data
const careerPaths: CareerPath[] = [
  {
    id: "1",
    title: "Software Engineering",
    description: "Develop applications, systems, and software solutions for various industries.",
    skills: ["Programming", "Problem Solving", "Data Structures", "Algorithms", "Software Design"],
    education: ["Computer Science Degree", "Coding Bootcamp", "Self-learning + Portfolio"],
    jobOutlook: "Excellent growth potential with high demand across all industries."
  },
  {
    id: "2",
    title: "Data Science",
    description: "Analyze and interpret complex data to help organizations make better decisions.",
    skills: ["Statistics", "Machine Learning", "Python/R", "Data Visualization", "SQL"],
    education: ["Statistics/Math/CS Degree", "Data Science Bootcamp", "Online Specializations"],
    jobOutlook: "Growing rapidly as companies increasingly rely on data-driven decisions."
  },
  {
    id: "3",
    title: "Healthcare",
    description: "Provide medical care and support to patients in various healthcare settings.",
    skills: ["Patient Care", "Medical Knowledge", "Empathy", "Communication", "Critical Thinking"],
    education: ["Medical Degree", "Nursing Degree", "Allied Health Programs"],
    jobOutlook: "Consistent demand with aging population and healthcare advancements."
  }
];

interface Message {
  id: string;
  content: string;
  sender: 'user' | 'bot';
  timestamp: Date;
  isCareerSuggestion?: boolean;
  careerPath?: CareerPath;
}

const initialMessages: Message[] = [
  {
    id: "1",
    content: "Hi there! I'm your AI Career Advisor. I can help you explore career paths based on your interests, skills, and educational background. What subjects or activities do you enjoy?",
    sender: "bot",
    timestamp: new Date(),
  }
];

const CareerGuidanceChatbot: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>(initialMessages);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };
  
  useEffect(() => {
    scrollToBottom();
  }, [messages]);
  
  const handleSendMessage = () => {
    if (inputValue.trim() === '') return;
    
    // Add user message
    const userMessage: Message = {
      id: Date.now().toString(),
      content: inputValue,
      sender: 'user',
      timestamp: new Date()
    };
    
    setMessages((prev) => [...prev, userMessage]);
    setInputValue('');
    
    // Simulate bot thinking
    setIsTyping(true);
    
    // Simulate bot response with career suggestions
    setTimeout(() => {
      setIsTyping(false);
      
      // Simple keyword matching for career suggestions
      const lowerCaseInput = inputValue.toLowerCase();
      let suggestedCareer: CareerPath | undefined;
      
      if (lowerCaseInput.includes('code') || lowerCaseInput.includes('program') || lowerCaseInput.includes('software') || lowerCaseInput.includes('develop')) {
        suggestedCareer = careerPaths.find(path => path.title === "Software Engineering");
      } else if (lowerCaseInput.includes('data') || lowerCaseInput.includes('math') || lowerCaseInput.includes('analysis') || lowerCaseInput.includes('statistics')) {
        suggestedCareer = careerPaths.find(path => path.title === "Data Science");
      } else if (lowerCaseInput.includes('medicine') || lowerCaseInput.includes('doctor') || lowerCaseInput.includes('patient') || lowerCaseInput.includes('health')) {
        suggestedCareer = careerPaths.find(path => path.title === "Healthcare");
      }
      
      // Generic response if no specific career is matched
      if (!suggestedCareer) {
        const botMessage: Message = {
          id: Date.now().toString(),
          content: "That's interesting! Could you tell me more about what specifically interests you about these subjects? Are there any particular activities or projects you enjoy working on?",
          sender: 'bot',
          timestamp: new Date()
        };
        setMessages((prev) => [...prev, botMessage]);
      } else {
        // Response with career suggestion
        const botMessage: Message = {
          id: Date.now().toString(),
          content: `Based on your interests, you might enjoy exploring a career in ${suggestedCareer.title}!`,
          sender: 'bot',
          timestamp: new Date(),
          isCareerSuggestion: true,
          careerPath: suggestedCareer
        };
        setMessages((prev) => [...prev, botMessage]);
      }
    }, 1500);
  };
  
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Career Guidance</h2>
        <p className="text-gray-600 dark:text-gray-400 mt-2">
          Chat with our AI advisor to explore career paths that match your interests and strengths.
        </p>
      </div>
      
      <Card className="relative">
        <CardHeader>
          <CardTitle>AI Career Advisor</CardTitle>
          <CardDescription>
            Share your interests, skills, and aspirations to get personalized career recommendations.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-[500px] flex flex-col">
            <div className="flex-1 overflow-y-auto mb-4 space-y-4">
              {messages.map((message) => (
                <div 
                  key={message.id} 
                  className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div className={`
                    flex max-w-[80%] items-start
                    ${message.sender === 'user' ? 'flex-row-reverse' : ''}
                  `}>
                    <div className={`
                      w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 mt-1
                      ${message.sender === 'user' 
                        ? 'bg-blue-100 text-blue-600 dark:bg-blue-900 dark:text-blue-300 ml-2' 
                        : 'bg-purple-100 text-purple-600 dark:bg-purple-900 dark:text-purple-300 mr-2'}
                    `}>
                      {message.sender === 'user' ? <User size={16} /> : <Bot size={16} />}
                    </div>
                    
                    <div>
                      {message.isCareerSuggestion && message.careerPath ? (
                        <div className="bg-purple-50 dark:bg-purple-900/20 rounded-lg p-4 border border-purple-200 dark:border-purple-800">
                          <h4 className="font-bold text-lg text-purple-700 dark:text-purple-300">
                            {message.careerPath.title}
                          </h4>
                          <p className="text-gray-700 dark:text-gray-300 mt-1">
                            {message.careerPath.description}
                          </p>
                          
                          <div className="mt-4 space-y-3">
                            <div>
                              <div className="flex items-center text-purple-700 dark:text-purple-300 font-medium">
                                <ScrollText size={16} className="mr-2" />
                                Key Skills
                              </div>
                              <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                                {message.careerPath.skills.join(", ")}
                              </p>
                            </div>
                            
                            <div>
                              <div className="flex items-center text-purple-700 dark:text-purple-300 font-medium">
                                <GraduationCap size={16} className="mr-2" />
                                Education Paths
                              </div>
                              <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                                {message.careerPath.education.join(", ")}
                              </p>
                            </div>
                            
                            <div>
                              <div className="flex items-center text-purple-700 dark:text-purple-300 font-medium">
                                <Briefcase size={16} className="mr-2" />
                                Job Outlook
                              </div>
                              <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                                {message.careerPath.jobOutlook}
                              </p>
                            </div>
                          </div>
                          
                          <div className="mt-4">
                            <Button 
                              variant="outline" 
                              size="sm"
                              className="text-purple-700 dark:text-purple-300 border-purple-300 dark:border-purple-700"
                            >
                              Learn More
                            </Button>
                          </div>
                        </div>
                      ) : (
                        <div className={`
                          p-3 rounded-lg
                          ${message.sender === 'user' 
                            ? 'bg-blue-600 text-white dark:bg-blue-700' 
                            : 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200'}
                        `}>
                          <p>{message.content}</p>
                        </div>
                      )}
                      
                      <p className={`
                        text-xs mt-1 text-gray-500 dark:text-gray-400
                        ${message.sender === 'user' ? 'text-right' : ''}
                      `}>
                        {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
              
              {isTyping && (
                <div className="flex justify-start">
                  <div className="flex items-start">
                    <div className="w-8 h-8 rounded-full bg-purple-100 text-purple-600 dark:bg-purple-900 dark:text-purple-300 mr-2 flex items-center justify-center flex-shrink-0 mt-1">
                      <Bot size={16} />
                    </div>
                    <div className="p-3 rounded-lg bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200">
                      <div className="flex space-x-1">
                        <div className="w-2 h-2 bg-gray-500 dark:bg-gray-400 rounded-full animate-bounce"></div>
                        <div className="w-2 h-2 bg-gray-500 dark:bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                        <div className="w-2 h-2 bg-gray-500 dark:bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
              
              <div ref={messagesEndRef} />
            </div>
            
            <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
              <div className="flex">
                <Input
                  placeholder="Ask me about career options..."
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                  className="flex-1"
                />
                <Button
                  onClick={handleSendMessage}
                  disabled={inputValue.trim() === '' || isTyping}
                  className="ml-2"
                  icon={<Send size={16} />}
                >
                  Send
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default CareerGuidanceChatbot;
