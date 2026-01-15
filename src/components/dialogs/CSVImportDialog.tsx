import { useState, useCallback } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Alert, AlertDescription } from '@/components/ui/alert';
import {
  Upload,
  FileSpreadsheet,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Download,
  ArrowRight,
  Loader2,
  Info,
  HelpCircle,
  Code,
  AtSign,
  Phone as PhoneIcon,
  Hash,
  Type,
  Ruler,
  Wand2,
  Sparkles,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';

interface FieldMapping {
  csvColumn: string;
  targetField: string;
  required: boolean;
}

interface ValidationRule {
  type: 'email' | 'phone' | 'required' | 'regex' | 'minLength' | 'maxLength' | 'numeric' | 'alphanumeric';
  message: string;
  pattern?: string; // Custom regex pattern for 'regex' type
  value?: number;   // For minLength/maxLength
}

interface ImportField {
  name: string;
  label: string;
  required: boolean;
  validation?: ValidationRule[];
}

interface RowValidation {
  rowIndex: number;
  errors: { field: string; message: string }[];
  isDuplicate: boolean;
  duplicateOf?: number;
}

interface CSVImportDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  description: string;
  fields: ImportField[];
  onImport: (data: Record<string, string>[]) => void;
  templateFileName: string;
  duplicateCheckFields?: string[]; // Fields to check for duplicates (e.g., ['email'])
  existingData?: Record<string, string>[]; // Existing data to check duplicates against
}

type ImportStep = 'upload' | 'mapping' | 'preview' | 'importing' | 'complete';

// Validation helper functions
const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email.trim());
};

const validatePhone = (phone: string): boolean => {
  // Accepts various phone formats: +1234567890, (123) 456-7890, 123-456-7890, etc.
  const phoneRegex = /^[\+]?[(]?[0-9]{1,4}[)]?[-\s\.]?[0-9]{1,4}[-\s\.]?[0-9]{1,9}$/;
  const cleaned = phone.replace(/\s/g, '');
  return cleaned.length >= 7 && phoneRegex.test(cleaned);
};

const validateRegex = (value: string, pattern: string): boolean => {
  try {
    const regex = new RegExp(pattern);
    return regex.test(value.trim());
  } catch {
    console.error('Invalid regex pattern:', pattern);
    return true; // Don't fail validation if regex is invalid
  }
};

const validateNumeric = (value: string): boolean => {
  return /^-?\d*\.?\d+$/.test(value.trim());
};

const validateAlphanumeric = (value: string): boolean => {
  return /^[a-zA-Z0-9]+$/.test(value.trim());
};

const validateMinLength = (value: string, minLength: number): boolean => {
  return value.trim().length >= minLength;
};

const validateMaxLength = (value: string, maxLength: number): boolean => {
  return value.trim().length <= maxLength;
};

// Auto-fix helper functions
interface AutoFixResult {
  original: string;
  fixed: string;
  fixType: string;
}

const autoFixValue = (value: string, fieldName: string, validation?: { type: string; pattern?: string }[]): AutoFixResult | null => {
  const original = value;
  let fixed = value;
  const fixTypes: string[] = [];

  // Always trim whitespace
  if (fixed !== fixed.trim()) {
    fixed = fixed.trim();
    fixTypes.push('Trimmed whitespace');
  }

  // Remove extra internal spaces
  if (/\s{2,}/.test(fixed)) {
    fixed = fixed.replace(/\s{2,}/g, ' ');
    fixTypes.push('Removed extra spaces');
  }

  // Check for email validation - normalize to lowercase
  const hasEmailValidation = validation?.some((v) => v.type === 'email');
  if (hasEmailValidation && fixed !== fixed.toLowerCase()) {
    fixed = fixed.toLowerCase();
    fixTypes.push('Lowercase email');
  }

  // Check for phone validation - format phone number
  const hasPhoneValidation = validation?.some((v) => v.type === 'phone');
  if (hasPhoneValidation && fixed) {
    // Remove common invalid characters but keep digits, +, -, (, ), and spaces
    const cleanedPhone = fixed.replace(/[^\d\+\-\(\)\s]/g, '');
    if (cleanedPhone !== fixed) {
      fixed = cleanedPhone;
      fixTypes.push('Cleaned phone characters');
    }
    
    // Format Indian phone numbers if it looks like one
    const digitsOnly = fixed.replace(/\D/g, '');
    if (digitsOnly.length === 10 && !fixed.startsWith('+')) {
      fixed = `+91 ${digitsOnly.slice(0, 5)} ${digitsOnly.slice(5)}`;
      fixTypes.push('Formatted as Indian phone');
    } else if (digitsOnly.length === 12 && digitsOnly.startsWith('91')) {
      fixed = `+${digitsOnly.slice(0, 2)} ${digitsOnly.slice(2, 7)} ${digitsOnly.slice(7)}`;
      fixTypes.push('Formatted phone number');
    }
  }

  // Fix common typos in email domains
  if (hasEmailValidation && fixed.includes('@')) {
    const emailFixes: Record<string, string> = {
      '@gmial.com': '@gmail.com',
      '@gmal.com': '@gmail.com',
      '@gamil.com': '@gmail.com',
      '@gmail.con': '@gmail.com',
      '@gmail.co': '@gmail.com',
      '@yahooo.com': '@yahoo.com',
      '@yaho.com': '@yahoo.com',
      '@yahoo.con': '@yahoo.com',
      '@outlok.com': '@outlook.com',
      '@outloo.com': '@outlook.com',
      '@hotmal.com': '@hotmail.com',
      '@hotmai.com': '@hotmail.com',
    };
    
    for (const [typo, correction] of Object.entries(emailFixes)) {
      if (fixed.endsWith(typo)) {
        fixed = fixed.replace(typo, correction);
        fixTypes.push('Fixed email domain typo');
        break;
      }
    }
  }

  // Remove leading/trailing special characters from names
  if (fieldName.toLowerCase().includes('name') || fieldName.toLowerCase().includes('first') || fieldName.toLowerCase().includes('last')) {
    const cleanedName = fixed.replace(/^[^a-zA-Z]+|[^a-zA-Z]+$/g, '');
    if (cleanedName !== fixed && cleanedName.length > 0) {
      fixed = cleanedName;
      fixTypes.push('Cleaned name characters');
    }
    
    // Capitalize first letter of each word in names
    const capitalized = fixed.replace(/\b\w/g, (c) => c.toUpperCase());
    if (capitalized !== fixed) {
      fixed = capitalized;
      fixTypes.push('Capitalized name');
    }
  }

  if (fixed !== original) {
    return {
      original,
      fixed,
      fixType: fixTypes.join(', '),
    };
  }

  return null;
};

export function CSVImportDialog({
  open,
  onOpenChange,
  title,
  description,
  fields,
  onImport,
  templateFileName,
  duplicateCheckFields = [],
  existingData = [],
}: CSVImportDialogProps) {
  const [step, setStep] = useState<ImportStep>('upload');
  const [file, setFile] = useState<File | null>(null);
  const [csvHeaders, setCsvHeaders] = useState<string[]>([]);
  const [csvData, setCsvData] = useState<string[][]>([]);
  const [fieldMappings, setFieldMappings] = useState<Record<string, string>>({});
  const [importProgress, setImportProgress] = useState(0);
  const [importResults, setImportResults] = useState({ success: 0, failed: 0, errors: [] as string[] });
  const [dragActive, setDragActive] = useState(false);
  const [rowValidations, setRowValidations] = useState<RowValidation[]>([]);
  const [validationSummary, setValidationSummary] = useState({ valid: 0, invalid: 0, duplicates: 0 });
  const [autoFixApplied, setAutoFixApplied] = useState(false);
  const [autoFixSummary, setAutoFixSummary] = useState<{ field: string; count: number; fixes: string[] }[]>([]);

  const parseCSV = (text: string): { headers: string[]; data: string[][] } => {
    const lines = text.split('\n').filter((line) => line.trim() !== '');
    if (lines.length === 0) return { headers: [], data: [] };

    const parseRow = (row: string): string[] => {
      const result: string[] = [];
      let current = '';
      let inQuotes = false;

      for (let i = 0; i < row.length; i++) {
        const char = row[i];
        if (char === '"') {
          inQuotes = !inQuotes;
        } else if (char === ',' && !inQuotes) {
          result.push(current.trim());
          current = '';
        } else {
          current += char;
        }
      }
      result.push(current.trim());
      return result;
    };

    const headers = parseRow(lines[0]);
    const data = lines.slice(1).map(parseRow);

    return { headers, data };
  };

  const handleFile = useCallback((file: File) => {
    setFile(file);
    const reader = new FileReader();
    reader.onload = (e) => {
      const text = e.target?.result as string;
      const { headers, data } = parseCSV(text);
      setCsvHeaders(headers);
      setCsvData(data);

      // Auto-map fields based on header names
      const autoMappings: Record<string, string> = {};
      fields.forEach((field) => {
        const matchingHeader = headers.find(
          (h) =>
            h.toLowerCase().replace(/[_\s]/g, '') ===
            field.name.toLowerCase().replace(/[_\s]/g, '')
        );
        if (matchingHeader) {
          autoMappings[field.name] = matchingHeader;
        }
      });
      setFieldMappings(autoMappings);
      setStep('mapping');
    };
    reader.readAsText(file);
  }, [fields]);

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      e.stopPropagation();
      setDragActive(false);
      if (e.dataTransfer.files && e.dataTransfer.files[0]) {
        handleFile(e.dataTransfer.files[0]);
      }
    },
    [handleFile]
  );

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleFile(e.target.files[0]);
    }
  };

  const getMappedData = (): Record<string, string>[] => {
    return csvData.map((row) => {
      const mappedRow: Record<string, string> = {};
      fields.forEach((field) => {
        const csvColumn = fieldMappings[field.name];
        if (csvColumn) {
          const columnIndex = csvHeaders.indexOf(csvColumn);
          mappedRow[field.name] = columnIndex >= 0 ? row[columnIndex] || '' : '';
        } else {
          mappedRow[field.name] = '';
        }
      });
      return mappedRow;
    });
  };

  const validateMappings = (): boolean => {
    return fields
      .filter((f) => f.required)
      .every((f) => fieldMappings[f.name] && fieldMappings[f.name] !== '');
  };

  const validateRow = (row: Record<string, string>, rowIndex: number, allRows: Record<string, string>[]): RowValidation => {
    const errors: { field: string; message: string }[] = [];
    let isDuplicate = false;
    let duplicateOf: number | undefined;

    // Validate each field based on its validation rules
    fields.forEach((field) => {
      const value = row[field.name] || '';
      
      // Check required
      if (field.required && !value.trim()) {
        errors.push({ field: field.name, message: `${field.label} is required` });
      }

      // Check validation rules
      if (field.validation && value.trim()) {
        field.validation.forEach((rule) => {
          switch (rule.type) {
            case 'email':
              if (!validateEmail(value)) {
                errors.push({ field: field.name, message: rule.message || 'Invalid email format' });
              }
              break;
            case 'phone':
              if (!validatePhone(value)) {
                errors.push({ field: field.name, message: rule.message || 'Invalid phone format' });
              }
              break;
            case 'regex':
              if (rule.pattern && !validateRegex(value, rule.pattern)) {
                errors.push({ field: field.name, message: rule.message || 'Invalid format' });
              }
              break;
            case 'numeric':
              if (!validateNumeric(value)) {
                errors.push({ field: field.name, message: rule.message || 'Must be a number' });
              }
              break;
            case 'alphanumeric':
              if (!validateAlphanumeric(value)) {
                errors.push({ field: field.name, message: rule.message || 'Must be alphanumeric' });
              }
              break;
            case 'minLength':
              if (rule.value !== undefined && !validateMinLength(value, rule.value)) {
                errors.push({ field: field.name, message: rule.message || `Minimum ${rule.value} characters` });
              }
              break;
            case 'maxLength':
              if (rule.value !== undefined && !validateMaxLength(value, rule.value)) {
                errors.push({ field: field.name, message: rule.message || `Maximum ${rule.value} characters` });
              }
              break;
          }
        });
      }
    });

    // Check for duplicates within the import file
    if (duplicateCheckFields.length > 0) {
      for (let i = 0; i < rowIndex; i++) {
        const prevRow = allRows[i];
        const isDup = duplicateCheckFields.every((field) => {
          const currentVal = (row[field] || '').toLowerCase().trim();
          const prevVal = (prevRow[field] || '').toLowerCase().trim();
          return currentVal && prevVal && currentVal === prevVal;
        });
        if (isDup) {
          isDuplicate = true;
          duplicateOf = i + 2; // +2 for header row and 1-based index
          break;
        }
      }
    }

    // Check for duplicates against existing data
    if (!isDuplicate && duplicateCheckFields.length > 0 && existingData.length > 0) {
      const existingDup = existingData.find((existing) =>
        duplicateCheckFields.every((field) => {
          const currentVal = (row[field] || '').toLowerCase().trim();
          const existingVal = (existing[field] || '').toLowerCase().trim();
          return currentVal && existingVal && currentVal === existingVal;
        })
      );
      if (existingDup) {
        isDuplicate = true;
        duplicateOf = -1; // Indicates existing data duplicate
      }
    }

    return { rowIndex, errors, isDuplicate, duplicateOf };
  };

  const validateAllRows = useCallback(() => {
    const data = getMappedData();
    const validations = data.map((row, index) => validateRow(row, index, data));
    
    const valid = validations.filter((v) => v.errors.length === 0 && !v.isDuplicate).length;
    const invalid = validations.filter((v) => v.errors.length > 0).length;
    const duplicates = validations.filter((v) => v.isDuplicate).length;

    setRowValidations(validations);
    setValidationSummary({ valid, invalid, duplicates });
  }, [csvData, fieldMappings, fields, duplicateCheckFields, existingData]);

  const handleImport = async () => {
    setStep('importing');
    const data = getMappedData();
    const total = data.length;
    let success = 0;
    let failed = 0;
    const errors: string[] = [];

    for (let i = 0; i < data.length; i++) {
      await new Promise((resolve) => setTimeout(resolve, 30));

      const validation = rowValidations[i];
      
      if (validation?.errors.length > 0) {
        failed++;
        const errorMessages = validation.errors.map((e) => e.message).join(', ');
        errors.push(`Row ${i + 2}: ${errorMessages}`);
      } else if (validation?.isDuplicate) {
        failed++;
        const dupText = validation.duplicateOf === -1 
          ? 'Duplicate of existing record' 
          : `Duplicate of row ${validation.duplicateOf}`;
        errors.push(`Row ${i + 2}: ${dupText}`);
      } else {
        success++;
      }

      setImportProgress(Math.round(((i + 1) / total) * 100));
    }

    setImportResults({ success, failed, errors });
    
    // Only import valid, non-duplicate rows
    const validData = data.filter((_, index) => {
      const validation = rowValidations[index];
      return validation && validation.errors.length === 0 && !validation.isDuplicate;
    });
    
    if (validData.length > 0) {
      onImport(validData);
    }
    
    setStep('complete');
  };

  const downloadTemplate = () => {
    const headers = fields.map((f) => f.name).join(',');
    const exampleRow = fields.map((f) => `Example ${f.label}`).join(',');
    const csvContent = `${headers}\n${exampleRow}`;
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = templateFileName;
    a.click();
    URL.revokeObjectURL(url);
  };

  const resetDialog = () => {
    setStep('upload');
    setFile(null);
    setCsvHeaders([]);
    setCsvData([]);
    setFieldMappings({});
    setImportProgress(0);
    setImportResults({ success: 0, failed: 0, errors: [] });
    setRowValidations([]);
    setValidationSummary({ valid: 0, invalid: 0, duplicates: 0 });
    setAutoFixApplied(false);
    setAutoFixSummary([]);
  };

  // Auto-fix all data
  const applyAutoFix = useCallback(() => {
    const fixSummary: Map<string, { count: number; fixes: Set<string> }> = new Map();
    
    const newCsvData = csvData.map((row) => {
      const newRow = [...row];
      
      fields.forEach((field) => {
        const csvColumn = fieldMappings[field.name];
        if (csvColumn) {
          const columnIndex = csvHeaders.indexOf(csvColumn);
          if (columnIndex >= 0) {
            const originalValue = row[columnIndex] || '';
            const fixResult = autoFixValue(originalValue, field.name, field.validation);
            
            if (fixResult) {
              newRow[columnIndex] = fixResult.fixed;
              
              // Track fix summary
              if (!fixSummary.has(field.name)) {
                fixSummary.set(field.name, { count: 0, fixes: new Set() });
              }
              const summary = fixSummary.get(field.name)!;
              summary.count++;
              fixResult.fixType.split(', ').forEach((f) => summary.fixes.add(f));
            }
          }
        }
      });
      
      return newRow;
    });
    
    setCsvData(newCsvData);
    setAutoFixApplied(true);
    setAutoFixSummary(
      Array.from(fixSummary.entries()).map(([field, data]) => ({
        field,
        count: data.count,
        fixes: Array.from(data.fixes),
      }))
    );
    
    // Re-validate after fix
    setTimeout(() => validateAllRows(), 0);
  }, [csvData, csvHeaders, fieldMappings, fields, validateAllRows]);

  // Helper to get validation type icon and description
  const getValidationInfo = (rule: { type: string; pattern?: string; value?: number; message: string }) => {
    switch (rule.type) {
      case 'email':
        return { icon: AtSign, label: 'Email', example: 'name@company.com' };
      case 'phone':
        return { icon: PhoneIcon, label: 'Phone', example: '+91 98765 43210' };
      case 'numeric':
        return { icon: Hash, label: 'Numeric', example: '123, 45.67' };
      case 'alphanumeric':
        return { icon: Type, label: 'Alphanumeric', example: 'ABC123' };
      case 'minLength':
        return { icon: Ruler, label: `Min ${rule.value} chars`, example: `At least ${rule.value} characters` };
      case 'maxLength':
        return { icon: Ruler, label: `Max ${rule.value} chars`, example: `Up to ${rule.value} characters` };
      case 'regex':
        return { icon: Code, label: 'Pattern', example: rule.message };
      default:
        return { icon: Info, label: rule.type, example: rule.message };
    }
  };

  // Check if any field has validation rules
  const hasValidationRules = fields.some((f) => f.validation && f.validation.length > 0);
  const fieldsWithValidation = fields.filter((f) => f.validation && f.validation.length > 0);

  // Generate error report for download
  const generateErrorReport = (): string => {
    const timestamp = format(new Date(), 'yyyy-MM-dd HH:mm:ss');
    const mappedData = getMappedData();
    
    let report = `IMPORT VALIDATION ERROR REPORT\n`;
    report += `${'='.repeat(60)}\n\n`;
    report += `Generated: ${timestamp}\n`;
    report += `File: ${file?.name || 'Unknown'}\n`;
    report += `Total Rows: ${csvData.length}\n`;
    report += `Successfully Imported: ${importResults.success}\n`;
    report += `Failed: ${importResults.failed}\n\n`;
    
    report += `SUMMARY\n`;
    report += `${'-'.repeat(40)}\n`;
    report += `Valid rows: ${validationSummary.valid}\n`;
    report += `Invalid rows: ${validationSummary.invalid}\n`;
    report += `Duplicates: ${validationSummary.duplicates}\n\n`;
    
    if (duplicateCheckFields.length > 0) {
      report += `DUPLICATE DETECTION\n`;
      report += `${'-'.repeat(40)}\n`;
      report += `Checked fields: ${duplicateCheckFields.join(', ')}\n\n`;
    }
    
    report += `VALIDATION RULES APPLIED\n`;
    report += `${'-'.repeat(40)}\n`;
    fields.forEach((field) => {
      report += `\n${field.label}${field.required ? ' (Required)' : ''}:\n`;
      if (field.validation && field.validation.length > 0) {
        field.validation.forEach((rule) => {
          report += `  - ${rule.type}: ${rule.message}\n`;
          if (rule.pattern) {
            report += `    Pattern: ${rule.pattern}\n`;
          }
        });
      } else {
        report += `  - No validation rules\n`;
      }
    });
    
    report += `\n\nDETAILED ERRORS\n`;
    report += `${'='.repeat(60)}\n\n`;
    
    rowValidations.forEach((validation, index) => {
      if (validation.errors.length > 0 || validation.isDuplicate) {
        const rowData = mappedData[index];
        report += `ROW ${index + 2}\n`;
        report += `${'-'.repeat(40)}\n`;
        
        // Show row data
        report += `Data:\n`;
        fields.forEach((field) => {
          const value = rowData[field.name] || '(empty)';
          report += `  ${field.label}: ${value}\n`;
        });
        
        // Show errors
        if (validation.errors.length > 0) {
          report += `\nValidation Errors:\n`;
          validation.errors.forEach((error) => {
            report += `  ✗ ${error.message}\n`;
          });
        }
        
        // Show duplicate info
        if (validation.isDuplicate) {
          const dupText = validation.duplicateOf === -1 
            ? 'Duplicate of existing record in database' 
            : `Duplicate of row ${validation.duplicateOf}`;
          report += `\nDuplicate Status:\n`;
          report += `  ⚠ ${dupText}\n`;
        }
        
        report += `\n`;
      }
    });
    
    if (importResults.failed === 0) {
      report += `No errors found. All rows imported successfully.\n`;
    }
    
    report += `\n${'='.repeat(60)}\n`;
    report += `END OF REPORT\n`;
    
    return report;
  };

  const downloadErrorReport = () => {
    const report = generateErrorReport();
    const blob = new Blob([report], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `import-error-report-${format(new Date(), 'yyyy-MM-dd-HHmmss')}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const downloadErrorReportCSV = () => {
    const mappedData = getMappedData();
    const headers = ['Row Number', 'Status', 'Error Details', ...fields.map((f) => f.label)];
    
    const rows = rowValidations
      .map((validation, index) => {
        if (validation.errors.length === 0 && !validation.isDuplicate) return null;
        
        const rowData = mappedData[index];
        const status = validation.isDuplicate 
          ? 'Duplicate' 
          : validation.errors.length > 0 
            ? 'Invalid' 
            : 'Valid';
        
        const errorDetails = [
          ...validation.errors.map((e) => e.message),
          validation.isDuplicate 
            ? (validation.duplicateOf === -1 ? 'Duplicate of existing record' : `Duplicate of row ${validation.duplicateOf}`)
            : ''
        ].filter(Boolean).join('; ');
        
        const fieldValues = fields.map((field) => {
          const value = rowData[field.name] || '';
          // Escape quotes and wrap in quotes for CSV
          return `"${value.replace(/"/g, '""')}"`;
        });
        
        return [index + 2, status, `"${errorDetails}"`, ...fieldValues].join(',');
      })
      .filter(Boolean);
    
    const csvContent = [headers.join(','), ...rows].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `import-errors-${format(new Date(), 'yyyy-MM-dd-HHmmss')}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handlePreview = () => {
    setStep('preview');
    // Run validation when entering preview
    setTimeout(() => validateAllRows(), 0);
  };

  const handleClose = () => {
    resetDialog();
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-hidden flex flex-col">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <FileSpreadsheet className="h-5 w-5 text-primary" />
            {title}
          </DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>

        {/* Step indicator */}
        <div className="flex items-center justify-center gap-2 py-4">
          {['upload', 'mapping', 'preview', 'complete'].map((s, i) => (
            <div key={s} className="flex items-center">
              <div
                className={cn(
                  'h-8 w-8 rounded-full flex items-center justify-center text-sm font-medium',
                  step === s || ['mapping', 'preview', 'importing', 'complete'].indexOf(step) > i
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-muted text-muted-foreground'
                )}
              >
                {i + 1}
              </div>
              {i < 3 && (
                <div
                  className={cn(
                    'w-12 h-0.5 mx-1',
                    ['mapping', 'preview', 'importing', 'complete'].indexOf(step) > i
                      ? 'bg-primary'
                      : 'bg-muted'
                  )}
                />
              )}
            </div>
          ))}
        </div>

        <div className="flex-1 overflow-hidden">
          {/* Upload Step */}
          {step === 'upload' && (
            <div className="space-y-4">
              <div
                className={cn(
                  'border-2 border-dashed rounded-lg p-8 text-center transition-colors',
                  dragActive ? 'border-primary bg-primary/5' : 'border-border'
                )}
                onDragEnter={handleDrag}
                onDragLeave={handleDrag}
                onDragOver={handleDrag}
                onDrop={handleDrop}
              >
                <Upload className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <p className="text-lg font-medium mb-2">Drop your CSV file here</p>
                <p className="text-sm text-muted-foreground mb-4">or click to browse</p>
                <Input
                  type="file"
                  accept=".csv"
                  onChange={handleFileInput}
                  className="hidden"
                  id="csv-upload"
                />
                <Label htmlFor="csv-upload">
                  <Button variant="outline" asChild>
                    <span>Browse Files</span>
                  </Button>
                </Label>
              </div>

              <div className="flex items-center justify-center">
                <Button variant="ghost" onClick={downloadTemplate} className="text-primary">
                  <Download className="h-4 w-4 mr-2" />
                  Download CSV Template
                </Button>
              </div>

              {/* Validation Rules Documentation Panel */}
              {hasValidationRules && (
                <Collapsible defaultOpen={false} className="border rounded-lg">
                  <CollapsibleTrigger asChild>
                    <Button 
                      variant="ghost" 
                      className="w-full flex items-center justify-between p-4 hover:bg-muted/50"
                    >
                      <div className="flex items-center gap-2">
                        <Info className="h-4 w-4 text-primary" />
                        <span className="font-medium">Field Validation Rules</span>
                        <Badge variant="secondary" className="ml-2">
                          {fieldsWithValidation.length} fields
                        </Badge>
                      </div>
                      <HelpCircle className="h-4 w-4 text-muted-foreground" />
                    </Button>
                  </CollapsibleTrigger>
                  <CollapsibleContent>
                    <div className="px-4 pb-4">
                      <ScrollArea className="h-[200px]">
                        <div className="space-y-3">
                          {fieldsWithValidation.map((field) => (
                            <div 
                              key={field.name} 
                              className="p-3 rounded-lg bg-muted/30 border border-border/50"
                            >
                              <div className="flex items-center gap-2 mb-2">
                                <span className="font-medium text-sm">{field.label}</span>
                                {field.required && (
                                  <Badge variant="destructive" className="text-xs px-1.5 py-0">
                                    Required
                                  </Badge>
                                )}
                              </div>
                              <div className="space-y-1.5">
                                {field.validation?.map((rule, idx) => {
                                  const info = getValidationInfo(rule);
                                  const IconComponent = info.icon;
                                  return (
                                    <div 
                                      key={idx} 
                                      className="flex items-start gap-2 text-xs"
                                    >
                                      <TooltipProvider>
                                        <Tooltip>
                                          <TooltipTrigger asChild>
                                            <div className="flex items-center gap-1.5 px-2 py-1 rounded bg-background border">
                                              <IconComponent className="h-3 w-3 text-primary" />
                                              <span className="text-muted-foreground">{info.label}</span>
                                            </div>
                                          </TooltipTrigger>
                                          <TooltipContent side="right" className="max-w-[250px]">
                                            <p className="text-xs">{rule.message}</p>
                                            {rule.pattern && (
                                              <code className="block mt-1 text-[10px] bg-muted p-1 rounded">
                                                {rule.pattern}
                                              </code>
                                            )}
                                          </TooltipContent>
                                        </Tooltip>
                                      </TooltipProvider>
                                      <span className="text-muted-foreground flex-1">
                                        Example: <code className="bg-muted px-1 rounded">{info.example}</code>
                                      </span>
                                    </div>
                                  );
                                })}
                              </div>
                            </div>
                          ))}
                        </div>
                      </ScrollArea>
                      
                      {/* Duplicate detection info */}
                      {duplicateCheckFields.length > 0 && (
                        <div className="mt-3 p-3 rounded-lg bg-amber-500/10 border border-amber-200">
                          <div className="flex items-center gap-2 text-sm">
                            <AlertTriangle className="h-4 w-4 text-amber-500" />
                            <span className="font-medium text-amber-700">Duplicate Detection</span>
                          </div>
                          <p className="text-xs text-amber-600 mt-1">
                            Duplicates will be detected based on: {' '}
                            <strong>{duplicateCheckFields.join(', ')}</strong>
                          </p>
                        </div>
                      )}
                    </div>
                  </CollapsibleContent>
                </Collapsible>
              )}
            </div>
          )}

          {/* Mapping Step */}
          {step === 'mapping' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                <div>
                  <p className="font-medium">{file?.name}</p>
                  <p className="text-sm text-muted-foreground">
                    {csvData.length} rows found
                  </p>
                </div>
                <Badge variant="outline">{csvHeaders.length} columns</Badge>
              </div>

              <ScrollArea className="h-[300px]">
                <div className="space-y-3">
                  {fields.map((field) => (
                    <div key={field.name} className="flex items-center gap-4">
                      <div className="w-1/3">
                        <Label className="flex items-center gap-1">
                          {field.label}
                          {field.required && <span className="text-destructive">*</span>}
                        </Label>
                      </div>
                      <ArrowRight className="h-4 w-4 text-muted-foreground" />
                      <div className="flex-1">
                        <Select
                          value={fieldMappings[field.name] || ''}
                          onValueChange={(value) =>
                            setFieldMappings((prev) => ({ ...prev, [field.name]: value }))
                          }
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select CSV column" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="">-- Skip --</SelectItem>
                            {csvHeaders.map((header) => (
                              <SelectItem key={header} value={header}>
                                {header}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  ))}
                </div>
              </ScrollArea>

              {!validateMappings() && (
                <Alert variant="destructive">
                  <AlertTriangle className="h-4 w-4" />
                  <AlertDescription>
                    Please map all required fields before continuing.
                  </AlertDescription>
                </Alert>
              )}
            </div>
          )}

          {/* Preview Step */}
          {step === 'preview' && (
            <div className="space-y-4">
              {/* Auto-fix Panel */}
              {!autoFixApplied && validationSummary.invalid > 0 && (
                <div className="p-4 border rounded-lg bg-gradient-to-r from-primary/5 to-accent/5 border-primary/20">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex items-start gap-3">
                      <div className="p-2 rounded-lg bg-primary/10">
                        <Wand2 className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <p className="font-medium text-sm">Auto-Fix Available</p>
                        <p className="text-xs text-muted-foreground mt-0.5">
                          Automatically fix common issues like whitespace, phone formatting, email typos, and name capitalization.
                        </p>
                      </div>
                    </div>
                    <Button 
                      size="sm" 
                      onClick={applyAutoFix}
                      className="shrink-0"
                    >
                      <Sparkles className="h-4 w-4 mr-2" />
                      Auto-Fix All
                    </Button>
                  </div>
                </div>
              )}

              {/* Auto-fix Applied Summary */}
              {autoFixApplied && autoFixSummary.length > 0 && (
                <div className="p-4 border rounded-lg bg-emerald-500/5 border-emerald-200">
                  <div className="flex items-center gap-2 mb-2">
                    <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                    <span className="font-medium text-sm text-emerald-700">Auto-Fix Applied</span>
                  </div>
                  <div className="space-y-1">
                    {autoFixSummary.map((item) => (
                      <div key={item.field} className="flex items-center gap-2 text-xs">
                        <Badge variant="secondary" className="text-xs">
                          {fields.find((f) => f.name === item.field)?.label || item.field}
                        </Badge>
                        <span className="text-muted-foreground">
                          {item.count} values fixed: {item.fixes.join(', ')}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {autoFixApplied && autoFixSummary.length === 0 && (
                <div className="p-3 border rounded-lg bg-muted/50 text-center">
                  <p className="text-sm text-muted-foreground">
                    No auto-fixable issues found in your data.
                  </p>
                </div>
              )}

              {/* Validation Summary */}
              <div className="grid grid-cols-3 gap-3">
                <div className="p-3 bg-emerald-500/10 rounded-lg text-center">
                  <div className="flex items-center justify-center gap-1">
                    <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                    <span className="text-lg font-bold text-emerald-500">{validationSummary.valid}</span>
                  </div>
                  <p className="text-xs text-muted-foreground">Valid rows</p>
                </div>
                <div className="p-3 bg-destructive/10 rounded-lg text-center">
                  <div className="flex items-center justify-center gap-1">
                    <XCircle className="h-4 w-4 text-destructive" />
                    <span className="text-lg font-bold text-destructive">{validationSummary.invalid}</span>
                  </div>
                  <p className="text-xs text-muted-foreground">Invalid rows</p>
                </div>
                <div className="p-3 bg-amber-500/10 rounded-lg text-center">
                  <div className="flex items-center justify-center gap-1">
                    <AlertTriangle className="h-4 w-4 text-amber-500" />
                    <span className="text-lg font-bold text-amber-500">{validationSummary.duplicates}</span>
                  </div>
                  <p className="text-xs text-muted-foreground">Duplicates</p>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <p className="text-sm text-muted-foreground">
                  Showing first 10 rows with validation status
                </p>
                <Badge variant="outline">{csvData.length} total rows</Badge>
              </div>

              <ScrollArea className="h-[200px] border rounded-lg">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-[80px]">Status</TableHead>
                      {fields.map((field) => (
                        <TableHead key={field.name}>{field.label}</TableHead>
                      ))}
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {getMappedData()
                      .slice(0, 10)
                      .map((row, i) => {
                        const validation = rowValidations[i];
                        const hasErrors = validation?.errors.length > 0;
                        const isDuplicate = validation?.isDuplicate;
                        const isValid = !hasErrors && !isDuplicate;

                        return (
                          <TableRow 
                            key={i} 
                            className={cn(
                              hasErrors && 'bg-destructive/5',
                              isDuplicate && !hasErrors && 'bg-amber-500/5'
                            )}
                          >
                            <TableCell>
                              {isValid && (
                                <Badge variant="outline" className="bg-emerald-500/10 text-emerald-600 border-emerald-200">
                                  <CheckCircle2 className="h-3 w-3 mr-1" />
                                  Valid
                                </Badge>
                              )}
                              {hasErrors && (
                                <Badge variant="destructive" className="text-xs">
                                  <XCircle className="h-3 w-3 mr-1" />
                                  Error
                                </Badge>
                              )}
                              {isDuplicate && !hasErrors && (
                                <Badge variant="outline" className="bg-amber-500/10 text-amber-600 border-amber-200">
                                  <AlertTriangle className="h-3 w-3 mr-1" />
                                  Duplicate
                                </Badge>
                              )}
                            </TableCell>
                            {fields.map((field) => {
                              const fieldError = validation?.errors.find((e) => e.field === field.name);
                              return (
                                <TableCell 
                                  key={field.name} 
                                  className={cn(
                                    'max-w-[180px] truncate',
                                    fieldError && 'text-destructive'
                                  )}
                                  title={fieldError?.message}
                                >
                                  <div className="flex items-center gap-1">
                                    {row[field.name] || '-'}
                                    {fieldError && (
                                      <span className="text-destructive text-xs">*</span>
                                    )}
                                  </div>
                                </TableCell>
                              );
                            })}
                          </TableRow>
                        );
                      })}
                  </TableBody>
                </Table>
              </ScrollArea>

              {/* Validation errors summary */}
              {validationSummary.invalid > 0 && (
                <Alert variant="destructive">
                  <XCircle className="h-4 w-4" />
                  <AlertDescription>
                    {validationSummary.invalid} row(s) have validation errors and will be skipped during import.
                  </AlertDescription>
                </Alert>
              )}
              {validationSummary.duplicates > 0 && (
                <Alert className="border-amber-200 bg-amber-50 text-amber-800">
                  <AlertTriangle className="h-4 w-4 text-amber-500" />
                  <AlertDescription className="text-amber-700">
                    {validationSummary.duplicates} duplicate row(s) detected and will be skipped during import.
                  </AlertDescription>
                </Alert>
              )}
            </div>
          )}

          {/* Importing Step */}
          {step === 'importing' && (
            <div className="space-y-6 py-8">
              <div className="text-center">
                <Loader2 className="h-12 w-12 mx-auto text-primary animate-spin mb-4" />
                <p className="text-lg font-medium">Importing data...</p>
                <p className="text-sm text-muted-foreground">Please wait while we process your file</p>
              </div>
              <Progress value={importProgress} className="h-2" />
              <p className="text-center text-sm text-muted-foreground">{importProgress}% complete</p>
            </div>
          )}

          {/* Complete Step */}
          {step === 'complete' && (
            <div className="space-y-6 py-4">
              <div className="text-center">
                {importResults.failed === 0 ? (
                  <CheckCircle2 className="h-16 w-16 mx-auto text-emerald-500 mb-4" />
                ) : (
                  <AlertTriangle className="h-16 w-16 mx-auto text-amber-500 mb-4" />
                )}
                <p className="text-lg font-medium">Import Complete</p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 bg-emerald-500/10 rounded-lg text-center">
                  <p className="text-2xl font-bold text-emerald-500">{importResults.success}</p>
                  <p className="text-sm text-muted-foreground">Imported successfully</p>
                </div>
                <div className="p-4 bg-destructive/10 rounded-lg text-center">
                  <p className="text-2xl font-bold text-destructive">{importResults.failed}</p>
                  <p className="text-sm text-muted-foreground">Failed to import</p>
                </div>
              </div>

              {importResults.errors.length > 0 && (
                <>
                  <ScrollArea className="h-[120px] border rounded-lg p-3">
                    <div className="space-y-2">
                      {importResults.errors.slice(0, 10).map((error, i) => (
                        <div key={i} className="flex items-start gap-2 text-sm">
                          <XCircle className="h-4 w-4 text-destructive flex-shrink-0 mt-0.5" />
                          <span className="text-muted-foreground">{error}</span>
                        </div>
                      ))}
                      {importResults.errors.length > 10 && (
                        <p className="text-sm text-muted-foreground">
                          ...and {importResults.errors.length - 10} more errors
                        </p>
                      )}
                    </div>
                  </ScrollArea>

                  {/* Download Error Report Section */}
                  <div className="p-4 border rounded-lg bg-muted/30">
                    <div className="flex items-center gap-2 mb-3">
                      <FileSpreadsheet className="h-4 w-4 text-primary" />
                      <span className="font-medium text-sm">Download Error Report</span>
                    </div>
                    <p className="text-xs text-muted-foreground mb-3">
                      Download a detailed report of all validation errors to review and fix your data before re-importing.
                    </p>
                    <div className="flex gap-2">
                      <Button 
                        variant="outline" 
                        size="sm" 
                        onClick={downloadErrorReport}
                        className="flex-1"
                      >
                        <Download className="h-4 w-4 mr-2" />
                        Text Report (.txt)
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm" 
                        onClick={downloadErrorReportCSV}
                        className="flex-1"
                      >
                        <Download className="h-4 w-4 mr-2" />
                        CSV Report (.csv)
                      </Button>
                    </div>
                  </div>
                </>
              )}

              {importResults.failed === 0 && (
                <div className="p-4 border rounded-lg bg-emerald-500/10 text-center">
                  <CheckCircle2 className="h-8 w-8 mx-auto text-emerald-500 mb-2" />
                  <p className="text-sm text-emerald-700 font-medium">
                    All {importResults.success} rows imported successfully!
                  </p>
                  <p className="text-xs text-emerald-600 mt-1">
                    No validation errors were found.
                  </p>
                </div>
              )}
            </div>
          )}
        </div>

        <DialogFooter>
          {step === 'upload' && (
            <Button variant="outline" onClick={handleClose}>
              Cancel
            </Button>
          )}
          {step === 'mapping' && (
            <>
              <Button variant="outline" onClick={() => setStep('upload')}>
                Back
              </Button>
              <Button onClick={handlePreview} disabled={!validateMappings()}>
                Validate & Preview
              </Button>
            </>
          )}
          {step === 'preview' && (
            <>
              <Button variant="outline" onClick={() => setStep('mapping')}>
                Back
              </Button>
              <Button onClick={handleImport} disabled={validationSummary.valid === 0}>
                <Upload className="h-4 w-4 mr-2" />
                Import {validationSummary.valid} Valid Rows
              </Button>
            </>
          )}
          {step === 'complete' && (
            <Button onClick={handleClose}>Done</Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
