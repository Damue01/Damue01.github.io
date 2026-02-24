import React, { useRef, useState, useMemo, useCallback } from 'react';
import { Canvas, useFrame, useThree, ThreeEvent } from '@react-three/fiber';
import { Float, Environment } from '@react-three/drei';
import * as THREE from 'three';

// Refined accent palette
const ACCENT_COLORS = [
  '#E8336D', '#00B4D8', '#FF6B35', '#06D6A0',
  '#118AB2', '#FFD166', '#EF476F', '#26547C',
];

// Shared geometry (avoid per-instance allocation)
const boxGeo = new THREE.BoxGeometry(0.95, 0.95, 0.95);
const edgeGeo = new THREE.EdgesGeometry(boxGeo);

// Per-instance reusable tmp objects (safe because useFrame is single-threaded)
const _s = new THREE.Vector3();
const _c = new THREE.Color();
const _e = new THREE.Color();

/* ------------------------------------------------------------------ */
/*  VoxelObject – single interactive cube                              */
/* ------------------------------------------------------------------ */
const VoxelObject: React.FC<{
  position: [number, number, number];
  baseSpeed: number;
  accent: string;
}> = React.memo(({ position, baseSpeed, accent }) => {
  const meshRef = useRef<THREE.Mesh>(null);
  const edgeRef = useRef<THREE.LineSegments>(null);
  const hoverRef = useRef(false);    // avoid re-render on hover
  const clickTs = useRef(0);         // timestamp of last click

  // ---- animation loop (no setState → zero re-renders) ----
  useFrame((_state, delta) => {
    const mesh = meshRef.current;
    if (!mesh) return;
    const mat = mesh.material as THREE.MeshStandardMaterial;
    const edgeMat = edgeRef.current?.material as THREE.LineBasicMaterial | undefined;
    const hovered = hoverRef.current;
    const clicking = (performance.now() - clickTs.current) < 300;

    // --- rotation: instant speed response ---
    const rot = clicking ? 12 : hovered ? 4.5 : baseSpeed;
    mesh.rotation.x += delta * rot;
    mesh.rotation.y += delta * rot * 0.6;

    // --- scale: snappy spring-like lerp ---
    const t = clicking ? 0.7 : hovered ? 1.3 : 1;
    _s.set(t, t, t);
    // Higher lerp factor = snappier feel (0.22 vs old 0.12)
    mesh.scale.lerp(_s, 0.22);

    // --- color: fast transition on hover, smooth return ---
    if (clicking) {
      mat.color.setHex(0xffffff);
      mat.emissive.setHex(0xffffff);
      mat.emissiveIntensity = THREE.MathUtils.lerp(mat.emissiveIntensity, 2.5, 0.4);
    } else if (hovered) {
      _c.set(accent);
      _e.set(accent);
      mat.color.lerp(_c, 0.25);          // was 0.15 → much snappier
      mat.emissive.lerp(_e, 0.25);
      mat.emissiveIntensity = THREE.MathUtils.lerp(mat.emissiveIntensity, 0.5, 0.18);
      mat.roughness = THREE.MathUtils.lerp(mat.roughness, 0.05, 0.15);
      mat.metalness = THREE.MathUtils.lerp(mat.metalness, 0.4, 0.15);
    } else {
      _c.set('#F5F5F5');
      _e.set('#000000');
      mat.color.lerp(_c, 0.1);
      mat.emissive.lerp(_e, 0.1);
      mat.emissiveIntensity = THREE.MathUtils.lerp(mat.emissiveIntensity, 0, 0.1);
      mat.roughness = THREE.MathUtils.lerp(mat.roughness, 0.2, 0.1);
      mat.metalness = THREE.MathUtils.lerp(mat.metalness, 0.1, 0.1);
    }

    // edge glow
    if (edgeMat) {
      edgeMat.color.set(hovered || clicking ? '#FFFFFF' : '#D4D4D8');
    }
  });

  const onPointerOver = useCallback((e: ThreeEvent<PointerEvent>) => {
    e.stopPropagation();
    hoverRef.current = true;
    document.body.style.cursor = 'pointer';
  }, []);

  const onPointerOut = useCallback(() => {
    hoverRef.current = false;
    document.body.style.cursor = '';
  }, []);

  const onClick = useCallback((e: ThreeEvent<MouseEvent>) => {
    e.stopPropagation();
    clickTs.current = performance.now();
  }, []);

  return (
    <mesh
      ref={meshRef}
      geometry={boxGeo}
      position={position}
      onPointerOver={onPointerOver}
      onPointerOut={onPointerOut}
      onClick={onClick}
    >
      <meshStandardMaterial color="#F5F5F5" roughness={0.2} metalness={0.1} />
      <lineSegments ref={edgeRef} geometry={edgeGeo}>
        <lineBasicMaterial color="#D4D4D8" />
      </lineSegments>
    </mesh>
  );
});

VoxelObject.displayName = 'VoxelObject';

/* ------------------------------------------------------------------ */
/*  ArtCluster – the whole voxel group with mouse-follow rotation      */
/* ------------------------------------------------------------------ */
const ArtCluster: React.FC = () => {
  const groupRef = useRef<THREE.Group>(null);
  const { viewport, pointer } = useThree();

  useFrame((state) => {
    if (!groupRef.current) return;
    const g = groupRef.current;
    // Faster mouse-follow lerp (0.08 vs 0.05) for more responsive feel
    const mx = (pointer.x * viewport.width) / 8;
    const my = (pointer.y * viewport.height) / 8;
    g.rotation.x = THREE.MathUtils.lerp(g.rotation.x, my * 0.06, 0.08);
    g.rotation.y = THREE.MathUtils.lerp(
      g.rotation.y,
      mx * 0.06 + state.clock.getElapsedTime() * 0.04,
      0.08
    );
  });

  const positions: [number, number, number][] = useMemo(() => [
    [0, 0, 0], [1, 0, 0], [-1, 0, 0], [0, 1, 0], [0, -1, 0], [0, 0, 1], [0, 0, -1],
    [1, 1, 0], [-1, -1, 0], [1, -1, 0], [-1, 1, 0],
    [0, 1, 1], [0, -1, -1], [2, 0, 0], [-2, 0, 0],
    [2, 1, 0], [-2, -1, 0], [0, 2, 0], [0, -2, 0],
    [3, 2, 1], [-3, -2, -1], [2, -2, 2], [-2, 2, -2],
  ], []);

  const voxelData = useMemo(() =>
    positions.map(() => ({
      accent: ACCENT_COLORS[Math.floor(Math.random() * ACCENT_COLORS.length)],
      baseSpeed: 0.08 + Math.random() * 0.18,
    })),
  [positions]);

  return (
    <group ref={groupRef} position={[3, 0, 0]}>
      {positions.map((pos, i) => (
        <VoxelObject
          key={i}
          position={pos}
          baseSpeed={voxelData[i].baseSpeed}
          accent={voxelData[i].accent}
        />
      ))}
    </group>
  );
};

/* ------------------------------------------------------------------ */
/*  Scene3D – Canvas wrapper                                           */
/* ------------------------------------------------------------------ */
const Scene3D: React.FC = () => (
  <div className="w-full h-full relative" style={{ touchAction: 'none' }}>
    <Canvas
      camera={{ position: [0, 0, 14], fov: 30 }}
      dpr={[1, 2]}
      performance={{ min: 0.5 }}
      raycaster={{ params: { Line: { threshold: 0.2 }, Points: { threshold: 0.2 } } } as any}
      gl={{ antialias: true, toneMapping: THREE.ACESFilmicToneMapping, alpha: true }}
      style={{ background: 'transparent' }}
    >
      <ambientLight intensity={0.8} />
      <spotLight position={[10, 10, 10]} angle={0.3} penumbra={0.5} intensity={5} color="#FFFFFF" castShadow />
      <pointLight position={[-10, -5, 5]} intensity={2} color="#FFFFFF" />
      <pointLight position={[0, 5, -5]} intensity={3} color="#F0F0F0" />
      <Environment preset="studio" />
      <Float speed={1.5} rotationIntensity={0.2} floatIntensity={0.5}>
        <ArtCluster />
      </Float>
    </Canvas>
  </div>
);

export default Scene3D;
