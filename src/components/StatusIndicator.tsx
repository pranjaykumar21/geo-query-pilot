import React from 'react';
import { motion } from 'framer-motion';
import { Badge } from '@/components/ui/badge';
import { 
  CheckCircle, 
  AlertCircle, 
  Clock, 
  Zap,
  Shield,
  Activity
} from 'lucide-react';

interface StatusIndicatorProps {
  status: 'operational' | 'warning' | 'error' | 'maintenance';
  metric?: {
    value: string;
    label: string;
  };
  className?: string;
}

const StatusIndicator: React.FC<StatusIndicatorProps> = ({ 
  status, 
  metric,
  className = ""
}) => {
  const getStatusConfig = (status: string) => {
    switch (status) {
      case 'operational':
        return {
          icon: CheckCircle,
          color: 'success',
          bgColor: 'bg-success/10',
          borderColor: 'border-success/30',
          pulse: true
        };
      case 'warning':
        return {
          icon: AlertCircle,
          color: 'warning',
          bgColor: 'bg-warning/10',
          borderColor: 'border-warning/30',
          pulse: false
        };
      case 'error':
        return {
          icon: AlertCircle,
          color: 'destructive',
          bgColor: 'bg-destructive/10',
          borderColor: 'border-destructive/30',
          pulse: false
        };
      case 'maintenance':
        return {
          icon: Clock,
          color: 'muted',
          bgColor: 'bg-muted/10',
          borderColor: 'border-muted/30',
          pulse: false
        };
      default:
        return {
          icon: Activity,
          color: 'primary',
          bgColor: 'bg-primary/10',
          borderColor: 'border-primary/30',
          pulse: true
        };
    }
  };

  const config = getStatusConfig(status);
  const Icon = config.icon;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      className={`flex items-center space-x-3 ${className}`}
    >
      <div className={`
        w-8 h-8 rounded-full flex items-center justify-center
        ${config.bgColor} ${config.borderColor} border
        ${config.pulse ? 'animate-pulse' : ''}
      `}>
        <Icon className={`w-4 h-4 text-${config.color}`} />
      </div>
      
      {metric && (
        <div className="flex flex-col">
          <span className="text-sm font-semibold text-foreground">
            {metric.value}
          </span>
          <span className="text-xs text-muted-foreground">
            {metric.label}
          </span>
        </div>
      )}
    </motion.div>
  );
};

export default StatusIndicator;