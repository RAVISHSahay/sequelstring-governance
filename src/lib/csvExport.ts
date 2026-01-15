import { format } from 'date-fns';

interface ExportColumn<T> {
  key: keyof T | string;
  header: string;
  formatter?: (value: any, row: T) => string;
}

interface ExportOptions<T> {
  data: T[];
  columns: ExportColumn<T>[];
  filename: string;
  includeTimestamp?: boolean;
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
 * Exports data to a CSV file and triggers download
 */
export const exportToCSV = <T extends Record<string, any>>({
  data,
  columns,
  filename,
  includeTimestamp = true,
}: ExportOptions<T>): void => {
  // Create header row
  const headers = columns.map((col) => escapeCSVValue(col.header));
  
  // Create data rows
  const rows = data.map((row) => {
    return columns.map((col) => {
      const rawValue = getNestedValue(row, col.key as string);
      const formattedValue = col.formatter ? col.formatter(rawValue, row) : rawValue;
      return escapeCSVValue(formattedValue);
    });
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
