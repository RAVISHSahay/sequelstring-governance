import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar, Gift, Heart, Plus, Trash2, Edit, Mail, Send } from "lucide-react";
import { ContactImportantDate } from "@/types/occasionEmail";
import { getImportantDatesByContactId, deleteImportantDate } from "@/data/importantDates";
import { getTemplateById } from "@/data/importantDates";
import { toast } from "sonner";
import { AddImportantDateDialog } from "./AddImportantDateDialog";
import { sendImportantDateEmail } from "@/services/emailScheduler";
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

interface ImportantDatesSectionProps {
    contactId: string;
    contactName: string;
}

export function ImportantDatesSection({ contactId, contactName }: ImportantDatesSectionProps) {
    const [dates, setDates] = useState<ContactImportantDate[]>(() =>
        getImportantDatesByContactId(contactId)
    );
    const [addDialogOpen, setAddDialogOpen] = useState(false);
    const [editingDate, setEditingDate] = useState<ContactImportantDate | null>(null);
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [dateToDelete, setDateToDelete] = useState<string | null>(null);
    const [sending, setSending] = useState<string | null>(null);
    const [refreshTrigger, setRefreshTrigger] = useState(0);

    // Auto-refresh dates when trigger changes
    useEffect(() => {
        const loadedDates = getImportantDatesByContactId(contactId);
        setDates(loadedDates);
    }, [contactId, refreshTrigger]);

    const refreshDates = () => {
        setRefreshTrigger(prev => prev + 1);
    };

    const handleDelete = (id: string) => {
        setDateToDelete(id);
        setDeleteDialogOpen(true);
    };

    const confirmDelete = () => {
        if (dateToDelete) {
            const success = deleteImportantDate(dateToDelete);
            if (success) {
                toast.success("Important date deleted");
                refreshDates();
            } else {
                toast.error("Failed to delete date");
            }
        }
        setDeleteDialogOpen(false);
        setDateToDelete(null);
    };

    const handleEdit = (date: ContactImportantDate) => {
        setEditingDate(date);
        setAddDialogOpen(true);
    };

    const handleSendNow = async (dateId: string) => {
        setSending(dateId);
        try {
            const result = await sendImportantDateEmail(dateId);
            if (result.success) {
                toast.success("Email sent successfully!", {
                    description: "The occasion email has been sent to the contact.",
                });
            } else {
                toast.error("Failed to send email", {
                    description: result.message,
                });
            }
        } catch (error) {
            toast.error("Error sending email");
        } finally {
            setSending(null);
        }
    };

    const getOccasionIcon = (type: string) => {
        switch (type) {
            case 'Birthday':
                return <Gift className="h-4 w-4" />;
            case 'Anniversary':
                return <Heart className="h-4 w-4" />;
            default:
                return <Calendar className="h-4 w-4" />;
        }
    };

    const formatDate = (dateStr: string) => {
        const parts = dateStr.split('-');
        if (parts.length === 2) {
            const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
            return `${parts[0]} ${monthNames[parseInt(parts[1]) - 1]}`;
        } else if (parts.length === 3) {
            const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
            return `${parts[0]} ${monthNames[parseInt(parts[1]) - 1]}, ${parts[2]}`;
        }
        return dateStr;
    };

    return (
        <>
            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
                    <CardTitle className="text-lg font-semibold flex items-center gap-2">
                        <Calendar className="h-5 w-5" />
                        Important Dates
                    </CardTitle>
                    <Button
                        onClick={() => {
                            setEditingDate(null);
                            setAddDialogOpen(true);
                        }}
                        size="sm"
                    >
                        <Plus className="h-4 w-4 mr-2" />
                        Add Date
                    </Button>
                </CardHeader>
                <CardContent>
                    {dates.length === 0 ? (
                        <div className="text-center py-8 text-muted-foreground">
                            <Calendar className="h-12 w-12 mx-auto mb-3 opacity-50" />
                            <p>No important dates added yet</p>
                            <p className="text-sm mt-1">Add birthdays, anniversaries, or custom occasions</p>
                        </div>
                    ) : (
                        <div className="space-y-3">
                            {dates.map((date) => {
                                const template = getTemplateById(date.emailTemplateId);
                                return (
                                    <div
                                        key={date.id}
                                        className="flex items-center justify-between p-3 border rounded-lg hover:bg-accent/50 transition-colors"
                                    >
                                        <div className="flex items-center gap-3">
                                            <div className="p-2 bg-primary/10 rounded-full text-primary">
                                                {getOccasionIcon(date.type)}
                                            </div>
                                            <div>
                                                <div className="flex items-center gap-2">
                                                    <span className="font-medium">
                                                        {date.type === 'Custom' ? date.customLabel : date.type}
                                                    </span>
                                                    {!date.isActive && (
                                                        <Badge variant="secondary" className="text-xs">Inactive</Badge>
                                                    )}
                                                    {date.optOutGreeting && (
                                                        <Badge variant="destructive" className="text-xs">Opted Out</Badge>
                                                    )}
                                                </div>
                                                <div className="flex items-center gap-3 text-sm text-muted-foreground mt-1">
                                                    <span className="flex items-center gap-1">
                                                        <Calendar className="h-3 w-3" />
                                                        {formatDate(date.date)}
                                                    </span>
                                                    <span className="flex items-center gap-1">
                                                        <Mail className="h-3 w-3" />
                                                        {template?.name || 'Unknown template'}
                                                    </span>
                                                    <span>Send at {date.sendTime}</span>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                onClick={() => handleSendNow(date.id)}
                                                disabled={sending === date.id || date.optOutGreeting}
                                                title="Send email now (for testing)"
                                            >
                                                <Send className={`h-4 w-4 ${sending === date.id ? 'animate-pulse' : ''}`} />
                                            </Button>
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                onClick={() => handleEdit(date)}
                                            >
                                                <Edit className="h-4 w-4" />
                                            </Button>
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                onClick={() => handleDelete(date.id)}
                                            >
                                                <Trash2 className="h-4 w-4 text-destructive" />
                                            </Button>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </CardContent>
            </Card>

            <AddImportantDateDialog
                open={addDialogOpen}
                onOpenChange={(open) => {
                    setAddDialogOpen(open);
                    if (!open) setEditingDate(null);
                }}
                contactId={contactId}
                contactName={contactName}
                editData={editingDate}
                onSave={() => {
                    refreshDates();
                    setAddDialogOpen(false);
                    setEditingDate(null);
                }}
            />

            <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Delete Important Date</AlertDialogTitle>
                        <AlertDialogDescription>
                            Are you sure you want to delete this important date? This action cannot be undone.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction onClick={confirmDelete}>Delete</AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </>
    );
}
