import { Button } from "~/components/ui/button";
import {
	ResizableHandle,
	ResizablePanel,
	ResizablePanelGroup,
} from "~/components/ui/resizable";

const fields = ["a", "b", "c"];

export function ValidateExcel() {
	return (
		<ResizablePanelGroup
			direction="vertical"
			className="flex h-full w-full flex-col"
		>
			<ResizablePanel defaultSize={50}>
				<div className="w-full h-full bg-green-200">
				</div>
			</ResizablePanel>
			<ResizableHandle />

			<ResizablePanel defaultSize={50}>
        {/* Missing fields */}
        {/* Invalid values */}
				<div className="flex w-full grow flex-col p-4">
					{fields.map((field) => (
						<div key={field}>
							<Button className="h-6 w-36" variant="destructive">
								{field}
							</Button>
						</div>
					))}
				</div>
			</ResizablePanel>
		</ResizablePanelGroup>
	);
}
