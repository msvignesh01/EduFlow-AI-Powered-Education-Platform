import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  BookOpen,
  Clock,
  Award,
  Zap,
  BarChart,
  TrendingUp,
  Target,
  ArrowRight,
  Plus,
  Brain,
  RefreshCw,
  Download,
  Share
} from 'lucide-react';
import { Card } from '../components/ui/Card';
import { StatCard } from '../components/ui/StatCard';
import { Button } from '../components/ui/Button';
import { StatCard as StatCardType } from '../types';
import { PremiumSkeleton } from '../components/animations/PremiumLoader';
import { useAuthStore } from '../store/authStore';
import {
  StaggerContainer,
  StaggerItem
} from '../components/animations/MotionWrapper';
import {
  FloatingBrain
} from '../components/animations/AnimatedIcons';
import { cn, responsive } from '../utils/cn';
import { useResponsive } from '../hooks/useResponsive';
import { SEOHead, seoConfigs } from '../components/seo/SEOHead';

export const Dashboard: React.FC = () => {
  const [isLoading, setIsLoading] = useState(true);
  const { user, isAuthenticated } = useAuthStore();
  const { isLaptop, isDesktop, isLargeDesktop, isUltraWide, is4K } = useResponsive();

  useEffect(() => {
    // Simulate loading data
    const timer = setTimeout(() => setIsLoading(false), 1000);
    return () => clearTimeout(timer);
  }, []);

  const stats: StatCardType[] = [
    {
      title: 'Total Study Hours',
      value: '42.5',
      change: { value: 12, type: 'increase' },
      icon: <Clock size={24} className="text-blue-600 dark:text-blue-400" />
    },
    {
      title: 'Courses Completed',
      value: '7',
      change: { value: 2, type: 'increase' },
      icon: <BookOpen size={24} className="text-purple-600 dark:text-purple-400" />
    },
    {
      title: 'Current Streak',
      value: '12 days',
      change: { value: 4, type: 'increase' },
      icon: <Zap size={24} className="text-yellow-600 dark:text-yellow-400" />
    },
    {
      title: 'Achievement Points',
      value: '1,240',
      change: { value: 8, type: 'increase' },
      icon: <Award size={24} className="text-emerald-600 dark:text-emerald-400" />
    }
  ];

  if (isLoading) {
    return (
      <motion.div
        className="space-y-8"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <div className="flex flex-col md:flex-row md:items-center md:justify-between">
          <div className="space-y-3">
            <PremiumSkeleton className="h-10 w-64" />
            <PremiumSkeleton className="h-5 w-96" />
          </div>
          <PremiumSkeleton className="h-12 w-40 mt-4 md:mt-0" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {Array.from({ length: 4 }).map((_, i) => (
            <motion.div
              key={i}
              className="premium-card p-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
            >
              <PremiumSkeleton lines={3} />
            </motion.div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {Array.from({ length: 2 }).map((_, i) => (
            <motion.div
              key={i}
              className="premium-card p-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 + i * 0.1 }}
            >
              <PremiumSkeleton lines={5} />
            </motion.div>
          ))}
        </div>
      </motion.div>
    );
  }

  return (
    <>
      <SEOHead {...seoConfigs.dashboard} />
      <StaggerContainer className="space-y-8">
      {/* Hero Section */}
      <StaggerItem>
        <motion.div
          className={cn(
            'relative overflow-hidden rounded-3xl bg-gradient-to-br from-blue-600 via-purple-600 to-pink-600 text-white',
            responsive.spacing.component
          )}
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6 }}
        >
          {/* Background Pattern */}
          <div className="absolute inset-0 bg-gradient-mesh opacity-20" />
          <div className="absolute inset-0 bg-black/10" />
          
          {/* Additional floating brains in background */}
          <div className="absolute inset-0 overflow-hidden">
            <motion.div
              className="absolute top-4 right-16 opacity-10"
              animate={{ 
                y: [0, -20, 0],
                rotate: [0, 360]
              }}
              transition={{ 
                duration: 8, 
                repeat: Infinity, 
                ease: "easeInOut" 
              }}
            >
              <FloatingBrain size={32} className="text-white" />
            </motion.div>
            <motion.div
              className="absolute bottom-8 left-12 opacity-15"
              animate={{ 
                y: [0, -15, 0],
                rotate: [0, -360]
              }}
              transition={{ 
                duration: 10, 
                repeat: Infinity, 
                ease: "easeInOut",
                delay: 2
              }}
            >
              <FloatingBrain size={24} className="text-white" />
            </motion.div>
            <motion.div
              className="absolute top-12 left-1/3 opacity-10"
              animate={{ 
                y: [0, -25, 0],
                rotate: [0, 180]
              }}
              transition={{ 
                duration: 12, 
                repeat: Infinity, 
                ease: "easeInOut",
                delay: 4
              }}
            >
              <FloatingBrain size={28} className="text-white" />
            </motion.div>
          </div>

          <div className={cn(
            'relative z-10',
            responsive.flex.responsive,
            'space-y-0'
          )}>
            <div className={cn(
              'flex items-center space-x-4'
            )}>
              {/* Multiple floating brains for better visual interest */}
              <div className="flex space-x-3">
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                >
                  <FloatingBrain
                    size={48}
                    className="text-white"
                  />
                </motion.div>
                <motion.div
                  animate={{ rotate: -360 }}
                  transition={{ duration: 25, repeat: Infinity, ease: "linear", delay: 1 }}
                >
                  <FloatingBrain
                    size={36}
                    className="text-blue-200"
                  />
                </motion.div>
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 30, repeat: Infinity, ease: "linear", delay: 2 }}
                >
                  <FloatingBrain
                    size={28}
                    className="text-purple-200"
                  />
                </motion.div>
              </div>
              <div>
                <motion.h1
                  className={cn(
                    'font-bold mb-2',
                    responsive.text.hero
                  )}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.2 }}
                >
                  {isAuthenticated ? `Welcome back, ${user?.username}!` : 'Welcome to EduLearn'}
                </motion.h1>
                <motion.p
                  className={cn(
                    'text-blue-100',
                    responsive.text.base
                  )}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.3 }}
                >
                  {isAuthenticated
                    ? "Ready to continue your learning journey?"
                    : "Transform your learning experience with AI-powered tools."
                  }
                </motion.p>
              </div>
            </div>

            <motion.div
              initial={{ opacity: 0, x: 20, y: 0 }}
              animate={{ opacity: 1, x: 0, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              <Button
                variant="glass"
                size="lg"
                rightIcon={<ArrowRight size={20} />}
                className="text-white border-white/30 hover:bg-white/20"
              >
                {isAuthenticated ? 'Start Learning' : 'Get Started'}
              </Button>
            </motion.div>
          </div>
        </motion.div>
      </StaggerItem>

      {/* Enhanced Stats Grid */}
      <StaggerItem>
        <div className={cn(
          'grid gap-4 sm:gap-6 lg:gap-8',
          // Much better responsive grid layout
          'grid-cols-2 sm:grid-cols-2 lg:grid-cols-4',
          isLaptop ? 'xl:grid-cols-4' :
          isDesktop ? '2xl:grid-cols-4' :
          isLargeDesktop ? '2xl:grid-cols-6' :
          isUltraWide ? '2xl:grid-cols-8' :
          is4K ? '2xl:grid-cols-8' : ''
        )}>
          {stats.map((stat, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.5 + index * 0.1 }}
            >
              <StatCard
                data={{
                  title: stat.title,
                  value: stat.value,
                  change: {
                    value: stat.change?.value || 0,
                    type: stat.change?.type || 'increase',
                  },
                  icon: stat.icon || <BarChart size={24} className="text-gray-600 dark:text-gray-400" />,
                }}
              />
            </motion.div>
          ))}
        </div>
      </StaggerItem>

      {/* Enhanced Interactive Charts Section */}
      <StaggerItem>
        <div className={cn(
          'grid gap-6 lg:gap-8',
          // Better responsive chart layout
          'grid-cols-1 lg:grid-cols-2',
          isLargeDesktop ? 'xl:grid-cols-2' :
          isUltraWide ? '2xl:grid-cols-3' :
          is4K ? '2xl:grid-cols-4' : ''
        )}>
          <Card className="p-4 lg:p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg lg:text-xl font-semibold text-gray-900 dark:text-white">
                Weekly Study Hours
              </h3>
              <div className="flex items-center space-x-2">
                <Button
                  variant="ghost"
                  size="sm"
                  leftIcon={<RefreshCw size={14} />}
                  onClick={() => console.log('Refreshing chart data...')}
                >
                  Refresh
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  leftIcon={<Download size={14} />}
                  onClick={() => console.log('Exporting chart...')}
                >
                  Export
                </Button>
              </div>
            </div>
                <motion.div
                  className={cn(
                    'relative bg-gradient-to-br from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 rounded-xl overflow-hidden',
                    'h-48 lg:h-64'
                  )}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.5, delay: 1.2 }}
                >
                  <div className="absolute inset-0 bg-gradient-mesh opacity-10" />
                  {/* Floating brain decoration */}
                  <motion.div
                    className="absolute top-4 right-4 opacity-20"
                    animate={{ 
                      y: [0, -10, 0],
                      rotate: [0, 180, 360]
                    }}
                    transition={{ 
                      duration: 6, 
                      repeat: Infinity, 
                      ease: "easeInOut" 
                    }}
                  >
                    <FloatingBrain size={20} className="text-blue-500" />
                  </motion.div>
                  <div className="relative z-10 flex justify-center items-center h-full">
                    <div className="text-center">
                      <motion.div
                        animate={{
                          scale: [1, 1.1, 1],
                          rotate: [0, 5, -5, 0]
                        }}
                        transition={{
                          duration: 4,
                          repeat: Infinity,
                          ease: "easeInOut"
                        }}
                      >
                        <BarChart
                          size={48}
                          className="mx-auto text-blue-500"
                        />
                      </motion.div>
                      <motion.p
                        className={cn(
                          'mt-4 text-gray-600 dark:text-gray-400',
                          responsive.text.xs
                        )}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 1.4 }}
                      >
                        Interactive chart visualization
                      </motion.p>
                      <motion.div
                        className={cn(
                          'mt-2 flex justify-center space-x-2'
                        )}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 1.6 }}
                      >
                        {[1, 2, 3, 4, 5].map((i) => (
                          <motion.div
                            key={i}
                            className={cn(
                              'bg-blue-500 rounded-full w-2'
                            )}
                            animate={{
                              height: [20, 40, 30, 50, 25][i-1]
                            }}
                            transition={{
                              duration: 2,
                              repeat: Infinity,
                              delay: i * 0.2,
                              ease: "easeInOut"
                            }}
                          />
                        ))}
                      </motion.div>
                    </div>
                  </div>
                </motion.div>
          </Card>

          <Card className="p-4 lg:p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg lg:text-xl font-semibold text-gray-900 dark:text-white">
                Learning Progress
              </h3>
              <div className="flex items-center space-x-2">
                <Button
                  variant="ghost"
                  size="sm"
                  leftIcon={<TrendingUp size={14} />}
                  onClick={() => console.log('Viewing progress details...')}
                >
                  Details
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  leftIcon={<Share size={14} />}
                  onClick={() => console.log('Sharing progress...')}
                >
                  Share
                </Button>
              </div>
            </div>
            <motion.div
              className={cn(
                'relative bg-gradient-to-br from-emerald-50 to-blue-50 dark:from-emerald-900/20 dark:to-blue-900/20 rounded-xl overflow-hidden',
                'h-48 lg:h-64'
              )}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 1.4 }}
            >
              <div className="absolute inset-0 bg-gradient-mesh opacity-10" />
              {/* Floating brain decoration */}
              <motion.div
                className="absolute bottom-4 left-4 opacity-20"
                animate={{ 
                  y: [0, -12, 0],
                  rotate: [0, -180, -360]
                }}
                transition={{ 
                  duration: 7, 
                  repeat: Infinity, 
                  ease: "easeInOut",
                  delay: 1
                }}
              >
                <FloatingBrain size={18} className="text-emerald-500" />
              </motion.div>
              <div className="relative z-10 flex justify-center items-center h-full">
                <div className="text-center">
                  <motion.div
                    animate={{
                      y: [0, -10, 0],
                      rotate: [0, 2, -2, 0]
                    }}
                    transition={{
                      duration: 3,
                      repeat: Infinity,
                      ease: "easeInOut"
                    }}
                  >
                    <TrendingUp
                      size={48}
                      className="mx-auto text-emerald-500"
                    />
                  </motion.div>
                  <motion.p
                    className={cn(
                      'mt-4 text-gray-600 dark:text-gray-400',
                      responsive.text.xs
                    )}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 1.6 }}
                  >
                    Progress tracking visualization
                  </motion.p>
                  <motion.div
                    className="mt-4 w-32 h-2 bg-gray-200 dark:bg-gray-700 rounded-full mx-auto overflow-hidden"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 1.8 }}
                  >
                    <motion.div
                      className="h-full bg-gradient-to-r from-emerald-500 to-blue-500 rounded-full"
                      initial={{ width: 0 }}
                      animate={{ width: "75%" }}
                      transition={{ duration: 2, delay: 2 }}
                    />
                  </motion.div>
                </div>
              </div>
            </motion.div>
          </Card>
        </div>
      </StaggerItem>

      {/* Enhanced Recent Activity Section */}
      <StaggerItem>
        <div className={cn(
          'grid gap-4 lg:gap-6 grid-cols-1 lg:grid-cols-3'
        )}>
          <Card
            className="lg:col-span-2 hover:shadow-lg transition-shadow cursor-pointer"
            onClick={() => console.log('Viewing all activities...')}
          >
            <div className="p-4 lg:p-6">
              <motion.div
                className="flex items-center justify-between mb-6"
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
              >
                <div className="flex items-center space-x-3">
                  <motion.div
                    className="p-2 rounded-xl bg-purple-100 dark:bg-purple-900/20"
                    whileHover={{ scale: 1.1, rotate: 5 }}
                  >
                    <Clock size={24} className="text-purple-500" />
                  </motion.div>
                  <div>
                    <h3 className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                      Recent Activity
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Your latest learning sessions
                    </p>
                  </div>
                </div>

                <Button
                  variant="ghost"
                  size="sm"
                  rightIcon={<ArrowRight size={14} />}
                  onClick={() => console.log('Viewing all activities...')}
                >
                  View All
                </Button>
              </motion.div>
                <div className="space-y-4">
                  {[
                    { title: "Completed React Fundamentals", time: "2 hours ago", type: "course" },
                    { title: "Generated Study Notes", time: "5 hours ago", type: "ai" },
                    { title: "JavaScript Quiz - 95%", time: "1 day ago", type: "quiz" }
                  ].map((activity, index) => (
                    <Card
                      key={index}
                      className="group p-4 cursor-pointer hover:shadow-lg transition-shadow"
                      onClick={() => console.log(`Viewing ${activity.title}...`)}
                    >
                      <div className="flex items-start space-x-4">
                        <motion.div
                          className={cn(
                            "p-2 rounded-full",
                            activity.type === 'course' && "bg-blue-100 dark:bg-blue-900/20",
                            activity.type === 'ai' && "bg-purple-100 dark:bg-purple-900/20",
                            activity.type === 'quiz' && "bg-emerald-100 dark:bg-emerald-900/20"
                          )}
                          whileHover={{ scale: 1.1, rotate: 5 }}
                        >
                          {activity.type === 'course' && <BookOpen size={20} className="text-blue-600 dark:text-blue-400" />}
                          {activity.type === 'ai' && <Brain size={20} className="text-purple-600 dark:text-purple-400" />}
                          {activity.type === 'quiz' && <Target size={20} className="text-emerald-600 dark:text-emerald-400" />}
                        </motion.div>
                        <div className="flex-1">
                          <motion.h4
                            className="text-sm font-medium text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 2.4 + index * 0.1 }}
                          >
                            {activity.title}
                          </motion.h4>
                          <motion.p
                            className="mt-1 text-xs text-gray-500 dark:text-gray-400"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 2.5 + index * 0.1 }}
                          >
                            {activity.time}
                          </motion.p>
                        </div>
                        <motion.div
                          className="opacity-0 group-hover:opacity-100 transition-opacity"
                          initial={{ opacity: 0, x: 10 }}
                          animate={{ opacity: 0, x: 0 }}
                          whileHover={{ opacity: 1, x: 0 }}
                        >
                          <ArrowRight size={16} className="text-gray-400" />
                        </motion.div>
                      </div>
                    </Card>
                  ))}
                </div>
            </div>
          </Card>

          <Card className="p-4 lg:p-6 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm">
            <motion.div
              className="flex items-center justify-between mb-6"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
            >
              <div className="flex items-center space-x-3">
                <motion.div
                  className="p-2 rounded-xl bg-green-100 dark:bg-green-900/20"
                  whileHover={{ scale: 1.1, rotate: 5 }}
                >
                  <Plus size={24} className="text-green-500" />
                </motion.div>
                <div>
                  <h3 className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                    Quick Actions
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Start learning now
                  </p>
                </div>
              </div>
            </motion.div>

            <div className="space-y-3">
              {[
                { title: "Generate Study Notes", icon: Brain, color: "purple" },
                { title: "Take Practice Quiz", icon: Target, color: "blue" },
                { title: "Start New Course", icon: BookOpen, color: "emerald" },
                { title: "Review Progress", icon: TrendingUp, color: "orange" }
              ].map((action, index) => (
                <Button
                  key={index}
                  variant="glass"
                  size="md"
                  fullWidth
                  leftIcon={
                    React.createElement(action.icon, {
                      size: 16,
                      className: cn(
                        action.color === 'purple' && "text-purple-600 dark:text-purple-400",
                        action.color === 'blue' && "text-blue-600 dark:text-blue-400",
                        action.color === 'emerald' && "text-emerald-600 dark:text-emerald-400",
                        action.color === 'orange' && "text-orange-600 dark:text-orange-400"
                      )
                    })
                  }
                  rightIcon={<ArrowRight size={14} />}
                  onClick={() => console.log(`${action.title} clicked!`)}
                  className="justify-start"
                >
                  {action.title}
                </Button>
              ))}
            </div>
          </Card>
        </div>
      </StaggerItem>
    </StaggerContainer>
    </>
  );
};