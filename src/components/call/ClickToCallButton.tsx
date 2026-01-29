import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Phone, PhoneOff, AlertTriangle } from "lucide-react";
import { isNumberDNC, matchPhoneToEntity, createCallActivity } from "@/data/callActivities";
import { toast } from "sonner";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { CallPopPanel } from "./CallPopPanel";

interface ClickToCallButtonProps {
    phoneNumber: string;
    entityType?: 'lead' | 'contact' | 'prospect' | 'account';
    entityId?: string;
    entityName?: string;
    size?: 'sm' | 'default' | 'lg' | 'icon';
    variant?: 'default' | 'outline' | 'ghost';
    showLabel?: boolean;
}

export function ClickToCallButton({
    phoneNumber,
    entityType,
    entityId,
    entityName,
    size = 'sm',
    variant = 'outline',
    showLabel = false,
}: ClickToCallButtonProps) {
    const [isDialing, setIsDialing] = useState(false);
    const [showDNCWarning, setShowDNCWarning] = useState(false);
    const [showCallPop, setShowCallPop] = useState(false);
    const [activeCallId, setActiveCallId] = useState<string | null>(null);

    const handleClick = () => {
        // Check DNC list
        if (isNumberDNC(phoneNumber)) {
            setShowDNCWarning(true);
            return;
        }

        initiateCall();
    };

    const initiateCall = () => {
        setIsDialing(true);

        // Match phone to entity if not provided
        let resolvedEntity = { entityType, entityId, entityName };
        if (!entityId) {
            const match = matchPhoneToEntity(phoneNumber);
            if (match.found) {
                resolvedEntity = {
                    entityType: match.entityType as any,
                    entityId: match.entityId,
                    entityName: match.entityName,
                };
            }
        }

        // Create call activity
        const call = createCallActivity({
            entityType: resolvedEntity.entityType || 'lead',
            entityId: resolvedEntity.entityId || 'unknown',
            entityName: resolvedEntity.entityName || 'Unknown Contact',
            userId: 'user_1',
            userName: 'Current User',
            direction: 'outbound',
            fromNumber: '+91 98765 43210', // User's number
            toNumber: phoneNumber,
            normalizedToNumber: phoneNumber.replace(/[\s\-\(\)\+]/g, ''),
            startTime: new Date().toISOString(),
            status: 'Connected',
            recordingConsent: false,
            isDNC: false,
        });

        setActiveCallId(call.id);
        setShowCallPop(true);

        toast.success("Call initiated", {
            description: `Calling ${resolvedEntity.entityName || phoneNumber}...`,
        });

        // Simulate dialing phase
        setTimeout(() => {
            setIsDialing(false);
        }, 2000);
    };

    const handleEndCall = () => {
        setShowCallPop(false);
        setActiveCallId(null);
        setIsDialing(false);
    };

    return (
        <>
            <Button
                variant={variant}
                size={size}
                onClick={handleClick}
                disabled={isDialing}
                className={isDialing ? 'animate-pulse' : ''}
            >
                {isDialing ? (
                    <PhoneOff className="h-4 w-4" />
                ) : (
                    <Phone className="h-4 w-4" />
                )}
                {showLabel && <span className="ml-2">{isDialing ? 'Dialing...' : 'Call'}</span>}
            </Button>

            {/* DNC Warning Dialog */}
            <AlertDialog open={showDNCWarning} onOpenChange={setShowDNCWarning}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle className="flex items-center gap-2 text-destructive">
                            <AlertTriangle className="h-5 w-5" />
                            Do Not Call Warning
                        </AlertDialogTitle>
                        <AlertDialogDescription>
                            This phone number ({phoneNumber}) is on the Do Not Call (DNC) list.
                            Calling this number may violate compliance policies.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction
                            onClick={initiateCall}
                            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                        >
                            Call Anyway
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>

            {/* Call Pop Panel */}
            {showCallPop && activeCallId && (
                <CallPopPanel
                    callId={activeCallId}
                    phoneNumber={phoneNumber}
                    entityType={entityType}
                    entityId={entityId}
                    entityName={entityName}
                    onEndCall={handleEndCall}
                />
            )}
        </>
    );
}
