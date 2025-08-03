import React from 'react';
import { BarChart, LineChart, PieChart, Activity } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '../ui/Card';
import { StudySession } from '../../types';

interface StudyPatternAnalysisProps {
  studySessions: StudySession[];
}

const StudyPatternAnalysis: React.FC<StudyPatternAnalysisProps> = ({ studySessions }) => {
  // This is placeholder data, in a real app these would be calculated from studySessions
  const averageProductivity = 7.5;
  const totalStudyHours = 28;
  const mostProductiveTime = "9:00 AM - 11:00 AM";
  const subjectDistribution = [
    { subject: "Mathematics", percentage: 35 },
    { subject: "Science", percentage: 25 },
    { subject: "History", percentage: 15 },
    { subject: "Language", percentage: 15 },
    { subject: "Other", percentage: 10 },
  ];
  
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Study Pattern Analysis</h2>
      <p className="text-gray-600 dark:text-gray-400">
        Based on your study sessions, we've analyzed your patterns to help you understand your learning style better.
      </p>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Average Productivity</p>
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white mt-1">{averageProductivity}/10</h3>
              </div>
              <div className="p-2 bg-blue-100 rounded-full text-blue-600 dark:bg-blue-900 dark:text-blue-300">
                <Activity size={24} />
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Total Study Hours</p>
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white mt-1">{totalStudyHours} hrs</h3>
              </div>
              <div className="p-2 bg-purple-100 rounded-full text-purple-600 dark:bg-purple-900 dark:text-purple-300">
                <LineChart size={24} />
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Most Productive Time</p>
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white mt-1">{mostProductiveTime}</h3>
              </div>
              <div className="p-2 bg-teal-100 rounded-full text-teal-600 dark:bg-teal-900 dark:text-teal-300">
                <BarChart size={24} />
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Focus Recommendation</p>
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white mt-1">30/10 min</h3>
              </div>
              <div className="p-2 bg-amber-100 rounded-full text-amber-600 dark:bg-amber-900 dark:text-amber-300">
                <PieChart size={24} />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Weekly Study Hours</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-80 flex items-center justify-center">
              {/* This would be replaced with an actual chart component */}
              <div className="relative w-full h-64">
                <div className="absolute bottom-0 left-0 right-0 bg-blue-500 bg-opacity-20 rounded-t-md" style={{ height: '40%' }}>
                  <div className="absolute bottom-0 left-0 right-0 bg-blue-500 rounded-t-md" style={{ height: '60%' }}></div>
                </div>
                <div className="absolute bottom-0 left-[14.28%] right-[85.72%] bg-blue-500 bg-opacity-20 rounded-t-md" style={{ height: '60%' }}>
                  <div className="absolute bottom-0 left-0 right-0 bg-blue-500 rounded-t-md" style={{ height: '75%' }}></div>
                </div>
                <div className="absolute bottom-0 left-[28.56%] right-[71.44%] bg-blue-500 bg-opacity-20 rounded-t-md" style={{ height: '30%' }}>
                  <div className="absolute bottom-0 left-0 right-0 bg-blue-500 rounded-t-md" style={{ height: '50%' }}></div>
                </div>
                <div className="absolute bottom-0 left-[42.84%] right-[57.16%] bg-blue-500 bg-opacity-20 rounded-t-md" style={{ height: '80%' }}>
                  <div className="absolute bottom-0 left-0 right-0 bg-blue-500 rounded-t-md" style={{ height: '90%' }}></div>
                </div>
                <div className="absolute bottom-0 left-[57.12%] right-[42.88%] bg-blue-500 bg-opacity-20 rounded-t-md" style={{ height: '50%' }}>
                  <div className="absolute bottom-0 left-0 right-0 bg-blue-500 rounded-t-md" style={{ height: '65%' }}></div>
                </div>
                <div className="absolute bottom-0 left-[71.4%] right-[28.6%] bg-blue-500 bg-opacity-20 rounded-t-md" style={{ height: '45%' }}>
                  <div className="absolute bottom-0 left-0 right-0 bg-blue-500 rounded-t-md" style={{ height: '45%' }}></div>
                </div>
                <div className="absolute bottom-0 left-[85.68%] right-[14.32%] bg-blue-500 bg-opacity-20 rounded-t-md" style={{ height: '65%' }}>
                  <div className="absolute bottom-0 left-0 right-0 bg-blue-500 rounded-t-md" style={{ height: '70%' }}></div>
                </div>
                <div className="absolute bottom-[-24px] left-0 right-0 flex justify-between text-xs text-gray-500">
                  <span>Mon</span>
                  <span>Tue</span>
                  <span>Wed</span>
                  <span>Thu</span>
                  <span>Fri</span>
                  <span>Sat</span>
                  <span>Sun</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Subject Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-80 flex flex-col justify-center">
              {/* This would be replaced with an actual chart component */}
              <div className="space-y-4">
                {subjectDistribution.map((item) => (
                  <div key={item.subject} className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm font-medium text-gray-700 dark:text-gray-300">{item.subject}</span>
                      <span className="text-sm text-gray-500 dark:text-gray-400">{item.percentage}%</span>
                    </div>
                    <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5">
                      <div 
                        className="bg-blue-600 h-2.5 rounded-full" 
                        style={{ width: `${item.percentage}%` }}
                      ></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Learning Style Insights</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-blue-50 dark:bg-blue-900/20 p-6 rounded-lg">
              <h4 className="font-bold text-lg text-blue-700 dark:text-blue-300">Visual Learner</h4>
              <p className="mt-2 text-gray-600 dark:text-gray-400">You tend to understand and retain information better when it's presented in visual formats like charts, diagrams, and videos.</p>
              <div className="mt-4 flex items-center">
                <div className="h-2 bg-blue-200 dark:bg-blue-800 rounded-full w-full">
                  <div className="h-2 bg-blue-600 rounded-full" style={{ width: '75%' }}></div>
                </div>
                <span className="ml-2 text-sm font-medium text-gray-700 dark:text-gray-300">75%</span>
              </div>
            </div>
            
            <div className="bg-purple-50 dark:bg-purple-900/20 p-6 rounded-lg">
              <h4 className="font-bold text-lg text-purple-700 dark:text-purple-300">Auditory Learner</h4>
              <p className="mt-2 text-gray-600 dark:text-gray-400">You benefit from listening to explanations and discussing concepts with others, making podcasts and discussions valuable.</p>
              <div className="mt-4 flex items-center">
                <div className="h-2 bg-purple-200 dark:bg-purple-800 rounded-full w-full">
                  <div className="h-2 bg-purple-600 rounded-full" style={{ width: '45%' }}></div>
                </div>
                <span className="ml-2 text-sm font-medium text-gray-700 dark:text-gray-300">45%</span>
              </div>
            </div>
            
            <div className="bg-teal-50 dark:bg-teal-900/20 p-6 rounded-lg">
              <h4 className="font-bold text-lg text-teal-700 dark:text-teal-300">Kinesthetic Learner</h4>
              <p className="mt-2 text-gray-600 dark:text-gray-400">You learn effectively through hands-on activities and practical applications, making interactive learning ideal for you.</p>
              <div className="mt-4 flex items-center">
                <div className="h-2 bg-teal-200 dark:bg-teal-800 rounded-full w-full">
                  <div className="h-2 bg-teal-600 rounded-full" style={{ width: '60%' }}></div>
                </div>
                <span className="ml-2 text-sm font-medium text-gray-700 dark:text-gray-300">60%</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default StudyPatternAnalysis;