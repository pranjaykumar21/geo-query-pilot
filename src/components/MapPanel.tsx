import React from 'react';
import MapView from './MapView';
import FocusView from './FocusView';

const MapPanel: React.FC = () => {
  return (
    <div className="flex-1 relative bg-background">
      {/* Map View */}
      <MapView />
      
      {/* Focus Object Details - overlaid on map */}
      <FocusView />
      
      {/* Map Controls Overlay */}
      <div className="absolute top-4 right-4 z-10">
        <div className="bg-card/80 backdrop-blur-sm border border-border rounded-lg p-2">
          <p className="text-xs text-muted-foreground">Interactive Map</p>
        </div>
      </div>
    </div>
  );
};

export default MapPanel;