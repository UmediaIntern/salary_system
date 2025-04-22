import { AlertCircle } from "lucide-react";
import { useTranslation } from "react-i18next";
import { Alert, AlertDescription, AlertTitle } from "~/components/ui/alert";

export function SelectPeriodAlert() {
	const { t } = useTranslation(["common"]);

	return (
		<Alert variant="destructive">
			<AlertCircle className="h-4 w-4" />
			<AlertTitle>Error</AlertTitle>
			<AlertDescription>{t("others.select_period")}</AlertDescription>
		</Alert>
	);
}
