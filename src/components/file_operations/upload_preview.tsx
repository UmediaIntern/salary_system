import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "~/components/ui/table";
import { Button } from "../ui/button";
import { useTranslation } from "react-i18next";
import { isDateType } from "~/lib/utils/check_type";
import { formatDate } from "~/lib/utils/format_date";

interface UploadPreviewProps {
	data: any[][];
	onClick?: () => void;
}

export function UploadPreview({ data, onClick }: UploadPreviewProps) {
	const { t } = useTranslation("common");
	console.log("upload preview", data);

	return (
		<div className="flex h-full w-full flex-col">
				<div className="overflow-x-auto overflow-y-auto border border-gray-300">
					<Table className="w-full table-auto">
						<TableHeader>
							<TableRow>
								{(data?.[0] ?? []).map(
									(header: any, index: number) => {
										if (index == 0) return <></>;
										else
											return (
												<TableHead key={index}>
													{header}
												</TableHead>
											);
									}
								)}
							</TableRow>
						</TableHeader>
						<TableBody>
							{data
								?.slice(1)
								.map((row: any[], rowIndex: number) => (
									<TableRow key={rowIndex}>
										{row.map(
											(cell: any, cellIndex: number) => {
												if (cellIndex == 0)
													return <></>;
												else
													return (
														<TableCell
															key={cellIndex}
														>
															{isDateType(cell)
																? formatDate(
																		"day",
																		cell
																  )
																: cell}
														</TableCell>
													);
											}
										)}
									</TableRow>
								))}
						</TableBody>
					</Table>
			</div>

			<div className="mt-4 flex justify-end">
				<Button className="ml-auto" onClick={onClick}>
					{t("button.excel_upload")}
				</Button>
			</div>
		</div>
	);
}

// () => {
// 	batchCreateFunction.mutate(
// 		recoverData(
// 			data.map((d) => d.slice(1)),
// 			selectedPeriod?.period_id ?? 0,
// 			selectedBonusType,
// 			true,
// 			selectedTableType
// 		)
// 	);
// }
