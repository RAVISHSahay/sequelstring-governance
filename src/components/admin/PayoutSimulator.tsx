import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { Slider } from '@/components/ui/slider';
import { Play, Calculator, TrendingUp, TrendingDown, Percent, DollarSign } from 'lucide-react';
import { IncentivePlan } from '@/types/incentives';

interface PayoutSimulatorProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  plan: IncentivePlan | null;
  plans: IncentivePlan[];
}

interface SimulationResult {
  dealValue: number;
  baseCommission: number;
  slabRate: number;
  discountPenalty: number;
  acceleratorBonus: number;
  deceleratorReduction: number;
  finalCommission: number;
  effectiveRate: number;
}

export function PayoutSimulator({ open, onOpenChange, plan, plans }: PayoutSimulatorProps) {
  const [selectedPlanId, setSelectedPlanId] = useState(plan?.id || '');
  const [dealValue, setDealValue] = useState(1000000);
  const [discountPercent, setDiscountPercent] = useState(5);
  const [marginPercent, setMarginPercent] = useState(30);
  const [targetAchievement, setTargetAchievement] = useState(85);
  const [result, setResult] = useState<SimulationResult | null>(null);

  const selectedPlan = plans.find((p) => p.id === selectedPlanId) || plan;

  useEffect(() => {
    if (plan) {
      setSelectedPlanId(plan.id);
    }
  }, [plan]);

  const calculateCommission = () => {
    if (!selectedPlan) return;

    // Find applicable slab rate
    let slabRate = selectedPlan.baseRate;
    for (const slab of selectedPlan.slabs) {
      if (dealValue >= slab.minValue && (slab.maxValue === null || dealValue <= slab.maxValue)) {
        slabRate = slab.rate;
        break;
      }
    }

    // Base commission
    const baseCommission = (dealValue * slabRate) / 100;

    // Discount penalty
    let discountPenalty = 0;
    if (selectedPlan.discountPenaltyEnabled && discountPercent > 0) {
      discountPenalty = (baseCommission * discountPercent * selectedPlan.discountPenaltyRate) / 100;
    }

    // Accelerator bonus (if target achievement > threshold)
    let acceleratorBonus = 0;
    if (targetAchievement >= selectedPlan.acceleratorThreshold) {
      acceleratorBonus = baseCommission * (selectedPlan.acceleratorMultiplier - 1);
    }

    // Decelerator reduction (if margin < threshold)
    let deceleratorReduction = 0;
    if (marginPercent < selectedPlan.deceleratorThreshold) {
      deceleratorReduction = baseCommission * (1 - selectedPlan.deceleratorMultiplier);
    }

    const finalCommission = baseCommission - discountPenalty + acceleratorBonus - deceleratorReduction;
    const effectiveRate = (finalCommission / dealValue) * 100;

    setResult({
      dealValue,
      baseCommission,
      slabRate,
      discountPenalty,
      acceleratorBonus,
      deceleratorReduction,
      finalCommission,
      effectiveRate,
    });
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(value);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Calculator className="h-5 w-5 text-primary" />
            Payout Simulator
          </DialogTitle>
          <DialogDescription>
            Simulate commission payouts before rolling out a plan
          </DialogDescription>
        </DialogHeader>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Input Parameters */}
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Select Incentive Plan</Label>
              <Select value={selectedPlanId} onValueChange={setSelectedPlanId}>
                <SelectTrigger>
                  <SelectValue placeholder="Select a plan" />
                </SelectTrigger>
                <SelectContent>
                  {plans.map((p) => (
                    <SelectItem key={p.id} value={p.id}>
                      {p.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Deal Value (₹)</Label>
              <Input
                type="number"
                value={dealValue}
                onChange={(e) => setDealValue(Number(e.target.value))}
                placeholder="Enter deal value"
              />
              <div className="flex gap-2 mt-1">
                {[500000, 1000000, 5000000, 10000000].map((val) => (
                  <Button
                    key={val}
                    variant="outline"
                    size="sm"
                    onClick={() => setDealValue(val)}
                    className="text-xs"
                  >
                    {formatCurrency(val)}
                  </Button>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between">
                <Label>Discount Applied</Label>
                <span className="text-sm text-muted-foreground">{discountPercent}%</span>
              </div>
              <Slider
                value={[discountPercent]}
                onValueChange={([value]) => setDiscountPercent(value)}
                max={30}
                step={1}
              />
            </div>

            <div className="space-y-2">
              <div className="flex justify-between">
                <Label>Margin Achieved</Label>
                <span className="text-sm text-muted-foreground">{marginPercent}%</span>
              </div>
              <Slider
                value={[marginPercent]}
                onValueChange={([value]) => setMarginPercent(value)}
                max={50}
                step={1}
              />
            </div>

            <div className="space-y-2">
              <div className="flex justify-between">
                <Label>Target Achievement</Label>
                <span className="text-sm text-muted-foreground">{targetAchievement}%</span>
              </div>
              <Slider
                value={[targetAchievement]}
                onValueChange={([value]) => setTargetAchievement(value)}
                max={150}
                step={5}
              />
            </div>

            <Button onClick={calculateCommission} className="w-full" disabled={!selectedPlan}>
              <Play className="mr-2 h-4 w-4" />
              Run Simulation
            </Button>
          </div>

          {/* Results */}
          <div className="space-y-4">
            {selectedPlan && (
              <Card className="bg-muted/30">
                <CardContent className="pt-4 space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Plan</span>
                    <span className="font-medium">{selectedPlan.name}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Model</span>
                    <Badge variant="outline" className="capitalize">
                      {selectedPlan.commissionModel.replace('_', ' ')}
                    </Badge>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Base Rate</span>
                    <span>{selectedPlan.baseRate}%</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Accelerator Threshold</span>
                    <span>{selectedPlan.acceleratorThreshold}% target</span>
                  </div>
                </CardContent>
              </Card>
            )}

            {result && (
              <Card className="bg-primary/5 border-primary/20">
                <CardContent className="pt-4 space-y-3">
                  <div className="text-center pb-3">
                    <p className="text-sm text-muted-foreground">Final Commission</p>
                    <p className="text-3xl font-bold text-primary">{formatCurrency(result.finalCommission)}</p>
                    <Badge className="mt-1 bg-primary/10 text-primary">
                      {result.effectiveRate.toFixed(2)}% effective rate
                    </Badge>
                  </div>

                  <Separator />

                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Deal Value</span>
                      <span>{formatCurrency(result.dealValue)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Slab Rate Applied</span>
                      <span>{result.slabRate}%</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Base Commission</span>
                      <span>{formatCurrency(result.baseCommission)}</span>
                    </div>

                    <Separator />

                    {result.discountPenalty > 0 && (
                      <div className="flex justify-between text-destructive">
                        <span className="flex items-center gap-1">
                          <TrendingDown className="h-3 w-3" />
                          Discount Penalty
                        </span>
                        <span>-{formatCurrency(result.discountPenalty)}</span>
                      </div>
                    )}

                    {result.acceleratorBonus > 0 && (
                      <div className="flex justify-between text-emerald-500">
                        <span className="flex items-center gap-1">
                          <TrendingUp className="h-3 w-3" />
                          Accelerator Bonus
                        </span>
                        <span>+{formatCurrency(result.acceleratorBonus)}</span>
                      </div>
                    )}

                    {result.deceleratorReduction > 0 && (
                      <div className="flex justify-between text-amber-500">
                        <span className="flex items-center gap-1">
                          <TrendingDown className="h-3 w-3" />
                          Margin Decelerator
                        </span>
                        <span>-{formatCurrency(result.deceleratorReduction)}</span>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            )}

            {!result && !selectedPlan && (
              <div className="h-[300px] flex items-center justify-center text-muted-foreground">
                <div className="text-center">
                  <Calculator className="h-12 w-12 mx-auto mb-2 opacity-50" />
                  <p>Select a plan and run simulation</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
