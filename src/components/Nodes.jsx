import { state } from "../state";
import { Node } from "./Node";

export function Nodes() {
  return (
    <group>
      {state.nodeProps.map((it, index) => (
        <Node key={it.id} name={it.name} position={it.position} />
      ))}
    </group>
  );
}
