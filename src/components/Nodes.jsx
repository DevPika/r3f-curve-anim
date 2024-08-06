import { state } from "../state";
import { Node } from "./Node";

export function Nodes() {
  return (
    <group>
      {state.nodeProps.map((it, index) => (
        <Node key={index} name={"Node" + index} position={it.position} />
      ))}
    </group>
  );
}
