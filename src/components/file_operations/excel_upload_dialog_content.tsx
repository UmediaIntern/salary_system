import { useTranslation } from "react-i18next";
import {
	DialogContent,
	DialogHeader,
	DialogTitle,
	DialogDescription,
} from "~/components/ui/dialog";
import { ExcelUpload } from "./excel_upload";

interface ExcelUploadDialogContentProps {
	onClick?: (data: any) => void;
	closeDialog: () => void;
}
export function ExcelUploadDialogContent({
	onClick,
	closeDialog,
}: ExcelUploadDialogContentProps) {
	const { t } = useTranslation(["common", "nav"]);

	return (
		<DialogContent className="max-h-[80vh] max-w-[80vw] p-8">
			<DialogHeader>
				<DialogTitle>
					{`${t(`button.excel_upload`)}${t("button.form")}`}
				</DialogTitle>
				<DialogDescription>
					{t(`button.excel_upload`)}
				</DialogDescription>
			</DialogHeader>
			<ExcelUpload
				onClick={(data) => {
					onClick && onClick(data);
					closeDialog();
				}}
			/>
		</DialogContent>
	);
}
