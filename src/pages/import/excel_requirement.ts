import { DestinationExpNode, ExpNodeRequirement } from "~/components/file_operations/excel_validator";
import { ImportFieldsKeyType } from "~/server/api/types/import_type";

const isNotNull = new ExpNodeRequirement("Should not be null", (data) => {
  return data !== null;
})

const isNonEmptyString= new ExpNodeRequirement("Should be none empty string", (data) => {
  return typeof data === "string" && data !== "";
});

export const reqNodeEmpNo = new DestinationExpNode<ImportFieldsKeyType>("emp_no", [isNotNull, isNonEmptyString]);
