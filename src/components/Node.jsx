import { useCursor } from "@react-three/drei";
import { useState } from "react";
import { useSnapshot } from "valtio";
import { state, modes } from "../state";
import { Quaternion, Vector3 } from "three";

export class NodeProps {
  id;
  name;
  position;

  constructor(id, position, scale, quaternion) {
    this.id = id === undefined ? 0 : id;
    this.name = "Node" + this.id;
    this.position = position === undefined ? new Vector3() : position;
    this.scale = scale === undefined ? new Vector3(1, 1, 1) : scale;
    this.quaternion = quaternion === undefined ? new Quaternion() : quaternion;
  }
}

export function Node({ name, ...props }) {
  // Ties this component to the state model
  const snap = useSnapshot(state);
  // Feed hover state into useCursor, which sets document.body.style.cursor to pointer|auto
  const [hovered, setHovered] = useState(false);
  useCursor(hovered);
  return (
    <mesh
      // Click sets the mesh as the new target
      onClick={(e) => (e.stopPropagation(), (state.current = name))}
      // If a click happened but this mesh wasn't hit we null out the target,
      // This works because missed pointers fire before the actual hits
      onPointerMissed={(e) => e.type === "click" && (state.current = null)}
      // Right click cycles through the transform modes
      onContextMenu={(e) =>
        snap.current === name &&
        (e.stopPropagation(), (state.mode = (snap.mode + 1) % modes.length))
      }
      onPointerOver={(e) => (e.stopPropagation(), setHovered(true))}
      onPointerOut={(e) => setHovered(false)}
      name={name}
      material-color={snap.current === name ? "#ff6080" : "white"}
      {...props}
      dispose={null}
    >
      <boxGeometry args={[0.2, 0.2, 0.2]} />
      <meshStandardMaterial />
    </mesh>
  );
}
