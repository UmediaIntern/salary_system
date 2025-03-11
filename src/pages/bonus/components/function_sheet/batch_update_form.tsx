import { BonusTypeEnumType } from "~/server/api/types/bonus_type_enum";
import { TableEnum } from "../context/data_table_enum";
import { useContext, useEffect, useState } from "react";
import { bonusToolbarFunctionsContext } from "./bonus_functions_context";
import { Dialog, DialogContent, DialogTitle, DialogDescription, DialogClose } from "@radix-ui/react-dialog";
import { Trash2, Copy, PenSquare } from "lucide-react";
import { useTranslation } from "react-i18next";
import { z } from "zod";
import { LoadingSpinner } from "~/components/loading";
import { DialogHeader, DialogFooter } from "~/components/ui/dialog";
import { FunctionMode } from "./data_table_functions";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "~/components/ui/table";
import { usePeriodContext } from "~/components/context/period_context_provider";

export function BonusBatchUpdateForm({
	tableType,
	bonusType,
	setOpen,
}: {
	tableType: TableEnum;
	bonusType: BonusTypeEnumType;
	setOpen: (open: boolean) => void;
}) {

    const mode = "batch_update";

	const functions = useContext(bonusToolbarFunctionsContext);
	const period = usePeriodContext();

	const queryFunction = functions.queryFunction!;
	const updateFunction = functions.updateFunction!;
	const createFunction = functions.createFunction!;
	const deleteFunction = functions.deleteFunction!;
	const { isLoading, isError, data, error } = queryFunction();

	const isList = Array.isArray(data);

	const [openDialog, setOpenDialog] = useState(false);
	const { t } = useTranslation(["common"]);

	function getDefaults<Schema extends z.AnyZodObject>(schema: Schema) {
		return Object.fromEntries(
			Object.entries(schema.shape).map(([key, value]) => {
				if (value instanceof z.ZodDefault)
					return [key, value._def.defaultValue()];
				return [key, undefined];
			})
		);
	}

	if (isLoading) {
		return <LoadingSpinner />; // TODO: Loading element with toast
	}

	if (isError) {
		return <span>Error: {error.message}</span>; // TODO: Error element with toast
	}

    const noIDData: any[] = data.map((item: any) => {
        const { ["id"]: id, ...rest } = item;
        return rest;
    });



	
	// Create or update an entry
	return (
		<>
			{/* Submit change dialog */}

            <CompViewAllDatas
                dataNoID={noIDData}
                mode={mode}
                onUpdate={(index: number) => {
                    console.log(index)
                    // setSelectedData(data[index]);
                }}
                onDelete={(index: number) => {
                    deleteFunction.mutate({
                        id: data[index].id,
                    });
                }}
            />


			<Dialog open={openDialog} onOpenChange={setOpenDialog}>
				<DialogContent className="max-h-screen overflow-y-scroll sm:max-w-[425px]">
					<DialogHeader>
						<DialogTitle>{t("others.check_data")}</DialogTitle>
						<DialogDescription></DialogDescription>
					</DialogHeader>
					
					<DialogFooter>
						<DialogClose asChild>
							{/* <Button onClick={submitForm} type="submit">
								{t("button.save")}
							</Button> */}
						</DialogClose>
					</DialogFooter>
				</DialogContent>
			</Dialog>
		</>
	);
}


const CompViewAllDatas = ({
	dataNoID,
	mode,
	onUpdate,
	onDelete,
}: {
	dataNoID: any[];
	mode: FunctionMode;
	onUpdate: (index: number) => void;
	onDelete: (index: number) => void;
}) => {
	const { t } = useTranslation(["common"]);
	const [filterValue, setFilterValue] = useState<string>("");
	const [filteredDataList, setFilteredDataList] =
		useState(dataNoID);

	useEffect(() => {
		const filteredData = dataNoID?.filter((data) => {
			return Object.values(data).some((value: any) =>
				value ? value.toString().includes(filterValue) : false
			);
		});
		setFilteredDataList(filteredData);
	}, [dataNoID, filterValue]);

	return (
		<>
			{/* <div className="flex h-[4rem] items-center justify-between">
				<Input
					className="w-1/10 absolute left-4 top-4"
					placeholder={t("others.filter_setting")}
					onChange={(e) => setFilterValue(e.target.value)}
				></Input>
				{mode == "create" && (
					<Button className="absolute right-4 top-4" onClick={() => { setWithoutDeafultValue(true) }}>
						{t("button.no_default_value")}
					</Button>
				)}
			</div> */}
			<div className="m-4">
				{filteredDataList.length != 0 && filteredDataList[0] ? (
					<Table>
						<TableHeader>
							<TableRow>
								<TableHead className="whitespace-nowrap text-center" />
								{Object.keys(filteredDataList[0]).map(
									(key: string) => {
										return (
											<TableHead
												key={key}
												className="whitespace-nowrap text-center"
											>
												{t(`table.${key}`)}
											</TableHead>
										);
									}
								)}
							</TableRow>
						</TableHeader>
						<TableBody>
							{filteredDataList.map((data, index: number) => {
								return (
									<TableRow key={data.emp_no}>
										<TableCell className="items-center">
											{mode === "create" && (
												<Copy
													size={18}
													className="cursor-pointer"
													onClick={() => {
														onUpdate(data.emp_no);
													}}
												/>
											)}
											{mode === "update" && (
												<PenSquare
													size={18}
													className="cursor-pointer"
													onClick={() => {
														onUpdate(index);
													}}
												/>
											)}
											{mode === "delete" && (
												<Trash2
													size={18}
													className="cursor-pointer"
													onClick={() => {
														onDelete(index);
													}}
												/>
											)}
										</TableCell>
										{Object.keys(data).map((key) => {
											return (
												<TableCell
													key={key}
													className="whitespace-nowrap text-center font-medium"
												>
													{data[key]}
												</TableCell>
											);
										})}
									</TableRow>
								);
							})}
						</TableBody>
					</Table>
				) : (
					<div className="m-4"> {t("table.no_data")} </div>
				)}
			</div>
		</>
	);
};
