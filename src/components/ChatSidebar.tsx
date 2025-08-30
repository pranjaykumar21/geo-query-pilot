import React from 'react';
import { motion } from 'framer-motion';
import { MessageCircle, Plus, Settings, Shield, RotateCcw } from 'lucide-react';
import { useStore } from '../stores/useStore';
import { Button } from './ui/button';
import { ScrollArea } from './ui/scroll-area';

const ChatSidebar: React.FC = () => {
  const { 
    conversationHistory, 
    uiState,
    togglePrivacyMode,
    resetToDelhi 
  } = useStore();

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const getMessagePreview = (content: string) => {
    return content.length > 50 ? content.slice(0, 50) + '...' : content;
  };

  return (
    <div className="w-80 bg-card border-r border-border flex flex-col h-full">
      {/* Header */}
      <div className="p-4 border-b border-border">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-lg font-semibold text-foreground">GeoQuery-NLP</h1>
            <p className="text-sm text-muted-foreground">Geospatial Command Center</p>
          </div>
        </div>
        
        <Button 
          className="w-full justify-start" 
          variant="outline"
          onClick={() => window.location.reload()}
        >
          <Plus className="w-4 h-4 mr-2" />
          New Conversation
        </Button>
      </div>

      {/* Conversation History */}
      <ScrollArea className="flex-1 p-2">
        <div className="space-y-2">
          {conversationHistory
            .filter(msg => msg.type === 'user')
            .map((message, index) => (
              <motion.div
                key={message.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className="p-3 rounded-lg hover:bg-accent/50 cursor-pointer group transition-colors"
              >
                <div className="flex items-start space-x-2">
                  <MessageCircle className="w-4 h-4 mt-0.5 text-muted-foreground" />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-foreground group-hover:text-accent-foreground">
                      {getMessagePreview(message.content)}
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">
                      {formatTime(message.timestamp)}
                    </p>
                  </div>
                </div>
              </motion.div>
            ))}
          
          {conversationHistory.length === 1 && (
            <div className="p-4 text-center">
              <p className="text-sm text-muted-foreground">
                Start a conversation to see history
              </p>
            </div>
          )}
        </div>
      </ScrollArea>

      {/* Footer Controls */}
      <div className="p-4 border-t border-border">
        <div className="space-y-2">
          <Button
            variant={uiState.isPrivacyMode ? "default" : "ghost"}
            size="sm"
            onClick={togglePrivacyMode}
            className="w-full justify-start"
          >
            <Shield className="w-4 h-4 mr-2" />
            Privacy Mode
          </Button>
          
          <Button
            variant="ghost"
            size="sm"
            onClick={resetToDelhi}
            className="w-full justify-start"
          >
            <RotateCcw className="w-4 h-4 mr-2" />
            Reset View
          </Button>
          
          <Button
            variant="ghost"
            size="sm"
            className="w-full justify-start"
          >
            <Settings className="w-4 h-4 mr-2" />
            Settings
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ChatSidebar;