import { format } from 'date-fns';
import * as XLSX from 'xlsx';

export interface ExportColumn<T> {
  key: keyof T | string;
  header: string;
  formatter?: (value: any, row: T) => string;
}

interface CSVExportOptions<T> {
  data: T[];
  columns: ExportColumn<T>[];
  filename: string;
  includeTimestamp?: boolean;
}

interface ExcelExportOptions<T> extends CSVExportOptions<T> {
  sheetName?: string;
}

/**
 * Escapes a value for CSV format
 */
const escapeCSVValue = (value: any): string => {
  if (value === null || value === undefined) {
    return '';
  }
  
  const stringValue = String(value);
  
  // If the value contains commas, quotes, or newlines, wrap in quotes
  if (stringValue.includes(',') || stringValue.includes('"') || stringValue.includes('\n')) {
    // Escape quotes by doubling them
    return `"${stringValue.replace(/"/g, '""')}"`;
  }
  
  return stringValue;
};

/**
 * Gets a nested property value from an object using dot notation
 */
const getNestedValue = <T>(obj: T, path: string): any => {
  return path.split('.').reduce((current: any, key) => {
    return current && current[key] !== undefined ? current[key] : '';
  }, obj);
};

/**
 * Gets the value for a column, applying any formatter
 */
const getColumnValue = <T extends Record<string, any>>(
  row: T,
  column: ExportColumn<T>
): string => {
  const rawValue = getNestedValue(row, column.key as string);
  return column.formatter ? column.formatter(rawValue, row) : String(rawValue ?? '');
};

/**
 * Exports data to a CSV file and triggers download
 */
export const exportToCSV = <T extends Record<string, any>>({
  data,
  columns,
  filename,
  includeTimestamp = true,
}: CSVExportOptions<T>): void => {
  // Create header row
  const headers = columns.map((col) => escapeCSVValue(col.header));
  
  // Create data rows
  const rows = data.map((row) => {
    return columns.map((col) => escapeCSVValue(getColumnValue(row, col)));
  });
  
  // Combine headers and rows
  const csvContent = [
    headers.join(','),
    ...rows.map((row) => row.join(',')),
  ].join('\n');
  
  // Generate filename with optional timestamp
  const timestamp = includeTimestamp ? `-${format(new Date(), 'yyyy-MM-dd-HHmmss')}` : '';
  const fullFilename = `${filename}${timestamp}.csv`;
  
  // Create and trigger download
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = fullFilename;
  link.click();
  URL.revokeObjectURL(url);
};

/**
 * Exports data to an Excel file (.xlsx) and triggers download
 */
export const exportToExcel = <T extends Record<string, any>>({
  data,
  columns,
  filename,
  sheetName = 'Sheet1',
  includeTimestamp = true,
}: ExcelExportOptions<T>): void => {
  // Create header row
  const headers = columns.map((col) => col.header);
  
  // Create data rows
  const rows = data.map((row) => {
    return columns.map((col) => {
      const rawValue = getNestedValue(row, col.key as string);
      // For Excel, we can keep numbers as numbers if no formatter
      if (col.formatter) {
        return col.formatter(rawValue, row);
      }
      return rawValue ?? '';
    });
  });
  
  // Create worksheet data with headers
  const wsData = [headers, ...rows];
  
  // Create workbook and worksheet
  const workbook = XLSX.utils.book_new();
  const worksheet = XLSX.utils.aoa_to_sheet(wsData);
  
  // Auto-size columns based on content
  const colWidths = columns.map((col, index) => {
    const maxLength = Math.max(
      col.header.length,
      ...rows.map((row) => String(row[index] ?? '').length)
    );
    return { wch: Math.min(Math.max(maxLength + 2, 10), 50) };
  });
  worksheet['!cols'] = colWidths;
  
  // Add worksheet to workbook
  XLSX.utils.book_append_sheet(workbook, worksheet, sheetName);
  
  // Generate filename with optional timestamp
  const timestamp = includeTimestamp ? `-${format(new Date(), 'yyyy-MM-dd-HHmmss')}` : '';
  const fullFilename = `${filename}${timestamp}.xlsx`;
  
  // Write and download
  XLSX.writeFile(workbook, fullFilename);
};

/**
 * Pre-built column formatters for common data types
 */
export const columnFormatters = {
  currency: (value: number | string) => {
    if (typeof value === 'number') {
      return new Intl.NumberFormat('en-IN', {
        style: 'currency',
        currency: 'INR',
        maximumFractionDigits: 0,
      }).format(value);
    }
    return String(value);
  },
  
  date: (value: Date | string) => {
    if (value instanceof Date) {
      return format(value, 'yyyy-MM-dd');
    }
    return String(value);
  },
  
  dateTime: (value: Date | string) => {
    if (value instanceof Date) {
      return format(value, 'yyyy-MM-dd HH:mm:ss');
    }
    return String(value);
  },
  
  boolean: (value: boolean) => (value ? 'Yes' : 'No'),
  
  percentage: (value: number) => `${value}%`,
  
  list: (value: string[]) => value?.join('; ') || '',
};
