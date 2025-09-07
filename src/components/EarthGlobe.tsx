import React, { useRef, useMemo, useState, Suspense } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { Sphere, Html } from '@react-three/drei';
import * as THREE from 'three';

// Simple procedural Earth-like texture
const createEarthTexture = () => {
  const canvas = document.createElement('canvas');
  canvas.width = 512;
  canvas.height = 256;
  const ctx = canvas.getContext('2d')!;
  
  // Create a simple blue and green Earth-like pattern
  const gradient = ctx.createLinearGradient(0, 0, 512, 256);
  gradient.addColorStop(0, '#2563eb'); // Ocean blue
  gradient.addColorStop(0.3, '#059669'); // Land green
  gradient.addColorStop(0.6, '#2563eb'); // Ocean blue
  gradient.addColorStop(1, '#2563eb'); // Ocean blue
  
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, 512, 256);
  
  // Add some land masses
  ctx.fillStyle = '#059669';
  ctx.fillRect(100, 80, 80, 60); // Simple continent
  ctx.fillRect(300, 120, 120, 80); // Another continent
  
  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  return texture;
};

// Atmospheric glow shader
const atmosphereVertexShader = `
  varying vec3 vNormal;
  void main() {
    vNormal = normalize(normalMatrix * normal);
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

const atmosphereFragmentShader = `
  varying vec3 vNormal;
  void main() {
    float intensity = pow(0.8 - dot(vNormal, vec3(0, 0, 1.0)), 2.0);
    gl_FragColor = vec4(0.3, 0.6, 1.0, 1.0) * intensity;
  }
`;

// Graticule generator
const generateGraticule = () => {
  const graticule = new THREE.Group();
  
  // Meridians (longitude lines)
  for (let lng = -180; lng <= 180; lng += 30) {
    const points = [];
    for (let lat = -90; lat <= 90; lat += 5) {
      const phi = (90 - lat) * (Math.PI / 180);
      const theta = (lng + 180) * (Math.PI / 180);
      
      const x = Math.sin(phi) * Math.cos(theta) * 1.002;
      const y = Math.cos(phi) * 1.002;
      const z = Math.sin(phi) * Math.sin(theta) * 1.002;
      
      points.push(new THREE.Vector3(x, y, z));
    }
    
    const geometry = new THREE.BufferGeometry().setFromPoints(points);
    const material = new THREE.LineBasicMaterial({ 
      color: 0x888888, 
      transparent: true, 
      opacity: 0.4 
    });
    const line = new THREE.Line(geometry, material);
    graticule.add(line);
  }
  
  // Parallels (latitude lines)
  for (let lat = -60; lat <= 60; lat += 30) {
    const points = [];
    for (let lng = -180; lng <= 180; lng += 5) {
      const phi = (90 - lat) * (Math.PI / 180);
      const theta = (lng + 180) * (Math.PI / 180);
      
      const x = Math.sin(phi) * Math.cos(theta) * 1.002;
      const y = Math.cos(phi) * 1.002;
      const z = Math.sin(phi) * Math.sin(theta) * 1.002;
      
      points.push(new THREE.Vector3(x, y, z));
    }
    
    const geometry = new THREE.BufferGeometry().setFromPoints(points);
    const material = new THREE.LineBasicMaterial({ 
      color: 0x888888, 
      transparent: true, 
      opacity: 0.4 
    });
    const line = new THREE.Line(geometry, material);
    graticule.add(line);
  }
  
  return graticule;
};

// Major cities data
const MAJOR_CITIES = [
  { name: 'New York', lat: 40.7128, lng: -74.0060, population: '8.4M' },
  { name: 'London', lat: 51.5074, lng: -0.1278, population: '9.0M' },
  { name: 'Tokyo', lat: 35.6762, lng: 139.6503, population: '14M' },
  { name: 'Delhi', lat: 28.7041, lng: 77.1025, population: '32M' },
  { name: 'Shanghai', lat: 31.2304, lng: 121.4737, population: '26M' },
  { name: 'São Paulo', lat: -23.5505, lng: -46.6333, population: '22M' },
  { name: 'Mumbai', lat: 19.0760, lng: 72.8777, population: '20M' },
  { name: 'Beijing', lat: 39.9042, lng: 116.4074, population: '21M' }
];

interface CityMarkerProps {
  city: typeof MAJOR_CITIES[0];
  onHover: (city: typeof MAJOR_CITIES[0] | null) => void;
}

const CityMarker: React.FC<CityMarkerProps> = ({ city, onHover }) => {
  const [hovered, setHovered] = useState(false);
  
  // Convert lat/lng to 3D position
  const position = useMemo(() => {
    const phi = (90 - city.lat) * (Math.PI / 180);
    const theta = (city.lng + 180) * (Math.PI / 180);
    const radius = 1.03;
    
    return [
      radius * Math.sin(phi) * Math.cos(theta),
      radius * Math.cos(phi),
      radius * Math.sin(phi) * Math.sin(theta)
    ] as [number, number, number];
  }, [city]);
  
  return (
    <group position={position}>
      <Sphere
        args={[0.01, 8, 8]}
        onPointerEnter={() => {
          setHovered(true);
          onHover(city);
        }}
        onPointerLeave={() => {
          setHovered(false);
          onHover(null);
        }}
      >
        <meshBasicMaterial color={hovered ? "#00ffff" : "#ffff00"} />
      </Sphere>
      {hovered && (
        <Html distanceFactor={15}>
          <div className="bg-background/95 border border-primary/30 rounded-lg p-2 text-xs text-foreground backdrop-blur-sm shadow-lg">
            <div className="font-semibold text-primary">{city.name}</div>
            <div className="text-muted-foreground">Population: {city.population}</div>
          </div>
        </Html>
      )}
    </group>
  );
};

interface EarthGlobeProps {
  showGraticule?: boolean;
  showCities?: boolean;
  showClouds?: boolean;
  showAtmosphere?: boolean;
}

const EarthGlobe: React.FC<EarthGlobeProps> = ({
  showGraticule = true,
  showCities = true,
  showClouds = true,
  showAtmosphere = true
}) => {
  const earthRef = useRef<THREE.Mesh>(null);
  const cloudsRef = useRef<THREE.Mesh>(null);
  const atmosphereRef = useRef<THREE.Mesh>(null);
  const graticuleRef = useRef<THREE.Group>(null);
  
  const [hoveredCity, setHoveredCity] = useState<typeof MAJOR_CITIES[0] | null>(null);
  
  const { camera } = useThree();
  
  // Create textures
  const earthTexture = useMemo(() => createEarthTexture(), []);
  
  // Create atmosphere material
  const atmosphereMaterial = useMemo(
    () => new THREE.ShaderMaterial({
      vertexShader: atmosphereVertexShader,
      fragmentShader: atmosphereFragmentShader,
      blending: THREE.AdditiveBlending,
      side: THREE.BackSide,
      transparent: true
    }),
    []
  );
  
  // Generate graticule
  const graticule = useMemo(() => generateGraticule(), []);
  
  // Animation
  useFrame((state) => {
    // Rotate clouds slowly
    if (cloudsRef.current) {
      cloudsRef.current.rotation.y += 0.0008;
    }
    
    // Subtle Earth rotation
    if (earthRef.current) {
      earthRef.current.rotation.y += 0.0003;
    }
    
    // Update graticule opacity based on camera distance
    if (graticuleRef.current && camera) {
      const distance = camera.position.distanceTo(new THREE.Vector3(0, 0, 0));
      const opacity = Math.max(0, Math.min(0.8, (6 - distance) / 4));
      graticuleRef.current.children.forEach((child) => {
        if (child instanceof THREE.Line) {
          (child.material as THREE.LineBasicMaterial).opacity = opacity;
        }
      });
    }
  });
  
  return (
    <group>
      {/* Earth */}
      <Sphere ref={earthRef} args={[1, 64, 64]}>
        <meshPhongMaterial 
          map={earthTexture}
          shininess={0.1}
          specular={new THREE.Color(0x222222)}
        />
      </Sphere>
      
      {/* Clouds */}
      {showClouds && (
        <Sphere ref={cloudsRef} args={[1.005, 32, 32]}>
          <meshBasicMaterial 
            color="#ffffff"
            transparent
            opacity={0.15}
            depthWrite={false}
          />
        </Sphere>
      )}
      
      {/* Atmosphere */}
      {showAtmosphere && (
        <Sphere ref={atmosphereRef} args={[1.02, 32, 32]} material={atmosphereMaterial} />
      )}
      
      {/* Graticule */}
      {showGraticule && (
        <primitive ref={graticuleRef} object={graticule} />
      )}
      
      {/* City markers */}
      {showCities && MAJOR_CITIES.map((city) => (
        <CityMarker 
          key={city.name}
          city={city}
          onHover={setHoveredCity}
        />
      ))}
      
      {/* Lighting */}
      <directionalLight 
        position={[5, 3, 5]} 
        intensity={1.2}
        color="#ffffff"
      />
      <ambientLight intensity={0.3} />
      <pointLight position={[-5, -3, -5]} intensity={0.3} color="#4f46e5" />
    </group>
  );
};

// Wrapper with Suspense for error handling
const EarthGlobeWithSuspense: React.FC<EarthGlobeProps> = (props) => {
  return (
    <Suspense fallback={
      <Sphere args={[1, 32, 32]}>
        <meshBasicMaterial color="#2563eb" wireframe />
      </Sphere>
    }>
      <EarthGlobe {...props} />
    </Suspense>
  );
};

export default EarthGlobeWithSuspense;