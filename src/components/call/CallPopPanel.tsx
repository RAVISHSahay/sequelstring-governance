import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import {
    Phone,
    PhoneOff,
    Clock,
    User,
    Building2,
    MessageSquare,
    CheckCircle,
    XCircle,
    Calendar,
    FileText,
} from "lucide-react";
import { CallActivity, CallDisposition, DISPOSITION_NEXT_ACTIONS } from "@/types/callIntegration";
import { updateCallActivity, getCallsByEntityId, getScriptById } from "@/data/callActivities";
import { toast } from "sonner";

interface CallPopPanelProps {
    callId: string;
    phoneNumber: string;
    entityType?: string;
    entityId?: string;
    entityName?: string;
    onEndCall: () => void;
}

const DISPOSITIONS: CallDisposition[] = [
    'Interested',
    'Call Back',
    'Not Interested',
    'Wrong Number',
    'Follow-up Required',
    'Meeting Scheduled',
    'Converted',
    'DNC',
];

export function CallPopPanel({
    callId,
    phoneNumber,
    entityType,
    entityId,
    entityName,
    onEndCall,
}: CallPopPanelProps) {
    const [callDuration, setCallDuration] = useState(0);
    const [notes, setNotes] = useState('');
    const [disposition, setDisposition] = useState<CallDisposition | ''>('');
    const [isEnding, setIsEnding] = useState(false);
    const [callHistory, setCallHistory] = useState<CallActivity[]>([]);

    // Timer for call duration
    useEffect(() => {
        const interval = setInterval(() => {
            setCallDuration(prev => prev + 1);
        }, 1000);
        return () => clearInterval(interval);
    }, []);

    // Load call history
    useEffect(() => {
        if (entityId) {
            const history = getCallsByEntityId(entityId);
            setCallHistory(history.slice(0, 3)); // Last 3 calls
        }
    }, [entityId]);

    const formatDuration = (seconds: number) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    };

    const handleEndCall = () => {
        if (!disposition) {
            toast.error("Please select a disposition before ending the call");
            return;
        }

        setIsEnding(true);

        // Update call activity
        updateCallActivity(callId, {
            endTime: new Date().toISOString(),
            duration: callDuration,
            status: 'Connected',
            disposition,
            notes,
        });

        toast.success("Call logged successfully", {
            description: `Duration: ${formatDuration(callDuration)} | ${disposition}`,
        });

        onEndCall();
    };

    const talkingPoints = [
        "Discuss latest product features",
        "Address pricing concerns from last call",
        "Follow up on demo request",
        "Confirm decision timeline",
    ];

    return (
        <div className="fixed bottom-4 right-4 z-50 w-96">
            <Card className="shadow-2xl border-2 border-primary/20 bg-background/95 backdrop-blur">
                <CardHeader className="pb-2">
                    <div className="flex items-center justify-between">
                        <CardTitle className="text-lg flex items-center gap-2">
                            <div className="h-3 w-3 rounded-full bg-green-500 animate-pulse" />
                            Active Call
                        </CardTitle>
                        <Badge variant="outline" className="font-mono text-lg">
                            <Clock className="h-4 w-4 mr-1" />
                            {formatDuration(callDuration)}
                        </Badge>
                    </div>
                </CardHeader>
                <CardContent className="space-y-4">
                    {/* Contact Info */}
                    <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
                        <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                            <User className="h-6 w-6 text-primary" />
                        </div>
                        <div className="flex-1">
                            <p className="font-semibold">{entityName || 'Unknown Contact'}</p>
                            <p className="text-sm text-muted-foreground flex items-center gap-1">
                                <Phone className="h-3 w-3" />
                                {phoneNumber}
                            </p>
                            {entityType && (
                                <Badge variant="secondary" className="text-xs mt-1 capitalize">
                                    {entityType}
                                </Badge>
                            )}
                        </div>
                    </div>

                    {/* Talking Points */}
                    <div>
                        <h4 className="text-sm font-semibold mb-2 flex items-center gap-1">
                            <MessageSquare className="h-4 w-4" />
                            Talking Points
                        </h4>
                        <ul className="text-sm space-y-1">
                            {talkingPoints.map((point, i) => (
                                <li key={i} className="flex items-start gap-2 text-muted-foreground">
                                    <span className="text-primary">•</span>
                                    {point}
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Call History */}
                    {callHistory.length > 0 && (
                        <div>
                            <h4 className="text-sm font-semibold mb-2">Recent Calls</h4>
                            <div className="space-y-1">
                                {callHistory.map(call => (
                                    <div key={call.id} className="flex items-center justify-between text-xs text-muted-foreground">
                                        <span>{new Date(call.startTime).toLocaleDateString()}</span>
                                        <Badge variant="outline" className="text-xs">
                                            {call.disposition || call.status}
                                        </Badge>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Notes */}
                    <div>
                        <h4 className="text-sm font-semibold mb-2">Call Notes</h4>
                        <Textarea
                            placeholder="Type notes during the call..."
                            value={notes}
                            onChange={(e) => setNotes(e.target.value)}
                            className="h-20 resize-none"
                        />
                    </div>

                    {/* Disposition */}
                    <div>
                        <h4 className="text-sm font-semibold mb-2">Disposition *</h4>
                        <Select value={disposition} onValueChange={(v) => setDisposition(v as CallDisposition)}>
                            <SelectTrigger>
                                <SelectValue placeholder="Select outcome..." />
                            </SelectTrigger>
                            <SelectContent>
                                {DISPOSITIONS.map(d => (
                                    <SelectItem key={d} value={d}>{d}</SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>

                    {/* Next Actions */}
                    {disposition && DISPOSITION_NEXT_ACTIONS[disposition]?.length > 0 && (
                        <div className="flex gap-2 flex-wrap">
                            {DISPOSITION_NEXT_ACTIONS[disposition].includes('create_task') && (
                                <Button size="sm" variant="outline" className="gap-1">
                                    <CheckCircle className="h-3 w-3" />
                                    Create Task
                                </Button>
                            )}
                            {DISPOSITION_NEXT_ACTIONS[disposition].includes('schedule_meeting') && (
                                <Button size="sm" variant="outline" className="gap-1">
                                    <Calendar className="h-3 w-3" />
                                    Schedule Meeting
                                </Button>
                            )}
                            {DISPOSITION_NEXT_ACTIONS[disposition].includes('create_opportunity') && (
                                <Button size="sm" variant="outline" className="gap-1">
                                    <FileText className="h-3 w-3" />
                                    Create Opportunity
                                </Button>
                            )}
                        </div>
                    )}

                    {/* End Call Button */}
                    <Button
                        onClick={handleEndCall}
                        disabled={isEnding}
                        className="w-full bg-destructive hover:bg-destructive/90"
                    >
                        <PhoneOff className="h-4 w-4 mr-2" />
                        End Call & Save
                    </Button>
                </CardContent>
            </Card>
        </div>
    );
}
