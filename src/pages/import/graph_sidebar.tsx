import { DragEvent } from "react";
import { useDnD } from "./graph_sidebar_drag_context";
import { Input } from "~/components/ui/input";
import { Button } from "~/components/ui/button";
import { nodeTypesEnum } from "./nodes/node_type";

export function GraphSidebar() {
	const { type, setType } = useDnD();

	// input, default, output
	const onDragStart = (event: DragEvent, nodeType: nodeTypesEnum) => {
		setType(nodeType);
		event.dataTransfer.effectAllowed = "move";
	};

	return (
		<aside className="bg-secondary p-4 max-w-80">
			<div className="flex w-full max-w-sm items-center gap-2">
				<Input type="text" placeholder="Search..." />
				<Button type="button" variant="outline">
					Type 
				</Button>
			</div>
			<div className="text-sm p-2 truncate">
				You can drag these nodes to the pane on the right.
			</div>
			<div
				className="rounded-sm border border-l-4 border-amber-400 bg-primary-foreground p-2"
				onDragStart={(event) => onDragStart(event, "output_node" )}
				draggable
			>
				Output Node
			</div>
		</aside>
	);
}
