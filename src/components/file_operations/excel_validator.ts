type ExcelData = any[][];
type ValidateResult = { success: boolean; missingColumns: string[] };

export class ExcelValidator {
  private requiredColumns: string[];

  constructor(requiredColumns: string[]) {
    this.requiredColumns = requiredColumns;
  }

  /**
   * Validates that all required columns exist in the first row of the dataset.
   * @param data The data to validate, represented as an array of objects.
   * @returns An object with success flag and missing columns if any.
   */
  validate(data: ExcelData): ValidateResult {
    if (!data || data.length === 0) {
      return {
        success: false,
        missingColumns: this.requiredColumns
      };
    }

    const actualColumns = Object.keys(data[0]);
    const missingColumns = this.requiredColumns.filter(
      col => !actualColumns.includes(col)
    );

    return {
      success: missingColumns.length === 0,
      missingColumns
    };
  }
}
