import { z } from "zod";
import { type ExcelSheetData } from "./excel_type";

export class ExpNodeRequirement<T = unknown> {

  constructor(description: string, check: (data: T) => boolean, isFatal = true) {
    this.description = description;
    this.check = check;
    this.isFatal = isFatal;
  }

  description: string;
  check: (data: T) => boolean;
  isFatal: boolean;
}

export class DestinationExpNode<T = string, U = unknown> {

  constructor(name: T, requirements: ExpNodeRequirement<U>[]) {
    this.name = name;
    this.requirements = requirements;
  }

  name: T;
  requirements: ExpNodeRequirement<U>[]; 
}


const ValidateErrorTypeEnum = z.enum(["missingColumn", "missingData"]);
type ValidateErrorTypeEnumType = z.infer<typeof ValidateErrorTypeEnum>;


export class ValidateErrorCode {
  constructor(type: ValidateErrorTypeEnumType, field: DestinationExpNode, row: number) {
    this.type = type;
    this.field = field;
    this.row = row;
  }

  type: ValidateErrorTypeEnumType;
  field: DestinationExpNode;
  row: number;

  toString(): string {
    return `Error type := ${this.type}, field := ${this.field.name}, row := ${this.row}`;
  }
}

type ValidateResult = { success: boolean; errors: ValidateErrorCode[] };

export class ExcelValidator {
  private requiredDest: DestinationExpNode[];

  constructor(requiredColumns: DestinationExpNode[]) {
    this.requiredDest = requiredColumns;
  }

  validate(excel: ExcelSheetData): ValidateResult {
    console.log("Validating excel:", excel.sheet_name);

    const errors: ValidateErrorCode[] = [];

    const columnIdxReq: Record<number, DestinationExpNode> = {};

    // Validate header
    for (const req of this.requiredDest) {
      const idx = excel.raw_header.indexOf(req.name)
      if (idx === -1 ) {
        errors.push(new ValidateErrorCode("missingColumn", req, 0)); 
      } 
      columnIdxReq[idx] = req;
    }

    for (const row of excel.raw_data) {
      row.forEach((cell, idx) => {
        const req = columnIdxReq[idx];
        if (req) {
          for (const requirement of req.requirements) {
            if (!requirement.check(cell)) {
              errors.push(new ValidateErrorCode("missingData", req, row.indexOf(cell) + 1));              
            }            
          }          
        }        
      }) 
    }

    return {
      success: errors.length === 0,
      errors
    };
  }
}
