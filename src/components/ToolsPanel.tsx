import React from 'react';
import { motion } from 'framer-motion';
import { Map, BarChart3, Box, Eye, EyeOff, Layers, Filter, Download } from 'lucide-react';
import { useStore } from '../stores/useStore';
import { Button } from './ui/button';
import { Badge } from './ui/badge';

const ToolsPanel: React.FC = () => {
  const { 
    uiState, 
    setViewMode, 
    togglePrivacyMode,
    queryResults 
  } = useStore();

  const viewModeOptions = [
    { mode: 'markers' as const, icon: Map, label: 'Markers', description: 'Point visualization' },
    { mode: 'heatmap' as const, icon: BarChart3, label: 'Heatmap', description: 'Density analysis' },
    { mode: '3d' as const, icon: Box, label: '3D View', description: 'Spatial elevation' },
  ];

  const analysisTools = [
    { icon: Layers, label: 'Layers', description: 'Toggle data layers' },
    { icon: Filter, label: 'Filters', description: 'Apply data filters' },
    { icon: Download, label: 'Export', description: 'Download results' },
  ];

  return (
    <div className="h-48 border-b border-border bg-card/50 p-4">
      <div className="space-y-4">
        {/* Header */}
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-medium text-foreground">Visualization Tools</h3>
          <Badge variant={uiState.isPrivacyMode ? "default" : "secondary"} className="text-xs">
            {uiState.isPrivacyMode ? "Privacy On" : "Standard"}
          </Badge>
        </div>

        {/* View Mode Selection */}
        <div>
          <p className="text-xs text-muted-foreground mb-2">View Mode</p>
          <div className="grid grid-cols-3 gap-2">
            {viewModeOptions.map(({ mode, icon: Icon, label, description }) => (
              <motion.div key={mode} whileTap={{ scale: 0.95 }}>
                <Button
                  variant={uiState.viewMode === mode ? "default" : "outline"}
                  size="sm"
                  onClick={() => setViewMode(mode)}
                  className="h-auto p-2 flex flex-col items-center text-center w-full"
                >
                  <Icon className="w-4 h-4 mb-1" />
                  <span className="text-xs font-medium">{label}</span>
                  <span className="text-xs text-muted-foreground">{description}</span>
                </Button>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Button
              variant={uiState.isPrivacyMode ? "default" : "ghost"}
              size="sm"
              onClick={togglePrivacyMode}
              className="h-8"
            >
              {uiState.isPrivacyMode ? (
                <EyeOff className="w-4 h-4 mr-1" />
              ) : (
                <Eye className="w-4 h-4 mr-1" />
              )}
              Privacy
            </Button>
          </div>

          <div className="flex items-center space-x-1">
            {analysisTools.map(({ icon: Icon, label }) => (
              <Button
                key={label}
                variant="ghost"
                size="sm"
                className="h-8 w-8 p-0"
                title={label}
              >
                <Icon className="w-4 h-4" />
              </Button>
            ))}
          </div>
        </div>

        {/* Data Status */}
        {queryResults && (
          <div className="text-xs text-muted-foreground">
            <p>
              Showing {queryResults.features?.length || 0} data points
              {queryResults.metadata?.query && ` for "${queryResults.metadata.query}"`}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ToolsPanel;