import { ComponentType } from "react";
import { OutputNode } from "./output_node";
import { NodeProps } from "@xyflow/react";

export type nodeTypesEnum = "output_node";

export const nodeTypes: Record<nodeTypesEnum, ComponentType<NodeProps & {
    data: any;
    type: any;
}>> = {
  "output_node": OutputNode,
};
