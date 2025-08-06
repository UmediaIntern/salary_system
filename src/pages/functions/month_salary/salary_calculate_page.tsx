import React from "react";
import { useTranslation } from "react-i18next";
import { LoadingSpinner } from "~/components/loading";
import { type FunctionsEnumType } from "~/server/api/types/functions_enum";
import { api } from "~/utils/api";

import { useEffect } from "react";
import { type Period } from "~/server/database/entity/UMEDIA/period";

import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "~/components/ui/card";
import { Button } from "~/components/ui/button";
import Link from "next/link";
import { useQueryHandle } from "~/components/query_boundary/query_handle";

export function SalaryCalculatePage({
	period,
	func,
	selectedIndex,
	setSelectedIndex,
}: {
	period: Period;
	func: FunctionsEnumType;
	selectedIndex: number;
	setSelectedIndex: (index: number) => void;
}) {
	const q = api.sync.getPaidEmployees.useQuery({
		period_id: period.period_id,
		func,
	});
	const { data, isPending, content } = useQueryHandle(q);

	const { t } = useTranslation(['common'])

	if (isPending) {
		return content;
	}

	return (
		<>
			<SalaryCalculateContent
				period={period}
				emp_no_list={data.map((emp) => emp.emp_no)}
			/>
			<div className="mt-4 flex justify-between">
				<Button onClick={() => setSelectedIndex(selectedIndex - 1)}>
					{t("button.previous_step")}
				</Button>
			</div>
		</>
	);
}

function SalaryCalculateContent({
	period,
	emp_no_list,
}: {
	period: Period;
	emp_no_list: string[];
}) {
	// const { isLoading, isError, data, error } = api.calculate.calculateWeekdayOvertimePay.useQuery({ emp_no: emp_no_list[0]!, period_id: period })

	const createTransaction = api.transaction.createTransaction.useMutation({
		onSuccess: () => {
			console.log("success");
		},
		onError: (error) => {
			console.log("error");
			console.log(error);
		},
	});

	useEffect(() => {
		// createTransaction.mutate({ emp_no_list: emp_no_list, period_id: period.period_id, issue_date: period.issue_date, pay_type: "month_salary", note: "計算月薪"});
	}, []);

	const { t } = useTranslation(["common", "nav"]);

	const [start, setStart] = React.useState(false);

	function StartCalculate() {
		return (
			<div className="flex h-0 w-full flex-grow items-center justify-center">
				<Card className="w-1/2 text-center">
					<CardHeader className="p-2 pt-0 md:p-4">
						<CardTitle className="p-4">
							{t("others.start_calculate_month_salary")}
						</CardTitle>
						{/* <CardDescription></CardDescription> */}
					</CardHeader>
					<CardContent className="p-2 pt-0 md:p-4 md:pt-0">
						<Button
							onClick={() => {
								setStart(true);
								createTransaction.mutate({
									emp_no_list: emp_no_list,
									period_id: period.period_id,
									issue_date: new Date(period.issue_date),
									pay_type: "month_salary",
									note: "",
								});
							}}
						>
							{" "}
							{t(
								"others.start_calculate_month_salary_button"
							)}{" "}
						</Button>
					</CardContent>
				</Card>
			</div>
		);
	}

	if (!start) {
		return <StartCalculate />;
	}

	if (createTransaction.isSuccess) {
		return (
			<div className="flex h-0 w-full flex-grow items-center justify-center">
				<Card className="w-1/2 text-center">
					<CardHeader className="p-2 pt-0 md:p-4">
						<CardTitle className="p-4">
							{t("others.calculate_done")}
						</CardTitle>
						<CardDescription>
							<Button>
								<Link href="/data_export">
									{t("data_export", { ns: "nav" })}
								</Link>
							</Button>
						</CardDescription>
					</CardHeader>
					<CardContent className="p-2 pt-0 md:p-4 md:pt-0"></CardContent>
				</Card>
			</div>
		);
	}

	if (createTransaction.isPending) {
		console.log("Pending...");
		return <LoadingSpinner />; // TODO: Loading element with toast
	}

	if (createTransaction.isError) {
		return <span>Error: {createTransaction.error.message}</span>; // TODO: Error element with toast
	}

	return <></>;
}
