import { Splat } from '@react-three/drei';
import splatUrl from '../../assets/fixed_model.splat?url';

export default function Scene() {
  return (
    <>
      <Splat
        src={splatUrl}
        position={[0, 0, 0]}
        rotation={[0, 0, 0]}
        scale={[1, 1, 1]}
      />
    </>
  );
}
