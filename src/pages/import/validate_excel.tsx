import { Button } from "~/components/ui/button";
import {
	ResizableHandle,
	ResizablePanel,
	ResizablePanelGroup,
} from "~/components/ui/resizable";
import { api } from "~/utils/api";
import { useImportContext } from "./import_context_provider";
import { ImportPreview } from "./import_preview";
import { useState } from "react";
import { onPromise } from "~/utils/on_promise";

const fields = ["a", "b", "c"];

export function ValidateExcel() {
	const [isUploading, setIsUploading] = useState(false);
	const [openDialog, setOpenDialog] = useState(false);
	const trpcUtils = api.useUtils();

	const importTransaction =
		api.importTransaction.importTransaction.useMutation();

	const { excelData } = useImportContext();

	async function handleUpload() {
		setIsUploading(true);

		// TODO: Improve. Try to find the period id
		const period_id = excelData.at(0)?.period_id;
		if (period_id == null) {
			console.error("Missing period_id");
			setIsUploading(false);
			return;
		}

		try {
			const { empty } =
				await trpcUtils.importTransaction.checkImportTransaction.fetch({
					period_id: period_id,
				});

			if (empty) {
				console.log(excelData);
				importTransaction.mutate(excelData, {
					onSuccess: () => setIsUploading(false),
					onError: () => setIsUploading(false),
				});
			} else {
				setOpenDialog(true);
				setIsUploading(false);
			}
		} catch (err) {
			console.error("checkImportTransaction failed:", err);
			setIsUploading(false);
		}
	}

	return (
		<div className="relative h-full w-full">
			<ResizablePanelGroup
				direction="vertical"
				className="flex h-full w-full flex-col"
			>
				<ResizablePanel defaultSize={50}>
					<div className="h-full w-full">
						<ImportPreview />
					</div>
				</ResizablePanel>
				<ResizableHandle />

				<ResizablePanel defaultSize={50}>
					{/* Missing fields */}
					{/* Invalid values */}
					<div className="flex h-full w-full flex-col bg-muted p-4">
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
				disabled={isUploading}
				className="absolute bottom-4 right-4"
				onClick={onPromise(handleUpload)}
			>
				upload
			</Button>
		</div>
	);
}
