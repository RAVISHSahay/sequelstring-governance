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
} from "lucide-react";
import { cn } from "@/lib/utils";
import { AddLeadDialog, LeadData } from "@/components/dialogs/AddLeadDialog";

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

  const filteredLeads = leads.filter(
    (lead) =>
      lead.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      lead.company.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleAddNew = () => {
    setEditingLead(null);
    setIsDialogOpen(true);
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
    </AppLayout>
  );
}
