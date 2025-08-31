import React, { useMemo } from 'react';
import DeckGL from '@deck.gl/react';
import { ScatterplotLayer } from '@deck.gl/layers';
import { HeatmapLayer, ContourLayer } from '@deck.gl/aggregation-layers';
import { useStore } from '../stores/useStore';

// Demo mode - using canvas background instead of Mapbox
const MAPBOX_ACCESS_TOKEN = null;

const MapView: React.FC = () => {
  const { 
    viewState, 
    setViewState, 
    queryResults, 
    uiState, 
    setFocusedObject 
  } = useStore();

  // Create layers based on current view mode and data
  const layers = useMemo(() => {
    if (!queryResults?.features) return [];

    const data = queryResults.features;
    const { viewMode, isPrivacyMode } = uiState;

    // Privacy mode shows aggregated data
    if (isPrivacyMode) {
      return [
        new HeatmapLayer({
          id: 'heatmap-layer',
          data,
          getPosition: (d: any) => d.geometry.coordinates,
          getWeight: (d: any) => d.properties.value || d.properties.intensity * 100 || 1,
          radiusPixels: 80,
          intensity: 2,
          threshold: 0.05,
          colorRange: [
            [178, 34, 34, 255],      // Dark red
            [255, 69, 0, 255],       // Red orange  
            [255, 140, 0, 255],      // Dark orange
            [255, 215, 0, 255],      // Gold
            [173, 255, 47, 255],     // Green yellow
            [0, 255, 255, 255],      // Cyan
          ]
        })
      ];
    }

    // Regular view modes
    switch (viewMode) {
      case 'markers':
        return [
          new ScatterplotLayer({
            id: 'scatterplot-layer',
            data,
            pickable: true,
            opacity: 0.8,
            stroked: true,
            filled: true,
            radiusScale: 6,
            radiusMinPixels: 8,
            radiusMaxPixels: 30,
            lineWidthMinPixels: 2,
            getPosition: (d: any) => d.geometry.coordinates,
            getRadius: (d: any) => Math.sqrt((d.properties.value || d.properties.population || 100) / 10),
            getFillColor: (d: any) => {
              const category = d.properties.category;
              switch (category) {
                case 'commercial': return [0, 200, 255, 200]; // Blue
                case 'transport': return [255, 140, 0, 200];  // Orange
                case 'residential': return [50, 205, 50, 200]; // Green
                default: return [255, 255, 255, 200]; // White
              }
            },
            getLineColor: [255, 255, 255, 255],
            transitions: {
              getRadius: 600,
              getFillColor: 600
            }
          })
        ];

      case '3D':
        return [
          new ScatterplotLayer({
            id: 'scatterplot-3d-layer',
            data,
            pickable: true,
            opacity: 0.9,
            stroked: true,
            filled: true,
            radiusScale: 8,
            radiusMinPixels: 10,
            radiusMaxPixels: 50,
            lineWidthMinPixels: 2,
            getPosition: (d: any) => d.geometry.coordinates,
            getRadius: (d: any) => Math.sqrt((d.properties.value || d.properties.population || 100) / 8),
            getFillColor: (d: any) => {
              const intensity = (d.properties.intensity || d.properties.value / 1000 || 0.5);
              return [
                255 * intensity,
                200 * (1 - intensity),
                100 + 155 * intensity,
                220
              ];
            },
            getLineColor: [255, 255, 255, 255],
            transitions: {
              getPosition: 1000,
              getRadius: 600,
              getFillColor: 600
            }
          })
        ];

      case 'heatmap':
        return [
          new ContourLayer({
            id: 'contour-layer',
            data,
            pickable: true,
            getPosition: (d: any) => d.geometry.coordinates,
            getWeight: (d: any) => d.properties.value || d.properties.intensity * 100 || 1,
            contours: [
              { threshold: 1, color: [255, 0, 0, 25] },
              { threshold: 5, color: [255, 100, 0, 50] },
              { threshold: 15, color: [255, 200, 0, 75] },
              { threshold: 25, color: [0, 255, 0, 100] },
              { threshold: 50, color: [0, 200, 255, 125] },
            ],
            cellSize: 200,
            gpuAggregation: true
          })
        ];

      default:
        return [];
    }
  }, [queryResults, uiState]);

  // Handle object clicks
  const handleClick = (info: any) => {
    if (info.object) {
      setFocusedObject(info.object);
    }
  };

  return (
    <div className="relative w-full h-full min-h-[400px] sm:min-h-[500px] lg:min-h-[600px]">
      <DeckGL
        viewState={viewState}
        onViewStateChange={({ viewState: newViewState }) => setViewState(newViewState as any)}
        controller={true}
        layers={layers}
        onClick={handleClick}
        getTooltip={({ object }) => 
          object && {
            html: `
              <div class="p-2 sm:p-3 bg-card/95 backdrop-blur border border-border rounded-lg shadow-lg max-w-xs">
                <h3 class="font-semibold text-card-foreground text-sm sm:text-base">${object.properties.name || 'Location'}</h3>
                <div class="mt-2 space-y-1 text-xs sm:text-sm text-muted-foreground">
                  ${Object.entries(object.properties)
                    .slice(0, 4)
                    .map(([key, value]) => `<div><span class="font-medium">${key}:</span> ${value}</div>`)
                    .join('')}
                </div>
              </div>
            `,
            style: {
              backgroundColor: 'transparent',
              fontSize: '14px'
            }
          }
        }
      >
        {/* Animated 3D background with gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-purple-900/30 to-slate-900 animate-pulse" 
             style={{ animationDuration: '4s' }} />
        
        {/* Floating geometric shapes for 3D effect */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <div className="absolute top-10 left-10 w-4 h-4 bg-primary/20 rounded-full animate-float" 
               style={{ animationDelay: '0s' }} />
          <div className="absolute top-32 right-20 w-6 h-6 bg-accent/20 rounded-full animate-float" 
               style={{ animationDelay: '1s' }} />
          <div className="absolute bottom-20 left-32 w-3 h-3 bg-secondary/20 rounded-full animate-float" 
               style={{ animationDelay: '2s' }} />
          <div className="absolute bottom-40 right-10 w-5 h-5 bg-primary/20 rounded-full animate-float" 
               style={{ animationDelay: '3s' }} />
        </div>
      </DeckGL>

      {/* Loading Overlay */}
      {uiState.isLoading && (
        <div className="absolute inset-0 bg-background/20 backdrop-blur-sm flex items-center justify-center z-10">
          <div className="glass rounded-xl sm:rounded-2xl p-4 sm:p-8 flex items-center space-x-2 sm:space-x-4 scale-in">
            <div className="w-6 h-6 sm:w-8 sm:h-8 border-4 border-primary/30 border-t-primary rounded-full animate-spin"></div>
            <span className="text-sm sm:text-lg font-medium text-foreground">Processing query...</span>
          </div>
        </div>
      )}

      {/* Map Controls Overlay - Responsive */}
      <div className="absolute top-2 right-2 sm:top-4 sm:right-4 z-5">
        <div className="glass rounded-lg sm:rounded-xl p-2 sm:p-3 space-y-1 sm:space-y-2 backdrop-blur-md">
          <div className="text-xs font-mono text-muted-foreground">
            Zoom: {viewState.zoom.toFixed(1)}
          </div>
          <div className="text-xs font-mono text-muted-foreground">
            Pitch: {viewState.pitch.toFixed(0)}°
          </div>
          {queryResults && (
            <div className="text-xs font-mono text-primary font-semibold">
              {queryResults.features?.length || 0} points
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MapView;