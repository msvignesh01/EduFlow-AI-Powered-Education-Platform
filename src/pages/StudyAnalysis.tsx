import React, { useState } from 'react';
import { 
  BookOpen,
  Timer,
  Coffee,
  Brain,
  BadgeCheck,
  ArrowLeft,
  ArrowRight,
  CheckCircle2
} from 'lucide-react';
import { Card, CardHeader, CardContent, CardFooter } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { StudyAnalysis as StudyAnalysisType } from '../types';

interface Question {
  id: string;
  text: string;
  options: Array<{
    id: string;
    text: string;
    value: number;
  }>;
}

const questions: Question[] = [
  {
    id: 'study-duration',
    text: 'How long can you typically study before needing a break?',
    options: [
      { id: 'sd-1', text: 'Less than 30 minutes', value: 1 },
      { id: 'sd-2', text: '30-60 minutes', value: 2 },
      { id: 'sd-3', text: '1-2 hours', value: 3 },
      { id: 'sd-4', text: 'More than 2 hours', value: 4 },
    ],
  },
  {
    id: 'environment',
    text: 'What type of environment helps you focus best?',
    options: [
      { id: 'env-1', text: 'Complete silence', value: 1 },
      { id: 'env-2', text: 'Light background noise', value: 2 },
      { id: 'env-3', text: 'Music without lyrics', value: 3 },
      { id: 'env-4', text: 'Busy environment (coffee shop, etc.)', value: 4 },
    ],
  },
  {
    id: 'learning-style',
    text: 'How do you prefer to learn new information?',
    options: [
      { id: 'ls-1', text: 'Reading/writing', value: 1 },
      { id: 'ls-2', text: 'Visual aids (diagrams, charts)', value: 2 },
      { id: 'ls-3', text: 'Listening to lectures/explanations', value: 3 },
      { id: 'ls-4', text: 'Hands-on practice', value: 4 },
    ],
  },
  {
    id: 'productivity',
    text: 'When during the day are you most productive?',
    options: [
      { id: 'prod-1', text: 'Early morning', value: 1 },
      { id: 'prod-2', text: 'Late morning to early afternoon', value: 2 },
      { id: 'prod-3', text: 'Late afternoon to early evening', value: 3 },
      { id: 'prod-4', text: 'Late evening/night', value: 4 },
    ],
  },
  {
    id: 'break-pattern',
    text: 'What break pattern works best for you?',
    options: [
      { id: 'bp-1', text: 'Short, frequent breaks (5 min every 25 min)', value: 1 },
      { id: 'bp-2', text: 'Medium breaks (10 min every hour)', value: 2 },
      { id: 'bp-3', text: 'Longer breaks (30 min every 2 hours)', value: 3 },
      { id: 'bp-4', text: 'Few breaks until task is complete', value: 4 },
    ],
  },
];

export const StudyAnalysis: React.FC = () => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [showResults, setShowResults] = useState(false);
  const [analysis, setAnalysis] = useState<StudyAnalysisType | null>(null);
  
  const handleAnswer = (questionId: string, optionId: string) => {
    setAnswers({
      ...answers,
      [questionId]: optionId,
    });
  };
  
  const handleNext = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    } else {
      // Calculate results
      const mockAnalysis: StudyAnalysisType = {
        productivityScore: 7.5,
        focusTime: 45,
        breakPattern: 'Short breaks (5-10 minutes) every 45 minutes of focused work',
        learningStyle: 'visual',
        recommendedTechniques: [
          'Pomodoro Technique - 45 minute work sessions with 10 minute breaks',
          'Use visual aids like mind maps and diagrams',
          'Study in a quiet environment with minimal distractions',
          'Schedule study sessions in the morning when your focus is highest',
        ],
      };
      
      setAnalysis(mockAnalysis);
      setShowResults(true);
    }
  };
  
  const handlePrevious = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    }
  };
  
  const handleRestart = () => {
    setCurrentQuestionIndex(0);
    setAnswers({});
    setShowResults(false);
    setAnalysis(null);
  };
  
  const currentQuestion = questions[currentQuestionIndex];
  const progress = ((currentQuestionIndex + (showResults ? 1 : 0)) / questions.length) * 100;
  
  const getIconForQuestion = (index: number) => {
    const icons = [
      <Timer size={24} className="text-blue-500" />,
      <Coffee size={24} className="text-purple-500" />,
      <Brain size={24} className="text-emerald-500" />,
      <BookOpen size={24} className="text-yellow-500" />,
      <Coffee size={24} className="text-red-500" />,
    ];
    return icons[index % icons.length];
  };

  return (
    <div className="space-y-6 max-w-3xl mx-auto animate-fadeIn">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Study Pattern Analysis</h1>
        <p className="mt-1 text-gray-500 dark:text-gray-400">
          Answer a few questions to get personalized study recommendations
        </p>
      </div>

      <div className="relative w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
        <div 
          className="absolute left-0 top-0 h-full bg-blue-500 transition-all duration-300 ease-out"
          style={{ width: `${progress}%` }}
        />
      </div>
      
      {!showResults ? (
        <Card className="transition-all duration-300 hover:shadow-lg">
          <CardContent className="pt-6">
            <div className="flex items-start mb-6">
              <div className="p-3 rounded-full bg-blue-100 dark:bg-blue-900/20 mr-4">
                {getIconForQuestion(currentQuestionIndex)}
              </div>
              <div>
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-1">
                  Question {currentQuestionIndex + 1} of {questions.length}
                </h2>
                <p className="text-gray-700 dark:text-gray-300">
                  {currentQuestion.text}
                </p>
              </div>
            </div>
            
            <div className="space-y-3 mt-6">
              {currentQuestion.options.map((option) => (
                <button
                  key={option.id}
                  className={`
                    w-full text-left p-4 rounded-lg border transition-all hover:shadow-md
                    ${answers[currentQuestion.id] === option.id 
                      ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20 dark:border-blue-400'
                      : 'border-gray-200 hover:border-blue-300 dark:border-gray-700'}
                  `}
                  onClick={() => handleAnswer(currentQuestion.id, option.id)}
                >
                  <div className="flex items-center">
                    <div 
                      className={`
                        w-5 h-5 rounded-full border mr-3 flex items-center justify-center
                        ${answers[currentQuestion.id] === option.id 
                          ? 'border-blue-500 bg-blue-500' 
                          : 'border-gray-300 dark:border-gray-600'}
                      `}
                    >
                      {answers[currentQuestion.id] === option.id && (
                        <div className="w-2.5 h-2.5 rounded-full bg-white"></div>
                      )}
                    </div>
                    {option.text}
                  </div>
                </button>
              ))}
            </div>
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button 
              variant="outline" 
              onClick={handlePrevious}
              disabled={currentQuestionIndex === 0}
              leftIcon={<ArrowLeft size={16} />}
            >
              Previous
            </Button>
            <Button 
              onClick={handleNext}
              disabled={!answers[currentQuestion.id]}
              rightIcon={<ArrowRight size={16} />}
            >
              {currentQuestionIndex === questions.length - 1 ? 'Finish' : 'Next'}
            </Button>
          </CardFooter>
        </Card>
      ) : (
        <div className="space-y-6">
          <Card className="transition-all duration-300 hover:shadow-lg">
            <CardHeader title="Your Study Analysis Results" />
            <CardContent>
              <div className="flex justify-center mb-8">
                <div className="relative w-32 h-32">
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-3xl font-bold text-blue-600 dark:text-blue-400">
                      {analysis?.productivityScore}
                    </span>
                  </div>
                  <svg viewBox="0 0 36 36" className="w-32 h-32 transform -rotate-90">
                    <path
                      d="M18 2.0845
                        a 15.9155 15.9155 0 0 1 0 31.831
                        a 15.9155 15.9155 0 0 1 0 -31.831"
                      fill="none"
                      stroke="#E5E7EB"
                      strokeWidth="3"
                      strokeDasharray="100, 100"
                      className="dark:stroke-gray-700"
                    />
                    <path
                      d="M18 2.0845
                        a 15.9155 15.9155 0 0 1 0 31.831
                        a 15.9155 15.9155 0 0 1 0 -31.831"
                      fill="none"
                      stroke="#3B82F6"
                      strokeWidth="3"
                      strokeDasharray={`${analysis?.productivityScore * 10}, 100`}
                      className="dark:stroke-blue-500"
                    />
                  </svg>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
                  <div className="flex items-center mb-2">
                    <Timer size={18} className="text-blue-500 mr-2" />
                    <h3 className="font-medium text-gray-900 dark:text-white">Optimal Focus Time</h3>
                  </div>
                  <p className="text-gray-700 dark:text-gray-300">{analysis?.focusTime} minutes</p>
                </div>
                
                <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
                  <div className="flex items-center mb-2">
                    <Coffee size={18} className="text-purple-500 mr-2" />
                    <h3 className="font-medium text-gray-900 dark:text-white">Break Pattern</h3>
                  </div>
                  <p className="text-gray-700 dark:text-gray-300">{analysis?.breakPattern}</p>
                </div>
                
                <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
                  <div className="flex items-center mb-2">
                    <Brain size={18} className="text-emerald-500 mr-2" />
                    <h3 className="font-medium text-gray-900 dark:text-white">Learning Style</h3>
                  </div>
                  <p className="text-gray-700 dark:text-gray-300 capitalize">{analysis?.learningStyle}</p>
                </div>
                
                <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
                  <div className="flex items-center mb-2">
                    <BadgeCheck size={18} className="text-yellow-500 mr-2" />
                    <h3 className="font-medium text-gray-900 dark:text-white">Productivity Score</h3>
                  </div>
                  <p className="text-gray-700 dark:text-gray-300">{analysis?.productivityScore}/10</p>
                </div>
              </div>
              
              <div>
                <h3 className="font-semibold text-gray-900 dark:text-white mb-3">Recommended Techniques</h3>
                <ul className="space-y-2">
                  {analysis?.recommendedTechniques.map((technique, index) => (
                    <li key={index} className="flex items-start">
                      <CheckCircle2 size={18} className="text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                      <span className="text-gray-700 dark:text-gray-300">{technique}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </CardContent>
            <CardFooter>
              <Button onClick={handleRestart} fullWidth>Take Assessment Again</Button>
            </CardFooter>
          </Card>
        </div>
      )}
    </div>
  );
};