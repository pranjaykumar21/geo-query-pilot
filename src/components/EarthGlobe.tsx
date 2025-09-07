import React, { useRef, useMemo, useState, useEffect } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { Sphere, useTexture, Html, Text } from '@react-three/drei';
import * as THREE from 'three';

// Earth textures - using free NASA Blue Marble textures
const EARTH_TEXTURE_URL = 'https://unpkg.com/three-globe/example/img/earth-blue-marble.jpg';
const EARTH_NIGHT_URL = 'https://unpkg.com/three-globe/example/img/earth-night.jpg';
const CLOUDS_URL = 'https://unpkg.com/three-globe/example/img/earth-water.png';

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
  for (let lng = -180; lng <= 180; lng += 15) {
    const points = [];
    for (let lat = -90; lat <= 90; lat += 5) {
      const phi = (90 - lat) * (Math.PI / 180);
      const theta = (lng + 180) * (Math.PI / 180);
      
      const x = Math.sin(phi) * Math.cos(theta) * 1.001;
      const y = Math.cos(phi) * 1.001;
      const z = Math.sin(phi) * Math.sin(theta) * 1.001;
      
      points.push(new THREE.Vector3(x, y, z));
    }
    
    const geometry = new THREE.BufferGeometry().setFromPoints(points);
    const material = new THREE.LineBasicMaterial({ 
      color: 0x666666, 
      transparent: true, 
      opacity: 0.3 
    });
    const line = new THREE.Line(geometry, material);
    graticule.add(line);
  }
  
  // Parallels (latitude lines)
  for (let lat = -75; lat <= 75; lat += 15) {
    const points = [];
    for (let lng = -180; lng <= 180; lng += 5) {
      const phi = (90 - lat) * (Math.PI / 180);
      const theta = (lng + 180) * (Math.PI / 180);
      
      const x = Math.sin(phi) * Math.cos(theta) * 1.001;
      const y = Math.cos(phi) * 1.001;
      const z = Math.sin(phi) * Math.sin(theta) * 1.001;
      
      points.push(new THREE.Vector3(x, y, z));
    }
    
    const geometry = new THREE.BufferGeometry().setFromPoints(points);
    const material = new THREE.LineBasicMaterial({ 
      color: 0x666666, 
      transparent: true, 
      opacity: 0.3 
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
  { name: 'Beijing', lat: 39.9042, lng: 116.4074, population: '21M' },
  { name: 'Cairo', lat: 30.0444, lng: 31.2357, population: '20M' },
  { name: 'Mexico City', lat: 19.4326, lng: -99.1332, population: '22M' }
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
    const radius = 1.02;
    
    return [
      radius * Math.sin(phi) * Math.cos(theta),
      radius * Math.cos(phi),
      radius * Math.sin(phi) * Math.sin(theta)
    ] as [number, number, number];
  }, [city]);
  
  return (
    <group position={position}>
      <Sphere
        args={[0.005, 8, 8]}
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
        <Html distanceFactor={10}>
          <div className="bg-background/90 border border-primary/30 rounded-lg p-2 text-xs text-foreground backdrop-blur-sm">
            <div className="font-semibold">{city.name}</div>
            <div className="text-muted-foreground">Pop: {city.population}</div>
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
  
  // Load textures
  const [earthTexture, earthNightTexture, cloudsTexture] = useTexture([
    EARTH_TEXTURE_URL,
    EARTH_NIGHT_URL,
    CLOUDS_URL
  ]);
  
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
      cloudsRef.current.rotation.y += 0.0005;
    }
    
    // Subtle Earth rotation
    if (earthRef.current) {
      earthRef.current.rotation.y += 0.0002;
    }
    
    // Update graticule opacity based on camera distance
    if (graticuleRef.current && camera) {
      const distance = camera.position.distanceTo(new THREE.Vector3(0, 0, 0));
      const opacity = Math.max(0, Math.min(0.6, (5 - distance) / 3));
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
          specular={new THREE.Color(0x111111)}
        />
      </Sphere>
      
      {/* Clouds */}
      {showClouds && (
        <Sphere ref={cloudsRef} args={[1.003, 32, 32]}>
          <meshPhongMaterial 
            map={cloudsTexture}
            transparent
            opacity={0.4}
            depthWrite={false}
          />
        </Sphere>
      )}
      
      {/* Atmosphere */}
      {showAtmosphere && (
        <Sphere ref={atmosphereRef} args={[1.01, 32, 32]} material={atmosphereMaterial} />
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
        position={[5, 0, 5]} 
        intensity={1.5}
        color="#ffffff"
      />
      <ambientLight intensity={0.2} />
    </group>
  );
};

export default EarthGlobe;