import { Dialog, DialogTrigger } from "~/components/ui/dialog";
import { ChevronsUpDown, FlagTriangleRight } from "lucide-react";
import {
	SidebarMenu,
	SidebarMenuButton,
	SidebarMenuItem,
} from "~/components/ui/sidebar";
import { PeriodSelector } from "../period_selector";
import { usePeriodContext } from "../context/period_context_provider";
import { useTranslation } from "react-i18next";
import { formatDate } from "~/lib/utils/format_date";

export function SidebarPeriodSelector() {
	const { displayPeriodName, selectedPeriod, selectedPayDate } = usePeriodContext();
	const { t } = useTranslation(["nav", "common"]);

	return (
		<SidebarMenu>
			<SidebarMenuItem>
				<Dialog>
					<DialogTrigger asChild>
						<SidebarMenuButton
							size="lg"
							className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
						>
							<div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
								<FlagTriangleRight className="size-4" />
							</div>
							<div className="grid flex-1 text-left text-sm leading-tight">
								<span className="truncate font-semibold">
									{t("period")}  {displayPeriodName}
								</span>
								<span className="truncate text-xs">
									{selectedPeriod?.period_name &&
										selectedPayDate
										? formatDate("day", selectedPayDate)
										: t("others.not_set", { ns: "common" })}
								</span>
							</div>
							<ChevronsUpDown className="ml-auto" />
						</SidebarMenuButton>
					</DialogTrigger>
					<PeriodSelector />
				</Dialog>
			</SidebarMenuItem>
		</SidebarMenu>
	);
}
