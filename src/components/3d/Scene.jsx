import { Splat, PerspectiveCamera } from '@react-three/drei';
import { useControls } from 'leva';
import { useThree, useFrame } from '@react-three/fiber';
import { useEffect, useRef } from 'react';
import {
  EffectComposer,
  Bloom,
  ToneMapping,
  Vignette,
  SMAA,
  Pixelation,
  DepthOfField,
} from '@react-three/postprocessing';
import { BlendFunction, ToneMappingMode } from 'postprocessing';
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

  // Post-processing controls
  const {
    enablePostProcessing,
    bloomIntensity,
    bloomLuminanceThreshold,
    bloomLuminanceSmoothing,
    pixelationGranularity,
    dofFocalLength,
    dofBokehScale,
    toneMappingMode,
    toneMappingExposure,
    vignetteOffset,
    vignetteDarkness,
    enableSMAA,
  } = useControls('Post Processing', {
    enablePostProcessing: { value: true },
    bloomIntensity: { value: 0.5, min: 0, max: 3, step: 0.01 },
    bloomLuminanceThreshold: { value: 0.9, min: 0, max: 1, step: 0.01 },
    bloomLuminanceSmoothing: { value: 0.025, min: 0, max: 1, step: 0.001 },
    pixelationGranularity: { value: 5, min: 1, max: 20, step: 1 },
    dofFocalLength: { value: 0.02, min: 0.01, max: 0.2, step: 0.001 },
    dofBokehScale: { value: 2.0, min: 0.5, max: 10, step: 0.1 },
    toneMappingMode: {
      value: ToneMappingMode.ACES_FILMIC,
      options: {
        Linear: ToneMappingMode.LINEAR,
        Reinhard: ToneMappingMode.REINHARD,
        Reinhard2: ToneMappingMode.REINHARD2,
        'Reinhard2 Adaptive': ToneMappingMode.REINHARD2_ADAPTIVE,
        Uncharted2: ToneMappingMode.UNCHARTED2,
        'Optimized Cineon': ToneMappingMode.OPTIMIZED_CINEON,
        'ACES Filmic': ToneMappingMode.ACES_FILMIC,
      },
    },
    toneMappingExposure: { value: 1.0, min: 0.1, max: 3, step: 0.01 },
    vignetteOffset: { value: 0.5, min: 0, max: 1, step: 0.01 },
    vignetteDarkness: { value: 0.5, min: 0, max: 1, step: 0.01 },
    enableSMAA: { value: true },
  });

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

      {enablePostProcessing && (
        <EffectComposer>
          {enableSMAA && <SMAA />}

          <Bloom
            intensity={bloomIntensity}
            luminanceThreshold={bloomLuminanceThreshold}
            luminanceSmoothing={bloomLuminanceSmoothing}
            blendFunction={BlendFunction.SCREEN}
          />

          <Pixelation granularity={pixelationGranularity} />

          <DepthOfField
            focalLength={dofFocalLength}
            bokehScale={dofBokehScale}
          />

          <ToneMapping mode={toneMappingMode} exposure={toneMappingExposure} />

          <Vignette
            offset={vignetteOffset}
            darkness={vignetteDarkness}
            blendFunction={BlendFunction.MULTIPLY}
          />
        </EffectComposer>
      )}
    </>
  );
}
