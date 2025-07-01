import { Canvas } from '@react-three/fiber';
import { Environment, OrbitControls } from '@react-three/drei';
import Scene from './components/3d/Scene';
import UI from './components/ui/UI';

export default function App() {
  return (
    <div className="scene-container">
      {/* 3D Canvas */}
      <Canvas
        camera={{ position: [0, 0, 5], fov: 45 }}
        className="bg-gradient-to-b from-blue-900 to-purple-900"
      >
        <Scene />
        <OrbitControls
          enablePan={false}
          enableZoom={true}
          enableRotate={true}
        />
        <Environment preset="studio" />
      </Canvas>

      {/* UI Overlay */}
      <div className="ui-overlay">
        <UI />
      </div>
    </div>
  );
}
