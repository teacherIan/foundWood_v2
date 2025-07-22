import {
  Splat,
  PerspectiveCamera,
  Html,
  MeshTransmissionMaterial,
  Text,
} from '@react-three/drei';
import { useControls } from 'leva';
import { useThree, useFrame } from '@react-three/fiber';
import { useEffect, useRef } from 'react';
import * as THREE from 'three';
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
    alphaTest: { value: 0, min: 0, max: 1, step: 0.01 },
    alphaHash: { value: false },
    toneMapped: { value: false },
    chunkSize: { value: 1, min: 1, max: 100000, step: 1000 },
    position: { value: [0, 0, 0], step: 0.1 },
    rotation: { value: [0, 0, 0], step: 0.01 },
    scale: { value: [1, 1, 1], min: 0.1, max: 5, step: 0.1 },
  });

  const { cameraPosition, cameraRotation, fov } = useControls(
    'Camera Controls',
    {
      cameraPosition: { value: [0.44, 0.6, 2.08], step: 0.1 },
      cameraRotation: { value: [-0.24, 0.07, 0.02], step: 0.01 },
      fov: { value: 75, min: 10, max: 120, step: 1 },
    }
  );

  // HTML Element controls
  const { htmlPosition, showTestMesh } = useControls('HTML Elements', {
    htmlPosition: { value: [0, 0, -1], step: 0.1 },
    showTestMesh: { value: true },
  });

  // Mesh controls
  const {
    mesh0Position,
    mesh0Scale,
    mesh0Color,
    mesh1Position,
    mesh1Scale,
    mesh1Color,
    mesh2Position,
    mesh2Scale,
    mesh2Color,
    mesh3Position,
    mesh3Scale,
    mesh3Color,
  } = useControls('Program Meshes', {
    mesh0Position: { value: [0.5, 0, -0.5], step: 0.1 },
    mesh0Scale: { value: [1, 1, 1], min: 0.1, max: 3, step: 0.1 },
    mesh0Color: { value: '#FFA500' }, // orange
    mesh1Position: { value: [-1, 0, 0], step: 0.1 },
    mesh1Scale: { value: [1, 1, 1], min: 0.1, max: 3, step: 0.1 },
    mesh1Color: { value: '#ff0000' },
    mesh2Position: { value: [0, 0, 0], step: 0.1 },
    mesh2Scale: { value: [1, 1, 1], min: 0.1, max: 3, step: 0.1 },
    mesh2Color: { value: '#00ff00' },
    mesh3Position: { value: [1, 0, 0], step: 0.1 },
    mesh3Scale: { value: [1, 1, 1], min: 0.1, max: 3, step: 0.1 },
    mesh3Color: { value: '#0000ff' },
  });

  // Proxy geometry controls for splat occlusion
  const { enableProxyGeometry, proxyGeometryType, proxySize } = useControls(
    'Splat Proxy Geometry',
    {
      enableProxyGeometry: { value: false },
      proxyGeometryType: {
        value: 'box',
        options: ['box', 'sphere', 'cylinder'],
      },
      proxySize: { value: [2, 2, 2], min: 0.1, max: 10, step: 0.1 },
    }
  );

  // Post-processing controls
  const {
    enablePostProcessing,
    enableBloom,
    bloomIntensity,
    bloomLuminanceThreshold,
    bloomLuminanceSmoothing,
    enablePixelation,
    pixelationGranularity,
    enableDepthOfField,
    dofFocalLength,
    dofBokehScale,
    enableToneMapping,
    toneMappingMode,
    toneMappingExposure,
    enableVignette,
    vignetteOffset,
    vignetteDarkness,
    enableSMAA,
  } = useControls('Post Processing', {
    enablePostProcessing: { value: false },
    enableSMAA: { value: false },
    enableBloom: { value: false },
    bloomIntensity: { value: 0.5, min: 0, max: 3, step: 0.01 },
    bloomLuminanceThreshold: { value: 0.9, min: 0, max: 1, step: 0.01 },
    bloomLuminanceSmoothing: { value: 0.025, min: 0, max: 1, step: 0.001 },
    enablePixelation: { value: false },
    pixelationGranularity: { value: 5, min: 1, max: 20, step: 1 },
    enableDepthOfField: { value: false },
    dofFocalLength: { value: 0.02, min: 0.01, max: 0.2, step: 0.001 },
    dofBokehScale: { value: 2.0, min: 0.5, max: 10, step: 0.1 },
    enableToneMapping: { value: true },
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
    enableVignette: { value: false },
    vignetteOffset: { value: 0.5, min: 0, max: 1, step: 0.01 },
    vignetteDarkness: { value: 0.5, min: 0, max: 1, step: 0.01 },
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
      {/* Splat with invisible proxy geometry for HTML occlusion */}
      <group position={position} rotation={rotation} scale={scale}>
        <Splat
          src={splatUrl}
          alphaTest={alphaTest}
          alphaHash={alphaHash}
          toneMapped={toneMapped}
          chunkSize={chunkSize}
          renderOrder={1}
        />

        {/* Invisible proxy geometry for HTML occlusion */}
        {enableProxyGeometry && (
          <mesh>
            {proxyGeometryType === 'box' && <boxGeometry args={proxySize} />}
            {proxyGeometryType === 'sphere' && (
              <sphereGeometry args={[proxySize[0], 16, 16]} />
            )}
            {proxyGeometryType === 'cylinder' && (
              <cylinderGeometry
                args={[proxySize[0], proxySize[1], proxySize[2], 16]}
              />
            )}
            <meshBasicMaterial
              visible={false}
              depthWrite={true}
              depthTest={true}
              colorWrite={false}
            />
          </mesh>
        )}
      </group>

      <mesh position={mesh0Position} scale={mesh0Scale}>
        <boxGeometry args={[0.5, 0.5, 0.5]} />
        <meshBasicMaterial
          color={mesh0Color}
          transparent
          opacity={1}
        />
        {/* Text inside the cube */}
        <Text
          position={[0, 0, 0]}
          fontSize={0.15}
          color="white"
          anchorX="center"
          anchorY="middle"
        >
          A
        </Text>
      </mesh>

      <mesh position={mesh1Position} scale={mesh1Scale}>
        <boxGeometry args={[0.5, 0.5, 0.5]} />
        <meshBasicMaterial
          color={mesh1Color}
          transparent
          opacity={1}
        />
        <Text
          position={[0, 0, 0]}
          fontSize={0.15}
          color="white"
          anchorX="center"
          anchorY="middle"
        >
          B
        </Text>
      </mesh>

      <mesh position={mesh2Position} scale={mesh2Scale}>
        <boxGeometry args={[0.5, 0.5, 0.5]} />
        <meshBasicMaterial
          color={mesh2Color}
          transparent
          opacity={1}
        />
        <Text
          position={[0, 0, 0]}
          fontSize={0.15}
          color="white"
          anchorX="center"
          anchorY="middle"
        >
          C
        </Text>
      </mesh>

      <mesh position={mesh3Position} scale={mesh3Scale}>
        <boxGeometry args={[0.5, 0.5, 0.5]} />
        <meshBasicMaterial
          color={mesh3Color}
          transparent
          opacity={1}
        />
        <Text
          position={[0, 0, 0]}
          fontSize={0.15}
          color="white"
          anchorX="center"
          anchorY="middle"
        >
          D
        </Text>
      </mesh>

      {enablePostProcessing && (
        <EffectComposer>
          {enableSMAA && <SMAA />}

          {enableBloom && (
            <Bloom
              intensity={bloomIntensity}
              luminanceThreshold={bloomLuminanceThreshold}
              luminanceSmoothing={bloomLuminanceSmoothing}
              blendFunction={BlendFunction.SCREEN}
            />
          )}

          {enablePixelation && (
            <Pixelation granularity={pixelationGranularity} />
          )}

          {enableDepthOfField && (
            <DepthOfField
              focalLength={dofFocalLength}
              bokehScale={dofBokehScale}
            />
          )}

          {enableToneMapping && (
            <ToneMapping
              mode={toneMappingMode}
              exposure={toneMappingExposure}
            />
          )}

          {enableVignette && (
            <Vignette
              offset={vignetteOffset}
              darkness={vignetteDarkness}
              blendFunction={BlendFunction.MULTIPLY}
            />
          )}
        </EffectComposer>
      )}
    </>
  );
}
