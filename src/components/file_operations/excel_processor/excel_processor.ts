import { useEffect, useState } from "react";
import { ExcelProcessor } from "./create_processor";


export function useExcelProcessor(excel: any[][]) {
  const [processorRef] = useState(() => ({
    current: new ExcelProcessor(),
  }));

  const [state, setState] = useState(() => processorRef.current.getState());

  useEffect(() => {
    processorRef.current.loadExcel(excel);
  }, [processorRef, excel]);

  processorRef.current.setOptions((prev) => ({
    ...prev,
    state: {
      ...state,
      ...prev.state,
    },
    onStateChange: (next) => {
      setState(next);
    },
  }));

  return processorRef.current;
}

