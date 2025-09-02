import React, { useMemo, useState, useRef, useEffect } from 'react';
import { MapPin, Navigation, Search, Layers, ZoomIn, ZoomOut, Home, Plane, ShoppingBag, Trees } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useStore } from '../stores/useStore';

// Demo mode - using SVG-based map for better compatibility

const MapView: React.FC = () => {
  const { 
    viewState, 
    setViewState, 
    queryResults, 
    uiState, 
    setFocusedObject 
  } = useStore();

  const [selectedMarker, setSelectedMarker] = useState<any>(null);
  const [activeLayers, setActiveLayers] = useState({
    hospitals: true,
    atms: true,
    wardBoundaries: true
  });

  // Demo POI data matching the reference image
  const demoData = [
    { id: 1, name: 'Red Fort', type: 'historical', lat: 28.6562, lng: 77.2410, color: '#8B5CF6', icon: '🏰' },
    { id: 2, name: 'Jantar Mantar', type: 'historical', lat: 28.6271, lng: 77.2166, color: '#8B5CF6', icon: '⏰' },
    { id: 3, name: 'Humayun\'s Tomb', type: 'historical', lat: 28.5933, lng: 77.2507, color: '#8B5CF6', icon: '🏛️' },
    { id: 4, name: 'Khan Market', type: 'shopping', lat: 28.5984, lng: 77.2302, color: '#3B82F6', icon: '🛍️' },
    { id: 5, name: 'V3S Mall', type: 'shopping', lat: 28.6139, lng: 77.2090, color: '#3B82F6', icon: '🏬' },
    { id: 6, name: 'Darshan Park', type: 'park', lat: 28.6569, lng: 77.2147, color: '#10B981', icon: '🌳' },
    { id: 7, name: 'Pusa Hill Forest', type: 'park', lat: 28.6358, lng: 77.1447, color: '#10B981', icon: '🌲' },
    { id: 8, name: 'Indira Gandhi Intl Airport', type: 'transport', lat: 28.5562, lng: 77.1000, color: '#3B82F6', icon: '✈️' },
    { id: 9, name: 'ISKCON Temple Noida', type: 'religious', lat: 28.5672, lng: 77.3249, color: '#F59E0B', icon: '🏛️' },
    { id: 10, name: 'National Rail Museum', type: 'museum', lat: 28.5794, lng: 77.2094, color: '#8B5CF6', icon: '🚂' }
  ];

  // Convert coordinates to DMS format
  const formatCoordinates = (lat: number, lng: number) => {
    const formatDMS = (coord: number, isLat: boolean) => {
      const degrees = Math.floor(Math.abs(coord));
      const minutes = Math.floor((Math.abs(coord) - degrees) * 60);
      const seconds = ((Math.abs(coord) - degrees - minutes / 60) * 3600).toFixed(1);
      const direction = coord >= 0 ? (isLat ? 'N' : 'E') : (isLat ? 'S' : 'W');
      return `${degrees}°${minutes}'${seconds}"${direction}`;
    };
    
    return `${formatDMS(lat, true)} ${formatDMS(lng, false)}`;
  };

  const toggleLayer = (layerName: string) => {
    setActiveLayers(prev => ({
      ...prev,
      [layerName]: !prev[layerName]
    }));
  };

  const currentLocation = {
    lat: viewState.latitude,
    lng: viewState.longitude
  };

  const mapRef = useRef<HTMLDivElement>(null);
  const [dragState, setDragState] = useState({ isDragging: false, lastX: 0, lastY: 0 });
  const [mapOffset, setMapOffset] = useState({ x: 0, y: 0 });

  // Handle mouse interactions for panning
  const handleMouseDown = (e: React.MouseEvent) => {
    setDragState({ isDragging: true, lastX: e.clientX, lastY: e.clientY });
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!dragState.isDragging) return;
    
    const deltaX = e.clientX - dragState.lastX;
    const deltaY = e.clientY - dragState.lastY;
    
    setMapOffset(prev => ({ 
      x: prev.x + deltaX, 
      y: prev.y + deltaY 
    }));
    
    setDragState(prev => ({ 
      ...prev, 
      lastX: e.clientX, 
      lastY: e.clientY 
    }));
  };

  const handleMouseUp = () => {
    setDragState(prev => ({ ...prev, isDragging: false }));
  };

  return (
    <div className="relative w-full h-full overflow-hidden bg-gray-100">
      {/* Top Header Bar */}
      <div className="absolute top-0 left-0 right-0 z-20 bg-slate-800/95 backdrop-blur border-b border-slate-700">
        <div className="flex items-center justify-between px-4 py-2">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-primary/20 rounded border border-primary/30 flex items-center justify-center">
              <MapPin className="w-4 h-4 text-primary" />
            </div>
            <div>
              <h3 className="text-sm font-semibold text-white">Live Map Preview</h3>
              <p className="text-xs text-gray-400">3 active layers • Exact Positioning</p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-green-400 rounded-full"></div>
            <span className="text-xs text-gray-300">exact</span>
            <Button variant="ghost" size="sm" className="h-8 w-8 p-0 text-white hover:bg-white/10">
              <Search className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* Main Map Container */}
      <div 
        ref={mapRef}
        className="absolute inset-0 pt-12 pb-10 cursor-grab active:cursor-grabbing"
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
      >
        {/* Map Background - SVG based map of Delhi */}
        <div 
          className="w-full h-full relative"
          style={{ 
            transform: `translate(${mapOffset.x}px, ${mapOffset.y}px) scale(${Math.min(viewState.zoom / 10, 2)})`,
            transformOrigin: 'center center'
          }}
        >
          {/* Base map background */}
          <svg 
            viewBox="0 0 800 600" 
            className="absolute inset-0 w-full h-full"
            style={{ minWidth: '100%', minHeight: '100%' }}
          >
            {/* Background */}
            <rect width="800" height="600" fill="#f8f9fa" />
            
            {/* Rivers */}
            <path d="M100 300 Q400 280 700 320" stroke="#87CEEB" strokeWidth="8" fill="none" opacity="0.7" />
            
            {/* Major Roads */}
            <path d="M0 200 L800 200" stroke="#E5E7EB" strokeWidth="4" />
            <path d="M0 400 L800 400" stroke="#E5E7EB" strokeWidth="4" />
            <path d="M200 0 L200 600" stroke="#E5E7EB" strokeWidth="4" />
            <path d="M600 0 L600 600" stroke="#E5E7EB" strokeWidth="4" />
            
            {/* Highways */}
            <path d="M50 150 L750 180" stroke="#FCD34D" strokeWidth="3" />
            <path d="M80 450 L720 420" stroke="#FCD34D" strokeWidth="3" />
            
            {/* Green areas - Parks */}
            <circle cx="150" cy="120" r="40" fill="#10B981" opacity="0.3" />
            <circle cx="500" cy="180" r="30" fill="#10B981" opacity="0.3" />
            <circle cx="650" cy="350" r="50" fill="#10B981" opacity="0.3" />
          </svg>

          {/* Central Red Pin */}
          <div 
            className="absolute transform -translate-x-1/2 -translate-y-full"
            style={{ 
              left: '400px', 
              top: '300px',
              zIndex: 20
            }}
          >
            <MapPin className="w-8 h-8 text-red-500 drop-shadow-lg" fill="currentColor" />
          </div>

          {/* POI Markers */}
          {demoData.map((poi, index) => (
            <div
              key={poi.id}
              className="absolute transform -translate-x-1/2 -translate-y-1/2 cursor-pointer hover:scale-110 transition-transform group"
              style={{
                left: `${300 + (index % 3) * 100}px`,
                top: `${200 + Math.floor(index / 3) * 80}px`,
                zIndex: 15
              }}
              onClick={() => setSelectedMarker(poi)}
            >
              <div 
                className="w-6 h-6 rounded-full flex items-center justify-center text-white text-xs font-bold shadow-lg border-2 border-white relative"
                style={{ backgroundColor: poi.color }}
              >
                {poi.type === 'historical' && <Home className="w-3 h-3" />}
                {poi.type === 'transport' && <Plane className="w-3 h-3" />}
                {poi.type === 'shopping' && <ShoppingBag className="w-3 h-3" />}
                {poi.type === 'park' && <Trees className="w-3 h-3" />}
                {poi.type === 'religious' && <div className="w-2 h-2 bg-white rounded-full" />}
                {poi.type === 'museum' && <div className="w-2 h-2 bg-white rounded-full" />}
              </div>
              
              {/* POI Label */}
              <div className="absolute top-full left-1/2 transform -translate-x-1/2 mt-1 opacity-0 group-hover:opacity-100 transition-opacity">
                <div className="bg-white/95 backdrop-blur px-2 py-1 rounded shadow-lg border text-xs font-medium text-gray-800 whitespace-nowrap">
                  {poi.name}
                </div>
              </div>
            </div>
          ))}

          {/* Hospital markers */}
          {activeLayers.hospitals && (
            <>
              <div className="absolute w-3 h-3 bg-red-500 rounded-full border border-white" 
                   style={{ left: '350px', top: '250px', zIndex: 10 }} />
              <div className="absolute w-3 h-3 bg-red-500 rounded-full border border-white" 
                   style={{ left: '450px', top: '350px', zIndex: 10 }} />
            </>
          )}

          {/* ATM markers */}
          {activeLayers.atms && (
            <>
              <div className="absolute w-3 h-3 bg-blue-500 rounded-full border border-white" 
                   style={{ left: '320px', top: '280px', zIndex: 10 }} />
              <div className="absolute w-3 h-3 bg-blue-500 rounded-full border border-white" 
                   style={{ left: '480px', top: '320px', zIndex: 10 }} />
            </>
          )}

          {/* Ward boundaries */}
          {activeLayers.wardBoundaries && (
            <svg className="absolute inset-0 w-full h-full pointer-events-none" viewBox="0 0 800 600">
              <rect x="250" y="150" width="300" height="200" 
                    fill="none" stroke="#FFA500" strokeWidth="2" 
                    strokeDasharray="5,5" opacity="0.8" />
            </svg>
          )}

          {/* Road Labels */}
          <div className="absolute text-xs font-medium text-gray-600" style={{ left: '100px', top: '190px' }}>A44</div>
          <div className="absolute text-xs font-medium text-gray-600" style={{ left: '500px', top: '390px' }}>NE3</div>
          <div className="absolute text-xs font-medium text-gray-600" style={{ left: '650px', top: '250px' }}>Sector 62</div>
        </div>
      </div>

      {/* Coordinates Display - Top Left */}
      <div className="absolute top-16 left-4 z-10 bg-white/95 backdrop-blur border border-gray-200 rounded-lg p-3 shadow-lg">
        <div className="text-sm font-mono font-bold text-gray-800">
          {formatCoordinates(currentLocation.lat, currentLocation.lng)}
        </div>
        <div className="text-xs text-gray-600 mt-1">
          Central Delhi, New Delhi, Delhi
        </div>
        <div className="flex items-center space-x-2 mt-2">
          <Button variant="ghost" size="sm" className="h-6 text-xs">
            <Navigation className="w-3 h-3 mr-1" />
            Directions
          </Button>
        </div>
        <Button variant="link" size="sm" className="text-xs text-blue-600 p-0 h-auto mt-1">
          View larger map
        </Button>
      </div>

      {/* Map Controls - Bottom Left */}
      <div className="absolute bottom-16 left-4 z-10 bg-white/95 backdrop-blur border border-gray-200 rounded-lg p-2 shadow-lg">
        <div className="text-xs font-mono text-gray-600 space-y-1">
          <div>Zoom: {Math.round(viewState.zoom)}</div>
          <div>Lat: {currentLocation.lat.toFixed(4)}</div>
          <div>Lng: {currentLocation.lng.toFixed(4)}</div>
        </div>
      </div>

      {/* Zoom Controls - Right Side */}
      <div className="absolute top-20 right-4 z-10 flex flex-col space-y-1">
        <Button 
          variant="outline" 
          size="sm" 
          className="w-8 h-8 p-0 bg-white/95 hover:bg-white"
          onClick={() => setViewState({...viewState, zoom: Math.min(viewState.zoom + 1, 18)})}
        >
          <ZoomIn className="w-4 h-4" />
        </Button>
        <Button 
          variant="outline" 
          size="sm" 
          className="w-8 h-8 p-0 bg-white/95 hover:bg-white"
          onClick={() => setViewState({...viewState, zoom: Math.max(viewState.zoom - 1, 1)})}
        >
          <ZoomOut className="w-4 h-4" />
        </Button>
      </div>

      {/* Active Layers Panel - Bottom */}
      <div className="absolute bottom-0 left-0 right-0 z-10 bg-slate-800/95 backdrop-blur border-t border-slate-700">
        <div className="flex items-center justify-between px-4 py-2">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <Layers className="w-4 h-4 text-gray-300" />
              <span className="text-sm text-white font-medium">Active Layers:</span>
            </div>
            <div className="flex items-center space-x-4">
              <button
                onClick={() => toggleLayer('hospitals')}
                className={`flex items-center space-x-1 text-xs px-2 py-1 rounded transition-colors ${
                  activeLayers.hospitals ? 'bg-red-500/20 text-red-300' : 'text-gray-400 hover:text-red-300'
                }`}
              >
                <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                <span>Hospitals</span>
              </button>
              <button
                onClick={() => toggleLayer('atms')}
                className={`flex items-center space-x-1 text-xs px-2 py-1 rounded transition-colors ${
                  activeLayers.atms ? 'bg-blue-500/20 text-blue-300' : 'text-gray-400 hover:text-blue-300'
                }`}
              >
                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                <span>ATMs</span>
              </button>
              <button
                onClick={() => toggleLayer('wardBoundaries')}
                className={`flex items-center space-x-1 text-xs px-2 py-1 rounded transition-colors ${
                  activeLayers.wardBoundaries ? 'bg-orange-500/20 text-orange-300' : 'text-gray-400 hover:text-orange-300'
                }`}
              >
                <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                <span>Ward Boundaries</span>
              </button>
            </div>
          </div>
          <div className="text-xs text-gray-400">
            Map data ©2025
          </div>
        </div>
      </div>

      {/* Selected Marker Popup */}
      {selectedMarker && (
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-30">
          <div className="bg-white rounded-lg shadow-xl border p-4 min-w-48">
            <div className="flex justify-between items-start mb-2">
              <h3 className="font-semibold text-sm text-gray-800">{selectedMarker.name}</h3>
              <button
                onClick={() => setSelectedMarker(null)}
                className="text-gray-400 hover:text-gray-600 text-lg leading-none"
              >
                ×
              </button>
            </div>
            <p className="text-xs text-gray-600 capitalize mb-2">{selectedMarker.type}</p>
            <p className="text-xs text-gray-500">
              Category: {selectedMarker.type} • Location: Central Delhi
            </p>
          </div>
        </div>
      )}

      {/* Loading Overlay */}
      {uiState.isLoading && (
        <div className="absolute inset-0 bg-background/20 backdrop-blur-sm flex items-center justify-center z-40">
          <div className="glass rounded-xl p-8 flex items-center space-x-4 scale-in">
            <div className="w-8 h-8 border-4 border-primary/30 border-t-primary rounded-full animate-spin"></div>
            <span className="text-lg font-medium text-foreground">Processing query...</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default MapView;