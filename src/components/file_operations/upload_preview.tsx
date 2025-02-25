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
import { ScrollArea, ScrollBar } from "../ui/scroll-area";
import { useEffect, useState } from "react";
import { cn } from "~/lib/utils";

interface UploadPreviewProps {
	datas: Record<string, any[][]>;
	onClick?: () => void;
}

export function UploadPreview({ datas, onClick }: UploadPreviewProps) {
	const { t } = useTranslation("common");
	const [selectedKey, setSelectedKey] = useState<string | null>(null);
	const [isMultiSheet, setIsMultiSheet] = useState(false);

	useEffect(() => {
		const keys = Object.keys(datas);

		if (keys.length > 1) {
			setIsMultiSheet(true);
		}

		const firstKey = keys[0];
		if (!firstKey) return;

		setSelectedKey(firstKey);
	}, [datas]);

	return (
		<div className="flex h-full w-full flex-col">
			<div className="flex w-full flex-col gap-2">
				{/* Tabs list */}
				{isMultiSheet && (
					<ScrollArea>
						<div className="flex gap-2">
							{Object.keys(datas).map((key) => {
								return (
									<Button
										key={key}
										variant={
											selectedKey === key
												? "secondary"
												: "outline"
										}
										onClick={() => setSelectedKey(key)}
									>
										{key}
									</Button>
								);
							})}
						</div>

						<ScrollBar orientation="horizontal" />
					</ScrollArea>
				)}

				{selectedKey && datas[selectedKey] && (
					<div className="flex rounded-sm border-2 border-muted">
						<ScrollArea className="max-h-[55vh] w-full">
							<PreviewTable data={datas[selectedKey]} />
							<ScrollBar orientation="horizontal" hidden={true} />
						</ScrollArea>
					</div>
				)}
			</div>

			<div className="mt-4 flex justify-end">
				<Button className="ml-auto" onClick={onClick}>
					{t("button.excel_upload")}
				</Button>
			</div>
		</div>
	);
}

interface PreviewTableProps {
	data: any[][];
}

function PreviewTable({ data }: PreviewTableProps) {
	const headerLength = data?.[0]?.length ?? 0;
	return (
		<Table className="">
			<TableHeader className="">
				<TableRow className="sticky top-0 bg-muted hover:bg-muted">
					{(data?.[0] ?? []).map((header: string) => (
						<TableHead
							key={header}
							className={cn("min-w-[140px] text-center")}
						>
							{header}
						</TableHead>
					))}
				</TableRow>
			</TableHeader>
			<TableBody>
				{data?.slice(1).map((row: any[], rowIndex: number) => {
					if (row.length < headerLength) {
						row = row.concat(
							Array(headerLength - row.length).fill("")
						);
					}
					return (
						<TableRow key={`row_${rowIndex}`}>
							{row.map((cell: any, cellIndex: number) => {
								if (cellIndex >= headerLength) return <></>;
								else {
									const cellData: string = isDateType(cell)
										? formatDate("day", cell)
										: cell ?? "";

									return (
										<TableCell
											key={`cell_${cellIndex}_${cellData}`}
											className="text-center"
										>
											{cellData === "" ? "-" : cellData}
										</TableCell>
									);
								}
							})}
						</TableRow>
					);
				})}
			</TableBody>
		</Table>
	);
}
