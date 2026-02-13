import React, { useMemo, useCallback, useState, useEffect } from 'react';
import ReactFlow, {
    Node,
    Edge,
    Controls,
    Background,
    useNodesState,
    useEdgesState,
    ConnectionLineType,
    MarkerType,
    Panel,
    ReactFlowInstance,
} from 'reactflow';
import 'reactflow/dist/style.css';
import { Stakeholder, ContactRelationship } from '@/types/account';
import { Card } from '@/components/ui/card';
import { StakeholderNode } from './StakeholderNode';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Download, Minimize, Maximize, RefreshCw, Search, Target, MousePointer2, Plus, LayoutGrid } from 'lucide-react';

interface OrgChartProps {
    stakeholders: Stakeholder[];
    relationships: ContactRelationship[];
}

const nodeWidth = 260; // Increased for larger card
const nodeHeight = 160;

const nodeTypes = {
    stakeholder: StakeholderNode,
};

// Mock extra contacts for "Add to Chart" demonstration
const EXTRA_CONTACTS: Partial<Stakeholder>[] = [
    {
        id: '901',
        name: 'Khadija Traynor',
        title: 'Head of Engineering',
        primaryRole: 'technical_approver',
        email: 'khadija.traynor@visual.com',
        lastContactDate: new Date('2023-10-12'),
    },
    {
        id: '902',
        name: 'James Hammond',
        title: 'Marketing Manager',
        primaryRole: 'influencer',
        email: 'j.hammond@visual.com',
        lastContactDate: new Date('2023-09-28'),
    }
];

const getLayoutedElements = (nodes: Node[], edges: Edge[]) => {
    const childrenMap: Record<string, string[]> = {};
    const parentsMap: Record<string, string> = {};
    const structuralEdges: Edge[] = [];
    const influenceEdges: Edge[] = [];

    edges.forEach(edge => {
        if (edge.data?.type === 'reports_to') {
            const managerId = edge.target;
            const employeeId = edge.source;

            if (!childrenMap[managerId]) childrenMap[managerId] = [];
            childrenMap[managerId].push(employeeId);
            parentsMap[employeeId] = managerId;
        }
    });

    const allNodeIds = new Set(nodes.map(n => n.id));
    const roots = [...allNodeIds].filter(id => !parentsMap[id]);

    const newNodes: Node[] = [];
    const levelDepths: Record<number, number> = {};

    // Use grid logic for predictability
    const levelCounts: Record<number, number> = {};

    const traverse = (id: string, level: number) => {
        if (!levelCounts[level]) levelCounts[level] = 0;

        const node = nodes.find(n => n.id === id);
        if (node && !newNodes.find(n => n.id === id)) {
            const x = levelCounts[level] * (nodeWidth + 60);
            const y = level * (nodeHeight + 100);

            newNodes.push({
                ...node,
                position: { x, y }
            });

            levelCounts[level]++;

            const kids = childrenMap[id] || [];
            kids.forEach(kid => traverse(kid, level + 1));
        }
    }

    roots.forEach(root => traverse(root, 0));

    // Add disconnected nodes
    let disconnectedY = 0;
    nodes.forEach(n => {
        if (!newNodes.find(placed => placed.id === n.id)) {
            newNodes.push({
                ...n,
                position: { x: -350, y: disconnectedY }
            });
            disconnectedY += (nodeHeight + 50);
        }
    });

    edges.forEach(edge => {
        if (edge.data?.type === 'reports_to') {
            structuralEdges.push({
                id: `viz_${edge.id}`,
                source: edge.target,
                target: edge.source,
                type: 'smoothstep',
                markerEnd: { type: MarkerType.ArrowClosed },
                style: { stroke: '#94a3b8', strokeWidth: 2 },
                animated: false,
            });
        } else {
            let color = '#cbd5e1';
            let animated = false;
            let strokeDasharray = '5 5';

            if (edge.data?.type?.includes('positive')) { color = '#10b981'; animated = true; }
            if (edge.data?.type?.includes('conflict') || edge.data?.type?.includes('negative')) { color = '#ef4444'; strokeDasharray = '0'; strokeWidth: 3; }

            influenceEdges.push({
                id: `viz_${edge.id}`,
                source: edge.source,
                target: edge.target,
                type: 'bezier',
                style: { stroke: color, strokeWidth: 2, strokeDasharray },
                markerEnd: { type: MarkerType.ArrowClosed, color },
                animated
            });
        }
    });

    return { nodes: newNodes, edges: [...structuralEdges, ...influenceEdges] };
};

export const OrgChart: React.FC<OrgChartProps> = ({ stakeholders, relationships }) => {
    const [rfInstance, setRfInstance] = useState<ReactFlowInstance | null>(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [showHeatmap, setShowHeatmap] = useState(false);

    // Manage local nodes state to support "Add to Chart"
    const [localNodes, setLocalNodes, onNodesChange] = useNodesState([]);
    const [localEdges, setLocalEdges, onEdgesChange] = useEdgesState([]);

    // Initialize from props
    useEffect(() => {
        const initialNodes: Node[] = stakeholders.map(s => ({
            id: s.id,
            type: 'stakeholder',
            data: {
                name: s.name,
                title: s.title,
                role: s.primaryRole,
                influence: s.influenceScore,
                relationship: s.relationshipStrength,
                isDecisionMaker: s.isDecisionMaker || s.primaryRole === 'economic_buyer',
                email: s.email || 'email@example.com',
                lastActivityDate: s.lastContactDate ? new Date(s.lastContactDate).toLocaleDateString() : 'N/A',
            },
            position: { x: 0, y: 0 },
        }));

        const initialEdges: Edge[] = relationships.map(r => ({
            id: r.id,
            source: r.sourceContactId,
            target: r.targetContactId,
            data: { type: r.relationshipType },
        }));

        const layout = getLayoutedElements(initialNodes, initialEdges);
        setLocalNodes(layout.nodes);
        setLocalEdges(layout.edges);
    }, [stakeholders, relationships]);

    // Combined directory list
    const directoryContacts = useMemo(() => {
        return [...stakeholders.map(s => ({ ...s, inChart: true })), ...EXTRA_CONTACTS.map(s => ({ ...s, inChart: false } as any))];
    }, [stakeholders]);

    const handleLocate = (nodeId: string) => {
        if (!rfInstance) return;
        const node = localNodes.find(n => n.id === nodeId);
        if (node) {
            rfInstance.setCenter(node.position.x + nodeWidth / 2, node.position.y + nodeHeight / 2, { zoom: 1, duration: 800 });
        }
    };

    const handleAddToChart = (contact: any) => {
        const newNode: Node = {
            id: contact.id,
            type: 'stakeholder',
            data: {
                name: contact.name,
                title: contact.title,
                role: contact.primaryRole,
                influence: 5,
                relationship: 'neutral',
                email: contact.email,
                lastActivityDate: contact.lastContactDate ? new Date(contact.lastContactDate).toLocaleDateString() : 'N/A',
            },
            position: { x: -350, y: 0 }, // Will be positioned by layout or disconnected logic
        };

        // Add to nodes
        const updatedNodes = [...localNodes, newNode];
        // Re-layout
        const layout = getLayoutedElements(updatedNodes, localEdges);
        setLocalNodes(layout.nodes);
        setLocalEdges(layout.edges);

        // Locate it?
        setTimeout(() => handleLocate(contact.id), 100);
    };

    const filteredContacts = directoryContacts.filter(s =>
        (s.name?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
        (s.title?.toLowerCase() || '').includes(searchTerm.toLowerCase())
    );

    const onRefit = useCallback(() => {
        const layout = getLayoutedElements(localNodes, localEdges);
        setLocalNodes(layout.nodes);
        setLocalEdges(layout.edges);
        setTimeout(() => rfInstance?.fitView(), 100);
    }, [localNodes, localEdges, rfInstance]);

    return (
        <Card className="w-full h-[700px] border rounded-lg overflow-hidden bg-slate-50 relative flex">
            {/* Main Canvas */}
            <div className="flex-1 h-full relative border-r">
                <ReactFlow
                    nodes={localNodes}
                    edges={localEdges}
                    nodeTypes={nodeTypes}
                    onNodesChange={onNodesChange} // Allow dragging
                    onEdgesChange={onEdgesChange}
                    onInit={setRfInstance}
                    fitView
                    minZoom={0.2}
                    maxZoom={2}
                    defaultEdgeOptions={{ type: 'smoothstep' }}
                >
                    <Background color="#cbd5e1" gap={20} size={1} />
                    <Controls />

                    {/* Top Right Controls */}
                    <Panel position="top-right" className="flex items-center gap-4 bg-white/50 backdrop-blur p-2 rounded-lg border shadow-sm">
                        <div className="flex items-center space-x-2">
                            <Switch id="heatmap-mode" checked={showHeatmap} onCheckedChange={setShowHeatmap} />
                            <Label htmlFor="heatmap-mode" className="text-xs font-medium">Activity Heatmap</Label>
                        </div>
                        <Button variant="outline" size="sm" onClick={onRefit} className="bg-white">
                            <LayoutGrid className="h-4 w-4 mr-2" />
                            Auto Layout
                        </Button>
                    </Panel>

                    {/* Legend Panel */}
                    <Panel position="bottom-left" className="m-4">
                        <div className="bg-white/95 backdrop-blur p-4 rounded-lg shadow-lg border w-64 space-y-3">
                            <h4 className="text-xs font-semibold uppercase text-muted-foreground mb-2">Relationship Type</h4>
                            <div className="space-y-2 text-sm">
                                <div className="flex items-center gap-2">
                                    <div className="w-8 h-0.5 bg-emerald-500 relative">
                                        <div className="absolute right-0 -top-1 border-t-4 border-b-4 border-l-4 border-t-transparent border-b-transparent border-l-emerald-500"></div>
                                    </div>
                                    <span>Positively Influences</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <div className="w-8 h-0.5 bg-red-500 relative">
                                        <div className="absolute right-0 -top-1 border-t-4 border-b-4 border-l-4 border-t-transparent border-b-transparent border-l-red-500"></div>
                                    </div>
                                    <span>Conflict / Blocker</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <div className="w-8 h-0.5 bg-slate-400"></div>
                                    <span>Reports to</span>
                                </div>
                            </div>
                        </div>
                    </Panel>
                </ReactFlow>
            </div>

            {/* Sidebar for Contacts (Right Side) */}
            <div className="w-[320px] bg-white flex flex-col z-10 shadow-xl transition-all h-full">
                <div className="p-4 border-b space-y-3 bg-white">
                    <div className="flex items-center justify-between">
                        <h3 className="font-semibold text-sm">Contacts</h3>
                        <Button variant="ghost" size="sm" className="h-6 w-6 p-0"><RefreshCw className="h-3 w-3" /></Button>
                    </div>
                    <div className="relative">
                        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                        <Input
                            placeholder="Search All Contacts"
                            className="pl-9 bg-slate-50 border-slate-200"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                </div>
                <ScrollArea className="flex-1 bg-slate-50/50">
                    <div className="p-2 space-y-2">
                        {filteredContacts.map(contact => {
                            // Check if in current localNodes 
                            const isOnChart = localNodes.some(n => n.id === contact.id);

                            return (
                                <div key={contact.id} className="flex flex-col p-3 bg-white border rounded-lg shadow-sm hover:shadow-md transition-all group">
                                    <div className="flex items-center gap-3 overflow-hidden mb-3">
                                        <Avatar className="h-9 w-9 border shadow-sm">
                                            <AvatarFallback className="text-xs bg-indigo-50 text-indigo-700 font-bold">
                                                {contact.name?.substring(0, 2).toUpperCase()}
                                            </AvatarFallback>
                                        </Avatar>
                                        <div className="min-w-0">
                                            <p className="text-sm font-semibold truncate hover:text-blue-600 cursor-pointer">{contact.name}</p>
                                            <p className="text-xs text-muted-foreground truncate">{contact.title}</p>
                                            <p className="text-[10px] text-slate-400 truncate">{contact.email}</p>
                                        </div>
                                    </div>

                                    {isOnChart ? (
                                        <Button
                                            variant="secondary"
                                            size="sm"
                                            className="w-full h-7 text-xs bg-slate-100 text-slate-600 hover:bg-slate-200"
                                            onClick={() => handleLocate(contact.id!)}
                                        >
                                            <Target className="h-3 w-3 mr-1.5" />
                                            Show on chart
                                        </Button>
                                    ) : (
                                        <Button
                                            size="sm"
                                            className="w-full h-7 text-xs bg-blue-600 hover:bg-blue-700"
                                            onClick={() => handleAddToChart(contact)}
                                        >
                                            <Plus className="h-3 w-3 mr-1.5" />
                                            Add to chart
                                        </Button>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                </ScrollArea>
            </div>
        </Card>
    );
};
