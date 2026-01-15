import { useMemo, useState, useCallback } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Slider } from "@/components/ui/slider";
import { Separator } from "@/components/ui/separator";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
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
  TrendingUp,
  TrendingDown,
  Eye,
  EyeOff,
  Filter,
  Zap,
  Network,
  Info,
} from "lucide-react";
import { Stakeholder, ContactRelationship, RelationshipType, ContactRole } from "@/types/account";
import { cn } from "@/lib/utils";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

interface StakeholderInfluenceGraphProps {
  stakeholders: Stakeholder[];
  relationships?: ContactRelationship[];
  accountName?: string;
  onStakeholderSelect?: (stakeholder: Stakeholder | null) => void;
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

// Mock relationships
const mockRelationships: ContactRelationship[] = [
  { id: '1', sourceContactId: 'STK-001', targetContactId: 'STK-002', relationshipType: 'reports_to', strength: 8, description: 'Direct Report' },
  { id: '2', sourceContactId: 'STK-001', targetContactId: 'STK-003', relationshipType: 'influences', strength: 7, description: 'Budget Influence' },
  { id: '3', sourceContactId: 'STK-002', targetContactId: 'STK-004', relationshipType: 'collaborates_with', strength: 6, description: 'Project Team' },
  { id: '4', sourceContactId: 'STK-003', targetContactId: 'STK-005', relationshipType: 'reports_to', strength: 9, description: 'Functional Head' },
  { id: '5', sourceContactId: 'STK-004', targetContactId: 'STK-001', relationshipType: 'influences', strength: 5, description: 'Technical Advisor' },
  { id: '6', sourceContactId: 'STK-005', targetContactId: 'STK-002', relationshipType: 'collaborates_with', strength: 7, description: 'Cross-functional' },
];

export function StakeholderInfluenceGraph({ 
  stakeholders, 
  relationships = mockRelationships, 
  accountName = "Account",
  onStakeholderSelect 
}: StakeholderInfluenceGraphProps) {
  const [zoom, setZoom] = useState(1);
  const [viewMode, setViewMode] = useState<'influence' | 'hierarchy' | 'sentiment'>('influence');
  const [selectedNode, setSelectedNode] = useState<string | null>(null);
  const [hoveredNode, setHoveredNode] = useState<string | null>(null);
  const [showRelationships, setShowRelationships] = useState(true);
  const [filterRole, setFilterRole] = useState<string>('all');
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  
  const svgWidth = 900;
  const svgHeight = 650;
  const centerX = svgWidth / 2;
  const centerY = svgHeight / 2;

  // Filter stakeholders based on role
  const filteredStakeholders = useMemo(() => {
    if (filterRole === 'all') return stakeholders;
    return stakeholders.filter(s => s.primaryRole === filterRole || s.roles.includes(filterRole as ContactRole));
  }, [stakeholders, filterRole]);

  // Calculate node positions based on view mode
  const nodePositions = useMemo(() => {
    const positions: Record<string, { x: number; y: number; tier: number }> = {};
    
    if (viewMode === 'influence') {
      // Position by influence/power scores - higher scores closer to center
      const sorted = [...filteredStakeholders].sort((a, b) => 
        (b.powerScore + b.influenceScore) - (a.powerScore + a.influenceScore)
      );
      
      sorted.forEach((s, idx) => {
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
      // Position by decision authority
      const tiers: Record<string, number> = {
        final: 0,
        strong_influence: 1,
        recommender: 2,
        evaluator: 3,
        none: 4,
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
          positions[member.id] = {
            x: startX + idx * 100,
            y: yPos,
            tier: tierNum,
          };
        });
      });
    } else {
      // Sentiment view - group by sentiment
      const sentimentGroups = { positive: [], neutral: [], negative: [], unknown: [] } as Record<string, Stakeholder[]>;
      filteredStakeholders.forEach(s => {
        sentimentGroups[s.sentiment].push(s);
      });
      
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
          positions[member.id] = {
            x: base.x + radius * Math.cos(angle),
            y: base.y + radius * Math.sin(angle),
            tier: 0,
          };
        });
      });
    }
    
    return positions;
  }, [filteredStakeholders, viewMode, centerX, centerY]);

  const getInitials = (name: string) => name.split(' ').map(n => n[0]).join('').toUpperCase();

  const handleNodeClick = useCallback((stakeholder: Stakeholder) => {
    const newSelected = selectedNode === stakeholder.id ? null : stakeholder.id;
    setSelectedNode(newSelected);
    onStakeholderSelect?.(newSelected ? stakeholder : null);
  }, [selectedNode, onStakeholderSelect]);

  // Get risk indicators
  const riskIndicators = useMemo(() => {
    const risks: { type: string; severity: 'high' | 'medium' | 'low'; message: string }[] = [];
    
    const negativeHighInfluence = stakeholders.filter(s => s.sentiment === 'negative' && s.influenceScore >= 7);
    if (negativeHighInfluence.length > 0) {
      risks.push({
        type: 'blocker',
        severity: 'high',
        message: `${negativeHighInfluence.length} high-influence blocker(s) detected`,
      });
    }
    
    const noChampion = !stakeholders.some(s => s.primaryRole === 'champion' || s.roles.includes('champion'));
    if (noChampion) {
      risks.push({
        type: 'champion',
        severity: 'high',
        message: 'No champion identified in this account',
      });
    }
    
    const noEconomicBuyer = !stakeholders.some(s => s.primaryRole === 'economic_buyer' || s.roles.includes('economic_buyer'));
    if (noEconomicBuyer) {
      risks.push({
        type: 'buyer',
        severity: 'medium',
        message: 'Economic buyer not mapped',
      });
    }
    
    const coldRelationships = stakeholders.filter(s => s.relationshipStrength === 'cold' && s.isKeyContact);
    if (coldRelationships.length > 0) {
      risks.push({
        type: 'relationship',
        severity: 'medium',
        message: `${coldRelationships.length} key contact(s) with cold relationship`,
      });
    }
    
    return risks;
  }, [stakeholders]);

  const selectedStakeholder = stakeholders.find(s => s.id === selectedNode);

  return (
    <Card className="w-full">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div className="flex items-center gap-2">
            <Network className="h-5 w-5 text-primary" />
            <CardTitle>Stakeholder Influence Map</CardTitle>
            <Badge variant="outline" className="ml-2">
              {filteredStakeholders.length} contacts
            </Badge>
          </div>
          <div className="flex items-center gap-2 flex-wrap">
            <Select value={filterRole} onValueChange={setFilterRole}>
              <SelectTrigger className="w-[150px]">
                <Filter className="h-4 w-4 mr-2" />
                <SelectValue placeholder="Filter role" />
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
                  <Zap className="h-3 w-3 mr-1" />
                  Influence
                </TabsTrigger>
                <TabsTrigger value="hierarchy" className="text-xs px-3">
                  <Network className="h-3 w-3 mr-1" />
                  Hierarchy
                </TabsTrigger>
                <TabsTrigger value="sentiment" className="text-xs px-3">
                  <ThumbsUp className="h-3 w-3 mr-1" />
                  Sentiment
                </TabsTrigger>
              </TabsList>
            </Tabs>
            
            <Button
              variant={showRelationships ? "secondary" : "outline"}
              size="sm"
              onClick={() => setShowRelationships(!showRelationships)}
            >
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
        
        {/* Risk Alerts */}
        {riskIndicators.length > 0 && (
          <div className="flex flex-wrap gap-2 mt-3">
            {riskIndicators.map((risk, idx) => (
              <Badge 
                key={idx}
                variant="outline"
                className={cn(
                  risk.severity === 'high' && 'bg-red-100 text-red-700 border-red-300 dark:bg-red-900/50 dark:text-red-300',
                  risk.severity === 'medium' && 'bg-amber-100 text-amber-700 border-amber-300 dark:bg-amber-900/50 dark:text-amber-300',
                  risk.severity === 'low' && 'bg-blue-100 text-blue-700 border-blue-300 dark:bg-blue-900/50 dark:text-blue-300',
                )}
              >
                <AlertTriangle className="h-3 w-3 mr-1" />
                {risk.message}
              </Badge>
            ))}
          </div>
        )}
      </CardHeader>
      
      <CardContent>
        <div className="relative overflow-hidden border rounded-lg bg-gradient-to-br from-muted/30 to-muted/10" style={{ height: 550 }}>
          <TooltipProvider>
            <svg 
              width="100%" 
              height="100%" 
              viewBox={`${-dragOffset.x / zoom} ${-dragOffset.y / zoom} ${svgWidth / zoom} ${svgHeight / zoom}`}
              className="transition-all duration-200"
            >
              <defs>
                {/* Gradient definitions for relationship lines */}
                {Object.entries(relationshipColors).map(([type, config]) => (
                  <linearGradient key={type} id={`grad-${type}`} x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor={config.stroke} stopOpacity="0.3" />
                    <stop offset="50%" stopColor={config.stroke} stopOpacity="0.7" />
                    <stop offset="100%" stopColor={config.stroke} stopOpacity="0.3" />
                  </linearGradient>
                ))}
                
                {/* Arrow marker */}
                <marker id="arrowhead" markerWidth="10" markerHeight="7" refX="9" refY="3.5" orient="auto">
                  <polygon points="0 0, 10 3.5, 0 7" className="fill-muted-foreground/50" />
                </marker>
              </defs>

              {/* Central Account Node */}
              <g transform={`translate(${centerX}, ${centerY})`}>
                <circle r="55" className="fill-primary/5 stroke-primary/30 stroke-2" />
                <circle r="45" className="fill-background stroke-primary stroke-2" />
                <foreignObject x="-35" y="-25" width="70" height="50">
                  <div className="flex flex-col items-center justify-center h-full">
                    <Building2 className="h-6 w-6 text-primary" />
                    <span className="text-[10px] font-semibold text-center truncate max-w-[60px] mt-1">
                      {accountName}
                    </span>
                  </div>
                </foreignObject>
              </g>

              {/* Tier labels for hierarchy view */}
              {viewMode === 'hierarchy' && (
                <>
                  <text x="50" y="85" className="fill-muted-foreground text-[10px] font-medium">Final Decision</text>
                  <text x="50" y="195" className="fill-muted-foreground text-[10px] font-medium">Strong Influence</text>
                  <text x="50" y="305" className="fill-muted-foreground text-[10px] font-medium">Recommender</text>
                  <text x="50" y="415" className="fill-muted-foreground text-[10px] font-medium">Evaluator</text>
                </>
              )}

              {/* Sentiment zone labels */}
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
                
                // Calculate control point for curved line
                const midX = (source.x + target.x) / 2;
                const midY = (source.y + target.y) / 2;
                const dx = target.x - source.x;
                const dy = target.y - source.y;
                const perpX = -dy * 0.15;
                const perpY = dx * 0.15;
                
                return (
                  <g key={rel.id} className={cn("transition-opacity", !isHighlighted && selectedNode && "opacity-20")}>
                    <path
                      d={`M ${source.x} ${source.y} Q ${midX + perpX} ${midY + perpY} ${target.x} ${target.y}`}
                      fill="none"
                      stroke={config.stroke}
                      strokeWidth={Math.max(1, rel.strength / 3)}
                      strokeOpacity={isHighlighted ? 0.8 : 0.4}
                      strokeDasharray={rel.relationshipType === 'influences' ? '6,4' : undefined}
                      markerEnd="url(#arrowhead)"
                      className="transition-all"
                    />
                  </g>
                );
              })}

              {/* Stakeholder Nodes */}
              {filteredStakeholders.map(stakeholder => {
                const pos = nodePositions[stakeholder.id];
                if (!pos) return null;
                
                const isSelected = selectedNode === stakeholder.id;
                const isHovered = hoveredNode === stakeholder.id;
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
                          "cursor-pointer transition-all duration-200",
                          isDimmed && "opacity-30"
                        )}
                        onClick={() => handleNodeClick(stakeholder)}
                        onMouseEnter={() => setHoveredNode(stakeholder.id)}
                        onMouseLeave={() => setHoveredNode(null)}
                      >
                        {/* Outer influence ring */}
                        <circle 
                          r={nodeSize + 8}
                          fill="none"
                          strokeWidth={3}
                          stroke={roleInfo.color.replace('text-', '#').replace('-600', '')}
                          strokeDasharray={`${stakeholder.influenceScore * 6.28} 100`}
                          strokeLinecap="round"
                          className="opacity-40"
                          transform="rotate(-90)"
                        />
                        
                        {/* Selection/hover ring */}
                        {(isSelected || isHovered) && (
                          <circle 
                            r={nodeSize + 4}
                            fill="none"
                            strokeWidth={2}
                            className={cn(
                              "transition-all",
                              isSelected ? "stroke-primary" : "stroke-muted-foreground/50"
                            )}
                          />
                        )}
                        
                        {/* Main node circle */}
                        <circle 
                          r={nodeSize}
                          className={cn(
                            "fill-background stroke-2 transition-all",
                            stakeholder.sentiment === 'negative' && "stroke-red-400",
                            stakeholder.sentiment === 'positive' && "stroke-emerald-400",
                            stakeholder.sentiment === 'neutral' && "stroke-slate-300 dark:stroke-slate-600",
                            stakeholder.sentiment === 'unknown' && "stroke-slate-300 dark:stroke-slate-600",
                          )}
                        />
                        
                        {/* Avatar */}
                        <foreignObject x={-16} y={-20} width={32} height={44}>
                          <div className="flex flex-col items-center">
                            <Avatar className="h-7 w-7 border-2 border-background">
                              <AvatarFallback className={cn("text-[10px] font-medium", roleInfo.bgColor, roleInfo.color)}>
                                {getInitials(stakeholder.name)}
                              </AvatarFallback>
                            </Avatar>
                            <span className="text-[9px] font-medium text-center mt-0.5 line-clamp-1 max-w-[50px] truncate">
                              {stakeholder.name.split(' ')[0]}
                            </span>
                            <span className="text-[8px] text-muted-foreground truncate max-w-[50px]">
                              {stakeholder.title.split(' ')[0]}
                            </span>
                          </div>
                        </foreignObject>
                        
                        {/* Role indicator badge */}
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
                        
                        {/* Power score indicator */}
                        <g transform={`translate(${nodeSize + 12}, 0)`}>
                          <rect x="-8" y="-8" width="16" height="16" rx="3" className="fill-muted" />
                          <text x="0" y="4" textAnchor="middle" className="fill-foreground text-[9px] font-bold">
                            {stakeholder.powerScore}
                          </text>
                        </g>
                      </g>
                    </TooltipTrigger>
                    <TooltipContent side="top" className="max-w-xs">
                      <div className="space-y-1">
                        <p className="font-semibold">{stakeholder.name}</p>
                        <p className="text-xs text-muted-foreground">{stakeholder.title} • {stakeholder.department}</p>
                        <div className="flex items-center gap-2 text-xs">
                          <span>Power: {stakeholder.powerScore}/10</span>
                          <span>•</span>
                          <span>Influence: {stakeholder.influenceScore}/10</span>
                        </div>
                      </div>
                    </TooltipContent>
                  </Tooltip>
                );
              })}
            </svg>
          </TooltipProvider>

          {/* Selected Node Details Panel */}
          {selectedStakeholder && (
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
                      <Badge variant="secondary" className="gap-1">
                        <Star className="h-3 w-3 text-amber-500 fill-amber-400" />
                        Key Contact
                      </Badge>
                    )}
                    <Badge variant="outline" className={cn(sentimentConfig[selectedStakeholder.sentiment].bgColor, sentimentConfig[selectedStakeholder.sentiment].color)}>
                      {sentimentConfig[selectedStakeholder.sentiment].label}
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">{selectedStakeholder.title} • {selectedStakeholder.department}</p>
                  <div className="flex flex-wrap gap-1.5 mt-2">
                    {selectedStakeholder.roles.map(role => {
                      const config = roleConfig[role];
                      return (
                        <Badge key={role} variant="outline" className={cn("text-xs gap-1", config.bgColor, config.color)}>
                          <config.icon className="h-3 w-3" />
                          {config.label}
                        </Badge>
                      );
                    })}
                  </div>
                </div>
                <Separator orientation="vertical" className="h-20" />
                <div className="grid grid-cols-2 gap-x-6 gap-y-2 text-sm">
                  <div>
                    <span className="text-muted-foreground">Power Score</span>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-lg">{selectedStakeholder.powerScore}</span>
                      <span className="text-muted-foreground">/10</span>
                    </div>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Influence</span>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-lg">{selectedStakeholder.influenceScore}</span>
                      <span className="text-muted-foreground">/10</span>
                    </div>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Decision Authority</span>
                    <p className="font-medium capitalize">{selectedStakeholder.decisionAuthority.replace('_', ' ')}</p>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Relationship</span>
                    <Badge variant="outline" className={cn(
                      "mt-0.5",
                      selectedStakeholder.relationshipStrength === 'strong' && "bg-emerald-100 text-emerald-700 dark:bg-emerald-900",
                      selectedStakeholder.relationshipStrength === 'warm' && "bg-amber-100 text-amber-700 dark:bg-amber-900",
                      selectedStakeholder.relationshipStrength === 'cold' && "bg-blue-100 text-blue-700 dark:bg-blue-900",
                      selectedStakeholder.relationshipStrength === 'advocate' && "bg-purple-100 text-purple-700 dark:bg-purple-900"
                    )}>
                      {selectedStakeholder.relationshipStrength}
                    </Badge>
                  </div>
                </div>
                <Separator orientation="vertical" className="h-20" />
                <div className="flex flex-col gap-2">
                  <Button variant="outline" size="sm" className="gap-2">
                    <Mail className="h-4 w-4" />
                    Email
                  </Button>
                  <Button variant="outline" size="sm" className="gap-2">
                    <Phone className="h-4 w-4" />
                    Call
                  </Button>
                  {selectedStakeholder.linkedIn && (
                    <Button variant="outline" size="sm" className="gap-2">
                      <Linkedin className="h-4 w-4" />
                      LinkedIn
                    </Button>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Legend */}
        <div className="flex flex-wrap items-center gap-6 mt-4 text-xs text-muted-foreground">
          <div className="flex items-center gap-4">
            <span className="font-medium text-foreground">Roles:</span>
            {Object.entries(roleConfig).slice(0, 4).map(([role, config]) => (
              <div key={role} className="flex items-center gap-1">
                <config.icon className={cn("h-3 w-3", config.color)} />
                <span>{config.label}</span>
              </div>
            ))}
          </div>
          <Separator orientation="vertical" className="h-4" />
          <div className="flex items-center gap-4">
            <span className="font-medium text-foreground">Sentiment:</span>
            {Object.entries(sentimentConfig).slice(0, 3).map(([key, config]) => (
              <div key={key} className="flex items-center gap-1">
                <config.icon className={cn("h-3 w-3", config.color)} />
                <span>{config.label}</span>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
