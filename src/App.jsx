import { Canvas } from '@react-three/fiber';
import { Environment, OrbitControls } from '@react-three/drei';
import Scene from './components/3d/Scene';
import UI from './components/ui/UI';

export default function App() {
  return (
    <div className="scene-container">
      {/* 3D Canvas */}
      <Canvas camera={{ position: [0, 0, 4], fov: 45 }} className="">
        <Scene />
        <OrbitControls enablePan={true} enableZoom={true} enableRotate={true} />
      </Canvas>
    </div>
  );
}
