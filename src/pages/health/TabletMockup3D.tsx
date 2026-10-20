import { useMemo, useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Environment, Lightformer, PresentationControls, RoundedBox, ContactShadows } from '@react-three/drei';
import * as THREE from 'three';

// Fictional sample chart drawn onto the tablet screen. No real patient data.
function useChartTexture() {
  return useMemo(() => {
    const c = document.createElement('canvas');
    c.width = 1024; c.height = 768;
    const g = c.getContext('2d')!;
    g.fillStyle = '#0b0f14'; g.fillRect(0, 0, 1024, 768);
    g.fillStyle = '#FFB300'; g.font = 'bold 34px DM Sans, sans-serif';
    g.fillText('1325 Clinical EMR / EHR', 48, 70);
    g.fillStyle = '#9aa4b2'; g.font = '22px DM Sans, sans-serif';
    g.fillText('Fictional sample · nothing sent or saved', 48, 106);
    g.fillStyle = '#ffffff'; g.font = 'bold 30px DM Sans, sans-serif';
    g.fillText('Sample Patient A · 58 y', 48, 170);
    const rows: [string, string, string][] = [
      ['Blood pressure', '128 / 82', '#4ade80'],
      ['Heart rate', '74 bpm', '#4ade80'],
      ['Serum PSA', 'Unknown', '#FFB300'],
      ['Allergies', 'Unknown', '#FFB300'],
      ['Draft order', 'PET scan — awaiting sign-off', '#60a5fa'],
    ];
    rows.forEach(([k, v, col], i) => {
      const y = 230 + i * 84;
      g.fillStyle = '#151b23'; g.fillRect(48, y, 928, 66);
      g.fillStyle = '#9aa4b2'; g.font = '24px DM Sans, sans-serif'; g.fillText(k, 72, y + 42);
      g.fillStyle = col; g.font = 'bold 26px DM Sans, sans-serif'; g.fillText(v, 420, y + 42);
    });
    g.fillStyle = '#003366'; g.fillRect(48, 670, 928, 60);
    g.fillStyle = '#ffffff'; g.font = 'bold 24px DM Sans, sans-serif';
    g.fillText('Physician review required before anything is final', 72, 708);
    const t = new THREE.CanvasTexture(c);
    t.colorSpace = THREE.SRGBColorSpace;
    t.anisotropy = 8;
    return t;
  }, []);
}

function Tablet({ still }: { still: boolean }) {
  const ref = useRef<THREE.Group>(null);
  const tex = useChartTexture();
  useFrame((state, delta) => {
    if (still || !ref.current) return;
    const t = state.clock.elapsedTime;
    ref.current.rotation.y = Math.sin(t * 0.4) * 0.25;
    ref.current.position.y = Math.sin(t * 0.8) * 0.05;
    void delta;
  });
  return (
    <group ref={ref} rotation={[-0.15, 0, 0]}>
      <RoundedBox args={[4.2, 3.1, 0.18]} radius={0.18} smoothness={6}>
        <meshPhysicalMaterial color="#1a1a1a" metalness={0.8} roughness={0.25} clearcoat={1} />
      </RoundedBox>
      <mesh position={[0, 0, 0.092]}>
        <planeGeometry args={[3.9, 2.8]} />
        <meshBasicMaterial map={tex} toneMapped={false} />
      </mesh>
      <mesh position={[0, 1.47, 0.093]}>
        <circleGeometry args={[0.03, 16]} />
        <meshStandardMaterial color="#333" />
      </mesh>
    </group>
  );
}

export default function TabletMockup3D() {
  const still = typeof window !== 'undefined' && window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
  return (
    <Canvas dpr={[1, 1.75]} camera={{ position: [0, 0, 6.2], fov: 40 }} gl={{ antialias: true, alpha: true }} frameloop={still ? 'demand' : 'always'}>
      <ambientLight intensity={0.4} />
      <directionalLight position={[3, 4, 5]} intensity={1.2} />
      <Environment resolution={128}>
        <Lightformer intensity={2} position={[0, 5, 2]} scale={[10, 4, 1]} />
        <Lightformer intensity={1.2} color="#FFB300" position={[-5, 0, 1]} rotation-y={Math.PI / 2} scale={[10, 2, 1]} />
      </Environment>
      <PresentationControls global={false} cursor snap polar={[-0.4, 0.4]} azimuth={[-1.2, 1.2]} config={{ mass: 1, tension: 170, friction: 26 }}>
        <Tablet still={!!still} />
      </PresentationControls>
      <ContactShadows position={[0, -1.9, 0]} opacity={0.5} scale={8} blur={2.5} far={3} />
    </Canvas>
  );
}
