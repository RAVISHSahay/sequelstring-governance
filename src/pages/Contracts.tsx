import { useState } from "react";
import { AppLayout } from "@/components/layout/AppLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Search, Filter, Plus, MoreHorizontal, FileCheck, Download, AlertTriangle, CheckCircle, Clock } from "lucide-react";
import { cn } from "@/lib/utils";

const contracts = [
  {
    id: "CNT-2025-001",
    name: "Master Service Agreement",
    account: "Tata Steel Ltd",
    type: "MSA",
    value: "₹45,00,000",
    status: "Active",
    startDate: "Jan 01, 2025",
    endDate: "Dec 31, 2025",
    renewalAlert: false,
  },
  {
    id: "CNT-2024-089",
    name: "Annual Support Contract",
    account: "HDFC Bank",
    type: "Support",
    value: "₹18,75,000",
    status: "Active",
    startDate: "Apr 01, 2024",
    endDate: "Mar 31, 2025",
    renewalAlert: true,
  },
  {
    id: "CNT-2024-076",
    name: "Platform License Agreement",
    account: "Reliance Industries",
    type: "License",
    value: "₹28,50,000",
    status: "Active",
    startDate: "Jul 01, 2024",
    endDate: "Jun 30, 2025",
    renewalAlert: false,
  },
  {
    id: "NDA-2025-012",
    name: "Non-Disclosure Agreement",
    account: "Mahindra Group",
    type: "NDA",
    value: "-",
    status: "Pending Signature",
    startDate: "-",
    endDate: "-",
    renewalAlert: false,
  },
  {
    id: "CNT-2023-045",
    name: "Implementation Services",
    account: "Infosys Ltd",
    type: "Services",
    value: "₹12,00,000",
    status: "Completed",
    startDate: "Jan 15, 2024",
    endDate: "Dec 15, 2024",
    renewalAlert: false,
  },
];

const getStatusConfig = (status: string) => {
  switch (status) {
    case "Active":
      return { color: "bg-success/10 text-success border-success/20", icon: CheckCircle };
    case "Pending Signature":
      return { color: "bg-accent/10 text-accent border-accent/20", icon: Clock };
    case "Completed":
      return { color: "bg-muted text-muted-foreground border-border", icon: FileCheck };
    default:
      return { color: "bg-muted text-muted-foreground border-border", icon: FileCheck };
  }
};

const getTypeColor = (type: string) => {
  switch (type) {
    case "MSA":
      return "bg-primary/10 text-primary border-primary/20";
    case "License":
      return "bg-info/10 text-info border-info/20";
    case "Support":
      return "bg-success/10 text-success border-success/20";
    case "NDA":
      return "bg-accent/10 text-accent border-accent/20";
    default:
      return "bg-muted text-muted-foreground border-border";
  }
};

export default function Contracts() {
  const [searchQuery, setSearchQuery] = useState("");

  const filteredContracts = contracts.filter(
    (contract) =>
      contract.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      contract.account.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <AppLayout title="Contracts">
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 mb-6">
        <div className="stat-card animate-slide-up">
          <p className="text-sm text-muted-foreground mb-1">Active Contracts</p>
          <p className="text-2xl font-bold">34</p>
        </div>
        <div className="stat-card animate-slide-up" style={{ animationDelay: "0.05s" }}>
          <p className="text-sm text-muted-foreground mb-1">Pending Signature</p>
          <p className="text-2xl font-bold text-accent">8</p>
        </div>
        <div className="stat-card animate-slide-up" style={{ animationDelay: "0.1s" }}>
          <p className="text-sm text-muted-foreground mb-1">Renewal Due (30d)</p>
          <p className="text-2xl font-bold text-destructive">5</p>
        </div>
        <div className="stat-card animate-slide-up" style={{ animationDelay: "0.15s" }}>
          <p className="text-sm text-muted-foreground mb-1">Total Value</p>
          <p className="text-2xl font-bold">₹4.2 Cr</p>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search contracts..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
        <div className="flex gap-2">
          <Button variant="outline" className="gap-2">
            <Filter className="h-4 w-4" />
            Filters
          </Button>
          <Button className="gap-2">
            <Plus className="h-4 w-4" />
            New Contract
          </Button>
        </div>
      </div>

      <div className="bg-card rounded-xl border border-border/50 overflow-hidden animate-fade-in">
        <Table>
          <TableHeader>
            <TableRow className="table-header hover:bg-muted/50">
              <TableHead className="w-[120px]">Contract ID</TableHead>
              <TableHead className="w-[220px]">Name</TableHead>
              <TableHead>Account</TableHead>
              <TableHead>Type</TableHead>
              <TableHead className="text-right">Value</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>End Date</TableHead>
              <TableHead className="w-[80px]">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredContracts.map((contract) => {
              const statusConfig = getStatusConfig(contract.status);
              const StatusIcon = statusConfig.icon;
              
              return (
                <TableRow key={contract.id} className="group cursor-pointer hover:bg-muted/30">
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <FileCheck className="h-4 w-4 text-muted-foreground" />
                      <span className="font-mono text-sm">{contract.id}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <p className="font-medium text-foreground">{contract.name}</p>
                      {contract.renewalAlert && (
                        <AlertTriangle className="h-4 w-4 text-destructive" />
                      )}
                    </div>
                  </TableCell>
                  <TableCell className="text-muted-foreground">{contract.account}</TableCell>
                  <TableCell>
                    <Badge variant="outline" className={cn("font-medium", getTypeColor(contract.type))}>
                      {contract.type}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right font-semibold">{contract.value}</TableCell>
                  <TableCell>
                    <Badge variant="outline" className={cn("font-medium gap-1", statusConfig.color)}>
                      <StatusIcon className="h-3 w-3" />
                      {contract.status}
                    </Badge>
                  </TableCell>
                  <TableCell className={cn(
                    "text-sm",
                    contract.renewalAlert ? "text-destructive font-medium" : "text-muted-foreground"
                  )}>
                    {contract.endDate}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100">
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <Download className="h-4 w-4" />
                      </Button>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon" className="h-8 w-8">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem>View Details</DropdownMenuItem>
                          <DropdownMenuItem>Edit Contract</DropdownMenuItem>
                          <DropdownMenuItem>Initiate Renewal</DropdownMenuItem>
                          <DropdownMenuItem>Download PDF</DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>
    </AppLayout>
  );
}
