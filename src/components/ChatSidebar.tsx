import React from 'react';
import { motion } from 'framer-motion';
import { MessageCircle, Plus, Settings, Shield, RotateCcw, X } from 'lucide-react';
import { useStore } from '../stores/useStore';
import { Button } from './ui/button';
import { ScrollArea } from './ui/scroll-area';

const ChatSidebar: React.FC = () => {
  const { 
    conversationHistory, 
    uiState,
    togglePrivacyMode,
    resetToDelhi,
    setShowMapPanel
  } = useStore();

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const getMessagePreview = (content: string) => {
    return content.length > 50 ? content.slice(0, 50) + '...' : content;
  };

  return (
    <div className="w-full h-full glass border-r border-glass-border flex flex-col scale-in">
      {/* Header */}
      <div className="p-6 border-b border-glass-border">
        <div className="flex items-center justify-between mb-6">
          <div className="space-y-2">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-xl bg-gradient-primary flex items-center justify-center glow-primary">
                <MessageCircle className="w-4 h-4 text-primary-foreground" />
              </div>
              <h1 className="text-xl font-bold text-foreground">History</h1>
            </div>
            <p className="text-sm text-muted-foreground font-medium">Recent conversations</p>
          </div>
          {uiState.showMapPanel && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowMapPanel(false)}
              className="glass-button hover-lift rounded-xl"
            >
              <X className="w-4 h-4" />
            </Button>
          )}
        </div>
        
        <Button 
          className="w-full justify-start bg-gradient-primary hover:bg-primary-hover text-primary-foreground shadow-glow hover-lift rounded-2xl h-12 font-medium" 
          onClick={() => window.location.reload()}
        >
          <Plus className="w-5 h-5 mr-3" />
          New Conversation
        </Button>
      </div>

      {/* Conversation History */}
      <ScrollArea className="flex-1 p-6">
        <div className="space-y-4">
          {conversationHistory
            .filter(msg => msg.type === 'user')
            .map((message, index) => (
              <motion.div
                key={message.id}
                initial={{ opacity: 0, x: -30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1, type: 'spring', stiffness: 300 }}
                className="p-4 rounded-2xl glass-hover cursor-pointer group transition-all duration-300 border border-glass-border"
              >
                <div className="flex items-start space-x-3">
                  <div className="w-8 h-8 rounded-xl bg-gradient-secondary flex items-center justify-center glow-secondary flex-shrink-0">
                    <MessageCircle className="w-4 h-4 text-secondary-foreground" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-foreground group-hover:text-primary font-medium leading-relaxed">
                      {getMessagePreview(message.content)}
                    </p>
                    <p className="text-xs text-muted-foreground mt-2 font-mono">
                      {formatTime(message.timestamp)}
                    </p>
                  </div>
                </div>
              </motion.div>
            ))}
          
          {conversationHistory.length === 1 && (
            <div className="p-6 text-center scale-in">
              <div className="w-16 h-16 rounded-2xl bg-gradient-hero mx-auto mb-4 flex items-center justify-center">
                <MessageCircle className="w-8 h-8 opacity-60 text-muted-foreground" />
              </div>
              <p className="text-sm text-muted-foreground font-medium">
                Start a conversation to see history
              </p>
            </div>
          )}
        </div>
      </ScrollArea>

      {/* Footer Controls */}
      <div className="p-6 border-t border-glass-border">
        <div className="space-y-3">
          <Button
            variant={uiState.isPrivacyMode ? "default" : "glass"}
            size="lg"
            onClick={togglePrivacyMode}
            className="w-full justify-start rounded-2xl font-medium hover-lift"
          >
            <Shield className="w-5 h-5 mr-3" />
            Privacy Mode
          </Button>
          
          <Button
            variant="glass"
            size="lg"
            onClick={resetToDelhi}
            className="w-full justify-start rounded-2xl font-medium hover-lift"
          >
            <RotateCcw className="w-5 h-5 mr-3" />
            Reset View
          </Button>
          
          <Button
            variant="glass"
            size="lg"
            className="w-full justify-start rounded-2xl font-medium hover-lift"
          >
            <Settings className="w-5 h-5 mr-3" />
            Settings
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ChatSidebar;