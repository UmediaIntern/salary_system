export class SourceExpNode {

  constructor(key: string, columnIdx: number) {
    this.key = key;
    this.columnIdx = columnIdx;
  }

  key: string;
  columnIdx: number;
}

export class ExcelSheetData<T = any> {

  constructor(sheet_name: string, raw_header: any[], data: T[][]) {
    this.sheet_name = sheet_name;
    this.raw_header = raw_header;
    this.raw_data = data;
  }

  sheet_name: string;
  readonly raw_header: any[];
  readonly raw_data: T[][]

  header: SourceExpNode[] = [];
}
