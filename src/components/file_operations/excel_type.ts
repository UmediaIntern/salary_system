
export interface ExcelSheetType<T = any> {
  sheet_name: string;
  header: string[];
  data: T[][]
}
