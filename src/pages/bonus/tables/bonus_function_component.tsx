import { FunctionsComponent } from "~/components/data_table/functions_component";
import { useBonusFunctionContext } from "../components/context/data_table_context_provider";

export function BonusFunctionComponent({data}: {data: any}) {
    const { setOpenSheet, setOpenDialog, setMode, setData } = useBonusFunctionContext();
    return (
        <FunctionsComponent
            data={data}
            setOpenSheet={setOpenSheet}
            setOpenDialog={setOpenDialog}
            setMode={setMode}
            setData={setData}
        />
    );
}