import { FunctionsComponent } from "~/components/data_table/functions_component";
import { useBonusFunctionContext } from "../components/context/data_table_context_provider";

export function BonusFunctionComponent({data}: {data: any}) {
    const { setOpen, setMode, setData } = useBonusFunctionContext();
    return (
        <FunctionsComponent
            data={data}
            setOpen={setOpen}
            setMode={setMode}
            setData={setData}
        />
    );
}