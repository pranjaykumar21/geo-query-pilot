import React from 'react';
import ChatSidebar from '../components/ChatSidebar';
import ChatMain from '../components/ChatMain';
import MapPanel from '../components/MapPanel';
import Globe3D from '../components/Globe3D';
import { useStore } from '../stores/useStore';

const Index = () => {
  const { uiState } = useStore();

  return (
    <div className="flex flex-col lg:flex-row h-screen bg-background overflow-hidden relative">
      {/* Background 3D Globe - Always visible with low opacity */}
      <div className="absolute inset-0 opacity-10 pointer-events-none">
        <Globe3D />
      </div>
      
      {/* Left Sidebar - Conversation History - Hidden on mobile */}
      <div className="hidden md:block lg:w-80 xl:w-96 relative z-10">
        <ChatSidebar />
      </div>
      
      {/* Center - Chat Interface */}
      <div className={`flex-1 flex flex-col transition-all duration-500 ease-out relative z-10 ${
        uiState.showMapPanel 
          ? 'lg:flex-[0.55] xl:flex-[0.5]' 
          : 'max-w-none lg:max-w-6xl mx-auto'
      }`}>
        <ChatMain />
      </div>
      
      {/* Right Panel - Map with enhanced 3D effects (conditionally shown) */}
      {uiState.showMapPanel && (
        <div className="w-full lg:w-auto lg:flex-[0.45] xl:flex-[0.5] border-t lg:border-t-0 lg:border-l border-glass-border relative z-10 animate-slide-up">
          <div className="relative h-64 sm:h-80 lg:h-full glass">
            {/* Enhanced 3D Background */}
            <div className="absolute inset-0 opacity-40 perspective-3d">
              <div className="rotate-3d-slow h-full">
                <Globe3D />
              </div>
            </div>
            
            {/* Map Overlay with glassmorphism */}
            <div className="relative z-20 h-full backdrop-blur-sm">
              <MapPanel />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Index;
