export interface HelpArticle {
  id: string;
  title: string;
  category: string;
  keywords: string[];
  content: string;
  relatedTopics?: string[];
}

export interface HelpCategory {
  id: string;
  name: string;
  icon: string;
  description: string;
}

export const helpCategories: HelpCategory[] = [
  { id: "getting-started", name: "Getting Started", icon: "Rocket", description: "Learn the basics of SequelString CRM" },
  { id: "accounts", name: "Accounts", icon: "Building2", description: "Managing company accounts and hierarchies" },
  { id: "contacts", name: "Contacts", icon: "Users", description: "Contact management and stakeholder mapping" },
  { id: "leads", name: "Leads", icon: "Target", description: "Lead capture, qualification, and conversion" },
  { id: "opportunities", name: "Opportunities", icon: "Briefcase", description: "Sales pipeline and deal management" },
  { id: "quotes", name: "Quotes & CPQ", icon: "FileText", description: "Quote creation and pricing" },
  { id: "incentives", name: "Incentives", icon: "DollarSign", description: "Targets, commissions, and payouts" },
  { id: "intelligence", name: "Intelligence", icon: "TrendingUp", description: "Forecasting and analytics" },
  { id: "admin", name: "Administration", icon: "Shield", description: "User management and settings" },
  { id: "shortcuts", name: "Shortcuts", icon: "Keyboard", description: "Keyboard shortcuts and tips" },
];

export const helpArticles: HelpArticle[] = [
  // Getting Started
  {
    id: "what-is-sequelstring",
    title: "What is SequelString CRM?",
    category: "getting-started",
    keywords: ["introduction", "overview", "about", "crm", "platform"],
    content: `SequelString CRM is an enterprise-grade Revenue Governance Platform designed for Indian enterprise sales teams. It integrates Sales Execution (lead-to-cash workflow management), Commercial Controls (pricing governance, discount discipline, and approval workflows), Revenue Intelligence (forecasting, win/loss analytics, and pipeline governance), and Incentive Management (targets, commissions, payouts, and performance tracking).`,
    relatedTopics: ["navigation-basics", "user-roles"],
  },
  {
    id: "navigation-basics",
    title: "How to Navigate the Application",
    category: "getting-started",
    keywords: ["navigation", "sidebar", "menu", "collapse", "expand"],
    content: `The application has a collapsible sidebar on the left with sections: Main Navigation (Dashboard, Accounts, Contacts, Leads, Opportunities, Quotes, Contracts, Orders, Activities), Intelligence (Forecasting, Win/Loss, POC Tracking, Sales Stages), Incentive Engine (Targets, Incentives, Payouts, Performance, Admin), and Secondary (Users, Reports, Pricing, Settings). Click the Collapse button at the bottom to minimize the sidebar, showing only icons.`,
    relatedTopics: ["what-is-sequelstring", "keyboard-shortcuts"],
  },
  {
    id: "user-roles",
    title: "Understanding User Roles & Permissions",
    category: "getting-started",
    keywords: ["roles", "permissions", "access", "admin", "sales", "finance", "hr"],
    content: `SequelString has six roles: Administrator (full system access), Sales Head (manage sales team, approve payouts, set targets), Finance (approve payouts, view audit logs, financial reporting), HR (manage users, approve payouts, view performance), Sales Representative (manage accounts, leads, opportunities, and quotes), and Viewer (read-only access). Your role determines what modules and actions you can access.`,
  },
  {
    id: "quick-actions",
    title: "Using Quick Actions",
    category: "getting-started",
    keywords: ["new", "create", "quick", "add", "lead", "account", "opportunity", "quote"],
    content: `The Quick Actions button (+ New) in the header provides fast access to create new records from anywhere: New Lead, New Account, New Opportunity, New Quote, and New Contact. This saves time by eliminating the need to navigate to specific modules first.`,
  },

  // Accounts
  {
    id: "account-management",
    title: "Managing Accounts",
    category: "accounts",
    keywords: ["account", "company", "organization", "create", "edit", "delete"],
    content: `Accounts represent companies or organizations you do business with. To create an account: Click 'Add Account' button, fill in company details (Name, Industry, Revenue, Employees, Website, Classification, Type), and save. Each account can have parent/subsidiary relationships, multiple contacts, opportunities, and activities.`,
    relatedTopics: ["account-hierarchy", "account-map"],
  },
  {
    id: "account-hierarchy",
    title: "Account Hierarchies (Parent/Subsidiary)",
    category: "accounts",
    keywords: ["hierarchy", "parent", "subsidiary", "group", "relationship"],
    content: `SequelString supports multi-level account hierarchies. Enterprise accounts can have subsidiaries, JVs, and project-wise sub-accounts. When creating an account, select the Parent Account to establish the relationship. The Account Map visualizes these hierarchies for better relationship understanding.`,
    relatedTopics: ["account-management", "account-map"],
  },
  {
    id: "account-map",
    title: "Using the Account Map (360° View)",
    category: "accounts",
    keywords: ["map", "360", "visualization", "stakeholder", "influence", "graph"],
    content: `The Account Map provides a complete 360° view of an account including: Stakeholder Influence Graph (visual power dynamics), Communication Log (interaction history), Follow-up Reminders (automated prompts), and Quick Actions (keyboard shortcuts ⌘O for Opportunity, ⌘C for Contact, ⌘A for Activity). Press '?' to see the help overlay.`,
    relatedTopics: ["stakeholder-mapping", "communication-log"],
  },
  {
    id: "stakeholder-mapping",
    title: "Stakeholder Influence Mapping",
    category: "accounts",
    keywords: ["stakeholder", "champion", "blocker", "influence", "politics", "decision"],
    content: `The Stakeholder Influence Graph maps key players by their stance (Champion, Supporter, Neutral, Blocker) and influence level (1-5). View modes: Influence View (power dynamics), Hierarchy View (reporting structure), Sentiment View (relationship health). Drag nodes to reposition, draw relationships between stakeholders, and export as PNG or PDF.`,
  },

  // Contacts
  {
    id: "contact-management",
    title: "Managing Contacts",
    category: "contacts",
    keywords: ["contact", "person", "stakeholder", "create", "edit"],
    content: `Contacts are individuals within accounts. Create contacts with: Name, Email, Phone, Title, Department, Account association, Contact Type (Primary/Secondary/Billing), and Influence Level. Filter contacts by account, search by name or email, and export contact lists to CSV.`,
    relatedTopics: ["stakeholder-mapping", "communication-log"],
  },
  {
    id: "communication-log",
    title: "Logging Communications",
    category: "contacts",
    keywords: ["communication", "log", "call", "email", "meeting", "activity"],
    content: `Track all interactions with contacts through the Communication Log. Log types: Calls (phone conversations), Emails (sent/received), Meetings (in-person or virtual), Documents (shared files). Each log captures: Date, Duration, Summary, Next Steps, and Sentiment. Communications appear on the Activity timeline.`,
  },

  // Leads
  {
    id: "lead-management",
    title: "Managing Leads",
    category: "leads",
    keywords: ["lead", "prospect", "create", "qualify", "convert"],
    content: `Leads are potential prospects that haven't been qualified yet. Capture leads with: Company Name, Contact Info, Source (Web, Referral, Event, etc.), Status (New, Contacted, Qualified, Unqualified), and Interest Level. Use filters to segment leads by status, source, or date.`,
    relatedTopics: ["lead-conversion", "lead-scoring"],
  },
  {
    id: "lead-conversion",
    title: "Converting Leads to Opportunities",
    category: "leads",
    keywords: ["convert", "opportunity", "account", "contact", "qualification"],
    content: `To convert a qualified lead: 1) Open the lead details, 2) Click 'Convert to Opportunity', 3) The system creates an Account (if new), Contact, and Opportunity automatically, 4) Original lead is marked as 'Converted'. Conversion ensures no data loss and maintains the audit trail.`,
  },

  // Opportunities
  {
    id: "opportunity-management",
    title: "Managing Opportunities",
    category: "opportunities",
    keywords: ["opportunity", "deal", "pipeline", "create", "stage", "close"],
    content: `Opportunities are active sales deals. Key fields: Account, Value, Stage, Probability, Expected Close Date, Type (New/Expansion/Renewal). Navigate through sales stages: Prospecting → Qualification → Needs Analysis → Proposal → Negotiation → Closed Won/Lost. Each stage has entry/exit criteria enforced by the system.`,
    relatedTopics: ["sales-stages", "forecasting"],
  },
  {
    id: "sales-stages",
    title: "Sales Stage Governance",
    category: "opportunities",
    keywords: ["stage", "governance", "criteria", "budget", "approval", "mandatory"],
    content: `Each sales stage has mandatory requirements. Example: Cannot move to 'Proposal' without 'Budget Identified', cannot move to 'Negotiation' without 'Project Approved'. These governance rules ensure deals are properly qualified and forecasts are accurate. Admins configure stage requirements in Sales Stage Configuration.`,
  },
  {
    id: "poc-tracking",
    title: "POC (Proof of Concept) Tracking",
    category: "opportunities",
    keywords: ["poc", "proof", "concept", "trial", "evaluation", "kpi"],
    content: `POCs are tracked as first-class entities with dedicated governance. Create POCs with KPIs and weightage (totaling 100%). Track: Timeline, Team Members, Success Criteria, Completion Status. POC outcomes directly influence deal probability. Access POC Tracking from the Intelligence menu.`,
  },

  // Quotes
  {
    id: "quote-creation",
    title: "Creating Quotes",
    category: "quotes",
    keywords: ["quote", "create", "proposal", "pricing", "line item"],
    content: `To create a quote: 1) Navigate to Quotes, 2) Click 'New Quote' to open Quote Builder, 3) Select customer and opportunity, 4) Add products from the catalog, 5) Configure pricing and discounts, 6) Set payment terms, 7) Generate PDF for customer. Quotes can have multiple versions and require approval for large discounts.`,
    relatedTopics: ["discount-controls", "payment-terms"],
  },
  {
    id: "discount-controls",
    title: "Discount Governance & Approvals",
    category: "quotes",
    keywords: ["discount", "approval", "governance", "pricing", "margin"],
    content: `Discount governance enforces approval workflows: Discounts >10% require Manager approval, Discounts >20% require Finance approval, Discounts >30% require Executive approval. Non-compliant discounts may impact commission payouts. The system tracks all discount justifications for audit.`,
  },
  {
    id: "payment-terms",
    title: "Configuring Payment Terms",
    category: "quotes",
    keywords: ["payment", "terms", "milestone", "schedule", "invoice"],
    content: `Payment terms can be configured per line item: Net 30/60/90, Milestone-based (e.g., 30% advance, 40% on delivery, 30% on acceptance), or Custom schedules. Non-standard terms require approval and may affect payout timing. Each term is linked to the Incentive Engine for commission calculations.`,
  },

  // Incentives
  {
    id: "target-management",
    title: "Setting Sales Targets",
    category: "incentives",
    keywords: ["target", "quota", "goal", "revenue", "booking"],
    content: `Sales targets are multi-dimensional: Individual, Team, Region, Product, Platform, Service Line. Target types: Revenue, Booking, Collection, Margin, Volume. Periodicities: Monthly, Quarterly, Yearly, Custom Fiscal. Navigate to Targets to view and manage. Sales Heads and Admins can create/modify targets.`,
    relatedTopics: ["incentive-plans", "performance-tracking"],
  },
  {
    id: "incentive-plans",
    title: "Understanding Incentive Plans",
    category: "incentives",
    keywords: ["incentive", "commission", "plan", "slab", "tier", "accelerator"],
    content: `Incentive plans define commission structures: Slab-based (percentage brackets), Tiered (cumulative tiers), Margin-based (profit margins), Discount-linked (higher discounts = lower commission). Plans can include accelerators (bonus for exceeding targets) and decelerators (reduced commission for missing targets).`,
  },
  {
    id: "payout-processing",
    title: "Payout Processing & Settlements",
    category: "incentives",
    keywords: ["payout", "settlement", "commission", "payment", "clawback"],
    content: `Payouts are triggered by: Deal closure, Invoice generation, or Collection receipt. Process: Calculate commission → Apply adjustments → Submit for approval → Finance/HR approval → Settlement. Clawback rules apply for deal cancellations or payment defaults within the clawback period.`,
  },
  {
    id: "performance-tracking",
    title: "Tracking Performance",
    category: "incentives",
    keywords: ["performance", "attainment", "quota", "achievement", "leaderboard"],
    content: `The Performance module shows: Quota attainment (actual vs target), Commission earned, Rank/Leaderboard position, Trend over time. Filter by period, team, or individual. Performance data drives coaching conversations and compensation decisions.`,
  },

  // Intelligence
  {
    id: "forecasting",
    title: "Revenue Forecasting",
    category: "intelligence",
    keywords: ["forecast", "prediction", "commit", "best case", "pipeline"],
    content: `Forecasting uses stage-weighted methodology with three categories: Commit (high confidence deals), Best Case (likely deals), Pipeline (all open deals). Each opportunity's stage determines its forecast category. Roll-ups show team, region, and company-level forecasts with variance to target.`,
  },
  {
    id: "win-loss-analysis",
    title: "Win/Loss Analysis",
    category: "intelligence",
    keywords: ["win", "loss", "analysis", "reason", "competitor", "insight"],
    content: `Win/Loss Analysis identifies patterns in deal outcomes. Analyze by: Loss reasons (Price, Competition, Timing, etc.), Win factors, Competitor mentions, Deal characteristics. Insights help refine sales strategy, pricing, and competitive positioning.`,
  },

  // Admin
  {
    id: "user-management",
    title: "Managing Users",
    category: "admin",
    keywords: ["user", "create", "role", "team", "activate", "deactivate"],
    content: `User Management (Admin/HR only): Create users with Name, Email, Role, Team, Region, Status. Assign appropriate roles based on job function. Activate/Deactivate users (deactivation preserves data and audit trail). Users cannot delete themselves or change their own role.`,
    relatedTopics: ["user-roles"],
  },
  {
    id: "admin-controls",
    title: "Admin Controls & Governance",
    category: "admin",
    keywords: ["admin", "control", "governance", "plan", "clone", "simulator"],
    content: `Admin Controls (Admin only) include: Incentive Plan Management (create, lock, clone plans), Payout Simulator (test financial impact of different scenarios), Audit Log (track all configuration changes with before/after values). Locked plans cannot be modified without unlocking first.`,
  },

  // Shortcuts
  {
    id: "keyboard-shortcuts",
    title: "Keyboard Shortcuts",
    category: "shortcuts",
    keywords: ["keyboard", "shortcut", "hotkey", "quick", "speed"],
    content: `Speed up your workflow with shortcuts: Account Map: ⌘O (New Opportunity), ⌘C (New Contact), ⌘A (Log Activity), ? (Help overlay). Stakeholder Graph: D (Toggle drag mode), E (Toggle edge mode). Global: Esc (Close dialogs), Tab (Navigate fields). Check each module for specific shortcuts.`,
  },

  // FAQs
  {
    id: "faq-data-import",
    title: "How do I import data from CSV/Excel?",
    category: "getting-started",
    keywords: ["import", "csv", "excel", "bulk", "data", "upload"],
    content: `Most modules support CSV/Excel import: 1) Click 'Import' button, 2) Upload your file, 3) Map columns to system fields, 4) Preview and validate data, 5) Confirm import. The system detects duplicates and validates formats. Use 'Auto-Fix' for common formatting issues.`,
  },
  {
    id: "faq-data-export",
    title: "How do I export data?",
    category: "getting-started",
    keywords: ["export", "csv", "excel", "download", "report"],
    content: `Export data from any table: 1) Click 'Export' button, 2) Select columns to include, 3) Choose format (CSV or Excel), 4) Download file. Excel exports include formatting (currency, dates, auto-sized columns). Exported data respects your current filters.`,
  },
  {
    id: "faq-cannot-access",
    title: "Why can't I access certain features?",
    category: "getting-started",
    keywords: ["access", "denied", "permission", "blocked", "unavailable"],
    content: `Access is controlled by your assigned role. If a menu item is missing or grayed out, your role doesn't have permission. Contact your Administrator to request access. The Role Switcher (Demo mode only) lets you preview different role capabilities.`,
  },
  {
    id: "faq-approval-pending",
    title: "Why is my quote/payout stuck in approval?",
    category: "quotes",
    keywords: ["approval", "pending", "stuck", "waiting", "workflow"],
    content: `Approvals follow defined workflows: 1) Check who needs to approve (hover over status), 2) The approver may not have seen the request yet, 3) They may need additional information. Contact the approver directly or escalate to your manager if urgent.`,
  },
];

// Search function with fuzzy matching
export function searchHelp(query: string): HelpArticle[] {
  if (!query.trim()) return [];
  
  const normalizedQuery = query.toLowerCase().trim();
  const queryWords = normalizedQuery.split(/\s+/);
  
  const scored = helpArticles.map((article) => {
    let score = 0;
    const searchText = `${article.title} ${article.content} ${article.keywords.join(" ")} ${article.category}`.toLowerCase();
    
    // Exact phrase match in title (highest score)
    if (article.title.toLowerCase().includes(normalizedQuery)) {
      score += 100;
    }
    
    // Exact phrase match in keywords
    if (article.keywords.some((k) => k.includes(normalizedQuery))) {
      score += 80;
    }
    
    // Word matches
    queryWords.forEach((word) => {
      if (article.title.toLowerCase().includes(word)) score += 30;
      if (article.keywords.some((k) => k.includes(word))) score += 20;
      if (article.content.toLowerCase().includes(word)) score += 10;
    });
    
    return { article, score };
  });
  
  return scored
    .filter((s) => s.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, 10)
    .map((s) => s.article);
}

// Get articles by category
export function getArticlesByCategory(categoryId: string): HelpArticle[] {
  return helpArticles.filter((a) => a.category === categoryId);
}

// Get article by ID
export function getArticleById(id: string): HelpArticle | undefined {
  return helpArticles.find((a) => a.id === id);
}
