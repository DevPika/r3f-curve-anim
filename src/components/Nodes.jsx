import { useSnapshot } from "valtio";
import { state } from "../state";
import { createCurve } from "./AnimCurve";
import { Node, NodeProps } from "./Node";
import { useControls, button } from "leva";

export function Nodes() {
  const snap = useSnapshot(state);
  const addNode = () => {
    state.nodeProps.push(new NodeProps(state.nodeProps.length));
    state.curve = createCurve();
  };
  const removeNode = () => {
    if (state.nodeProps.length <= 2) return;
    // Deselect TransformControls if active on the last node
    if (state.nodeProps[state.nodeProps.length - 1].name === state.current)
      state.current = null;
    state.nodeProps.pop();
    state.curve = createCurve();
  };
  useControls({
    add: button(() => addNode()),
    remove: button(() => removeNode()),
  });
  return (
    <group>
      {snap.nodeProps.map((it, index) => (
        <Node key={it.id} name={it.name} position={it.position} />
      ))}
    </group>
  );
}
