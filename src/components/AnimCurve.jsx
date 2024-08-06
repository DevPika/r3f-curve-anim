import { CatmullRomCurve3, DoubleSide } from "three";
import { CURVE_TYPE, NUM_POINTS_TOTAL, state } from "../state";
import { useSnapshot } from "valtio";

export const createCurve = () => {
  const curve = new CatmullRomCurve3(
    state.nodeProps.map((it) => it.position),
    false,
    CURVE_TYPE
  );
  curve.arcLengthDivisions = NUM_POINTS_TOTAL;
  return curve;
};

export function AnimCurve() {
  useSnapshot(state);
  return (
    <mesh>
      <tubeGeometry args={[state.curve, 70, 0.01, 50, false]} />
      <meshStandardMaterial color={0xd2452b} side={DoubleSide} />
    </mesh>
  );
}
