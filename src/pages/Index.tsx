import React, { useState } from 'react';
import { TabsContent } from '@/components/ui/tabs';
import TopNavigation from '../components/TopNavigation';
import ChatSidebar from '../components/ChatSidebar';
import ChatMain from '../components/ChatMain';
import MapPanel from '../components/MapPanel';
import Globe3D from '../components/Globe3D';
import EnterprisePanel from '../components/EnterprisePanel';
import StoriesPanel from '../components/StoriesPanel';
import AnalyticsPanel from '../components/AnalyticsPanel';
import { useStore } from '../stores/useStore';

const Index = () => {
  const { addMessage, setShowMapPanel } = useStore();
  const [activeView, setActiveView] = useState('chat');

  const handleStorySelect = (query: string, targetView: string) => {
    // Add the query to chat
    addMessage({
      type: 'user',
      content: query
    });
    
    // Add a demo response
    addMessage({
      type: 'assistant',
      content: `Found geospatial results for "${query}". Analyzed data points with enterprise security enabled.`
    });

    // Switch to target view and show map panel if needed
    setActiveView(targetView);
    if (targetView === 'map2d' || targetView === 'globe3d') {
      setShowMapPanel(true);
    }
  };

  const renderMainContent = () => {
    switch (activeView) {
      case 'chat':
        return (
          <div className="flex h-full">
            {/* Left Sidebar - Conversation History */}
            <div className="hidden lg:block w-80 xl:w-96 border-r border-glass-border/30">
              <ChatSidebar />
            </div>
            
            {/* Center - Chat Interface */}
            <div className="flex-1">
              <ChatMain />
            </div>
          </div>
        );

      case 'map2d':
        return (
          <div className="flex h-full">
            {/* Left Sidebar */}
            <div className="hidden lg:block w-80 xl:w-96 border-r border-glass-border/30">
              <ChatSidebar />
            </div>
            
            {/* Center - Map View */}
            <div className="flex-1 relative">
              <MapPanel />
            </div>
          </div>
        );

      case 'globe3d':
        return (
          <div className="flex h-full">
            {/* Left Sidebar */}
            <div className="hidden lg:block w-80 xl:w-96 border-r border-glass-border/30">
              <ChatSidebar />
            </div>
            
            {/* Center - 3D Globe */}
            <div className="flex-1 relative bg-gradient-to-br from-background via-background/95 to-primary/5">
              <Globe3D interactive={true} showQueryResults={true} />
              
              {/* Globe Controls Overlay */}
              <div className="absolute top-6 right-6 space-y-4">
                <div className="glass glass-hover p-4 rounded-xl">
                  <h3 className="text-sm font-semibold text-foreground mb-2">3D Globe Controls</h3>
                  <div className="space-y-2 text-xs text-muted-foreground">
                    <p>• Drag to rotate</p>
                    <p>• Scroll to zoom</p>
                    <p>• Hover points for details</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );

      case 'analytics':
        return <AnalyticsPanel />;

      case 'enterprise':
        return <EnterprisePanel />;

      case 'stories':
        return <StoriesPanel onStorySelect={handleStorySelect} />;

      default:
        return <ChatMain />;
    }
  };

  return (
    <div className="h-screen bg-gradient-to-br from-background via-background/98 to-primary/5 overflow-hidden flex flex-col">
      {/* Background 3D Globe - Always visible with low opacity */}
      <div className="absolute inset-0 opacity-5 pointer-events-none">
        <Globe3D interactive={false} />
      </div>
      
      {/* Top Navigation */}
      <TopNavigation activeView={activeView} onViewChange={setActiveView} />
      
      {/* Main Content Area */}
      <div className="flex-1 relative z-10 overflow-hidden">
        {renderMainContent()}
      </div>
      
      {/* Footer Status Bar */}
      <div className="h-8 glass border-t border-glass-border/30 flex items-center justify-between px-6 text-xs text-muted-foreground relative z-50">
        <div className="flex items-center space-x-4">
          <span>GeoQuery NLP v2.0</span>
          <span>•</span>
          <span>Enterprise Ready</span>
          <span>•</span>
          <span>Local Processing</span>
        </div>
        <div className="flex items-center space-x-2">
          <div className="w-2 h-2 rounded-full bg-secondary animate-pulse"></div>
          <span>System Active</span>
        </div>
      </div>
    </div>
  );
};

export default Index;
