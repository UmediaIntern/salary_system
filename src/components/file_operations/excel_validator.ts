import { z } from "zod";
import { type ExcelSheetType } from "./excel_type";

class ExpNodeRequirement {

  constructor(description: string, check: (data: unknown) => boolean, isFatal = true) {
    this.description = description;
    this.check = check;
    this.isFatal = isFatal;
  }

  description: string;
  check: (data: unknown) => boolean;
  isFatal: boolean;
}

class DestinationExpNode {

  constructor(name: string, requirements: ExpNodeRequirement[]) {
    this.name = name;
    this.requirements = requirements;
  }

  name: string;
  requirements: ExpNodeRequirement[]; 
}


const ValidateErrorTypeEnum = z.enum(["missingColumn", "missingData"]);
type ValidateErrorTypeEnumType = z.infer<typeof ValidateErrorTypeEnum>;


class ValidateErrorCode {
  constructor(type: ValidateErrorTypeEnumType, field: DestinationExpNode, row: number) {
    this.type = type;
    this.field = field;
    this.row = row;
  }

  type: ValidateErrorTypeEnumType;
  field: DestinationExpNode;
  row: number;
}

type ValidateResult = { success: boolean; errors: ValidateErrorCode[] };

export class ExcelValidator {
  private requiredDest: DestinationExpNode[];

  constructor(requiredColumns: DestinationExpNode[]) {
    this.requiredDest = requiredColumns;
  }

  validate(excel: ExcelSheetType): ValidateResult {
    const errors: ValidateErrorCode[] = [];

    const columnIdxReq: Record<number, DestinationExpNode> = {};

    // Validate header
    for (const req of this.requiredDest) {
      const idx = excel.header.indexOf(req.name)
      if (idx === -1 ) {
        errors.push(new ValidateErrorCode("missingColumn", req, 0)); 
      } 
      columnIdxReq[idx] = req;
    }

    for (const row of excel.data) {
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
