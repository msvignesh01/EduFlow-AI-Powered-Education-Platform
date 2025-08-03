// AI Service Status Component
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Wifi, 
  WifiOff, 
  Brain, 
  Zap, 
  Server, 
  RefreshCw,
  CheckCircle,
  XCircle,
  AlertTriangle
} from 'lucide-react';
import { useHybridAI } from '../../hooks/useHybridAI';
import { NetworkStatus } from '../../lib/hybridAIService';

interface AIServiceStatusProps {
  variant?: 'compact' | 'detailed' | 'minimal';
  showRefresh?: boolean;
  autoRefresh?: boolean;
  className?: string;
}

export const AIServiceStatus = ({ 
  variant = 'compact',
  showRefresh = true,
  autoRefresh = true,
  className = ''
}: AIServiceStatusProps) => {
  const { 
    networkStatus, 
    refreshStatus, 
    isOnline, 
    hasAnyAI, 
    bestAvailableModel 
  } = useHybridAI({ autoHealthCheck: autoRefresh });

  const [isRefreshing, setIsRefreshing] = useState(false);
  const [lastRefresh, setLastRefresh] = useState<number>(0);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    try {
      await refreshStatus();
      setLastRefresh(Date.now());
    } catch (error) {
      console.error('Failed to refresh AI status:', error);
    } finally {
      setIsRefreshing(false);
    }
  };

  const getServiceIcon = (isAvailable: boolean, isLoading = false) => {
    if (isLoading) return <RefreshCw className="w-4 h-4 animate-spin" />;
    return isAvailable ? 
      <CheckCircle className="w-4 h-4 text-green-500" /> : 
      <XCircle className="w-4 h-4 text-red-500" />;
  };

  const getOverallStatus = () => {
    if (!isOnline) return { status: 'offline', color: 'text-red-500', icon: WifiOff };
    if (!hasAnyAI) return { status: 'no-ai', color: 'text-yellow-500', icon: AlertTriangle };
    return { status: 'online', color: 'text-green-500', icon: Wifi };
  };

  const overallStatus = getOverallStatus();

  if (variant === 'minimal') {
    return (
      <div className={`flex items-center space-x-2 ${className}`}>
        <overallStatus.icon className={`w-4 h-4 ${overallStatus.color}`} />
        <span className={`text-sm ${overallStatus.color}`}>
          {bestAvailableModel}
        </span>
      </div>
    );
  }

  if (variant === 'compact') {
    return (
      <motion.div 
        className={`bg-white/10 dark:bg-black/10 backdrop-blur-md rounded-xl p-3 border border-white/20 dark:border-white/10 ${className}`}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center space-x-2">
            <Brain className="w-5 h-5 text-primary-500" />
            <span className="font-medium text-sm">AI Services</span>
          </div>
          {showRefresh && (
            <button
              onClick={handleRefresh}
              disabled={isRefreshing}
              className="p-1 hover:bg-white/10 rounded-lg transition-colors"
            >
              <RefreshCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin' : ''}`} />
            </button>
          )}
        </div>

        <div className="space-y-1">
          <div className="flex items-center justify-between text-xs">
            <span>Best Available:</span>
            <span className={`font-medium ${overallStatus.color}`}>
              {bestAvailableModel}
            </span>
          </div>
          
          <div className="flex items-center space-x-4 text-xs">
            <div className="flex items-center space-x-1">
              {getServiceIcon(networkStatus.isGeminiAvailable)}
              <span>Gemini</span>
            </div>
            
            <div className="flex items-center space-x-1">
              {getServiceIcon(networkStatus.isGemmaAPIAvailable)}
              <span>Gemma API</span>
            </div>
            
            <div className="flex items-center space-x-1">
              {getServiceIcon(networkStatus.isOllamaAvailable)}
              <span>Local</span>
            </div>
          </div>
        </div>
      </motion.div>
    );
  }

  // Detailed variant
  return (
    <motion.div 
      className={`bg-white/10 dark:bg-black/10 backdrop-blur-md rounded-xl p-4 border border-white/20 dark:border-white/10 ${className}`}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-2">
          <Brain className="w-6 h-6 text-primary-500" />
          <div>
            <h3 className="font-medium">AI Service Status</h3>
            <p className="text-xs text-gray-600 dark:text-gray-400">
              Last updated: {lastRefresh ? new Date(lastRefresh).toLocaleTimeString() : 'Never'}
            </p>
          </div>
        </div>
        {showRefresh && (
          <button
            onClick={handleRefresh}
            disabled={isRefreshing}
            className="p-2 hover:bg-white/10 rounded-lg transition-colors"
          >
            <RefreshCw className={`w-5 h-5 ${isRefreshing ? 'animate-spin' : ''}`} />
          </button>
        )}
      </div>

      <div className="space-y-3">
        {/* Overall Status */}
        <div className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
          <div className="flex items-center space-x-2">
            <overallStatus.icon className={`w-5 h-5 ${overallStatus.color}`} />
            <span className="font-medium">Overall Status</span>
          </div>
          <span className={`text-sm ${overallStatus.color}`}>
            {isOnline ? (hasAnyAI ? 'Operational' : 'Limited') : 'Offline'}
          </span>
        </div>

        {/* Individual Services */}
        <div className="space-y-2">
          <ServiceRow
            icon={<Zap className="w-4 h-4" />}
            name="Gemini 2.0 Flash"
            description="Primary online AI"
            isAvailable={networkStatus.isGeminiAvailable}
            isOnline={isOnline}
          />
          
          <ServiceRow
            icon={<Brain className="w-4 h-4" />}
            name="Gemma 3 API"
            description="Secondary online AI"
            isAvailable={networkStatus.isGemmaAPIAvailable}
            isOnline={isOnline}
          />
          
          <ServiceRow
            icon={<Server className="w-4 h-4" />}
            name="Gemma 3 Local"
            description="Offline AI (Ollama)"
            isAvailable={networkStatus.isOllamaAvailable}
            isOnline={true} // Local doesn't depend on internet
          />
        </div>

        {/* Current Selection */}
        <div className="mt-4 p-3 bg-primary-500/10 rounded-lg border border-primary-500/20">
          <div className="flex items-center space-x-2">
            <CheckCircle className="w-4 h-4 text-primary-500" />
            <span className="text-sm font-medium">Currently Using:</span>
            <span className="text-sm text-primary-600 dark:text-primary-400">
              {bestAvailableModel}
            </span>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

interface ServiceRowProps {
  icon: React.ReactNode;
  name: string;
  description: string;
  isAvailable: boolean;
  isOnline: boolean;
}

const ServiceRow = ({ icon, name, description, isAvailable, isOnline }: ServiceRowProps) => {
  const getStatus = () => {
    if (!isOnline) return { text: 'Offline', color: 'text-gray-500' };
    if (isAvailable) return { text: 'Available', color: 'text-green-500' };
    return { text: 'Unavailable', color: 'text-red-500' };
  };

  const status = getStatus();

  return (
    <div className="flex items-center justify-between p-2 hover:bg-white/5 rounded-lg transition-colors">
      <div className="flex items-center space-x-3">
        <div className="text-gray-600 dark:text-gray-400">
          {icon}
        </div>
        <div>
          <div className="text-sm font-medium">{name}</div>
          <div className="text-xs text-gray-600 dark:text-gray-400">{description}</div>
        </div>
      </div>
      <div className="flex items-center space-x-2">
        {getServiceIcon(isAvailable)}
        <span className={`text-xs ${status.color}`}>{status.text}</span>
      </div>
    </div>
  );
};

export default AIServiceStatus;
