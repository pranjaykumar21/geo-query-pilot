import React from 'react';
import ChatSidebar from '../components/ChatSidebar';
import ChatMain from '../components/ChatMain';
import MapPanel from '../components/MapPanel';
import Scene3D from '../components/Scene3D';
import { useStore } from '../stores/useStore';

const Index = () => {
  const { uiState } = useStore();

  return (
    <div className="flex flex-col lg:flex-row h-screen bg-background overflow-hidden">
      {/* Left Sidebar - Conversation History - Hidden on mobile */}
      <div className="hidden md:block lg:w-64 xl:w-80">
        <ChatSidebar />
      </div>
      
      {/* Center - Chat Interface */}
      <div className={`flex-1 flex flex-col transition-all duration-300 ${
        uiState.showMapPanel 
          ? 'lg:flex-[0.6] xl:flex-[0.5]' 
          : 'max-w-none lg:max-w-4xl mx-auto'
      }`}>
        <ChatMain />
      </div>
      
      {/* Right Panel - Map or 3D Scene (conditionally shown) */}
      {uiState.showMapPanel && (
        <div className="w-full lg:w-auto lg:flex-[0.4] xl:flex-[0.5] border-t lg:border-t-0 lg:border-l border-border">
          <div className="relative h-64 sm:h-80 lg:h-full">
            {/* 3D Background Scene */}
            <div className="absolute inset-0 opacity-30">
              <Scene3D />
            </div>
            
            {/* Map Overlay */}
            <div className="relative z-10 h-full">
              <MapPanel />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Index;
