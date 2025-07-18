import { ReactFlow, Background, Controls, addEdge, ReactFlowProvider, useNodesState, useEdgesState, useReactFlow, Edge, Node } from '@xyflow/react';
import { DragEventHandler, useCallback, useRef } from 'react';
import { Button } from '~/components/ui/button';

import {
	DrawerClose,
	DrawerContent,
	DrawerDescription,
	DrawerFooter,
	DrawerHeader,
	DrawerTitle,
} from "~/components/ui/drawer";
import { DnDProvider, useDnD } from './graph_sidebar_drag_context';
import { GraphSidebar } from './graph_sidebar';
import { nodeTypes } from './nodes/node_type';

export function ExcelOutputGraph() {
	return (
		<DrawerContent className="h-[90vh]">
			<DrawerHeader>
				<DrawerTitle>Excel output graph</DrawerTitle>
				<DrawerDescription> Edit the excel data mapping</DrawerDescription>
			</DrawerHeader>
			<div className='h-full w-full'>
				<GraphView />
			</div>
			<DrawerFooter className="flex flex-row justify-end">
				<Button>Submit</Button>
				<DrawerClose>
					<Button variant="outline">Cancel</Button>
				</DrawerClose>
			</DrawerFooter>
		</DrawerContent>
	)
}

const initialNodes = [
	{
		id: 'n1',
		position: { x: 0, y: 0 },
		data: { label: 'Node 1' },
		type: 'input',
	},
	{
		id: 'n2',
		position: { x: 100, y: 100 },
		data: { label: 'Node 2' },
	},
];

function GraphView() {
	return (
		<ReactFlowProvider>
			<DnDProvider>
				<GrpahViewport />
			</DnDProvider>
		</ReactFlowProvider>
	)
}

let id = 0;
const getId = () => `dndnode_${id++}`;

function GrpahViewport() {
	const reactFlowWrapper = useRef(null);
	const [nodes, setNodes, onNodesChange] = useNodesState<Node>(initialNodes);
	const [edges, setEdges, onEdgesChange] = useEdgesState<Edge>([]);
	const { screenToFlowPosition } = useReactFlow();
	const { type } = useDnD();

	const onConnect = useCallback(
		(params: any) => setEdges((edgesSnapshot) => addEdge(params, edgesSnapshot)),
		[],
	);

	const onDragOver: DragEventHandler = useCallback((event) => {
		event.preventDefault();
		event.dataTransfer.dropEffect = 'move';
	}, []);

	const onDrop: DragEventHandler = useCallback(
		(event) => {
			event.preventDefault();

			// check if the dropped element is valid
				console.log(type)
			if (!type) {
				console.log("no type")
				return;
			}

			const position = screenToFlowPosition({
				x: event.clientX,
				y: event.clientY,
			});
			const newNode = {
				id: getId(),
				type: type,
				position,
				data: { label: `${type} node` },
			};

			setNodes((nds) => nds.concat(newNode));
		},
		[screenToFlowPosition, type],
	);

	return (
		<div className="w-full h-full flex flex-row">
			<GraphSidebar />
			<div ref={reactFlowWrapper} className='h-full grow'>
				<ReactFlow
					nodeTypes={nodeTypes}
					nodes={nodes}
					edges={edges}
					onNodesChange={onNodesChange}
					onEdgesChange={onEdgesChange}
					onConnect={onConnect}
					onDrop={onDrop}
					onDragOver={onDragOver}
					fitView
				>
					<Background />
					<Controls />
				</ReactFlow>
			</div>
		</div>

	)
}
