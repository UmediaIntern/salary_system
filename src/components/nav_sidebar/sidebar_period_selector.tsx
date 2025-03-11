import { Dialog, DialogContent } from "../ui/dialog";
import { DialogTrigger } from "@radix-ui/react-dialog";
import { ChevronsUpDown, FlagTriangleRight } from "lucide-react";
import {
	SidebarMenu,
	SidebarMenuButton,
	SidebarMenuItem,
} from "~/components/ui/sidebar";
import PeriodSelector from "../period_selector";
import { usePeriodContext } from "../context/period_context_provider";
import { useTranslation } from "react-i18next";

export function SidebarPeriodSelector() {
	const { selectedPeriod, selectedPayDate } = usePeriodContext();
	const { t } = useTranslation("common");

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
									{t("period")}
								</span>
								<span className="truncate text-xs">
									{selectedPeriod?.period_name &&
									selectedPayDate
										? selectedPayDate
										: t("others.not_set")}
								</span>
							</div>
							<ChevronsUpDown className="ml-auto" />
						</SidebarMenuButton>
					</DialogTrigger>
					<DialogContent>
						<PeriodSelector />
					</DialogContent>
				</Dialog>
			</SidebarMenuItem>
		</SidebarMenu>
	);
}
