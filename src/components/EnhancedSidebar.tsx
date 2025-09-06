import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  MessageSquare, 
  Clock, 
  Star, 
  Filter,
  Search,
  MoreVertical,
  MapPin,
  BarChart3,
  Globe,
  Archive
} from 'lucide-react';
interface EnhancedSidebarProps {
  title?: string;
  showSearch?: boolean;
}

const EnhancedSidebar: React.FC<EnhancedSidebarProps> = ({ 
  title = "Conversation History",
  showSearch = true 
}) => {
  
  // Mock conversation data for demo
  const conversations = [
    {
      id: '1',
      title: 'Delhi Population Analysis',
      preview: 'Analyzing demographic patterns across Delhi districts...',
      timestamp: '2 hours ago',
      type: 'analytics',
      status: 'completed',
      queryCount: 12
    },
    {
      id: '2', 
      title: 'Transportation Network',
      preview: 'Metro connectivity and traffic flow optimization...',
      timestamp: '1 day ago',
      type: 'mapping',
      status: 'in-progress',
      queryCount: 8
    },
    {
      id: '3',
      title: 'Commercial Zones',
      preview: 'Business district analysis and growth patterns...',
      timestamp: '3 days ago',
      type: 'business',
      status: 'completed',
      queryCount: 15
    },
    {
      id: '4',
      title: 'Environmental Impact',
      preview: 'Air quality correlation with urban development...',
      timestamp: '1 week ago',
      type: 'environment',
      status: 'archived',
      queryCount: 6
    }
  ];

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'analytics': return BarChart3;
      case 'mapping': return MapPin;
      case 'business': return Star;
      case 'environment': return Globe;
      default: return MessageSquare;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'success';
      case 'in-progress': return 'warning';
      case 'archived': return 'muted';
      default: return 'primary';
    }
  };

  return (
    <motion.div 
      initial={{ x: -300, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className="h-full glass border-r border-glass-border/30 flex flex-col"
    >
      {/* Header */}
      <div className="p-6 border-b border-glass-border/20">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-foreground">{title}</h2>
          <Button variant="ghost" size="icon" className="w-8 h-8">
            <MoreVertical className="w-4 h-4" />
          </Button>
        </div>
        
        {showSearch && (
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search conversations..."
              className="w-full pl-10 pr-4 py-2 bg-muted/20 border border-border/20 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary/50 transition-all"
            />
          </div>
        )}
      </div>

      {/* Filter Tabs */}
      <div className="p-4 border-b border-glass-border/20">
        <div className="flex space-x-2">
          {['All', 'Recent', 'Starred', 'Archived'].map((filter) => (
            <Button
              key={filter}
              variant={filter === 'All' ? 'default' : 'ghost'}
              size="sm"
              className={filter === 'All' ? 'btn-neon-cyan text-xs' : 'text-xs'}
            >
              {filter}
            </Button>
          ))}
        </div>
      </div>

      {/* Conversations List */}
      <ScrollArea className="flex-1">
        <div className="p-4 space-y-3">
          <AnimatePresence>
            {conversations.map((conversation, index) => {
              const TypeIcon = getTypeIcon(conversation.type);
              
              return (
                <motion.div
                  key={conversation.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ delay: index * 0.1 }}
                  className="glass glass-hover p-4 rounded-xl cursor-pointer group"
                >
                  <div className="flex items-start space-x-3">
                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                      conversation.status === 'completed' ? 'bg-success/20 text-success' :
                      conversation.status === 'in-progress' ? 'bg-warning/20 text-warning' :
                      conversation.status === 'archived' ? 'bg-muted/20 text-muted-foreground' :
                      'bg-primary/20 text-primary'
                    }`}>
                      <TypeIcon className="w-5 h-5" />
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-1">
                        <h3 className="font-medium text-foreground text-sm truncate group-hover:text-primary transition-colors">
                          {conversation.title}
                        </h3>
                        <Badge 
                          variant="outline" 
                          className="text-xs px-2 py-0"
                        >
                          {conversation.queryCount}
                        </Badge>
                      </div>
                      
                      <p className="text-xs text-muted-foreground line-clamp-2 mb-2">
                        {conversation.preview}
                      </p>
                      
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-1 text-xs text-muted-foreground">
                          <Clock className="w-3 h-3" />
                          <span>{conversation.timestamp}</span>
                        </div>
                        
                        <Badge 
                          variant="outline"
                          className={`text-xs px-2 py-0 border-${getStatusColor(conversation.status)}/30 text-${getStatusColor(conversation.status)}`}
                        >
                          {conversation.status}
                        </Badge>
                      </div>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>
      </ScrollArea>

      {/* Footer Actions */}
      <div className="p-4 border-t border-glass-border/20">
        <Button 
          variant="outline" 
          className="w-full glass-button"
          size="sm"
        >
          <Archive className="w-4 h-4 mr-2" />
          View All Conversations
        </Button>
      </div>
    </motion.div>
  );
};

export default EnhancedSidebar;