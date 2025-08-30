import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, Settings, Eye, EyeOff, Map, BarChart3, Box } from 'lucide-react';
import { useStore } from '../stores/useStore';
import { apiService } from '../services/apiService';
import { Button } from './ui/button';
import { Input } from './ui/input';

const CommandBar: React.FC = () => {
  const { 
    uiState, 
    conversationHistory, 
    addMessage, 
    startQuery, 
    endQuery,
    setViewMode,
    togglePrivacyMode,
    resetToDelhi
  } = useStore();

  const [inputValue, setInputValue] = useState('');

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputValue.trim() || uiState.isLoading) return;

    const query = inputValue.trim();
    setInputValue('');

    // Add user message
    addMessage({
      type: 'user',
      content: query,
    });

    // Start loading state
    startQuery();

    try {
      // Call API
      const result = await apiService.postQuery(query, conversationHistory);
      
      if (result) {
        // Add assistant response
        addMessage({
          type: 'assistant',
          content: `Found ${result.features?.length || 0} results for "${query}". The map has been updated with the visualization.`,
          data: result,
        });
        
        // Update query results
        endQuery(result);
      } else {
        addMessage({
          type: 'assistant',
          content: 'Sorry, I encountered an error processing your query. Please try again.',
        });
        endQuery(null);
      }
    } catch (error) {
      console.error('Query error:', error);
      addMessage({
        type: 'assistant',
        content: 'Sorry, I encountered an error processing your query. Please try again.',
      });
      endQuery(null);
    }
  };

  // View mode buttons
  const viewModeButtons = [
    { mode: 'markers' as const, icon: Map, label: 'Markers' },
    { mode: 'heatmap' as const, icon: BarChart3, label: 'Heatmap' },
    { mode: '3d' as const, icon: Box, label: '3D' },
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 z-20 p-4">
      <div className="max-w-4xl mx-auto">
        {/* Chat Messages */}
        <AnimatePresence>
          {conversationHistory.slice(-3).map((message, index) => {
            if (message.type === 'assistant' && index === conversationHistory.length - 1) {
              return (
                <motion.div
                  key={message.id}
                  initial={{ opacity: 0, y: 20, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -20, scale: 0.95 }}
                  transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                  className="mb-4"
                >
                  <div className="chat-bubble assistant rounded-2xl p-4 max-w-lg">
                    <div className="flex items-start space-x-3">
                      <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center flex-shrink-0">
                        <span className="text-xs font-bold text-primary-foreground">AI</span>
                      </div>
                      <div className="flex-1">
                        <p className="text-sm text-foreground leading-relaxed">
                          {message.content}
                        </p>
                        <div className="mt-2 text-xs text-muted-foreground font-mono">
                          {message.timestamp.toLocaleTimeString()}
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              );
            }
            return null;
          })}
        </AnimatePresence>

        {/* Command Interface */}
        <motion.div
          initial={{ opacity: 0, y: 100 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ type: 'spring', stiffness: 300, damping: 30 }}
          className="command-panel rounded-2xl p-6"
        >
          {/* Controls Row */}
          <div className="flex items-center justify-between mb-4">
            {/* View Mode Controls */}
            <div className="flex items-center space-x-2">
              <span className="text-sm font-medium text-muted-foreground mr-2">View:</span>
              {viewModeButtons.map(({ mode, icon: Icon, label }) => (
                <Button
                  key={mode}
                  variant={uiState.viewMode === mode ? "default" : "ghost"}
                  size="sm"
                  onClick={() => setViewMode(mode)}
                  className="h-8 px-3"
                >
                  <Icon className="w-4 h-4 mr-1" />
                  {label}
                </Button>
              ))}
            </div>

            {/* Privacy & Settings */}
            <div className="flex items-center space-x-2">
              <Button
                variant={uiState.isPrivacyMode ? "default" : "ghost"}
                size="sm"
                onClick={togglePrivacyMode}
                className="h-8 px-3"
              >
                {uiState.isPrivacyMode ? (
                  <EyeOff className="w-4 h-4 mr-1" />
                ) : (
                  <Eye className="w-4 h-4 mr-1" />
                )}
                Privacy
              </Button>
              
              <Button
                variant="ghost"
                size="sm"
                onClick={resetToDelhi}
                className="h-8 px-3"
              >
                <Settings className="w-4 h-4 mr-1" />
                Reset
              </Button>
            </div>
          </div>

          {/* Query Input */}
          <form onSubmit={handleSubmit} className="flex items-center space-x-3">
            <div className="flex-1 relative">
              <Input
                type="text"
                placeholder="Ask about locations, demographics, or spatial patterns..."
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                disabled={uiState.isLoading}
                className="h-12 pl-4 pr-4 bg-input/50 border-border/50 backdrop-blur text-foreground placeholder:text-muted-foreground focus:ring-2 focus:ring-primary/50 focus:border-primary/50 transition-all duration-300"
              />
              {uiState.isLoading && (
                <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                  <div className="w-5 h-5 border-2 border-primary/30 border-t-primary rounded-full animate-spin"></div>
                </div>
              )}
            </div>
            
            <Button
              type="submit"
              disabled={!inputValue.trim() || uiState.isLoading}
              className="h-12 px-6 bg-primary hover:bg-primary-glow text-primary-foreground font-medium transition-all duration-300 shadow-lg hover:shadow-glow"
            >
              <Send className="w-5 h-5" />
            </Button>
          </form>

          {/* Status Bar */}
          <div className="mt-4 flex items-center justify-between text-xs text-muted-foreground font-mono">
            <div>
              GeoQuery-NLP Command Center v1.0
            </div>
            <div className="flex items-center space-x-4">
              <span>Mode: {uiState.viewMode.toUpperCase()}</span>
              {uiState.isPrivacyMode && <span>🔒 Privacy Enabled</span>}
              <span className="text-success">● Connected</span>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default CommandBar;