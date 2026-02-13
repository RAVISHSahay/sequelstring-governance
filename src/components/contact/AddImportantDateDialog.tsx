import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { ContactImportantDate, OccasionType } from "@/types/occasionEmail";
import { addImportantDate, updateImportantDate, getActiveEmailTemplates } from "@/data/importantDates";
import { toast } from "sonner";

interface AddImportantDateDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    contactId: string;
    contactName: string;
    editData?: ContactImportantDate | null;
    onSave?: (data?: any) => void;
}

export function AddImportantDateDialog({
    open,
    onOpenChange,
    contactId,
    contactName,
    editData,
    onSave,
}: AddImportantDateDialogProps) {
    const [formData, setFormData] = useState({
        type: 'Birthday' as OccasionType,
        customLabel: '',
        date: '',
        repeatAnnually: true,
        emailTemplateId: '',
        sendTime: '09:30',
        optOutGreeting: false,
        isActive: true,
    });

    const templates = getActiveEmailTemplates();
    const isEditing = !!editData;

    useEffect(() => {
        if (editData) {
            setFormData({
                type: editData.type,
                customLabel: editData.customLabel || '',
                date: editData.date,
                repeatAnnually: editData.repeatAnnually,
                emailTemplateId: editData.emailTemplateId,
                sendTime: editData.sendTime,
                optOutGreeting: editData.optOutGreeting,
                isActive: editData.isActive,
            });
        } else if (open) {
            // Reset form when opening for new entry
            setFormData({
                type: 'Birthday',
                customLabel: '',
                date: '',
                repeatAnnually: true,
                emailTemplateId: templates.length > 0 ? templates[0].id : '',
                sendTime: '09:30',
                optOutGreeting: false,
                isActive: true,
            });
        }
    }, [editData, open]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        // Validation
        if (!formData.date) {
            toast.error("Please enter a date");
            return;
        }

        if (formData.type === 'Custom' && !formData.customLabel) {
            toast.error("Please enter a custom label");
            return;
        }

        if (!formData.emailTemplateId) {
            toast.error("Please select an email template");
            return;
        }

        // Validate date format
        const dateParts = formData.date.split('-');
        if (dateParts.length < 2 || dateParts.length > 3) {
            toast.error("Invalid date format. Use DD-MM or DD-MM-YYYY");
            return;
        }

        const day = parseInt(dateParts[0]);
        const month = parseInt(dateParts[1]);

        if (day < 1 || day > 31 || month < 1 || month > 12) {
            toast.error("Invalid day or month");
            return;
        }

        try {
            if (onSave) {
                // Pass data to parent instead of saving locally
                onSave(formData);
            } else {
                // Fallback for standalone usage (if any) or existing mocks
                if (isEditing && editData) {
                    updateImportantDate(editData.id, formData);
                    toast.success("Important date updated (Local)");
                } else {
                    addImportantDate({
                        contactId,
                        ...formData,
                    });
                    toast.success("Important date added (Local)");
                }
            }
            // onOpenChange(false); // Let parent handle closing on success
        } catch (error) {
            toast.error("Failed to save important date");
        }
    };

    const filteredTemplates = templates.filter(
        t => t.occasionType === formData.type || t.occasionType === 'Custom' || t.occasionType === 'Any'
    );

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[500px]">
                <DialogHeader>
                    <DialogTitle>
                        {isEditing ? "Edit Important Date" : "Add Important Date"}
                    </DialogTitle>
                    <DialogDescription>
                        Add a birthday, anniversary, or custom occasion for {contactName}.
                        Automated emails will be sent on the specified date.
                    </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleSubmit}>
                    <div className="grid gap-4 py-4">
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="type">Date Type *</Label>
                                <Select
                                    value={formData.type}
                                    onValueChange={(value: OccasionType) =>
                                        setFormData({ ...formData, type: value })
                                    }
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select type" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="Birthday">Birthday</SelectItem>
                                        <SelectItem value="Anniversary">Anniversary</SelectItem>
                                        <SelectItem value="Custom">Custom</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            {formData.type === 'Custom' && (
                                <div className="space-y-2">
                                    <Label htmlFor="customLabel">Custom Label *</Label>
                                    <Input
                                        id="customLabel"
                                        placeholder="e.g., Joining Day"
                                        value={formData.customLabel}
                                        onChange={(e) =>
                                            setFormData({ ...formData, customLabel: e.target.value })
                                        }
                                    />
                                </div>
                            )}
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="date">Date *</Label>
                                <Input
                                    id="date"
                                    placeholder="DD-MM or DD-MM-YYYY"
                                    value={formData.date}
                                    onChange={(e) =>
                                        setFormData({ ...formData, date: e.target.value })
                                    }
                                />
                                <p className="text-xs text-muted-foreground">
                                    Format: DD-MM (e.g., 15-03) or DD-MM-YYYY
                                </p>
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="sendTime">Send Time</Label>
                                <Input
                                    id="sendTime"
                                    type="time"
                                    value={formData.sendTime}
                                    onChange={(e) =>
                                        setFormData({ ...formData, sendTime: e.target.value })
                                    }
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="template">Email Template *</Label>
                            <Select
                                value={formData.emailTemplateId}
                                onValueChange={(value) =>
                                    setFormData({ ...formData, emailTemplateId: value })
                                }
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="Select template" />
                                </SelectTrigger>
                                <SelectContent>
                                    {filteredTemplates.map((template) => (
                                        <SelectItem key={template.id} value={template.id}>
                                            {template.name}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="flex items-center space-x-2">
                            <Checkbox
                                id="repeatAnnually"
                                checked={formData.repeatAnnually}
                                onCheckedChange={(checked) =>
                                    setFormData({ ...formData, repeatAnnually: checked as boolean })
                                }
                            />
                            <Label
                                htmlFor="repeatAnnually"
                                className="text-sm font-normal cursor-pointer"
                            >
                                Repeat annually
                            </Label>
                        </div>

                        <div className="flex items-center space-x-2">
                            <Checkbox
                                id="optOutGreeting"
                                checked={formData.optOutGreeting}
                                onCheckedChange={(checked) =>
                                    setFormData({ ...formData, optOutGreeting: checked as boolean })
                                }
                            />
                            <Label
                                htmlFor="optOutGreeting"
                                className="text-sm font-normal cursor-pointer"
                            >
                                Opt-out of greeting (don't send email)
                            </Label>
                        </div>

                        <div className="flex items-center space-x-2">
                            <Checkbox
                                id="isActive"
                                checked={formData.isActive}
                                onCheckedChange={(checked) =>
                                    setFormData({ ...formData, isActive: checked as boolean })
                                }
                            />
                            <Label
                                htmlFor="isActive"
                                className="text-sm font-normal cursor-pointer"
                            >
                                Active (email will be sent)
                            </Label>
                        </div>
                    </div>
                    <DialogFooter>
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => onOpenChange(false)}
                        >
                            Cancel
                        </Button>
                        <Button type="submit">
                            {isEditing ? "Update" : "Add"} Important Date
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
