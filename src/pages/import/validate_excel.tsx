import { Button } from "~/components/ui/button";
import {
	ResizableHandle,
	ResizablePanel,
	ResizablePanelGroup,
} from "~/components/ui/resizable";
import { api } from "~/utils/api";
import { useImportContext } from "./import_context_provider";
import { ImportPreview } from "./import_preview";

const fields = ["a", "b", "c"];

export function ValidateExcel() {
	const importTransaction =
		api.importTransaction.importTransaction.useMutation();

  const { excelData } = useImportContext();

	function handleUpload() {
		console.log(excelData);
		importTransaction.mutate(excelData);
	}

	return (
		<div className="relative h-full w-full">
			<ResizablePanelGroup
				direction="vertical"
				className="flex h-full w-full flex-col"
			>
				<ResizablePanel defaultSize={50}>
					<div className="h-full w-full bg-green-200">
            <ImportPreview />
          </div>
				</ResizablePanel>
				<ResizableHandle />

				<ResizablePanel defaultSize={50}>
					{/* Missing fields */}
					{/* Invalid values */}
					<div className="flex w-full grow flex-col p-4">
						{fields.map((field) => (
							<div key={field}>
								<Button
									className="h-6 w-36"
									variant="destructive"
								>
									{field}
								</Button>
							</div>
						))}
					</div>
				</ResizablePanel>
			</ResizablePanelGroup>
			<Button
				className="absolute bottom-4 right-4"
				onClick={() => {
					handleUpload();
				}}
			>
				upload
			</Button>
		</div>
	);
}
