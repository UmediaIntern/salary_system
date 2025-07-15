import { DragEvent } from "react";
import { useDnD } from "./graph_sidebar_drag_context";

export function GraphSidebar() {
	const { type, setType } = useDnD();

	const onDragStart = (event: DragEvent, nodeType: string) => {
		setType(nodeType);
		event.dataTransfer.effectAllowed = "move";
	};

	return (
		<aside className="bg-secondary">
			<div className="description">
				You can drag these nodes to the pane on the right.
			</div>
			<div
				className="dndnode input"
				onDragStart={(event) => onDragStart(event, "input")}
				draggable
			>
				Input Node
			</div>
			<div
				className="dndnode"
				onDragStart={(event) => onDragStart(event, "default")}
				draggable
			>
				Default Node
			</div>
			<div
				className="dndnode output"
				onDragStart={(event) => onDragStart(event, "output")}
				draggable
			>
				Output Node
			</div>
		</aside>
	);
}
