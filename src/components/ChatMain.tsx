import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, Bot, User, Loader2 } from 'lucide-react';
import { useStore } from '../stores/useStore';
import { apiService } from '../services/apiService';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { ScrollArea } from './ui/scroll-area';

const ChatMain: React.FC = () => {
  const { 
    uiState, 
    conversationHistory, 
    addMessage, 
    startQuery, 
    endQuery
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
          content: `I found ${result.features?.length || 0} geospatial results for "${query}". The visualization has been updated on the map panel. ${result.metadata?.count ? `Analyzed ${result.metadata.count} data points.` : ''}`,
          data: result,
        });
        
        // Update query results
        endQuery(result);
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
        <h2 className="text-lg font-semibold text-foreground">Geospatial Query Interface</h2>
        <p className="text-sm text-muted-foreground">
          Ask questions about locations, demographics, spatial patterns, and geographic data
        </p>
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
        </div>
      </ScrollArea>

      {/* Input Area */}
      <div className="border-t border-border p-4">
        <form onSubmit={handleSubmit} className="max-w-4xl mx-auto">
          <div className="flex items-end space-x-3">
            <div className="flex-1">
              <Input
                type="text"
                placeholder="Ask about locations, demographics, spatial patterns, ATM locations, branch offices..."
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                disabled={uiState.isLoading}
                className="h-12 text-base resize-none"
                autoFocus
              />
            </div>
            <Button
              type="submit"
              disabled={!inputValue.trim() || uiState.isLoading}
              className="h-12 px-6"
            >
              {uiState.isLoading ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <Send className="w-5 h-5" />
              )}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ChatMain;