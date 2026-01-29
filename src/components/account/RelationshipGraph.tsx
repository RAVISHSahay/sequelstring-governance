import { useMemo, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  ZoomIn, 
  ZoomOut, 
  Maximize2, 
  Users, 
  Building2, 
  Briefcase,
  ArrowRight,
  Star
} from "lucide-react";
import { Stakeholder, ContactRelationship, RelationshipType } from "@/types/account";
import { cn } from "@/lib/utils";

interface RelationshipGraphProps {
  stakeholders: Stakeholder[];
  relationships?: ContactRelationship[];
  accountName?: string;
}

const relationshipColors: Record<RelationshipType, string> = {
  reports_to: 'stroke-blue-500',
  influences: 'stroke-purple-500',
  collaborates_with: 'stroke-emerald-500',
  competes_with: 'stroke-red-500',
  partner: 'stroke-amber-500',
  consultant: 'stroke-cyan-500',
  vendor: 'stroke-slate-500',
  procurement_authority: 'stroke-rose-500',
};

const roleColors: Record<string, string> = {
  economic_buyer: 'bg-emerald-500/10 text-emerald-600 border-emerald-500/30',
  technical_approver: 'bg-blue-500/10 text-blue-600 border-blue-500/30',
  influencer: 'bg-purple-500/10 text-purple-600 border-purple-500/30',
  gatekeeper: 'bg-amber-500/10 text-amber-600 border-amber-500/30',
  user: 'bg-slate-500/10 text-slate-600 border-slate-500/30',
  champion: 'bg-rose-500/10 text-rose-600 border-rose-500/30',
  executive_sponsor: 'bg-indigo-500/10 text-indigo-600 border-indigo-500/30',
  procurement: 'bg-cyan-500/10 text-cyan-600 border-cyan-500/30',
};

// Mock relationships for visualization
const mockRelationships: ContactRelationship[] = [
  { id: '1', sourceContactId: 'STK-001', targetContactId: 'STK-002', relationshipType: 'reports_to', strength: 8, description: 'Direct Report' },
  { id: '2', sourceContactId: 'STK-001', targetContactId: 'STK-003', relationshipType: 'influences', strength: 6, description: 'Budget Influence' },
  { id: '3', sourceContactId: 'STK-002', targetContactId: 'STK-004', relationshipType: 'collaborates_with', strength: 7, description: 'Project Collaboration' },
  { id: '4', sourceContactId: 'STK-003', targetContactId: 'STK-005', relationshipType: 'reports_to', strength: 9, description: 'Functional Report' },
];

export function RelationshipGraph({ stakeholders, relationships = mockRelationships, accountName = "Account" }: RelationshipGraphProps) {
  const [zoom, setZoom] = useState(1);
  const [viewMode, setViewMode] = useState<'hierarchy' | 'influence' | 'all'>('all');
  const [selectedNode, setSelectedNode] = useState<string | null>(null);

  // Calculate node positions in a circular/hierarchical layout
  const nodePositions = useMemo(() => {
    const positions: Record<string, { x: number; y: number }> = {};
    const centerX = 400;
    const centerY = 300;
    
    // Group stakeholders by role/power
    const grouped = stakeholders.reduce((acc, s) => {
      const tier = s.powerScore >= 8 ? 0 : s.powerScore >= 5 ? 1 : 2;
      if (!acc[tier]) acc[tier] = [];
      acc[tier].push(s);
      return acc;
    }, {} as Record<number, Stakeholder[]>);

    // Position nodes in concentric circles
    Object.entries(grouped).forEach(([tier, members]) => {
      const tierNum = parseInt(tier);
      const radius = 100 + tierNum * 120;
      members.forEach((member, idx) => {
        const angle = (2 * Math.PI * idx) / members.length - Math.PI / 2;
        positions[member.id] = {
          x: centerX + radius * Math.cos(angle),
          y: centerY + radius * Math.sin(angle),
        };
      });
    });

    return positions;
  }, [stakeholders]);

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  };

  const filteredRelationships = useMemo(() => {
    if (viewMode === 'all') return relationships;
    if (viewMode === 'hierarchy') return relationships.filter(r => r.relationshipType === 'reports_to');
    if (viewMode === 'influence') return relationships.filter(r => r.relationshipType === 'influences');
    return relationships;
  }, [relationships, viewMode]);

  return (
    <Card className="w-full">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Users className="h-5 w-5 text-primary" />
            <CardTitle>Relationship Graph</CardTitle>
          </div>
          <div className="flex items-center gap-2">
            <Select value={viewMode} onValueChange={(v: any) => setViewMode(v)}>
              <SelectTrigger className="w-[140px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Relationships</SelectItem>
                <SelectItem value="hierarchy">Hierarchy Only</SelectItem>
                <SelectItem value="influence">Influence Map</SelectItem>
              </SelectContent>
            </Select>
            <div className="flex items-center gap-1 border rounded-md">
              <Button variant="ghost" size="sm" onClick={() => setZoom(z => Math.max(0.5, z - 0.1))}>
                <ZoomOut className="h-4 w-4" />
              </Button>
              <span className="text-sm px-2">{Math.round(zoom * 100)}%</span>
              <Button variant="ghost" size="sm" onClick={() => setZoom(z => Math.min(2, z + 0.1))}>
                <ZoomIn className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="sm" onClick={() => setZoom(1)}>
                <Maximize2 className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="relative overflow-hidden border rounded-lg bg-muted/20" style={{ height: 600 }}>
          <svg 
            width="100%" 
            height="100%" 
            viewBox={`0 0 ${800 / zoom} ${600 / zoom}`}
            className="transition-all duration-200"
          >
            {/* Account Center Node */}
            <g transform={`translate(400, 300)`}>
              <circle r="50" className="fill-primary/10 stroke-primary stroke-2" />
              <foreignObject x="-40" y="-20" width="80" height="40">
                <div className="flex flex-col items-center justify-center h-full">
                  <Building2 className="h-5 w-5 text-primary" />
                  <span className="text-xs font-medium text-center truncate max-w-[70px]">{accountName}</span>
                </div>
              </foreignObject>
            </g>

            {/* Relationship Lines */}
            {filteredRelationships.map(rel => {
              const source = nodePositions[rel.sourceContactId];
              const target = nodePositions[rel.targetContactId];
              if (!source || !target) return null;
              
              return (
                <g key={rel.id}>
                  <line
                    x1={source.x}
                    y1={source.y}
                    x2={target.x}
                    y2={target.y}
                    className={cn("stroke-2 opacity-50", relationshipColors[rel.relationshipType])}
                    strokeDasharray={rel.relationshipType === 'influences' ? '5,5' : undefined}
                  />
                  {/* Arrow marker */}
                  <polygon
                    points={`${target.x - 5},${target.y - 5} ${target.x + 5},${target.y - 5} ${target.x},${target.y + 5}`}
                    className={cn("fill-current opacity-50", relationshipColors[rel.relationshipType].replace('stroke-', 'text-'))}
                    transform={`rotate(${Math.atan2(target.y - source.y, target.x - source.x) * 180 / Math.PI + 90}, ${target.x}, ${target.y})`}
                  />
                </g>
              );
            })}

            {/* Stakeholder Nodes */}
            {stakeholders.map(stakeholder => {
              const pos = nodePositions[stakeholder.id];
              if (!pos) return null;
              
              const isSelected = selectedNode === stakeholder.id;
              const nodeSize = 35 + stakeholder.powerScore * 2;
              
              return (
                <g 
                  key={stakeholder.id}
                  transform={`translate(${pos.x}, ${pos.y})`}
                  className="cursor-pointer"
                  onClick={() => setSelectedNode(isSelected ? null : stakeholder.id)}
                >
                  {/* Node Circle */}
                  <circle 
                    r={nodeSize} 
                    className={cn(
                      "fill-background stroke-2 transition-all",
                      isSelected ? "stroke-primary stroke-[3px]" : "stroke-border",
                      stakeholder.isKeyContact && "stroke-amber-500"
                    )}
                  />
                  
                  {/* Power indicator ring */}
                  <circle 
                    r={nodeSize + 5} 
                    fill="none"
                    strokeWidth={3}
                    strokeDasharray={`${stakeholder.powerScore * 10} 100`}
                    className="stroke-primary/30"
                  />
                  
                  {/* Avatar */}
                  <foreignObject x={-20} y={-25} width={40} height={50}>
                    <div className="flex flex-col items-center">
                      <Avatar className="h-8 w-8">
                        <AvatarFallback className="text-xs">
                          {getInitials(stakeholder.name)}
                        </AvatarFallback>
                      </Avatar>
                      <span className="text-[10px] font-medium text-center mt-1 line-clamp-1 max-w-[60px]">
                        {stakeholder.name.split(' ')[0]}
                      </span>
                    </div>
                  </foreignObject>
                  
                  {/* Champion star */}
                  {stakeholder.primaryRole === 'champion' && (
                    <Star 
                      className="fill-amber-400 text-amber-500" 
                      style={{ transform: `translate(${nodeSize - 10}px, ${-nodeSize + 5}px)` }}
                      width={16}
                      height={16}
                    />
                  )}
                </g>
              );
            })}
          </svg>

          {/* Selected Node Details */}
          {selectedNode && (
            <div className="absolute bottom-4 left-4 right-4 bg-background/95 backdrop-blur border rounded-lg p-4 shadow-lg">
              {(() => {
                const stakeholder = stakeholders.find(s => s.id === selectedNode);
                if (!stakeholder) return null;
                
                return (
                  <div className="flex items-start gap-4">
                    <Avatar className="h-12 w-12">
                      <AvatarFallback>{getInitials(stakeholder.name)}</AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <h4 className="font-semibold">{stakeholder.name}</h4>
                        {stakeholder.isKeyContact && (
                          <Star className="h-4 w-4 text-amber-500 fill-amber-400" />
                        )}
                      </div>
                      <p className="text-sm text-muted-foreground">{stakeholder.title}</p>
                      <div className="flex flex-wrap gap-1 mt-2">
                        {stakeholder.roles.map(role => (
                          <Badge 
                            key={role} 
                            variant="outline" 
                            className={cn("text-xs", roleColors[role])}
                          >
                            {role.replace('_', ' ')}
                          </Badge>
                        ))}
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-sm">
                        <span className="text-muted-foreground">Power: </span>
                        <span className="font-medium">{stakeholder.powerScore}/10</span>
                      </div>
                      <div className="text-sm">
                        <span className="text-muted-foreground">Influence: </span>
                        <span className="font-medium">{stakeholder.influenceScore}/10</span>
                      </div>
                      <Badge 
                        variant="outline" 
                        className={cn(
                          "mt-1",
                          stakeholder.relationshipStrength === 'strong' && "bg-emerald-500/10 text-emerald-600",
                          stakeholder.relationshipStrength === 'warm' && "bg-amber-500/10 text-amber-600",
                          stakeholder.relationshipStrength === 'cold' && "bg-blue-500/10 text-blue-600",
                          stakeholder.relationshipStrength === 'advocate' && "bg-purple-500/10 text-purple-600"
                        )}
                      >
                        {stakeholder.relationshipStrength}
                      </Badge>
                    </div>
                  </div>
                );
              })()}
            </div>
          )}
        </div>

        {/* Legend */}
        <div className="flex flex-wrap items-center gap-4 mt-4 text-xs text-muted-foreground">
          <span className="font-medium">Relationships:</span>
          {Object.entries(relationshipColors).slice(0, 4).map(([type, color]) => (
            <div key={type} className="flex items-center gap-1">
              <div className={cn("w-4 h-0.5", color.replace('stroke-', 'bg-'))} />
              <span>{type.replace('_', ' ')}</span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
