import React, { useEffect, useState } from "react";
import {
	DialogContent,
	DialogFooter,
	DialogTitle,
} from "~/components/ui/dialog";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import { Button } from "~/components/ui/button";

import { useTranslation } from "react-i18next";
import { ExcelDownloader } from "~/components/file_operations/excel_downloader";
import { usePeriodContext } from "~/components/context/period_context_provider";

interface ExcelDownloadProps {
	data: any[][];
	fileName: string;
	setOpenDialog: (open: boolean) => void;
	withHeader?: boolean;
	transpose?: boolean;
}

export function ExcelDownload({ data, fileName, setOpenDialog, withHeader = true, transpose = false }: ExcelDownloadProps) {
	const { t } = useTranslation();

	const [filename, setFilename] = useState("excel");

	const { selectedPeriod } = usePeriodContext();
	const period_name = selectedPeriod?.period_name ?? "ERROR";

	useEffect(() => {
		setFilename(`${fileName}_${period_name}`);
	}, [fileName, period_name]);

	const headers = data[0]?.map((header) => t(`table.${header}`)) ?? null;

	return (
		<DialogContent className="p-8">
			<DialogTitle>{t("button.excel_download")}</DialogTitle>
			<div className="flex flex-row items-center justify-center">
				<Label className="min-w-20">{t("table.filename")}</Label>
				<Input
					id="filename"
					value={filename}
					onChange={(e) => {
						setFilename(e.target.value);
					}}
					className="col-span-3"
				/>
			</div>
			<DialogFooter>
				<Button
					type="submit"
					onClick={() => {
						new ExcelDownloader()
							.setFileName(filename)
							.addSheet({
								buildSheet: (sheet) => {
									if (withHeader && headers) {
										sheet.setHeaders(headers);
										sheet.setData(data.slice(1));
									} else {
										sheet.setData(data);
									}
									if (transpose) sheet.setTranspose();
								},
							})
							.download()
							.then(() => setOpenDialog(false))
							.catch((e) => console.error(e));
					}}
				>
					{t("button.excel_download")}
				</Button>
			</DialogFooter>
		</DialogContent>
	);
}
