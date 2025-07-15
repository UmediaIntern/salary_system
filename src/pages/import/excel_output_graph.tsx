import { ReactFlow, Background, Controls, addEdge, ReactFlowProvider, useNodesState, useEdgesState, useReactFlow } from '@xyflow/react';
import { useCallback, useRef } from 'react';
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
	const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
	const [edges, setEdges, onEdgesChange] = useEdgesState([]);
	const { screenToFlowPosition } = useReactFlow();
	const [type] = useDnD();

	const onConnect = useCallback(
		(params: any) => setEdges((edgesSnapshot) => addEdge(params, edgesSnapshot)),
		[],
	);

	const onDragOver = useCallback((event) => {
		event.preventDefault();
		event.dataTransfer.dropEffect = 'move';
	}, []);

	const onDrop = useCallback(
		(event) => {
			event.preventDefault();

			// check if the dropped element is valid
			if (!type) {
				return;
			}

			const position = screenToFlowPosition({
				x: event.clientX,
				y: event.clientY,
			});
			const newNode = {
				id: getId(),
				type,
				position,
				data: { label: `${type} node` },
			};

			setNodes((nds) => nds.concat(newNode));
		},
		[screenToFlowPosition, type],
	);

	const onDragStart = (event, nodeType) => {
		setType(nodeType);
		event.dataTransfer.setData('text/plain', nodeType);
		event.dataTransfer.effectAllowed = 'move';
	};

	return (
		<div className="w-full h-full flex flex-row">
			<div ref={reactFlowWrapper} className='h-full grow'>
				<ReactFlow
					nodes={nodes}
					edges={edges}
					onNodesChange={onNodesChange}
					onEdgesChange={onEdgesChange}
					onConnect={onConnect}
					onDrop={onDrop}
					onDragStart={onDragStart}
					onDragOver={onDragOver}
					fitView
				>
					<Background />
					<Controls />
				</ReactFlow>
			</div>
			<GraphSidebar />
		</div>

	)
}
