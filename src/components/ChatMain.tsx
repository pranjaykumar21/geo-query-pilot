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
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="border-b border-border p-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-semibold text-foreground">GeoQuery-NLP</h2>
            <p className="text-sm text-muted-foreground">
              Ask questions about locations, demographics, spatial patterns, and geographic data
            </p>
          </div>
          <div className="flex items-center space-x-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowSystemInfo(true)}
              className="text-muted-foreground hover:text-foreground"
            >
              <Info className="w-4 h-4 mr-2" />
              About System
            </Button>
            {!uiState.showMapPanel && (
              <div className="flex items-center space-x-1">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => togglePrivacyMode()}
                  className={uiState.isPrivacyMode ? 'text-primary' : 'text-muted-foreground'}
                >
                  {uiState.isPrivacyMode ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => resetToDelhi()}
                  className="text-muted-foreground hover:text-foreground"
                >
                  <RotateCcw className="w-4 h-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-muted-foreground hover:text-foreground"
                >
                  <Settings className="w-4 h-4" />
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Messages */}
      <ScrollArea className="flex-1 p-4" ref={scrollAreaRef}>
        <div className="space-y-6 max-w-4xl mx-auto">
          <AnimatePresence>
            {conversationHistory.map((message, index) => (
              <motion.div
                key={message.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div className={`flex max-w-[80%] ${message.type === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
                  {/* Avatar */}
                  <div className={`flex-shrink-0 ${message.type === 'user' ? 'ml-3' : 'mr-3'}`}>
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                      message.type === 'user' 
                        ? 'bg-primary text-primary-foreground' 
                        : 'bg-secondary text-secondary-foreground'
                    }`}>
                      {message.type === 'user' ? (
                        <User className="w-4 h-4" />
                      ) : (
                        <Bot className="w-4 h-4" />
                      )}
                    </div>
                  </div>

                  {/* Message Content */}
                  <div className={`rounded-lg p-4 ${
                    message.type === 'user' 
                      ? 'bg-primary text-primary-foreground' 
                      : 'bg-card border border-border'
                  }`}>
                    <p className="text-sm leading-relaxed whitespace-pre-wrap">
                      {message.content}
                    </p>
                    <div className={`mt-2 text-xs ${
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
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex justify-start"
            >
              <div className="flex mr-3">
                <div className="w-8 h-8 rounded-full bg-secondary text-secondary-foreground flex items-center justify-center">
                  <Bot className="w-4 h-4" />
                </div>
              </div>
              <div className="bg-card border border-border rounded-lg p-4">
                <div className="flex items-center space-x-2">
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span className="text-sm text-muted-foreground">
                    Analyzing geospatial data...
                  </span>
                </div>
              </div>
            </motion.div>
          )}

          {/* Map Decision Prompt */}
          {uiState.awaitingMapDecision && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex justify-start"
            >
              <div className="flex mr-3">
                <div className="w-8 h-8 rounded-full bg-secondary text-secondary-foreground flex items-center justify-center">
                  <Bot className="w-4 h-4" />
                </div>
              </div>
              <Card className="max-w-md">
                <CardContent className="p-4">
                  <p className="text-sm mb-4">Would you like to visualize these results on the interactive map?</p>
                  <div className="flex space-x-2">
                    <Button
                      size="sm"
                      onClick={() => setShowMapPanel(true)}
                      className="flex items-center space-x-1"
                    >
                      <Map className="w-4 h-4" />
                      <span>Show Map</span>
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setAwaitingMapDecision(false)}
                    >
                      Not Now
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )}
        </div>
      </ScrollArea>

      {/* Input Area */}
      <div className="border-t border-border p-4 lg:p-6">
        <form onSubmit={handleSubmit} className="max-w-4xl mx-auto">
          <div className="relative">
            <Input
              type="text"
              placeholder="Ask about locations, demographics, spatial patterns, ATM locations, branch offices..."
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              disabled={uiState.isLoading}
              className="h-12 lg:h-16 text-base lg:text-lg px-4 lg:px-6 pr-12 lg:pr-16 rounded-xl lg:rounded-2xl border-2 shadow-lg focus:shadow-xl transition-all duration-200"
              autoFocus
            />
            <Button
              type="submit"
              disabled={!inputValue.trim() || uiState.isLoading}
              className="absolute right-1 lg:right-2 top-1 lg:top-2 h-10 w-10 lg:h-12 lg:w-12 rounded-lg lg:rounded-xl p-0"
            >
              {uiState.isLoading ? (
                <Loader2 className="w-4 h-4 lg:w-5 lg:h-5 animate-spin" />
              ) : (
                <Send className="w-4 h-4 lg:w-5 lg:h-5" />
              )}
            </Button>
          </div>
        </form>

        {/* Tools - Show when map is not displayed */}
        {!uiState.showMapPanel && (
          <div className="mt-4 max-w-4xl mx-auto">
            <div className="flex flex-wrap gap-2 justify-center">
              <Button
                variant={uiState.viewMode === 'markers' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setViewMode('markers')}
                className="text-xs"
              >
                Markers
              </Button>
              <Button
                variant={uiState.viewMode === 'heatmap' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setViewMode('heatmap')}
                className="text-xs"
              >
                Heatmap
              </Button>
              <Button
                variant={uiState.viewMode === '3D' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setViewMode('3D')}
                className="text-xs"
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