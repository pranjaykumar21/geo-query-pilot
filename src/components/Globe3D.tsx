import React, { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Sphere, Float, Points, PointMaterial } from '@react-three/drei';
import * as THREE from 'three';

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

// Main 3D Globe Component
const Globe3D: React.FC<{ className?: string }> = ({ className = "" }) => {
  return (
    <div className={`w-full h-full ${className}`}>
      <Canvas camera={{ position: [0, 0, 8], fov: 50 }}>
        {/* Enhanced Lighting */}
        <ambientLight intensity={0.3} />
        <directionalLight position={[10, 10, 5]} intensity={0.8} color="#38bdf8" />
        <pointLight position={[-10, -10, -5]} intensity={0.4} color="#06b6d4" />
        <spotLight position={[0, 10, 0]} angle={0.3} intensity={0.5} color="#67e8f9" />

        {/* Main Globe */}
        <Globe />
        
        {/* Data Points */}
        <DataPoints />
        
        {/* Floating Elements */}
        <FloatingElements />

        {/* Floating label with simple geometry */}
        <Float speed={1} rotationIntensity={0.1} floatIntensity={0.5}>
          <group position={[0, -4, 0]}>
            <Sphere args={[0.02, 8, 8]} position={[-0.8, 0, 0]}>
              <meshStandardMaterial color="#06b6d4" />
            </Sphere>
            <Sphere args={[0.02, 8, 8]} position={[0.8, 0, 0]}>
              <meshStandardMaterial color="#06b6d4" />
            </Sphere>
          </group>
        </Float>

        {/* Interactive Controls */}
        <OrbitControls
          enablePan={false}
          enableZoom={true}
          enableRotate={true}
          autoRotate
          autoRotateSpeed={0.3}
          minDistance={6}
          maxDistance={15}
        />
      </Canvas>
    </div>
  );
};

export default Globe3D;