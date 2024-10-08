import { TransformControls, OrbitControls } from "@react-three/drei";
import { useThree } from "@react-three/fiber";
import { useSnapshot } from "valtio";
import { state, modes } from "../state";
import { createCurve } from "./AnimCurve";

export function Controls() {
  // Get notified on changes to state
  const snap = useSnapshot(state);
  const scene = useThree((state) => state.scene);
  const onTransformChange = (e) => {
    const controls = e.target;
    const object = controls.object;
    if (object) {
      const nodeProps = state.nodeProps.find((it) => it.name === object.name);
      if (nodeProps) {
        nodeProps.position.copy(object.position);
        state.curve = createCurve();
        nodeProps.scale.copy(object.scale);
        nodeProps.quaternion.copy(object.quaternion);
      }
    }
  };
  return (
    <>
      {/* As of drei@7.13 transform-controls can refer to the target by children, or the object prop */}
      {snap.current && (
        <TransformControls
          object={scene.getObjectByName(snap.current)}
          mode={modes[snap.mode]}
          onChange={onTransformChange}
        />
      )}
      {/* makeDefault makes the controls known to r3f, now transform-controls can auto-disable them when active */}
      <OrbitControls
        makeDefault
        minPolarAngle={0}
        maxPolarAngle={Math.PI / 1.75}
      />
    </>
  );
}
