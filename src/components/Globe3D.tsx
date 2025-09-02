import React, { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Sphere, Float, Points, PointMaterial, Stars } from '@react-three/drei';
import * as THREE from 'three';
import { useStore } from '@/stores/useStore';

// Animated globe with data points
const Globe: React.FC = () => {
  const globeRef = useRef<THREE.Mesh>(null);
  const atmosphereRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (globeRef.current) {
      globeRef.current.rotation.y += 0.002;
    }
    if (atmosphereRef.current) {
      atmosphereRef.current.rotation.y += 0.001;
    }
  });

  return (
    <group>
      {/* Main Globe */}
      <Sphere ref={globeRef} args={[2, 64, 64]}>
        <meshPhongMaterial 
          color="#1e40af" 
          shininess={100}
          transparent
          opacity={0.8}
        />
      </Sphere>
      
      {/* Atmosphere */}
      <Sphere ref={atmosphereRef} args={[2.1, 32, 32]}>
        <meshBasicMaterial 
          color="#38bdf8" 
          transparent 
          opacity={0.2}
          side={THREE.BackSide}
        />
      </Sphere>
    </group>
  );
};

// Floating data points around the globe
const DataPoints: React.FC = () => {
  const pointsRef = useRef<THREE.Points>(null);
  
  const particleCount = 150;
  const positions = useMemo(() => {
    const pos = new Float32Array(particleCount * 3);
    for (let i = 0; i < particleCount; i++) {
      const radius = 3 + Math.random() * 2;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.random() * Math.PI;
      
      pos[i * 3] = radius * Math.sin(phi) * Math.cos(theta);
      pos[i * 3 + 1] = radius * Math.cos(phi);
      pos[i * 3 + 2] = radius * Math.sin(phi) * Math.sin(theta);
    }
    return pos;
  }, []);

  useFrame((state) => {
    if (pointsRef.current) {
      pointsRef.current.rotation.y += 0.001;
    }
  });

  return (
    <Points ref={pointsRef} positions={positions}>
      <PointMaterial
        transparent
        color="#06b6d4"
        size={0.05}
        sizeAttenuation
        opacity={0.8}
      />
    </Points>
  );
};

// Floating geometric shapes
const FloatingElements: React.FC = () => {
  return (
    <>
      <Float speed={2} rotationIntensity={1} floatIntensity={2}>
        <Sphere args={[0.1, 16, 16]} position={[-4, 2, 1]}>
          <meshStandardMaterial color="#06b6d4" transparent opacity={0.7} />
        </Sphere>
      </Float>
      
      <Float speed={1.5} rotationIntensity={0.5} floatIntensity={1.5}>
        <Sphere args={[0.08, 16, 16]} position={[4, -1, -2]}>
          <meshStandardMaterial color="#0891b2" transparent opacity={0.6} />
        </Sphere>
      </Float>
      
      <Float speed={2.5} rotationIntensity={2} floatIntensity={3}>
        <Sphere args={[0.06, 16, 16]} position={[2, 3, 0]}>
          <meshStandardMaterial color="#67e8f9" transparent opacity={0.8} />
        </Sphere>
      </Float>
    </>
  );
};

// Enterprise Globe with Query Results
const EnterpriseGlobe: React.FC = () => {
  const { uiState } = useStore();
  
  // Demo query results around Connaught Place
  const queryResults = useMemo(() => {
    const baseCoords = { lat: 28.6669, lng: 77.3523 }; // Connaught Place
    const results = [];
    
    for (let i = 0; i < 25; i++) {
      const offsetLat = (Math.random() - 0.5) * 0.02;
      const offsetLng = (Math.random() - 0.5) * 0.02;
      
      const lat = baseCoords.lat + offsetLat;
      const lng = baseCoords.lng + offsetLng;
      
      // Convert lat/lng to 3D coordinates on sphere
      const phi = (90 - lat) * (Math.PI / 180);
      const theta = (lng + 180) * (Math.PI / 180);
      const radius = 2.02;
      
      const x = -(radius * Math.sin(phi) * Math.cos(theta));
      const z = radius * Math.sin(phi) * Math.sin(theta);
      const y = radius * Math.cos(phi);
      
      results.push({
        position: [x, y, z],
        category: ['healthcare', 'residential', 'commercial', 'education'][Math.floor(Math.random() * 4)],
        intensity: 0.7 + Math.random() * 0.3,
        value: Math.floor(200 + Math.random() * 500)
      });
    }
    
    return results;
  }, []);

  return (
    <group>
      {queryResults.map((result, index) => (
        <Float key={index} speed={1 + Math.random()} rotationIntensity={0.5} floatIntensity={0.3}>
          <Sphere args={[0.015, 8, 8]} position={result.position}>
            <meshStandardMaterial 
              color={result.category === 'healthcare' ? '#ff4444' : 
                     result.category === 'commercial' ? '#00ff88' : 
                     result.category === 'education' ? '#4488ff' : '#ffaa00'}
              emissive={result.category === 'healthcare' ? '#ff2222' : 
                        result.category === 'commercial' ? '#00ff44' : 
                        result.category === 'education' ? '#2244ff' : '#ff8800'}
              emissiveIntensity={0.2}
            />
          </Sphere>
        </Float>
      ))}
    </group>
  );
};

// Main 3D Globe Component
const Globe3D: React.FC<{ 
  className?: string;
  interactive?: boolean;
  showQueryResults?: boolean;
}> = ({ 
  className = "", 
  interactive = true,
  showQueryResults = false 
}) => {
  return (
    <div className={`w-full h-full ${className}`}>
      <Canvas camera={{ position: [0, 0, 8], fov: 50 }}>
        {/* Space Background */}
        <Stars 
          radius={300} 
          depth={60} 
          count={1000} 
          factor={7} 
          saturation={0} 
          fade 
        />
        
        {/* Enhanced Lighting for Enterprise Feel */}
        <ambientLight intensity={0.2} />
        <directionalLight position={[10, 10, 5]} intensity={0.6} color="#00ffff" />
        <pointLight position={[-10, -10, -5]} intensity={0.3} color="#00ff88" />
        <spotLight position={[0, 10, 0]} angle={0.3} intensity={0.4} color="#8844ff" />

        {/* Main Globe */}
        <Globe />
        
        {/* Data Points */}
        <DataPoints />
        
        {/* Floating Elements */}
        <FloatingElements />

        {/* Query Results (if enabled) */}
        {showQueryResults && <EnterpriseGlobe />}

        {/* Brand Elements */}
        <Float speed={1} rotationIntensity={0.1} floatIntensity={0.5}>
          <group position={[0, -4, 0]}>
            <Sphere args={[0.02, 8, 8]} position={[-1.2, 0, 0]}>
              <meshStandardMaterial color="#00ffff" emissive="#00aaaa" emissiveIntensity={0.3} />
            </Sphere>
            <Sphere args={[0.02, 8, 8]} position={[0, 0, 0]}>
              <meshStandardMaterial color="#00ff88" emissive="#00aa44" emissiveIntensity={0.3} />
            </Sphere>
            <Sphere args={[0.02, 8, 8]} position={[1.2, 0, 0]}>
              <meshStandardMaterial color="#8844ff" emissive="#6622aa" emissiveIntensity={0.3} />
            </Sphere>
          </group>
        </Float>

        {/* Interactive Controls */}
        {interactive && (
          <OrbitControls
            enablePan={false}
            enableZoom={true}
            enableRotate={true}
            autoRotate
            autoRotateSpeed={0.2}
            minDistance={4}
            maxDistance={20}
          />
        )}
      </Canvas>
    </div>
  );
};

export default Globe3D;