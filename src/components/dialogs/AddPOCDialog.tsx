import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { 
  FlaskConical, 
  Plus, 
  Trash2, 
  Target, 
  Clock, 
  Zap, 
  CircleDollarSign, 
  Shield, 
  Settings2,
  Calendar,
  Users,
  DollarSign,
  AlertCircle,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { POCKPI, POCStatus } from "@/types/account";
import { useActivityLogger } from "@/hooks/useActivityLogger";

interface AddPOCDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (pocData: POCFormData) => void;
}

export interface POCFormData {
  name: string;
  opportunityId: string;
  opportunityName: string;
  accountName: string;
  status: POCStatus;
  startDate: string;
  expectedEndDate: string;
  objectives: string[];
  pocOwner: string;
  customerContact: string;
  technicalLead: string;
  estimatedCost: number;
  kpis: POCKPI[];
}

const kpiCategories = {
  accuracy: { label: 'Accuracy', icon: Target, color: 'text-blue-500', bgColor: 'bg-blue-100 dark:bg-blue-900' },
  performance: { label: 'Performance', icon: Zap, color: 'text-amber-500', bgColor: 'bg-amber-100 dark:bg-amber-900' },
  cost_saving: { label: 'Cost Saving', icon: CircleDollarSign, color: 'text-emerald-500', bgColor: 'bg-emerald-100 dark:bg-emerald-900' },
  sla_improvement: { label: 'SLA', icon: Clock, color: 'text-purple-500', bgColor: 'bg-purple-100 dark:bg-purple-900' },
  compliance: { label: 'Compliance', icon: Shield, color: 'text-red-500', bgColor: 'bg-red-100 dark:bg-red-900' },
  custom: { label: 'Custom', icon: Settings2, color: 'text-slate-500', bgColor: 'bg-slate-100 dark:bg-slate-800' },
};

const kpiTemplates = [
  { name: 'API Response Time', category: 'performance', unit: 'ms', baselineValue: 500, targetValue: 200 },
  { name: 'Data Sync Accuracy', category: 'accuracy', unit: '%', baselineValue: 85, targetValue: 99 },
  { name: 'System Uptime', category: 'sla_improvement', unit: '%', baselineValue: 95, targetValue: 99.9 },
  { name: 'Cost Reduction', category: 'cost_saving', unit: '%', baselineValue: 0, targetValue: 30 },
  { name: 'Prediction Accuracy', category: 'accuracy', unit: '%', baselineValue: 70, targetValue: 95 },
  { name: 'Report Generation Time', category: 'performance', unit: 'sec', baselineValue: 120, targetValue: 30 },
  { name: 'Security Audit Pass Rate', category: 'compliance', unit: '%', baselineValue: 0, targetValue: 100 },
  { name: 'User Adoption Rate', category: 'custom', unit: '%', baselineValue: 0, targetValue: 80 },
];

const mockOpportunities = [
  { id: 'opp_new_1', name: 'Digital Transformation Initiative', accountName: 'Acme Corp' },
  { id: 'opp_new_2', name: 'Cloud Migration Project', accountName: 'TechStart India' },
  { id: 'opp_new_3', name: 'AI Platform Implementation', accountName: 'DataFirst Ltd' },
  { id: 'opp_new_4', name: 'Security Suite Deployment', accountName: 'SecureTech Pvt Ltd' },
];

export function AddPOCDialog({ open, onOpenChange, onSave }: AddPOCDialogProps) {
  const { log } = useActivityLogger();
  const [activeTab, setActiveTab] = useState('details');
  const [formData, setFormData] = useState<POCFormData>({
    name: '',
    opportunityId: '',
    opportunityName: '',
    accountName: '',
    status: 'initiated',
    startDate: new Date().toISOString().split('T')[0],
    expectedEndDate: '',
    objectives: [''],
    pocOwner: '',
    customerContact: '',
    technicalLead: '',
    estimatedCost: 0,
    kpis: [],
  });

  const [newKPI, setNewKPI] = useState<Partial<POCKPI>>({
    name: '',
    category: 'accuracy',
    baselineValue: 0,
    targetValue: 0,
    unit: '',
    weight: 25,
  });

  const handleOpportunityChange = (oppId: string) => {
    const opp = mockOpportunities.find(o => o.id === oppId);
    if (opp) {
      setFormData(prev => ({
        ...prev,
        opportunityId: opp.id,
        opportunityName: opp.name,
        accountName: opp.accountName,
      }));
    }
  };

  const addObjective = () => {
    setFormData(prev => ({
      ...prev,
      objectives: [...prev.objectives, ''],
    }));
  };

  const updateObjective = (index: number, value: string) => {
    setFormData(prev => ({
      ...prev,
      objectives: prev.objectives.map((obj, i) => i === index ? value : obj),
    }));
  };

  const removeObjective = (index: number) => {
    setFormData(prev => ({
      ...prev,
      objectives: prev.objectives.filter((_, i) => i !== index),
    }));
  };

  const addKPI = () => {
    if (!newKPI.name || !newKPI.unit) return;
    
    const kpi: POCKPI = {
      id: `kpi_new_${Date.now()}`,
      name: newKPI.name,
      category: newKPI.category as POCKPI['category'],
      baselineValue: newKPI.baselineValue || 0,
      targetValue: newKPI.targetValue || 0,
      unit: newKPI.unit,
      weight: newKPI.weight || 25,
      achieved: false,
    };

    setFormData(prev => ({
      ...prev,
      kpis: [...prev.kpis, kpi],
    }));

    setNewKPI({
      name: '',
      category: 'accuracy',
      baselineValue: 0,
      targetValue: 0,
      unit: '',
      weight: 25,
    });
  };

  const addKPIFromTemplate = (template: typeof kpiTemplates[0]) => {
    const kpi: POCKPI = {
      id: `kpi_new_${Date.now()}`,
      name: template.name,
      category: template.category as POCKPI['category'],
      baselineValue: template.baselineValue,
      targetValue: template.targetValue,
      unit: template.unit,
      weight: 25,
      achieved: false,
    };

    setFormData(prev => ({
      ...prev,
      kpis: [...prev.kpis, kpi],
    }));
  };

  const removeKPI = (kpiId: string) => {
    setFormData(prev => ({
      ...prev,
      kpis: prev.kpis.filter(k => k.id !== kpiId),
    }));
  };

  const updateKPIWeight = (kpiId: string, weight: number) => {
    setFormData(prev => ({
      ...prev,
      kpis: prev.kpis.map(k => k.id === kpiId ? { ...k, weight } : k),
    }));
  };

  const totalWeight = formData.kpis.reduce((sum, kpi) => sum + kpi.weight, 0);

  const handleSave = () => {
    // Log activity
    log("create", "poc", formData.name, `Created POC for ${formData.accountName} with ${formData.kpis.length} KPIs`, undefined, { 
      opportunity: formData.opportunityName, 
      account: formData.accountName,
      kpiCount: formData.kpis.length 
    });

    onSave(formData);
    setFormData({
      name: '',
      opportunityId: '',
      opportunityName: '',
      accountName: '',
      status: 'initiated',
      startDate: new Date().toISOString().split('T')[0],
      expectedEndDate: '',
      objectives: [''],
      pocOwner: '',
      customerContact: '',
      technicalLead: '',
      estimatedCost: 0,
      kpis: [],
    });
    setActiveTab('details');
    onOpenChange(false);
  };

  const isValid = formData.name && formData.opportunityId && formData.expectedEndDate && formData.kpis.length > 0;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <FlaskConical className="h-5 w-5 text-primary" />
            Create New POC
          </DialogTitle>
          <DialogDescription>
            Configure a new Proof of Concept with objectives and KPI tracking
          </DialogDescription>
        </DialogHeader>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="details">Details</TabsTrigger>
            <TabsTrigger value="team">Team & Timeline</TabsTrigger>
            <TabsTrigger value="kpis">
              KPIs
              {formData.kpis.length > 0 && (
                <Badge variant="secondary" className="ml-2 h-5 px-1.5">
                  {formData.kpis.length}
                </Badge>
              )}
            </TabsTrigger>
          </TabsList>

          {/* Details Tab */}
          <TabsContent value="details" className="space-y-4 mt-4">
            <div className="grid gap-4">
              <div className="grid gap-2">
                <Label htmlFor="poc-name">POC Name *</Label>
                <Input
                  id="poc-name"
                  placeholder="e.g., Enterprise CRM Integration POC"
                  value={formData.name}
                  onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                />
              </div>

              <div className="grid gap-2">
                <Label>Linked Opportunity *</Label>
                <Select value={formData.opportunityId} onValueChange={handleOpportunityChange}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select an opportunity" />
                  </SelectTrigger>
                  <SelectContent>
                    {mockOpportunities.map(opp => (
                      <SelectItem key={opp.id} value={opp.id}>
                        <div className="flex flex-col">
                          <span>{opp.name}</span>
                          <span className="text-xs text-muted-foreground">{opp.accountName}</span>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {formData.accountName && (
                <div className="p-3 bg-muted rounded-lg">
                  <p className="text-sm text-muted-foreground">Account</p>
                  <p className="font-medium">{formData.accountName}</p>
                </div>
              )}

              <Separator />

              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <Label>Objectives</Label>
                  <Button type="button" variant="outline" size="sm" onClick={addObjective}>
                    <Plus className="h-3 w-3 mr-1" />
                    Add Objective
                  </Button>
                </div>
                {formData.objectives.map((obj, index) => (
                  <div key={index} className="flex gap-2">
                    <Input
                      placeholder={`Objective ${index + 1}`}
                      value={obj}
                      onChange={(e) => updateObjective(index, e.target.value)}
                    />
                    {formData.objectives.length > 1 && (
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        onClick={() => removeObjective(index)}
                      >
                        <Trash2 className="h-4 w-4 text-destructive" />
                      </Button>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </TabsContent>

          {/* Team & Timeline Tab */}
          <TabsContent value="team" className="space-y-4 mt-4">
            <div className="grid gap-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="start-date">Start Date *</Label>
                  <Input
                    id="start-date"
                    type="date"
                    value={formData.startDate}
                    onChange={(e) => setFormData(prev => ({ ...prev, startDate: e.target.value }))}
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="end-date">Expected End Date *</Label>
                  <Input
                    id="end-date"
                    type="date"
                    value={formData.expectedEndDate}
                    onChange={(e) => setFormData(prev => ({ ...prev, expectedEndDate: e.target.value }))}
                  />
                </div>
              </div>

              <Separator />

              <div className="grid gap-2">
                <Label htmlFor="poc-owner">POC Owner</Label>
                <Input
                  id="poc-owner"
                  placeholder="Internal owner name"
                  value={formData.pocOwner}
                  onChange={(e) => setFormData(prev => ({ ...prev, pocOwner: e.target.value }))}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="customer-contact">Customer Contact</Label>
                  <Input
                    id="customer-contact"
                    placeholder="Customer POC contact"
                    value={formData.customerContact}
                    onChange={(e) => setFormData(prev => ({ ...prev, customerContact: e.target.value }))}
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="tech-lead">Technical Lead</Label>
                  <Input
                    id="tech-lead"
                    placeholder="Technical lead name"
                    value={formData.technicalLead}
                    onChange={(e) => setFormData(prev => ({ ...prev, technicalLead: e.target.value }))}
                  />
                </div>
              </div>

              <Separator />

              <div className="grid gap-2">
                <Label htmlFor="estimated-cost">Estimated Cost (₹)</Label>
                <Input
                  id="estimated-cost"
                  type="number"
                  placeholder="0"
                  value={formData.estimatedCost || ''}
                  onChange={(e) => setFormData(prev => ({ ...prev, estimatedCost: parseInt(e.target.value) || 0 }))}
                />
              </div>
            </div>
          </TabsContent>

          {/* KPIs Tab */}
          <TabsContent value="kpis" className="space-y-4 mt-4">
            {/* Quick Add Templates */}
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Quick Add from Templates</CardTitle>
                <CardDescription className="text-xs">
                  Click to add common KPI templates
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {kpiTemplates.map((template, index) => {
                    const category = kpiCategories[template.category as keyof typeof kpiCategories];
                    const CategoryIcon = category.icon;
                    const isAdded = formData.kpis.some(k => k.name === template.name);
                    
                    return (
                      <Button
                        key={index}
                        type="button"
                        variant="outline"
                        size="sm"
                        disabled={isAdded}
                        onClick={() => addKPIFromTemplate(template)}
                        className={cn(isAdded && "opacity-50")}
                      >
                        <CategoryIcon className={cn("h-3 w-3 mr-1", category.color)} />
                        {template.name}
                      </Button>
                    );
                  })}
                </div>
              </CardContent>
            </Card>

            {/* Custom KPI Input */}
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Add Custom KPI</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="grid grid-cols-2 gap-3">
                  <div className="grid gap-1.5">
                    <Label className="text-xs">KPI Name</Label>
                    <Input
                      placeholder="e.g., Response Time"
                      value={newKPI.name}
                      onChange={(e) => setNewKPI(prev => ({ ...prev, name: e.target.value }))}
                    />
                  </div>
                  <div className="grid gap-1.5">
                    <Label className="text-xs">Category</Label>
                    <Select
                      value={newKPI.category}
                      onValueChange={(val) => setNewKPI(prev => ({ ...prev, category: val as POCKPI['category'] }))}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {Object.entries(kpiCategories).map(([key, config]) => (
                          <SelectItem key={key} value={key}>
                            <div className="flex items-center gap-2">
                              <config.icon className={cn("h-3 w-3", config.color)} />
                              {config.label}
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="grid grid-cols-4 gap-3">
                  <div className="grid gap-1.5">
                    <Label className="text-xs">Baseline</Label>
                    <Input
                      type="number"
                      placeholder="0"
                      value={newKPI.baselineValue || ''}
                      onChange={(e) => setNewKPI(prev => ({ ...prev, baselineValue: parseFloat(e.target.value) || 0 }))}
                    />
                  </div>
                  <div className="grid gap-1.5">
                    <Label className="text-xs">Target</Label>
                    <Input
                      type="number"
                      placeholder="0"
                      value={newKPI.targetValue || ''}
                      onChange={(e) => setNewKPI(prev => ({ ...prev, targetValue: parseFloat(e.target.value) || 0 }))}
                    />
                  </div>
                  <div className="grid gap-1.5">
                    <Label className="text-xs">Unit</Label>
                    <Input
                      placeholder="e.g., ms, %"
                      value={newKPI.unit}
                      onChange={(e) => setNewKPI(prev => ({ ...prev, unit: e.target.value }))}
                    />
                  </div>
                  <div className="grid gap-1.5">
                    <Label className="text-xs">Weight %</Label>
                    <Input
                      type="number"
                      placeholder="25"
                      value={newKPI.weight || ''}
                      onChange={(e) => setNewKPI(prev => ({ ...prev, weight: parseInt(e.target.value) || 0 }))}
                    />
                  </div>
                </div>

                <Button
                  type="button"
                  variant="secondary"
                  size="sm"
                  onClick={addKPI}
                  disabled={!newKPI.name || !newKPI.unit}
                  className="w-full"
                >
                  <Plus className="h-3 w-3 mr-1" />
                  Add KPI
                </Button>
              </CardContent>
            </Card>

            {/* Added KPIs */}
            {formData.kpis.length > 0 && (
              <Card>
                <CardHeader className="pb-2">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-sm font-medium">
                      Configured KPIs ({formData.kpis.length})
                    </CardTitle>
                    <Badge variant={totalWeight === 100 ? "default" : "destructive"}>
                      Weight: {totalWeight}%
                    </Badge>
                  </div>
                  {totalWeight !== 100 && (
                    <p className="text-xs text-destructive flex items-center gap-1">
                      <AlertCircle className="h-3 w-3" />
                      Total weight should equal 100%
                    </p>
                  )}
                </CardHeader>
                <CardContent className="space-y-2">
                  {formData.kpis.map((kpi) => {
                    const category = kpiCategories[kpi.category];
                    const CategoryIcon = category.icon;
                    
                    return (
                      <div
                        key={kpi.id}
                        className="flex items-center justify-between p-3 rounded-lg border bg-card"
                      >
                        <div className="flex items-center gap-3">
                          <div className={cn("p-1.5 rounded", category.bgColor)}>
                            <CategoryIcon className={cn("h-4 w-4", category.color)} />
                          </div>
                          <div>
                            <p className="font-medium text-sm">{kpi.name}</p>
                            <p className="text-xs text-muted-foreground">
                              {kpi.baselineValue} → {kpi.targetValue} {kpi.unit}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="flex items-center gap-1">
                            <Input
                              type="number"
                              className="w-16 h-8 text-center text-sm"
                              value={kpi.weight}
                              onChange={(e) => updateKPIWeight(kpi.id, parseInt(e.target.value) || 0)}
                            />
                            <span className="text-xs text-muted-foreground">%</span>
                          </div>
                          <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8"
                            onClick={() => removeKPI(kpi.id)}
                          >
                            <Trash2 className="h-4 w-4 text-destructive" />
                          </Button>
                        </div>
                      </div>
                    );
                  })}
                </CardContent>
              </Card>
            )}

            {formData.kpis.length === 0 && (
              <div className="text-center p-8 border-2 border-dashed rounded-lg">
                <Target className="h-8 w-8 mx-auto text-muted-foreground mb-2" />
                <p className="text-sm text-muted-foreground">
                  No KPIs configured yet. Add from templates or create custom KPIs.
                </p>
              </div>
            )}
          </TabsContent>
        </Tabs>

        <DialogFooter className="mt-4">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleSave} disabled={!isValid}>
            <FlaskConical className="h-4 w-4 mr-2" />
            Create POC
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
