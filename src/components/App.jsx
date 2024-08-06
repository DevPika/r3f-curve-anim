import { Canvas } from "@react-three/fiber";
import { Controls } from "./Controls";
import { Node } from "./Node";

export default function App() {
  return (
    <Canvas camera={{ position: [0, 0, 10], fov: 50 }} dpr={[1, 2]}>
      <pointLight position={[0, 0, 0]} intensity={0.8} />
      <hemisphereLight
        color="#ffffff"
        groundColor="#b9b9b9"
        position={[-7, 25, 13]}
        intensity={0.85}
      />
      <group position={[0, 0, 0]}>
        <Node name="Node0" position={[-2, 0, 0]} />
        <Node name="Node1" position={[0, 0, 0]} />
        <Node name="Node2" position={[2, 0, 0]} />
      </group>
      <Controls />
    </Canvas>
  );
}
