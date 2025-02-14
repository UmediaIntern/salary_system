import { NextPageWithLayout } from "../_app";
import { ReactElement, useState, useCallback, useEffect, useContext } from "react";
import { RootLayout } from "~/components/layout/root_layout";
import { PerpageLayoutNav } from "~/components/layout/perpage_layout_nav";

/* ShadCN UI */
import { Button } from "~/components/ui/button";
import periodContext from "~/components/context/period_context";
import { api } from "~/utils/api";

const TEST: NextPageWithLayout = () => {

	const { selectedPeriod } = useContext(periodContext);
	const { isPending, isError, data, error } =
			api.employeePayment.getCurrentEmployeePayment.useQuery({period_id: selectedPeriod?.period_id ?? 0});

	const updateEmployeePayment = api.employeePayment.updateEmployeePayment.useMutation();
	const deleteEmployeePayment = api.employeePayment.deleteEmployeePayment.useMutation();

	return (
		<>
			<Button onClick={() => {
				console.log(data!.map((e) => e.id));
				data?.map((d) => {
					update.mutate({
						id: d.id,
					});
				})
			}}>
				TEST
			</Button>
		</>
	);
};

TEST.getLayout = function getLayout(page: ReactElement) {
	return (
		<RootLayout>
			<PerpageLayoutNav pageTitle="Test">{page}</PerpageLayoutNav>
		</RootLayout>
	);
};

export default TEST;
