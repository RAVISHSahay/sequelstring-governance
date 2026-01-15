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
import { Search, Filter, Plus, MoreHorizontal, Phone, Mail, Linkedin, Edit2, Trash2, Upload, Download } from "lucide-react";
import { cn } from "@/lib/utils";
import { AddContactDialog } from "@/components/dialogs/AddContactDialog";
import { DeleteConfirmDialog } from "@/components/dialogs/DeleteConfirmDialog";
import { CSVImportDialog } from "@/components/dialogs/CSVImportDialog";
import { exportToCSV } from "@/lib/csvExport";
import { toast } from "sonner";

interface Contact {
  id: number;
  name: string;
  title: string;
  account: string;
  email: string;
  phone: string;
  role: string;
  influence: string;
  lastContact: string;
}

const initialContacts: Contact[] = [
  {
    id: 1,
    name: "Rajesh Sharma",
    title: "CTO",
    account: "Tata Steel Ltd",
    email: "rajesh.sharma@tatasteel.com",
    phone: "+91 98765 43210",
    role: "Decision Maker",
    influence: "High",
    lastContact: "2 days ago",
  },
  {
    id: 2,
    name: "Priya Menon",
    title: "VP Engineering",
    account: "Reliance Industries",
    email: "priya.menon@ril.com",
    phone: "+91 87654 32109",
    role: "Technical Buyer",
    influence: "High",
    lastContact: "1 week ago",
  },
  {
    id: 3,
    name: "Amit Patel",
    title: "Director IT",
    account: "HDFC Bank",
    email: "amit.patel@hdfc.com",
    phone: "+91 76543 21098",
    role: "Economic Buyer",
    influence: "Medium",
    lastContact: "3 days ago",
  },
  {
    id: 4,
    name: "Sunita Reddy",
    title: "Head of Procurement",
    account: "Infosys Ltd",
    email: "sunita.r@infosys.com",
    phone: "+91 65432 10987",
    role: "Champion",
    influence: "High",
    lastContact: "Today",
  },
  {
    id: 5,
    name: "Vikram Singh",
    title: "CEO",
    account: "Mahindra Group",
    email: "vikram.s@mahindra.com",
    phone: "+91 54321 09876",
    role: "Executive Sponsor",
    influence: "Critical",
    lastContact: "1 month ago",
  },
];

const getRoleColor = (role: string) => {
  switch (role) {
    case "Decision Maker":
      return "bg-primary/10 text-primary border-primary/20";
    case "Executive Sponsor":
      return "bg-accent/10 text-accent border-accent/20";
    case "Champion":
      return "bg-success/10 text-success border-success/20";
    case "Technical Buyer":
      return "bg-info/10 text-info border-info/20";
    default:
      return "bg-muted text-muted-foreground border-border";
  }
};

const getInfluenceColor = (influence: string) => {
  switch (influence) {
    case "Critical":
      return "text-destructive";
    case "High":
      return "text-accent";
    case "Medium":
      return "text-info";
    default:
      return "text-muted-foreground";
  }
};

export default function Contacts() {
  const [contacts, setContacts] = useState<Contact[]>(initialContacts);
  const [searchQuery, setSearchQuery] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [dialogMode, setDialogMode] = useState<'create' | 'edit'>('create');
  const [selectedContact, setSelectedContact] = useState<Contact | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [importDialogOpen, setImportDialogOpen] = useState(false);

  const contactImportFields = [
    { name: 'firstName', label: 'First Name', required: true },
    { name: 'lastName', label: 'Last Name', required: true },
    { name: 'title', label: 'Job Title', required: false },
    { name: 'account', label: 'Account', required: true },
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
    { name: 'role', label: 'Contact Role', required: false },
    { name: 'influence', label: 'Influence Level', required: false },
  ];

  // Prepare existing data for duplicate detection
  const existingContactsForDuplicateCheck = contacts.map((c) => ({
    email: c.email,
  }));

  const filteredContacts = contacts.filter(
    (contact) =>
      contact.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      contact.account.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleAddContact = () => {
    setSelectedContact(null);
    setDialogMode('create');
    setDialogOpen(true);
  };

  const handleEditContact = (contact: Contact) => {
    setSelectedContact(contact);
    setDialogMode('edit');
    setDialogOpen(true);
  };

  const handleDeleteContact = (contact: Contact) => {
    setSelectedContact(contact);
    setDeleteDialogOpen(true);
  };

  const handleSaveContact = (contact: Contact) => {
    if (dialogMode === 'create') {
      setContacts((prev) => [...prev, contact]);
      toast.success(`Contact ${contact.name} added successfully`);
    } else {
      setContacts((prev) =>
        prev.map((c) => (c.id === contact.id ? contact : c))
      );
      toast.success(`Contact ${contact.name} updated successfully`);
    }
  };

  const handleConfirmDelete = () => {
    if (selectedContact) {
      setContacts((prev) => prev.filter((c) => c.id !== selectedContact.id));
      toast.success(`Contact ${selectedContact.name} deleted`);
      setDeleteDialogOpen(false);
      setSelectedContact(null);
    }
  };

  const handleImportContacts = (data: Record<string, string>[]) => {
    const newContacts: Contact[] = data.map((row, index) => ({
      id: Date.now() + index,
      name: `${row.firstName} ${row.lastName}`.trim(),
      title: row.title || '',
      account: row.account,
      email: row.email,
      phone: row.phone || '',
      role: row.role || 'Influencer',
      influence: row.influence || 'Medium',
      lastContact: 'Just imported',
    }));
    setContacts((prev) => [...prev, ...newContacts]);
    toast.success(`${newContacts.length} contacts imported successfully`);
  };

  return (
    <AppLayout title="Contacts">
      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search contacts..."
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
            onClick={() => {
              exportToCSV({
                data: filteredContacts,
                columns: [
                  { key: 'name', header: 'Name' },
                  { key: 'title', header: 'Title' },
                  { key: 'account', header: 'Account' },
                  { key: 'email', header: 'Email' },
                  { key: 'phone', header: 'Phone' },
                  { key: 'role', header: 'Role' },
                  { key: 'influence', header: 'Influence' },
                  { key: 'lastContact', header: 'Last Contact' },
                ],
                filename: 'contacts-export',
              });
              toast.success(`Exported ${filteredContacts.length} contacts to CSV`);
            }}
          >
            <Download className="h-4 w-4" />
            Export
          </Button>
          <Button variant="outline" className="gap-2" onClick={() => setImportDialogOpen(true)}>
            <Upload className="h-4 w-4" />
            Import
          </Button>
          <Button className="gap-2" onClick={handleAddContact}>
            <Plus className="h-4 w-4" />
            Add Contact
          </Button>
        </div>
      </div>

      <div className="bg-card rounded-xl border border-border/50 overflow-hidden animate-fade-in">
        <Table>
          <TableHeader>
            <TableRow className="table-header hover:bg-muted/50">
              <TableHead className="w-[250px]">Contact</TableHead>
              <TableHead>Account</TableHead>
              <TableHead>Role</TableHead>
              <TableHead className="text-center">Influence</TableHead>
              <TableHead>Last Contact</TableHead>
              <TableHead className="w-[120px]">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredContacts.map((contact) => (
              <TableRow key={contact.id} className="group cursor-pointer hover:bg-muted/30">
                <TableCell>
                  <div className="flex items-center gap-3">
                    <Avatar className="h-10 w-10">
                      <AvatarFallback className="bg-primary/10 text-primary text-sm font-medium">
                        {contact.name.split(" ").map((n) => n[0]).join("")}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-medium text-foreground">{contact.name}</p>
                      <p className="text-sm text-muted-foreground">{contact.title}</p>
                    </div>
                  </div>
                </TableCell>
                <TableCell className="text-muted-foreground">{contact.account}</TableCell>
                <TableCell>
                  <Badge variant="outline" className={cn("font-medium", getRoleColor(contact.role))}>
                    {contact.role}
                  </Badge>
                </TableCell>
                <TableCell className="text-center">
                  <span className={cn("font-semibold", getInfluenceColor(contact.influence))}>
                    {contact.influence}
                  </span>
                </TableCell>
                <TableCell className="text-muted-foreground">{contact.lastContact}</TableCell>
                <TableCell>
                  <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100">
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
                        <DropdownMenuItem onClick={() => handleEditContact(contact)}>
                          <Edit2 className="h-4 w-4 mr-2" />
                          Edit Contact
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <Linkedin className="h-4 w-4 mr-2" />
                          View LinkedIn
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => handleDeleteContact(contact)}
                          className="text-destructive focus:text-destructive"
                        >
                          <Trash2 className="h-4 w-4 mr-2" />
                          Delete Contact
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

      <AddContactDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        onSave={handleSaveContact}
        contact={selectedContact}
        mode={dialogMode}
      />

      <DeleteConfirmDialog
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        title="Delete Contact"
        description={`Are you sure you want to delete ${selectedContact?.name}? This action cannot be undone.`}
        onConfirm={handleConfirmDelete}
      />

      <CSVImportDialog
        open={importDialogOpen}
        onOpenChange={setImportDialogOpen}
        title="Import Contacts"
        description="Upload a CSV file to bulk import contacts into your CRM"
        fields={contactImportFields}
        onImport={handleImportContacts}
        templateFileName="contacts_import_template.csv"
        duplicateCheckFields={['email']}
        existingData={existingContactsForDuplicateCheck}
      />
    </AppLayout>
  );
}
