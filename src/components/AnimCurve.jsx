import { DoubleSide } from "three";
import { state } from "../state";
import { useSnapshot } from "valtio";

export function AnimCurve() {
  useSnapshot(state);
  return (
    <mesh>
      <tubeGeometry args={[state.curve, 70, 0.01, 50, false]} />
      <meshStandardMaterial color={0xd2452b} side={DoubleSide} />
    </mesh>
  );
}
