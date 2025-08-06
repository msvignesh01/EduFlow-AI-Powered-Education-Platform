import React, { useState } from 'react';
import { Send, User, Bot, Briefcase, GraduationCap, ScrollText } from 'lucide-react';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';

interface CareerPath {
  title: string;
  description: string;
  skills: string[];
  education: string[];
  jobOutlook: string;
}

interface Message {
  id: number;
  content: string;
  sender: 'user' | 'bot';
  timestamp: Date;
  isCareerSuggestion?: boolean;
  careerPath?: CareerPath;
}

const CareerGuidanceChatbot: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);

  const careerSuggestions: CareerPath[] = [
    {
      title: "Software Engineer",
      description: "Design and develop software applications and systems",
      skills: ["Programming", "Problem Solving", "Algorithms", "System Design"],
      education: ["Bachelor's in Computer Science", "Coding Bootcamp", "Self-taught with portfolio"],
      jobOutlook: "22% growth from 2020-2030 (Much faster than average)"
    },
    {
      title: "Data Scientist",
      description: "Analyze complex data to help organizations make better decisions",
      skills: ["Statistics", "Python/R", "Machine Learning", "Data Visualization"],
      education: ["Bachelor's in Statistics/Math", "Master's preferred", "Online certifications"],
      jobOutlook: "22% growth from 2020-2030 (Much faster than average)"
    },
    {
      title: "UX Designer",
      description: "Create user-friendly interfaces and improve user experiences",
      skills: ["Design Thinking", "Prototyping", "User Research", "Visual Design"],
      education: ["Bachelor's in Design", "UX Bootcamp", "Portfolio-based entry"],
      jobOutlook: "13% growth from 2020-2030 (Faster than average)"
    }
  ];

  const handleSendMessage = () => {
    if (!inputValue.trim()) return;

    const userMessage: Message = {
      id: Date.now(),
      content: inputValue,
      sender: 'user',
      timestamp: new Date()
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputValue('');
    setIsTyping(true);

    // Simulate AI response
    setTimeout(() => {
      setIsTyping(false);
      
      // Simple keyword matching for career suggestions
      const interests = inputValue.toLowerCase();
      let suggestedCareer: CareerPath | null = null;

      if (interests.includes('code') || interests.includes('programming') || interests.includes('software')) {
        suggestedCareer = careerSuggestions[0];
      } else if (interests.includes('data') || interests.includes('analytics') || interests.includes('statistics')) {
        suggestedCareer = careerSuggestions[1];
      } else if (interests.includes('design') || interests.includes('user') || interests.includes('creative')) {
        suggestedCareer = careerSuggestions[2];
      }

      if (suggestedCareer) {
        const botMessage: Message = {
          id: Date.now() + 1,
          content: `Based on your interests, I think you'd be great at this career path!`,
          sender: 'bot',
          timestamp: new Date(),
          isCareerSuggestion: true,
          careerPath: suggestedCareer
        };
        setMessages((prev) => [...prev, botMessage]);
      } else {
        const botMessage: Message = {
          id: Date.now() + 1,
          content: `That's interesting! Can you tell me more about what specifically interests you? For example, do you enjoy problem-solving, working with data, or creative design?`,
          sender: 'bot',
          timestamp: new Date()
        };
        setMessages((prev) => [...prev, botMessage]);
      }
    }, 1500);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">Career Guidance</h1>
      <p className="text-gray-600 dark:text-gray-400 mb-6">
        💼 Chat with our AI advisor to explore career paths that match your interests and strengths.
      </p>
      
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow h-96 flex flex-col">
        <div className="flex-1 p-4 overflow-y-auto space-y-4">
          {messages.length === 0 ? (
            <div className="text-center text-gray-500 dark:text-gray-400">
              <p>💼 AI Career Advisor Ready</p>
              <p className="text-sm mt-2">Share your interests and get personalized career recommendations!</p>
            </div>
          ) : (
            messages.map((message) => (
              <div key={message.id} className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
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
                              Education Requirements
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
            ))
          )}
          
          {isTyping && (
            <div className="flex justify-start">
              <div className="bg-gray-100 dark:bg-gray-700 px-4 py-2 rounded-lg">
                <div className="flex items-center space-x-2">
                  <div className="flex space-x-1">
                    <div className="w-2 h-2 bg-gray-500 dark:bg-gray-400 rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-gray-500 dark:bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                    <div className="w-2 h-2 bg-gray-500 dark:bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
        
        <div className="border-t border-gray-200 dark:border-gray-700 p-4">
          <div className="flex space-x-2">
            <Input
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder="Tell me about your interests (e.g., 'I love coding and solving problems')"
              onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
              className="flex-1"
            />
            <Button onClick={handleSendMessage}>
              <Send size={16} className="mr-2" />
              Send
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CareerGuidanceChatbot;
