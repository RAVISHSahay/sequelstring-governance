
import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { CheckCircle, XCircle, FileSignature, ShieldCheck, Download, AlertTriangle } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";

interface CustomerPortalDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    quote: any; // Using any for simplicity as per existing mocks
}

export function CustomerPortalDialog({ open, onOpenChange, quote }: CustomerPortalDialogProps) {
    const [status, setStatus] = useState<"pending" | "accepted" | "rejected">("pending");
    const [signName, setSignName] = useState("");

    if (!quote) return null;

    const handleAccept = () => {
        if (!signName) {
            toast.error("Please provide a signature (type your name)");
            return;
        }
        setStatus("accepted");
        toast.success("Quote Accepted!", {
            description: "Thank you for your business. We are processing your order.",
        });
        // In a real app, this would trigger an API call
        setTimeout(() => onOpenChange(false), 2000);
    };

    const handleReject = () => {
        setStatus("rejected");
        toast.info("Quote Rejected", {
            description: "We have notified the sales representative.",
        });
        setTimeout(() => onOpenChange(false), 2000);
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-4xl h-[90vh] flex flex-col p-0 overflow-hidden bg-slate-50">
                {/* Header simulating cloud document viewer */}
                <div className="bg-white border-b px-6 py-4 flex items-center justify-between shadow-sm z-10">
                    <div className="flex items-center gap-3">
                        <div className="h-10 w-10 bg-primary rounded-lg flex items-center justify-center text-primary-foreground font-bold text-xl">
                            S
                        </div>
                        <div>
                            <h2 className="font-bold text-lg leading-tight">SequelString CRM</h2>
                            <p className="text-xs text-muted-foreground flex items-center gap-1">
                                <ShieldCheck className="h-3 w-3 text-green-600" />
                                Secure Document Viewer
                            </p>
                        </div>
                    </div>
                    <div className="flex items-center gap-2">
                        <Button variant="outline" size="sm" className="gap-2">
                            <Download className="h-4 w-4" />
                            Download PDF
                        </Button>
                        <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                            Valid until {quote.validUntil}
                        </Badge>
                    </div>
                </div>

                {/* Main Content */}
                <ScrollArea className="flex-1 p-6 md:p-10">
                    <div className="max-w-3xl mx-auto bg-white shadow-xl rounded-xl min-h-[800px] p-8 border">
                        {/* Proposal Content */}
                        <div className="flex justify-between items-start mb-12">
                            <div>
                                <h1 className="text-3xl font-bold text-slate-900 mb-2">Sales Proposal</h1>
                                <p className="text-slate-500">Reference: {quote.id}</p>
                                <p className="text-slate-500">Date: {quote.createdAt}</p>
                            </div>
                            <div className="text-right">
                                <h3 className="font-bold text-lg text-slate-900">Prepared For:</h3>
                                <p className="text-slate-600 text-lg">{quote.account}</p>
                                <p className="text-slate-500">Attn: Procurement Manager</p>
                            </div>
                        </div>

                        <Separator className="my-8" />

                        <div className="space-y-8">
                            <section>
                                <h3 className="text-lg font-bold mb-4 text-slate-800">Introduction</h3>
                                <p className="text-slate-600 leading-relaxed">
                                    SequelString is pleased to submit this proposal for the {quote.opportunity}.
                                    Based on our discussions, we have outlined a solution that meets your specific requirements for
                                    sales governance and workflow automation.
                                </p>
                            </section>

                            <section>
                                <h3 className="text-lg font-bold mb-4 text-slate-800">Investment Summary</h3>
                                <div className="bg-slate-50 rounded-lg border p-6">
                                    <div className="flex justify-between items-center mb-4 pb-4 border-b">
                                        <span className="font-medium">Solution Component</span>
                                        <span className="font-medium">Total Price</span>
                                    </div>
                                    <div className="flex justify-between items-center mb-2">
                                        <span className="text-slate-600">{quote.name}</span>
                                        <span className="font-semibold">{quote.value}</span>
                                    </div>
                                    <div className="flex justify-between items-center mb-2 text-sm text-green-600">
                                        <span>Discount applied</span>
                                        <span>{quote.discount}</span>
                                    </div>
                                    <div className="flex justify-between items-center pt-4 border-t mt-4">
                                        <span className="font-bold text-lg">Total Investment</span>
                                        <span className="font-bold text-xl text-primary">{quote.value}</span>
                                    </div>
                                </div>
                            </section>

                            <section>
                                <h3 className="text-lg font-bold mb-4 text-slate-800">Terms & Conditions</h3>
                                <ul className="list-disc pl-5 space-y-2 text-slate-600 text-sm">
                                    <li>This proposal is valid until {quote.validUntil}.</li>
                                    <li>Payment terms: 50% advance, 50% upon completion.</li>
                                    <li>Implementation timeline: 12 weeks from date of signature.</li>
                                    <li>Standard support included for 12 months.</li>
                                </ul>
                            </section>
                        </div>
                    </div>
                </ScrollArea>

                {/* Action Footer */}
                <div className="bg-white border-t px-6 py-4 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.1)] z-20">
                    {status === "pending" ? (
                        <div className="max-w-4xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
                            <div className="flex-1 w-full relative">
                                <div className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
                                    <FileSignature className="h-4 w-4" />
                                </div>
                                <input
                                    type="text"
                                    placeholder="Type your full name to sign..."
                                    className="w-full pl-10 pr-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary/50"
                                    value={signName}
                                    onChange={(e) => setSignName(e.target.value)}
                                />
                            </div>
                            <div className="flex gap-3 w-full md:w-auto">
                                <Button variant="destructive" className="flex-1 md:flex-none" onClick={handleReject}>
                                    <XCircle className="h-4 w-4 mr-2" />
                                    Reject
                                </Button>
                                <Button className="flex-1 md:flex-none bg-green-600 hover:bg-green-700" onClick={handleAccept}>
                                    <CheckCircle className="h-4 w-4 mr-2" />
                                    Accept & Sign
                                </Button>
                            </div>
                        </div>
                    ) : (
                        <div className="flex items-center justify-center p-2">
                            {status === "accepted" ? (
                                <div className="text-green-600 flex items-center gap-2 font-bold text-lg animate-fade-in">
                                    <CheckCircle className="h-6 w-6" />
                                    Review Completed: Quote Accepted by {signName}
                                </div>
                            ) : (
                                <div className="text-red-600 flex items-center gap-2 font-bold text-lg animate-fade-in">
                                    <AlertTriangle className="h-6 w-6" />
                                    Review Completed: Quote Rejected
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </DialogContent>
        </Dialog>
    );
}
