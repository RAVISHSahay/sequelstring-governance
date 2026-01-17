import { useState } from "react";
import { useNavigate } from "react-router-dom";
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
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { 
  Search, 
  Filter, 
  Plus, 
  MoreHorizontal,
  Building2,
  ArrowUpDown,
  ExternalLink,
  Edit2,
  Trash2,
  UserPlus,
  Upload,
  Download,
  Map
} from "lucide-react";
import { cn } from "@/lib/utils";
import { AddAccountDialog } from "@/components/dialogs/AddAccountDialog";
import { DeleteConfirmDialog } from "@/components/dialogs/DeleteConfirmDialog";
import { CSVImportDialog } from "@/components/dialogs/CSVImportDialog";
import { ExportDialog } from "@/components/dialogs/ExportDialog";
import { ContextualHelp } from "@/components/help/ContextualHelp";
import { toast } from "sonner";
import { useActivityLogger } from "@/hooks/useActivityLogger";

interface Account {
  id: number;
  name: string;
  type: string;
  industry: string;
  revenue: string;
  deals: number;
  contacts: number;
  status: string;
  owner: string;
}

const initialAccounts: Account[] = [
  {
    id: 1,
    name: "Tata Steel Ltd",
    type: "Enterprise",
    industry: "Manufacturing",
    revenue: "₹2.4 Cr",
    deals: 4,
    contacts: 12,
    status: "Active",
    owner: "Priya Sharma",
  },
  {
    id: 2,
    name: "Reliance Industries",
    type: "Enterprise",
    industry: "Conglomerate",
    revenue: "₹5.8 Cr",
    deals: 7,
    contacts: 23,
    status: "Active",
    owner: "Rahul Mehta",
  },
  {
    id: 3,
    name: "Infosys Ltd",
    type: "Enterprise",
    industry: "IT Services",
    revenue: "₹1.2 Cr",
    deals: 2,
    contacts: 8,
    status: "Active",
    owner: "Anjali Kumar",
  },
  {
    id: 4,
    name: "HDFC Bank",
    type: "Enterprise",
    industry: "Banking",
    revenue: "₹3.5 Cr",
    deals: 5,
    contacts: 15,
    status: "Active",
    owner: "Vikram Das",
  },
  {
    id: 5,
    name: "Mahindra Group",
    type: "Enterprise",
    industry: "Automotive",
    revenue: "₹2.1 Cr",
    deals: 3,
    contacts: 10,
    status: "Prospect",
    owner: "Priya Sharma",
  },
  {
    id: 6,
    name: "Wipro Technologies",
    type: "Enterprise",
    industry: "IT Services",
    revenue: "₹890L",
    deals: 2,
    contacts: 6,
    status: "Active",
    owner: "Sanjay Gupta",
  },
  {
    id: 7,
    name: "State Bank of India",
    type: "PSU",
    industry: "Banking",
    revenue: "₹4.2 Cr",
    deals: 6,
    contacts: 18,
    status: "Active",
    owner: "Rahul Mehta",
  },
  {
    id: 8,
    name: "ONGC",
    type: "PSU",
    industry: "Oil & Gas",
    revenue: "₹1.8 Cr",
    deals: 2,
    contacts: 9,
    status: "Prospect",
    owner: "Vikram Das",
  },
];

const getStatusColor = (status: string) => {
  switch (status) {
    case "Active":
      return "bg-success/10 text-success border-success/20";
    case "Prospect":
      return "bg-info/10 text-info border-info/20";
    case "Inactive":
      return "bg-muted text-muted-foreground border-border";
    default:
      return "bg-muted text-muted-foreground border-border";
  }
};

const getTypeColor = (type: string) => {
  switch (type) {
    case "Enterprise":
      return "bg-primary/10 text-primary border-primary/20";
    case "PSU":
      return "bg-accent/10 text-accent border-accent/20";
    case "Government":
      return "bg-warning/10 text-warning border-warning/20";
    default:
      return "bg-muted text-muted-foreground border-border";
  }
};

export default function Accounts() {
  const navigate = useNavigate();
  const [accounts, setAccounts] = useState<Account[]>(initialAccounts);
  const [searchQuery, setSearchQuery] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [dialogMode, setDialogMode] = useState<'create' | 'edit'>('create');
  const [selectedAccount, setSelectedAccount] = useState<Account | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [importDialogOpen, setImportDialogOpen] = useState(false);
  const [exportDialogOpen, setExportDialogOpen] = useState(false);
  const { log } = useActivityLogger();

  const handleViewAccountMap = (accountName: string) => {
    navigate(`/account-map?account=${encodeURIComponent(accountName)}`);
  };

  // Define export fields
  const accountExportFields = [
    { key: 'name', label: 'Account Name', defaultSelected: true },
    { key: 'type', label: 'Type', defaultSelected: true },
    { key: 'industry', label: 'Industry', defaultSelected: true },
    { key: 'revenue', label: 'Revenue', defaultSelected: true },
    { key: 'deals', label: 'Deals', defaultSelected: true },
    { key: 'contacts', label: 'Contacts', defaultSelected: true },
    { key: 'status', label: 'Status', defaultSelected: true },
    { key: 'owner', label: 'Owner', defaultSelected: true },
  ];

  const accountImportFields = [
    { name: 'name', label: 'Account Name', required: true },
    { name: 'type', label: 'Account Type', required: true },
    { name: 'industry', label: 'Industry', required: true },
    { name: 'revenue', label: 'Annual Revenue', required: false },
    { name: 'status', label: 'Status', required: false },
    { name: 'owner', label: 'Account Owner', required: true },
    { 
      name: 'email', 
      label: 'Contact Email', 
      required: false,
      validation: [{ type: 'email' as const, message: 'Invalid email format (e.g., info@company.com)' }]
    },
    { 
      name: 'phone', 
      label: 'Contact Phone', 
      required: false,
      validation: [{ type: 'phone' as const, message: 'Invalid phone format (min 7 digits)' }]
    },
  ];

  // Prepare existing data for duplicate detection
  const existingAccountsForDuplicateCheck = accounts.map((a) => ({
    name: a.name,
  }));

  const filteredAccounts = accounts.filter((account) =>
    account.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleAddAccount = () => {
    setSelectedAccount(null);
    setDialogMode('create');
    setDialogOpen(true);
  };

  const handleEditAccount = (account: Account) => {
    setSelectedAccount(account);
    setDialogMode('edit');
    setDialogOpen(true);
  };

  const handleDeleteAccount = (account: Account) => {
    setSelectedAccount(account);
    setDeleteDialogOpen(true);
  };

  const handleSaveAccount = (account: Account) => {
    if (dialogMode === 'create') {
      setAccounts((prev) => [...prev, account]);
      toast.success(`Account ${account.name} added successfully`);
    } else {
      setAccounts((prev) =>
        prev.map((a) => (a.id === account.id ? account : a))
      );
      toast.success(`Account ${account.name} updated successfully`);
    }
  };

  const handleConfirmDelete = () => {
    if (selectedAccount) {
      setAccounts((prev) => prev.filter((a) => a.id !== selectedAccount.id));
      
      // Log activity
      log("delete", "account", selectedAccount.name, `Deleted ${selectedAccount.type} account in ${selectedAccount.industry}`, selectedAccount.id.toString());
      
      toast.success(`Account ${selectedAccount.name} deleted`);
      setDeleteDialogOpen(false);
      setSelectedAccount(null);
    }
  };

  const handleImportAccounts = (data: Record<string, string>[]) => {
    const newAccounts: Account[] = data.map((row, index) => ({
      id: Date.now() + index,
      name: row.name,
      type: row.type || 'Enterprise',
      industry: row.industry,
      revenue: row.revenue ? (row.revenue.startsWith('₹') ? row.revenue : `₹${row.revenue}`) : '₹0',
      deals: 0,
      contacts: 0,
      status: row.status || 'Prospect',
      owner: row.owner,
    }));
    setAccounts((prev) => [...prev, ...newAccounts]);
    
    // Log activity
    log("import", "account", "Accounts Import", `Imported ${newAccounts.length} accounts from CSV`, undefined, { recordCount: newAccounts.length });
    
    toast.success(`${newAccounts.length} accounts imported successfully`);
  };

  return (
    <AppLayout title="Accounts">
      {/* Toolbar */}
      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search accounts..."
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
          <Button 
            variant="outline" 
            className="gap-2" 
            onClick={() => setExportDialogOpen(true)}
          >
            <Download className="h-4 w-4" />
            Export
          </Button>
          <Button variant="outline" className="gap-2" onClick={() => setImportDialogOpen(true)}>
            <Upload className="h-4 w-4" />
            Import
          </Button>
          <Button className="gap-2" onClick={handleAddAccount}>
            <Plus className="h-4 w-4" />
            Add Account
          </Button>
          <ContextualHelp 
            articleId="account-management" 
            tooltip="Learn about accounts" 
          />
        </div>
      </div>
      <div className="bg-card rounded-xl border border-border/50 overflow-hidden animate-fade-in">
        <Table>
          <TableHeader>
            <TableRow className="table-header hover:bg-muted/50">
              <TableHead className="w-[280px]">
                <div className="flex items-center gap-1">
                  Account Name
                  <ArrowUpDown className="h-3 w-3" />
                </div>
              </TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Industry</TableHead>
              <TableHead>Revenue</TableHead>
              <TableHead className="text-center">Deals</TableHead>
              <TableHead className="text-center">Contacts</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Owner</TableHead>
              <TableHead className="w-[50px]"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredAccounts.map((account) => (
              <TableRow 
                key={account.id} 
                className="group cursor-pointer hover:bg-muted/30"
                onClick={() => handleViewAccountMap(account.name)}
              >
                <TableCell>
                  <div className="flex items-center gap-3">
                    <div className="h-9 w-9 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                      <Building2 className="h-4 w-4 text-primary" />
                    </div>
                    <div>
                      <p className="font-medium text-foreground group-hover:text-primary transition-colors">
                        {account.name}
                      </p>
                      <p className="text-xs text-muted-foreground">Click to view 360° map</p>
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <Badge variant="outline" className={cn("font-medium", getTypeColor(account.type))}>
                    {account.type}
                  </Badge>
                </TableCell>
                <TableCell className="text-muted-foreground">
                  {account.industry}
                </TableCell>
                <TableCell className="font-medium">{account.revenue}</TableCell>
                <TableCell className="text-center">{account.deals}</TableCell>
                <TableCell className="text-center">{account.contacts}</TableCell>
                <TableCell>
                  <Badge variant="outline" className={cn("font-medium", getStatusColor(account.status))}>
                    {account.status}
                  </Badge>
                </TableCell>
                <TableCell className="text-muted-foreground">
                  {account.owner}
                </TableCell>
                <TableCell>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon" className="h-8 w-8 opacity-0 group-hover:opacity-100">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" onClick={(e) => e.stopPropagation()}>
                      <DropdownMenuItem onClick={() => handleViewAccountMap(account.name)}>
                        <Map className="h-4 w-4 mr-2" />
                        View 360° Map
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        <ExternalLink className="h-4 w-4 mr-2" />
                        View Details
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem onClick={() => handleEditAccount(account)}>
                        <Edit2 className="h-4 w-4 mr-2" />
                        Edit Account
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        <UserPlus className="h-4 w-4 mr-2" />
                        Add Contact
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem
                        onClick={() => handleDeleteAccount(account)}
                        className="text-destructive focus:text-destructive"
                      >
                        <Trash2 className="h-4 w-4 mr-2" />
                        Delete Account
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Pagination info */}
      <div className="flex items-center justify-between mt-4 text-sm text-muted-foreground">
        <p>Showing {filteredAccounts.length} of {accounts.length} accounts</p>
      </div>

      <AddAccountDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        onSave={handleSaveAccount}
        account={selectedAccount}
        mode={dialogMode}
      />

      <DeleteConfirmDialog
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        title="Delete Account"
        description={`Are you sure you want to delete ${selectedAccount?.name}? This will also remove all associated contacts and opportunities.`}
        onConfirm={handleConfirmDelete}
      />

      <CSVImportDialog
        open={importDialogOpen}
        onOpenChange={setImportDialogOpen}
        title="Import Accounts"
        description="Upload a CSV file to bulk import accounts into your CRM"
        fields={accountImportFields}
        onImport={handleImportAccounts}
        templateFileName="accounts_import_template.csv"
        duplicateCheckFields={['name']}
        existingData={existingAccountsForDuplicateCheck}
      />

      <ExportDialog
        open={exportDialogOpen}
        onOpenChange={setExportDialogOpen}
        data={filteredAccounts}
        fields={accountExportFields}
        filename="accounts-export"
        title="Export Accounts"
        entityName="accounts"
      />
    </AppLayout>
  );
}
