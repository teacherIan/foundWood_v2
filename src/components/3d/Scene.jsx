import { Splat, PerspectiveCamera, Html } from '@react-three/drei';
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

  // HTML Element controls
  const { htmlPosition, showTestMesh } = useControls('HTML Elements', {
    htmlPosition: { value: [0, 0, -1], step: 0.1 },
    showTestMesh: { value: true }
  });

  // Proxy geometry controls for splat occlusion
  const { 
    enableProxyGeometry,
    proxyGeometryType,
    proxySize
  } = useControls('Splat Proxy Geometry', {
    enableProxyGeometry: { value: true },
    proxyGeometryType: { 
      value: 'box',
      options: ['box', 'sphere', 'cylinder']
    },
    proxySize: { value: [2, 2, 2], min: 0.1, max: 10, step: 0.1 }
  });

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
    enablePostProcessing: { value: true },
    enableSMAA: { value: true },
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

  const handle3DButtonClick = () => {
    console.log('3D Button clicked!');
    // You can manipulate the scene, splat, or camera here
    // For example, reset splat position:
    // setSplatPosition([0, 0, 0]);
  };

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
        />
        
        {/* Invisible proxy geometry for HTML occlusion */}
        {enableProxyGeometry && (
          <mesh>
            {proxyGeometryType === 'box' && <boxGeometry args={proxySize} />}
            {proxyGeometryType === 'sphere' && <sphereGeometry args={[proxySize[0], 16, 16]} />}
            {proxyGeometryType === 'cylinder' && <cylinderGeometry args={[proxySize[0], proxySize[1], proxySize[2], 16]} />}
            <meshBasicMaterial 
              visible={false} 
              depthWrite={true} 
              depthTest={true} 
              colorWrite={false}
            />
          </mesh>
        )}
      </group>

      {/* Test mesh to demonstrate occlusion working */}
      {showTestMesh && (
        <mesh position={[0.5, 0, -0.5]}>
          <boxGeometry args={[0.5, 0.5, 0.5]} />
          <meshBasicMaterial color="orange" />
        </mesh>
      )}

      {/* 3D Button positioned in world space with occlusion */}
      <Html
        occlude="blending"
        position={htmlPosition}
        center
        transform
        // sprite
      >
        <button
          className="px-4 py-2 bg-blue-600 text-white rounded-lg shadow-lg hover:bg-blue-700 transition-colors"
          onClick={handle3DButtonClick}
        >
          3D Button
        </button>
      </Html>

      {/* Another HTML element with different occlusion */}
      <Html occlude="raycast" position={[htmlPosition[0] + 1, htmlPosition[1] + 1, htmlPosition[2]]} center>
        <div className="bg-red-500 text-white p-2 rounded">
          Raycast Occluded
        </div>
      </Html>

      {/* Non-occluded HTML for comparison */}
      <Html position={[htmlPosition[0] - 1, htmlPosition[1] + 1, htmlPosition[2]]} center>
        <div className="bg-green-500 text-white p-2 rounded">
          Always Visible
        </div>
      </Html>

      {/* 3D HTML UI elements for testing occlusion */}
      <Html
        position={htmlPosition}
        transform
        occlude
        style={{
          background: 'rgba(255, 255, 255, 0.9)',
          padding: '10px',
          borderRadius: '5px',
          border: '1px solid #333',
          fontSize: '14px',
          fontFamily: 'Arial, sans-serif',
          color: '#333',
          backdropFilter: 'blur(10px)',
          userSelect: 'none'
        }}
      >
        <div>
          <h3 style={{ margin: '0 0 10px 0' }}>3D HTML Element</h3>
          <p style={{ margin: '0 0 10px 0' }}>This should occlude behind the splat!</p>
          <button
            onClick={() => console.log('3D HTML button clicked!')}
            style={{
              padding: '5px 10px',
              background: '#007acc',
              color: 'white',
              border: 'none',
              borderRadius: '3px',
              cursor: 'pointer'
            }}
          >
            Click Me
          </button>
        </div>
      </Html>

      {/* Additional HTML elements for testing */}
      <Html
        position={[2, 1, 0]}
        transform
        occlude
        style={{
          background: 'rgba(255, 100, 100, 0.9)',
          padding: '8px',
          borderRadius: '5px',
          fontSize: '12px',
          color: 'white'
        }}
      >
        Right Side Label
      </Html>

      <Html
        position={[-2, -1, 0]}
        transform
        occlude
        style={{
          background: 'rgba(100, 255, 100, 0.9)',
          padding: '8px',
          borderRadius: '5px',
          fontSize: '12px',
          color: 'black'
        }}
      >
        Left Side Label
      </Html>

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
