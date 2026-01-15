# SequelString CRM
## Comprehensive Training & User Guide

**Version:** 1.0  
**Last Updated:** January 2025  
**Document Type:** Enterprise User Documentation

---

# Table of Contents

1. [Introduction & Purpose](#1-introduction--purpose)
2. [User Personas & Roles](#2-user-personas--roles)
3. [Getting Started](#3-getting-started)
4. [Dashboard Overview](#4-dashboard-overview)
5. [Core CRM Modules](#5-core-crm-modules)
   - 5.1 Accounts
   - 5.2 Account Map (360° View)
   - 5.3 Contacts
   - 5.4 Leads
   - 5.5 Opportunities
   - 5.6 Activities
6. [Sales Operations](#6-sales-operations)
   - 6.1 Quotes & Quote Builder
   - 6.2 Contracts
   - 6.3 Orders
7. [Intelligence Module](#7-intelligence-module)
   - 7.1 Forecasting
   - 7.2 Win/Loss Analysis
   - 7.3 POC Tracking
   - 7.4 Sales Stage Configuration
8. [Incentive Engine](#8-incentive-engine)
   - 8.1 Targets
   - 8.2 Incentive Plans
   - 8.3 Payouts & Settlements
   - 8.4 Performance
9. [Administration](#9-administration)
   - 9.1 User Management
   - 9.2 Admin Controls
   - 9.3 Reports
   - 9.4 Settings
10. [Role-Based Access Guide](#10-role-based-access-guide)
11. [Step-by-Step Walkthroughs](#11-step-by-step-walkthroughs)
12. [FAQs & Troubleshooting](#12-faqs--troubleshooting)
13. [Best Practices](#13-best-practices)
14. [Keyboard Shortcuts](#14-keyboard-shortcuts)
15. [Video Training Scripts](#15-video-training-scripts)

---

# 1. Introduction & Purpose

## 1.1 What is SequelString CRM?

SequelString CRM is an **enterprise-grade Revenue Governance Platform** designed for Indian enterprise sales teams. It integrates:

- **Sales Execution**: Lead-to-cash workflow management
- **Commercial Controls**: Pricing governance, discount discipline, and approval workflows
- **Revenue Intelligence**: Forecasting, win/loss analytics, and pipeline governance
- **Incentive Management**: Targets, commissions, payouts, and performance tracking

## 1.2 Key Differentiators

| Feature | Description |
|---------|-------------|
| **360° Account View** | Complete visibility into account hierarchy, stakeholders, and opportunities |
| **Stakeholder Influence Mapping** | Visual power dynamics with champions, blockers, and decision-makers |
| **POC Governance** | First-class POC lifecycle with KPI tracking and probability impact |
| **Revenue Behavior Engineering** | Incentives linked to commercial discipline |
| **Stage-Weighted Forecasting** | Commit, Best Case, and Pipeline categories with governance |

## 1.3 System Requirements

- **Browser**: Chrome 90+, Firefox 88+, Edge 90+, Safari 14+
- **Screen Resolution**: Minimum 1280×720 (1920×1080 recommended)
- **Internet**: Stable broadband connection

---

# 2. User Personas & Roles

## 2.1 Role Definitions

| Role | Label | Description | Color Code |
|------|-------|-------------|------------|
| `admin` | Administrator | Full system access including user management and admin controls | Purple |
| `sales_head` | Sales Head | Manage sales team, approve payouts, set targets | Blue |
| `finance` | Finance | Approve payouts, view audit logs, financial reporting | Amber |
| `hr` | HR | Manage users, approve payouts, view performance | Pink |
| `sales` | Sales Representative | Manage accounts, leads, opportunities, and quotes | Green |
| `viewer` | Viewer | Read-only access to most areas | Slate |

## 2.2 Role Permission Matrix

| Module | Admin | Sales Head | Finance | HR | Sales | Viewer |
|--------|-------|------------|---------|----|----|--------|
| Dashboard | ✅ View | ✅ View | ✅ View | ✅ View | ✅ View | ✅ View |
| Accounts | ✅ Full | ✅ Full | ✅ View | ❌ | ✅ Full | ✅ View |
| Contacts | ✅ Full | ✅ Full | ❌ | ❌ | ✅ Full | ✅ View |
| Leads | ✅ Full | ✅ Full | ❌ | ❌ | ✅ Full | ✅ View |
| Opportunities | ✅ Full | ✅ Full | ❌ | ❌ | ✅ Full | ✅ View |
| Quotes | ✅ Full | ✅ Full | ❌ | ❌ | ✅ Full | ✅ View |
| Contracts | ✅ Full | ✅ View | ✅ View | ❌ | ✅ View | ✅ View |
| Orders | ✅ Full | ✅ View | ✅ View | ❌ | ✅ View | ✅ View |
| Targets | ✅ Full | ✅ Full | ✅ View | ✅ View | ✅ View | ✅ View |
| Incentives | ✅ Full | ✅ View | ✅ View | ✅ View | ✅ View | ✅ View |
| Payouts | ✅ Full | ✅ Approve | ✅ Full | ✅ Approve | ✅ View | ✅ View |
| Admin | ✅ Full | ❌ | ✅ View | ❌ | ❌ | ❌ |
| User Management | ✅ Full | ❌ | ❌ | ✅ Full | ❌ | ❌ |
| Audit Logs | ✅ View | ❌ | ✅ View | ✅ View | ❌ | ❌ |
| Reports | ✅ View | ✅ View | ✅ View | ✅ View | ❌ | ✅ View |

---

# 3. Getting Started

## 3.1 Accessing the System

1. Open your web browser
2. Navigate to the SequelString CRM URL provided by your administrator
3. The system uses role-based authentication

## 3.2 Navigation Structure

The application has a **collapsible sidebar** on the left with the following sections:

### Main Navigation
- **Dashboard** - Homepage with key metrics
- **Accounts** - Company/organization management
- **Account Map** - 360° account visualization
- **Contacts** - People within accounts
- **Leads** - Potential prospects
- **Opportunities** - Sales pipeline
- **Quotes** - Pricing proposals
- **Contracts** - Legal agreements
- **Orders** - Confirmed purchases
- **Activities** - Logged interactions

### Intelligence
- **Forecasting** - Revenue predictions
- **Win/Loss** - Deal outcome analysis
- **POC Tracking** - Proof of concept management
- **Sales Stages** - Stage configuration (Admin only)

### Incentive Engine
- **Targets** - Sales goals and quotas
- **Incentives** - Commission plans
- **Payouts** - Payout settlements
- **Performance** - Achievement tracking
- **Admin** - Admin controls (Admin only)

### Secondary
- **Users** - User management (Admin/HR only)
- **Reports** - Business intelligence
- **Pricing** - Price list management
- **Settings** - System configuration

## 3.3 Sidebar Controls

- Click the **Collapse** button at the bottom of the sidebar to minimize it
- Click the **ChevronRight** icon to expand it again
- Navigation items show only icons when collapsed

---

# 4. Dashboard Overview

## 4.1 Purpose
The Dashboard provides an at-a-glance view of key sales metrics and recent activity.

## 4.2 Components

### Primary Stats (Top Row)
| Stat Card | Description |
|-----------|-------------|
| Pipeline Value | Total value of open opportunities |
| Active Opportunities | Count of deals in progress |
| Deals Won | Count of closed-won deals this period |
| Win Rate | Percentage of deals won vs. total closed |

### Secondary Stats
| Stat Card | Description |
|-----------|-------------|
| Open Quotes | Quotes awaiting customer response |
| Active Accounts | Accounts with recent activity |
| Avg Deal Size | Average value of closed deals |

### Charts
- **Pipeline Chart** - Vertical bar chart showing deals by stage with values
- **Revenue Chart** - Line/area chart showing revenue trends over time

### Activity Sections
- **Recent Deals** - Latest opportunity updates
- **Activity Feed** - Recent calls, emails, meetings, and documents

---

# 5. Core CRM Modules

## 5.1 Accounts

### Purpose
Manage enterprise accounts (companies/organizations) that you sell to.

### Screen Layout
- **Search bar** - Filter accounts by name
- **Toolbar buttons**: Filters, Export, Import, Add Account
- **Data table** with columns:
  - Account Name (with 360° map link)
  - Type (Enterprise, PSU, Government)
  - Industry
  - Revenue
  - Deals count
  - Contacts count
  - Status (Active, Prospect, Inactive)
  - Owner

### Field Definitions

| Field | Description | Required |
|-------|-------------|----------|
| Account Name | Legal company name | Yes |
| Type | Enterprise, PSU, or Government classification | Yes |
| Industry | Business sector (Manufacturing, IT, Banking, etc.) | Yes |
| Revenue | Annual revenue or lifetime value | No |
| Status | Active, Prospect, or Inactive | Yes |
| Owner | Account manager assigned | Yes |

### Key Actions
- **Add Account**: Click "+ Add Account" button → Fill form → Save
- **Edit Account**: Click row → "⋮" menu → Edit Account
- **Delete Account**: Click row → "⋮" menu → Delete Account
- **View 360° Map**: Click account row or "⋮" menu → View 360° Map
- **Import CSV**: Click Import → Upload file → Map fields → Import
- **Export**: Click Export → Select fields → Choose format → Download

### Status Colors
| Status | Color |
|--------|-------|
| Active | Green |
| Prospect | Blue |
| Inactive | Gray |

---

## 5.2 Account Map (360° View)

### Purpose
Comprehensive command center for deep account insights and stakeholder management.

### Tab Structure

#### Overview Tab
- Account health score (0-100)
- Key metrics: Total Revenue, Open Pipeline, Contracts Value, Stakeholders
- Recent activities timeline
- Quick stats cards

#### Opportunities Tab
- All opportunities linked to the account
- Pipeline stage distribution
- Value breakdown

#### Stakeholders Tab
- **Follow-Up Reminders** - Automated alerts based on communication gaps
- **Stakeholder Influence Graph** - Interactive visualization of power dynamics
- **Communication Log** - Centralized history of all interactions

#### Activities Tab
- Complete activity timeline
- Filter by activity type
- Log new activities

### Stakeholder Roles

| Role | Icon | Description |
|------|------|-------------|
| Economic Buyer | 👑 Crown | Controls budget and final approval |
| Technical Approver | 🛡️ Shield | Evaluates technical fit |
| Influencer | ⭐ Star | Shapes opinions without authority |
| Champion | ✓ UserCheck | Internal advocate for your solution |
| User | 👤 User | Day-to-day product user |

### Stakeholder Stance

| Stance | Meaning |
|--------|---------|
| Supporter | Generally favorable |
| Champion | Actively promotes internally |
| Neutral | Undecided |
| Blocker | Opposes the deal |

### Keyboard Shortcuts (Account Map)
| Shortcut | Action |
|----------|--------|
| ⌘ + O (Cmd+O) | Add Opportunity |
| ⌘ + C (Cmd+C) | Add Contact |
| ⌘ + A (Cmd+A) | Log Activity |
| ? | Show help overlay |

---

## 5.3 Contacts

### Purpose
Manage people (decision-makers, influencers, users) within accounts.

### Screen Layout
- Search bar with account and name filtering
- Toolbar: Filters, Export, Import, Add Contact
- Data table with avatar, name, title, account, role, influence, last contact

### Field Definitions

| Field | Description | Required |
|-------|-------------|----------|
| Name | Full name | Yes |
| Title | Job title | No |
| Account | Associated company | Yes |
| Email | Primary email | Yes |
| Phone | Primary phone | No |
| Role | Decision Maker, Technical Buyer, Champion, etc. | No |
| Influence | Critical, High, Medium, Low | No |

### Contact Roles

| Role | Color | Description |
|------|-------|-------------|
| Decision Maker | Primary | Has authority to approve deals |
| Executive Sponsor | Accent | C-level advocate |
| Champion | Success | Internal promoter |
| Technical Buyer | Info | Evaluates technical requirements |
| Economic Buyer | Accent | Controls budget |

### Quick Actions
- **Phone icon**: Initiate call
- **Mail icon**: Send email
- **⋮ menu**: Edit, View LinkedIn, Delete

---

## 5.4 Leads

### Purpose
Track and qualify potential prospects before they become opportunities.

### Stats Cards
| Card | Description |
|------|-------------|
| Total Leads | All leads in system |
| New Today | Leads added today |
| Conversion Rate | Leads converted to opportunities |
| Avg Response Time | Time to first contact |

### Field Definitions

| Field | Description | Required |
|-------|-------------|----------|
| First Name | Lead's first name | Yes |
| Last Name | Lead's last name | Yes |
| Company | Organization name | Yes |
| Title | Job title | No |
| Email | Contact email | Yes |
| Phone | Contact phone | No |
| Source | Website, Referral, Event, LinkedIn, Partner | No |
| Score | Lead quality score (0-100) | Auto |

### Lead Status Flow

```
New → Contacted → Qualified → (Convert to Opportunity)
                           ↘ Unqualified (Archive)
```

### Lead Scoring Colors
| Score Range | Color | Meaning |
|-------------|-------|---------|
| 80-100 | Green | Hot lead |
| 60-79 | Amber | Warm lead |
| 40-59 | Yellow | Cool lead |
| 0-39 | Red | Cold lead |

---

## 5.5 Opportunities

### Purpose
Kanban-style pipeline management for sales opportunities.

### Pipeline Stages

| Stage | Color | Description |
|-------|-------|-------------|
| Lead | Gray | Initial qualification |
| Qualified | Blue | Budget, authority, need, timeline confirmed |
| Proposal | Amber | Quote submitted |
| Negotiation | Purple | Terms being negotiated |
| Closed Won | Green | Deal completed successfully |

### Deal Card Information
- Opportunity name
- Account name
- Value (₹ format)
- Win probability (%)
- Owner avatar & name
- Expected close date
- Days in stage warning (>10 days)

### Field Definitions

| Field | Description | Required |
|-------|-------------|----------|
| Name | Opportunity name | Yes |
| Account | Associated company | Yes |
| Value | Deal amount (₹) | Yes |
| Stage | Pipeline stage | Yes |
| Probability | Win likelihood (%) | Yes |
| Owner | Assigned salesperson | Yes |
| Close Date | Expected close | No |

### Key Actions
- **Add Deal**: Click "+ Add Deal" in any stage column
- **Move Deal**: Drag and drop between stages (coming soon)
- **Edit**: Click card → "⋮" menu → Edit Opportunity
- **View Details**: Click card → Opens detail dialog
- **Create Quote**: "⋮" menu → Create Quote
- **Manage POCs**: "⋮" menu → Manage POCs

---

## 5.6 Activities

### Purpose
Log and track all customer interactions across the organization.

### Activity Types
| Type | Icon | Description |
|------|------|-------------|
| Call | Phone | Phone conversations |
| Email | Mail | Email correspondence |
| Meeting | Calendar | In-person or virtual meetings |
| Document | FileText | Documents shared |
| Deal Update | TrendingUp | Pipeline changes |

### Logging an Activity
1. Navigate to Account Map or Activities
2. Click **Log Activity** button
3. Select activity type
4. Enter date, time, and notes
5. Associate with account/contact
6. Click Save

---

# 6. Sales Operations

## 6.1 Quotes & Quote Builder

### Quotes List Screen

#### Stats Cards
| Card | Description |
|------|-------------|
| Open Quotes | Quotes not yet accepted/rejected |
| Pending Approval | Quotes requiring internal approval |
| Total Value | Sum of all open quotes |
| Avg Discount | Average discount across quotes |
| Win Rate | Quote acceptance rate |

### Quote Status Flow

```
Draft → Pending Approval → Approved → Sent → Accepted
                        ↘ Rejected
```

### Status Colors
| Status | Color | Icon |
|--------|-------|------|
| Draft | Gray | FileText |
| Pending Approval | Amber | Clock |
| Approved | Green | CheckCircle |
| Sent | Blue | Send |
| Accepted | Green | CheckCircle |
| Rejected | Red | AlertCircle |

### Quote Builder
The Quote Builder (accessible via "/quotes/new") provides:

- **Quote Header**: Customer info, validity, terms
- **Product Catalog**: Available products/services
- **Line Items**: Selected products with quantities
- **Discount Controls**: Approval-based discounting
- **Payment Terms**: Flexible payment configurations
- **Quote Summary**: Total calculation with taxes

### Discount Governance
| Discount Range | Approval Required |
|----------------|-------------------|
| 0-5% | None (Auto-approve) |
| 5-10% | Sales Head |
| 10-15% | VP Sales |
| >15% | CEO/Finance Head |

---

## 6.2 Contracts

### Purpose
Manage legal agreements with customers.

### Stats Cards
| Card | Description |
|------|-------------|
| Active Contracts | Currently valid contracts |
| Pending Signature | Awaiting execution |
| Renewal Due (30d) | Contracts expiring soon |
| Total Value | Sum of all contract values |

### Contract Types
| Type | Color | Description |
|------|-------|-------------|
| MSA | Primary | Master Service Agreement |
| License | Info | Software/platform licenses |
| Support | Success | Support & maintenance |
| NDA | Accent | Non-disclosure agreement |
| Services | Gray | Professional services |

### Contract Status
| Status | Icon | Description |
|--------|------|-------------|
| Active | ✓ CheckCircle | Currently valid |
| Pending Signature | ⏱ Clock | Awaiting signatures |
| Completed | 📄 FileCheck | Term completed |

### Renewal Alerts
Contracts with end dates within 30 days show a warning icon (⚠️) for proactive renewal.

---

## 6.3 Orders

### Purpose
Track confirmed customer orders from quotes/contracts.

### Key Features
- Order status tracking
- Fulfillment management
- Invoice generation
- Payment tracking

---

# 7. Intelligence Module

## 7.1 Forecasting

### Purpose
Stage-weighted revenue forecasting with pipeline governance.

### Forecast Categories

| Category | Color | Description |
|----------|-------|-------------|
| Closed Won | Green | Deals already won |
| Commit | Indigo | High-confidence deals (>80%) |
| Best Case | Amber | Medium-confidence upside (50-80%) |
| Pipeline | Slate | Lower probability deals (<50%) |

### Key Metrics

| Metric | Description |
|--------|-------------|
| Quota | Target revenue for the period |
| Attainment | % of quota achieved (Closed Won) |
| Coverage Ratio | (Closed + Commit + Best Case) / Quota |
| Gap | Quota - Closed - Commit |

### Forecast Views
1. **Summary**: Overall progress toward quota
2. **Team**: Individual rep performance
3. **Deals**: Opportunity-level detail

### At-Risk Deals
Deals flagged for attention based on:
- Days stalled in current stage
- Missing activity
- Approaching close date without progress

---

## 7.2 Win/Loss Analysis

### Purpose
Analyze closed deals to identify patterns and improve win rates.

### Key Analyses
- Win rate by product/industry/region
- Loss reason categorization
- Competitive analysis
- Pricing impact assessment

---

## 7.3 POC Tracking

### Purpose
First-class POC (Proof of Concept) lifecycle management.

### POC Workflow

```
Planning → In Progress → Completed → Accepted/Rejected
```

### KPI Tracking
Each POC tracks:
- Success criteria (define upfront)
- Baseline vs. actual metrics
- Accuracy, SLA compliance, cost savings
- Stakeholder signoff

### Probability Impact
POC outcomes directly influence deal probability:
- POC Accepted: +20% probability
- POC Rejected: -30% probability

---

## 7.4 Sales Stage Configuration

**Access**: Admin role only

### Purpose
Configure the sales stage framework with governance rules.

### Stage Properties
| Property | Description |
|----------|-------------|
| Stage Name | Display name |
| Probability Weight | Default win probability |
| Entry Criteria | Required fields/conditions to enter |
| Exit Criteria | Required fields/conditions to exit |
| Mandatory Fields | Fields that must be completed |
| Commercial Approvals | Required approvals for discounts/terms |

### Governance Examples
- **Proposal Stage**: Requires "Budget Identified" flag
- **Negotiation Stage**: Requires "Project Approved" status
- **Closed Won**: Requires signed contract upload

---

# 8. Incentive Engine

## 8.1 Targets

### Purpose
Configure multi-dimensional sales targets.

### Target Dimensions
| Dimension | Examples |
|-----------|----------|
| Individual | Per salesperson |
| Team | Enterprise Sales, SMB Sales |
| Region | North, South, East, West, Pan India |
| Product | Specific product lines |
| Platform | By technology platform |
| Service Line | By service offering |

### Target Types
| Type | Description |
|------|-------------|
| Revenue | Closed deal value |
| Booking | Order value |
| Collection | Cash received |
| Margin | Profit margin achieved |
| Volume | Number of deals |

### Target Periods
- Monthly
- Quarterly
- Yearly
- Custom Fiscal Period

---

## 8.2 Incentive Plans

### Purpose
Configure commission models linked to commercial discipline.

### Commission Models

| Model | Description |
|-------|-------------|
| Flat Percentage | Fixed % on all deals |
| Slab-Based | Different rates for value ranges |
| Tiered | Cumulative rates across tiers |
| Product-Wise | Product-specific rates |
| Margin-Based | Commission linked to margin |
| Discount-Linked | Penalty for over-discounting |
| Accelerator | Higher payout after threshold |
| Decelerator | Lower payout for poor margin |

### Payout Triggers
| Trigger | Description |
|---------|-------------|
| Deal Closure | Commission on deal won |
| Invoice | Commission on invoice raised |
| Payment Receipt | Commission on cash collected |

### Plan Properties
- **Base Rate**: Default commission percentage
- **Slabs**: Value ranges with different rates
- **Accelerator**: Multiplier after quota achievement (e.g., 1.5x)
- **Decelerator**: Reduction for margin miss
- **Discount Penalty**: Commission reduction per discount %

### Plan Status
| Status | Description |
|--------|-------------|
| Draft | Under development |
| Active | Currently in effect |
| Inactive | Paused/historical |
| Locked | Cannot be edited |

---

## 8.3 Payouts & Settlements

### Purpose
Manage commission calculations, approvals, and disbursement.

### Stats Cards
| Card | Description |
|------|-------------|
| Pending Payouts | Awaiting approval/release |
| Pending Amount | Total pending value |
| Released This Period | Already paid out |
| Pending Approvals | Exception requests |

### Payout Status Flow

```
Pending Calculation → Calculated → Pending Approval → Approved → Released
                                                    ↘ On Hold
                                                    ↘ Clawed Back
```

### Status Icons
| Status | Icon | Color |
|--------|------|-------|
| Pending Calc | Clock | Gray |
| Calculated | CheckCircle | Purple |
| Pending Approval | AlertTriangle | Yellow |
| Approved | CheckCircle | Green |
| On Hold | Ban | Red |
| Released | Banknote | Green |
| Clawed Back | RefreshCw | Red |

### Holdback & Clawback Rules
- **Holdback**: Percentage withheld until collection
- **Clawback**: Recovery for cancellations/defaults

### Approval Workflow
Exception requests (manual overrides, bonuses) require:
1. Requester submits with justification
2. Manager reviews request details
3. Approve or reject with comments
4. System updates payout accordingly

---

## 8.4 Performance

### Purpose
Track individual and team achievement against targets.

### Key Metrics
- Quota attainment %
- Ranking among peers
- Trend over time
- Pipeline health

---

# 9. Administration

## 9.1 User Management

**Access**: Admin and HR roles only

### Purpose
Create, edit, and manage user accounts and permissions.

### User Fields
| Field | Description | Required |
|-------|-------------|----------|
| Email | Login identifier | Yes |
| First Name | User's first name | Yes |
| Last Name | User's last name | Yes |
| Role | Permission level | Yes |
| Team | Assigned sales team | No |
| Region | Geographic territory | No |
| Status | Active/Inactive | Yes |

### User Actions
- **Add User**: Create new account
- **Edit User**: Modify user details
- **Toggle Status**: Activate/deactivate
- **Delete User**: Remove from system

### Teams
| Team ID | Name |
|---------|------|
| TEAM-ENT | Enterprise Sales |
| TEAM-SMB | SMB Sales |
| TEAM-GOVT | Government Sales |
| TEAM-CHANNEL | Channel Partners |
| TEAM-INSIDE | Inside Sales |

### Regions
- North
- South
- East
- West
- Pan India

---

## 9.2 Admin Controls

**Access**: Admin role only

### Features
- System configuration
- Plan cloning and management
- Payout simulation
- Audit log access

---

## 9.3 Reports

### Purpose
Business intelligence and analytics.

### Report Categories
- Pipeline reports
- Activity reports
- Performance reports
- Financial reports
- Forecasting reports

---

## 9.4 Settings

### Purpose
Personal and system configuration.

### Available Settings
- Profile management
- Notification preferences
- Integration settings (Google, Microsoft)
- Display preferences

---

# 10. Role-Based Access Guide

## 10.1 Administrator

### What You Can See
- All modules and data
- All users across all teams
- System configuration
- Audit logs

### What You Can Do
- Full CRUD on all entities
- Manage users and permissions
- Configure incentive plans
- Approve payouts at any level
- Access admin controls

### Responsibilities
- System administration
- User onboarding
- Permission management
- Configuration maintenance

### Do's
✅ Regularly review audit logs
✅ Keep user permissions up-to-date
✅ Lock finalized incentive plans
✅ Monitor system health

### Don'ts
❌ Share admin credentials
❌ Modify locked plans without approval
❌ Delete users with active payouts
❌ Change stage configuration mid-quarter

---

## 10.2 Sales Head

### What You Can See
- All accounts, contacts, leads, opportunities
- Team performance dashboards
- Forecasting reports
- Incentive plans (view only)

### What You Can Do
- Manage accounts, leads, opportunities
- Create and send quotes
- Approve team quotes (discount governance)
- Set and assign targets
- Approve payout exceptions

### Responsibilities
- Team performance management
- Pipeline governance
- Quota attainment
- Commercial discipline

### Do's
✅ Review pipeline weekly
✅ Coach team on qualification
✅ Monitor at-risk deals
✅ Approve requests promptly

### Don'ts
❌ Over-discount without escalation
❌ Ignore stalled opportunities
❌ Skip stage criteria
❌ Modify others' opportunities

---

## 10.3 Finance

### What You Can See
- Contracts and orders
- Targets and incentives
- Payouts and settlements
- Admin controls (limited)
- Audit logs

### What You Can Do
- Manage payout processing
- Approve commission exceptions
- Review contract values
- Generate financial reports

### Responsibilities
- Payout accuracy
- Budget compliance
- Financial reporting
- Audit readiness

### Do's
✅ Verify calculations before release
✅ Document approval decisions
✅ Track holdbacks and clawbacks
✅ Reconcile with finance systems

### Don'ts
❌ Release unverified payouts
❌ Skip approval workflow
❌ Ignore clawback triggers
❌ Modify incentive plans

---

## 10.4 HR

### What You Can See
- User management
- Targets and incentives
- Payouts (view)
- Performance metrics
- Audit logs

### What You Can Do
- Create and manage users
- Assign roles and teams
- Approve payout exceptions
- Generate performance reports

### Responsibilities
- User lifecycle management
- Role assignment
- Performance oversight
- Compliance

### Do's
✅ Verify employee details
✅ Promptly deactivate leavers
✅ Review role assignments quarterly
✅ Maintain accurate team mappings

### Don'ts
❌ Assign admin role liberally
❌ Keep inactive users active
❌ Share login credentials
❌ Skip approval processes

---

## 10.5 Sales Representative

### What You Can See
- Own accounts, contacts, leads, opportunities
- Own targets and incentives
- Own payouts and performance
- General pricing information

### What You Can Do
- Create and manage accounts
- Add and qualify leads
- Create and move opportunities
- Generate quotes
- Log activities

### Responsibilities
- Pipeline management
- Customer relationships
- Quota achievement
- Data accuracy

### Do's
✅ Keep opportunities updated
✅ Log all customer interactions
✅ Follow stage criteria
✅ Request approvals promptly

### Don'ts
❌ Skip data entry
❌ Over-discount without approval
❌ Ignore follow-up reminders
❌ Misrepresent pipeline stage

---

## 10.6 Viewer

### What You Can See
- All core modules (read-only)
- Reports and dashboards
- Targets and incentives (view)

### What You Can Do
- View data across modules
- Generate reports
- Export data (if permitted)

### Responsibilities
- Information consumption
- Report generation
- Supporting other roles

### Do's
✅ Use filters effectively
✅ Export what you need
✅ Request access upgrades if needed

### Don'ts
❌ Attempt to modify data
❌ Share sensitive exports externally
❌ Request unnecessary access

---

# 11. Step-by-Step Walkthroughs

## 11.1 Creating a New Account

**Path**: Sidebar → Accounts → "+ Add Account"

1. Navigate to **Accounts** from the sidebar
2. Click the **"+ Add Account"** button (top right)
3. Fill in the form:
   - **Account Name**: Enter company legal name (e.g., "Tata Steel Ltd")
   - **Type**: Select from Enterprise, PSU, or Government
   - **Industry**: Choose the relevant sector
   - **Status**: Set as "Prospect" for new accounts
   - **Owner**: Assign the account manager
4. Click **Save**
5. ✅ Success: "Account [name] added successfully" toast appears

**Tips**:
- Use official company names for consistency
- Set Status to "Prospect" initially, upgrade to "Active" after first deal

---

## 11.2 Converting a Lead to Opportunity

**Path**: Sidebar → Leads → Select Lead → Convert

1. Navigate to **Leads** from the sidebar
2. Find the qualified lead (Score ≥ 70 recommended)
3. Click the lead row to select
4. Click **⋮** menu → **Convert to Opportunity** (or use shortcut)
5. In the conversion dialog:
   - Verify account association
   - Set initial opportunity value
   - Select starting stage (usually "Qualified")
   - Set expected close date
6. Click **Convert**
7. ✅ Lead moves to Opportunities module

**Pre-requisites**:
- Lead status should be "Qualified"
- Account must exist in the system

---

## 11.3 Moving an Opportunity Through Stages

**Path**: Sidebar → Opportunities → Select Deal

1. Navigate to **Opportunities** (Kanban view)
2. Find your deal card in the current stage
3. Click the deal card to view details
4. Click **⋮** menu → **Edit Opportunity**
5. Update the **Stage** field to the next stage
6. Complete any required stage criteria:
   - Budget identified (for Proposal)
   - Project approved (for Negotiation)
   - Contract signed (for Closed Won)
7. Update probability accordingly
8. Click **Save**
9. ✅ Card moves to new stage column

**Stage Criteria Examples**:
| Stage | Required for Entry |
|-------|-------------------|
| Qualified | BANT confirmed |
| Proposal | Quote created, budget identified |
| Negotiation | Proposal sent, project approved |
| Closed Won | Contract signed, PO received |

---

## 11.4 Creating and Sending a Quote

**Path**: Sidebar → Quotes → "+ Create Quote"

1. Navigate to **Quotes** from the sidebar
2. Click **"+ Create Quote"** button
3. In the Quote Builder:
   
   **Step 1: Header**
   - Link to Opportunity
   - Set validity period
   - Add customer details

   **Step 2: Add Products**
   - Browse Product Catalog
   - Click to add items
   - Set quantities

   **Step 3: Configure Pricing**
   - Apply discounts (approval required for >5%)
   - Set payment terms
   - Add any custom line items

   **Step 4: Review Summary**
   - Verify subtotals
   - Check tax calculations
   - Review total

4. Click **Save Draft** or **Submit for Approval**
5. Once approved, click **Send to Customer**
6. ✅ Quote status changes to "Sent"

**Discount Approval Matrix**:
| Discount | Approver |
|----------|----------|
| 0-5% | Auto-approved |
| 5-10% | Sales Head |
| 10-15% | VP Sales |
| >15% | CEO/Finance |

---

## 11.5 Logging a Customer Activity

**Path**: Sidebar → Account Map → Activities Tab → "+ Log Activity"

1. Navigate to **Account Map** for the relevant account
2. Go to the **Activities** tab
3. Click **"+ Log Activity"** (or use ⌘+A shortcut)
4. In the dialog:
   - **Type**: Select Call, Email, Meeting, or Document
   - **Date & Time**: When the activity occurred
   - **Subject**: Brief summary
   - **Notes**: Detailed description
   - **Attendees**: Link contacts involved
   - **Opportunity**: Associate with deal if relevant
5. Click **Save**
6. ✅ Activity appears in timeline

**Best Practices**:
- Log activities within 24 hours
- Include action items in notes
- Link to relevant contacts
- Associate with opportunities

---

## 11.6 Importing Data via CSV

**Path**: Any module → Import button → Upload

1. Navigate to the target module (Accounts, Contacts, or Leads)
2. Click **Import** button in toolbar
3. In the Import dialog:
   
   **Step 1: Download Template**
   - Click "Download Template"
   - Open in Excel/Google Sheets
   - Review required columns
   
   **Step 2: Prepare Data**
   - Fill in your data
   - Follow format guidelines (dates, phones, emails)
   - Save as CSV
   
   **Step 3: Upload**
   - Click "Choose File" or drag-drop
   - File is validated automatically
   
   **Step 4: Map Fields**
   - System auto-maps matching columns
   - Manually map remaining fields
   - Mark required fields
   
   **Step 5: Review Validation**
   - Fix any flagged errors
   - Use "Auto-Fix" for common issues
   - Review duplicate warnings
   
   **Step 6: Import**
   - Click "Import [X] Records"
   - Wait for processing

4. ✅ Success message with import count

**Validation Rules**:
| Field Type | Rule | Auto-Fix Available |
|------------|------|-------------------|
| Email | Valid format | Typo suggestions |
| Phone | Min 7 digits | Normalization |
| GSTIN | 15-char format | No |
| PIN Code | 6 digits | No |

---

## 11.7 Approving a Payout

**Path**: Sidebar → Payouts → Approvals Tab → Action

1. Navigate to **Payouts** from sidebar
2. Click the **Approvals** tab
3. Review pending requests (orange border)
4. For each request:
   - Review request type and amount
   - Check justification
   - Verify source deals
5. Click **Approve** ✓ or **Reject** ✕
6. Add comments if rejecting
7. ✅ Status updates, requestor notified

**Approval Authority**:
| Request Type | Approver |
|--------------|----------|
| Standard Payout | Auto-approved |
| Manual Override | Sales Head |
| Special Bonus | Finance + HR |
| Exception | Finance Head |

---

## 11.8 Using the Stakeholder Influence Graph

**Path**: Account Map → Stakeholders Tab → Influence Graph

1. Navigate to **Account Map** for target account
2. Go to **Stakeholders** tab
3. Scroll to the **Influence Graph** section
4. Use the view controls:
   - **Influence Mode**: Size nodes by influence score
   - **Hierarchy Mode**: Arrange by reporting structure
   - **Sentiment Mode**: Color by disposition
5. **Drag nodes** to rearrange layout
6. **Click node** for stakeholder details
7. **Draw relationships**:
   - Toggle "Edit Relationships" mode
   - Click source node, then target node
   - Select relationship type
8. **Export**:
   - Click "Export PNG" for image
   - Click "Export PDF" for report

**Node Colors by Stance**:
| Stance | Color |
|--------|-------|
| Champion | Green |
| Supporter | Blue |
| Neutral | Gray |
| Blocker | Red |

---

# 12. FAQs & Troubleshooting

## General Questions

### Q1: I can't see certain menu items. Why?
**A**: Menu visibility is based on your role's permissions. Contact your administrator to request access if needed.

### Q2: How do I change my password?
**A**: Go to Settings → Profile → Change Password. If using SSO, password changes happen in your identity provider.

### Q3: Can I customize my dashboard?
**A**: The current version uses a standard layout. Custom dashboards are on the roadmap.

### Q4: What currencies are supported?
**A**: SequelString CRM defaults to Indian Rupees (₹). Multi-currency support is available for Enterprise plans.

### Q5: How often is data synced?
**A**: Data is saved in real-time. If you see stale data, try refreshing the page.

---

## Data Entry Questions

### Q6: Why can't I move my opportunity to Proposal stage?
**A**: Ensure all entry criteria are met:
- Budget identified checkbox
- Primary contact assigned
- Required fields completed

Check the stage configuration or ask your admin.

### Q7: My CSV import is failing. What should I check?
**A**: Common issues:
- **Encoding**: Save as UTF-8
- **Headers**: Must match template exactly
- **Required fields**: All must have values
- **Format**: Check date, phone, email formats
- Use the "Auto-Fix" feature for common errors

### Q8: Can I bulk update records?
**A**: Yes, export current data, modify in Excel, and re-import with the same IDs to update existing records.

### Q9: How do I merge duplicate accounts?
**A**: Contact your administrator. Merge functionality requires admin access to prevent data loss.

### Q10: Why are my activities not showing?
**A**: Check:
- Correct account/contact association
- Date filters applied
- Scroll down if list is long

---

## Quote & Contract Questions

### Q11: My quote is stuck in "Pending Approval". What do I do?
**A**: Check who the approver is (shown in the quote details). Contact them directly or escalate to your manager if urgent.

### Q12: Can I edit a sent quote?
**A**: You can clone the quote, make changes, and send a new version. Update the version number (e.g., v2.0).

### Q13: What triggers a contract renewal alert?
**A**: Contracts with end dates within 30 days automatically show renewal alerts.

### Q14: How do I associate a contract with an opportunity?
**A**: Edit the contract and select the related opportunity from the dropdown.

---

## Incentive Questions

### Q15: Why is my commission showing as "Pending Calculation"?
**A**: Commission calculations run on schedule (typically daily/weekly). Contact Finance if it's been pending too long.

### Q16: What is a holdback?
**A**: A percentage of commission withheld until full payment is received from the customer, protecting against bad debt.

### Q17: When might a clawback happen?
**A**: Clawbacks occur when:
- Customer cancels within clawback period
- Customer defaults on payment
- Deal terms were misrepresented

### Q18: How do I dispute a payout calculation?
**A**: Create an exception request in Payouts → Approvals tab with detailed justification.

### Q19: Can I see my historical payouts?
**A**: Yes, use the period filter in Payouts to view past quarters/years.

---

## Technical Issues

### Q20: The page is loading slowly. What should I do?
**A**: Try these steps:
1. Refresh the page (Ctrl/Cmd + R)
2. Clear browser cache
3. Check your internet connection
4. Try a different browser
5. Contact support if issue persists

### Q21: I see an error message. What now?
**A**: Take a screenshot of the error, note what action you were performing, and report to your IT support with these details.

### Q22: Charts are not displaying. How do I fix this?
**A**: This usually indicates a JavaScript issue:
1. Refresh the page
2. Disable browser extensions temporarily
3. Try incognito/private mode
4. Check browser version requirements

### Q23: Export is not working. Why?
**A**: Check:
- Pop-up blocker settings
- Download permissions
- Disk space availability
- Try a different format (CSV vs Excel)

### Q24: My session keeps timing out. Is this normal?
**A**: Sessions timeout after inactivity for security. If it's too frequent, contact your admin to adjust settings.

---

# 13. Best Practices

## Data Quality

| Practice | Benefit |
|----------|---------|
| Complete all required fields | Accurate reporting |
| Update opportunities weekly | Reliable forecasting |
| Log activities same-day | Complete audit trail |
| Use consistent naming | Easy search and reports |
| Verify contact emails | Successful outreach |

## Pipeline Management

| Practice | Benefit |
|----------|---------|
| Follow stage criteria strictly | Accurate probability |
| Set realistic close dates | Reliable forecasting |
| Update probability regularly | Honest pipeline |
| Remove stalled deals | Clean pipeline |
| Associate POCs with opportunities | Governance compliance |

## Quote Management

| Practice | Benefit |
|----------|---------|
| Use standard products | Consistent pricing |
| Follow discount governance | Protected margins |
| Set reasonable validity | Urgency without pressure |
| Version quotes clearly | Clear audit trail |
| Get approvals before sending | No rework needed |

## Stakeholder Management

| Practice | Benefit |
|----------|---------|
| Map all decision-makers | No surprises |
| Track influence levels | Prioritize engagement |
| Log all interactions | Relationship visibility |
| Identify blockers early | Risk mitigation |
| Build champion relationships | Internal advocacy |

---

# 14. Keyboard Shortcuts

## Global Shortcuts

| Shortcut | Action |
|----------|--------|
| ? | Show help overlay (in Account Map) |
| Esc | Close dialogs |

## Account Map Shortcuts

| Shortcut | Action |
|----------|--------|
| ⌘ + O (Cmd+O) | Add Opportunity |
| ⌘ + C (Cmd+C) | Add Contact |
| ⌘ + A (Cmd+A) | Log Activity |

## Table Navigation

| Shortcut | Action |
|----------|--------|
| ↑ / ↓ | Navigate rows |
| Enter | Open selected item |
| Tab | Move between fields |

---

# 15. Video Training Scripts

## Video 1: Getting Started with SequelString CRM (5 minutes)

### Introduction (0:00-0:30)
"Welcome to SequelString CRM, your enterprise revenue governance platform. In this video, we'll cover the basics of navigating the system and understanding your dashboard."

### Navigation Overview (0:30-1:30)
"On the left, you'll see the sidebar with all your modules organized into four sections: Core CRM, Intelligence, Incentive Engine, and Secondary navigation. The sidebar can be collapsed using the button at the bottom for more screen space."

### Dashboard Tour (1:30-3:00)
"The dashboard shows your key metrics at a glance. The top row displays pipeline value, active opportunities, deals won, and win rate. Below that, you'll see charts for pipeline by stage and revenue trends. At the bottom, recent deals and activities keep you informed of the latest updates."

### Role-Based Experience (3:00-4:00)
"What you see depends on your role. Sales reps see their own pipeline, while Sales Heads see team-wide data. Use the role switcher in the header to preview different perspectives."

### Next Steps (4:00-5:00)
"In our next video, we'll dive into managing accounts and understanding the 360° Account Map. Click the link in the description to continue your training."

---

## Video 2: Account Management & 360° View (7 minutes)

### Introduction (0:00-0:30)
"Accounts are the foundation of your CRM. Let's explore how to manage accounts and use the powerful 360° Account Map."

### Creating an Account (0:30-2:00)
"Click '+ Add Account' in the toolbar. Fill in the account name, type, industry, and assign an owner. Pro tip: Use official company names and set new accounts as 'Prospect' status."

### Account List Features (2:00-3:00)
"The account table shows key information at a glance. Notice the status badges - green for active, blue for prospects. Click any account name to access the 360° view."

### Account Map Deep Dive (3:00-5:30)
"The Account Map is your command center. The Overview tab shows health scores and key metrics. Switch to Stakeholders to see your relationship map. This interactive graph lets you visualize power dynamics - drag nodes to rearrange, click to see details, and even draw relationships between stakeholders."

### Keyboard Shortcuts (5:30-6:30)
"Speed up your workflow with keyboard shortcuts. Press question mark to see all available shortcuts. Cmd+O adds an opportunity, Cmd+C adds a contact, and Cmd+A logs an activity."

### Wrap Up (6:30-7:00)
"You've learned how to manage accounts and leverage the 360° view. Next, we'll cover lead management and conversion."

---

## Video 3: Lead to Opportunity Conversion (6 minutes)

### Introduction (0:00-0:30)
"Converting leads to opportunities is a critical step in your sales process. Let's walk through the complete workflow."

### Understanding Lead Scoring (0:30-1:30)
"Each lead has a score from 0 to 100. Scores above 80 are hot leads shown in green, 60-79 are warm in amber, and below 40 are cold in red. This helps you prioritize your outreach."

### Qualifying a Lead (1:30-3:00)
"Update lead status as you progress: New to Contacted after first touch, then to Qualified after confirming BANT - Budget, Authority, Need, and Timeline. Use the edit function to update status and add notes."

### Converting to Opportunity (3:00-5:00)
"When a lead is qualified, click the more menu and select 'Convert to Opportunity'. The system will create an opportunity linked to the existing account and contact. Set your initial deal value, expected close date, and starting stage."

### Post-Conversion (5:00-5:30)
"After conversion, you'll find the new opportunity in the pipeline view. The lead record is archived for historical reference."

### Summary (5:30-6:00)
"Remember: qualify thoroughly before converting. This keeps your pipeline clean and your forecast accurate."

---

## Video 4: Pipeline Management with Opportunities (6 minutes)

### Introduction (0:00-0:30)
"The Opportunities module is where deals progress through your sales stages. Let's master pipeline management."

### Kanban View (0:30-1:30)
"Opportunities display in a Kanban board with stages as columns. Each card shows deal name, account, value, probability, and owner. Cards with warnings indicate they've been in a stage too long."

### Stage Progression (1:30-3:00)
"To move a deal, edit the opportunity and change the stage. But remember: each stage has entry criteria. Proposal requires budget identification, Negotiation requires project approval. The system enforces this governance."

### Deal Card Actions (3:00-4:30)
"Click a deal card for quick actions. View Details opens the full record. Edit updates the opportunity. Create Quote links to the Quote Builder. Manage POCs tracks proof of concept work."

### Pipeline Hygiene (4:30-5:30)
"Keep your pipeline healthy. Review stalled deals weekly - those with the warning icon. Either progress them, update close dates, or mark as lost. Accurate staging means accurate forecasting."

### Summary (5:30-6:00)
"A clean pipeline is a predictable pipeline. Next, we'll cover quote creation and approval workflows."

---

## Video 5: Creating Quotes & Approval Workflows (7 minutes)

### Introduction (0:00-0:30)
"Quotes are where pricing governance meets customer engagement. Let's build a quote and understand approval workflows."

### Starting a Quote (0:30-1:30)
"Click 'Create Quote' from the Quotes list. Link to an existing opportunity - this ensures proper tracking and attribution."

### Quote Builder Walkthrough (1:30-4:00)
"The Quote Builder has four sections:
- Header: Customer details, validity period, terms
- Products: Browse and add from your catalog
- Pricing: Apply discounts and payment terms
- Summary: Review totals and taxes

Add products by clicking from the catalog. Adjust quantities as needed. Notice how totals update automatically."

### Discount Governance (4:00-5:30)
"Here's where SequelString protects your margins. Discounts under 5% are auto-approved. Higher discounts require approval. Watch as I apply 12% - the system shows this needs CEO approval. Submit the quote, and the approver is notified automatically."

### Tracking Approvals (5:30-6:30)
"View pending approvals in the Quotes list. 'Pending Approval' status shows who needs to approve. Once approved, click 'Send to Customer'. The quote moves to 'Sent' status with download and tracking options."

### Summary (6:30-7:00)
"Quotes with proper governance protect margins and ensure compliance. Next video covers the Incentive Engine."

---

## Video 6: Understanding Your Incentives & Payouts (8 minutes)

### Introduction (0:00-0:30)
"The Incentive Engine links your performance to your compensation. Let's understand how commissions work and how to track your payouts."

### Viewing Your Targets (0:30-1:30)
"Start in the Targets module. You'll see your quota, current achievement, and gap. Targets can be set at individual, team, or regional levels. The progress bar shows your attainment percentage."

### Understanding Commission Plans (1:30-3:30)
"Navigate to Incentives to see active plans. Each plan defines:
- Base commission rate
- Payout trigger (deal close, invoice, or payment)
- Slabs for different deal sizes
- Accelerators for exceeding quota
- Discount penalties if applicable

Your plan determines how your commission is calculated."

### Tracking Payouts (3:30-5:30)
"The Payouts module shows your earnings. Filter by period to see current and past payouts. Each payout shows:
- Gross amount: Total commission earned
- Holdback: Amount withheld until collection
- Net amount: What you'll receive

Status progresses from Calculated to Pending Approval to Approved to Released."

### Performance Dashboard (5:30-6:30)
"The Performance tab visualizes your achievement. See your ranking, trends over time, and comparison to peers. Use this to identify areas for improvement."

### Commission Calculator (6:30-7:30)
"The Commission Calculator lets you model potential earnings. Enter deal value, discount, and margin to see projected commission. Great for deal planning!"

### Summary (7:30-8:00)
"Track your performance regularly, understand your plan mechanics, and use the calculator to optimize your deals."

---

# Assumptions

The following assumptions were made during documentation creation:

1. **Authentication**: The system uses role-based mock authentication for demonstration. Production would use enterprise SSO/LDAP.

2. **Data Persistence**: Current implementation uses mock data. Production would connect to a database backend.

3. **Integrations**: Google Workspace and Microsoft 365 integrations mentioned in IntegrationSettings are planned features.

4. **Email Notifications**: Follow-up reminder email triggers require backend configuration.

5. **Mobile Access**: The current UI is optimized for desktop. Mobile-responsive design is available but secondary.

6. **Currency**: All monetary values are in Indian Rupees (₹) by default.

7. **Timezone**: The system uses the browser's local timezone.

8. **Language**: The application is in English only for this version.

---

# Document Information

| Property | Value |
|----------|-------|
| Document Version | 1.0 |
| Created | January 2025 |
| Author | SequelString Documentation Team |
| Review Cycle | Quarterly |
| Classification | Internal Use |

---

*© 2025 SequelString CRM. All rights reserved.*
