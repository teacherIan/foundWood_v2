import { Splat, PerspectiveCamera } from '@react-three/drei';
import { useControls } from 'leva';
import { useThree, useFrame } from '@react-three/fiber';
import { useEffect, useRef } from 'react';
import splatUrl from '../../assets/fixed_model.splat?url';

export default function Scene() {
  const { camera } = useThree();
  const lastUpdateRef = useRef(0);

  const {
    alphaTest,
    alphaHash,
    toneMapped,
    chunkSize,
    position,
    rotation,
    scale,
  } = useControls('Splat Controls', {
    alphaTest: { value: 0.5, min: 0, max: 1, step: 0.01 },
    alphaHash: { value: false },
    toneMapped: { value: false },
    chunkSize: { value: 25000, min: 1000, max: 100000, step: 1000 },
    position: { value: [0, 0, 0], step: 0.1 },
    rotation: { value: [0, 0, 0], step: 0.01 },
    scale: { value: [1, 1, 1], min: 0.1, max: 5, step: 0.1 },
  });

  const { cameraPosition, cameraRotation, fov } = useControls(
    'Camera Controls',
    {
      cameraPosition: { value: [0, 0, 5], step: 0.1 },
      cameraRotation: { value: [0, 0, 0], step: 0.01 },
      fov: { value: 75, min: 10, max: 120, step: 1 },
    }
  );

  // Real-time camera info display
  const [, setCameraInfo] = useControls('Camera Info (Read-only)', () => ({
    currentPosition: {
      value: `${camera.position.x.toFixed(2)}, ${camera.position.y.toFixed(
        2
      )}, ${camera.position.z.toFixed(2)}`,
      editable: false,
    },
    currentRotation: {
      value: `${camera.rotation.x.toFixed(2)}, ${camera.rotation.y.toFixed(
        2
      )}, ${camera.rotation.z.toFixed(2)}`,
      editable: false,
    },
    currentFov: {
      value: camera.fov.toFixed(1),
      editable: false,
    },
  }));

  // Update camera info in real-time (throttled to 30fps)
  useFrame(() => {
    const now = Date.now();
    if (now - lastUpdateRef.current > 33) {
      // ~30fps
      setCameraInfo({
        currentPosition: `${camera.position.x.toFixed(
          2
        )}, ${camera.position.y.toFixed(2)}, ${camera.position.z.toFixed(2)}`,
        currentRotation: `${camera.rotation.x.toFixed(
          2
        )}, ${camera.rotation.y.toFixed(2)}, ${camera.rotation.z.toFixed(2)}`,
        currentFov: camera.fov.toFixed(1),
      });
      lastUpdateRef.current = now;
    }
  });

  useEffect(() => {
    camera.position.set(...cameraPosition);
    camera.rotation.set(...cameraRotation);
    camera.fov = fov;
    camera.updateProjectionMatrix();
  }, [camera, cameraPosition, cameraRotation, fov]);

  return (
    <>
      {' '}
      <Splat
        src={splatUrl}
        alphaTest={alphaTest}
        alphaHash={alphaHash}
        toneMapped={toneMapped}
        chunkSize={chunkSize}
        position={position}
        rotation={rotation}
        scale={scale}
      />
    </>
  );
}
