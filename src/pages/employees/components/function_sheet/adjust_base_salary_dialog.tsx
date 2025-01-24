import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from "~/components/ui/dialog";
import { Button } from "~/components/ui/button";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
	Form,
	FormControl,
	FormDescription,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "~/components/ui/form";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "~/components/ui/select";
import { useTranslation } from "react-i18next";
import { useQueryHandle } from "~/components/query_boundary/query_handle";
import { api } from "~/utils/api";
import Link from "next/link";

const adjustBaseSalarySchema = z.object({
	insurance_rate_setting_id: z.string(),
});

type BaseSalaryOption = { value: number; label: number };

interface AdjustBaseSalaryDialogPorps {
	open: boolean;
	setOpen: (open: boolean) => void;
}

export function AdjustBaseSalaryDialog({
	open,
	setOpen,
}: AdjustBaseSalaryDialogPorps) {
	const q = api.parameters.getAllInsuranceRateSetting.useQuery();
	const { data, isPending, content } = useQueryHandle(q);

	const form = useForm<z.infer<typeof adjustBaseSalarySchema>>({
		resolver: zodResolver(adjustBaseSalarySchema),
	});

	const { t } = useTranslation(["common"]);

	const employeePaymentAdjustBaseSalary =
		api.employeePayment.adjustBaseSalary.useMutation();

	if (isPending) {
		return content;
	}

	const onSubmit = (form_data: z.infer<typeof adjustBaseSalarySchema>) => {
		const selectedSetting = data.find(
			(d) => d?.[0]?.id?.toString() == form_data.insurance_rate_setting_id
		)?.[0];
		if (!selectedSetting) {
			// Show something here
			return;
		}
		employeePaymentAdjustBaseSalary.mutate({
			base_salary: selectedSetting.min_wage,
			start_date: selectedSetting.start_date,
		});
	};

	const options: BaseSalaryOption[] = [];
	data.forEach((d) => {
		if (d?.[0]) {
			options.push({
				value: d[0].id,
				label: d?.[0].min_wage,
			});
		}
	});

	return (
		<Dialog open={open} onOpenChange={setOpen}>
			<DialogContent>
				<DialogHeader>
					<DialogTitle>{t("form.adjust_base_salary.title")}</DialogTitle>
					<DialogDescription>
            {t("form.adjust_base_salary.description")}
					</DialogDescription>
				</DialogHeader>
				<Form {...form}>
					<form
						onSubmit={(event) =>
							void form.handleSubmit(onSubmit)(event)
						}
						className="w-full space-y-6"
					>
						<FormField
							control={form.control}
							name="insurance_rate_setting_id"
							render={({ field }) => (
								<BaseSalarySelect
									onChange={field.onChange}
									defaultValue={field.value}
									options={options}
								/>
							)}
						/>
					</form>
				</Form>
				<DialogFooter>
					<Button type="submit">{t("button.confirm")}</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
}

interface BaseSalarySelectProps {
	onChange: (value: string) => void;
	options: BaseSalaryOption[];
	defaultValue?: string;
}

function BaseSalarySelect({ onChange, options }: BaseSalarySelectProps) {

	const { t } = useTranslation(["common"]);

	return (
		<FormItem>
			<FormLabel>{t("table.min_wage")}</FormLabel>
			<Select onValueChange={onChange}>
				<FormControl>
					<SelectTrigger>
						<SelectValue placeholder={t("form.adjust_base_salary.placeholder")} />
					</SelectTrigger>
				</FormControl>
				<SelectContent>
					{options.map((opt) => (
						<SelectItem
							key={opt.value}
							value={opt.value.toString()}
						>
							{opt.label}
						</SelectItem>
					))}
				</SelectContent>
			</Select>
			<FormDescription>
        {t("form.adjust_base_salary.footer_desc")}
        <Link className="underline" href="/parameters">{t("table_name.insuranceRateSetting")}</Link>
			</FormDescription>
			<FormMessage />
		</FormItem>
	);
}
