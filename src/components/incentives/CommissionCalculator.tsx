import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Calculator, TrendingUp, TrendingDown, AlertTriangle } from "lucide-react";
import { IncentivePlan } from "@/types/incentives";

interface CommissionCalculatorProps {
  plans: IncentivePlan[];
}

interface CalculationResult {
  baseCommission: number;
  slabAdjustment: number;
  acceleratorBonus: number;
  deceleratorPenalty: number;
  discountPenalty: number;
  finalCommission: number;
  effectiveRate: number;
  breakdownItems: { label: string; value: number; type: 'add' | 'subtract' | 'base' }[];
}

export function CommissionCalculator({ plans }: CommissionCalculatorProps) {
  const [selectedPlanId, setSelectedPlanId] = useState<string>("");
  const [dealValue, setDealValue] = useState<number>(1000000);
  const [discountGiven, setDiscountGiven] = useState<number>(0);
  const [marginAchieved, setMarginAchieved] = useState<number>(25);
  const [targetAchievement, setTargetAchievement] = useState<number>(100);
  const [result, setResult] = useState<CalculationResult | null>(null);

  const selectedPlan = plans.find(p => p.id === selectedPlanId);

  const calculateCommission = () => {
    if (!selectedPlan) return;

    let baseCommission = 0;
    let slabAdjustment = 0;
    let acceleratorBonus = 0;
    let deceleratorPenalty = 0;
    let discountPenalty = 0;
    const breakdownItems: CalculationResult['breakdownItems'] = [];

    // Calculate base commission
    if (selectedPlan.slabs.length > 0 && ['slab_based', 'tiered'].includes(selectedPlan.commissionModel)) {
      // Slab-based calculation
      let remainingValue = dealValue;
      for (const slab of selectedPlan.slabs) {
        const slabMax = slab.maxValue || Infinity;
        const slabRange = slabMax - slab.minValue;
        const valueInSlab = Math.min(Math.max(remainingValue, 0), slabRange);
        
        if (valueInSlab > 0) {
          const slabCommission = valueInSlab * (slab.rate / 100);
          slabAdjustment += slabCommission;
          breakdownItems.push({
            label: `Slab ₹${(slab.minValue / 100000).toFixed(1)}L - ${slab.maxValue ? `₹${(slab.maxValue / 100000).toFixed(1)}L` : '∞'} @ ${slab.rate}%`,
            value: slabCommission,
            type: 'add'
          });
          remainingValue -= valueInSlab;
        }
      }
      baseCommission = slabAdjustment;
    } else {
      // Flat percentage
      baseCommission = dealValue * (selectedPlan.baseRate / 100);
      breakdownItems.push({
        label: `Base Commission @ ${selectedPlan.baseRate}%`,
        value: baseCommission,
        type: 'base'
      });
    }

    // Apply accelerator if applicable
    if (selectedPlan.commissionModel === 'accelerator' && targetAchievement >= selectedPlan.acceleratorThreshold) {
      const overAchievement = targetAchievement - selectedPlan.acceleratorThreshold;
      acceleratorBonus = baseCommission * (selectedPlan.acceleratorMultiplier - 1) * (overAchievement / 100);
      breakdownItems.push({
        label: `Accelerator Bonus (${selectedPlan.acceleratorMultiplier}x after ${selectedPlan.acceleratorThreshold}%)`,
        value: acceleratorBonus,
        type: 'add'
      });
    }

    // Apply decelerator if applicable
    if (['decelerator', 'margin_based'].includes(selectedPlan.commissionModel) && marginAchieved < selectedPlan.deceleratorThreshold) {
      const marginShortfall = selectedPlan.deceleratorThreshold - marginAchieved;
      deceleratorPenalty = baseCommission * (1 - selectedPlan.deceleratorMultiplier) * (marginShortfall / 100);
      breakdownItems.push({
        label: `Margin Decelerator (below ${selectedPlan.deceleratorThreshold}% margin)`,
        value: -deceleratorPenalty,
        type: 'subtract'
      });
    }

    // Apply discount penalty if enabled
    if (selectedPlan.discountPenaltyEnabled && discountGiven > 0) {
      discountPenalty = baseCommission * (selectedPlan.discountPenaltyRate / 100) * discountGiven;
      breakdownItems.push({
        label: `Discount Penalty (${discountGiven}% discount @ ${selectedPlan.discountPenaltyRate}% penalty rate)`,
        value: -discountPenalty,
        type: 'subtract'
      });
    }

    const finalCommission = baseCommission + acceleratorBonus - deceleratorPenalty - discountPenalty;
    const effectiveRate = (finalCommission / dealValue) * 100;

    setResult({
      baseCommission,
      slabAdjustment,
      acceleratorBonus,
      deceleratorPenalty,
      discountPenalty,
      finalCommission,
      effectiveRate,
      breakdownItems,
    });
  };

  const formatCurrency = (value: number) => {
    if (value >= 10000000) return `₹${(value / 10000000).toFixed(2)} Cr`;
    if (value >= 100000) return `₹${(value / 100000).toFixed(2)} L`;
    return `₹${value.toLocaleString()}`;
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Input Form */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calculator className="h-5 w-5" />
            Commission Calculator
          </CardTitle>
          <CardDescription>
            Simulate commission payouts based on deal parameters
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="plan">Select Incentive Plan</Label>
            <Select value={selectedPlanId} onValueChange={setSelectedPlanId}>
              <SelectTrigger>
                <SelectValue placeholder="Choose a plan" />
              </SelectTrigger>
              <SelectContent>
                {plans.filter(p => p.status === 'active').map((plan) => (
                  <SelectItem key={plan.id} value={plan.id}>
                    {plan.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="dealValue">Deal Value (₹)</Label>
            <Input
              id="dealValue"
              type="number"
              value={dealValue}
              onChange={(e) => setDealValue(Number(e.target.value))}
              placeholder="Enter deal value"
            />
          </div>

          <div>
            <Label htmlFor="discountGiven">Discount Given (%)</Label>
            <Input
              id="discountGiven"
              type="number"
              min={0}
              max={100}
              value={discountGiven}
              onChange={(e) => setDiscountGiven(Number(e.target.value))}
              placeholder="0"
            />
          </div>

          <div>
            <Label htmlFor="marginAchieved">Margin Achieved (%)</Label>
            <Input
              id="marginAchieved"
              type="number"
              min={0}
              max={100}
              value={marginAchieved}
              onChange={(e) => setMarginAchieved(Number(e.target.value))}
              placeholder="25"
            />
          </div>

          <div>
            <Label htmlFor="targetAchievement">Target Achievement (%)</Label>
            <Input
              id="targetAchievement"
              type="number"
              min={0}
              value={targetAchievement}
              onChange={(e) => setTargetAchievement(Number(e.target.value))}
              placeholder="100"
            />
          </div>

          <Button 
            onClick={calculateCommission} 
            className="w-full"
            disabled={!selectedPlanId}
          >
            <Calculator className="h-4 w-4 mr-2" />
            Calculate Commission
          </Button>
        </CardContent>
      </Card>

      {/* Results */}
      <Card>
        <CardHeader>
          <CardTitle>Calculation Result</CardTitle>
          <CardDescription>
            {selectedPlan ? `Based on: ${selectedPlan.name}` : 'Select a plan to see results'}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {result ? (
            <div className="space-y-4">
              {/* Final Result */}
              <div className="p-4 bg-primary/10 rounded-lg text-center">
                <p className="text-sm text-muted-foreground">Final Commission</p>
                <p className="text-3xl font-bold text-primary">{formatCurrency(result.finalCommission)}</p>
                <p className="text-sm text-muted-foreground">
                  Effective Rate: {result.effectiveRate.toFixed(2)}%
                </p>
              </div>

              {/* Breakdown */}
              <div className="space-y-2">
                <p className="font-medium text-sm">Breakdown</p>
                {result.breakdownItems.map((item, idx) => (
                  <div key={idx} className="flex items-center justify-between p-2 border rounded">
                    <div className="flex items-center gap-2">
                      {item.type === 'add' && <TrendingUp className="h-4 w-4 text-success" />}
                      {item.type === 'subtract' && <TrendingDown className="h-4 w-4 text-destructive" />}
                      {item.type === 'base' && <Calculator className="h-4 w-4 text-primary" />}
                      <span className="text-sm">{item.label}</span>
                    </div>
                    <span className={`font-medium ${item.type === 'subtract' ? 'text-destructive' : item.type === 'add' ? 'text-success' : ''}`}>
                      {item.type === 'subtract' ? '-' : '+'}{formatCurrency(Math.abs(item.value))}
                    </span>
                  </div>
                ))}
              </div>

              {/* Warnings */}
              {result.discountPenalty > 0 && (
                <div className="flex items-center gap-2 p-3 bg-warning/10 rounded-lg text-warning">
                  <AlertTriangle className="h-4 w-4" />
                  <span className="text-sm">Commission reduced due to discount penalty</span>
                </div>
              )}
              {result.deceleratorPenalty > 0 && (
                <div className="flex items-center gap-2 p-3 bg-destructive/10 rounded-lg text-destructive">
                  <TrendingDown className="h-4 w-4" />
                  <span className="text-sm">Commission reduced due to low margin</span>
                </div>
              )}
              {result.acceleratorBonus > 0 && (
                <div className="flex items-center gap-2 p-3 bg-success/10 rounded-lg text-success">
                  <TrendingUp className="h-4 w-4" />
                  <span className="text-sm">Accelerator bonus applied!</span>
                </div>
              )}
            </div>
          ) : (
            <div className="text-center py-8 text-muted-foreground">
              <Calculator className="h-12 w-12 mx-auto mb-3 opacity-50" />
              <p>Enter deal parameters and click calculate to see commission breakdown</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
