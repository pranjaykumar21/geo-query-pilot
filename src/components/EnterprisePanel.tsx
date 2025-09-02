import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { 
  Shield, 
  ShieldCheck, 
  Download, 
  Upload, 
  Lock, 
  Zap, 
  BarChart3, 
  Users,
  Database,
  FileUp
} from 'lucide-react';
import { useStore } from '@/stores/useStore';

const EnterprisePanel: React.FC = () => {
  const { uiState, togglePrivacyMode } = useStore();

  const enterpriseMetrics = [
    { label: 'Query Accuracy', value: '94.2%', icon: BarChart3, color: 'text-secondary' },
    { label: 'Privacy Score', value: '99.8%', icon: ShieldCheck, color: 'text-secondary' },
    { label: 'Data Breach Risk', value: 'Zero', icon: Lock, color: 'text-secondary' },
    { label: 'Performance', value: '<2s', icon: Zap, color: 'text-secondary' },
  ];

  return (
    <div className="p-6 space-y-6 h-full overflow-y-auto">
      {/* Privacy Control Header */}
      <Card className="glass glass-hover border-primary/20">
        <CardHeader className="pb-4">
          <CardTitle className="flex items-center space-x-3">
            <div className="p-2 rounded-lg bg-primary/10">
              <Shield className="w-5 h-5 text-primary" />
            </div>
            <div>
              <h3 className="text-lg font-semibold">Enterprise Security</h3>
              <p className="text-sm text-muted-foreground">Local processing with zero external exposure</p>
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Privacy Mode Toggle */}
          <div className="flex items-center justify-between p-4 rounded-lg bg-muted/30">
            <div className="flex items-center space-x-3">
              <ShieldCheck className={`w-5 h-5 ${uiState.isPrivacyMode ? 'text-secondary' : 'text-muted-foreground'}`} />
              <div>
                <p className="font-medium">Privacy Mode</p>
                <p className="text-xs text-muted-foreground">
                  {uiState.isPrivacyMode 
                    ? 'Coordinates obfuscated for security' 
                    : 'Precise coordinates visible'
                  }
                </p>
              </div>
            </div>
            <Switch 
              checked={uiState.isPrivacyMode} 
              onCheckedChange={togglePrivacyMode}
            />
          </div>

          {uiState.isPrivacyMode && (
            <div className="p-3 rounded-lg bg-secondary/10 border border-secondary/20">
              <p className="text-sm text-secondary flex items-center">
                <ShieldCheck className="w-4 h-4 mr-2" />
                Privacy Mode activated: Coordinates obfuscated for security
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Enterprise Metrics */}
      <Card className="glass glass-hover">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <BarChart3 className="w-5 h-5 text-accent" />
            <span>Security Metrics</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4">
            {enterpriseMetrics.map((metric, index) => (
              <div key={index} className="p-4 rounded-lg bg-muted/20 glass-hover">
                <div className="flex items-center space-x-2 mb-2">
                  <metric.icon className={`w-4 h-4 ${metric.color}`} />
                  <p className="text-sm text-muted-foreground">{metric.label}</p>
                </div>
                <p className="text-xl font-bold text-foreground">{metric.value}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Data Management */}
      <Card className="glass glass-hover">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Database className="w-5 h-5 text-primary" />
            <span>Data Management</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Upload Data */}
          <div className="p-4 rounded-lg border-2 border-dashed border-muted-foreground/30 glass-hover text-center">
            <FileUp className="w-8 h-8 text-muted-foreground mx-auto mb-2" />
            <p className="text-sm text-muted-foreground mb-3">
              Upload private geospatial datasets
            </p>
            <Button variant="outline" size="sm" className="glass-hover">
              <Upload className="w-4 h-4 mr-2" />
              Upload CSV/GeoJSON
            </Button>
            <p className="text-xs text-muted-foreground mt-2">
              Supports CSV, GeoJSON formats • Max 100MB
            </p>
          </div>

          {/* Export Options */}
          <div className="space-y-2">
            <p className="text-sm font-medium text-foreground">Export Results</p>
            <div className="flex space-x-2">
              <Button 
                variant="outline" 
                size="sm" 
                className="flex-1 glass-hover border-secondary/30 text-secondary hover:bg-secondary/10"
              >
                <Download className="w-4 h-4 mr-2" />
                CSV Export
              </Button>
              <Button 
                variant="outline" 
                size="sm" 
                className="flex-1 glass-hover border-secondary/30 text-secondary hover:bg-secondary/10"
              >
                <Download className="w-4 h-4 mr-2" />
                GeoJSON
              </Button>
            </div>
            <p className="text-xs text-muted-foreground">
              {uiState.isPrivacyMode ? 'Exports will include obfuscated coordinates' : 'Exports will include precise coordinates'}
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Authentication & Access */}
      <Card className="glass glass-hover">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Users className="w-5 h-5 text-accent" />
            <span>Access Control</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">Enterprise Login</p>
              <p className="text-xs text-muted-foreground">Single sign-on integration</p>
            </div>
            <Badge variant="outline" className="border-accent/30 text-accent">
              Coming Soon
            </Badge>
          </div>
          
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">Role-Based Access</p>
              <p className="text-xs text-muted-foreground">Granular permissions</p>
            </div>
            <Badge variant="outline" className="border-accent/30 text-accent">
              Enterprise
            </Badge>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default EnterprisePanel;