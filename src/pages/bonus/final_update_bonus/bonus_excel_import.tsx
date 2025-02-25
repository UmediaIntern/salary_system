/* ShadCN UI */
import { Button } from "~/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "~/components/ui/tabs";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
} from "~/components/ui/dialog";

import {
	Select,
	SelectContent,
	SelectGroup,
	SelectItem,
	SelectLabel,
	SelectTrigger,
	SelectValue,
} from "~/components/ui/select";
import { api } from "~/utils/api";
import { useEffect, useState } from "react";
import { FileUploader } from "~/components/file_operations/file_uploader";
import { extractData } from "~/components/file_operations/excel_upload_utils";

export default function BonusExcelImport() {
	const [view, setView] = useState<string>("upload");
	const [selectedFile, setSelectedFile] = useState<string>("");
	const [files, setFiles] = useState<File[]>([]);
	const [datas, setDatas] = useState<Array<{ name: string; data: any[][] }>>(
		[]
	);

	const [errorEmployees, setErrorEmployees] = useState<Array<string>>([]);

	const updateFromExcel = api.bonus.updateFromExcel.useMutation({
		onSuccess: (data) => {
			const newErrorEmployees = errorEmployees;
			data.map((d) => {
				if (!(d in newErrorEmployees)) newErrorEmployees.push(d);
			});
			setErrorEmployees(newErrorEmployees);
		},
		onError: (error) => {
			console.error("Update failed:", error);
		},
	});
	const confirmUpdateFromExcel =
		api.bonus.confirmUpdateFromExcel.useMutation();

	async function handleFileUpload(acceptedFiles: File[]) {
		setFiles(acceptedFiles);
		acceptedFiles.sort((a: File, b: File) => a.name.localeCompare(b.name));

		await Promise.all(
			acceptedFiles.map(async (file) => {
				// Record<string, any[][]>
				const sheetsData = await extractData(file);
				if (!sheetsData) {
					return;
				}
				const sheet_names = Object.keys(sheetsData);
				if (sheet_names[0]) {
					const firstSheet = sheetsData[sheet_names[0]];
					if (firstSheet) {
						datas.push({
							name: file.name,
							data: firstSheet ?? [],
						});
					}
				}
			})
		);

		if (acceptedFiles[0]) {
			setSelectedFile(acceptedFiles[0].name);
		}
		setDatas(datas);
		setView("preview");
	}

	const selectedFileIdx = () =>
		datas.findIndex((d) => d.name === selectedFile);

	function recoverObject(data: Array<any>) {
		return data.slice(1).map((d) => {
			return {
				period_id: d[1],
				bonus_type: d[2],
				emp_no: d[3],
				special_multiplier: d[4],
				multiplier: d[5],
				fixed_amount: d[6],
				bud_effective_salary: d[7],
				bud_amount: d[8],
				sup_performance_level: d[9],
				sup_effective_salary: d[10],
				sup_amount: d[11],
				app_performance_level: d[12],
				app_effective_salary: d[13],
				app_amount: d[14],
			};
		});
	}

	return (
		<div className="grow flex-col">
			<Tabs
				className="h-full w-full flex flex-col"
				value={view}
				onValueChange={(v) => setView(v)}
			>
				<TabsList className="grid w-full grid-cols-2">
					<TabsTrigger value="upload">Upload</TabsTrigger>
					<TabsTrigger value="preview" disabled={files.length == 0}>
						Preview
					</TabsTrigger>
				</TabsList>
				<TabsContent value="upload" className="my-2 grow w-ful">
					<FileUploader onUpload={handleFileUpload} className="h-full"/>
				</TabsContent>
				<TabsContent value="preview">
					<div className="mb-2 flex w-full items-center justify-between">
						<Select
							value={selectedFile}
							onValueChange={setSelectedFile}
						>
							<SelectTrigger className="w-[180px]">
								<SelectValue placeholder="Select a fruit" />
							</SelectTrigger>
							<SelectContent>
								<SelectGroup>
									<SelectLabel>Filename</SelectLabel>
									{files.map((f) => (
										<SelectItem key={f.name} value={f.name}>
											{f.name}
										</SelectItem>
									))}
								</SelectGroup>
							</SelectContent>
						</Select>

						<Dialog
							open={errorEmployees.length != 0}
							onOpenChange={() => setErrorEmployees([])}
						>
							<DialogContent>
								<DialogHeader>
									<DialogTitle>
										Are you absolutely sure to update bonus
										table?
									</DialogTitle>
									<DialogDescription></DialogDescription>
								</DialogHeader>
								These are the bug employees
								{errorEmployees.map((emp) => {
									return (
										<>
											<p>{emp}</p>
										</>
									);
								})}
								<Button
									variant={"outline"}
									onClick={() => {
										datas.map(async (data: any) => {
											confirmUpdateFromExcel.mutate(
												recoverObject(
													data!.data as any
												) as any
											);
										});
										setErrorEmployees([]);
									}}
								>
									Update
								</Button>
							</DialogContent>
						</Dialog>
						<Button
							variant={"outline"}
							onClick={() => {
								datas.map(async (data: any) => {
									updateFromExcel.mutate(
										recoverObject(data!.data as any) as any
									);
								});
							}}
							className=""
						>
							Update
						</Button>
					</div>

					<div className="flex grow overflow-auto border border-gray-300">
						<table className="w-full border-collapse">
							<thead>
								<tr>
									{/* Assuming the first row contains headers */}
									{datas[selectedFileIdx()] &&
										(
											datas[selectedFileIdx()]
												?.data?.[0] ?? []
										).map((header: any, index: number) => (
											<th
												key={index}
												className="border border-gray-300 p-2"
											>
												{header}
											</th>
										))}
								</tr>
							</thead>
							<tbody>
								{datas[selectedFileIdx()]?.data
									.slice(1)
									.map((row: any[], rowIndex: number) => (
										<tr key={rowIndex}>
											{row.map(
												(
													cell: any,
													cellIndex: number
												) => (
													<td
														key={cellIndex}
														className="border border-gray-300 p-2"
													>
														{cell}
													</td>
												)
											)}
										</tr>
									))}
							</tbody>
						</table>
					</div>
				</TabsContent>
			</Tabs>
		</div>
	);
}
