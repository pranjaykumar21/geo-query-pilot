import React, { useRef, useState, useCallback, useEffect } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Text, Float } from '@react-three/drei';
import * as THREE from 'three';
import EarthGlobe from './EarthGlobe';
import GlobeControlPanel from './GlobeControlPanel';

// Animated background particles
const Particles: React.FC = () => {
  const particlesRef = useRef<THREE.Points>(null);
  
  const particleCount = 200;
  const positions = new Float32Array(particleCount * 3);
  
  for (let i = 0; i < particleCount; i++) {
    positions[i * 3] = (Math.random() - 0.5) * 20;
    positions[i * 3 + 1] = (Math.random() - 0.5) * 20;
    positions[i * 3 + 2] = (Math.random() - 0.5) * 20;
  }

  useFrame(() => {
    if (particlesRef.current) {
      particlesRef.current.rotation.y += 0.0005;
      particlesRef.current.rotation.x += 0.0002;
    }
  });

  return (
    <points ref={particlesRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={particleCount}
          array={positions}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial color="#8b5cf6" size={0.01} sizeAttenuation transparent opacity={0.4} />
    </points>
  );
};

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

// Main 3D Scene Component
const Scene3D: React.FC<{ className?: string }> = ({ className = "" }) => {
  const cameraRef = useRef<THREE.PerspectiveCamera>(null);
  const controlsRef = useRef<any>(null);
  
  const [overlays, setOverlays] = useState<OverlayState>({
    graticule: true,
    cities: true,
    clouds: true,
    atmosphere: true,
    weather: false,
    population: false,
    flights: false,
    earthquakes: false,
    customGeoJSON: false
  });

  const handleOverlayChange = useCallback((overlay: keyof OverlayState, enabled: boolean) => {
    setOverlays(prev => ({ ...prev, [overlay]: enabled }));
  }, []);

  const handleResetView = useCallback(() => {
    if (controlsRef.current) {
      controlsRef.current.reset();
    }
  }, []);

  const handleSearch = useCallback((query: string) => {
    console.log('Searching for:', query);
    // TODO: Implement location search and camera movement
  }, []);

  const handleFileUpload = useCallback((file: File) => {
    console.log('Uploaded file:', file.name);
    // TODO: Implement GeoJSON file processing
  }, []);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyPress = (event: KeyboardEvent) => {
      switch (event.key.toLowerCase()) {
        case 'r':
          handleResetView();
          break;
        case '+':
        case '=':
          if (controlsRef.current) {
            controlsRef.current.dollyIn(0.9);
            controlsRef.current.update();
          }
          break;
        case '-':
          if (controlsRef.current) {
            controlsRef.current.dollyOut(1.1);
            controlsRef.current.update();
          }
          break;
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [handleResetView]);

  return (
    <div className={`w-full h-full relative ${className}`}>
      <Canvas camera={{ position: [0, 0, 3], fov: 60 }}>
        {/* Background particles */}
        <Particles />

        {/* Earth Globe */}
        <EarthGlobe
          showGraticule={overlays.graticule}
          showCities={overlays.cities}
          showClouds={overlays.clouds}
          showAtmosphere={overlays.atmosphere}
        />

        {/* 3D Text */}
        <Float speed={2} rotationIntensity={0.1} floatIntensity={0.1}>
          <Text
            position={[0, 1.8, 0]}
            fontSize={0.2}
            color="#06b6d4"
            anchorX="center"
            anchorY="middle"
          >
            GeoQuery Earth
          </Text>
        </Float>

        {/* Interactive controls */}
        <OrbitControls
          ref={controlsRef}
          enablePan={true}
          enableZoom={true}
          enableRotate={true}
          autoRotate={false}
          minDistance={1.5}
          maxDistance={10}
          enableDamping={true}
          dampingFactor={0.05}
        />
      </Canvas>

      {/* Control Panel */}
      <div className="absolute top-4 right-4 z-10">
        <GlobeControlPanel
          overlays={overlays}
          onOverlayChange={handleOverlayChange}
          onResetView={handleResetView}
          onSearch={handleSearch}
          onFileUpload={handleFileUpload}
        />
      </div>

      {/* Instructions */}
      <div className="absolute bottom-4 left-4 z-10">
        <div className="bg-background/90 backdrop-blur-sm border border-primary/20 rounded-lg p-3 text-sm">
          <div className="font-medium text-primary mb-1">3D Globe Controls</div>
          <div className="text-muted-foreground space-y-1">
            <div>• Drag to rotate, scroll to zoom</div>
            <div>• Hover cities for info tooltips</div>
            <div>• Use control panel for overlays</div>
            <div>• Press R to reset view</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Scene3D;