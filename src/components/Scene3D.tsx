import React, { useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Sphere, Box, Torus, Text3D, Float } from '@react-three/drei';
import * as THREE from 'three';

// Floating geometric shapes
const FloatingShape: React.FC<{ position: [number, number, number]; type: 'sphere' | 'box' | 'torus' }> = ({ position, type }) => {
  const meshRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.x += 0.01;
      meshRef.current.rotation.y += 0.01;
      meshRef.current.position.y = position[1] + Math.sin(state.clock.elapsedTime) * 0.2;
    }
  });

  const shapes = {
    sphere: <Sphere ref={meshRef} args={[0.3, 16, 16]} position={position}>
      <meshStandardMaterial color="#8b5cf6" transparent opacity={0.6} />
    </Sphere>,
    box: <Box ref={meshRef} args={[0.4, 0.4, 0.4]} position={position}>
      <meshStandardMaterial color="#06b6d4" transparent opacity={0.6} />
    </Box>,
    torus: <Torus ref={meshRef} args={[0.3, 0.1, 8, 16]} position={position}>
      <meshStandardMaterial color="#f59e0b" transparent opacity={0.6} />
    </Torus>
  };

  return shapes[type];
};

// Animated background particles
const Particles: React.FC = () => {
  const particlesRef = useRef<THREE.Points>(null);
  
  const particleCount = 100;
  const positions = new Float32Array(particleCount * 3);
  
  for (let i = 0; i < particleCount; i++) {
    positions[i * 3] = (Math.random() - 0.5) * 10;
    positions[i * 3 + 1] = (Math.random() - 0.5) * 10;
    positions[i * 3 + 2] = (Math.random() - 0.5) * 10;
  }

  useFrame(() => {
    if (particlesRef.current) {
      particlesRef.current.rotation.y += 0.001;
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
      <pointsMaterial color="#8b5cf6" size={0.02} sizeAttenuation transparent opacity={0.6} />
    </points>
  );
};

// Main 3D Scene Component
const Scene3D: React.FC<{ className?: string }> = ({ className = "" }) => {
  return (
    <div className={`w-full h-full ${className}`}>
      <Canvas camera={{ position: [0, 0, 5], fov: 60 }}>
        {/* Lighting */}
        <ambientLight intensity={0.4} />
        <directionalLight position={[10, 10, 5]} intensity={0.8} />
        <pointLight position={[-10, -10, -5]} intensity={0.4} color="#8b5cf6" />

        {/* Background particles */}
        <Particles />

        {/* Floating shapes */}
        <Float speed={1} rotationIntensity={1} floatIntensity={0.5}>
          <FloatingShape position={[-2, 1, 0]} type="sphere" />
        </Float>
        
        <Float speed={1.5} rotationIntensity={1.5} floatIntensity={0.7}>
          <FloatingShape position={[2, -1, -1]} type="box" />
        </Float>
        
        <Float speed={0.8} rotationIntensity={0.8} floatIntensity={0.3}>
          <FloatingShape position={[0, 0, -2]} type="torus" />
        </Float>

        {/* 3D Text */}
        <Float speed={2} rotationIntensity={0.1} floatIntensity={0.1}>
          <Text3D
            font="/fonts/Inter_Bold.json"
            size={0.3}
            height={0.05}
            position={[0, 2, 0]}
            rotation={[0, 0, 0]}
          >
            GeoQuery
            <meshStandardMaterial color="#06b6d4" />
          </Text3D>
        </Float>

        {/* Interactive controls */}
        <OrbitControls
          enablePan={false}
          enableZoom={false}
          enableRotate={true}
          autoRotate
          autoRotateSpeed={0.5}
        />
      </Canvas>
    </div>
  );
};

export default Scene3D;