import { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import {
  Download,
  FileSpreadsheet,
  FileText,
  CheckSquare,
  Square,
} from 'lucide-react';
import { exportToCSV, exportToExcel, ExportColumn } from '@/lib/csvExport';
import { toast } from 'sonner';

interface ExportField<T> {
  key: keyof T | string;
  label: string;
  defaultSelected?: boolean;
  formatter?: (value: any, row: T) => string;
}

interface ExportDialogProps<T> {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  data: T[];
  fields: ExportField<T>[];
  filename: string;
  title?: string;
  entityName?: string;
}

type ExportFormat = 'csv' | 'xlsx';

export function ExportDialog<T extends Record<string, any>>({
  open,
  onOpenChange,
  data,
  fields,
  filename,
  title = 'Export Data',
  entityName = 'records',
}: ExportDialogProps<T>) {
  const [selectedFields, setSelectedFields] = useState<Set<string>>(new Set());
  const [exportFormat, setExportFormat] = useState<ExportFormat>('xlsx');

  // Initialize selected fields when dialog opens
  useEffect(() => {
    if (open) {
      const defaultSelected = new Set(
        fields
          .filter((f) => f.defaultSelected !== false)
          .map((f) => f.key as string)
      );
      setSelectedFields(defaultSelected);
    }
  }, [open, fields]);

  const handleToggleField = (fieldKey: string) => {
    setSelectedFields((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(fieldKey)) {
        newSet.delete(fieldKey);
      } else {
        newSet.add(fieldKey);
      }
      return newSet;
    });
  };

  const handleSelectAll = () => {
    setSelectedFields(new Set(fields.map((f) => f.key as string)));
  };

  const handleDeselectAll = () => {
    setSelectedFields(new Set());
  };

  const handleExport = () => {
    if (selectedFields.size === 0) {
      toast.error('Please select at least one column to export');
      return;
    }

    const columns: ExportColumn<T>[] = fields
      .filter((f) => selectedFields.has(f.key as string))
      .map((f) => ({
        key: f.key,
        header: f.label,
        formatter: f.formatter,
      }));

    if (exportFormat === 'csv') {
      exportToCSV({
        data,
        columns,
        filename,
      });
    } else {
      exportToExcel({
        data,
        columns,
        filename,
        sheetName: entityName.charAt(0).toUpperCase() + entityName.slice(1),
      });
    }

    toast.success(
      `Exported ${data.length} ${entityName} to ${exportFormat.toUpperCase()}`
    );
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Download className="h-5 w-5 text-primary" />
            {title}
          </DialogTitle>
          <DialogDescription>
            Choose the format and columns to include in your export.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Export Format Selection */}
          <div className="space-y-3">
            <Label className="text-sm font-medium">Export Format</Label>
            <RadioGroup
              value={exportFormat}
              onValueChange={(value) => setExportFormat(value as ExportFormat)}
              className="grid grid-cols-2 gap-3"
            >
              <Label
                htmlFor="format-xlsx"
                className={`flex items-center gap-3 p-3 border rounded-lg cursor-pointer transition-colors ${
                  exportFormat === 'xlsx'
                    ? 'border-primary bg-primary/5'
                    : 'border-border hover:bg-muted/50'
                }`}
              >
                <RadioGroupItem value="xlsx" id="format-xlsx" />
                <div className="flex items-center gap-2">
                  <FileSpreadsheet className="h-5 w-5 text-emerald-600" />
                  <div>
                    <p className="font-medium text-sm">Excel</p>
                    <p className="text-xs text-muted-foreground">.xlsx</p>
                  </div>
                </div>
              </Label>
              <Label
                htmlFor="format-csv"
                className={`flex items-center gap-3 p-3 border rounded-lg cursor-pointer transition-colors ${
                  exportFormat === 'csv'
                    ? 'border-primary bg-primary/5'
                    : 'border-border hover:bg-muted/50'
                }`}
              >
                <RadioGroupItem value="csv" id="format-csv" />
                <div className="flex items-center gap-2">
                  <FileText className="h-5 w-5 text-blue-600" />
                  <div>
                    <p className="font-medium text-sm">CSV</p>
                    <p className="text-xs text-muted-foreground">.csv</p>
                  </div>
                </div>
              </Label>
            </RadioGroup>
          </div>

          <Separator />

          {/* Column Selection */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <Label className="text-sm font-medium">Columns to Export</Label>
              <div className="flex gap-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleSelectAll}
                  className="h-7 text-xs"
                >
                  <CheckSquare className="h-3 w-3 mr-1" />
                  All
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleDeselectAll}
                  className="h-7 text-xs"
                >
                  <Square className="h-3 w-3 mr-1" />
                  None
                </Button>
              </div>
            </div>

            <ScrollArea className="h-[200px] border rounded-lg p-3">
              <div className="space-y-2">
                {fields.map((field) => {
                  const fieldKey = String(field.key);
                  return (
                    <div
                      key={fieldKey}
                      className="flex items-center gap-3 py-1.5"
                    >
                      <Checkbox
                        id={`field-${fieldKey}`}
                        checked={selectedFields.has(fieldKey)}
                        onCheckedChange={() => handleToggleField(fieldKey)}
                      />
                      <Label
                        htmlFor={`field-${fieldKey}`}
                        className="text-sm cursor-pointer flex-1"
                      >
                        {field.label}
                      </Label>
                    </div>
                  );
                })}
              </div>
            </ScrollArea>

            <div className="flex items-center justify-between text-xs text-muted-foreground">
              <span>
                {selectedFields.size} of {fields.length} columns selected
              </span>
              <Badge variant="secondary">{data.length} {entityName}</Badge>
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button
            onClick={handleExport}
            disabled={selectedFields.size === 0}
            className="gap-2"
          >
            <Download className="h-4 w-4" />
            Export {exportFormat.toUpperCase()}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
