import { ReactFlow, Background, Controls } from '@xyflow/react';
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
				<ReactFlow>
					<Background />
					<Controls />
				</ReactFlow>
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
