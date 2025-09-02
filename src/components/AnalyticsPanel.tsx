import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { 
  BarChart3, 
  Download, 
  MapPin, 
  TrendingUp, 
  Database,
  PieChart,
  Activity
} from 'lucide-react';
import { useStore } from '@/stores/useStore';

const AnalyticsPanel: React.FC = () => {
  const { uiState } = useStore();

  // Demo data for analytics
  const summaryStats = [
    { label: 'Primary Value', value: '524', icon: TrendingUp, color: 'text-primary' },
    { label: 'Analyzed Points', value: '88', icon: MapPin, color: 'text-secondary' },
    { label: 'Categories Found', value: '12', icon: PieChart, color: 'text-accent' },
    { label: 'Avg Intensity', value: '0.908', icon: Activity, color: 'text-warning' },
  ];

  const categoryDistribution = [
    { category: 'Residential', count: 34, percentage: 38.6 },
    { category: 'Commercial', count: 22, percentage: 25.0 },
    { category: 'Healthcare', count: 12, percentage: 13.6 },
    { category: 'Education', count: 10, percentage: 11.4 },
    { category: 'Transportation', count: 6, percentage: 6.8 },
    { category: 'Recreation', count: 4, percentage: 4.5 },
  ];

  const sampleData = [
    { 
      lat: uiState.isPrivacyMode ? '28.6xx' : '28.6669', 
      lng: uiState.isPrivacyMode ? '77.3xx' : '77.3523', 
      category: 'Residential', 
      intensity: 0.908, 
      elevation: 96.118, 
      value: 524 
    },
    { 
      lat: uiState.isPrivacyMode ? '28.6xx' : '28.6698', 
      lng: uiState.isPrivacyMode ? '77.3xx' : '77.3501', 
      category: 'Commercial', 
      intensity: 0.834, 
      elevation: 94.521, 
      value: 412 
    },
    { 
      lat: uiState.isPrivacyMode ? '28.6xx' : '28.6642', 
      lng: uiState.isPrivacyMode ? '77.3xx' : '77.3587', 
      category: 'Healthcare', 
      intensity: 0.921, 
      elevation: 98.342, 
      value: 689 
    },
    { 
      lat: uiState.isPrivacyMode ? '28.6xx' : '28.6701', 
      lng: uiState.isPrivacyMode ? '77.3xx' : '77.3489', 
      category: 'Education', 
      intensity: 0.756, 
      elevation: 92.876, 
      value: 298 
    },
    { 
      lat: uiState.isPrivacyMode ? '28.6xx' : '28.6625', 
      lng: uiState.isPrivacyMode ? '77.3xx' : '77.3612', 
      category: 'Transportation', 
      intensity: 0.892, 
      elevation: 97.123, 
      value: 445 
    },
  ];

  return (
    <div className="p-6 space-y-6 h-full overflow-y-auto">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="p-2 rounded-lg bg-primary/10">
            <BarChart3 className="w-6 h-6 text-primary" />
          </div>
          <div>
            <h2 className="text-xl font-semibold text-foreground">Analytics Dashboard</h2>
            <p className="text-sm text-muted-foreground">
              {uiState.isPrivacyMode ? 'Privacy-protected data view' : 'Detailed geospatial analysis'}
            </p>
          </div>
        </div>
        
        {/* Export Buttons */}
        <div className="flex space-x-2">
          <Button 
            variant="outline" 
            size="sm" 
            className="glass-hover border-secondary/30 text-secondary hover:bg-secondary/10"
          >
            <Download className="w-4 h-4 mr-2" />
            CSV
          </Button>
          <Button 
            variant="outline" 
            size="sm" 
            className="glass-hover border-secondary/30 text-secondary hover:bg-secondary/10"
          >
            <Download className="w-4 h-4 mr-2" />
            GeoJSON
          </Button>
        </div>
      </div>

      {uiState.isPrivacyMode && (
        <div className="p-3 rounded-lg bg-secondary/10 border border-secondary/20">
          <p className="text-sm text-secondary flex items-center">
            <Database className="w-4 h-4 mr-2" />
            Privacy Mode: Coordinates and values are obfuscated for security
          </p>
        </div>
      )}

      {/* Summary Statistics */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {summaryStats.map((stat, index) => (
          <Card key={index} className="glass glass-hover">
            <CardContent className="p-4">
              <div className="flex items-center space-x-3">
                <div className={`p-2 rounded-lg bg-muted/20`}>
                  <stat.icon className={`w-5 h-5 ${stat.color}`} />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">{stat.label}</p>
                  <p className="text-xl font-bold text-foreground">{stat.value}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Category Distribution */}
      <Card className="glass glass-hover">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <PieChart className="w-5 h-5 text-accent" />
            <span>Category Distribution</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {categoryDistribution.map((item, index) => (
              <div key={index} className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div 
                    className="w-3 h-3 rounded-full"
                    style={{ 
                      backgroundColor: `hsl(${(index * 60) % 360}, 70%, 60%)` 
                    }}
                  />
                  <span className="text-sm font-medium text-foreground">{item.category}</span>
                </div>
                <div className="flex items-center space-x-3">
                  <span className="text-sm text-muted-foreground">{item.count} points</span>
                  <Badge variant="secondary" className="text-xs">
                    {item.percentage}%
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Data Table */}
      <Card className="glass glass-hover">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Database className="w-5 h-5 text-primary" />
            <span>Query Results</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ScrollArea className="h-80">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="text-xs">Latitude</TableHead>
                  <TableHead className="text-xs">Longitude</TableHead>
                  <TableHead className="text-xs">Category</TableHead>
                  <TableHead className="text-xs">Intensity</TableHead>
                  <TableHead className="text-xs">Elevation</TableHead>
                  <TableHead className="text-xs">Value</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {sampleData.map((row, index) => (
                  <TableRow key={index} className="glass-hover">
                    <TableCell className="text-xs font-mono">{row.lat}</TableCell>
                    <TableCell className="text-xs font-mono">{row.lng}</TableCell>
                    <TableCell>
                      <Badge variant="outline" className="text-xs">
                        {row.category}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-xs font-mono">{row.intensity}</TableCell>
                    <TableCell className="text-xs font-mono">{row.elevation}</TableCell>
                    <TableCell className="text-xs font-mono font-semibold">{row.value}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </ScrollArea>
        </CardContent>
      </Card>
    </div>
  );
};

export default AnalyticsPanel;