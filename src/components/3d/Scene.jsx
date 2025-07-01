export default function Scene() {
  return (
    <>
      {/* Lighting */}
      <ambientLight intensity={0.5} />
      <directionalLight position={[10, 10, 5]} intensity={1} />

      {/* Demo Objects */}
      <mesh position={[0, 0, 0]}>
        <boxGeometry args={[1, 1, 1]} />
        <meshStandardMaterial color="orange" />
      </mesh>

      <mesh position={[2, 0, 0]}>
        <sphereGeometry args={[0.5, 32, 32]} />
        <meshStandardMaterial color="lightblue" />
      </mesh>

      <mesh position={[-2, 0, 0]} rotation={[0, 0, Math.PI / 4]}>
        <coneGeometry args={[0.5, 1, 8]} />
        <meshStandardMaterial color="lightgreen" />
      </mesh>
    </>
  );
}
