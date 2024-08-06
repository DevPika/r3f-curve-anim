import { proxy } from "valtio";

// Reactive state model, using Valtio ...

export const modes = ["translate", "rotate", "scale"];
export const state = proxy({ current: null, mode: 0 });
