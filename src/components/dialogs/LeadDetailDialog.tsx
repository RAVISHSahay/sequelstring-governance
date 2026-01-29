import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { 
  Building2,
  Mail,
  Phone,
  Star,
  User,
  Briefcase,
  Calendar,
  TrendingUp,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface Lead {
  id: number;
  name: string;
  company: string;
  title: string;
  email: string;
  phone: string;
  source: string;
  status: string;
  score: number;
  owner: string;
  createdAt: string;
}

interface LeadDetailDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  lead: Lead | null;
}

const getStatusColor = (status: string) => {
  switch (status) {
    case "New":
      return "bg-info/10 text-info border-info/20";
    case "Contacted":
      return "bg-accent/10 text-accent border-accent/20";
    case "Qualified":
      return "bg-success/10 text-success border-success/20";
    case "Unqualified":
      return "bg-muted text-muted-foreground border-border";
    default:
      return "bg-muted text-muted-foreground border-border";
  }
};

const getScoreColor = (score: number) => {
  if (score >= 80) return "text-success";
  if (score >= 60) return "text-accent";
  if (score >= 40) return "text-warning";
  return "text-destructive";
};

export function LeadDetailDialog({ open, onOpenChange, lead }: LeadDetailDialogProps) {
  if (!lead) return null;

  const handleEmailClick = () => {
    window.location.href = `mailto:${lead.email}`;
  };

  const handlePhoneClick = () => {
    window.location.href = `tel:${lead.phone}`;
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="sm:max-w-lg">
        <SheetHeader>
          <div className="flex items-center gap-4">
            <Avatar className="h-16 w-16">
              <AvatarFallback className="bg-primary/10 text-primary text-xl font-medium">
                {lead.name.split(" ").map((n) => n[0]).join("")}
              </AvatarFallback>
            </Avatar>
            <div>
              <SheetTitle className="text-xl">{lead.name}</SheetTitle>
              <SheetDescription className="flex items-center gap-2 mt-1">
                <Briefcase className="h-4 w-4" />
                {lead.title}
              </SheetDescription>
            </div>
          </div>
        </SheetHeader>

        <div className="mt-6 space-y-6">
          {/* Status and Score */}
          <div className="flex items-center gap-3">
            <Badge variant="outline" className={cn("font-medium", getStatusColor(lead.status))}>
              {lead.status}
            </Badge>
            <div className="flex items-center gap-1">
              <Star className="h-4 w-4 text-yellow-500" />
              <span className={cn("font-semibold", getScoreColor(lead.score))}>
                {lead.score}
              </span>
              <span className="text-sm text-muted-foreground">score</span>
            </div>
          </div>

          <Separator />

          {/* Company Info */}
          <div className="space-y-4">
            <h4 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">
              Company
            </h4>
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                <Building2 className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="font-medium">{lead.company}</p>
                <p className="text-sm text-muted-foreground">Source: {lead.source}</p>
              </div>
            </div>
          </div>

          <Separator />

          {/* Contact Info */}
          <div className="space-y-4">
            <h4 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">
              Contact Information
            </h4>
            <div className="space-y-3">
              <button
                onClick={handleEmailClick}
                className="flex items-center gap-3 w-full p-3 rounded-lg hover:bg-muted/50 transition-colors text-left"
              >
                <Mail className="h-5 w-5 text-muted-foreground" />
                <div>
                  <p className="text-sm text-muted-foreground">Email</p>
                  <p className="font-medium text-primary">{lead.email}</p>
                </div>
              </button>
              <button
                onClick={handlePhoneClick}
                className="flex items-center gap-3 w-full p-3 rounded-lg hover:bg-muted/50 transition-colors text-left"
              >
                <Phone className="h-5 w-5 text-muted-foreground" />
                <div>
                  <p className="text-sm text-muted-foreground">Phone</p>
                  <p className="font-medium text-primary">{lead.phone}</p>
                </div>
              </button>
            </div>
          </div>

          <Separator />

          {/* Owner & Dates */}
          <div className="space-y-4">
            <h4 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">
              Assignment
            </h4>
            <div className="grid grid-cols-2 gap-4">
              <div className="flex items-center gap-2">
                <User className="h-4 w-4 text-muted-foreground" />
                <div>
                  <p className="text-xs text-muted-foreground">Owner</p>
                  <p className="font-medium text-sm">{lead.owner}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                <div>
                  <p className="text-xs text-muted-foreground">Created</p>
                  <p className="font-medium text-sm">{lead.createdAt}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="flex gap-2 pt-4">
            <Button variant="outline" className="flex-1 gap-2" onClick={handleEmailClick}>
              <Mail className="h-4 w-4" />
              Email
            </Button>
            <Button variant="outline" className="flex-1 gap-2" onClick={handlePhoneClick}>
              <Phone className="h-4 w-4" />
              Call
            </Button>
            <Button className="flex-1 gap-2">
              <TrendingUp className="h-4 w-4" />
              Convert
            </Button>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
