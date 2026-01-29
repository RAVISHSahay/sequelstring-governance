import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Mail, User, Copy, Paperclip } from "lucide-react";

interface EmailDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    accountName: string;
    defaultTo?: string;
    onSend: (emailData: {
        to: string[];
        cc: string[];
        subject: string;
        body: string;
    }) => void;
}

export function EmailDialog({
    open,
    onOpenChange,
    accountName,
    defaultTo = "",
    onSend,
}: EmailDialogProps) {
    const [to, setTo] = useState(defaultTo);
    const [cc, setCc] = useState("");
    const [subject, setSubject] = useState("");
    const [body, setBody] = useState("");

    const handleSend = () => {
        const toEmails = to.split(",").map((e) => e.trim()).filter(Boolean);
        const ccEmails = cc.split(",").map((e) => e.trim()).filter(Boolean);

        onSend({
            to: toEmails,
            cc: ccEmails,
            subject,
            body,
        });

        // Reset form
        setTo(defaultTo);
        setCc("");
        setSubject("");
        setBody("");
        onOpenChange(false);
    };

    const isValid = to.trim() && subject.trim() && body.trim();

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-2xl">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2">
                        <Mail className="h-5 w-5 text-primary" />
                        Compose Email
                    </DialogTitle>
                    <DialogDescription>
                        Send an email to <strong>{accountName}</strong>. This will be logged
                        in the communication history.
                    </DialogDescription>
                </DialogHeader>

                <div className="space-y-4 py-4">
                    {/* To Field */}
                    <div className="space-y-2">
                        <Label className="flex items-center gap-2">
                            <User className="h-4 w-4" />
                            To <span className="text-destructive">*</span>
                        </Label>
                        <Input
                            value={to}
                            onChange={(e) => setTo(e.target.value)}
                            placeholder="recipient@example.com, another@example.com"
                            className="font-mono text-sm"
                        />
                        <p className="text-xs text-muted-foreground">
                            Separate multiple emails with commas
                        </p>
                    </div>

                    {/* CC Field */}
                    <div className="space-y-2">
                        <Label className="flex items-center gap-2">
                            <Copy className="h-4 w-4" />
                            CC (Optional)
                        </Label>
                        <Input
                            value={cc}
                            onChange={(e) => setCc(e.target.value)}
                            placeholder="cc@example.com"
                            className="font-mono text-sm"
                        />
                    </div>

                    {/* Subject Field */}
                    <div className="space-y-2">
                        <Label>
                            Subject <span className="text-destructive">*</span>
                        </Label>
                        <Input
                            value={subject}
                            onChange={(e) => setSubject(e.target.value)}
                            placeholder="Email subject"
                        />
                    </div>

                    {/* Body Field */}
                    <div className="space-y-2">
                        <Label>
                            Message <span className="text-destructive">*</span>
                        </Label>
                        <Textarea
                            value={body}
                            onChange={(e) => setBody(e.target.value)}
                            placeholder="Write your email message here..."
                            className="min-h-[200px] resize-none"
                        />
                    </div>

                    {/* Attachment Note */}
                    <div className="flex items-center gap-2 p-3 rounded-lg bg-muted/30 text-sm text-muted-foreground">
                        <Paperclip className="h-4 w-4" />
                        <span>Attachment support coming soon</span>
                    </div>
                </div>

                <DialogFooter>
                    <Button variant="outline" onClick={() => onOpenChange(false)}>
                        Cancel
                    </Button>
                    <Button onClick={handleSend} disabled={!isValid}>
                        <Mail className="h-4 w-4 mr-2" />
                        Send Email
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
