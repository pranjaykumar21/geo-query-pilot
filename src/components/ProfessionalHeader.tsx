import React from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Globe, 
  Settings, 
  Bell, 
  User, 
  Shield, 
  Activity,
  ChevronDown,
  Search,
  Menu
} from 'lucide-react';
import { useStore } from '@/stores/useStore';

interface ProfessionalHeaderProps {
  activeView: string;
  onViewChange: (view: string) => void;
}

const ProfessionalHeader: React.FC<ProfessionalHeaderProps> = ({ 
  activeView, 
  onViewChange 
}) => {
  const { uiState, togglePrivacyMode } = useStore();

  const navigationItems = [
    { id: 'chat', label: 'Command Center', icon: Globe },
    { id: 'map2d', label: 'Spatial View', icon: Globe },
    { id: 'globe3d', label: '3D Analysis', icon: Globe },
    { id: 'analytics', label: 'Intelligence', icon: Activity },
    { id: 'enterprise', label: 'Enterprise', icon: Shield },
    { id: 'stories', label: 'Scenarios', icon: Menu }
  ];

  return (
    <motion.header 
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className="glass border-b border-glass-border/30 h-16 flex items-center justify-between px-6 relative z-50"
    >
      {/* Left Section - Brand */}
      <div className="flex items-center space-x-6">
        <motion.div 
          className="flex items-center space-x-3"
          whileHover={{ scale: 1.05 }}
          transition={{ type: "spring", stiffness: 400 }}
        >
          <div className="w-10 h-10 bg-gradient-primary rounded-xl flex items-center justify-center shadow-cyan-glow">
            <Globe className="w-6 h-6 text-primary-foreground" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-foreground">GeoQuery</h1>
            <p className="text-xs text-muted-foreground">Command Center</p>
          </div>
        </motion.div>
        
        {/* Status Indicator */}
        <Badge 
          variant="outline" 
          className="border-success/30 text-success bg-success/10 px-3 py-1"
        >
          <div className="w-2 h-2 bg-success rounded-full mr-2 animate-pulse" />
          System Active
        </Badge>
      </div>

      {/* Center Section - Navigation */}
      <nav className="hidden lg:flex items-center bg-muted/10 backdrop-blur-sm rounded-full p-1 border border-border/20">
        {navigationItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeView === item.id;
          
          return (
            <motion.button
              key={item.id}
              onClick={() => onViewChange(item.id)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 flex items-center space-x-2 ${
                isActive 
                  ? 'bg-primary text-primary-foreground shadow-cyan-glow' 
                  : 'text-muted-foreground hover:text-foreground hover:bg-muted/20'
              }`}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Icon className="w-4 h-4" />
              <span>{item.label}</span>
            </motion.button>
          );
        })}
      </nav>

      {/* Right Section - Actions */}
      <div className="flex items-center space-x-3">
        {/* Search */}
        <Button
          variant="ghost"
          size="icon"
          className="glass-button w-10 h-10"
        >
          <Search className="w-5 h-5" />
        </Button>

        {/* Privacy Mode Toggle */}
        <Button
          onClick={togglePrivacyMode}
          variant="ghost"
          size="icon"
          className={`w-10 h-10 transition-all duration-300 ${
            uiState.isPrivacyMode 
              ? 'bg-warning/20 text-warning hover:bg-warning/30' 
              : 'glass-button'
          }`}
        >
          <Shield className="w-5 h-5" />
        </Button>

        {/* Notifications */}
        <Button
          variant="ghost"
          size="icon"
          className="glass-button w-10 h-10 relative"
        >
          <Bell className="w-5 h-5" />
          <div className="absolute -top-1 -right-1 w-3 h-3 bg-destructive rounded-full" />
        </Button>

        {/* Settings */}
        <Button
          variant="ghost"
          size="icon"
          className="glass-button w-10 h-10"
        >
          <Settings className="w-5 h-5" />
        </Button>

        {/* User Profile */}
        <Button
          variant="ghost"
          className="glass-button px-3 py-2 h-10 flex items-center space-x-2"
        >
          <div className="w-6 h-6 bg-gradient-secondary rounded-full flex items-center justify-center">
            <User className="w-4 h-4 text-secondary-foreground" />
          </div>
          <span className="text-sm font-medium">Admin</span>
          <ChevronDown className="w-4 h-4" />
        </Button>
      </div>

      {/* Mobile Menu Button */}
      <Button
        variant="ghost"
        size="icon"
        className="lg:hidden glass-button w-10 h-10"
      >
        <Menu className="w-5 h-5" />
      </Button>
    </motion.header>
  );
};

export default ProfessionalHeader;