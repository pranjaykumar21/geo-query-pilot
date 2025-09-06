import React from 'react';
import { motion } from 'framer-motion';
import { Loader2, Globe, Database, Zap } from 'lucide-react';

interface LoadingStateProps {
  message?: string;
  type?: 'query' | 'map' | 'data' | 'general';
  showProgress?: boolean;
  progress?: number;
}

const LoadingState: React.FC<LoadingStateProps> = ({ 
  message = "Processing request...",
  type = 'general',
  showProgress = false,
  progress = 0
}) => {
  const getLoadingConfig = (type: string) => {
    switch (type) {
      case 'query':
        return {
          icon: Zap,
          color: 'text-primary',
          gradient: 'bg-gradient-primary'
        };
      case 'map':
        return {
          icon: Globe,
          color: 'text-secondary',
          gradient: 'bg-gradient-secondary'
        };
      case 'data':
        return {
          icon: Database,
          color: 'text-accent',
          gradient: 'bg-gradient-purple'
        };
      default:
        return {
          icon: Loader2,
          color: 'text-primary',
          gradient: 'bg-gradient-primary'
        };
    }
  };

  const config = getLoadingConfig(type);
  const Icon = config.icon;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="flex flex-col items-center justify-center p-8 space-y-6"
    >
      {/* Animated Icon */}
      <motion.div
        animate={{ 
          rotate: type !== 'general' ? [0, 360] : 0,
          scale: [1, 1.1, 1]
        }}
        transition={{ 
          rotate: { duration: 2, repeat: Infinity, ease: "linear" },
          scale: { duration: 1.5, repeat: Infinity, ease: "easeInOut" }
        }}
        className={`w-16 h-16 rounded-xl ${config.gradient} flex items-center justify-center shadow-glow`}
      >
        <Icon className={`w-8 h-8 text-white ${type === 'general' ? 'animate-spin' : ''}`} />
      </motion.div>

      {/* Loading Message */}
      <div className="text-center space-y-2">
        <motion.h3 
          className="text-lg font-semibold text-foreground"
          animate={{ opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          {message}
        </motion.h3>
        
        {/* Animated dots */}
        <motion.div className="flex items-center justify-center space-x-1">
          {[0, 1, 2].map((i) => (
            <motion.div
              key={i}
              className="w-2 h-2 bg-primary rounded-full"
              animate={{ 
                scale: [1, 1.5, 1],
                opacity: [0.5, 1, 0.5]
              }}
              transition={{ 
                duration: 1.5,
                repeat: Infinity,
                delay: i * 0.2
              }}
            />
          ))}
        </motion.div>
      </div>

      {/* Progress Bar */}
      {showProgress && (
        <div className="w-64 space-y-2">
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>Progress</span>
            <span>{Math.round(progress)}%</span>
          </div>
          <div className="w-full bg-muted/20 rounded-full h-2 overflow-hidden">
            <motion.div
              className={config.gradient}
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.5, ease: "easeOut" }}
              style={{ height: '100%' }}
            />
          </div>
        </div>
      )}

      {/* Technical Details */}
      <div className="grid grid-cols-3 gap-4 text-center text-xs text-muted-foreground">
        <div>
          <div className="font-medium text-primary">Endpoint</div>
          <div>Active</div>
        </div>
        <div>
          <div className="font-medium text-secondary">Latency</div>
          <div>45ms</div>
        </div>
        <div>
          <div className="font-medium text-accent">Security</div>
          <div>256-bit</div>
        </div>
      </div>
    </motion.div>
  );
};

export default LoadingState;