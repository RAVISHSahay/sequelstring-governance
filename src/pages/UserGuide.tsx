import { useState, useRef } from "react";
import { AppLayout } from "@/components/layout/AppLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  Download,
  FileText,
  Users,
  Building2,
  Target,
  Briefcase,
  DollarSign,
  BarChart3,
  Settings,
  CheckCircle,
  AlertTriangle,
  Keyboard,
  HelpCircle,
  BookOpen,
  Loader2,
} from "lucide-react";
import { toast } from "sonner";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";

export default function UserGuide() {
  const [isGenerating, setIsGenerating] = useState(false);
  const contentRef = useRef<HTMLDivElement>(null);

  const generatePDF = async () => {
    if (!contentRef.current) return;

    setIsGenerating(true);
    toast.info("Generating PDF... This may take a moment.");

    try {
      const pdf = new jsPDF("p", "mm", "a4");
      const pageWidth = pdf.internal.pageSize.getWidth();
      const pageHeight = pdf.internal.pageSize.getHeight();
      const margin = 15;
      const contentWidth = pageWidth - margin * 2;

      // Cover Page
      pdf.setFillColor(15, 23, 42); // slate-900
      pdf.rect(0, 0, pageWidth, pageHeight, "F");

      // Logo placeholder
      pdf.setFillColor(245, 158, 11); // amber-500
      pdf.roundedRect(pageWidth / 2 - 20, 60, 40, 40, 8, 8, "F");
      pdf.setTextColor(15, 23, 42);
      pdf.setFontSize(24);
      pdf.setFont("helvetica", "bold");
      pdf.text("SS", pageWidth / 2, 87, { align: "center" });

      // Title
      pdf.setTextColor(255, 255, 255);
      pdf.setFontSize(32);
      pdf.setFont("helvetica", "bold");
      pdf.text("SequelString CRM", pageWidth / 2, 130, { align: "center" });

      pdf.setFontSize(18);
      pdf.setFont("helvetica", "normal");
      pdf.text("Training & User Guide", pageWidth / 2, 145, { align: "center" });

      // Version info
      pdf.setFontSize(12);
      pdf.setTextColor(148, 163, 184); // slate-400
      pdf.text("Version 1.0 | January 2025", pageWidth / 2, 170, { align: "center" });
      pdf.text("Enterprise Revenue Governance Platform", pageWidth / 2, 182, { align: "center" });

      // Footer
      pdf.setFontSize(10);
      pdf.text("Confidential - Internal Use Only", pageWidth / 2, pageHeight - 20, { align: "center" });

      // Table of Contents
      pdf.addPage();
      let yPos = 30;

      pdf.setFillColor(15, 23, 42);
      pdf.rect(0, 0, pageWidth, 50, "F");
      pdf.setTextColor(255, 255, 255);
      pdf.setFontSize(24);
      pdf.setFont("helvetica", "bold");
      pdf.text("Table of Contents", margin, 35);

      pdf.setTextColor(15, 23, 42);
      pdf.setFontSize(12);
      pdf.setFont("helvetica", "normal");
      yPos = 70;

      const tocItems = [
        "1. Introduction & Purpose",
        "2. User Personas & Roles",
        "3. Getting Started",
        "4. Dashboard Overview",
        "5. Core CRM Modules",
        "   5.1 Accounts",
        "   5.2 Account Map (360° View)",
        "   5.3 Contacts",
        "   5.4 Leads",
        "   5.5 Opportunities",
        "6. Sales Operations",
        "   6.1 Quotes & Quote Builder",
        "   6.2 Contracts",
        "7. Intelligence Module",
        "   7.1 Forecasting",
        "   7.2 Win/Loss Analysis",
        "   7.3 POC Tracking",
        "8. Incentive Engine",
        "   8.1 Targets",
        "   8.2 Incentive Plans",
        "   8.3 Payouts",
        "9. Administration",
        "10. Role-Based Access Guide",
        "11. Step-by-Step Walkthroughs",
        "12. FAQs & Troubleshooting",
        "13. Best Practices",
        "14. Keyboard Shortcuts",
      ];

      tocItems.forEach((item) => {
        if (yPos > pageHeight - 20) {
          pdf.addPage();
          yPos = 30;
        }
        pdf.text(item, margin, yPos);
        yPos += 8;
      });

      // Section 1: Introduction
      pdf.addPage();
      yPos = addSectionHeader(pdf, "1. Introduction & Purpose", margin, pageWidth);

      pdf.setFontSize(14);
      pdf.setFont("helvetica", "bold");
      pdf.setTextColor(15, 23, 42);
      pdf.text("What is SequelString CRM?", margin, yPos);
      yPos += 10;

      pdf.setFontSize(11);
      pdf.setFont("helvetica", "normal");
      const introText = "SequelString CRM is an enterprise-grade Revenue Governance Platform designed for Indian enterprise sales teams. It integrates sales execution, commercial controls, revenue intelligence, and incentive management into a unified platform.";
      const introLines = pdf.splitTextToSize(introText, contentWidth);
      pdf.text(introLines, margin, yPos);
      yPos += introLines.length * 6 + 10;

      pdf.setFontSize(12);
      pdf.setFont("helvetica", "bold");
      pdf.text("Key Differentiators:", margin, yPos);
      yPos += 8;

      pdf.setFontSize(10);
      pdf.setFont("helvetica", "normal");
      const features = [
        "• 360° Account View - Complete visibility into account hierarchy and stakeholders",
        "• Stakeholder Influence Mapping - Visual power dynamics with champions and blockers",
        "• POC Governance - First-class POC lifecycle with KPI tracking",
        "• Revenue Behavior Engineering - Incentives linked to commercial discipline",
        "• Stage-Weighted Forecasting - Commit, Best Case, and Pipeline categories",
      ];
      features.forEach((f) => {
        pdf.text(f, margin, yPos);
        yPos += 6;
      });

      // Section 2: Roles
      pdf.addPage();
      yPos = addSectionHeader(pdf, "2. User Personas & Roles", margin, pageWidth);

      pdf.setFontSize(11);
      pdf.setFont("helvetica", "normal");
      pdf.setTextColor(15, 23, 42);

      const roles = [
        { name: "Administrator", desc: "Full system access including user management and admin controls" },
        { name: "Sales Head", desc: "Manage sales team, approve payouts, set targets" },
        { name: "Finance", desc: "Approve payouts, view audit logs, financial reporting" },
        { name: "HR", desc: "Manage users, approve payouts, view performance" },
        { name: "Sales Representative", desc: "Manage accounts, leads, opportunities, and quotes" },
        { name: "Viewer", desc: "Read-only access to most areas" },
      ];

      roles.forEach((role) => {
        pdf.setFont("helvetica", "bold");
        pdf.text(role.name, margin, yPos);
        yPos += 6;
        pdf.setFont("helvetica", "normal");
        pdf.text(role.desc, margin + 5, yPos);
        yPos += 10;
      });

      // Section 3: Getting Started
      pdf.addPage();
      yPos = addSectionHeader(pdf, "3. Getting Started", margin, pageWidth);

      pdf.setFontSize(12);
      pdf.setFont("helvetica", "bold");
      pdf.text("Navigation Structure", margin, yPos);
      yPos += 10;

      pdf.setFontSize(10);
      pdf.setFont("helvetica", "normal");
      const navItems = [
        "Main Navigation: Dashboard, Accounts, Account Map, Contacts, Leads, Opportunities, Quotes, Contracts, Orders, Activities",
        "Intelligence: Forecasting, Win/Loss Analysis, POC Tracking, Sales Stages",
        "Incentive Engine: Targets, Incentives, Payouts, Performance, Admin",
        "Secondary: Users, Reports, Pricing, Settings",
      ];
      navItems.forEach((item) => {
        const lines = pdf.splitTextToSize("• " + item, contentWidth);
        pdf.text(lines, margin, yPos);
        yPos += lines.length * 5 + 3;
      });

      // Section 4: Core Modules
      pdf.addPage();
      yPos = addSectionHeader(pdf, "4. Core CRM Modules", margin, pageWidth);

      const modules = [
        { name: "Accounts", desc: "Manage enterprise accounts with type classification (Enterprise, PSU, Government), industry tracking, and revenue visibility." },
        { name: "Account Map", desc: "360° command center with stakeholder mapping, opportunity pipeline, and activity timeline. Supports keyboard shortcuts (⌘+O, ⌘+C, ⌘+A)." },
        { name: "Contacts", desc: "Track decision-makers, influencers, and users within accounts with role and influence scoring." },
        { name: "Leads", desc: "Qualify prospects with lead scoring (0-100). Convert qualified leads to opportunities." },
        { name: "Opportunities", desc: "Kanban pipeline with stages: Lead → Qualified → Proposal → Negotiation → Closed Won." },
      ];

      modules.forEach((mod) => {
        if (yPos > pageHeight - 40) {
          pdf.addPage();
          yPos = 30;
        }
        pdf.setFont("helvetica", "bold");
        pdf.setFontSize(12);
        pdf.text(mod.name, margin, yPos);
        yPos += 7;
        pdf.setFont("helvetica", "normal");
        pdf.setFontSize(10);
        const lines = pdf.splitTextToSize(mod.desc, contentWidth);
        pdf.text(lines, margin, yPos);
        yPos += lines.length * 5 + 8;
      });

      // Section 5: Sales Operations
      pdf.addPage();
      yPos = addSectionHeader(pdf, "5. Sales Operations", margin, pageWidth);

      pdf.setFontSize(12);
      pdf.setFont("helvetica", "bold");
      pdf.text("Quotes & Quote Builder", margin, yPos);
      yPos += 8;

      pdf.setFontSize(10);
      pdf.setFont("helvetica", "normal");
      const quoteText = "Create quotes with product catalog, line items, and discount governance. Discounts over 5% require approval based on the discount matrix.";
      const quoteLines = pdf.splitTextToSize(quoteText, contentWidth);
      pdf.text(quoteLines, margin, yPos);
      yPos += quoteLines.length * 5 + 10;

      pdf.setFontSize(11);
      pdf.setFont("helvetica", "bold");
      pdf.text("Discount Approval Matrix:", margin, yPos);
      yPos += 8;

      pdf.setFontSize(10);
      pdf.setFont("helvetica", "normal");
      const discounts = [
        "• 0-5%: Auto-approved",
        "• 5-10%: Sales Head approval",
        "• 10-15%: VP Sales approval",
        "• >15%: CEO/Finance approval",
      ];
      discounts.forEach((d) => {
        pdf.text(d, margin, yPos);
        yPos += 6;
      });

      // Section 6: Incentive Engine
      pdf.addPage();
      yPos = addSectionHeader(pdf, "6. Incentive Engine", margin, pageWidth);

      pdf.setFontSize(11);
      pdf.setFont("helvetica", "normal");

      const incentiveContent = [
        { title: "Targets", desc: "Multi-dimensional targets at individual, team, region, product, and service line levels. Types include Revenue, Booking, Collection, Margin, and Volume." },
        { title: "Incentive Plans", desc: "Commission models: Flat %, Slab-Based, Tiered, Product-Wise, Margin-Based, Discount-Linked, Accelerator, Decelerator." },
        { title: "Payouts", desc: "Manage commission calculations, approvals, and disbursement. Status flow: Calculated → Pending Approval → Approved → Released." },
      ];

      incentiveContent.forEach((item) => {
        pdf.setFont("helvetica", "bold");
        pdf.setFontSize(12);
        pdf.text(item.title, margin, yPos);
        yPos += 7;
        pdf.setFont("helvetica", "normal");
        pdf.setFontSize(10);
        const lines = pdf.splitTextToSize(item.desc, contentWidth);
        pdf.text(lines, margin, yPos);
        yPos += lines.length * 5 + 10;
      });

      // Section 7: FAQs
      pdf.addPage();
      yPos = addSectionHeader(pdf, "7. FAQs & Troubleshooting", margin, pageWidth);

      const faqs = [
        { q: "Why can't I see certain menu items?", a: "Menu visibility is based on your role's permissions. Contact your administrator to request access." },
        { q: "Why can't I move my opportunity to Proposal stage?", a: "Ensure all entry criteria are met: Budget identified, primary contact assigned, required fields completed." },
        { q: "My CSV import is failing. What should I check?", a: "Check encoding (UTF-8), headers match template, required fields have values, and date/phone/email formats." },
        { q: "My quote is stuck in Pending Approval.", a: "Check who the approver is in quote details. Contact them directly or escalate if urgent." },
        { q: "Why is my commission showing as Pending Calculation?", a: "Commission calculations run on schedule (typically daily/weekly). Contact Finance if pending too long." },
      ];

      faqs.forEach((faq) => {
        if (yPos > pageHeight - 40) {
          pdf.addPage();
          yPos = 30;
        }
        pdf.setFont("helvetica", "bold");
        pdf.setFontSize(10);
        pdf.text("Q: " + faq.q, margin, yPos);
        yPos += 6;
        pdf.setFont("helvetica", "normal");
        const aLines = pdf.splitTextToSize("A: " + faq.a, contentWidth);
        pdf.text(aLines, margin, yPos);
        yPos += aLines.length * 5 + 8;
      });

      // Section 8: Keyboard Shortcuts
      pdf.addPage();
      yPos = addSectionHeader(pdf, "8. Keyboard Shortcuts", margin, pageWidth);

      pdf.setFontSize(10);
      pdf.setFont("helvetica", "normal");

      const shortcuts = [
        { key: "⌘ + O", action: "Add Opportunity (Account Map)" },
        { key: "⌘ + C", action: "Add Contact (Account Map)" },
        { key: "⌘ + A", action: "Log Activity (Account Map)" },
        { key: "?", action: "Show help overlay" },
        { key: "Esc", action: "Close dialogs" },
      ];

      shortcuts.forEach((s) => {
        pdf.setFont("helvetica", "bold");
        pdf.text(s.key, margin, yPos);
        pdf.setFont("helvetica", "normal");
        pdf.text(s.action, margin + 40, yPos);
        yPos += 8;
      });

      // Section 9: Best Practices
      yPos += 15;
      pdf.setFontSize(14);
      pdf.setFont("helvetica", "bold");
      pdf.text("Best Practices", margin, yPos);
      yPos += 10;

      pdf.setFontSize(10);
      pdf.setFont("helvetica", "normal");
      const practices = [
        "• Complete all required fields for accurate reporting",
        "• Update opportunities weekly for reliable forecasting",
        "• Log all customer interactions same-day",
        "• Follow stage criteria strictly for accurate probability",
        "• Use the Commission Calculator to model potential earnings",
        "• Review at-risk deals weekly and take action",
      ];
      practices.forEach((p) => {
        pdf.text(p, margin, yPos);
        yPos += 6;
      });

      // Final page
      pdf.addPage();
      pdf.setFillColor(15, 23, 42);
      pdf.rect(0, 0, pageWidth, pageHeight, "F");

      pdf.setTextColor(245, 158, 11);
      pdf.setFontSize(20);
      pdf.setFont("helvetica", "bold");
      pdf.text("Need Help?", pageWidth / 2, 80, { align: "center" });

      pdf.setTextColor(255, 255, 255);
      pdf.setFontSize(12);
      pdf.setFont("helvetica", "normal");
      pdf.text("Contact your system administrator or IT support team", pageWidth / 2, 100, { align: "center" });
      pdf.text("for assistance with SequelString CRM.", pageWidth / 2, 112, { align: "center" });

      pdf.setTextColor(148, 163, 184);
      pdf.setFontSize(10);
      pdf.text("© 2025 SequelString CRM. All rights reserved.", pageWidth / 2, pageHeight - 30, { align: "center" });
      pdf.text("Confidential - Internal Use Only", pageWidth / 2, pageHeight - 20, { align: "center" });

      // Save PDF
      pdf.save("SequelString_CRM_User_Guide.pdf");
      toast.success("PDF generated successfully!");
    } catch (error) {
      console.error("PDF generation error:", error);
      toast.error("Failed to generate PDF. Please try again.");
    } finally {
      setIsGenerating(false);
    }
  };

  function addSectionHeader(pdf: jsPDF, title: string, margin: number, pageWidth: number): number {
    pdf.setFillColor(15, 23, 42);
    pdf.rect(0, 0, pageWidth, 50, "F");
    pdf.setTextColor(255, 255, 255);
    pdf.setFontSize(20);
    pdf.setFont("helvetica", "bold");
    pdf.text(title, margin, 35);
    pdf.setTextColor(15, 23, 42);
    return 70;
  }

  return (
    <AppLayout title="User Guide">
      <div className="max-w-5xl mx-auto space-y-6" ref={contentRef}>
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="h-14 w-14 rounded-xl bg-gradient-accent flex items-center justify-center">
              <BookOpen className="h-7 w-7 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-foreground">Training & User Guide</h1>
              <p className="text-muted-foreground">
                Comprehensive documentation for SequelString CRM
              </p>
            </div>
          </div>
          <Button onClick={generatePDF} disabled={isGenerating} size="lg" className="gap-2">
            {isGenerating ? (
              <>
                <Loader2 className="h-5 w-5 animate-spin" />
                Generating...
              </>
            ) : (
              <>
                <Download className="h-5 w-5" />
                Download PDF
              </>
            )}
          </Button>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card className="bg-primary/5 border-primary/20">
            <CardContent className="p-4 flex items-center gap-3">
              <FileText className="h-8 w-8 text-primary" />
              <div>
                <p className="text-2xl font-bold">15</p>
                <p className="text-sm text-muted-foreground">Sections</p>
              </div>
            </CardContent>
          </Card>
          <Card className="bg-accent/5 border-accent/20">
            <CardContent className="p-4 flex items-center gap-3">
              <Users className="h-8 w-8 text-accent" />
              <div>
                <p className="text-2xl font-bold">6</p>
                <p className="text-sm text-muted-foreground">User Roles</p>
              </div>
            </CardContent>
          </Card>
          <Card className="bg-success/5 border-success/20">
            <CardContent className="p-4 flex items-center gap-3">
              <CheckCircle className="h-8 w-8 text-success" />
              <div>
                <p className="text-2xl font-bold">8</p>
                <p className="text-sm text-muted-foreground">Walkthroughs</p>
              </div>
            </CardContent>
          </Card>
          <Card className="bg-info/5 border-info/20">
            <CardContent className="p-4 flex items-center gap-3">
              <HelpCircle className="h-8 w-8 text-info" />
              <div>
                <p className="text-2xl font-bold">24</p>
                <p className="text-sm text-muted-foreground">FAQs</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Guide Sections */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BookOpen className="h-5 w-5" />
              Guide Contents
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Accordion type="multiple" className="w-full">
              {/* Introduction */}
              <AccordionItem value="intro">
                <AccordionTrigger className="text-left">
                  <div className="flex items-center gap-3">
                    <div className="h-8 w-8 rounded-lg bg-primary/10 flex items-center justify-center">
                      <FileText className="h-4 w-4 text-primary" />
                    </div>
                    <span>1. Introduction & Purpose</span>
                  </div>
                </AccordionTrigger>
                <AccordionContent className="pl-11 space-y-4">
                  <p className="text-muted-foreground">
                    SequelString CRM is an enterprise-grade Revenue Governance Platform designed for 
                    Indian enterprise sales teams. It integrates sales execution, commercial controls, 
                    revenue intelligence, and incentive management.
                  </p>
                  <div className="space-y-2">
                    <h4 className="font-semibold">Key Differentiators:</h4>
                    <ul className="list-disc list-inside text-sm text-muted-foreground space-y-1">
                      <li>360° Account View with stakeholder hierarchy</li>
                      <li>Stakeholder Influence Mapping with power dynamics</li>
                      <li>POC Governance with KPI tracking</li>
                      <li>Revenue Behavior Engineering through incentives</li>
                      <li>Stage-Weighted Forecasting with categories</li>
                    </ul>
                  </div>
                </AccordionContent>
              </AccordionItem>

              {/* Roles */}
              <AccordionItem value="roles">
                <AccordionTrigger className="text-left">
                  <div className="flex items-center gap-3">
                    <div className="h-8 w-8 rounded-lg bg-accent/10 flex items-center justify-center">
                      <Users className="h-4 w-4 text-accent" />
                    </div>
                    <span>2. User Personas & Roles</span>
                  </div>
                </AccordionTrigger>
                <AccordionContent className="pl-11">
                  <div className="grid gap-3">
                    {[
                      { role: "Administrator", desc: "Full system access including user management", color: "bg-purple-500" },
                      { role: "Sales Head", desc: "Manage team, approve payouts, set targets", color: "bg-blue-500" },
                      { role: "Finance", desc: "Approve payouts, audit logs, financial reporting", color: "bg-amber-500" },
                      { role: "HR", desc: "Manage users, approve payouts, view performance", color: "bg-pink-500" },
                      { role: "Sales Rep", desc: "Manage accounts, leads, opportunities, quotes", color: "bg-emerald-500" },
                      { role: "Viewer", desc: "Read-only access to most areas", color: "bg-slate-500" },
                    ].map((item) => (
                      <div key={item.role} className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
                        <div className={`h-3 w-3 rounded-full ${item.color}`} />
                        <div>
                          <p className="font-medium">{item.role}</p>
                          <p className="text-sm text-muted-foreground">{item.desc}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </AccordionContent>
              </AccordionItem>

              {/* Core CRM */}
              <AccordionItem value="crm">
                <AccordionTrigger className="text-left">
                  <div className="flex items-center gap-3">
                    <div className="h-8 w-8 rounded-lg bg-info/10 flex items-center justify-center">
                      <Building2 className="h-4 w-4 text-info" />
                    </div>
                    <span>3. Core CRM Modules</span>
                  </div>
                </AccordionTrigger>
                <AccordionContent className="pl-11 space-y-4">
                  <div className="grid gap-4">
                    <div className="p-4 border rounded-lg">
                      <h4 className="font-semibold mb-2">Accounts</h4>
                      <p className="text-sm text-muted-foreground">
                        Manage enterprise accounts with type classification (Enterprise, PSU, Government), 
                        industry tracking, revenue visibility, and owner assignment.
                      </p>
                    </div>
                    <div className="p-4 border rounded-lg">
                      <h4 className="font-semibold mb-2">Account Map (360° View)</h4>
                      <p className="text-sm text-muted-foreground">
                        Command center with stakeholder mapping, opportunity pipeline, activity timeline, 
                        and follow-up reminders. Supports keyboard shortcuts.
                      </p>
                    </div>
                    <div className="p-4 border rounded-lg">
                      <h4 className="font-semibold mb-2">Opportunities</h4>
                      <p className="text-sm text-muted-foreground">
                        Kanban pipeline: Lead → Qualified → Proposal → Negotiation → Closed Won. 
                        Stage governance with entry/exit criteria.
                      </p>
                    </div>
                  </div>
                </AccordionContent>
              </AccordionItem>

              {/* Sales Operations */}
              <AccordionItem value="sales-ops">
                <AccordionTrigger className="text-left">
                  <div className="flex items-center gap-3">
                    <div className="h-8 w-8 rounded-lg bg-success/10 flex items-center justify-center">
                      <Briefcase className="h-4 w-4 text-success" />
                    </div>
                    <span>4. Sales Operations</span>
                  </div>
                </AccordionTrigger>
                <AccordionContent className="pl-11 space-y-4">
                  <div>
                    <h4 className="font-semibold mb-2">Quote Builder</h4>
                    <p className="text-sm text-muted-foreground mb-3">
                      Create quotes with product catalog, discount controls, and payment terms configuration.
                    </p>
                    <div className="bg-muted/50 p-3 rounded-lg">
                      <p className="text-sm font-medium mb-2">Discount Approval Matrix:</p>
                      <ul className="text-sm space-y-1">
                        <li>• 0-5%: Auto-approved</li>
                        <li>• 5-10%: Sales Head</li>
                        <li>• 10-15%: VP Sales</li>
                        <li>• &gt;15%: CEO/Finance</li>
                      </ul>
                    </div>
                  </div>
                  <Separator />
                  <div>
                    <h4 className="font-semibold mb-2">Contracts</h4>
                    <p className="text-sm text-muted-foreground">
                      Manage MSAs, licenses, support agreements, and NDAs with renewal alerts.
                    </p>
                  </div>
                </AccordionContent>
              </AccordionItem>

              {/* Incentive Engine */}
              <AccordionItem value="incentives">
                <AccordionTrigger className="text-left">
                  <div className="flex items-center gap-3">
                    <div className="h-8 w-8 rounded-lg bg-chart-4/10 flex items-center justify-center">
                      <DollarSign className="h-4 w-4 text-chart-4" />
                    </div>
                    <span>5. Incentive Engine</span>
                  </div>
                </AccordionTrigger>
                <AccordionContent className="pl-11 space-y-4">
                  <div className="grid gap-3">
                    <div className="p-3 border rounded-lg">
                      <h4 className="font-semibold">Targets</h4>
                      <p className="text-sm text-muted-foreground">
                        Multi-dimensional: Individual, Team, Region, Product, Service Line. 
                        Types: Revenue, Booking, Collection, Margin, Volume.
                      </p>
                    </div>
                    <div className="p-3 border rounded-lg">
                      <h4 className="font-semibold">Commission Models</h4>
                      <p className="text-sm text-muted-foreground">
                        Flat %, Slab-Based, Tiered, Product-Wise, Margin-Based, 
                        Discount-Linked, Accelerator, Decelerator.
                      </p>
                    </div>
                    <div className="p-3 border rounded-lg">
                      <h4 className="font-semibold">Payouts</h4>
                      <p className="text-sm text-muted-foreground">
                        Flow: Calculated → Pending Approval → Approved → Released. 
                        Supports holdbacks and clawbacks.
                      </p>
                    </div>
                  </div>
                </AccordionContent>
              </AccordionItem>

              {/* Intelligence */}
              <AccordionItem value="intelligence">
                <AccordionTrigger className="text-left">
                  <div className="flex items-center gap-3">
                    <div className="h-8 w-8 rounded-lg bg-warning/10 flex items-center justify-center">
                      <BarChart3 className="h-4 w-4 text-warning" />
                    </div>
                    <span>6. Intelligence Module</span>
                  </div>
                </AccordionTrigger>
                <AccordionContent className="pl-11 space-y-3">
                  <div className="flex items-start gap-3">
                    <Badge variant="secondary">Forecasting</Badge>
                    <p className="text-sm text-muted-foreground">
                      Stage-weighted revenue forecasting with Commit, Best Case, and Pipeline categories.
                    </p>
                  </div>
                  <div className="flex items-start gap-3">
                    <Badge variant="secondary">Win/Loss</Badge>
                    <p className="text-sm text-muted-foreground">
                      Analyze closed deals to identify patterns and improve win rates.
                    </p>
                  </div>
                  <div className="flex items-start gap-3">
                    <Badge variant="secondary">POC Tracking</Badge>
                    <p className="text-sm text-muted-foreground">
                      First-class POC lifecycle with KPI tracking and probability impact.
                    </p>
                  </div>
                </AccordionContent>
              </AccordionItem>

              {/* Keyboard Shortcuts */}
              <AccordionItem value="shortcuts">
                <AccordionTrigger className="text-left">
                  <div className="flex items-center gap-3">
                    <div className="h-8 w-8 rounded-lg bg-muted flex items-center justify-center">
                      <Keyboard className="h-4 w-4" />
                    </div>
                    <span>7. Keyboard Shortcuts</span>
                  </div>
                </AccordionTrigger>
                <AccordionContent className="pl-11">
                  <div className="grid gap-2">
                    {[
                      { key: "⌘ + O", action: "Add Opportunity (Account Map)" },
                      { key: "⌘ + C", action: "Add Contact (Account Map)" },
                      { key: "⌘ + A", action: "Log Activity (Account Map)" },
                      { key: "?", action: "Show help overlay" },
                      { key: "Esc", action: "Close dialogs" },
                    ].map((s) => (
                      <div key={s.key} className="flex items-center gap-4 p-2 rounded bg-muted/50">
                        <kbd className="px-2 py-1 bg-background rounded border text-sm font-mono min-w-[80px] text-center">
                          {s.key}
                        </kbd>
                        <span className="text-sm">{s.action}</span>
                      </div>
                    ))}
                  </div>
                </AccordionContent>
              </AccordionItem>

              {/* FAQs */}
              <AccordionItem value="faqs">
                <AccordionTrigger className="text-left">
                  <div className="flex items-center gap-3">
                    <div className="h-8 w-8 rounded-lg bg-destructive/10 flex items-center justify-center">
                      <HelpCircle className="h-4 w-4 text-destructive" />
                    </div>
                    <span>8. FAQs & Troubleshooting</span>
                  </div>
                </AccordionTrigger>
                <AccordionContent className="pl-11 space-y-4">
                  {[
                    { q: "Why can't I see certain menu items?", a: "Menu visibility is based on your role's permissions. Contact your administrator to request access." },
                    { q: "Why can't I move my opportunity to Proposal stage?", a: "Ensure all entry criteria are met: Budget identified, primary contact assigned, required fields completed." },
                    { q: "My CSV import is failing.", a: "Check: UTF-8 encoding, headers match template, required fields have values, correct date/phone/email formats." },
                    { q: "My quote is stuck in Pending Approval.", a: "Check who the approver is in quote details. Contact them directly or escalate to your manager if urgent." },
                    { q: "Why is my commission Pending Calculation?", a: "Commission calculations run on schedule (typically daily/weekly). Contact Finance if pending too long." },
                  ].map((faq, i) => (
                    <div key={i} className="p-3 border rounded-lg">
                      <p className="font-medium text-sm flex items-start gap-2">
                        <AlertTriangle className="h-4 w-4 text-warning mt-0.5 shrink-0" />
                        {faq.q}
                      </p>
                      <p className="text-sm text-muted-foreground mt-2 pl-6">{faq.a}</p>
                    </div>
                  ))}
                </AccordionContent>
              </AccordionItem>

              {/* Best Practices */}
              <AccordionItem value="best-practices">
                <AccordionTrigger className="text-left">
                  <div className="flex items-center gap-3">
                    <div className="h-8 w-8 rounded-lg bg-success/10 flex items-center justify-center">
                      <CheckCircle className="h-4 w-4 text-success" />
                    </div>
                    <span>9. Best Practices</span>
                  </div>
                </AccordionTrigger>
                <AccordionContent className="pl-11">
                  <ul className="space-y-2">
                    {[
                      "Complete all required fields for accurate reporting",
                      "Update opportunities weekly for reliable forecasting",
                      "Log all customer interactions same-day",
                      "Follow stage criteria strictly for accurate probability",
                      "Use the Commission Calculator to model potential earnings",
                      "Review at-risk deals weekly and take action",
                      "Map all stakeholders including blockers",
                      "Set realistic close dates based on sales cycle",
                    ].map((practice, i) => (
                      <li key={i} className="flex items-center gap-2 text-sm">
                        <CheckCircle className="h-4 w-4 text-success shrink-0" />
                        {practice}
                      </li>
                    ))}
                  </ul>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </CardContent>
        </Card>

        {/* Footer */}
        <Card className="bg-sidebar border-sidebar-border">
          <CardContent className="p-6 text-center">
            <p className="text-sidebar-foreground font-medium">Need Help?</p>
            <p className="text-sidebar-foreground/70 text-sm mt-1">
              Contact your system administrator or IT support team for assistance.
            </p>
            <p className="text-sidebar-foreground/50 text-xs mt-4">
              © 2025 SequelString CRM. All rights reserved.
            </p>
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  );
}
