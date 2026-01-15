import { useState } from "react";
import { Sidebar } from "@/components/layout/Sidebar";
import { Header } from "@/components/layout/Header";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Slider } from "@/components/ui/slider";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { 
  Plus, 
  GripVertical, 
  Settings2, 
  Trash2, 
  Edit, 
  Shield, 
  FileText, 
  Clock, 
  AlertTriangle,
  CheckCircle,
  XCircle,
  ChevronRight,
  Lock,
  Unlock
} from "lucide-react";
import { salesStages } from "@/data/mockAccountData";
import { SalesStage, StageRule } from "@/types/account";
import { cn } from "@/lib/utils";
import { toast } from "@/hooks/use-toast";

const stageCategories = [
  { value: 'prospecting', label: 'Prospecting', color: 'bg-slate-500' },
  { value: 'qualification', label: 'Qualification', color: 'bg-blue-500' },
  { value: 'proposal', label: 'Proposal', color: 'bg-amber-500' },
  { value: 'negotiation', label: 'Negotiation', color: 'bg-purple-500' },
  { value: 'closing', label: 'Closing', color: 'bg-emerald-500' },
  { value: 'post_sale', label: 'Post-Sale', color: 'bg-teal-500' },
];

const forecastCategories = [
  { value: 'omitted', label: 'Omitted', color: 'text-muted-foreground' },
  { value: 'pipeline', label: 'Pipeline', color: 'text-blue-500' },
  { value: 'best_case', label: 'Best Case', color: 'text-amber-500' },
  { value: 'commit', label: 'Commit', color: 'text-emerald-500' },
  { value: 'closed', label: 'Closed', color: 'text-purple-500' },
];

export default function SalesStageConfig() {
  const [stages, setStages] = useState<SalesStage[]>(salesStages);
  const [selectedStage, setSelectedStage] = useState<SalesStage | null>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);

  const handleStageToggle = (stageId: string) => {
    setStages(prev => prev.map(stage => 
      stage.id === stageId ? { ...stage, isActive: !stage.isActive } : stage
    ));
    toast({
      title: "Stage updated",
      description: "Stage visibility has been toggled.",
    });
  };

  const handleSaveStage = () => {
    if (selectedStage) {
      setStages(prev => prev.map(stage => 
        stage.id === selectedStage.id ? selectedStage : stage
      ));
      setIsEditDialogOpen(false);
      toast({
        title: "Stage saved",
        description: `${selectedStage.name} configuration has been updated.`,
      });
    }
  };

  const getCategoryInfo = (category: string) => {
    return stageCategories.find(c => c.value === category) || stageCategories[0];
  };

  const getForecastInfo = (forecast: string) => {
    return forecastCategories.find(f => f.value === forecast) || forecastCategories[0];
  };

  return (
    <div className="flex h-screen bg-background">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden ml-64">
        <Header />
        <main className="flex-1 overflow-y-auto p-6">
          <div className="max-w-7xl mx-auto space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold text-foreground">Sales Stage Configuration</h1>
                <p className="text-muted-foreground mt-1">
                  Configure sales stages, governance rules, and workflow triggers
                </p>
              </div>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Add Stage
              </Button>
            </div>

            {/* Stage Pipeline Visual */}
            <Card>
              <CardHeader>
                <CardTitle>Stage Pipeline</CardTitle>
                <CardDescription>Drag to reorder stages in the sales process</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-2 overflow-x-auto pb-4">
                  {stages.filter(s => s.isActive).sort((a, b) => a.order - b.order).map((stage, index) => {
                    const categoryInfo = getCategoryInfo(stage.category);
                    return (
                      <div key={stage.id} className="flex items-center">
                        <div 
                          className={cn(
                            "flex items-center gap-2 px-4 py-3 rounded-lg border cursor-pointer transition-all hover:shadow-md",
                            "bg-card min-w-[140px]"
                          )}
                          onClick={() => {
                            setSelectedStage(stage);
                            setIsEditDialogOpen(true);
                          }}
                        >
                          <GripVertical className="h-4 w-4 text-muted-foreground" />
                          <div className="flex-1">
                            <div className="flex items-center gap-2">
                              <div className={cn("h-2 w-2 rounded-full", categoryInfo.color)} />
                              <span className="font-medium text-sm">{stage.name}</span>
                            </div>
                            <div className="flex items-center gap-1 mt-1">
                              <span className="text-xs text-muted-foreground">{stage.defaultProbability}%</span>
                              {stage.priceLocked && <Lock className="h-3 w-3 text-amber-500" />}
                            </div>
                          </div>
                        </div>
                        {index < stages.filter(s => s.isActive).length - 1 && (
                          <ChevronRight className="h-4 w-4 text-muted-foreground mx-1 flex-shrink-0" />
                        )}
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>

            {/* Stage Details Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {stages.sort((a, b) => a.order - b.order).map(stage => {
                const categoryInfo = getCategoryInfo(stage.category);
                const forecastInfo = getForecastInfo(stage.forecastCategory);
                
                return (
                  <Card 
                    key={stage.id}
                    className={cn(
                      "transition-all cursor-pointer hover:shadow-md",
                      !stage.isActive && "opacity-50"
                    )}
                    onClick={() => {
                      setSelectedStage(stage);
                      setIsEditDialogOpen(true);
                    }}
                  >
                    <CardHeader className="pb-2">
                      <div className="flex items-start justify-between">
                        <div className="flex items-center gap-2">
                          <div className={cn("h-3 w-3 rounded-full", categoryInfo.color)} />
                          <CardTitle className="text-lg">{stage.name}</CardTitle>
                        </div>
                        <Switch
                          checked={stage.isActive}
                          onCheckedChange={() => handleStageToggle(stage.id)}
                          onClick={(e) => e.stopPropagation()}
                        />
                      </div>
                      <CardDescription>{stage.code}</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      {/* Probability & Forecast */}
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">Probability</span>
                        <Badge variant="outline">{stage.defaultProbability}%</Badge>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">Forecast</span>
                        <span className={forecastInfo.color}>{forecastInfo.label}</span>
                      </div>

                      {/* Time Thresholds */}
                      <div className="flex items-center gap-2 text-sm">
                        <Clock className="h-4 w-4 text-muted-foreground" />
                        <span className="text-muted-foreground">Expected:</span>
                        <span>{stage.expectedDuration} days</span>
                      </div>

                      {/* Governance Indicators */}
                      <div className="flex flex-wrap gap-1">
                        {stage.requiresApproval && (
                          <Badge variant="secondary" className="text-xs">
                            <Shield className="h-3 w-3 mr-1" />
                            Approval
                          </Badge>
                        )}
                        {stage.priceLocked && (
                          <Badge variant="secondary" className="text-xs">
                            <Lock className="h-3 w-3 mr-1" />
                            Price Lock
                          </Badge>
                        )}
                        {stage.maxDiscount < 100 && (
                          <Badge variant="secondary" className="text-xs">
                            Max {stage.maxDiscount}% Discount
                          </Badge>
                        )}
                        {stage.requiredDocuments.length > 0 && (
                          <Badge variant="secondary" className="text-xs">
                            <FileText className="h-3 w-3 mr-1" />
                            {stage.requiredDocuments.length} Docs
                          </Badge>
                        )}
                      </div>

                      {/* Entry/Exit Criteria Count */}
                      <div className="flex items-center justify-between text-xs text-muted-foreground pt-2 border-t">
                        <span className="flex items-center gap-1">
                          <CheckCircle className="h-3 w-3 text-emerald-500" />
                          {stage.entryCriteria.length} Entry Rules
                        </span>
                        <span className="flex items-center gap-1">
                          <XCircle className="h-3 w-3 text-amber-500" />
                          {stage.exitCriteria.length} Exit Rules
                        </span>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>

            {/* Edit Stage Dialog */}
            <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
              <DialogContent className="max-w-2xl max-h-[85vh] overflow-y-auto">
                {selectedStage && (
                  <>
                    <DialogHeader>
                      <DialogTitle>Configure Stage: {selectedStage.name}</DialogTitle>
                      <DialogDescription>
                        Define entry/exit criteria, governance rules, and workflow triggers
                      </DialogDescription>
                    </DialogHeader>

                    <Tabs defaultValue="general" className="w-full">
                      <TabsList className="grid w-full grid-cols-4">
                        <TabsTrigger value="general">General</TabsTrigger>
                        <TabsTrigger value="criteria">Criteria</TabsTrigger>
                        <TabsTrigger value="governance">Governance</TabsTrigger>
                        <TabsTrigger value="workflows">Workflows</TabsTrigger>
                      </TabsList>

                      <TabsContent value="general" className="space-y-4 mt-4">
                        <div className="grid grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label>Stage Name</Label>
                            <Input 
                              value={selectedStage.name}
                              onChange={(e) => setSelectedStage({...selectedStage, name: e.target.value})}
                            />
                          </div>
                          <div className="space-y-2">
                            <Label>Stage Code</Label>
                            <Input 
                              value={selectedStage.code}
                              onChange={(e) => setSelectedStage({...selectedStage, code: e.target.value})}
                            />
                          </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label>Category</Label>
                            <Select 
                              value={selectedStage.category}
                              onValueChange={(value: any) => setSelectedStage({...selectedStage, category: value})}
                            >
                              <SelectTrigger>
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                {stageCategories.map(cat => (
                                  <SelectItem key={cat.value} value={cat.value}>
                                    <div className="flex items-center gap-2">
                                      <div className={cn("h-2 w-2 rounded-full", cat.color)} />
                                      {cat.label}
                                    </div>
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>
                          <div className="space-y-2">
                            <Label>Forecast Category</Label>
                            <Select 
                              value={selectedStage.forecastCategory}
                              onValueChange={(value: any) => setSelectedStage({...selectedStage, forecastCategory: value})}
                            >
                              <SelectTrigger>
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                {forecastCategories.map(cat => (
                                  <SelectItem key={cat.value} value={cat.value}>{cat.label}</SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>
                        </div>

                        <div className="space-y-2">
                          <Label>Default Probability: {selectedStage.defaultProbability}%</Label>
                          <Slider
                            value={[selectedStage.defaultProbability]}
                            onValueChange={([value]) => setSelectedStage({...selectedStage, defaultProbability: value})}
                            max={100}
                            step={5}
                          />
                        </div>

                        <div className="grid grid-cols-3 gap-4">
                          <div className="space-y-2">
                            <Label>Expected Duration (days)</Label>
                            <Input 
                              type="number"
                              value={selectedStage.expectedDuration}
                              onChange={(e) => setSelectedStage({...selectedStage, expectedDuration: parseInt(e.target.value)})}
                            />
                          </div>
                          <div className="space-y-2">
                            <Label>Warning Threshold (days)</Label>
                            <Input 
                              type="number"
                              value={selectedStage.warningThreshold}
                              onChange={(e) => setSelectedStage({...selectedStage, warningThreshold: parseInt(e.target.value)})}
                            />
                          </div>
                          <div className="space-y-2">
                            <Label>Critical Threshold (days)</Label>
                            <Input 
                              type="number"
                              value={selectedStage.criticalThreshold}
                              onChange={(e) => setSelectedStage({...selectedStage, criticalThreshold: parseInt(e.target.value)})}
                            />
                          </div>
                        </div>
                      </TabsContent>

                      <TabsContent value="criteria" className="space-y-4 mt-4">
                        <div className="space-y-4">
                          <div>
                            <Label className="flex items-center gap-2 mb-2">
                              <CheckCircle className="h-4 w-4 text-emerald-500" />
                              Entry Criteria
                            </Label>
                            <div className="space-y-2 p-4 border rounded-lg bg-muted/30">
                              {selectedStage.entryCriteria.length > 0 ? (
                                selectedStage.entryCriteria.map((rule, idx) => (
                                  <div key={rule.id} className="flex items-center justify-between p-2 bg-background rounded">
                                    <span className="text-sm">
                                      {rule.field} {rule.operator} {String(rule.value)}
                                    </span>
                                    <Button variant="ghost" size="sm">
                                      <Trash2 className="h-3 w-3" />
                                    </Button>
                                  </div>
                                ))
                              ) : (
                                <p className="text-sm text-muted-foreground">No entry criteria defined</p>
                              )}
                              <Button variant="outline" size="sm" className="w-full mt-2">
                                <Plus className="h-3 w-3 mr-1" />
                                Add Entry Rule
                              </Button>
                            </div>
                          </div>

                          <div>
                            <Label className="flex items-center gap-2 mb-2">
                              <XCircle className="h-4 w-4 text-amber-500" />
                              Exit Criteria
                            </Label>
                            <div className="space-y-2 p-4 border rounded-lg bg-muted/30">
                              {selectedStage.exitCriteria.length > 0 ? (
                                selectedStage.exitCriteria.map((rule, idx) => (
                                  <div key={rule.id} className="flex items-center justify-between p-2 bg-background rounded">
                                    <span className="text-sm">
                                      {rule.field} {rule.operator} {String(rule.value)}
                                    </span>
                                    <Button variant="ghost" size="sm">
                                      <Trash2 className="h-3 w-3" />
                                    </Button>
                                  </div>
                                ))
                              ) : (
                                <p className="text-sm text-muted-foreground">No exit criteria defined</p>
                              )}
                              <Button variant="outline" size="sm" className="w-full mt-2">
                                <Plus className="h-3 w-3 mr-1" />
                                Add Exit Rule
                              </Button>
                            </div>
                          </div>

                          <div>
                            <Label className="mb-2">Mandatory Fields</Label>
                            <div className="flex flex-wrap gap-2 p-4 border rounded-lg bg-muted/30">
                              {selectedStage.mandatoryFields.map((field, idx) => (
                                <Badge key={idx} variant="secondary">
                                  {field}
                                  <button className="ml-1 hover:text-destructive">×</button>
                                </Badge>
                              ))}
                              <Button variant="ghost" size="sm">
                                <Plus className="h-3 w-3 mr-1" />
                                Add Field
                              </Button>
                            </div>
                          </div>
                        </div>
                      </TabsContent>

                      <TabsContent value="governance" className="space-y-4 mt-4">
                        <div className="flex items-center justify-between p-4 border rounded-lg">
                          <div>
                            <Label>Requires Approval</Label>
                            <p className="text-sm text-muted-foreground">
                              Stage transition requires manager approval
                            </p>
                          </div>
                          <Switch
                            checked={selectedStage.requiresApproval}
                            onCheckedChange={(checked) => setSelectedStage({...selectedStage, requiresApproval: checked})}
                          />
                        </div>

                        <div className="flex items-center justify-between p-4 border rounded-lg">
                          <div>
                            <Label>Lock Pricing</Label>
                            <p className="text-sm text-muted-foreground">
                              Pricing cannot be modified at this stage
                            </p>
                          </div>
                          <Switch
                            checked={selectedStage.priceLocked}
                            onCheckedChange={(checked) => setSelectedStage({...selectedStage, priceLocked: checked})}
                          />
                        </div>

                        <div className="space-y-2">
                          <Label>Maximum Discount: {selectedStage.maxDiscount}%</Label>
                          <Slider
                            value={[selectedStage.maxDiscount]}
                            onValueChange={([value]) => setSelectedStage({...selectedStage, maxDiscount: value})}
                            max={100}
                            step={5}
                          />
                        </div>

                        <div>
                          <Label className="mb-2">Required Documents</Label>
                          <div className="flex flex-wrap gap-2 p-4 border rounded-lg bg-muted/30">
                            {selectedStage.requiredDocuments.map((doc, idx) => (
                              <Badge key={idx} variant="outline">
                                <FileText className="h-3 w-3 mr-1" />
                                {doc}
                                <button className="ml-1 hover:text-destructive">×</button>
                              </Badge>
                            ))}
                            <Button variant="ghost" size="sm">
                              <Plus className="h-3 w-3 mr-1" />
                              Add Document
                            </Button>
                          </div>
                        </div>

                        {selectedStage.requiresApproval && (
                          <div>
                            <Label className="mb-2">Approval Roles</Label>
                            <div className="flex flex-wrap gap-2 p-4 border rounded-lg bg-muted/30">
                              {selectedStage.approvalRoles.map((role, idx) => (
                                <Badge key={idx} variant="secondary">
                                  <Shield className="h-3 w-3 mr-1" />
                                  {role}
                                </Badge>
                              ))}
                            </div>
                          </div>
                        )}
                      </TabsContent>

                      <TabsContent value="workflows" className="space-y-4 mt-4">
                        <div>
                          <Label className="mb-2">On Enter Workflows</Label>
                          <div className="space-y-2 p-4 border rounded-lg bg-muted/30">
                            {selectedStage.onEnterWorkflows.length > 0 ? (
                              selectedStage.onEnterWorkflows.map((workflow, idx) => (
                                <div key={idx} className="flex items-center justify-between p-2 bg-background rounded">
                                  <span className="text-sm">{workflow}</span>
                                  <Button variant="ghost" size="sm">
                                    <Trash2 className="h-3 w-3" />
                                  </Button>
                                </div>
                              ))
                            ) : (
                              <p className="text-sm text-muted-foreground">No workflows configured</p>
                            )}
                            <Button variant="outline" size="sm" className="w-full mt-2">
                              <Plus className="h-3 w-3 mr-1" />
                              Add Workflow
                            </Button>
                          </div>
                        </div>

                        <div>
                          <Label className="mb-2">On Exit Workflows</Label>
                          <div className="space-y-2 p-4 border rounded-lg bg-muted/30">
                            {selectedStage.onExitWorkflows.length > 0 ? (
                              selectedStage.onExitWorkflows.map((workflow, idx) => (
                                <div key={idx} className="flex items-center justify-between p-2 bg-background rounded">
                                  <span className="text-sm">{workflow}</span>
                                  <Button variant="ghost" size="sm">
                                    <Trash2 className="h-3 w-3" />
                                  </Button>
                                </div>
                              ))
                            ) : (
                              <p className="text-sm text-muted-foreground">No workflows configured</p>
                            )}
                            <Button variant="outline" size="sm" className="w-full mt-2">
                              <Plus className="h-3 w-3 mr-1" />
                              Add Workflow
                            </Button>
                          </div>
                        </div>
                      </TabsContent>
                    </Tabs>

                    <DialogFooter>
                      <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
                        Cancel
                      </Button>
                      <Button onClick={handleSaveStage}>
                        Save Changes
                      </Button>
                    </DialogFooter>
                  </>
                )}
              </DialogContent>
            </Dialog>
          </div>
        </main>
      </div>
    </div>
  );
}
