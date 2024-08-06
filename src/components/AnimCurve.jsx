import { DoubleSide } from "three";
import { state } from "../state";

export function AnimCurve() {
  return (
    <mesh>
      <tubeGeometry args={[state.curve, 70, 0.01, 50, false]} />
      <meshStandardMaterial color={0xd2452b} side={DoubleSide} />
    </mesh>
  );
}
