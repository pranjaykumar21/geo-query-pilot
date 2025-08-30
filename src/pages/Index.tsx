import React from 'react';
import MapView from '../components/MapView';
import CommandBar from '../components/CommandBar';
import FocusView from '../components/FocusView';

const Index = () => {
  return (
    <div className="relative w-full h-screen overflow-hidden bg-background">
      {/* Main Map View */}
      <MapView />
      
      {/* Command Interface */}
      <CommandBar />
      
      {/* Focus Object Details */}
      <FocusView />
      
      {/* Header */}
      <div className="absolute top-4 left-4 z-10">
        <div className="glass rounded-xl p-4">
          <h1 className="text-xl font-bold text-foreground">
            GeoQuery-NLP
          </h1>
          <p className="text-sm text-muted-foreground">
            Geospatial Command Center
          </p>
        </div>
      </div>
    </div>
  );
};

export default Index;
