import { RootLayout } from "~/components/layout/root_layout";
import { type NextPageWithLayout } from "../../_app";
import { PerpageLayoutNav } from "~/components/layout/perpage_layout_nav";
import { api } from "~/utils/api";
import * as TABLE_NAMES from "../../table_names";
import { useRouter } from "next/router";
import Template from "../template";
import { Button } from "~/components/ui/button";
import { Translate } from "~/lib/utils/translation";

const PageTitle = "Bonus Setting";

const Bonus: NextPageWithLayout = () => {
	const getAllBonusSetting =
		api.parameters.getAllBonusSetting.useQuery();
	const updateBonusSetting =
		api.parameters.updateBonusSetting.useMutation({
			onSuccess: () => {
				getAllBonusSetting.refetch();
			},
		});
	const createBonusSetting =
		api.parameters.createBonusSetting.useMutation({
			onSuccess: () => {
				getAllBonusSetting.refetch();
			},
		});
	const deleteBonusSetting =
		api.parameters.deleteBonusSetting.useMutation({
			onSuccess: () => {
				getAllBonusSetting.refetch();
			},
		});

	return (
		<div className="flex min-h-full flex-col">
			<div className="" />
			<Template
				headerTitle={PageTitle}
				table_name={TABLE_NAMES.TABLE_BONUS_SETTING}
				queryFunction={getAllBonusSetting}
				updateFunction={updateBonusSetting}
				createFunction={createBonusSetting}
				deleteFunction={deleteBonusSetting}
			/>
		</div>
	);
};

Bonus.getLayout = function getLayout(page: React.ReactElement) {
	return (
		<RootLayout>
			<PerpageLayoutNav pageTitle={PageTitle}>{page}</PerpageLayoutNav>
		</RootLayout>
	);
};

export default Bonus;