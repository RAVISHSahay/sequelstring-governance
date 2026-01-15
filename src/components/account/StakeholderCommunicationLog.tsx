import { useState, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Phone, 
  Mail, 
  Video, 
  Users, 
  MessageSquare, 
  Calendar,
  Plus,
  Search,
  Filter,
  Clock,
  ThumbsUp,
  ThumbsDown,
  Minus,
  FileText,
  Link2,
  ChevronRight,
  MapPin,
  Briefcase,
  Send,
  ExternalLink,
  MoreVertical,
  Pencil,
  Trash2,
  Star,
} from "lucide-react";
import { Stakeholder } from "@/types/account";
import { cn } from "@/lib/utils";
import { toast } from "@/hooks/use-toast";
import { format, formatDistanceToNow, isToday, isYesterday, isThisWeek } from "date-fns";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";

export type CommunicationType = 'call' | 'email' | 'meeting' | 'video_call' | 'site_visit' | 'message' | 'note';
export type CommunicationOutcome = 'positive' | 'neutral' | 'negative' | 'pending';

export interface CommunicationEntry {
  id: string;
  stakeholderId: string;
  stakeholderName: string;
  type: CommunicationType;
  subject: string;
  summary: string;
  outcome: CommunicationOutcome;
  date: Date;
  duration?: number; // minutes
  nextSteps?: string;
  linkedOpportunityId?: string;
  linkedOpportunityName?: string;
  createdBy: string;
  createdAt: Date;
  isKeyMoment?: boolean;
  attachments?: { name: string; url: string }[];
}

interface StakeholderCommunicationLogProps {
  stakeholders: Stakeholder[];
  accountName?: string;
  onSelectStakeholder?: (stakeholder: Stakeholder) => void;
}

const communicationTypeConfig: Record<CommunicationType, { icon: any; label: string; color: string; bgColor: string }> = {
  call: { icon: Phone, label: 'Call', color: 'text-blue-600', bgColor: 'bg-blue-100 dark:bg-blue-900' },
  email: { icon: Mail, label: 'Email', color: 'text-emerald-600', bgColor: 'bg-emerald-100 dark:bg-emerald-900' },
  meeting: { icon: Users, label: 'Meeting', color: 'text-purple-600', bgColor: 'bg-purple-100 dark:bg-purple-900' },
  video_call: { icon: Video, label: 'Video Call', color: 'text-cyan-600', bgColor: 'bg-cyan-100 dark:bg-cyan-900' },
  site_visit: { icon: MapPin, label: 'Site Visit', color: 'text-amber-600', bgColor: 'bg-amber-100 dark:bg-amber-900' },
  message: { icon: MessageSquare, label: 'Message', color: 'text-slate-600', bgColor: 'bg-slate-100 dark:bg-slate-800' },
  note: { icon: FileText, label: 'Note', color: 'text-gray-600', bgColor: 'bg-gray-100 dark:bg-gray-800' },
};

const outcomeConfig: Record<CommunicationOutcome, { icon: any; label: string; color: string }> = {
  positive: { icon: ThumbsUp, label: 'Positive', color: 'text-emerald-500' },
  neutral: { icon: Minus, label: 'Neutral', color: 'text-slate-500' },
  negative: { icon: ThumbsDown, label: 'Negative', color: 'text-red-500' },
  pending: { icon: Clock, label: 'Pending', color: 'text-amber-500' },
};

// Mock communication entries
const mockCommunications: CommunicationEntry[] = [
  {
    id: '1',
    stakeholderId: 'STK-001',
    stakeholderName: 'Rajesh Sharma',
    type: 'meeting',
    subject: 'Quarterly Business Review',
    summary: 'Discussed Q4 targets and expansion plans. CTO expressed interest in our analytics module. Budget discussions will happen in next fiscal.',
    outcome: 'positive',
    date: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
    duration: 60,
    nextSteps: 'Send proposal for analytics module by Friday',
    createdBy: 'Priya Sharma',
    createdAt: new Date(Date.now() - 1 * 60 * 60 * 1000),
    isKeyMoment: true,
  },
  {
    id: '2',
    stakeholderId: 'STK-002',
    stakeholderName: 'Anita Desai',
    type: 'email',
    subject: 'Technical Requirements Document',
    summary: 'Shared detailed technical requirements for the integration project. Awaiting feedback on API specifications.',
    outcome: 'neutral',
    date: new Date(Date.now() - 24 * 60 * 60 * 1000), // yesterday
    createdBy: 'Amit Kumar',
    createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000),
    linkedOpportunityId: 'OPP-001',
    linkedOpportunityName: 'ERP Integration Project',
  },
  {
    id: '3',
    stakeholderId: 'STK-003',
    stakeholderName: 'Suresh Kumar',
    type: 'call',
    subject: 'Procurement Timeline Discussion',
    summary: 'Discussed procurement process and timeline. Approval from finance committee expected by end of month. Need to submit compliance documents.',
    outcome: 'positive',
    date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), // 2 days ago
    duration: 25,
    nextSteps: 'Submit compliance certification by next week',
    createdBy: 'Priya Sharma',
    createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
  },
  {
    id: '4',
    stakeholderId: 'STK-001',
    stakeholderName: 'Rajesh Sharma',
    type: 'video_call',
    subject: 'Product Demo - Advanced Analytics',
    summary: 'Demonstrated new analytics features. Team was impressed with real-time dashboards. Some concerns about data migration complexity.',
    outcome: 'positive',
    date: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
    duration: 45,
    nextSteps: 'Schedule technical deep-dive with IT team',
    createdBy: 'Vikram Singh',
    createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
    linkedOpportunityId: 'OPP-002',
    linkedOpportunityName: 'Analytics Platform Upgrade',
    isKeyMoment: true,
  },
  {
    id: '5',
    stakeholderId: 'STK-004',
    stakeholderName: 'Meera Patel',
    type: 'site_visit',
    subject: 'Factory Floor Assessment',
    summary: 'Conducted on-site assessment of manufacturing floor. Identified 3 key areas for automation. Stakeholder alignment achieved on Phase 1 scope.',
    outcome: 'positive',
    date: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
    duration: 180,
    createdBy: 'Priya Sharma',
    createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
    isKeyMoment: true,
  },
  {
    id: '6',
    stakeholderId: 'STK-002',
    stakeholderName: 'Anita Desai',
    type: 'call',
    subject: 'Budget Constraints Discussion',
    summary: 'VP expressed concerns about current year budget. Suggested phased approach might work better. Need to revise proposal.',
    outcome: 'negative',
    date: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000),
    duration: 20,
    nextSteps: 'Prepare phased implementation proposal',
    createdBy: 'Priya Sharma',
    createdAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000),
  },
];

export function StakeholderCommunicationLog({ 
  stakeholders, 
  accountName = "Account",
  onSelectStakeholder 
}: StakeholderCommunicationLogProps) {
  const [communications, setCommunications] = useState<CommunicationEntry[]>(mockCommunications);
  const [filterType, setFilterType] = useState<string>('all');
  const [filterStakeholder, setFilterStakeholder] = useState<string>('all');
  const [filterOutcome, setFilterOutcome] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [addDialogOpen, setAddDialogOpen] = useState(false);
  const [selectedEntry, setSelectedEntry] = useState<CommunicationEntry | null>(null);
  const [viewMode, setViewMode] = useState<'timeline' | 'grouped'>('timeline');

  // New communication form state
  const [newEntry, setNewEntry] = useState<Partial<CommunicationEntry>>({
    type: 'call',
    outcome: 'pending',
    date: new Date(),
  });

  // Filter communications
  const filteredCommunications = useMemo(() => {
    return communications
      .filter(c => filterType === 'all' || c.type === filterType)
      .filter(c => filterStakeholder === 'all' || c.stakeholderId === filterStakeholder)
      .filter(c => filterOutcome === 'all' || c.outcome === filterOutcome)
      .filter(c => {
        if (!searchQuery) return true;
        const query = searchQuery.toLowerCase();
        return (
          c.subject.toLowerCase().includes(query) ||
          c.summary.toLowerCase().includes(query) ||
          c.stakeholderName.toLowerCase().includes(query)
        );
      })
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }, [communications, filterType, filterStakeholder, filterOutcome, searchQuery]);

  // Group by stakeholder for grouped view
  const groupedByStakeholder = useMemo(() => {
    const groups: Record<string, CommunicationEntry[]> = {};
    filteredCommunications.forEach(c => {
      if (!groups[c.stakeholderId]) {
        groups[c.stakeholderId] = [];
      }
      groups[c.stakeholderId].push(c);
    });
    return groups;
  }, [filteredCommunications]);

  // Get date label
  const getDateLabel = (date: Date) => {
    if (isToday(date)) return 'Today';
    if (isYesterday(date)) return 'Yesterday';
    if (isThisWeek(date)) return format(date, 'EEEE');
    return format(date, 'MMM d, yyyy');
  };

  // Handle save new entry
  const handleSaveEntry = () => {
    if (!newEntry.stakeholderId || !newEntry.subject || !newEntry.summary) {
      toast({ title: "Missing Fields", description: "Please fill in all required fields", variant: "destructive" });
      return;
    }

    const stakeholder = stakeholders.find(s => s.id === newEntry.stakeholderId);
    const entry: CommunicationEntry = {
      id: `comm_${Date.now()}`,
      stakeholderId: newEntry.stakeholderId,
      stakeholderName: stakeholder?.name || 'Unknown',
      type: newEntry.type as CommunicationType,
      subject: newEntry.subject || '',
      summary: newEntry.summary || '',
      outcome: newEntry.outcome as CommunicationOutcome,
      date: newEntry.date || new Date(),
      duration: newEntry.duration,
      nextSteps: newEntry.nextSteps,
      createdBy: 'Current User',
      createdAt: new Date(),
      isKeyMoment: newEntry.isKeyMoment,
    };

    setCommunications(prev => [entry, ...prev]);
    setAddDialogOpen(false);
    setNewEntry({ type: 'call', outcome: 'pending', date: new Date() });
    toast({ title: "Communication Logged", description: "The interaction has been recorded" });
  };

  // Handle delete entry
  const handleDeleteEntry = (id: string) => {
    setCommunications(prev => prev.filter(c => c.id !== id));
    setSelectedEntry(null);
    toast({ title: "Entry Deleted", description: "The communication log entry has been removed" });
  };

  // Stats
  const stats = useMemo(() => {
    const thisWeek = communications.filter(c => isThisWeek(new Date(c.date)));
    const positive = communications.filter(c => c.outcome === 'positive').length;
    const keyMoments = communications.filter(c => c.isKeyMoment).length;
    return {
      total: communications.length,
      thisWeek: thisWeek.length,
      positiveRate: communications.length > 0 ? Math.round((positive / communications.length) * 100) : 0,
      keyMoments,
    };
  }, [communications]);

  const getInitials = (name: string) => name.split(' ').map(n => n[0]).join('').toUpperCase();

  return (
    <>
      <Card className="w-full">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div className="flex items-center gap-2">
              <MessageSquare className="h-5 w-5 text-primary" />
              <CardTitle>Communication Log</CardTitle>
              <Badge variant="outline" className="ml-2">{filteredCommunications.length} entries</Badge>
            </div>
            <div className="flex items-center gap-2 flex-wrap">
              {/* Search */}
              <div className="relative">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search communications..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9 w-[200px]"
                />
              </div>

              {/* Filters */}
              <Select value={filterType} onValueChange={setFilterType}>
                <SelectTrigger className="w-[130px]">
                  <Filter className="h-4 w-4 mr-2" />
                  <SelectValue placeholder="Type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  {Object.entries(communicationTypeConfig).map(([type, config]) => (
                    <SelectItem key={type} value={type}>
                      <div className="flex items-center gap-2">
                        <config.icon className={cn("h-3 w-3", config.color)} />
                        {config.label}
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select value={filterStakeholder} onValueChange={setFilterStakeholder}>
                <SelectTrigger className="w-[150px]">
                  <Users className="h-4 w-4 mr-2" />
                  <SelectValue placeholder="Stakeholder" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Contacts</SelectItem>
                  {stakeholders.map(s => (
                    <SelectItem key={s.id} value={s.id}>{s.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>

              {/* View Toggle */}
              <Tabs value={viewMode} onValueChange={(v: any) => setViewMode(v)} className="w-auto">
                <TabsList className="h-9">
                  <TabsTrigger value="timeline" className="text-xs px-3">Timeline</TabsTrigger>
                  <TabsTrigger value="grouped" className="text-xs px-3">By Contact</TabsTrigger>
                </TabsList>
              </Tabs>

              {/* Add Button */}
              <Button onClick={() => setAddDialogOpen(true)} className="gap-1">
                <Plus className="h-4 w-4" />
                Log Interaction
              </Button>
            </div>
          </div>

          {/* Quick Stats */}
          <div className="flex gap-4 mt-4">
            <div className="flex items-center gap-2 px-3 py-1.5 bg-muted rounded-lg">
              <Calendar className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm"><strong>{stats.thisWeek}</strong> this week</span>
            </div>
            <div className="flex items-center gap-2 px-3 py-1.5 bg-muted rounded-lg">
              <ThumbsUp className="h-4 w-4 text-emerald-500" />
              <span className="text-sm"><strong>{stats.positiveRate}%</strong> positive</span>
            </div>
            <div className="flex items-center gap-2 px-3 py-1.5 bg-muted rounded-lg">
              <Star className="h-4 w-4 text-amber-500" />
              <span className="text-sm"><strong>{stats.keyMoments}</strong> key moments</span>
            </div>
          </div>
        </CardHeader>

        <CardContent>
          <ScrollArea className="h-[500px] pr-4">
            {viewMode === 'timeline' ? (
              <div className="space-y-3">
                {filteredCommunications.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-12 text-muted-foreground">
                    <MessageSquare className="h-12 w-12 mb-4 opacity-50" />
                    <p>No communications found</p>
                    <Button variant="outline" className="mt-4" onClick={() => setAddDialogOpen(true)}>
                      Log First Interaction
                    </Button>
                  </div>
                ) : (
                  filteredCommunications.map((entry, idx) => {
                    const config = communicationTypeConfig[entry.type];
                    const outcomeInfo = outcomeConfig[entry.outcome];
                    const TypeIcon = config.icon;
                    const OutcomeIcon = outcomeInfo.icon;
                    const showDateHeader = idx === 0 || 
                      getDateLabel(new Date(entry.date)) !== getDateLabel(new Date(filteredCommunications[idx - 1].date));

                    return (
                      <div key={entry.id}>
                        {showDateHeader && (
                          <div className="flex items-center gap-2 py-2">
                            <div className="h-px flex-1 bg-border" />
                            <span className="text-xs font-medium text-muted-foreground px-2">
                              {getDateLabel(new Date(entry.date))}
                            </span>
                            <div className="h-px flex-1 bg-border" />
                          </div>
                        )}
                        <div 
                          className={cn(
                            "group relative flex gap-3 p-3 rounded-lg border cursor-pointer transition-all hover:shadow-md",
                            entry.isKeyMoment && "border-amber-300 bg-amber-50/50 dark:bg-amber-900/10",
                            selectedEntry?.id === entry.id && "ring-2 ring-primary"
                          )}
                          onClick={() => setSelectedEntry(entry)}
                        >
                          {/* Type Icon */}
                          <div className={cn("flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center", config.bgColor)}>
                            <TypeIcon className={cn("h-5 w-5", config.color)} />
                          </div>

                          {/* Content */}
                          <div className="flex-1 min-w-0">
                            <div className="flex items-start justify-between gap-2">
                              <div>
                                <div className="flex items-center gap-2 flex-wrap">
                                  <span className="font-medium text-sm">{entry.subject}</span>
                                  {entry.isKeyMoment && (
                                    <Badge variant="outline" className="bg-amber-100 text-amber-700 border-amber-300 gap-1">
                                      <Star className="h-3 w-3" />
                                      Key Moment
                                    </Badge>
                                  )}
                                </div>
                                <div className="flex items-center gap-2 mt-0.5 text-xs text-muted-foreground">
                                  <span className="font-medium">{entry.stakeholderName}</span>
                                  <span>•</span>
                                  <span>{format(new Date(entry.date), 'h:mm a')}</span>
                                  {entry.duration && (
                                    <>
                                      <span>•</span>
                                      <span>{entry.duration} min</span>
                                    </>
                                  )}
                                </div>
                              </div>
                              <div className="flex items-center gap-2">
                                <div className={cn("flex items-center gap-1", outcomeInfo.color)}>
                                  <OutcomeIcon className="h-4 w-4" />
                                  <span className="text-xs">{outcomeInfo.label}</span>
                                </div>
                                <DropdownMenu>
                                  <DropdownMenuTrigger asChild>
                                    <Button variant="ghost" size="sm" className="h-7 w-7 p-0 opacity-0 group-hover:opacity-100">
                                      <MoreVertical className="h-4 w-4" />
                                    </Button>
                                  </DropdownMenuTrigger>
                                  <DropdownMenuContent align="end">
                                    <DropdownMenuItem className="gap-2">
                                      <Pencil className="h-4 w-4" />
                                      Edit
                                    </DropdownMenuItem>
                                    <DropdownMenuItem 
                                      className="gap-2 text-destructive" 
                                      onClick={(e) => { e.stopPropagation(); handleDeleteEntry(entry.id); }}
                                    >
                                      <Trash2 className="h-4 w-4" />
                                      Delete
                                    </DropdownMenuItem>
                                  </DropdownMenuContent>
                                </DropdownMenu>
                              </div>
                            </div>
                            <p className="text-sm text-muted-foreground mt-1 line-clamp-2">{entry.summary}</p>
                            {entry.nextSteps && (
                              <div className="flex items-center gap-1 mt-2 text-xs text-primary">
                                <ChevronRight className="h-3 w-3" />
                                <span className="font-medium">Next: {entry.nextSteps}</span>
                              </div>
                            )}
                            {entry.linkedOpportunityName && (
                              <div className="flex items-center gap-1 mt-1 text-xs text-muted-foreground">
                                <Link2 className="h-3 w-3" />
                                <span>{entry.linkedOpportunityName}</span>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            ) : (
              <div className="space-y-6">
                {Object.entries(groupedByStakeholder).map(([stakeholderId, entries]) => {
                  const stakeholder = stakeholders.find(s => s.id === stakeholderId);
                  const lastEntry = entries[0];
                  
                  return (
                    <div key={stakeholderId} className="border rounded-lg p-4">
                      <div className="flex items-center gap-3 mb-3">
                        <Avatar className="h-10 w-10">
                          <AvatarFallback className="bg-primary/10 text-primary">
                            {getInitials(entries[0].stakeholderName)}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1">
                          <h4 className="font-semibold">{entries[0].stakeholderName}</h4>
                          {stakeholder && (
                            <p className="text-xs text-muted-foreground">{stakeholder.title}</p>
                          )}
                        </div>
                        <div className="text-right">
                          <div className="text-sm font-medium">{entries.length} interactions</div>
                          <div className="text-xs text-muted-foreground">
                            Last: {formatDistanceToNow(new Date(lastEntry.date), { addSuffix: true })}
                          </div>
                        </div>
                      </div>
                      <Separator className="mb-3" />
                      <div className="space-y-2">
                        {entries.slice(0, 3).map(entry => {
                          const config = communicationTypeConfig[entry.type];
                          const TypeIcon = config.icon;
                          return (
                            <div 
                              key={entry.id} 
                              className="flex items-center gap-2 p-2 rounded hover:bg-muted cursor-pointer"
                              onClick={() => setSelectedEntry(entry)}
                            >
                              <div className={cn("p-1.5 rounded", config.bgColor)}>
                                <TypeIcon className={cn("h-3.5 w-3.5", config.color)} />
                              </div>
                              <span className="text-sm flex-1 truncate">{entry.subject}</span>
                              <span className="text-xs text-muted-foreground">
                                {format(new Date(entry.date), 'MMM d')}
                              </span>
                            </div>
                          );
                        })}
                        {entries.length > 3 && (
                          <Button variant="ghost" size="sm" className="w-full text-xs">
                            View all {entries.length} interactions
                          </Button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </ScrollArea>
        </CardContent>
      </Card>

      {/* Add Communication Dialog */}
      <Dialog open={addDialogOpen} onOpenChange={setAddDialogOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Log Stakeholder Interaction</DialogTitle>
            <DialogDescription>Record a communication with a key stakeholder</DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Stakeholder *</Label>
                <Select 
                  value={newEntry.stakeholderId} 
                  onValueChange={(v) => setNewEntry(prev => ({ ...prev, stakeholderId: v }))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select contact" />
                  </SelectTrigger>
                  <SelectContent>
                    {stakeholders.map(s => (
                      <SelectItem key={s.id} value={s.id}>
                        <div className="flex items-center gap-2">
                          <Avatar className="h-5 w-5">
                            <AvatarFallback className="text-[10px]">{getInitials(s.name)}</AvatarFallback>
                          </Avatar>
                          {s.name}
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Type *</Label>
                <Select 
                  value={newEntry.type} 
                  onValueChange={(v) => setNewEntry(prev => ({ ...prev, type: v as CommunicationType }))}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.entries(communicationTypeConfig).map(([type, config]) => (
                      <SelectItem key={type} value={type}>
                        <div className="flex items-center gap-2">
                          <config.icon className={cn("h-4 w-4", config.color)} />
                          {config.label}
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label>Subject *</Label>
              <Input 
                placeholder="Brief subject line"
                value={newEntry.subject || ''}
                onChange={(e) => setNewEntry(prev => ({ ...prev, subject: e.target.value }))}
              />
            </div>

            <div className="space-y-2">
              <Label>Summary *</Label>
              <Textarea 
                placeholder="Key points discussed, insights gathered..."
                rows={3}
                value={newEntry.summary || ''}
                onChange={(e) => setNewEntry(prev => ({ ...prev, summary: e.target.value }))}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Outcome</Label>
                <Select 
                  value={newEntry.outcome} 
                  onValueChange={(v) => setNewEntry(prev => ({ ...prev, outcome: v as CommunicationOutcome }))}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.entries(outcomeConfig).map(([outcome, config]) => (
                      <SelectItem key={outcome} value={outcome}>
                        <div className="flex items-center gap-2">
                          <config.icon className={cn("h-4 w-4", config.color)} />
                          {config.label}
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Duration (min)</Label>
                <Input 
                  type="number"
                  placeholder="Optional"
                  value={newEntry.duration || ''}
                  onChange={(e) => setNewEntry(prev => ({ ...prev, duration: parseInt(e.target.value) || undefined }))}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label>Next Steps</Label>
              <Input 
                placeholder="Follow-up actions..."
                value={newEntry.nextSteps || ''}
                onChange={(e) => setNewEntry(prev => ({ ...prev, nextSteps: e.target.value }))}
              />
            </div>

            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="keyMoment"
                checked={newEntry.isKeyMoment || false}
                onChange={(e) => setNewEntry(prev => ({ ...prev, isKeyMoment: e.target.checked }))}
                className="rounded border-gray-300"
              />
              <Label htmlFor="keyMoment" className="flex items-center gap-2 cursor-pointer">
                <Star className="h-4 w-4 text-amber-500" />
                Mark as Key Moment
              </Label>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setAddDialogOpen(false)}>Cancel</Button>
            <Button onClick={handleSaveEntry} className="gap-1">
              <Send className="h-4 w-4" />
              Log Interaction
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Entry Detail Dialog */}
      <Dialog open={!!selectedEntry} onOpenChange={() => setSelectedEntry(null)}>
        <DialogContent className="max-w-lg">
          {selectedEntry && (
            <>
              <DialogHeader>
                <div className="flex items-center gap-2">
                  {(() => {
                    const config = communicationTypeConfig[selectedEntry.type];
                    const TypeIcon = config.icon;
                    return (
                      <div className={cn("p-2 rounded-lg", config.bgColor)}>
                        <TypeIcon className={cn("h-5 w-5", config.color)} />
                      </div>
                    );
                  })()}
                  <div>
                    <DialogTitle>{selectedEntry.subject}</DialogTitle>
                    <DialogDescription>
                      {selectedEntry.stakeholderName} • {format(new Date(selectedEntry.date), 'PPp')}
                    </DialogDescription>
                  </div>
                </div>
              </DialogHeader>

              <div className="space-y-4 py-4">
                <div className="flex items-center gap-4">
                  {(() => {
                    const outcomeInfo = outcomeConfig[selectedEntry.outcome];
                    const OutcomeIcon = outcomeInfo.icon;
                    return (
                      <Badge variant="outline" className={cn("gap-1", outcomeInfo.color)}>
                        <OutcomeIcon className="h-3 w-3" />
                        {outcomeInfo.label} Outcome
                      </Badge>
                    );
                  })()}
                  {selectedEntry.duration && (
                    <Badge variant="secondary" className="gap-1">
                      <Clock className="h-3 w-3" />
                      {selectedEntry.duration} minutes
                    </Badge>
                  )}
                  {selectedEntry.isKeyMoment && (
                    <Badge variant="outline" className="bg-amber-100 text-amber-700 border-amber-300 gap-1">
                      <Star className="h-3 w-3" />
                      Key Moment
                    </Badge>
                  )}
                </div>

                <div>
                  <Label className="text-xs text-muted-foreground">Summary</Label>
                  <p className="text-sm mt-1">{selectedEntry.summary}</p>
                </div>

                {selectedEntry.nextSteps && (
                  <div className="p-3 bg-primary/5 rounded-lg border border-primary/20">
                    <Label className="text-xs text-primary flex items-center gap-1">
                      <ChevronRight className="h-3 w-3" />
                      Next Steps
                    </Label>
                    <p className="text-sm mt-1">{selectedEntry.nextSteps}</p>
                  </div>
                )}

                {selectedEntry.linkedOpportunityName && (
                  <div className="flex items-center gap-2 p-2 bg-muted rounded">
                    <Link2 className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm">Linked to: <strong>{selectedEntry.linkedOpportunityName}</strong></span>
                  </div>
                )}

                <Separator />

                <div className="flex items-center justify-between text-xs text-muted-foreground">
                  <span>Logged by {selectedEntry.createdBy}</span>
                  <span>{format(new Date(selectedEntry.createdAt), 'PPp')}</span>
                </div>
              </div>

              <DialogFooter>
                <Button variant="outline" onClick={() => handleDeleteEntry(selectedEntry.id)} className="text-destructive">
                  <Trash2 className="h-4 w-4 mr-1" />
                  Delete
                </Button>
                <Button variant="outline" onClick={() => setSelectedEntry(null)}>Close</Button>
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}
