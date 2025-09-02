import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  MapPin, 
  Building2, 
  Zap, 
  BarChart3, 
  Shield, 
  Globe,
  Play,
  Sparkles
} from 'lucide-react';

interface StoriesPanelProps {
  onStorySelect: (query: string, view: string) => void;
}

const StoriesPanel: React.FC<StoriesPanelProps> = ({ onStorySelect }) => {
  const stories = [
    {
      id: 'hospitals-cp',
      title: 'Healthcare Discovery',
      description: 'Find hospitals and medical facilities near Connaught Place with emergency services.',
      query: 'hospitals near CP with emergency services',
      targetView: 'map2d',
      icon: Building2,
      thumbnail: 'bg-gradient-to-br from-red-500/20 to-pink-500/20',
      tags: ['Healthcare', 'Emergency', 'Location'],
      featured: true
    },
    {
      id: 'atm-analysis',
      title: 'Financial Services Mapping',
      description: 'Analyze ATM density and banking infrastructure around commercial areas.',
      query: 'HDFC ATMs near CP',
      targetView: 'globe3d',
      icon: MapPin,
      thumbnail: 'bg-gradient-to-br from-secondary/20 to-green-600/20',
      tags: ['Banking', 'Infrastructure', 'Analysis']
    },
    {
      id: 'residential-patterns',
      title: 'Urban Pattern Analysis',
      description: 'Explore residential density patterns and demographic insights with privacy protection.',
      query: 'residential areas near CP',
      targetView: 'analytics',
      icon: BarChart3,
      thumbnail: 'bg-gradient-to-br from-blue-500/20 to-cyan-500/20',
      tags: ['Demographics', 'Residential', 'Patterns']
    },
    {
      id: 'enterprise-demo',
      title: 'Enterprise Security Demo',
      description: 'Demonstrate privacy-preserving geospatial queries with coordinate obfuscation.',
      query: 'secure query for sensitive locations',
      targetView: 'enterprise',
      icon: Shield,
      thumbnail: 'bg-gradient-to-br from-accent/20 to-purple-600/20',
      tags: ['Security', 'Privacy', 'Enterprise'],
      featured: true
    },
    {
      id: 'global-context',
      title: 'Global Context Visualization',
      description: 'View local queries in global context using the interactive 3D globe.',
      query: 'metro stations near CP',
      targetView: 'globe3d',
      icon: Globe,
      thumbnail: 'bg-gradient-to-br from-primary/20 to-blue-600/20',
      tags: ['Global', '3D', 'Transportation']
    },
    {
      id: 'performance-test',
      title: 'High-Performance Processing',
      description: 'Test real-time processing of complex geospatial queries with instant results.',
      query: 'restaurants and shops near CP',
      targetView: 'analytics',
      icon: Zap,
      thumbnail: 'bg-gradient-to-br from-yellow-500/20 to-orange-500/20',
      tags: ['Performance', 'Real-time', 'Commerce']
    }
  ];

  return (
    <div className="p-6 space-y-6 h-full overflow-y-auto">
      {/* Header */}
      <div className="text-center space-y-2">
        <div className="flex items-center justify-center space-x-2 mb-4">
          <div className="p-2 rounded-lg bg-accent/10">
            <Sparkles className="w-6 h-6 text-accent" />
          </div>
          <h2 className="text-2xl font-bold text-foreground">Demo Stories</h2>
        </div>
        <p className="text-muted-foreground max-w-lg mx-auto">
          Explore interactive examples showcasing GeoQuery NLP's capabilities across different use cases and visualizations.
        </p>
      </div>

      {/* Featured Stories */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-foreground flex items-center">
          <Sparkles className="w-5 h-5 mr-2 text-accent" />
          Featured Demos
        </h3>
        <div className="grid gap-4">
          {stories.filter(story => story.featured).map((story) => (
            <Card key={story.id} className="glass glass-hover border-accent/20 group">
              <CardContent className="p-6">
                <div className="flex items-start space-x-4">
                  <div className={`p-4 rounded-xl ${story.thumbnail} group-hover:scale-110 transition-transform duration-300`}>
                    <story.icon className="w-8 h-8 text-foreground" />
                  </div>
                  <div className="flex-1 space-y-3">
                    <div>
                      <h4 className="text-lg font-semibold text-foreground group-hover:text-accent transition-colors">
                        {story.title}
                      </h4>
                      <p className="text-sm text-muted-foreground mt-1">
                        {story.description}
                      </p>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {story.tags.map((tag) => (
                        <Badge key={tag} variant="secondary" className="text-xs bg-muted/30">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                    <Button 
                      onClick={() => onStorySelect(story.query, story.targetView)}
                      className="btn-neon-cyan group-hover:shadow-cyan-glow"
                      size="sm"
                    >
                      <Play className="w-4 h-4 mr-2" />
                      Try This Demo
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* All Stories Grid */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-foreground">All Examples</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {stories.filter(story => !story.featured).map((story) => (
            <Card key={story.id} className="glass glass-hover group">
              <CardHeader className="pb-3">
                <div className="flex items-center space-x-3">
                  <div className={`p-3 rounded-lg ${story.thumbnail} group-hover:scale-110 transition-transform duration-300`}>
                    <story.icon className="w-5 h-5 text-foreground" />
                  </div>
                  <div className="flex-1">
                    <CardTitle className="text-base group-hover:text-primary transition-colors">
                      {story.title}
                    </CardTitle>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="pt-0 space-y-3">
                <p className="text-sm text-muted-foreground">
                  {story.description}
                </p>
                <div className="flex flex-wrap gap-1">
                  {story.tags.map((tag) => (
                    <Badge key={tag} variant="outline" className="text-xs border-muted-foreground/30">
                      {tag}
                    </Badge>
                  ))}
                </div>
                <Button 
                  onClick={() => onStorySelect(story.query, story.targetView)}
                  variant="outline"
                  size="sm"
                  className="w-full glass-hover border-primary/30 text-primary hover:bg-primary/10"
                >
                  <Play className="w-3 h-3 mr-2" />
                  Try Demo
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default StoriesPanel;