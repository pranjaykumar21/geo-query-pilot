import React from 'react';
import ChatSidebar from '../components/ChatSidebar';
import ChatMain from '../components/ChatMain';
import MapPanel from '../components/MapPanel';
import { useStore } from '../stores/useStore';

const Index = () => {
  const { uiState } = useStore();

  return (
    <div className="flex h-screen bg-background overflow-hidden">
      {/* Left Sidebar - Conversation History - Hidden on mobile */}
      <div className="hidden md:block">
        <ChatSidebar />
      </div>
      
      {/* Center - Chat Interface */}
      <div className={`flex-1 flex flex-col transition-all duration-300 ${
        uiState.showMapPanel ? 'lg:flex-[0.6] xl:flex-[0.5]' : 'max-w-4xl mx-auto'
      }`}>
        <ChatMain />
      </div>
      
      {/* Right Panel - Map (conditionally shown) */}
      {uiState.showMapPanel && (
        <div className="hidden lg:block lg:flex-[0.4] xl:flex-[0.5] border-l border-border">
          <MapPanel />
        </div>
      )}
    </div>
  );
};

export default Index;
