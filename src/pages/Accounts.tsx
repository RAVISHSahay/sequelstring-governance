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
import { 
  Search, 
  Filter, 
  Plus, 
  MoreHorizontal,
  Building2,
  ArrowUpDown,
  ExternalLink
} from "lucide-react";
import { cn } from "@/lib/utils";

const accounts = [
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
  const [searchQuery, setSearchQuery] = useState("");

  const filteredAccounts = accounts.filter((account) =>
    account.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

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
          <Button className="gap-2">
            <Plus className="h-4 w-4" />
            Add Account
          </Button>
        </div>
      </div>

      {/* Table */}
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
              <TableRow key={account.id} className="group cursor-pointer hover:bg-muted/30">
                <TableCell>
                  <div className="flex items-center gap-3">
                    <div className="h-9 w-9 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                      <Building2 className="h-4 w-4 text-primary" />
                    </div>
                    <div>
                      <p className="font-medium text-foreground group-hover:text-primary transition-colors">
                        {account.name}
                      </p>
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
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem>
                        <ExternalLink className="h-4 w-4 mr-2" />
                        View Details
                      </DropdownMenuItem>
                      <DropdownMenuItem>Edit Account</DropdownMenuItem>
                      <DropdownMenuItem>Add Opportunity</DropdownMenuItem>
                      <DropdownMenuItem>Add Contact</DropdownMenuItem>
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
    </AppLayout>
  );
}
