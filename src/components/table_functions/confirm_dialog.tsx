import { useTranslation } from "react-i18next";
import { Button } from "~/components/ui/button";
import {
	DialogClose,
	DialogContent,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from "~/components/ui/dialog";
import { ScrollArea } from "~/components/ui/scroll-area";
import GeneralTable from "~/components/table_functions/general_table";

interface ConfirmDialogProps {
	onClick: () => void;
	data?: Record<string, any>;
}

export function ConfirmDialog({ onClick, data }: ConfirmDialogProps) {
	const { t } = useTranslation();

	return (
		<DialogContent className="p-0 sm:max-w-[425px]">
			<ScrollArea className="max-h-[80vh] w-full">
				<div className="p-12">
					<DialogHeader className="pb-12">
						<DialogTitle>{t("others.check_data")}</DialogTitle>
					</DialogHeader>
					<GeneralTable data={data ?? {}} />
					<DialogFooter className="pt-12">
						<DialogClose asChild>
							<Button onClick={onClick}>
								{t("button.delete")}
							</Button>
						</DialogClose>
					</DialogFooter>
				</div>
			</ScrollArea>
		</DialogContent>
	);
}
