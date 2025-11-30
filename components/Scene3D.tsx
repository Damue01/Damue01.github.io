import React, { useRef, useState, useMemo } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { Box, Float, Environment } from '@react-three/drei';
import * as THREE from 'three';

// Vibrant Luxury Palette
const VIBRANT_COLORS = [
  '#FF00FF', // Magenta
  '#00FFFF', // Cyan
  '#FF3300', // Neon Red/Orange
  '#CCFF00', // Acid Green
  '#7000FF', // Electric Purple
  '#FFD700', // Gold
  '#FF1493', // Deep Pink
  '#00FF7F', // Spring Green
];

const VoxelObject: React.FC<{ position: [number, number, number], speed: number, hoverColor: string }> = ({ position, speed, hoverColor }) => {
  const meshRef = useRef<THREE.Mesh>(null);
  const [hovered, setHover] = useState(false);
  const [clicked, setClicked] = useState(false);

  useFrame((state, delta) => {
    if (meshRef.current) {
      // Rotation - Faster on hover
      const targetSpeed = clicked ? 30 : (hovered ? 8 : 1);
      
      meshRef.current.rotation.x += delta * (clicked ? 10 : (hovered ? 3 : speed));
      meshRef.current.rotation.y += delta * (clicked ? 10 : (hovered ? 3 : speed * 0.5));
      
      // Scale: "Punch" effect
      const targetScale = clicked ? 0.8 : (hovered ? 1.3 : 1);
      meshRef.current.scale.lerp(new THREE.Vector3(targetScale, targetScale, targetScale), 0.15);

      // Material Animation
      const material = meshRef.current.material as THREE.MeshStandardMaterial;
      
      if (clicked) {
        material.color.setHex(0xFFFFFF); // Flash White on click
        material.emissive.setHex(0xFFFFFF);
        material.emissiveIntensity = 2;
      } else if (hovered) {
         // INTERACTIVE STATE: Brilliant Color Reveal
         material.color.lerp(new THREE.Color(hoverColor), 0.2); 
         material.emissive.lerp(new THREE.Color(hoverColor), 0.2);
         material.emissiveIntensity = 0.5;
         material.roughness = 0.1;
         material.metalness = 0.4;
      } else {
         // DEFAULT STATE: White Ceramic
         material.color.lerp(new THREE.Color('#F5F5F5'), 0.1); 
         material.emissive.lerp(new THREE.Color('#000000'), 0.1);
         material.emissiveIntensity = 0;
         material.roughness = 0.2;
         material.metalness = 0.1;
      }
    }
  });

  const handleClick = (e: any) => {
    e.stopPropagation();
    setClicked(true);
    setTimeout(() => setClicked(false), 150);
  };

  return (
    <Box
      ref={meshRef}
      args={[0.95, 0.95, 0.95]} 
      position={position}
      onPointerOver={(e) => { e.stopPropagation(); setHover(true); document.body.style.cursor = 'pointer'; }}
      onPointerOut={(e) => { setHover(false); document.body.style.cursor = 'crosshair'; }}
      onClick={handleClick}
    >
      {/* Base Material: Animates between White Ceramic and Vibrant Color */}
      <meshStandardMaterial 
        color="#F5F5F5"
        roughness={0.2}
        metalness={0.1}
        flatShading={false}
      />
      <lineSegments>
        <edgesGeometry args={[new THREE.BoxGeometry(0.95, 0.95, 0.95)]} />
        {/* Wireframe Material: White on hover to act as a clean container */}
        <lineBasicMaterial color={hovered ? "#FFFFFF" : "#DDDDDD"} linewidth={1} />
      </lineSegments>
    </Box>
  );
};

const ArtCluster = () => {
  const groupRef = useRef<THREE.Group>(null);
  const { viewport, pointer } = useThree();

  useFrame((state) => {
    if (groupRef.current) {
      const x = (pointer.x * viewport.width) / 10;
      const y = (pointer.y * viewport.height) / 10;
      
      groupRef.current.rotation.x = THREE.MathUtils.lerp(groupRef.current.rotation.x, y * 0.05, 0.05);
      groupRef.current.rotation.y = THREE.MathUtils.lerp(groupRef.current.rotation.y, x * 0.05 + state.clock.getElapsedTime() * 0.05, 0.05);
    }
  });

  const positions: [number, number, number][] = [
    [0, 0, 0], [1, 0, 0], [-1, 0, 0], [0, 1, 0], [0, -1, 0], [0, 0, 1], [0, 0, -1],
    [1, 1, 0], [-1, -1, 0], [1, -1, 0], [-1, 1, 0],
    [0, 1, 1], [0, -1, -1], [2, 0, 0], [-2, 0, 0],
    [2, 1, 0], [-2, -1, 0], [0, 2, 0], [0, -2, 0],
    [3, 2, 1], [-3, -2, -1], [2, -2, 2], [-2, 2, -2]
  ];

  // Memoize colors so they don't change on re-render
  const voxelColors = useMemo(() => {
    return positions.map(() => VIBRANT_COLORS[Math.floor(Math.random() * VIBRANT_COLORS.length)]);
  }, []);

  return (
    <group ref={groupRef} position={[3, 0, 0]}> 
      {positions.map((pos, idx) => (
        <VoxelObject 
          key={idx} 
          position={pos} 
          speed={0.1 + Math.random() * 0.2}
          hoverColor={voxelColors[idx]}
        />
      ))}
    </group>
  );
};

const Scene3D: React.FC = () => {
  return (
    <div className="w-full h-full relative">
      <Canvas camera={{ position: [0, 0, 14], fov: 30 }} dpr={[1, 2]} gl={{ antialias: true, toneMapping: THREE.ACESFilmicToneMapping }}>
        <color attach="background" args={['transparent']} />
        
        {/* Studio Lighting High Key */}
        <ambientLight intensity={0.8} />
        
        {/* Main Key Light - Cool White */}
        <spotLight position={[10, 10, 10]} angle={0.3} penumbra={0.5} intensity={5} color="#FFFFFF" castShadow />
        
        {/* Fill Light - Warm White */}
        <pointLight position={[-10, -5, 5]} intensity={2} color="#FFFFFF" />
        
        {/* Rim Light for shape definition */}
        <pointLight position={[0, 5, -5]} intensity={3} color="#F0F0F0" />
        
        <Environment preset="studio" />

        <Float speed={1.5} rotationIntensity={0.2} floatIntensity={0.5}>
           <ArtCluster />
        </Float>
      </Canvas>
    </div>
  );
};

export default Scene3D;