import { Canvas } from "@react-three/fiber";
import { Controls } from "./Controls";
import { Nodes } from "./Nodes";
import { AnimCurve } from "./AnimCurve";
import { AnimMesh } from "./AnimMesh";

export default function App() {
  return (
    <Canvas camera={{ position: [0, 0, 10], fov: 50 }} dpr={[1, 2]}>
      <hemisphereLight
        color="#ffffff"
        groundColor="#b9b9b9"
        position={[-7, 25, 13]}
        intensity={0.85}
      />
      <Nodes />
      <AnimCurve />
      <AnimMesh />
      <Controls />
    </Canvas>
  );
}
