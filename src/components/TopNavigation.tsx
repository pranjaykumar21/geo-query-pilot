import React from 'react';
import { Button } from '@/components/ui/button';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  MessageSquare, 
  Map, 
  Globe, 
  BarChart3, 
  Shield, 
  BookOpen,
  Settings,
  RotateCcw,
  ShieldCheck
} from 'lucide-react';
import { useStore } from '@/stores/useStore';

interface TopNavigationProps {
  activeView: string;
  onViewChange: (view: string) => void;
}

const TopNavigation: React.FC<TopNavigationProps> = ({ activeView, onViewChange }) => {
  const { uiState, togglePrivacyMode, resetToDelhi } = useStore();

  const navigationItems = [
    { id: 'chat', label: 'Chat', icon: MessageSquare },
    { id: 'map2d', label: '2D Map', icon: Map },
    { id: 'globe3d', label: '3D Globe', icon: Globe },
    { id: 'analytics', label: 'Analytics', icon: BarChart3 },
    { id: 'enterprise', label: 'Enterprise', icon: Shield },
    { id: 'stories', label: 'Stories', icon: BookOpen },
  ];

  return (
    <div className="h-16 glass border-b border-glass-border/30 flex items-center justify-between px-6 relative z-50">
      {/* Logo and Title */}
      <div className="flex items-center space-x-4">
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-primary-glow flex items-center justify-center">
            <Globe className="w-5 h-5 text-primary-foreground" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-foreground">GeoQuery NLP</h1>
            <p className="text-xs text-muted-foreground">Enterprise Geospatial Intelligence</p>
          </div>
        </div>
      </div>

      {/* Main Navigation */}
      <div className="flex-1 flex justify-center">
        <Tabs value={activeView} onValueChange={onViewChange} className="w-auto">
          <TabsList className="glass-hover h-12 p-1 bg-muted/50">
            {navigationItems.map((item) => (
              <TabsTrigger 
                key={item.id}
                value={item.id}
                className="flex items-center space-x-2 px-4 py-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:shadow-cyan-glow transition-all duration-300"
              >
                <item.icon className="w-4 h-4" />
                <span className="hidden sm:inline">{item.label}</span>
              </TabsTrigger>
            ))}
          </TabsList>
        </Tabs>
      </div>

      {/* Right Actions */}
      <div className="flex items-center space-x-3">
        {/* Privacy Mode Toggle */}
        <Button
          variant={uiState.isPrivacyMode ? "default" : "outline"}
          size="sm"
          onClick={togglePrivacyMode}
          className={`glass-hover ${
            uiState.isPrivacyMode 
              ? 'btn-neon-cyan' 
              : 'border-primary/30 text-primary hover:bg-primary/10'
          }`}
        >
          <ShieldCheck className="w-4 h-4 mr-2" />
          <span className="hidden sm:inline">
            {uiState.isPrivacyMode ? 'Privacy On' : 'Privacy Off'}
          </span>
        </Button>

        {/* Reset View */}
        <Button
          variant="outline"
          size="sm"
          onClick={resetToDelhi}
          className="glass-hover border-muted-foreground/30 text-muted-foreground hover:text-foreground hover:border-foreground/30"
        >
          <RotateCcw className="w-4 h-4" />
        </Button>

        {/* Settings */}
        <Button
          variant="outline"
          size="sm"
          className="glass-hover border-muted-foreground/30 text-muted-foreground hover:text-foreground hover:border-foreground/30"
        >
          <Settings className="w-4 h-4" />
        </Button>
      </div>
    </div>
  );
};

export default TopNavigation;