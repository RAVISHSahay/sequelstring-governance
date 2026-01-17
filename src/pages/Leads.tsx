import { useState } from "react";
import { AppLayout } from "@/components/layout/AppLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
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
import {
  Search,
  Filter,
  Plus,
  MoreHorizontal,
  ArrowUpDown,
  Star,
  Phone,
  Mail,
  Pencil,
  Trash2,
  Upload,
  Download,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { AddLeadDialog, LeadData } from "@/components/dialogs/AddLeadDialog";
import { DeleteConfirmDialog } from "@/components/dialogs/DeleteConfirmDialog";
import { CSVImportDialog } from "@/components/dialogs/CSVImportDialog";
import { ExportDialog } from "@/components/dialogs/ExportDialog";
import { toast } from "sonner";
import { useActivityLogger } from "@/hooks/useActivityLogger";

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
  initials: string;
  createdAt: string;
}

const initialLeads: Lead[] = [
  {
    id: 1,
    name: "Arun Patel",
    company: "Zomato",
    title: "VP Engineering",
    email: "arun.patel@zomato.com",
    phone: "+91 98765 43210",
    source: "Website",
    status: "New",
    score: 85,
    owner: "Priya Sharma",
    initials: "PS",
    createdAt: "2 hours ago",
  },
  {
    id: 2,
    name: "Sneha Reddy",
    company: "Swiggy",
    title: "CTO",
    email: "sneha.r@swiggy.in",
    phone: "+91 98123 45678",
    source: "Referral",
    status: "Contacted",
    score: 92,
    owner: "Rahul Mehta",
    initials: "RM",
    createdAt: "5 hours ago",
  },
  {
    id: 3,
    name: "Vikash Kumar",
    company: "Paytm",
    title: "Director IT",
    email: "vikash.k@paytm.com",
    phone: "+91 87654 32109",
    source: "Event",
    status: "Qualified",
    score: 78,
    owner: "Anjali Kumar",
    initials: "AK",
    createdAt: "1 day ago",
  },
  {
    id: 4,
    name: "Meera Sharma",
    company: "PhonePe",
    title: "Head of Platform",
    email: "meera.s@phonepe.com",
    phone: "+91 76543 21098",
    source: "LinkedIn",
    status: "New",
    score: 88,
    owner: "Vikram Desai",
    initials: "VD",
    createdAt: "1 day ago",
  },
  {
    id: 5,
    name: "Rajesh Nair",
    company: "Dream11",
    title: "Engineering Manager",
    email: "rajesh.n@dream11.com",
    phone: "+91 65432 10987",
    source: "Website",
    status: "Contacted",
    score: 65,
    owner: "Priya Sharma",
    initials: "PS",
    createdAt: "2 days ago",
  },
  {
    id: 6,
    name: "Anita Desai",
    company: "CRED",
    title: "VP Product",
    email: "anita.d@cred.club",
    phone: "+91 54321 09876",
    source: "Referral",
    status: "Qualified",
    score: 95,
    owner: "Sanjay Gupta",
    initials: "SG",
    createdAt: "3 days ago",
  },
  {
    id: 7,
    name: "Karthik Iyer",
    company: "Razorpay",
    title: "Director Engineering",
    email: "karthik.i@razorpay.com",
    phone: "+91 43210 98765",
    source: "Partner",
    status: "New",
    score: 72,
    owner: "Rahul Mehta",
    initials: "RM",
    createdAt: "3 days ago",
  },
  {
    id: 8,
    name: "Pooja Mehta",
    company: "Groww",
    title: "CTO",
    email: "pooja.m@groww.in",
    phone: "+91 32109 87654",
    source: "Website",
    status: "Unqualified",
    score: 35,
    owner: "Anjali Kumar",
    initials: "AK",
    createdAt: "5 days ago",
  },
];

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

const getInitials = (name: string) => {
  return name.split(" ").map(n => n[0]).join("").toUpperCase();
};

export default function Leads() {
  const [searchQuery, setSearchQuery] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingLead, setEditingLead] = useState<LeadData | null>(null);
  const [leads, setLeads] = useState<Lead[]>(initialLeads);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [leadToDelete, setLeadToDelete] = useState<Lead | null>(null);
  const [importDialogOpen, setImportDialogOpen] = useState(false);
  const [exportDialogOpen, setExportDialogOpen] = useState(false);
  const { log } = useActivityLogger();

  // Define export fields
  const leadExportFields = [
    { key: 'name', label: 'Name', defaultSelected: true },
    { key: 'company', label: 'Company', defaultSelected: true },
    { key: 'title', label: 'Title', defaultSelected: true },
    { key: 'email', label: 'Email', defaultSelected: true },
    { key: 'phone', label: 'Phone', defaultSelected: true },
    { key: 'source', label: 'Source', defaultSelected: true },
    { key: 'status', label: 'Status', defaultSelected: true },
    { key: 'score', label: 'Score', defaultSelected: true },
    { key: 'owner', label: 'Owner', defaultSelected: true },
    { key: 'createdAt', label: 'Created', defaultSelected: false },
  ];

  // Define import fields with various validation rules
  const leadImportFields = [
    { name: 'firstName', label: 'First Name', required: true },
    { name: 'lastName', label: 'Last Name', required: true },
    { name: 'company', label: 'Company', required: true },
    { name: 'title', label: 'Job Title', required: false },
    { 
      name: 'email', 
      label: 'Email', 
      required: true,
      validation: [{ type: 'email' as const, message: 'Invalid email format (e.g., name@company.com)' }]
    },
    { 
      name: 'phone', 
      label: 'Phone', 
      required: false,
      validation: [{ type: 'phone' as const, message: 'Invalid phone format (min 7 digits)' }]
    },
    { 
      name: 'source', 
      label: 'Lead Source', 
      required: false,
      validation: [
        { 
          type: 'regex' as const, 
          pattern: '^(Website|Referral|Event|LinkedIn|Partner|Cold Call|Advertisement|Other)$', 
          message: 'Source must be: Website, Referral, Event, LinkedIn, Partner, Cold Call, Advertisement, or Other' 
        }
      ]
    },
    { 
      name: 'score', 
      label: 'Lead Score', 
      required: false,
      validation: [
        { type: 'numeric' as const, message: 'Score must be a number' },
        { type: 'regex' as const, pattern: '^([0-9]|[1-9][0-9]|100)$', message: 'Score must be between 0 and 100' }
      ]
    },
    { 
      name: 'gstin', 
      label: 'GSTIN (Optional)', 
      required: false,
      validation: [
        { 
          type: 'regex' as const, 
          pattern: '^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$', 
          message: 'Invalid GSTIN format (e.g., 22AAAAA0000A1Z5)' 
        }
      ]
    },
    { 
      name: 'pincode', 
      label: 'PIN Code (Optional)', 
      required: false,
      validation: [
        { type: 'regex' as const, pattern: '^[1-9][0-9]{5}$', message: 'PIN code must be 6 digits' }
      ]
    },
  ];

  // Prepare existing data for duplicate detection
  const existingLeadsForDuplicateCheck = leads.map((l) => ({
    email: l.email,
  }));

  const handleImportLeads = (data: Record<string, string>[]) => {
    const newLeads: Lead[] = data.map((row, index) => ({
      id: Date.now() + index,
      name: `${row.firstName} ${row.lastName}`.trim(),
      company: row.company,
      title: row.title || '',
      email: row.email,
      phone: row.phone || '',
      source: row.source || 'Website',
      status: 'New',
      score: row.score ? parseInt(row.score, 10) : Math.floor(Math.random() * 40) + 60,
      owner: 'Priya Sharma',
      initials: 'PS',
      createdAt: 'Just imported',
    }));
    setLeads((prev) => [...newLeads, ...prev]);
    
    // Log activity
    log("import", "lead", "Leads Import", `Imported ${newLeads.length} leads from CSV`, undefined, { recordCount: newLeads.length });
    
    toast.success(`${newLeads.length} leads imported successfully`);
  };

  const filteredLeads = leads.filter(
    (lead) =>
      lead.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      lead.company.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleAddNew = () => {
    setEditingLead(null);
    setIsDialogOpen(true);
  };

  const handleDelete = (lead: Lead) => {
    setLeadToDelete(lead);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = () => {
    if (leadToDelete) {
      setLeads(leads.filter(l => l.id !== leadToDelete.id));
      
      // Log activity
      log("delete", "lead", leadToDelete.name, `Deleted lead from ${leadToDelete.company}`, leadToDelete.id.toString());
      
      toast.success("Lead deleted", {
        description: `${leadToDelete.name} has been removed`,
      });
      setLeadToDelete(null);
    }
    setDeleteDialogOpen(false);
  };

  const handleEdit = (lead: Lead) => {
    setEditingLead({
      id: lead.id,
      name: lead.name,
      email: lead.email,
      phone: lead.phone,
      company: lead.company,
      title: lead.title,
      source: lead.source,
      owner: lead.owner,
    });
    setIsDialogOpen(true);
  };

  const handleSave = (data: LeadData) => {
    if (data.id) {
      // Update existing
      setLeads(leads.map(lead => 
        lead.id === data.id 
          ? { ...lead, ...data, initials: getInitials(data.owner || lead.owner) }
          : lead
      ));
    } else {
      // Add new
      const newLead: Lead = {
        id: Date.now(),
        name: data.name,
        company: data.company,
        title: data.title,
        email: data.email,
        phone: data.phone,
        source: data.source,
        status: "New",
        score: Math.floor(Math.random() * 40) + 60,
        owner: data.owner || "Priya Sharma",
        initials: getInitials(data.owner || "Priya Sharma"),
        createdAt: "Just now",
      };
      setLeads([newLead, ...leads]);
    }
  };

  return (
    <AppLayout title="Leads">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <div className="stat-card animate-slide-up">
          <p className="text-sm text-muted-foreground mb-1">Total Leads</p>
          <p className="text-2xl font-bold">{leads.length}</p>
          <p className="text-xs text-success mt-1">+23 this week</p>
        </div>
        <div className="stat-card animate-slide-up" style={{ animationDelay: "0.05s" }}>
          <p className="text-sm text-muted-foreground mb-1">New Today</p>
          <p className="text-2xl font-bold">{leads.filter(l => l.status === "New").length}</p>
          <p className="text-xs text-muted-foreground mt-1">Avg score: 78</p>
        </div>
        <div className="stat-card animate-slide-up" style={{ animationDelay: "0.1s" }}>
          <p className="text-sm text-muted-foreground mb-1">Conversion Rate</p>
          <p className="text-2xl font-bold">24%</p>
          <p className="text-xs text-success mt-1">+3% vs last month</p>
        </div>
        <div className="stat-card animate-slide-up" style={{ animationDelay: "0.15s" }}>
          <p className="text-sm text-muted-foreground mb-1">Avg Response Time</p>
          <p className="text-2xl font-bold">2.4h</p>
          <p className="text-xs text-success mt-1">-18% improved</p>
        </div>
      </div>

      {/* Toolbar */}
      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search leads..."
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
          <Button className="gap-2" onClick={handleAddNew}>
            <Plus className="h-4 w-4" />
            Add Lead
          </Button>
        </div>
      </div>

      {/* Table */}
      <div className="bg-card rounded-xl border border-border/50 overflow-hidden animate-fade-in">
        <Table>
          <TableHeader>
            <TableRow className="table-header hover:bg-muted/50">
              <TableHead className="w-[250px]">
                <div className="flex items-center gap-1">
                  Lead
                  <ArrowUpDown className="h-3 w-3" />
                </div>
              </TableHead>
              <TableHead>Company</TableHead>
              <TableHead>Source</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-center">
                <div className="flex items-center justify-center gap-1">
                  <Star className="h-3 w-3" />
                  Score
                </div>
              </TableHead>
              <TableHead>Owner</TableHead>
              <TableHead>Created</TableHead>
              <TableHead className="w-[100px]">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredLeads.map((lead) => (
              <TableRow key={lead.id} className="group cursor-pointer hover:bg-muted/30">
                <TableCell>
                  <div className="flex items-center gap-3">
                    <Avatar className="h-9 w-9">
                      <AvatarFallback className="bg-primary/10 text-primary text-xs font-medium">
                        {lead.name.split(" ").map((n) => n[0]).join("")}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-medium text-foreground group-hover:text-primary transition-colors">
                        {lead.name}
                      </p>
                      <p className="text-xs text-muted-foreground">{lead.title}</p>
                    </div>
                  </div>
                </TableCell>
                <TableCell className="font-medium">{lead.company}</TableCell>
                <TableCell className="text-muted-foreground">{lead.source}</TableCell>
                <TableCell>
                  <Badge
                    variant="outline"
                    className={cn("font-medium", getStatusColor(lead.status))}
                  >
                    {lead.status}
                  </Badge>
                </TableCell>
                <TableCell className="text-center">
                  <span className={cn("font-semibold", getScoreColor(lead.score))}>
                    {lead.score}
                  </span>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <Avatar className="h-6 w-6">
                      <AvatarFallback className="bg-muted text-muted-foreground text-[10px]">
                        {lead.initials}
                      </AvatarFallback>
                    </Avatar>
                    <span className="text-sm text-muted-foreground">{lead.owner}</span>
                  </div>
                </TableCell>
                <TableCell className="text-muted-foreground text-sm">
                  {lead.createdAt}
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <Button variant="ghost" size="icon" className="h-8 w-8">
                      <Phone className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon" className="h-8 w-8">
                      <Mail className="h-4 w-4" />
                    </Button>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem>View Details</DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleEdit(lead)}>
                          <Pencil className="h-4 w-4 mr-2" />
                          Edit Lead
                        </DropdownMenuItem>
                        <DropdownMenuItem>Convert to Opportunity</DropdownMenuItem>
                        <DropdownMenuItem>Log Activity</DropdownMenuItem>
                        <DropdownMenuItem 
                          onClick={() => handleDelete(lead)}
                          className="text-destructive focus:text-destructive"
                        >
                          <Trash2 className="h-4 w-4 mr-2" />
                          Delete Lead
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-between mt-4 text-sm text-muted-foreground">
        <p>Showing {filteredLeads.length} of {leads.length} leads</p>
      </div>

      <AddLeadDialog 
        open={isDialogOpen} 
        onOpenChange={setIsDialogOpen}
        editData={editingLead}
        onSave={handleSave}
      />

      <DeleteConfirmDialog
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        onConfirm={confirmDelete}
        title="Delete Lead"
        description="Are you sure you want to delete this lead? This action cannot be undone."
        itemName={leadToDelete?.name}
      />

      <CSVImportDialog
        open={importDialogOpen}
        onOpenChange={setImportDialogOpen}
        title="Import Leads"
        description="Upload a CSV file to bulk import leads with validation for email, phone, GSTIN, and more"
        fields={leadImportFields}
        onImport={handleImportLeads}
        templateFileName="leads_import_template.csv"
        duplicateCheckFields={['email']}
        existingData={existingLeadsForDuplicateCheck}
      />

      <ExportDialog
        open={exportDialogOpen}
        onOpenChange={setExportDialogOpen}
        data={filteredLeads}
        fields={leadExportFields}
        filename="leads-export"
        title="Export Leads"
        entityName="leads"
      />
    </AppLayout>
  );
}
