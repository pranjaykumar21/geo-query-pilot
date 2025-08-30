import React from 'react';
import ChatSidebar from '../components/ChatSidebar';
import ChatMain from '../components/ChatMain';
import MapPanel from '../components/MapPanel';
import ToolsPanel from '../components/ToolsPanel';

const Index = () => {
  return (
    <div className="flex h-screen bg-background overflow-hidden">
      {/* Left Sidebar - Conversation History */}
      <ChatSidebar />
      
      {/* Center - Chat Interface */}
      <div className="flex-1 flex flex-col">
        <ChatMain />
      </div>
      
      {/* Right Panel - Map and Tools */}
      <div className="w-1/2 flex flex-col border-l border-border">
        <ToolsPanel />
        <MapPanel />
      </div>
    </div>
  );
};

export default Index;
