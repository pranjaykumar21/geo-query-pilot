import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Shield, Brain, Map, Users, Database, Lock } from 'lucide-react';
import { useStore } from '../stores/useStore';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';

const SystemInfoModal: React.FC = () => {
  const { uiState, setShowSystemInfo } = useStore();

  const features = [
    {
      icon: Brain,
      title: "Advanced NLP",
      description: "BERT-powered natural language understanding for complex geospatial queries",
      technologies: ["BERT", "Transformers", "NER", "Intent Detection"]
    },
    {
      icon: Shield,
      title: "Privacy-Preserving",
      description: "Differential privacy and on-premise processing to protect sensitive data",
      technologies: ["Differential Privacy", "On-premise", "Encrypted Queries"]
    },
    {
      icon: Map,
      title: "Interactive Visualization",
      description: "Rich 2D/3D maps with markers, heatmaps, and spatial analytics",
      technologies: ["Deck.gl", "Mapbox", "WebGL", "3D Rendering"]
    },
    {
      icon: Users,
      title: "Multi-turn Conversations",
      description: "Context-aware dialogue management with clarification capabilities",
      technologies: ["Context Retention", "Clarification", "Active Learning"]
    },
    {
      icon: Database,
      title: "Spatial Knowledge Graph",
      description: "Advanced spatial reasoning using knowledge graphs and PostGIS",
      technologies: ["Neo4j", "PostGIS", "Spatial Reasoning", "Graph Traversal"]
    },
    {
      icon: Lock,
      title: "Enterprise Security",
      description: "Bank-grade security with role-based access and audit trails",
      technologies: ["RBAC", "Audit Logs", "Encryption", "Compliance"]
    }
  ];

  return (
    <AnimatePresence>
      {uiState.showSystemInfo && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          onClick={() => setShowSystemInfo(false)}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="bg-background border border-border rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="border-b border-border p-6">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-bold text-foreground">GeoQuery-NLP System</h2>
                  <p className="text-muted-foreground mt-1">
                    Privacy-preserving conversational geospatial analytics platform
                  </p>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowSystemInfo(false)}
                  className="text-muted-foreground hover:text-foreground"
                >
                  <X className="w-5 h-5" />
                </Button>
              </div>
            </div>

            {/* Content */}
            <div className="p-6 overflow-y-auto max-h-[calc(90vh-120px)]">
              {/* Overview */}
              <div className="mb-8">
                <h3 className="text-lg font-semibold mb-4">System Overview</h3>
                <p className="text-muted-foreground leading-relaxed">
                  GeoQuery-NLP enables non-technical users to interact with sensitive geospatial data through 
                  natural language conversations. Our system combines advanced NLP with privacy-preserving 
                  techniques to provide secure, intuitive access to spatial analytics without compromising 
                  data confidentiality.
                </p>
              </div>

              {/* Key Features */}
              <div className="mb-8">
                <h3 className="text-lg font-semibold mb-4">Key Features</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {features.map((feature, index) => (
                    <motion.div
                      key={feature.title}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                    >
                      <Card className="h-full">
                        <CardHeader className="pb-3">
                          <div className="flex items-center space-x-3">
                            <div className="p-2 bg-primary/10 rounded-lg">
                              <feature.icon className="w-5 h-5 text-primary" />
                            </div>
                            <CardTitle className="text-base">{feature.title}</CardTitle>
                          </div>
                        </CardHeader>
                        <CardContent>
                          <p className="text-sm text-muted-foreground mb-3">
                            {feature.description}
                          </p>
                          <div className="flex flex-wrap gap-1">
                            {feature.technologies.map((tech) => (
                              <Badge key={tech} variant="secondary" className="text-xs">
                                {tech}
                              </Badge>
                            ))}
                          </div>
                        </CardContent>
                      </Card>
                    </motion.div>
                  ))}
                </div>
              </div>

              {/* Use Cases */}
              <div className="mb-8">
                <h3 className="text-lg font-semibold mb-4">Use Case Examples</h3>
                <div className="space-y-3">
                  <Card className="p-4">
                    <h4 className="font-medium mb-2">Multi-turn Spatial Search</h4>
                    <p className="text-sm text-muted-foreground">
                      "Show hospitals in Delhi" → "Now find ATMs within 500m" → "Which ones are open 24/7?"
                    </p>
                  </Card>
                  <Card className="p-4">
                    <h4 className="font-medium mb-2">Privacy-Constrained Queries</h4>
                    <p className="text-sm text-muted-foreground">
                      "Show branch performance without revealing exact locations" → Aggregated heatmap visualization
                    </p>
                  </Card>
                  <Card className="p-4">
                    <h4 className="font-medium mb-2">Ambiguity Resolution</h4>
                    <p className="text-sm text-muted-foreground">
                      "Find nearby branches" → System asks: "Which city?" → Context-aware results
                    </p>
                  </Card>
                </div>
              </div>

              {/* Technical Architecture */}
              <div>
                <h3 className="text-lg font-semibold mb-4">Technical Stack</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  {[
                    "React.js", "TypeScript", "Python", "FastAPI",
                    "BERT", "spaCy", "PostgreSQL", "PostGIS",
                    "Neo4j", "Deck.gl", "Mapbox", "WebGL"
                  ].map((tech) => (
                    <Badge key={tech} variant="outline" className="justify-center p-2">
                      {tech}
                    </Badge>
                  ))}
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="border-t border-border p-6">
              <div className="flex items-center justify-between">
                <div className="text-sm text-muted-foreground">
                  Developed by Team 5 - Advanced Geospatial Analytics
                </div>
                <Button onClick={() => setShowSystemInfo(false)}>
                  Get Started
                </Button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default SystemInfoModal;