import * as XLSX from 'xlsx';
export type SheetRange = {
    startRow: number;
    endRow: number;
    startCol: number;
    endCol: number;
};
export declare class ExcelUtil {
    static getSheetDimensionsFromFileAndSheetName(file: string, sheetName: string): SheetRange;
    static getSheetDimensions(sheet: XLSX.WorkSheet): SheetRange;
    static getFirstRow(sheet: XLSX.WorkSheet, skipHeaderRow: boolean): number;
    static getFirstCol(sheet: XLSX.WorkSheet): number;
    static getSheetNames(file: string): string[];
    static getExcelDataAsMap(file: string, sheetName: string): any[][];
    static getWorkbook(file: string): XLSX.WorkBook;
    static getTableDataAsMap(file: string, tableName: string, sheetName: string): any[][];
    static findCell(sheet: XLSX.WorkSheet, searchText: string, firstCol: number, firstRow: number): XLSX.CellAddress;
}
//# sourceMappingURL=excelUtil.d.ts.map