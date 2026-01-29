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
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { User, Users, AlertCircle } from "lucide-react";

type Priority = "Critical" | "High" | "Medium" | "Low";

interface AssignAccountDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    accountName: string;
    currentOwner?: string;
    currentPresales?: string;
    currentPriority?: Priority;
    onAssign: (salesPerson: string, presalesPerson: string, priority: Priority) => void;
}

const salesTeam = [
    { name: "Priya Sharma", initials: "PS", role: "Senior Sales Executive" },
    { name: "Rahul Mehta", initials: "RM", role: "Sales Manager" },
    { name: "Anjali Kumar", initials: "AK", role: "Account Executive" },
    { name: "Vikram Desai", initials: "VD", role: "Sales Executive" },
    { name: "Sanjay Gupta", initials: "SG", role: "Senior Account Executive" },
];

const presalesTeam = [
    { name: "Neha Kapoor", initials: "NK", role: "Solutions Architect" },
    { name: "Amit Joshi", initials: "AJ", role: "Technical Consultant" },
    { name: "Ravi Shankar", initials: "RS", role: "Presales Engineer" },
    { name: "Pooja Reddy", initials: "PR", role: "Solutions Consultant" },
    { name: "Karthik Iyer", initials: "KI", role: "Technical Architect" },
];

export function AssignAccountDialog({
    open,
    onOpenChange,
    accountName,
    currentOwner = "",
    currentPresales = "",
    currentPriority = "Medium",
    onAssign,
}: AssignAccountDialogProps) {
    const [salesPerson, setSalesPerson] = useState(currentOwner);
    const [presalesPerson, setPresalesPerson] = useState(currentPresales);
    const [priority, setPriority] = useState<Priority>(currentPriority);

    const handleSubmit = () => {
        onAssign(salesPerson, presalesPerson, priority);
        onOpenChange(false);
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle>Assign Account</DialogTitle>
                    <DialogDescription>
                        Assign sales and presales team members to <strong>{accountName}</strong>
                    </DialogDescription>
                </DialogHeader>

                <div className="space-y-6 py-4">
                    {/* Sales Person Assignment */}
                    <div className="space-y-2">
                        <Label className="flex items-center gap-2">
                            <User className="h-4 w-4" />
                            Sales Person (Owner)
                        </Label>
                        <Select value={salesPerson} onValueChange={setSalesPerson}>
                            <SelectTrigger>
                                <SelectValue placeholder="Select sales person" />
                            </SelectTrigger>
                            <SelectContent>
                                {salesTeam.map((person) => (
                                    <SelectItem key={person.name} value={person.name}>
                                        <div className="flex items-center gap-2">
                                            <Avatar className="h-6 w-6">
                                                <AvatarFallback className="text-[10px] bg-primary/10 text-primary">
                                                    {person.initials}
                                                </AvatarFallback>
                                            </Avatar>
                                            <div>
                                                <span className="font-medium">{person.name}</span>
                                                <span className="text-muted-foreground text-xs ml-2">
                                                    {person.role}
                                                </span>
                                            </div>
                                        </div>
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>

                    {/* Presales Person Assignment */}
                    <div className="space-y-2">
                        <Label className="flex items-center gap-2">
                            <Users className="h-4 w-4" />
                            Presales Person
                        </Label>
                        <Select value={presalesPerson} onValueChange={setPresalesPerson}>
                            <SelectTrigger>
                                <SelectValue placeholder="Select presales person" />
                            </SelectTrigger>
                            <SelectContent>
                                {presalesTeam.map((person) => (
                                    <SelectItem key={person.name} value={person.name}>
                                        <div className="flex items-center gap-2">
                                            <Avatar className="h-6 w-6">
                                                <AvatarFallback className="text-[10px] bg-accent/10 text-accent">
                                                    {person.initials}
                                                </AvatarFallback>
                                            </Avatar>
                                            <div>
                                                <span className="font-medium">{person.name}</span>
                                                <span className="text-muted-foreground text-xs ml-2">
                                                    {person.role}
                                                </span>
                                            </div>
                                        </div>
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>

                    {/* Priority Selection */}
                    <div className="space-y-2">
                        <Label className="flex items-center gap-2">
                            <AlertCircle className="h-4 w-4" />
                            Account Priority
                        </Label>
                        <Select value={priority} onValueChange={(value) => setPriority(value as Priority)}>
                            <SelectTrigger>
                                <SelectValue placeholder="Select priority" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="Critical">
                                    <div className="flex items-center gap-2">
                                        <div className="h-2 w-2 rounded-full bg-destructive" />
                                        <span className="font-medium">Critical</span>
                                    </div>
                                </SelectItem>
                                <SelectItem value="High">
                                    <div className="flex items-center gap-2">
                                        <div className="h-2 w-2 rounded-full bg-orange-500" />
                                        <span className="font-medium">High</span>
                                    </div>
                                </SelectItem>
                                <SelectItem value="Medium">
                                    <div className="flex items-center gap-2">
                                        <div className="h-2 w-2 rounded-full bg-yellow-500" />
                                        <span className="font-medium">Medium</span>
                                    </div>
                                </SelectItem>
                                <SelectItem value="Low">
                                    <div className="flex items-center gap-2">
                                        <div className="h-2 w-2 rounded-full bg-green-500" />
                                        <span className="font-medium">Low</span>
                                    </div>
                                </SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                </div>

                <DialogFooter>
                    <Button variant="outline" onClick={() => onOpenChange(false)}>
                        Cancel
                    </Button>
                    <Button onClick={handleSubmit}>
                        Assign
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
