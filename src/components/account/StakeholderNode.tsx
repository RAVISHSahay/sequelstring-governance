import React, { memo } from 'react';
import { Handle, Position, NodeProps } from 'reactflow';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Crown, Shield, Star, UserCheck, Target, Users, AlertCircle, Mail, Briefcase, Calendar } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Separator } from '@/components/ui/separator';

export interface StakeholderNodeData {
    name: string;
    title: string;
    role: string;
    influence: number;
    relationship: 'strong' | 'warm' | 'cold' | 'advocate';
    email?: string;
    image?: string;
    isDecisionMaker?: boolean;
    lastActivityDate?: string;
}

const getRoleConfig = (role: string) => {
    switch (role?.toLowerCase()) {
        case 'champion':
            return {
                color: 'border-emerald-600',
                badgeBg: 'bg-emerald-600',
                badgeText: 'text-white',
                label: 'Champion'
            };
        case 'blocker':
        case 'detractor':
            return {
                color: 'border-red-600',
                badgeBg: 'bg-red-600',
                badgeText: 'text-white',
                label: 'Blocker'
            };
        case 'economic_buyer':
            return {
                color: 'border-purple-600',
                badgeBg: 'bg-purple-600',
                badgeText: 'text-white',
                label: 'Economic Buyer'
            };
        case 'influencer':
            return {
                color: 'border-blue-600',
                badgeBg: 'bg-blue-600',
                badgeText: 'text-white',
                label: 'Influencer'
            };
        default:
            return {
                color: 'border-slate-400',
                badgeBg: 'bg-slate-100',
                badgeText: 'text-slate-700',
                label: role || 'Contact'
            };
    }
};

export const StakeholderNode = memo(({ data }: NodeProps<StakeholderNodeData>) => {
    const config = getRoleConfig(data.role);

    return (
        <div className={cn(
            "w-[260px] bg-white rounded-md shadow-md hover:shadow-xl transition-all border overflow-hidden",
            config.color,
            data.isDecisionMaker ? "ring-2 ring-yellow-400 ring-offset-2" : ""
        )}>
            <Handle type="target" position={Position.Top} className="w-2 h-2 bg-slate-400 !border-0" />

            <div className="p-3">
                {/* Header Row */}
                <div className="flex items-start gap-3 mb-3">
                    <Avatar className="h-12 w-12 border shadow-sm">
                        <AvatarImage src={data.image} />
                        <AvatarFallback className="bg-slate-100 text-slate-600 text-sm font-semibold">
                            {data.name.split(' ').map(n => n[0]).join('')}
                        </AvatarFallback>
                    </Avatar>

                    <div className="flex-1 min-w-0">
                        <h4 className="font-bold text-sm text-slate-900 truncate" title={data.name}>
                            {data.name}
                        </h4>
                        <p className="text-xs text-slate-500 font-medium truncate mb-1.5" title={data.title}>
                            {data.title}
                        </p>

                        <Badge variant="secondary" className={cn(
                            "rounded-sm text-[10px] h-5 px-1.5 font-semibold shadow-sm border-0",
                            config.badgeBg,
                            config.badgeText
                        )}>
                            {config.label}
                        </Badge>
                    </div>
                </div>

                <Separator className="my-2 bg-slate-100" />

                {/* Fields Grid */}
                <div className="space-y-1.5">
                    {data.email && (
                        <div className="flex items-center gap-2 text-[10px]">
                            <span className="text-slate-400 w-3 shrink-0"><Mail className="h-3 w-3" /></span>
                            <span className="text-slate-600 truncate font-medium">{data.email}</span>
                        </div>
                    )}
                    <div className="flex items-center gap-2 text-[10px]">
                        <span className="text-slate-400 w-3 shrink-0"><Briefcase className="h-3 w-3" /></span>
                        <span className="text-slate-600 truncate font-medium">{data.title}</span>
                    </div>
                    {data.lastActivityDate && (
                        <div className="flex items-center gap-2 text-[10px]">
                            <span className="text-slate-400 w-3 shrink-0"><Calendar className="h-3 w-3" /></span>
                            <span className="text-slate-600 truncate font-medium">
                                Last Activity: {data.lastActivityDate}
                            </span>
                        </div>
                    )}
                </div>
            </div>

            <Handle type="source" position={Position.Bottom} className="w-2 h-2 bg-slate-400 !border-0" />
        </div>
    );
});

StakeholderNode.displayName = 'StakeholderNode';
