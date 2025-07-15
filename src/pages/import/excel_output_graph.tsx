import { ReactFlow, Background, Controls, applyNodeChanges, applyEdgeChanges, Edge, Node, NodeChange, EdgeChange, addEdge } from '@xyflow/react';
import { useCallback, useState } from 'react';
import { Drawer } from 'vaul';
import { Button } from '~/components/ui/button';

import {
	DrawerClose,
	DrawerContent,
	DrawerDescription,
	DrawerFooter,
	DrawerHeader,
	DrawerTitle,
} from "~/components/ui/drawer";

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
	const [nodes, setNodes] = useState<Node[]>(initialNodes);
	const [edges, setEdges] = useState<Edge[]>([]);

	const onNodesChange = useCallback(
		(changes: NodeChange<Node>[]) => setNodes((nodesSnapshot) => applyNodeChanges(changes, nodesSnapshot)),
		[],
	);
	const onEdgesChange = useCallback(
		(changes: EdgeChange<Edge>[]) => setEdges((edgesSnapshot) => applyEdgeChanges(changes, edgesSnapshot)),
		[],
	);

	const onConnect = useCallback(
		(params: any) => setEdges((edgesSnapshot) => addEdge(params, edgesSnapshot)),
		[],
	);

	return (
		<ReactFlow
			nodes={nodes}
			edges={edges}
			onNodesChange={onNodesChange}
			onEdgesChange={onEdgesChange}
			onConnect={onConnect}
			fitView
		>
			<Background />
			<Controls />
		</ReactFlow>
	)
}
