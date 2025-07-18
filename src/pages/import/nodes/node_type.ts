import { ComponentType } from "react";
import { OutputNode } from "./output_node";

export type nodeTypesEnum = "output_node";

export const nodeTypes: Record<nodeTypesEnum, ComponentType> = {
  "output_node": OutputNode,
};
