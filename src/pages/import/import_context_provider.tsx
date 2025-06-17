import {
	createContext,
	useContext,
	useState,
	type PropsWithChildren,
} from "react";
import { type ImportFieldsType } from "~/server/api/types/import_type";

const importContext = createContext<{
  excelData: ImportFieldsType[],
  setExcelData: (data: ImportFieldsType[]) => void,
} | null>(null);

export function ImportContextProvider({ children }: PropsWithChildren) {
	const [excelData, setExcelData] = useState<ImportFieldsType[]>([]);

	return (
		<importContext.Provider
			value={{
        excelData,
        setExcelData,
			}}
		>
			{children}
		</importContext.Provider>
	);
}

export function useImportContext() {
	const context = useContext(importContext);
	if (context === null) {
		throw new Error(
			"Import Context must be used within a ImportContextProvider"
		);
	}
	return context;
}
