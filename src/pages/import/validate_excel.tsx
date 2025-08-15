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
import { toast } from "sonner";
import {
	Dialog,
	DialogClose,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from "~/components/ui/dialog";
import { Progress } from "~/components/ui/progress";

const fields = ["a", "b", "c"];

export function ValidateExcel() {
	const [isUploading, setIsUploading] = useState(false);
	const [openDialog, setOpenDialog] = useState(false);
	// TODO: move to context and set by the parser or processor
	const [periodId, setPeriodId] = useState<number | null>(null);
	const [progress, setProgress] = useState(0);

	const trpcUtils = api.useUtils();
	const deleteTransaction =
		api.importTransaction.deleteTransactionPeriod.useMutation();
	const importTransaction =
		api.importTransaction.importTransaction.useMutation();

	const { excelData } = useImportContext();

	function uploadData() {
		const toastId = toast.loading("Loading…");
		console.log(excelData);
		const transformedData = excelData.map((data) => {
			return {
				...data,
				period_id: Number(data.period_id),
				issue_date: new Date(data.issue_date),
				residence_permit_start_date: data.residence_permit_start_date ? new Date(data.residence_permit_start_date) : null,
				residence_permit_end_date: data.residence_permit_end_date ? new Date(data.residence_permit_end_date) : null,
				registration_date: new Date(data.registration_date),
				quit_date: data.quit_date ? new Date(data.quit_date) : null,
			};
		});

		console.log(transformedData);

		setProgress(80);
		importTransaction.mutate(transformedData, {
			onSuccess: () => {
				toast.success("Upload success", { id: toastId });
				handleFinal();
			},
			onError: (error) => {
				toast.error(`Upload error ${error.message}`, {
					id: toastId,
				});
			},
		});
	}

	async function handleUpload() {
		setIsUploading(true);
		setProgress(5);

		// TODO: Improve. Try to find the period id
		const period_id = excelData.at(0)?.period_id;
		if (period_id == null) {
			console.error("Missing period_id");
			setIsUploading(false);
			return;
		}

		setPeriodId(period_id);
		try {
			const { empty } =
				await trpcUtils.importTransaction.checkImportTransaction.fetch({
					period_id: Number(period_id),
				});
			setProgress(40);

			if (empty) {
				setProgress(60);
				uploadData();
			} else {
				setOpenDialog(true);
			}
		} catch (err) {
			console.error("checkImportTransaction failed:", err);
			setIsUploading(false);
		}
	}

	function handleFinal() {
		setOpenDialog(false);
		setIsUploading(false);
		setProgress(0);
	}

	function handleConfirm() {
		if (periodId === null) {
			console.log("periodId is null");
			return;
		}

		const toastId = toast.loading("Loading…");
		deleteTransaction.mutate(
			{ period_id: Number(periodId) },
			{
				onSuccess: () => {
					toast.success("Delete success", { id: toastId });
					setProgress(60);
					uploadData();
				},
				onError: (error) => {
					toast.error(`Delete error ${error.message}`, {
						id: toastId,
					});
				},
			}
		);
		setOpenDialog(false);
	}
	async function handleDelete() {
		toast.warning("Continue to delete?", {
			id: "confirm-delete-transaction",
			closeButton: true,
			duration: Infinity,
			description: "Confirm to delete",
			action: {
				label: "Confirm",
				onClick: () => {
					handleConfirm();
				},
			},
		});
	}

	return (
		<div className="relative h-full w-full">
			<Dialog open={openDialog}>
				<ResizablePanelGroup
					direction="vertical"
					className="flex h-full w-full flex-col"
				>
					<ResizablePanel defaultSize={70}>
						<div className="h-full w-full">
							<ImportPreview />
						</div>
					</ResizablePanel>
					<ResizableHandle />

					<ResizablePanel defaultSize={30}>
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
					{isUploading && (
						<Progress value={progress} className="w-40 border-2" />
					)}
				</Button>
				<DeleteTransactionDialog
					onClose={() => {
						handleFinal();
					}}
					onSubmit={onPromise(handleDelete)}
				/>
			</Dialog>
		</div>
	);
}

interface DeleteTransactionDialogProps {
	onClose: () => void;
	onSubmit: () => void;
}

function DeleteTransactionDialog({
	onClose,
	onSubmit,
}: DeleteTransactionDialogProps) {
	return (
		<DialogContent className="sm:max-w-[425px] [&>button]:hidden">
			<DialogHeader>
				<DialogTitle>Found existing transaction</DialogTitle>
				<DialogDescription>
					You are trying to upload a transaction that has the same
					period as an existing transaction. Do you want to overwrite
					the existing transaction? If you click continue, the
					existing transaction and related data will be deleted.
				</DialogDescription>
			</DialogHeader>
			<div className="grid gap-4"></div>
			<DialogFooter>
				<DialogClose asChild>
					<Button variant="outline" onClick={onClose}>
						Cancel
					</Button>
				</DialogClose>
				<Button type="submit" onClick={onSubmit}>
					Continue
				</Button>
			</DialogFooter>
		</DialogContent>
	);
}
