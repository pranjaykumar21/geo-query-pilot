import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, MapPin, BarChart3, Users, Building, Navigation } from 'lucide-react';
import { useStore } from '../stores/useStore';
import { Button } from './ui/button';

const FocusView: React.FC = () => {
  const { uiState, clearFocus } = useStore();
  const { focusedObject } = uiState;

  if (!focusedObject) return null;

  const { properties, geometry } = focusedObject;
  const [lng, lat] = geometry.coordinates;

  // Organize properties for display
  const getIcon = (key: string) => {
    switch (key.toLowerCase()) {
      case 'population':
      case 'people':
      case 'residents':
        return Users;
      case 'business_type':
      case 'category':
      case 'type':
        return Building;
      case 'transport_type':
      case 'transport':
        return Navigation;
      default:
        return BarChart3;
    }
  };

  const formatValue = (key: string, value: any) => {
    if (typeof value === 'number') {
      if (key.toLowerCase().includes('population') || key.toLowerCase().includes('revenue')) {
        return value.toLocaleString();
      }
      if (key.toLowerCase().includes('density')) {
        return `${value.toLocaleString()}/km²`;
      }
      if (key.toLowerCase().includes('percent') || key.toLowerCase().includes('rate')) {
        return `${value.toFixed(1)}%`;
      }
      return value.toLocaleString();
    }
    return String(value);
  };

  // Filter and organize properties
  const importantProps = Object.entries(properties)
    .filter(([key]) => !['id', 'name'].includes(key))
    .slice(0, 8);

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, x: 100, scale: 0.95 }}
        animate={{ opacity: 1, x: 0, scale: 1 }}
        exit={{ opacity: 0, x: 100, scale: 0.95 }}
        transition={{ 
          type: 'spring', 
          stiffness: 300, 
          damping: 30,
          opacity: { duration: 0.2 }
        }}
        className="fixed top-4 right-4 z-30 w-80"
      >
        <div className="glass rounded-2xl p-6 shadow-glass">
          {/* Header */}
          <div className="flex items-start justify-between mb-4">
            <div className="flex-1">
              <h3 className="text-lg font-semibold text-foreground mb-1">
                {properties.name || 'Selected Location'}
              </h3>
              <div className="flex items-center text-sm text-muted-foreground font-mono">
                <MapPin className="w-4 h-4 mr-1" />
                {lat.toFixed(4)}, {lng.toFixed(4)}
              </div>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={clearFocus}
              className="h-8 w-8 p-0 hover:bg-glass-hover"
            >
              <X className="w-4 h-4" />
            </Button>
          </div>

          {/* Properties Grid */}
          <div className="space-y-3">
            {importantProps.map(([key, value], index) => {
              const Icon = getIcon(key);
              return (
                <motion.div
                  key={key}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="flex items-center justify-between p-3 rounded-lg bg-card/30 border border-border/30"
                >
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                      <Icon className="w-4 h-4 text-primary" />
                    </div>
                    <div>
                      <div className="text-sm font-medium text-foreground capitalize">
                        {key.replace(/_/g, ' ')}
                      </div>
                    </div>
                  </div>
                  <div className="text-sm font-mono text-muted-foreground">
                    {formatValue(key, value)}
                  </div>
                </motion.div>
              );
            })}
          </div>

          {/* Quick Stats */}
          {properties.value && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="mt-4 p-4 rounded-xl bg-gradient-primary/10 border border-primary/20"
            >
              <div className="text-center">
                <div className="text-2xl font-bold text-primary mb-1">
                  {formatValue('value', properties.value)}
                </div>
                <div className="text-xs text-primary/80 font-medium uppercase tracking-wide">
                  Primary Value
                </div>
              </div>
            </motion.div>
          )}

          {/* Category Badge */}
          {properties.category && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="mt-4 flex justify-center"
            >
              <div className="px-3 py-1 rounded-full bg-accent/20 border border-accent/40 text-xs font-medium text-accent uppercase tracking-wide">
                {properties.category}
              </div>
            </motion.div>
          )}
        </div>
      </motion.div>
    </AnimatePresence>
  );
};

export default FocusView;