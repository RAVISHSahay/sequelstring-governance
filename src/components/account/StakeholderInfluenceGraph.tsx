import { useMemo, useState, useCallback, useRef, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Slider } from "@/components/ui/slider";
import { Separator } from "@/components/ui/separator";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { 
  ZoomIn, 
  ZoomOut, 
  Maximize2, 
  Users, 
  Building2, 
  Star,
  Crown,
  Shield,
  Target,
  UserCheck,
  AlertTriangle,
  ThumbsUp,
  ThumbsDown,
  Minus,
  Phone,
  Mail,
  Linkedin,
  Eye,
  EyeOff,
  Filter,
  Zap,
  Network,
  Info,
  Link2,
  Unlink,
  Pencil,
  Trash2,
  Plus,
  MousePointer,
  Move,
  GripVertical,
  Save,
  RotateCcw,
} from "lucide-react";
import { Stakeholder, ContactRelationship, RelationshipType, ContactRole } from "@/types/account";
import { cn } from "@/lib/utils";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { toast } from "@/hooks/use-toast";

interface StakeholderInfluenceGraphProps {
  stakeholders: Stakeholder[];
  relationships?: ContactRelationship[];
  accountName?: string;
  onStakeholderSelect?: (stakeholder: Stakeholder | null) => void;
  onRelationshipsChange?: (relationships: ContactRelationship[]) => void;
}

const relationshipColors: Record<RelationshipType, { stroke: string; label: string }> = {
  reports_to: { stroke: '#3b82f6', label: 'Reports To' },
  influences: { stroke: '#8b5cf6', label: 'Influences' },
  collaborates_with: { stroke: '#10b981', label: 'Collaborates' },
  competes_with: { stroke: '#ef4444', label: 'Competes' },
  partner: { stroke: '#f59e0b', label: 'Partner' },
  consultant: { stroke: '#06b6d4', label: 'Consultant' },
  vendor: { stroke: '#64748b', label: 'Vendor' },
  procurement_authority: { stroke: '#ec4899', label: 'Procurement' },
};

const roleConfig: Record<ContactRole, { icon: any; color: string; bgColor: string; label: string }> = {
  economic_buyer: { icon: Crown, color: 'text-purple-600', bgColor: 'bg-purple-100 dark:bg-purple-900', label: 'Economic Buyer' },
  technical_approver: { icon: Shield, color: 'text-blue-600', bgColor: 'bg-blue-100 dark:bg-blue-900', label: 'Technical Approver' },
  influencer: { icon: Star, color: 'text-amber-600', bgColor: 'bg-amber-100 dark:bg-amber-900', label: 'Influencer' },
  gatekeeper: { icon: UserCheck, color: 'text-slate-600', bgColor: 'bg-slate-100 dark:bg-slate-800', label: 'Gatekeeper' },
  user: { icon: Users, color: 'text-cyan-600', bgColor: 'bg-cyan-100 dark:bg-cyan-900', label: 'User' },
  champion: { icon: Target, color: 'text-emerald-600', bgColor: 'bg-emerald-100 dark:bg-emerald-900', label: 'Champion' },
  executive_sponsor: { icon: Crown, color: 'text-indigo-600', bgColor: 'bg-indigo-100 dark:bg-indigo-900', label: 'Executive Sponsor' },
  procurement: { icon: Shield, color: 'text-rose-600', bgColor: 'bg-rose-100 dark:bg-rose-900', label: 'Procurement' },
};

const sentimentConfig = {
  positive: { icon: ThumbsUp, color: 'text-emerald-500', bgColor: 'bg-emerald-100 dark:bg-emerald-900', label: 'Positive' },
  neutral: { icon: Minus, color: 'text-slate-500', bgColor: 'bg-slate-100 dark:bg-slate-800', label: 'Neutral' },
  negative: { icon: ThumbsDown, color: 'text-red-500', bgColor: 'bg-red-100 dark:bg-red-900', label: 'Negative' },
  unknown: { icon: Info, color: 'text-slate-400', bgColor: 'bg-slate-100 dark:bg-slate-800', label: 'Unknown' },
};

// Initial mock relationships
const initialMockRelationships: ContactRelationship[] = [
  { id: '1', sourceContactId: 'STK-001', targetContactId: 'STK-002', relationshipType: 'reports_to', strength: 8, description: 'Direct Report' },
  { id: '2', sourceContactId: 'STK-001', targetContactId: 'STK-003', relationshipType: 'influences', strength: 7, description: 'Budget Influence' },
  { id: '3', sourceContactId: 'STK-002', targetContactId: 'STK-004', relationshipType: 'collaborates_with', strength: 6, description: 'Project Team' },
  { id: '4', sourceContactId: 'STK-003', targetContactId: 'STK-005', relationshipType: 'reports_to', strength: 9, description: 'Functional Head' },
  { id: '5', sourceContactId: 'STK-004', targetContactId: 'STK-001', relationshipType: 'influences', strength: 5, description: 'Technical Advisor' },
  { id: '6', sourceContactId: 'STK-005', targetContactId: 'STK-002', relationshipType: 'collaborates_with', strength: 7, description: 'Cross-functional' },
];

export function StakeholderInfluenceGraph({ 
  stakeholders, 
  relationships: externalRelationships,
  accountName = "Account",
  onStakeholderSelect,
  onRelationshipsChange
}: StakeholderInfluenceGraphProps) {
  const svgRef = useRef<SVGSVGElement>(null);
  
  // Core state
  const [zoom, setZoom] = useState(1);
  const [viewMode, setViewMode] = useState<'influence' | 'hierarchy' | 'sentiment'>('influence');
  const [selectedNode, setSelectedNode] = useState<string | null>(null);
  const [hoveredNode, setHoveredNode] = useState<string | null>(null);
  const [showRelationships, setShowRelationships] = useState(true);
  const [filterRole, setFilterRole] = useState<string>('all');
  const [dragOffset] = useState({ x: 0, y: 0 });
  
  // Connection editing state
  const [editMode, setEditMode] = useState<'select' | 'connect' | 'drag'>('select');
  const [connectingFrom, setConnectingFrom] = useState<string | null>(null);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [localRelationships, setLocalRelationships] = useState<ContactRelationship[]>(externalRelationships || initialMockRelationships);
  
  // Drag state
  const [draggingNode, setDraggingNode] = useState<string | null>(null);
  const [customPositions, setCustomPositions] = useState<Record<string, { x: number; y: number }>>({});
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const dragStartRef = useRef<{ x: number; y: number; nodeX: number; nodeY: number } | null>(null);
  
  // Layout storage key based on account name
  const layoutStorageKey = `stakeholder-layout-${accountName.replace(/\s+/g, '-').toLowerCase()}`;
  
  // Load saved positions on mount
  useEffect(() => {
    const saved = localStorage.getItem(layoutStorageKey);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        setCustomPositions(parsed);
      } catch (e) {
        console.error('Failed to parse saved layout:', e);
      }
    }
  }, [layoutStorageKey]);
  
  // Relationship dialog state
  const [relationshipDialogOpen, setRelationshipDialogOpen] = useState(false);
  const [editingRelationship, setEditingRelationship] = useState<ContactRelationship | null>(null);
  const [newRelationship, setNewRelationship] = useState<Partial<ContactRelationship>>({
    relationshipType: 'collaborates_with',
    strength: 5,
    description: '',
  });

  const relationships = localRelationships;
  
  const svgWidth = 900;
  const svgHeight = 650;
  const centerX = svgWidth / 2;
  const centerY = svgHeight / 2;

  // Filter stakeholders
  const filteredStakeholders = useMemo(() => {
    if (filterRole === 'all') return stakeholders;
    return stakeholders.filter(s => s.primaryRole === filterRole || s.roles.includes(filterRole as ContactRole));
  }, [stakeholders, filterRole]);

  // Calculate base node positions (algorithmic layout)
  const baseNodePositions = useMemo(() => {
    const positions: Record<string, { x: number; y: number; tier: number }> = {};
    
    if (viewMode === 'influence') {
      const sorted = [...filteredStakeholders].sort((a, b) => 
        (b.powerScore + b.influenceScore) - (a.powerScore + a.influenceScore)
      );
      
      sorted.forEach((s) => {
        const combinedScore = (s.powerScore + s.influenceScore) / 2;
        const tier = combinedScore >= 8 ? 0 : combinedScore >= 5 ? 1 : 2;
        const tierMembers = sorted.filter(st => {
          const score = (st.powerScore + st.influenceScore) / 2;
          return tier === 0 ? score >= 8 : tier === 1 ? (score >= 5 && score < 8) : score < 5;
        });
        const tierIdx = tierMembers.findIndex(t => t.id === s.id);
        
        const radius = 80 + tier * 130;
        const angle = (2 * Math.PI * tierIdx) / tierMembers.length - Math.PI / 2;
        
        positions[s.id] = {
          x: centerX + radius * Math.cos(angle),
          y: centerY + radius * Math.sin(angle),
          tier,
        };
      });
    } else if (viewMode === 'hierarchy') {
      const tiers: Record<string, number> = {
        final: 0, strong_influence: 1, recommender: 2, evaluator: 3, none: 4,
      };
      
      const grouped = filteredStakeholders.reduce((acc, s) => {
        const tier = tiers[s.decisionAuthority] ?? 4;
        if (!acc[tier]) acc[tier] = [];
        acc[tier].push(s);
        return acc;
      }, {} as Record<number, Stakeholder[]>);
      
      Object.entries(grouped).forEach(([tier, members]) => {
        const tierNum = parseInt(tier);
        const yPos = 80 + tierNum * 110;
        const startX = centerX - ((members.length - 1) * 100) / 2;
        members.forEach((member, idx) => {
          positions[member.id] = { x: startX + idx * 100, y: yPos, tier: tierNum };
        });
      });
    } else {
      const sentimentGroups = { positive: [], neutral: [], negative: [], unknown: [] } as Record<string, Stakeholder[]>;
      filteredStakeholders.forEach(s => sentimentGroups[s.sentiment].push(s));
      
      const groupPositions = {
        positive: { x: centerX - 200, y: centerY },
        neutral: { x: centerX, y: centerY - 100 },
        negative: { x: centerX + 200, y: centerY },
        unknown: { x: centerX, y: centerY + 150 },
      };
      
      Object.entries(sentimentGroups).forEach(([sentiment, members]) => {
        const base = groupPositions[sentiment as keyof typeof groupPositions];
        members.forEach((member, idx) => {
          const angle = (2 * Math.PI * idx) / Math.max(members.length, 1);
          const radius = members.length > 1 ? 80 : 0;
          positions[member.id] = { x: base.x + radius * Math.cos(angle), y: base.y + radius * Math.sin(angle), tier: 0 };
        });
      });
    }
    
    return positions;
  }, [filteredStakeholders, viewMode, centerX, centerY]);

  // Merge custom positions with base positions
  const nodePositions = useMemo(() => {
    const positions: Record<string, { x: number; y: number; tier: number }> = {};
    
    Object.entries(baseNodePositions).forEach(([id, basePos]) => {
      if (customPositions[id]) {
        positions[id] = {
          ...basePos,
          x: customPositions[id].x,
          y: customPositions[id].y,
        };
      } else {
        positions[id] = basePos;
      }
    });
    
    return positions;
  }, [baseNodePositions, customPositions]);

  const getInitials = (name: string) => name.split(' ').map(n => n[0]).join('').toUpperCase();

  // Handle node click in different modes
  const handleNodeClick = useCallback((stakeholder: Stakeholder) => {
    if (editMode === 'drag') {
      // In drag mode, clicking just selects for info display
      const newSelected = selectedNode === stakeholder.id ? null : stakeholder.id;
      setSelectedNode(newSelected);
      onStakeholderSelect?.(newSelected ? stakeholder : null);
    } else if (editMode === 'connect') {
      if (!connectingFrom) {
        setConnectingFrom(stakeholder.id);
        toast({ title: "Connection Started", description: `Click another stakeholder to connect from ${stakeholder.name}` });
      } else if (connectingFrom !== stakeholder.id) {
        // Check if relationship already exists
        const existingRel = relationships.find(r => 
          (r.sourceContactId === connectingFrom && r.targetContactId === stakeholder.id) ||
          (r.sourceContactId === stakeholder.id && r.targetContactId === connectingFrom)
        );
        
        if (existingRel) {
          toast({ title: "Relationship Exists", description: "Edit the existing relationship instead", variant: "destructive" });
          setConnectingFrom(null);
          return;
        }
        
        // Open dialog to create new relationship
        setNewRelationship({
          sourceContactId: connectingFrom,
          targetContactId: stakeholder.id,
          relationshipType: 'collaborates_with',
          strength: 5,
          description: '',
        });
        setEditingRelationship(null);
        setRelationshipDialogOpen(true);
        setConnectingFrom(null);
      } else {
        setConnectingFrom(null);
      }
    } else {
      const newSelected = selectedNode === stakeholder.id ? null : stakeholder.id;
      setSelectedNode(newSelected);
      onStakeholderSelect?.(newSelected ? stakeholder : null);
    }
  }, [editMode, connectingFrom, selectedNode, relationships, onStakeholderSelect]);

  // Drag handlers
  const handleDragStart = useCallback((stakeholderId: string, e: React.MouseEvent) => {
    if (editMode !== 'drag' || !svgRef.current) return;
    
    e.preventDefault();
    e.stopPropagation();
    
    const rect = svgRef.current.getBoundingClientRect();
    const currentPos = nodePositions[stakeholderId];
    
    dragStartRef.current = {
      x: e.clientX,
      y: e.clientY,
      nodeX: currentPos?.x ?? 0,
      nodeY: currentPos?.y ?? 0,
    };
    
    setDraggingNode(stakeholderId);
  }, [editMode, nodePositions]);

  const handleDragMove = useCallback((e: React.MouseEvent<SVGSVGElement>) => {
    if (!draggingNode || !dragStartRef.current || !svgRef.current) return;
    
    const rect = svgRef.current.getBoundingClientRect();
    const scaleX = svgWidth / rect.width / zoom;
    const scaleY = svgHeight / rect.height / zoom;
    
    const deltaX = (e.clientX - dragStartRef.current.x) * scaleX;
    const deltaY = (e.clientY - dragStartRef.current.y) * scaleY;
    
    const newX = Math.max(50, Math.min(svgWidth - 50, dragStartRef.current.nodeX + deltaX));
    const newY = Math.max(50, Math.min(svgHeight - 50, dragStartRef.current.nodeY + deltaY));
    
    setCustomPositions(prev => ({
      ...prev,
      [draggingNode]: { x: newX, y: newY },
    }));
    setHasUnsavedChanges(true);
  }, [draggingNode, zoom, svgWidth, svgHeight]);

  const handleDragEnd = useCallback(() => {
    if (draggingNode) {
      setDraggingNode(null);
      dragStartRef.current = null;
    }
  }, [draggingNode]);

  // Save layout to localStorage
  const handleSaveLayout = useCallback(() => {
    localStorage.setItem(layoutStorageKey, JSON.stringify(customPositions));
    setHasUnsavedChanges(false);
    toast({ title: "Layout Saved", description: "Your custom layout has been saved" });
  }, [customPositions, layoutStorageKey]);

  // Reset layout to default
  const handleResetLayout = useCallback(() => {
    setCustomPositions({});
    localStorage.removeItem(layoutStorageKey);
    setHasUnsavedChanges(false);
    toast({ title: "Layout Reset", description: "Layout has been reset to default" });
  }, [layoutStorageKey]);

  // Handle relationship line click
  const handleRelationshipClick = useCallback((rel: ContactRelationship, e: React.MouseEvent) => {
    e.stopPropagation();
    setEditingRelationship(rel);
    setNewRelationship({
      sourceContactId: rel.sourceContactId,
      targetContactId: rel.targetContactId,
      relationshipType: rel.relationshipType,
      strength: rel.strength,
      description: rel.description,
    });
    setRelationshipDialogOpen(true);
  }, []);

  // Save relationship
  const handleSaveRelationship = useCallback(() => {
    if (!newRelationship.sourceContactId || !newRelationship.targetContactId || !newRelationship.relationshipType) return;
    
    if (editingRelationship) {
      // Update existing
      const updated = relationships.map(r => 
        r.id === editingRelationship.id 
          ? { ...r, ...newRelationship } 
          : r
      );
      setLocalRelationships(updated);
      onRelationshipsChange?.(updated);
      toast({ title: "Relationship Updated", description: "The relationship has been updated" });
    } else {
      // Create new
      const newRel: ContactRelationship = {
        id: `rel_${Date.now()}`,
        sourceContactId: newRelationship.sourceContactId,
        targetContactId: newRelationship.targetContactId,
        relationshipType: newRelationship.relationshipType as RelationshipType,
        strength: newRelationship.strength || 5,
        description: newRelationship.description || '',
      };
      const updated = [...relationships, newRel];
      setLocalRelationships(updated);
      onRelationshipsChange?.(updated);
      toast({ title: "Relationship Created", description: "New relationship has been added" });
    }
    
    setRelationshipDialogOpen(false);
    setEditingRelationship(null);
    setNewRelationship({ relationshipType: 'collaborates_with', strength: 5, description: '' });
  }, [editingRelationship, newRelationship, relationships, onRelationshipsChange]);

  // Delete relationship
  const handleDeleteRelationship = useCallback(() => {
    if (!editingRelationship) return;
    
    const updated = relationships.filter(r => r.id !== editingRelationship.id);
    setLocalRelationships(updated);
    onRelationshipsChange?.(updated);
    toast({ title: "Relationship Deleted", description: "The relationship has been removed" });
    setRelationshipDialogOpen(false);
    setEditingRelationship(null);
  }, [editingRelationship, relationships, onRelationshipsChange]);

  // Track mouse for connection line and drag
  const handleMouseMove = useCallback((e: React.MouseEvent<SVGSVGElement>) => {
    // Handle drag move
    if (draggingNode) {
      handleDragMove(e);
      return;
    }
    
    if (!svgRef.current || !connectingFrom) return;
    const rect = svgRef.current.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * svgWidth;
    const y = ((e.clientY - rect.top) / rect.height) * svgHeight;
    setMousePosition({ x, y });
  }, [draggingNode, handleDragMove, connectingFrom, svgWidth, svgHeight]);

  // Cancel connection mode
  const handleSvgClick = useCallback((e: React.MouseEvent) => {
    if (e.target === svgRef.current && connectingFrom) {
      setConnectingFrom(null);
    }
  }, [connectingFrom]);

  // Get source/target stakeholder names for dialog
  const getStakeholderName = useCallback((id: string) => {
    return stakeholders.find(s => s.id === id)?.name || 'Unknown';
  }, [stakeholders]);

  // Risk indicators
  const riskIndicators = useMemo(() => {
    const risks: { type: string; severity: 'high' | 'medium' | 'low'; message: string }[] = [];
    const negativeHighInfluence = stakeholders.filter(s => s.sentiment === 'negative' && s.influenceScore >= 7);
    if (negativeHighInfluence.length > 0) {
      risks.push({ type: 'blocker', severity: 'high', message: `${negativeHighInfluence.length} high-influence blocker(s)` });
    }
    if (!stakeholders.some(s => s.primaryRole === 'champion' || s.roles.includes('champion'))) {
      risks.push({ type: 'champion', severity: 'high', message: 'No champion identified' });
    }
    if (!stakeholders.some(s => s.primaryRole === 'economic_buyer' || s.roles.includes('economic_buyer'))) {
      risks.push({ type: 'buyer', severity: 'medium', message: 'Economic buyer not mapped' });
    }
    return risks;
  }, [stakeholders]);

  const selectedStakeholder = stakeholders.find(s => s.id === selectedNode);
  const connectingFromStakeholder = connectingFrom ? stakeholders.find(s => s.id === connectingFrom) : null;
  const connectingFromPos = connectingFrom ? nodePositions[connectingFrom] : null;

  return (
    <>
      <Card className="w-full">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div className="flex items-center gap-2">
              <Network className="h-5 w-5 text-primary" />
              <CardTitle>Stakeholder Influence Map</CardTitle>
              <Badge variant="outline" className="ml-2">{filteredStakeholders.length} contacts</Badge>
            </div>
            <div className="flex items-center gap-2 flex-wrap">
              {/* Edit Mode Toggle */}
              <div className="flex items-center gap-1 border rounded-md p-0.5">
                <Button
                  variant={editMode === 'select' ? 'secondary' : 'ghost'}
                  size="sm"
                  onClick={() => { setEditMode('select'); setConnectingFrom(null); setDraggingNode(null); }}
                  className="gap-1"
                >
                  <MousePointer className="h-3.5 w-3.5" />
                  Select
                </Button>
                <Button
                  variant={editMode === 'connect' ? 'secondary' : 'ghost'}
                  size="sm"
                  onClick={() => { setEditMode('connect'); setSelectedNode(null); setDraggingNode(null); }}
                  className="gap-1"
                >
                  <Link2 className="h-3.5 w-3.5" />
                  Connect
                </Button>
                <Button
                  variant={editMode === 'drag' ? 'secondary' : 'ghost'}
                  size="sm"
                  onClick={() => { setEditMode('drag'); setConnectingFrom(null); }}
                  className="gap-1"
                >
                  <GripVertical className="h-3.5 w-3.5" />
                  Drag
                </Button>
              </div>
              
              {/* Layout Controls - only visible in drag mode or when there are custom positions */}
              {(editMode === 'drag' || Object.keys(customPositions).length > 0) && (
                <div className="flex items-center gap-1 border rounded-md p-0.5">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleSaveLayout}
                    disabled={!hasUnsavedChanges}
                    className="gap-1"
                  >
                    <Save className="h-3.5 w-3.5" />
                    Save
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleResetLayout}
                    disabled={Object.keys(customPositions).length === 0}
                    className="gap-1"
                  >
                    <RotateCcw className="h-3.5 w-3.5" />
                    Reset
                  </Button>
                </div>
              )}
              
              <Select value={filterRole} onValueChange={setFilterRole}>
                <SelectTrigger className="w-[140px]">
                  <Filter className="h-4 w-4 mr-2" />
                  <SelectValue placeholder="Filter" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Roles</SelectItem>
                  {Object.entries(roleConfig).map(([role, config]) => (
                    <SelectItem key={role} value={role}>
                      <div className="flex items-center gap-2">
                        <config.icon className={cn("h-3 w-3", config.color)} />
                        {config.label}
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              
              <Tabs value={viewMode} onValueChange={(v: any) => setViewMode(v)} className="w-auto">
                <TabsList className="h-9">
                  <TabsTrigger value="influence" className="text-xs px-3">
                    <Zap className="h-3 w-3 mr-1" />Influence
                  </TabsTrigger>
                  <TabsTrigger value="hierarchy" className="text-xs px-3">
                    <Network className="h-3 w-3 mr-1" />Hierarchy
                  </TabsTrigger>
                  <TabsTrigger value="sentiment" className="text-xs px-3">
                    <ThumbsUp className="h-3 w-3 mr-1" />Sentiment
                  </TabsTrigger>
                </TabsList>
              </Tabs>
              
              <Button variant={showRelationships ? "secondary" : "outline"} size="sm" onClick={() => setShowRelationships(!showRelationships)}>
                {showRelationships ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
              </Button>
              
              <div className="flex items-center gap-1 border rounded-md">
                <Button variant="ghost" size="sm" onClick={() => setZoom(z => Math.max(0.5, z - 0.1))}>
                  <ZoomOut className="h-4 w-4" />
                </Button>
                <span className="text-xs px-2 min-w-[45px] text-center">{Math.round(zoom * 100)}%</span>
                <Button variant="ghost" size="sm" onClick={() => setZoom(z => Math.min(1.5, z + 0.1))}>
                  <ZoomIn className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="sm" onClick={() => setZoom(1)}>
                  <Maximize2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
          
          {/* Connection Mode Indicator */}
          {editMode === 'connect' && (
            <div className="flex items-center gap-2 mt-3 p-2 bg-primary/10 rounded-lg">
              <Link2 className="h-4 w-4 text-primary" />
              <span className="text-sm font-medium text-primary">
                {connectingFrom 
                  ? `Connecting from ${connectingFromStakeholder?.name}... Click another node to complete`
                  : 'Click a node to start creating a relationship'
                }
              </span>
              {connectingFrom && (
                <Button variant="ghost" size="sm" className="ml-auto h-7" onClick={() => setConnectingFrom(null)}>
                  Cancel
                </Button>
              )}
            </div>
          )}
          
          {/* Drag Mode Indicator */}
          {editMode === 'drag' && (
            <div className="flex items-center gap-2 mt-3 p-2 bg-amber-500/10 rounded-lg">
              <GripVertical className="h-4 w-4 text-amber-600" />
              <span className="text-sm font-medium text-amber-700 dark:text-amber-400">
                {draggingNode 
                  ? 'Dragging... Release to place the node'
                  : 'Drag nodes to reposition them. Click Save to persist your layout.'
                }
              </span>
              {hasUnsavedChanges && (
                <Badge variant="outline" className="ml-auto bg-amber-100 text-amber-700 border-amber-300">
                  Unsaved changes
                </Badge>
              )}
            </div>
          )}
          
          {/* Risk Alerts */}
          {riskIndicators.length > 0 && editMode === 'select' && (
            <div className="flex flex-wrap gap-2 mt-3">
              {riskIndicators.map((risk, idx) => (
                <Badge key={idx} variant="outline" className={cn(
                  risk.severity === 'high' && 'bg-red-100 text-red-700 border-red-300 dark:bg-red-900/50',
                  risk.severity === 'medium' && 'bg-amber-100 text-amber-700 border-amber-300 dark:bg-amber-900/50',
                )}>
                  <AlertTriangle className="h-3 w-3 mr-1" />{risk.message}
                </Badge>
              ))}
            </div>
          )}
        </CardHeader>
        
        <CardContent>
          <div className="relative overflow-hidden border rounded-lg bg-gradient-to-br from-muted/30 to-muted/10" style={{ height: 550 }}>
            <TooltipProvider>
              <svg 
                ref={svgRef}
                width="100%" 
                height="100%" 
                viewBox={`${-dragOffset.x / zoom} ${-dragOffset.y / zoom} ${svgWidth / zoom} ${svgHeight / zoom}`}
                className={cn(
                  "transition-all duration-200", 
                  editMode === 'connect' && "cursor-crosshair",
                  editMode === 'drag' && !draggingNode && "cursor-grab",
                  draggingNode && "cursor-grabbing"
                )}
                onMouseMove={handleMouseMove}
                onMouseUp={handleDragEnd}
                onMouseLeave={handleDragEnd}
                onClick={handleSvgClick}
              >
                <defs>
                  {Object.entries(relationshipColors).map(([type, config]) => (
                    <linearGradient key={type} id={`grad-${type}`} x1="0%" y1="0%" x2="100%" y2="0%">
                      <stop offset="0%" stopColor={config.stroke} stopOpacity="0.3" />
                      <stop offset="50%" stopColor={config.stroke} stopOpacity="0.7" />
                      <stop offset="100%" stopColor={config.stroke} stopOpacity="0.3" />
                    </linearGradient>
                  ))}
                  <marker id="arrowhead" markerWidth="10" markerHeight="7" refX="9" refY="3.5" orient="auto">
                    <polygon points="0 0, 10 3.5, 0 7" className="fill-muted-foreground/50" />
                  </marker>
                  <marker id="arrowhead-active" markerWidth="10" markerHeight="7" refX="9" refY="3.5" orient="auto">
                    <polygon points="0 0, 10 3.5, 0 7" className="fill-primary" />
                  </marker>
                </defs>

                {/* Central Account Node */}
                <g transform={`translate(${centerX}, ${centerY})`}>
                  <circle r="55" className="fill-primary/5 stroke-primary/30 stroke-2" />
                  <circle r="45" className="fill-background stroke-primary stroke-2" />
                  <foreignObject x="-35" y="-25" width="70" height="50">
                    <div className="flex flex-col items-center justify-center h-full">
                      <Building2 className="h-6 w-6 text-primary" />
                      <span className="text-[10px] font-semibold text-center truncate max-w-[60px] mt-1">{accountName}</span>
                    </div>
                  </foreignObject>
                </g>

                {/* Tier/Sentiment labels */}
                {viewMode === 'hierarchy' && (
                  <>
                    <text x="50" y="85" className="fill-muted-foreground text-[10px] font-medium">Final Decision</text>
                    <text x="50" y="195" className="fill-muted-foreground text-[10px] font-medium">Strong Influence</text>
                    <text x="50" y="305" className="fill-muted-foreground text-[10px] font-medium">Recommender</text>
                    <text x="50" y="415" className="fill-muted-foreground text-[10px] font-medium">Evaluator</text>
                  </>
                )}
                {viewMode === 'sentiment' && (
                  <>
                    <text x={centerX - 200} y="100" textAnchor="middle" className="fill-emerald-500 text-xs font-medium">Supporters</text>
                    <text x={centerX} y="100" textAnchor="middle" className="fill-slate-500 text-xs font-medium">Neutral</text>
                    <text x={centerX + 200} y="100" textAnchor="middle" className="fill-red-500 text-xs font-medium">Blockers</text>
                  </>
                )}

                {/* Relationship Lines */}
                {showRelationships && relationships.map(rel => {
                  const source = nodePositions[rel.sourceContactId];
                  const target = nodePositions[rel.targetContactId];
                  if (!source || !target) return null;
                  
                  const isHighlighted = selectedNode === rel.sourceContactId || selectedNode === rel.targetContactId;
                  const config = relationshipColors[rel.relationshipType];
                  const midX = (source.x + target.x) / 2;
                  const midY = (source.y + target.y) / 2;
                  const dx = target.x - source.x;
                  const dy = target.y - source.y;
                  const perpX = -dy * 0.15;
                  const perpY = dx * 0.15;
                  
                  return (
                    <g key={rel.id} className={cn("transition-opacity cursor-pointer group", !isHighlighted && selectedNode && "opacity-20")}>
                      {/* Invisible wider path for easier clicking */}
                      <path
                        d={`M ${source.x} ${source.y} Q ${midX + perpX} ${midY + perpY} ${target.x} ${target.y}`}
                        fill="none"
                        stroke="transparent"
                        strokeWidth={20}
                        onClick={(e) => handleRelationshipClick(rel, e)}
                        className="cursor-pointer"
                      />
                      <path
                        d={`M ${source.x} ${source.y} Q ${midX + perpX} ${midY + perpY} ${target.x} ${target.y}`}
                        fill="none"
                        stroke={config.stroke}
                        strokeWidth={Math.max(2, rel.strength / 3)}
                        strokeOpacity={isHighlighted ? 0.8 : 0.5}
                        strokeDasharray={rel.relationshipType === 'influences' ? '6,4' : undefined}
                        markerEnd="url(#arrowhead)"
                        className="transition-all group-hover:stroke-[3px] group-hover:opacity-100"
                        onClick={(e) => handleRelationshipClick(rel, e)}
                      />
                      {/* Edit indicator on hover */}
                      <g transform={`translate(${midX + perpX}, ${midY + perpY})`} className="opacity-0 group-hover:opacity-100 transition-opacity" onClick={(e) => handleRelationshipClick(rel, e)}>
                        <circle r="12" className="fill-background stroke-2" stroke={config.stroke} />
                        <foreignObject x="-6" y="-6" width="12" height="12">
                          <Pencil className="h-3 w-3 text-muted-foreground" />
                        </foreignObject>
                      </g>
                    </g>
                  );
                })}

                {/* Connection line being drawn */}
                {connectingFrom && connectingFromPos && (
                  <line
                    x1={connectingFromPos.x}
                    y1={connectingFromPos.y}
                    x2={mousePosition.x}
                    y2={mousePosition.y}
                    stroke="hsl(var(--primary))"
                    strokeWidth={2}
                    strokeDasharray="8,4"
                    markerEnd="url(#arrowhead-active)"
                    className="pointer-events-none"
                  />
                )}

                {/* Stakeholder Nodes */}
                {filteredStakeholders.map(stakeholder => {
                  const pos = nodePositions[stakeholder.id];
                  if (!pos) return null;
                  
                  const isSelected = selectedNode === stakeholder.id;
                  const isHovered = hoveredNode === stakeholder.id;
                  const isConnecting = connectingFrom === stakeholder.id;
                  const isDragging = draggingNode === stakeholder.id;
                  const hasCustomPosition = !!customPositions[stakeholder.id];
                  const isRelated = selectedNode && relationships.some(r => 
                    (r.sourceContactId === selectedNode && r.targetContactId === stakeholder.id) ||
                    (r.targetContactId === selectedNode && r.sourceContactId === stakeholder.id)
                  );
                  const isDimmed = selectedNode && !isSelected && !isRelated;
                  
                  const baseSize = 28;
                  const powerBonus = stakeholder.powerScore * 1.5;
                  const nodeSize = baseSize + powerBonus;
                  
                  const roleInfo = roleConfig[stakeholder.primaryRole];
                  const sentimentInfo = sentimentConfig[stakeholder.sentiment];
                  const RoleIcon = roleInfo.icon;
                  
                  return (
                    <Tooltip key={stakeholder.id}>
                      <TooltipTrigger asChild>
                        <g 
                          transform={`translate(${pos.x}, ${pos.y})`}
                          className={cn(
                            "transition-all",
                            !isDragging && "duration-200",
                            isDimmed && "opacity-30",
                            isConnecting && "animate-pulse",
                            editMode === 'drag' && "cursor-grab",
                            isDragging && "cursor-grabbing"
                          )}
                          onClick={() => !isDragging && handleNodeClick(stakeholder)}
                          onMouseDown={(e) => handleDragStart(stakeholder.id, e)}
                          onMouseEnter={() => setHoveredNode(stakeholder.id)}
                          onMouseLeave={() => setHoveredNode(null)}
                        >
                          {/* Dragging indicator */}
                          {isDragging && (
                            <circle r={nodeSize + 15} fill="none" strokeWidth={2} className="stroke-primary stroke-dashed" strokeDasharray="8,4" />
                          )}
                          
                          {/* Custom position indicator */}
                          {hasCustomPosition && editMode === 'drag' && !isDragging && (
                            <circle r={nodeSize + 12} fill="none" strokeWidth={1} className="stroke-amber-400/50" strokeDasharray="4,4" />
                          )}
                          
                          {/* Connecting indicator ring */}
                          {isConnecting && (
                            <circle r={nodeSize + 12} fill="none" strokeWidth={3} className="stroke-primary animate-ping" />
                          )}
                          
                          {/* Outer influence ring */}
                          <circle r={nodeSize + 8} fill="none" strokeWidth={3} stroke={roleInfo.color.replace('text-', '#').replace('-600', '')} strokeDasharray={`${stakeholder.influenceScore * 6.28} 100`} strokeLinecap="round" className="opacity-40" transform="rotate(-90)" />
                          
                          {/* Selection/hover ring */}
                          {(isSelected || isHovered || isConnecting) && (
                            <circle r={nodeSize + 4} fill="none" strokeWidth={2} className={cn("transition-all", isSelected || isConnecting ? "stroke-primary" : "stroke-muted-foreground/50")} />
                          )}
                          
                          {/* Main node */}
                          <circle r={nodeSize} className={cn(
                            "fill-background stroke-2 transition-all",
                            stakeholder.sentiment === 'negative' && "stroke-red-400",
                            stakeholder.sentiment === 'positive' && "stroke-emerald-400",
                            stakeholder.sentiment === 'neutral' && "stroke-slate-300 dark:stroke-slate-600",
                            stakeholder.sentiment === 'unknown' && "stroke-slate-300 dark:stroke-slate-600",
                          )} />
                          
                          {/* Avatar & Name */}
                          <foreignObject x={-16} y={-20} width={32} height={44}>
                            <div className="flex flex-col items-center">
                              <Avatar className="h-7 w-7 border-2 border-background">
                                <AvatarFallback className={cn("text-[10px] font-medium", roleInfo.bgColor, roleInfo.color)}>
                                  {getInitials(stakeholder.name)}
                                </AvatarFallback>
                              </Avatar>
                              <span className="text-[9px] font-medium text-center mt-0.5 line-clamp-1 max-w-[50px] truncate">{stakeholder.name.split(' ')[0]}</span>
                              <span className="text-[8px] text-muted-foreground truncate max-w-[50px]">{stakeholder.title.split(' ')[0]}</span>
                            </div>
                          </foreignObject>
                          
                          {/* Role badge */}
                          <g transform={`translate(${nodeSize - 8}, ${-nodeSize + 8})`}>
                            <circle r="10" className={cn("fill-background stroke-2", roleInfo.color.replace('text-', 'stroke-'))} />
                            <foreignObject x="-6" y="-6" width="12" height="12">
                              <RoleIcon className={cn("h-3 w-3", roleInfo.color)} />
                            </foreignObject>
                          </g>
                          
                          {/* Champion star */}
                          {(stakeholder.primaryRole === 'champion' || stakeholder.roles.includes('champion')) && (
                            <g transform={`translate(${-nodeSize + 5}, ${-nodeSize + 5})`}>
                              <Star className="fill-amber-400 text-amber-500" width={14} height={14} />
                            </g>
                          )}
                          
                          {/* Sentiment indicator */}
                          <g transform={`translate(0, ${nodeSize + 12})`}>
                            <circle r="8" className={cn("fill-background", sentimentInfo.bgColor)} />
                            <foreignObject x="-5" y="-5" width="10" height="10">
                              <sentimentInfo.icon className={cn("h-2.5 w-2.5", sentimentInfo.color)} />
                            </foreignObject>
                          </g>
                          
                          {/* Power score */}
                          <g transform={`translate(${nodeSize + 12}, 0)`}>
                            <rect x="-8" y="-8" width="16" height="16" rx="3" className="fill-muted" />
                            <text x="0" y="4" textAnchor="middle" className="fill-foreground text-[9px] font-bold">{stakeholder.powerScore}</text>
                          </g>
                        </g>
                      </TooltipTrigger>
                      <TooltipContent side="top" className="max-w-xs">
                        <p className="font-semibold">{stakeholder.name}</p>
                        <p className="text-xs text-muted-foreground">{stakeholder.title}</p>
                        <p className="text-xs mt-1">Power: {stakeholder.powerScore} • Influence: {stakeholder.influenceScore}</p>
                        {editMode === 'connect' && <p className="text-xs text-primary mt-1">Click to {connectingFrom ? 'connect' : 'start connection'}</p>}
                        {editMode === 'drag' && <p className="text-xs text-amber-600 mt-1">Drag to reposition{customPositions[stakeholder.id] ? ' • Has custom position' : ''}</p>}
                      </TooltipContent>
                    </Tooltip>
                  );
                })}
              </svg>
            </TooltipProvider>

            {/* Selected Node Details */}
            {selectedStakeholder && editMode === 'select' && (
              <div className="absolute bottom-4 left-4 right-4 bg-background/95 backdrop-blur-sm border rounded-xl p-4 shadow-lg animate-in slide-in-from-bottom-2">
                <div className="flex items-start gap-4">
                  <Avatar className="h-14 w-14 border-2">
                    <AvatarFallback className={cn(roleConfig[selectedStakeholder.primaryRole].bgColor, roleConfig[selectedStakeholder.primaryRole].color)}>
                      {getInitials(selectedStakeholder.name)}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h4 className="font-semibold text-lg">{selectedStakeholder.name}</h4>
                      {selectedStakeholder.isKeyContact && (
                        <Badge variant="secondary" className="gap-1"><Star className="h-3 w-3 text-amber-500 fill-amber-400" />Key</Badge>
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground">{selectedStakeholder.title} • {selectedStakeholder.department}</p>
                    <div className="flex flex-wrap gap-1.5 mt-2">
                      {selectedStakeholder.roles.map(role => {
                        const config = roleConfig[role];
                        return <Badge key={role} variant="outline" className={cn("text-xs gap-1", config.bgColor, config.color)}><config.icon className="h-3 w-3" />{config.label}</Badge>;
                      })}
                    </div>
                  </div>
                  <Separator orientation="vertical" className="h-16" />
                  <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-sm">
                    <div><span className="text-muted-foreground text-xs">Power</span><p className="font-bold">{selectedStakeholder.powerScore}/10</p></div>
                    <div><span className="text-muted-foreground text-xs">Influence</span><p className="font-bold">{selectedStakeholder.influenceScore}/10</p></div>
                    <div><span className="text-muted-foreground text-xs">Authority</span><p className="font-medium capitalize text-xs">{selectedStakeholder.decisionAuthority.replace('_', ' ')}</p></div>
                    <div><span className="text-muted-foreground text-xs">Relationship</span><Badge variant="outline" className="text-xs">{selectedStakeholder.relationshipStrength}</Badge></div>
                  </div>
                  <div className="flex flex-col gap-1">
                    <Button variant="outline" size="sm" className="gap-1"><Mail className="h-3 w-3" />Email</Button>
                    <Button variant="outline" size="sm" className="gap-1"><Phone className="h-3 w-3" />Call</Button>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Legend */}
          <div className="flex flex-wrap items-center gap-6 mt-4 text-xs text-muted-foreground">
            <div className="flex items-center gap-3">
              <span className="font-medium text-foreground">Relationships:</span>
              {Object.entries(relationshipColors).slice(0, 4).map(([type, config]) => (
                <div key={type} className="flex items-center gap-1">
                  <div className="w-4 h-0.5 rounded" style={{ backgroundColor: config.stroke }} />
                  <span>{config.label}</span>
                </div>
              ))}
            </div>
            <Separator orientation="vertical" className="h-4" />
            <span className="text-muted-foreground">Click lines to edit • Use Connect mode to create new relationships</span>
          </div>
        </CardContent>
      </Card>

      {/* Relationship Edit Dialog */}
      <Dialog open={relationshipDialogOpen} onOpenChange={setRelationshipDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Link2 className="h-5 w-5 text-primary" />
              {editingRelationship ? 'Edit Relationship' : 'Create Relationship'}
            </DialogTitle>
            <DialogDescription>
              {newRelationship.sourceContactId && newRelationship.targetContactId && (
                <span className="flex items-center gap-2 mt-2">
                  <Badge variant="outline">{getStakeholderName(newRelationship.sourceContactId)}</Badge>
                  <span>→</span>
                  <Badge variant="outline">{getStakeholderName(newRelationship.targetContactId)}</Badge>
                </span>
              )}
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label>Relationship Type</Label>
              <Select 
                value={newRelationship.relationshipType} 
                onValueChange={(v) => setNewRelationship(prev => ({ ...prev, relationshipType: v as RelationshipType }))}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {Object.entries(relationshipColors).map(([type, config]) => (
                    <SelectItem key={type} value={type}>
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full" style={{ backgroundColor: config.stroke }} />
                        {config.label}
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label>Relationship Strength</Label>
                <span className="text-sm font-medium">{newRelationship.strength}/10</span>
              </div>
              <Slider
                value={[newRelationship.strength || 5]}
                onValueChange={([v]) => setNewRelationship(prev => ({ ...prev, strength: v }))}
                min={1}
                max={10}
                step={1}
              />
              <p className="text-xs text-muted-foreground">How strong is this relationship?</p>
            </div>
            
            <div className="space-y-2">
              <Label>Description</Label>
              <Input
                placeholder="e.g., Direct manager, Budget authority..."
                value={newRelationship.description || ''}
                onChange={(e) => setNewRelationship(prev => ({ ...prev, description: e.target.value }))}
              />
            </div>
          </div>
          
          <DialogFooter className="flex justify-between">
            {editingRelationship && (
              <Button variant="destructive" onClick={handleDeleteRelationship} className="mr-auto">
                <Trash2 className="h-4 w-4 mr-2" />
                Delete
              </Button>
            )}
            <div className="flex gap-2">
              <Button variant="outline" onClick={() => setRelationshipDialogOpen(false)}>Cancel</Button>
              <Button onClick={handleSaveRelationship}>
                {editingRelationship ? 'Update' : 'Create'} Relationship
              </Button>
            </div>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
