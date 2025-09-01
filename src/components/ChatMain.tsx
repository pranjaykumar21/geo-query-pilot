import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, Bot, User, Loader2, Map, X, Info, Eye, EyeOff, Settings, RotateCcw } from 'lucide-react';
import { useStore } from '../stores/useStore';
import { apiService } from '../services/apiService';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { ScrollArea } from './ui/scroll-area';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import SystemInfoModal from './SystemInfoModal';

const ChatMain: React.FC = () => {
  const { 
    uiState, 
    conversationHistory, 
    addMessage, 
    startQuery, 
    endQuery,
    setShowMapPanel,
    setShowSystemInfo,
    setAwaitingMapDecision,
    setViewMode,
    togglePrivacyMode,
    resetToDelhi
  } = useStore();

  const [inputValue, setInputValue] = useState('');
  const scrollAreaRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    if (scrollAreaRef.current) {
      const scrollContainer = scrollAreaRef.current.querySelector('[data-radix-scroll-area-viewport]');
      if (scrollContainer) {
        scrollContainer.scrollTop = scrollContainer.scrollHeight;
      }
    }
  }, [conversationHistory]);

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
          content: `I found ${result.features?.length || 0} geospatial results for "${query}". ${result.metadata?.count ? `Analyzed ${result.metadata.count} data points.` : ''}`,
          data: result,
        });
        
        // Update query results and ask about map visualization
        endQuery(result);
        setAwaitingMapDecision(true);
      } else {
        addMessage({
          type: 'assistant',
          content: 'I encountered an issue processing your geospatial query. Please try rephrasing your request or check if the data source is available.',
        });
        endQuery(null);
      }
    } catch (error) {
      console.error('Query error:', error);
      addMessage({
        type: 'assistant',
        content: 'I\'m experiencing technical difficulties with the geospatial analysis. Please try again in a moment.',
      });
      endQuery(null);
    }
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className="flex flex-col h-full bg-gradient-hero">
      {/* Header */}
      <div className="border-b border-glass-border glass p-6 animate-slide-up">
        <div className="flex items-center justify-between">
          <div className="space-y-2">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-gradient-primary flex items-center justify-center glow-primary">
                <div className="w-6 h-6 rounded-lg bg-primary-foreground/20"></div>
              </div>
              <div>
                <h2 className="text-2xl font-bold text-foreground bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                  GeoQuery-NLP
                </h2>
                <p className="text-sm text-muted-foreground font-medium">
                  Ask questions about locations, demographics, spatial patterns, and geographic data
                </p>
              </div>
            </div>
          </div>
          <div className="flex items-center space-x-3">
            <Button
              variant="glass"
              size="lg"
              onClick={() => setShowSystemInfo(true)}
              className="rounded-2xl font-medium hover-lift"
            >
              <Info className="w-4 h-4 mr-3" />
              About System
            </Button>
            {!uiState.showMapPanel && (
              <div className="flex items-center space-x-2">
                <Button
                  variant="glass"
                  size="lg"
                  onClick={() => togglePrivacyMode()}
                  className={`rounded-2xl font-medium hover-lift ${uiState.isPrivacyMode ? 'bg-primary/20 text-primary' : ''}`}
                >
                  {uiState.isPrivacyMode ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </Button>
                <Button
                  variant="glass"
                  size="lg"
                  onClick={() => resetToDelhi()}
                  className="rounded-2xl font-medium hover-lift"
                >
                  <RotateCcw className="w-4 h-4" />
                </Button>
                <Button
                  variant="glass"
                  size="lg"
                  className="rounded-2xl font-medium hover-lift"
                >
                  <Settings className="w-4 h-4" />
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Messages */}
      <ScrollArea className="flex-1 p-8" ref={scrollAreaRef}>
        <div className="space-y-8 max-w-5xl mx-auto">
          <AnimatePresence>
            {conversationHistory.map((message, index) => (
              <motion.div
                key={message.id}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -30 }}
                transition={{ 
                  type: 'spring', 
                  stiffness: 300, 
                  damping: 30,
                  delay: index * 0.05
                }}
                className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div className={`flex max-w-[85%] ${message.type === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
                  {/* Avatar */}
                  <div className={`flex-shrink-0 ${message.type === 'user' ? 'ml-4' : 'mr-4'}`}>
                    <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shadow-elegant hover-lift transition-all duration-300 ${
                      message.type === 'user' 
                        ? 'bg-gradient-primary text-primary-foreground glow-primary' 
                        : 'bg-gradient-secondary text-secondary-foreground glow-secondary'
                    }`}>
                      {message.type === 'user' ? (
                        <User className="w-5 h-5" />
                      ) : (
                        <Bot className="w-5 h-5" />
                      )}
                    </div>
                  </div>

                  {/* Message Content */}
                  <div className={`rounded-3xl p-6 backdrop-blur-sm hover-lift transition-all duration-300 ${
                    message.type === 'user' 
                      ? 'bg-gradient-primary text-primary-foreground shadow-glow' 
                      : 'glass border-glass-border text-card-foreground shadow-elegant'
                  }`}>
                    <p className="text-sm leading-relaxed whitespace-pre-wrap font-medium">
                      {message.content}
                    </p>
                    <div className={`mt-3 text-xs font-mono ${
                      message.type === 'user' 
                        ? 'text-primary-foreground/70' 
                        : 'text-muted-foreground'
                    }`}>
                      {formatTime(message.timestamp)}
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>

          {/* Loading indicator */}
          {uiState.isLoading && (
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ type: 'spring', stiffness: 300, damping: 30 }}
              className="flex justify-start"
            >
              <div className="flex mr-4">
                <div className="w-12 h-12 rounded-2xl bg-gradient-secondary text-secondary-foreground flex items-center justify-center glow-secondary shadow-elegant">
                  <Bot className="w-5 h-5" />
                </div>
              </div>
              <div className="glass border-glass-border rounded-3xl p-6 backdrop-blur-sm">
                <div className="flex items-center space-x-4">
                  <Loader2 className="w-5 h-5 animate-spin text-primary" />
                  <span className="text-sm text-muted-foreground font-medium">
                    Analyzing geospatial data...
                  </span>
                </div>
              </div>
            </motion.div>
          )}

          {/* Map Decision Prompt */}
          {uiState.awaitingMapDecision && (
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ type: 'spring', stiffness: 300, damping: 30 }}
              className="flex justify-start"
            >
              <div className="flex mr-4">
                <div className="w-12 h-12 rounded-2xl bg-gradient-secondary text-secondary-foreground flex items-center justify-center glow-secondary shadow-elegant">
                  <Bot className="w-5 h-5" />
                </div>
              </div>
              <div className="glass border-primary/40 rounded-3xl p-6 backdrop-blur-sm shadow-glow max-w-lg">
                <p className="text-sm mb-6 text-card-foreground font-medium flex items-center">
                  <Map className="w-4 h-4 mr-2 text-primary" />
                  Would you like to visualize these results on the interactive map?
                </p>
                <div className="flex space-x-3">
                  <Button
                    size="lg"
                    onClick={() => setShowMapPanel(true)}
                    className="bg-gradient-primary hover:bg-primary-hover text-primary-foreground shadow-glow hover-lift rounded-2xl font-medium"
                  >
                    <Map className="w-4 h-4 mr-2" />
                    <span>Show Map</span>
                  </Button>
                  <Button
                    variant="glass"
                    size="lg"
                    onClick={() => setAwaitingMapDecision(false)}
                    className="rounded-2xl font-medium hover-lift"
                  >
                    Not Now
                  </Button>
                </div>
              </div>
            </motion.div>
          )}
        </div>
      </ScrollArea>

      {/* Input Area */}
      <div className="border-t border-glass-border glass p-6 lg:p-8">
        <form onSubmit={handleSubmit} className="max-w-5xl mx-auto">
          <div className="relative scale-in">
            <div className="glass rounded-3xl shadow-elegant hover-glow transition-all duration-300">
              <Input
                type="text"
                placeholder="Ask about locations, demographics, spatial patterns, ATM locations, branch offices..."
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                disabled={uiState.isLoading}
                className="h-16 lg:h-20 text-base lg:text-lg px-6 lg:px-8 pr-16 lg:pr-20 rounded-3xl border-0 bg-transparent focus:ring-0 font-medium placeholder:text-muted-foreground"
                autoFocus
              />
              <Button
                type="submit"
                disabled={!inputValue.trim() || uiState.isLoading}
                className="absolute right-2 lg:right-3 top-2 lg:top-2.5 h-12 w-12 lg:h-14 lg:w-14 rounded-2xl p-0 bg-gradient-primary hover:bg-primary-hover shadow-glow hover-lift"
              >
                {uiState.isLoading ? (
                  <Loader2 className="w-5 h-5 lg:w-6 lg:h-6 animate-spin" />
                ) : (
                  <Send className="w-5 h-5 lg:w-6 lg:h-6" />
                )}
              </Button>
            </div>
          </div>
        </form>

        {/* Tools - Show when map is not displayed */}
        {!uiState.showMapPanel && (
          <div className="mt-6 max-w-5xl mx-auto">
            <div className="flex flex-wrap gap-3 justify-center">
              <Button
                variant={uiState.viewMode === 'markers' ? 'default' : 'glass'}
                size="lg"
                onClick={() => setViewMode('markers')}
                className="text-sm font-medium rounded-2xl hover-lift"
              >
                Markers
              </Button>
              <Button
                variant={uiState.viewMode === 'heatmap' ? 'default' : 'glass'}
                size="lg"
                onClick={() => setViewMode('heatmap')}
                className="text-sm font-medium rounded-2xl hover-lift"
              >
                Heatmap
              </Button>
              <Button
                variant={uiState.viewMode === '3D' ? 'default' : 'glass'}
                size="lg"
                onClick={() => setViewMode('3D')}
                className="text-sm font-medium rounded-2xl hover-lift"
              >
                3D View
              </Button>
            </div>
          </div>
        )}
      </div>

      {/* System Info Modal */}
      <SystemInfoModal />
    </div>
  );
};

export default ChatMain;