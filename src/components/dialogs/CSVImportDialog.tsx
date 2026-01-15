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
} from 'lucide-react';
import { cn } from '@/lib/utils';

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

              <ScrollArea className="h-[250px] border rounded-lg">
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
                <ScrollArea className="h-[150px] border rounded-lg p-3">
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
