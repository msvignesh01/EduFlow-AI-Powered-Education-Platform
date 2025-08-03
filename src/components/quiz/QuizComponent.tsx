import React, { useState } from 'react';
import { Clock, CheckCircle, XCircle, AlertTriangle } from 'lucide-react';
import Button from '../ui/Button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../ui/Card';
import { Quiz, Question } from '../../types';

// Mock quiz data
const mockQuizData: Quiz = {
  id: "quiz-1",
  userId: "user-1",
  title: "Introduction to Cell Biology",
  subject: "Biology",
  questions: [
    {
      id: "q1",
      text: "What is the powerhouse of the cell?",
      options: ["Nucleus", "Mitochondria", "Golgi Apparatus", "Endoplasmic Reticulum"],
      correctOptionIndex: 1
    },
    {
      id: "q2",
      text: "Which of the following is NOT a function of the cell membrane?",
      options: ["Protection", "Transport of materials", "Energy production", "Cell recognition"],
      correctOptionIndex: 2
    },
    {
      id: "q3",
      text: "Which organelle is responsible for protein synthesis?",
      options: ["Ribosomes", "Lysosomes", "Vacuoles", "Centrosomes"],
      correctOptionIndex: 0
    },
    {
      id: "q4",
      text: "What is the main component of the cell wall in plants?",
      options: ["Protein", "Lipids", "Cellulose", "Chitin"],
      correctOptionIndex: 2
    },
    {
      id: "q5",
      text: "Which of these is NOT a part of the endomembrane system?",
      options: ["Endoplasmic Reticulum", "Golgi Apparatus", "Mitochondria", "Lysosomes"],
      correctOptionIndex: 2
    }
  ],
  createdAt: "2023-04-15T10:30:00Z"
};

const QuizComponent: React.FC = () => {
  const [currentQuizData, setCurrentQuizData] = useState<Quiz | null>(mockQuizData);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [answers, setAnswers] = useState<number[]>([]);
  const [hasSubmitted, setHasSubmitted] = useState(false);
  const [timer, setTimer] = useState(60); // 60 seconds per question
  const [quizStarted, setQuizStarted] = useState(false);
  
  const startQuiz = () => {
    setQuizStarted(true);
    setCurrentQuestionIndex(0);
    setAnswers([]);
    setHasSubmitted(false);
  };
  
  const handleOptionSelect = (optionIndex: number) => {
    setSelectedOption(optionIndex);
  };
  
  const handleNextQuestion = () => {
    if (selectedOption !== null) {
      setAnswers([...answers, selectedOption]);
      
      if (currentQuestionIndex < (currentQuizData?.questions.length || 0) - 1) {
        setCurrentQuestionIndex(currentQuestionIndex + 1);
        setSelectedOption(null);
        setTimer(60); // Reset timer for the next question
      } else {
        setHasSubmitted(true);
      }
    }
  };
  
  const calculateScore = () => {
    if (!currentQuizData) return 0;
    
    return currentQuizData.questions.reduce((score, question, index) => {
      if (answers[index] === question.correctOptionIndex) {
        return score + 1;
      }
      return score;
    }, 0);
  };
  
  const getScorePercentage = () => {
    if (!currentQuizData) return 0;
    const score = calculateScore();
    return Math.round((score / currentQuizData.questions.length) * 100);
  };
  
  const getResultColor = () => {
    const percentage = getScorePercentage();
    if (percentage >= 80) return "text-green-600 dark:text-green-400";
    if (percentage >= 60) return "text-yellow-600 dark:text-yellow-400";
    return "text-red-600 dark:text-red-400";
  };
  
  const getResultIcon = () => {
    const percentage = getScorePercentage();
    if (percentage >= 80) return <CheckCircle size={48} className="text-green-600 dark:text-green-400" />;
    if (percentage >= 60) return <AlertTriangle size={48} className="text-yellow-600 dark:text-yellow-400" />;
    return <XCircle size={48} className="text-red-600 dark:text-red-400" />;
  };
  
  // Display quiz introduction if not started
  if (!quizStarted) {
    return (
      <div className="space-y-6">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Interactive Quizzes</h2>
        <p className="text-gray-600 dark:text-gray-400">
          Test your knowledge with our interactive quizzes. These quizzes adapt to your learning style and help reinforce key concepts.
        </p>
        
        <Card>
          <CardHeader>
            <CardTitle>{currentQuizData?.title}</CardTitle>
            <CardDescription>
              Subject: {currentQuizData?.subject} • {currentQuizData?.questions.length} Questions • Estimated Time: {currentQuizData?.questions.length} minutes
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="prose dark:prose-invert max-w-none">
              <p>
                This quiz will test your knowledge of fundamental cell biology concepts. Each question has one correct answer.
              </p>
              <ul className="mt-4">
                <li>You'll have 60 seconds to answer each question</li>
                <li>You can't go back to previous questions</li>
                <li>Your score will be displayed at the end</li>
              </ul>
            </div>
            
            <div className="mt-6">
              <Button onClick={startQuiz}>
                Start Quiz
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }
  
  // Display results after quiz completion
  if (hasSubmitted) {
    const score = calculateScore();
    const percentage = getScorePercentage();
    
    return (
      <div className="space-y-6">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Quiz Results</h2>
        
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <div className="inline-flex h-24 w-24 items-center justify-center mb-6">
                {getResultIcon()}
              </div>
              
              <h3 className="text-2xl font-bold">
                Your score: <span className={getResultColor()}>{score}/{currentQuizData?.questions.length} ({percentage}%)</span>
              </h3>
              
              <p className="mt-2 text-gray-600 dark:text-gray-400">
                {percentage >= 80 ? "Excellent work! You've mastered this topic." : 
                 percentage >= 60 ? "Good job! You're on the right track." : 
                 "You might need to review this topic a bit more."}
              </p>
              
              <div className="mt-8 space-y-6">
                <h4 className="font-semibold text-lg text-gray-900 dark:text-white text-left">Question Review</h4>
                
                {currentQuizData?.questions.map((question, index) => (
                  <div key={question.id} className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 text-left">
                    <div className="flex items-start">
                      <div className="mr-3 mt-0.5">
                        {answers[index] === question.correctOptionIndex ? (
                          <CheckCircle size={20} className="text-green-600 dark:text-green-400" />
                        ) : (
                          <XCircle size={20} className="text-red-600 dark:text-red-400" />
                        )}
                      </div>
                      <div>
                        <p className="font-medium text-gray-900 dark:text-white">{question.text}</p>
                        <div className="mt-2 grid gap-2">
                          {question.options.map((option, optionIndex) => (
                            <div 
                              key={optionIndex}
                              className={`
                                p-2 rounded-md text-sm
                                ${optionIndex === question.correctOptionIndex 
                                  ? 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300' 
                                  : optionIndex === answers[index] 
                                    ? 'bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-300' 
                                    : 'bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-300'}
                              `}
                            >
                              {option}
                              {optionIndex === question.correctOptionIndex && (
                                <span className="ml-2 text-green-600 dark:text-green-400">(Correct)</span>
                              )}
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="mt-8">
                <Button onClick={() => setQuizStarted(false)}>
                  Return to Quiz Overview
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }
  
  // Display current question
  const currentQuestion = currentQuizData?.questions[currentQuestionIndex];
  
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
          {currentQuizData?.title}
        </h2>
        <div className="flex items-center text-gray-600 dark:text-gray-400">
          <Clock size={20} className="mr-2" />
          <span>Question {currentQuestionIndex + 1} of {currentQuizData?.questions.length}</span>
        </div>
      </div>
      
      <Card>
        <CardHeader>
          <div className="w-full bg-gray-200 dark:bg-gray-700 h-2 rounded-full overflow-hidden">
            <div 
              className="bg-blue-600 h-2 transition-all"
              style={{ width: `${((currentQuestionIndex) / (currentQuizData?.questions.length || 1)) * 100}%` }}
            ></div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            <h3 className="text-xl font-medium text-gray-900 dark:text-white">{currentQuestion?.text}</h3>
            
            <div className="grid gap-3">
              {currentQuestion?.options.map((option, index) => (
                <button
                  key={index}
                  className={`
                    p-4 rounded-lg border transition-all text-left
                    ${selectedOption === index 
                      ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20 ring-2 ring-blue-500' 
                      : 'border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800'}
                  `}
                  onClick={() => handleOptionSelect(index)}
                >
                  <div className="flex items-center">
                    <div className={`
                      h-5 w-5 rounded-full border mr-3 flex items-center justify-center
                      ${selectedOption === index 
                        ? 'border-blue-500 bg-blue-500' 
                        : 'border-gray-300 dark:border-gray-600'}
                    `}>
                      {selectedOption === index && (
                        <div className="h-2 w-2 rounded-full bg-white"></div>
                      )}
                    </div>
                    <span>{option}</span>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
      
      <div className="flex justify-end">
        <Button 
          onClick={handleNextQuestion}
          disabled={selectedOption === null}
        >
          {currentQuestionIndex === (currentQuizData?.questions.length || 0) - 1 ? 'Finish Quiz' : 'Next Question'}
        </Button>
      </div>
    </div>
  );
};

export default QuizComponent;