import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Slider } from '@/components/ui/slider';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { 
  Globe, 
  Grid3X3, 
  MapPin, 
  Cloud, 
  Zap,
  Plane,
  Users,
  Search,
  RotateCcw,
  Upload
} from 'lucide-react';

interface OverlayState {
  graticule: boolean;
  cities: boolean;
  clouds: boolean;
  atmosphere: boolean;
  weather: boolean;
  population: boolean;
  flights: boolean;
  earthquakes: boolean;
  customGeoJSON: boolean;
}

interface GlobeControlPanelProps {
  overlays: OverlayState;
  onOverlayChange: (overlay: keyof OverlayState, enabled: boolean) => void;
  onResetView: () => void;
  onSearch: (query: string) => void;
  onFileUpload: (file: File) => void;
}

const GlobeControlPanel: React.FC<GlobeControlPanelProps> = ({
  overlays,
  onOverlayChange,
  onResetView,
  onSearch,
  onFileUpload
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [opacity, setOpacity] = useState([80]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      onSearch(searchQuery.trim());
      setSearchQuery('');
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && file.name.endsWith('.geojson')) {
      onFileUpload(file);
    }
  };

  const overlayControls = [
    {
      key: 'graticule' as keyof OverlayState,
      label: 'Lat/Long Grid',
      icon: Grid3X3,
      description: 'Show latitude and longitude lines'
    },
    {
      key: 'cities' as keyof OverlayState,
      label: 'Major Cities',
      icon: MapPin,
      description: 'Display major world cities'
    },
    {
      key: 'clouds' as keyof OverlayState,
      label: 'Cloud Layer',
      icon: Cloud,
      description: 'Animated cloud coverage'
    },
    {
      key: 'atmosphere' as keyof OverlayState,
      label: 'Atmosphere',
      icon: Globe,
      description: 'Atmospheric glow effect'
    },
    {
      key: 'weather' as keyof OverlayState,
      label: 'Live Weather',
      icon: Cloud,
      description: 'Real-time weather data',
      badge: 'Live'
    },
    {
      key: 'population' as keyof OverlayState,
      label: 'Population Density',
      icon: Users,
      description: 'Population heatmap overlay'
    },
    {
      key: 'flights' as keyof OverlayState,
      label: 'Flight Paths',
      icon: Plane,
      description: 'Live flight tracking',
      badge: 'Live'
    },
    {
      key: 'earthquakes' as keyof OverlayState,
      label: 'Earthquakes',
      icon: Zap,
      description: 'Recent seismic activity',
      badge: 'Live'
    }
  ];

  return (
    <Card className="w-80 bg-background/95 backdrop-blur-sm border-primary/20">
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center gap-2 text-lg">
          <Globe className="w-5 h-5 text-primary" />
          Globe Controls
        </CardTitle>
      </CardHeader>
      
      <CardContent className="space-y-6">
        {/* Search */}
        <div className="space-y-2">
          <label className="text-sm font-medium">Search Location</label>
          <form onSubmit={handleSearch} className="flex gap-2">
            <Input
              placeholder="Enter city or country..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="flex-1"
            />
            <Button type="submit" size="sm" variant="outline">
              <Search className="w-4 h-4" />
            </Button>
          </form>
        </div>

        {/* Quick Actions */}
        <div className="flex gap-2">
          <Button 
            onClick={onResetView} 
            variant="outline" 
            size="sm" 
            className="flex-1"
          >
            <RotateCcw className="w-4 h-4 mr-2" />
            Reset View
          </Button>
        </div>

        {/* Overlay Controls */}
        <div className="space-y-4">
          <h3 className="text-sm font-medium text-muted-foreground">Display Layers</h3>
          
          {overlayControls.map((control) => {
            const IconComponent = control.icon;
            return (
              <div key={control.key} className="flex items-center justify-between p-3 rounded-lg border border-border/50 hover:border-primary/30 transition-colors">
                <div className="flex items-center gap-3">
                  <IconComponent className="w-4 h-4 text-primary" />
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium">{control.label}</span>
                      {control.badge && (
                        <Badge variant="secondary" className="text-xs">
                          {control.badge}
                        </Badge>
                      )}
                    </div>
                    <p className="text-xs text-muted-foreground">
                      {control.description}
                    </p>
                  </div>
                </div>
                <Switch
                  checked={overlays[control.key]}
                  onCheckedChange={(checked) => onOverlayChange(control.key, checked)}
                />
              </div>
            );
          })}
        </div>

        {/* Global Opacity */}
        <div className="space-y-3">
          <label className="text-sm font-medium">Overlay Opacity</label>
          <div className="flex items-center gap-3">
            <Slider
              value={opacity}
              onValueChange={setOpacity}
              max={100}
              min={0}
              step={5}
              className="flex-1"
            />
            <span className="text-sm text-muted-foreground w-10">
              {opacity[0]}%
            </span>
          </div>
        </div>

        {/* Custom GeoJSON Upload */}
        <div className="space-y-2">
          <label className="text-sm font-medium">Custom Data</label>
          <div className="flex items-center gap-2">
            <Input
              type="file"
              accept=".geojson"
              onChange={handleFileUpload}
              className="flex-1"
            />
            <Button size="sm" variant="outline">
              <Upload className="w-4 h-4" />
            </Button>
          </div>
          <p className="text-xs text-muted-foreground">
            Upload GeoJSON files to display custom data
          </p>
        </div>

        {/* Keyboard Shortcuts */}
        <div className="space-y-2">
          <h3 className="text-sm font-medium text-muted-foreground">Keyboard Shortcuts</h3>
          <div className="text-xs space-y-1 text-muted-foreground">
            <div className="flex justify-between">
              <span>Reset view</span>
              <kbd className="px-1 py-0.5 bg-muted rounded text-xs">R</kbd>
            </div>
            <div className="flex justify-between">
              <span>Zoom in/out</span>
              <kbd className="px-1 py-0.5 bg-muted rounded text-xs">+/-</kbd>
            </div>
            <div className="flex justify-between">
              <span>Pan view</span>
              <kbd className="px-1 py-0.5 bg-muted rounded text-xs">↑↓←→</kbd>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default GlobeControlPanel;