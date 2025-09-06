import React, { useState } from 'react';
import { motion } from 'framer-motion';
import ProfessionalHeader from '../components/ProfessionalHeader';
import EnhancedSidebar from '../components/EnhancedSidebar';
import HeroSection from '../components/HeroSection';
import ChatMain from '../components/ChatMain';
import MapPanel from '../components/MapPanel';
import Globe3D from '../components/Globe3D';
import EnterprisePanel from '../components/EnterprisePanel';
import StoriesPanel from '../components/StoriesPanel';
import AnalyticsPanel from '../components/AnalyticsPanel';
import { useStore } from '../stores/useStore';
import heroBg from '../assets/hero-bg.jpg';
import dataBg from '../assets/data-bg.jpg';
import globeBg from '../assets/globe-bg.jpg';

const Index = () => {
  const { addMessage, setShowMapPanel } = useStore();
  const [activeView, setActiveView] = useState('hero');
  const [showMainApp, setShowMainApp] = useState(false);

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

  const handleGetStarted = () => {
    setShowMainApp(true);
    setActiveView('chat');
  };

  const getBackgroundForView = (view: string) => {
    switch (view) {
      case 'map2d':
        return dataBg;
      case 'globe3d':
        return globeBg;
      default:
        return heroBg;
    }
  };

  const renderMainContent = () => {
    if (!showMainApp) {
      return <HeroSection onGetStarted={handleGetStarted} />;
    }

    switch (activeView) {
      case 'chat':
        return (
          <div className="flex h-full">
            {/* Left Sidebar - Enhanced Conversation History */}
            <div className="hidden lg:block w-80 xl:w-96">
              <EnhancedSidebar />
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
            <div className="hidden lg:block w-80 xl:w-96">
              <EnhancedSidebar title="Spatial Analysis" />
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
            <div className="hidden lg:block w-80 xl:w-96">
              <EnhancedSidebar title="3D Visualization" />
            </div>
            
            {/* Center - 3D Globe */}
            <div className="flex-1 relative">
              <Globe3D interactive={true} showQueryResults={true} />
              
              {/* Globe Controls Overlay */}
              <motion.div 
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.5 }}
                className="absolute top-6 right-6 space-y-4"
              >
                <div className="glass glass-hover p-4 rounded-xl max-w-xs">
                  <h3 className="text-sm font-semibold text-foreground mb-3">3D Globe Controls</h3>
                  <div className="space-y-2 text-xs text-muted-foreground">
                    <div className="flex items-center space-x-2">
                      <div className="w-2 h-2 bg-primary rounded-full" />
                      <span>Drag to rotate globe</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className="w-2 h-2 bg-secondary rounded-full" />
                      <span>Scroll to zoom</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className="w-2 h-2 bg-accent rounded-full" />
                      <span>Hover points for details</span>
                    </div>
                  </div>
                </div>
              </motion.div>
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
    <div className="h-screen overflow-hidden flex flex-col relative">
      {/* Dynamic Background */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat transition-all duration-1000"
        style={{ backgroundImage: `url(${getBackgroundForView(activeView)})` }}
      >
        <div className="absolute inset-0 bg-gradient-to-br from-background/95 via-background/90 to-background/95" />
      </div>
      
      {/* Background 3D Globe - Only when not in hero */}
      {showMainApp && (
        <div className="absolute inset-0 opacity-5 pointer-events-none">
          <Globe3D interactive={false} />
        </div>
      )}
      
      {/* Top Navigation - Only show when not in hero */}
      {showMainApp && (
        <ProfessionalHeader activeView={activeView} onViewChange={setActiveView} />
      )}
      
      {/* Main Content Area */}
      <div className="flex-1 relative z-10 overflow-hidden">
        {renderMainContent()}
      </div>
      
      {/* Professional Footer Status Bar - Only when not in hero */}
      {showMainApp && (
        <motion.footer 
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="h-12 glass border-t border-glass-border/30 flex items-center justify-between px-6 text-sm text-muted-foreground relative z-50"
        >
          <div className="flex items-center space-x-6">
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 rounded-full bg-success animate-pulse" />
              <span className="font-medium">GeoQuery NLP v3.0</span>
            </div>
            <span className="text-muted-foreground/60">|</span>
            <span>Enterprise Security Active</span>
            <span className="text-muted-foreground/60">|</span>
            <span>Real-time Processing</span>
            <span className="text-muted-foreground/60">|</span>
            <span>256-bit Encryption</span>
          </div>
          <div className="flex items-center space-x-4">
            <span className="text-xs">Response Time: 45ms</span>
            <span className="text-muted-foreground/60">|</span>
            <span className="text-xs">Uptime: 99.9%</span>
            <span className="text-muted-foreground/60">|</span>
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
              <span className="text-xs font-medium">All Systems Operational</span>
            </div>
          </div>
        </motion.footer>
      )}
    </div>
  );
};

export default Index;
