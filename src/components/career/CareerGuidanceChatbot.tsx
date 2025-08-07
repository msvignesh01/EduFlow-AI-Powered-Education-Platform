import React, { useState, useRef, useEffect } from 'react';
import { Send } from 'lucide-react';
import Button from '../ui/Button';
import Input from '../ui/Input';

interface CareerPath {
  id: string;
  title: string;
  description: string;
  skills: string[];
  education: string[];
  jobOutlook: string;
}


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
    

    const userMessage: Message = {
      id: Date.now().toString(),
      content: inputValue,
      sender: 'user',
      timestamp: new Date()
    };
    
    setMessages((prev) => [...prev, userMessage]);
    setInputValue('');
    

    setIsTyping(true);
    

    setTimeout(() => {
      setIsTyping(false);
      

      const lowerCaseInput = inputValue.toLowerCase();
      let suggestedCareer: CareerPath | undefined;
      
      if (lowerCaseInput.includes('code') || lowerCaseInput.includes('program') || lowerCaseInput.includes('software') || lowerCaseInput.includes('develop')) {
        suggestedCareer = careerPaths.find(path => path.title === "Software Engineering");
      } else if (lowerCaseInput.includes('data') || lowerCaseInput.includes('math') || lowerCaseInput.includes('analysis') || lowerCaseInput.includes('statistics')) {
        suggestedCareer = careerPaths.find(path => path.title === "Data Science");
      } else if (lowerCaseInput.includes('medicine') || lowerCaseInput.includes('doctor') || lowerCaseInput.includes('patient') || lowerCaseInput.includes('health')) {
        suggestedCareer = careerPaths.find(path => path.title === "Healthcare");
      }
      

      if (!suggestedCareer) {
        const botMessage: Message = {
          id: Date.now().toString(),
          content: "That's interesting! Could you tell me more about what specifically interests you about these subjects? Are there any particular activities or projects you enjoy working on?",
          sender: 'bot',
          timestamp: new Date()
        };
        setMessages((prev) => [...prev, botMessage]);
      } else {

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
                <div className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                  message.sender === 'user'
                    ? 'bg-blue-500 text-white'
                    : 'bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white'
                }`}>
                  {message.isCareerSuggestion && message.careerPath ? (
                    <div>
                      <p className="font-bold">{message.careerPath.title}</p>
                      <p className="text-sm mt-1">{message.careerPath.description}</p>
                      <div className="mt-2 text-xs">
                        <strong>Skills:</strong> {message.careerPath.skills.join(", ")}
                      </div>
                    </div>
                  ) : (
                    <p>{message.content}</p>
                  )}
                  <div className="text-xs mt-1 opacity-70">
                    {message.timestamp.toLocaleTimeString()}
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
    </div>
  );
};

export default CareerGuidanceChatbot;
