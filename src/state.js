import { proxy } from "valtio";
import { CatmullRomCurve3, Quaternion, Vector3 } from "three";
import { NodeProps } from "./components/Node";

const initialNodeProps = [
    new NodeProps(0, new Vector3(-2, 0, 0), new Vector3(1, 1, 1), new Quaternion(), "red"),
    new NodeProps(1, new Vector3(2, 0, 0), new Vector3(1, 2, 0.5), new Quaternion(), "lime"),
];

export const NUM_POINTS_TOTAL = 200;
export const CURVE_TYPE = 'catmullrom';
const initialCurve = new CatmullRomCurve3(
  initialNodeProps.map((it, i) => it.position),
  false,
  CURVE_TYPE
);
initialCurve.arcLengthDivisions = NUM_POINTS_TOTAL;

// Reactive state model, using Valtio ...

export const modes = ["translate", "rotate", "scale"];
export const state = proxy({
    current: null,
    mode: 0,
    nodeProps: initialNodeProps,
    curve: initialCurve,
});
