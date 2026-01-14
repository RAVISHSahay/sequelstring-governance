import { useState } from "react";
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
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import {
  Building2,
  CalendarDays,
  User,
  Briefcase,
  FileText,
  ChevronDown,
} from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";

export interface QuoteInfo {
  quoteId: string;
  quoteName: string;
  accountId: string;
  accountName: string;
  opportunityId: string;
  opportunityName: string;
  owner: string;
  validUntil: Date;
  version: string;
  status: string;
}

const accounts = [
  { id: "ACC-001", name: "Tata Steel Ltd", type: "Enterprise" },
  { id: "ACC-002", name: "Reliance Industries", type: "Enterprise" },
  { id: "ACC-003", name: "Infosys Ltd", type: "Enterprise" },
  { id: "ACC-004", name: "HDFC Bank", type: "Enterprise" },
  { id: "ACC-005", name: "Coal India Ltd", type: "PSU" },
  { id: "ACC-006", name: "Ministry of Railways", type: "Government" },
];

const opportunities = [
  { id: "OPP-001", name: "Enterprise Platform License", accountId: "ACC-001" },
  { id: "OPP-002", name: "Cloud Migration", accountId: "ACC-002" },
  { id: "OPP-003", name: "Support Renewal", accountId: "ACC-003" },
  { id: "OPP-004", name: "API Integration", accountId: "ACC-004" },
  { id: "OPP-005", name: "Digital Transformation", accountId: "ACC-005" },
  { id: "OPP-006", name: "Mobility Platform", accountId: "ACC-006" },
];

const owners = [
  { id: "USR-001", name: "Priya Sharma", initials: "PS" },
  { id: "USR-002", name: "Rahul Mehta", initials: "RM" },
  { id: "USR-003", name: "Anjali Kumar", initials: "AK" },
  { id: "USR-004", name: "Vikram Desai", initials: "VD" },
];

interface QuoteHeaderProps {
  quoteInfo: QuoteInfo;
  onUpdateQuoteInfo: (updates: Partial<QuoteInfo>) => void;
}

export function QuoteHeader({ quoteInfo, onUpdateQuoteInfo }: QuoteHeaderProps) {
  const filteredOpportunities = opportunities.filter(
    (opp) => opp.accountId === quoteInfo.accountId || !quoteInfo.accountId
  );

  const handleAccountChange = (accountId: string) => {
    const account = accounts.find((a) => a.id === accountId);
    onUpdateQuoteInfo({
      accountId,
      accountName: account?.name || "",
      opportunityId: "",
      opportunityName: "",
    });
  };

  const handleOpportunityChange = (opportunityId: string) => {
    const opportunity = opportunities.find((o) => o.id === opportunityId);
    onUpdateQuoteInfo({
      opportunityId,
      opportunityName: opportunity?.name || "",
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Draft":
        return "bg-muted text-muted-foreground";
      case "Pending Approval":
        return "bg-accent/10 text-accent border-accent/20";
      case "Approved":
        return "bg-success/10 text-success border-success/20";
      case "Sent":
        return "bg-info/10 text-info border-info/20";
      default:
        return "bg-muted text-muted-foreground";
    }
  };

  return (
    <div className="bg-card rounded-xl border border-border/50 p-6 animate-fade-in">
      <div className="flex items-start justify-between mb-6">
        <div className="flex items-center gap-4">
          <div className="h-12 w-12 rounded-xl bg-primary/10 flex items-center justify-center">
            <FileText className="h-6 w-6 text-primary" />
          </div>
          <div>
            <div className="flex items-center gap-3">
              <Input
                value={quoteInfo.quoteName}
                onChange={(e) => onUpdateQuoteInfo({ quoteName: e.target.value })}
                className="text-xl font-semibold border-none shadow-none px-0 h-auto focus-visible:ring-0 max-w-md"
                placeholder="Enter quote name..."
              />
              <Badge variant="outline" className="text-xs">
                {quoteInfo.version}
              </Badge>
            </div>
            <p className="text-sm text-muted-foreground font-mono mt-1">
              {quoteInfo.quoteId}
            </p>
          </div>
        </div>
        <Badge variant="outline" className={cn("font-medium", getStatusColor(quoteInfo.status))}>
          {quoteInfo.status}
        </Badge>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Account */}
        <div className="space-y-1.5">
          <Label className="text-xs text-muted-foreground flex items-center gap-1.5">
            <Building2 className="h-3 w-3" />
            Account
          </Label>
          <Select value={quoteInfo.accountId} onValueChange={handleAccountChange}>
            <SelectTrigger>
              <SelectValue placeholder="Select account" />
            </SelectTrigger>
            <SelectContent>
              {accounts.map((account) => (
                <SelectItem key={account.id} value={account.id}>
                  <div className="flex items-center gap-2">
                    <span>{account.name}</span>
                    <Badge variant="outline" className="text-[10px]">
                      {account.type}
                    </Badge>
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Opportunity */}
        <div className="space-y-1.5">
          <Label className="text-xs text-muted-foreground flex items-center gap-1.5">
            <Briefcase className="h-3 w-3" />
            Opportunity
          </Label>
          <Select
            value={quoteInfo.opportunityId}
            onValueChange={handleOpportunityChange}
            disabled={!quoteInfo.accountId}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select opportunity" />
            </SelectTrigger>
            <SelectContent>
              {filteredOpportunities.map((opp) => (
                <SelectItem key={opp.id} value={opp.id}>
                  {opp.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Owner */}
        <div className="space-y-1.5">
          <Label className="text-xs text-muted-foreground flex items-center gap-1.5">
            <User className="h-3 w-3" />
            Quote Owner
          </Label>
          <Select
            value={quoteInfo.owner}
            onValueChange={(value) => onUpdateQuoteInfo({ owner: value })}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select owner" />
            </SelectTrigger>
            <SelectContent>
              {owners.map((owner) => (
                <SelectItem key={owner.id} value={owner.name}>
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center text-xs font-medium text-primary">
                      {owner.initials}
                    </div>
                    {owner.name}
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Valid Until */}
        <div className="space-y-1.5">
          <Label className="text-xs text-muted-foreground flex items-center gap-1.5">
            <CalendarDays className="h-3 w-3" />
            Valid Until
          </Label>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className={cn(
                  "w-full justify-start text-left font-normal",
                  !quoteInfo.validUntil && "text-muted-foreground"
                )}
              >
                <CalendarDays className="mr-2 h-4 w-4" />
                {quoteInfo.validUntil
                  ? format(quoteInfo.validUntil, "PPP")
                  : "Pick a date"}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="single"
                selected={quoteInfo.validUntil}
                onSelect={(date) => date && onUpdateQuoteInfo({ validUntil: date })}
                initialFocus
                disabled={(date) => date < new Date()}
              />
            </PopoverContent>
          </Popover>
        </div>
      </div>
    </div>
  );
}
