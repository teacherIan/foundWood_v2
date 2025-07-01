import { useFrame } from '@react-three/fiber';
import { useRef } from 'react';

export function useRotation(speed = 1) {
  const ref = useRef();

  useFrame((state, delta) => {
    if (ref.current) {
      ref.current.rotation.x += delta * speed;
      ref.current.rotation.y += delta * speed * 0.5;
    }
  });

  return ref;
}

export function useFloating(amplitude = 0.5, frequency = 1) {
  const ref = useRef();

  useFrame((state) => {
    if (ref.current) {
      ref.current.position.y =
        Math.sin(state.clock.elapsedTime * frequency) * amplitude;
    }
  });

  return ref;
}
