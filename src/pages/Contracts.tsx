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
import { Search, Filter, Plus, MoreHorizontal, FileCheck, Download, AlertTriangle, CheckCircle, Clock, Pencil, Trash2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { AddContractDialog, ContractData } from "@/components/dialogs/AddContractDialog";
import { DeleteConfirmDialog } from "@/components/dialogs/DeleteConfirmDialog";
import { toast } from "sonner";

interface Contract {
  id: string;
  name: string;
  account: string;
  type: string;
  value: string;
  status: string;
  startDate: string;
  endDate: string;
  renewalAlert: boolean;
}

const initialContracts: Contract[] = [
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
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingContract, setEditingContract] = useState<ContractData | null>(null);
  const [contracts, setContracts] = useState<Contract[]>(initialContracts);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [contractToDelete, setContractToDelete] = useState<Contract | null>(null);

  const filteredContracts = contracts.filter(
    (contract) =>
      contract.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      contract.account.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleAddNew = () => {
    setEditingContract(null);
    setIsDialogOpen(true);
  };

  const handleEdit = (contract: Contract) => {
    setEditingContract({
      id: contract.id,
      name: contract.name,
      account: contract.account,
      type: contract.type,
      value: contract.value === "-" ? "" : contract.value.replace(/[₹,]/g, ""),
      startDate: contract.startDate !== "-" ? new Date(contract.startDate) : undefined,
      endDate: contract.endDate !== "-" ? new Date(contract.endDate) : undefined,
    });
    setIsDialogOpen(true);
  };

  const handleDelete = (contract: Contract) => {
    setContractToDelete(contract);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = () => {
    if (contractToDelete) {
      setContracts(contracts.filter(c => c.id !== contractToDelete.id));
      toast.success("Contract deleted", {
        description: `${contractToDelete.name} has been removed`,
      });
      setContractToDelete(null);
    }
    setDeleteDialogOpen(false);
  };

  const handleSave = (data: ContractData) => {
    if (data.id) {
      // Update existing
      setContracts(contracts.map(contract => 
        contract.id === data.id 
          ? { 
              ...contract, 
              name: data.name,
              account: data.account,
              type: data.type,
              value: data.value ? `₹${parseInt(data.value).toLocaleString("en-IN")}` : "-",
              startDate: data.startDate ? data.startDate.toLocaleDateString("en-US", { month: "short", day: "2-digit", year: "numeric" }) : "-",
              endDate: data.endDate ? data.endDate.toLocaleDateString("en-US", { month: "short", day: "2-digit", year: "numeric" }) : "-",
            }
          : contract
      ));
    } else {
      // Add new
      const year = new Date().getFullYear();
      const newId = data.type === "NDA" 
        ? `NDA-${year}-${Math.floor(Math.random() * 1000).toString().padStart(3, '0')}`
        : `CNT-${year}-${Math.floor(Math.random() * 1000).toString().padStart(3, '0')}`;
      
      const newContract: Contract = {
        id: newId,
        name: data.name,
        account: data.account,
        type: data.type,
        value: data.value ? `₹${parseInt(data.value).toLocaleString("en-IN")}` : "-",
        status: "Pending Signature",
        startDate: data.startDate ? data.startDate.toLocaleDateString("en-US", { month: "short", day: "2-digit", year: "numeric" }) : "-",
        endDate: data.endDate ? data.endDate.toLocaleDateString("en-US", { month: "short", day: "2-digit", year: "numeric" }) : "-",
        renewalAlert: false,
      };
      setContracts([newContract, ...contracts]);
    }
  };

  return (
    <AppLayout title="Contracts">
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 mb-6">
        <div className="stat-card animate-slide-up">
          <p className="text-sm text-muted-foreground mb-1">Active Contracts</p>
          <p className="text-2xl font-bold">{contracts.filter(c => c.status === "Active").length}</p>
        </div>
        <div className="stat-card animate-slide-up" style={{ animationDelay: "0.05s" }}>
          <p className="text-sm text-muted-foreground mb-1">Pending Signature</p>
          <p className="text-2xl font-bold text-accent">{contracts.filter(c => c.status === "Pending Signature").length}</p>
        </div>
        <div className="stat-card animate-slide-up" style={{ animationDelay: "0.1s" }}>
          <p className="text-sm text-muted-foreground mb-1">Renewal Due (30d)</p>
          <p className="text-2xl font-bold text-destructive">{contracts.filter(c => c.renewalAlert).length}</p>
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
          <Button className="gap-2" onClick={handleAddNew}>
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
                          <DropdownMenuItem onClick={() => handleEdit(contract)}>
                            <Pencil className="h-4 w-4 mr-2" />
                            Edit Contract
                          </DropdownMenuItem>
                          <DropdownMenuItem>Initiate Renewal</DropdownMenuItem>
                          <DropdownMenuItem>Download PDF</DropdownMenuItem>
                          <DropdownMenuItem 
                            onClick={() => handleDelete(contract)}
                            className="text-destructive focus:text-destructive"
                          >
                            <Trash2 className="h-4 w-4 mr-2" />
                            Delete Contract
                          </DropdownMenuItem>
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

      <AddContractDialog 
        open={isDialogOpen} 
        onOpenChange={setIsDialogOpen}
        editData={editingContract}
        onSave={handleSave}
      />

      <DeleteConfirmDialog
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        onConfirm={confirmDelete}
        title="Delete Contract"
        description="Are you sure you want to delete this contract? This action cannot be undone."
        itemName={contractToDelete?.name}
      />
    </AppLayout>
  );
}
