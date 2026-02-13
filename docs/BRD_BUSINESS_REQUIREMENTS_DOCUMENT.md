# Business Requirements Document (BRD)

## SequelString CRM - Enterprise Sales Governance Platform

---

| Document Control | |
|-----------------|---|
| **Document Title** | Business Requirements Document |
| **Project Name** | SequelString CRM - Enterprise Sales Governance Platform |
| **Version** | 1.0 |
| **Status** | APPROVED |
| **Date** | February 01, 2026 |
| **Author** | SequelString Product Team |
| **Classification** | Internal + Client Facing |

---

## Table of Contents

1. [Executive Summary](#1-executive-summary)
2. [Project Overview](#2-project-overview)
3. [Business Objectives](#3-business-objectives)
4. [Stakeholders](#4-stakeholders)
5. [Scope](#5-scope)
6. [Functional Requirements](#6-functional-requirements)
7. [Non-Functional Requirements](#7-non-functional-requirements)
8. [User Roles & Permissions](#8-user-roles--permissions)
9. [Module Specifications](#9-module-specifications)
10. [Data Models](#10-data-models)
11. [Integration Requirements](#11-integration-requirements)
12. [User Interface Requirements](#12-user-interface-requirements)
13. [Security Requirements](#13-security-requirements)
14. [Assumptions & Constraints](#14-assumptions--constraints)
15. [Dependencies](#15-dependencies)
16. [Acceptance Criteria](#16-acceptance-criteria)
17. [Appendix](#17-appendix)

---

## 1. Executive Summary

### 1.1 Purpose

This Business Requirements Document (BRD) defines the complete functional and non-functional requirements for the **SequelString CRM - Enterprise Sales Governance Platform**. The platform is designed to provide comprehensive sales process management, account intelligence, incentive management, and enterprise-grade CRM capabilities for B2B organizations in the Indian market.

### 1.2 Business Need

Organizations require a unified platform that can:
- Manage complex enterprise sales cycles with multi-stakeholder engagement
- Track and govern sales stages with configurable workflows
- Automate incentive calculations and payout processing
- Provide intelligent insights through forecasting and analytics
- Enable POC (Proof of Concept) governance for technical sales
- Support role-based access control across sales, finance, and HR teams

### 1.3 Solution Overview

SequelString CRM is a modern web-based application built with:
- **Frontend**: React 18 + TypeScript + Vite
- **UI Framework**: Shadcn/ui + Radix UI + Tailwind CSS
- **State Management**: React Query + Context API
- **Routing**: React Router DOM v6
- **Theming**: next-themes (Light/Dark/System modes)

---

## 2. Project Overview

### 2.1 Project Scope Statement

Develop an enterprise-grade CRM platform that manages the complete sales lifecycle from lead generation to order fulfillment, including:
- Account & Contact Management
- Lead & Opportunity Pipeline
- Quote & Contract Management
- Sales Stage Governance
- Incentive & Payout Engine
- Performance Analytics & Forecasting
- Enterprise Features (Social, Intelligence, Call Integration)

### 2.2 Target Market

- **Primary**: Indian B2B Enterprise Organizations
- **Industries**: Manufacturing, Banking, IT Services, PSUs, Government
- **Company Size**: 500+ employees with dedicated sales teams

### 2.3 Key Value Propositions

1. **Complete Sales Lifecycle Management** - End-to-end pipeline visibility
2. **India-Localized** - GSTIN, PAN, INR currency, Indian fiscal year support
3. **Governance-First Approach** - Configurable stage gates and approval workflows
4. **Transparent Incentive Management** - Real-time commission calculations
5. **Enterprise Intelligence** - News alerts, competitive intel, social tracking

---

## 3. Business Objectives

| ID | Objective | Success Metric | Priority |
|----|-----------|----------------|----------|
| BO-01 | Centralize sales data management | Single source of truth for all sales data | Critical |
| BO-02 | Improve pipeline visibility | 100% forecast accuracy improvement | High |
| BO-03 | Reduce sales cycle time | 20% reduction in average sales cycle | High |
| BO-04 | Automate incentive calculations | Zero manual calculation errors | Critical |
| BO-05 | Enable data-driven decisions | Real-time dashboards and analytics | High |
| BO-06 | Ensure compliance & governance | 100% stage gate compliance | Critical |
| BO-07 | Improve stakeholder relationship tracking | Complete influence mapping | Medium |
| BO-08 | Integrate external intelligence | Automated news and competitive alerts | Medium |

---

## 4. Stakeholders

### 4.1 Internal Stakeholders

| Role | Responsibilities | Access Level |
|------|------------------|--------------|
| Administrator | System configuration, user management | Full Access |
| Sales Head | Team management, approvals, targets | Management Access |
| Sales Representative | Account, lead, opportunity management | Standard Access |
| Finance | Payouts, contracts, financial reports | Financial Access |
| HR | User management, performance review | HR Access |
| Viewer | Read-only dashboard access | View Only |

### 4.2 External Stakeholders

- Customers (Account Contacts)
- Channel Partners
- Integration Partners (CTI, Email, Social APIs)

---

## 5. Scope

### 5.1 In-Scope Features

#### Core CRM Modules
- ✅ Dashboard with KPIs and widgets
- ✅ Account Management with hierarchies
- ✅ Account Map (360° view with stakeholder mapping)
- ✅ Contact Management with LinkedIn integration
- ✅ Lead Management with scoring
- ✅ Opportunity Pipeline Management
- ✅ Quote Builder and Management
- ✅ Contract Management
- ✅ Order Management
- ✅ Activity Logging and Tracking

#### Sales Operations
- ✅ Sales Stage Configuration (Configurable workflows)
- ✅ POC Tracking & Governance
- ✅ Forecasting Module
- ✅ Win/Loss Analysis
- ✅ Reports & Analytics

#### Incentive Engine
- ✅ Target Management (Individual, Team, Region)
- ✅ Incentive Plan Configuration
- ✅ Payout Calculation & Processing
- ✅ Performance Dashboards
- ✅ Approval Workflows

#### Enterprise Features
- ✅ Occasion-Based Auto Email
- ✅ Social Profile Integration
- ✅ Public Domain Intelligence (News, Competitive Intel)
- ✅ Outbound Call Integration (CTI)

#### Platform Features
- ✅ Role-Based Access Control (RBAC)
- ✅ User Management
- ✅ Admin Controls
- ✅ Activity Audit Logging
- ✅ CSV Import/Export
- ✅ Dark/Light Theme
- ✅ Command Palette (⌘K)
- ✅ Keyboard Shortcuts
- ✅ Onboarding Tour
- ✅ User Guide/Help Center

### 5.2 Out of Scope (Phase 2+)

- Mobile native applications
- Backend API implementation
- Third-party marketing automation
- Customer portal
- Multi-currency support (beyond INR)
- Multi-language support

---

## 6. Functional Requirements

### 6.1 Dashboard Module (FR-DASH)

| ID | Requirement | Priority |
|----|-------------|----------|
| FR-DASH-01 | Display key performance indicators (Pipeline, Revenue, Deals) | Critical |
| FR-DASH-02 | Show upcoming activities and tasks | High |
| FR-DASH-03 | Display recent activity feed | High |
| FR-DASH-04 | Provide quick action buttons | Medium |
| FR-DASH-05 | Support widget customization | Low |

### 6.2 Account Management (FR-ACC)

| ID | Requirement | Priority |
|----|-------------|----------|
| FR-ACC-01 | Create, Read, Update, Delete accounts | Critical |
| FR-ACC-02 | Support account hierarchy (Parent-Child relationships) | High |
| FR-ACC-03 | Account classification (Strategic, Key, Growth, Maintain, Transactional) | High |
| FR-ACC-04 | Account types (Enterprise, Government, PSU, SME, Startup, Partner) | High |
| FR-ACC-05 | Health score calculation and display | High |
| FR-ACC-06 | Store Indian identifiers (GSTIN, PAN, CIN) | Critical |
| FR-ACC-07 | Track industry and sub-industry | Medium |
| FR-ACC-08 | Account assignment to sales reps | High |
| FR-ACC-09 | Bulk account import via CSV | High |
| FR-ACC-10 | Account export with field selection | Medium |
| FR-ACC-11 | Account search and filtering | High |

### 6.3 Account Map (FR-AMAP)

| ID | Requirement | Priority |
|----|-------------|----------|
| FR-AMAP-01 | 360° account view with all related data | Critical |
| FR-AMAP-02 | Stakeholder influence mapping with power/influence scores | High |
| FR-AMAP-03 | Communication log per stakeholder | High |
| FR-AMAP-04 | Follow-up reminders management | Medium |
| FR-AMAP-05 | Opportunity pipeline visualization | High |
| FR-AMAP-06 | Contract and activity tabs | Medium |
| FR-AMAP-07 | Account history timeline view | High |
| FR-AMAP-08 | Quick actions (Add Opportunity, Contact, Log Activity) | High |
| FR-AMAP-09 | Keyboard shortcuts support | Medium |
| FR-AMAP-10 | Insights tab with metrics | Medium |

### 6.4 Contact Management (FR-CON)

| ID | Requirement | Priority |
|----|-------------|----------|
| FR-CON-01 | Create, Read, Update, Delete contacts | Critical |
| FR-CON-02 | Associate contacts with accounts | Critical |
| FR-CON-03 | Contact role classification (Decision Maker, Champion, Influencer, etc.) | High |
| FR-CON-04 | Influence level tracking (Critical, High, Medium, Low) | High |
| FR-CON-05 | LinkedIn profile storage and integration | Medium |
| FR-CON-06 | Click-to-view contact details (expandable rows) | High |
| FR-CON-07 | Important dates management (Birthday, Anniversary) | Medium |
| FR-CON-08 | Contact import/export | High |
| FR-CON-09 | Contact search and filtering | High |

### 6.5 Lead Management (FR-LEAD)

| ID | Requirement | Priority |
|----|-------------|----------|
| FR-LEAD-01 | Create, Read, Update, Delete leads | Critical |
| FR-LEAD-02 | Lead source tracking | High |
| FR-LEAD-03 | Lead status workflow (New, Contacted, Qualified, Converted, Lost) | Critical |
| FR-LEAD-04 | Lead scoring mechanism | Medium |
| FR-LEAD-05 | Lead assignment rules | Medium |
| FR-LEAD-06 | Lead conversion to Opportunity | Critical |
| FR-LEAD-07 | Lead import/export | High |
| FR-LEAD-08 | Duplicate lead detection | Medium |

### 6.6 Opportunity Management (FR-OPP)

| ID | Requirement | Priority |
|----|-------------|----------|
| FR-OPP-01 | Create, Read, Update, Delete opportunities | Critical |
| FR-OPP-02 | Link opportunities to accounts | Critical |
| FR-OPP-03 | Sales stage tracking with governance | Critical |
| FR-OPP-04 | Probability and weighted value calculation | High |
| FR-OPP-05 | Deal type classification (New Business, Expansion, Renewal, Upsell, Cross-sell) | High |
| FR-OPP-06 | Expected close date management | High |
| FR-OPP-07 | Stage history tracking | High |
| FR-OPP-08 | Competitor tracking per opportunity | Medium |
| FR-OPP-09 | Budget status and approval tracking | Medium |
| FR-OPP-10 | Stakeholder mapping per opportunity | High |
| FR-OPP-11 | Opportunity detail dialog with full information | High |
| FR-OPP-12 | Pipeline and kanban views | Medium |

### 6.7 Quote Management (FR-QUO)

| ID | Requirement | Priority |
|----|-------------|----------|
| FR-QUO-01 | Create, Read, Update, Delete quotes | Critical |
| FR-QUO-02 | Link quotes to opportunities | Critical |
| FR-QUO-03 | Quote builder with line items | High |
| FR-QUO-04 | Pricing integration | High |
| FR-QUO-05 | Discount management with governance | High |
| FR-QUO-06 | Quote versioning | Medium |
| FR-QUO-07 | Quote status workflow (Draft, Pending, Approved, Sent, Accepted, Rejected) | High |
| FR-QUO-08 | Quote validity period | Medium |
| FR-QUO-09 | Quote export/print | Medium |

### 6.8 Contract Management (FR-CTR)

| ID | Requirement | Priority |
|----|-------------|----------|
| FR-CTR-01 | Create, Read, Update, Delete contracts | Critical |
| FR-CTR-02 | Link contracts to accounts and opportunities | Critical |
| FR-CTR-03 | Contract value and duration tracking | High |
| FR-CTR-04 | Contract status workflow (Draft, Review, Active, Expired, Terminated) | High |
| FR-CTR-05 | Renewal date tracking and alerts | High |
| FR-CTR-06 | Contract detail dialog | High |
| FR-CTR-07 | Contract import/export | Medium |

### 6.9 Order Management (FR-ORD)

| ID | Requirement | Priority |
|----|-------------|----------|
| FR-ORD-01 | View and manage orders | Critical |
| FR-ORD-02 | Link orders to accounts and contracts | High |
| FR-ORD-03 | Order status tracking | High |
| FR-ORD-04 | Order value and dates | High |
| FR-ORD-05 | Order detail dialog | High |

### 6.10 Activity Management (FR-ACT)

| ID | Requirement | Priority |
|----|-------------|----------|
| FR-ACT-01 | Log various activity types (Call, Meeting, Email, Demo, Site Visit, etc.) | Critical |
| FR-ACT-02 | Associate activities with accounts, contacts, opportunities | High |
| FR-ACT-03 | Activity scheduling with calendar | High |
| FR-ACT-04 | Activity status tracking (Planned, Completed, Cancelled, Rescheduled) | High |
| FR-ACT-05 | Activity outcome logging | Medium |
| FR-ACT-06 | Activity participants tracking | Medium |
| FR-ACT-07 | Global activity log with filtering | High |
| FR-ACT-08 | Activity calendar view | Medium |

### 6.11 Sales Stage Configuration (FR-SSC)

| ID | Requirement | Priority |
|----|-------------|----------|
| FR-SSC-01 | Define custom sales stages | Critical |
| FR-SSC-02 | Configure stage entry criteria | High |
| FR-SSC-03 | Configure stage exit criteria | High |
| FR-SSC-04 | Mandatory field configuration per stage | High |
| FR-SSC-05 | Stage probability mapping | High |
| FR-SSC-06 | Approval requirements per stage | Medium |
| FR-SSC-07 | Maximum discount limits per stage | High |
| FR-SSC-08 | Required documents per stage | Medium |
| FR-SSC-09 | Stage time thresholds (warning, critical) | Medium |
| FR-SSC-10 | Visual stage order configuration (drag-drop) | Medium |

### 6.12 POC Tracking (FR-POC)

| ID | Requirement | Priority |
|----|-------------|----------|
| FR-POC-01 | Create, Read, Update, Delete POCs | High |
| FR-POC-02 | Link POCs to opportunities | High |
| FR-POC-03 | POC status workflow (Initiated, In Progress, Completed, Accepted, Rejected, Waived) | High |
| FR-POC-04 | KPI definition and tracking | High |
| FR-POC-05 | KPI categories (Accuracy, Performance, Cost Saving, SLA, Compliance, Custom) | High |
| FR-POC-06 | Baseline vs Target vs Actual value tracking | High |
| FR-POC-07 | Overall POC score calculation | Medium |
| FR-POC-08 | POC timeline tracking | Medium |
| FR-POC-09 | POC cost tracking | Medium |
| FR-POC-10 | Probability adjustment based on POC outcome | Medium |

### 6.13 Forecasting (FR-FOR)

| ID | Requirement | Priority |
|----|-------------|----------|
| FR-FOR-01 | Pipeline forecast view | High |
| FR-FOR-02 | Commit vs Best Case vs Pipeline breakdown | High |
| FR-FOR-03 | Forecast by category visualization | High |
| FR-FOR-04 | Time-period based forecasting (Monthly, Quarterly) | High |
| FR-FOR-05 | Forecast accuracy metrics | Medium |
| FR-FOR-06 | Export forecast data | Medium |

### 6.14 Win/Loss Analysis (FR-WL)

| ID | Requirement | Priority |
|----|-------------|----------|
| FR-WL-01 | Win rate calculation and display | High |
| FR-WL-02 | Loss reason tracking | High |
| FR-WL-03 | Competitor analysis | High |
| FR-WL-04 | Win/Loss trends over time | Medium |
| FR-WL-05 | Analytics by product, region, salesperson | Medium |

### 6.15 Target Management (FR-TGT)

| ID | Requirement | Priority |
|----|-------------|----------|
| FR-TGT-01 | Create targets at multiple levels (Individual, Team, Region, Product) | Critical |
| FR-TGT-02 | Target types (Revenue, Booking, Collection, Margin, Volume, Strategic) | High |
| FR-TGT-03 | Target periodicity (Monthly, Quarterly, Yearly) | High |
| FR-TGT-04 | Minimum threshold and stretch target configuration | High |
| FR-TGT-05 | Target achievement tracking | Critical |
| FR-TGT-06 | Carry forward and rollover options | Medium |
| FR-TGT-07 | Target vs Actual visualization | High |

### 6.16 Incentive Management (FR-INC)

| ID | Requirement | Priority |
|----|-------------|----------|
| FR-INC-01 | Create incentive plans | Critical |
| FR-INC-02 | Commission models (Flat, Slab-based, Tiered, Product-wise, Margin-based) | High |
| FR-INC-03 | Commission basis (Quote Value, Order Value, Invoice Value, Collection) | High |
| FR-INC-04 | Payout triggers configuration | High |
| FR-INC-05 | Slab-based commission configuration | High |
| FR-INC-06 | Accelerator and decelerator settings | Medium |
| FR-INC-07 | Discount penalty configuration | Medium |
| FR-INC-08 | Plan effective date ranges | High |
| FR-INC-09 | Plan locking mechanism | Medium |

### 6.17 Payout Management (FR-PAY)

| ID | Requirement | Priority |
|----|-------------|----------|
| FR-PAY-01 | Automatic payout calculation | Critical |
| FR-PAY-02 | Payout line item breakdown | High |
| FR-PAY-03 | Payout status workflow (Pending, Calculated, Approved, Released, Clawed Back) | Critical |
| FR-PAY-04 | Multi-level approval workflow | High |
| FR-PAY-05 | Holdback management | Medium |
| FR-PAY-06 | Clawback processing | Medium |
| FR-PAY-07 | Payout export for finance | High |
| FR-PAY-08 | Payout audit trail | High |

### 6.18 Performance Dashboard (FR-PERF)

| ID | Requirement | Priority |
|----|-------------|----------|
| FR-PERF-01 | Individual performance view | High |
| FR-PERF-02 | Team performance comparison | High |
| FR-PERF-03 | Leaderboard rankings | Medium |
| FR-PERF-04 | Target progress visualization | High |
| FR-PERF-05 | Earnings summary (YTD, QTD, MTD) | High |
| FR-PERF-06 | Performance trends | Medium |

### 6.19 Enterprise Features

#### 6.19.1 Occasion-Based Auto Email (FR-OCC)

| ID | Requirement | Priority |
|----|-------------|----------|
| FR-OCC-01 | Store important dates per contact (Birthday, Anniversary, Custom) | Medium |
| FR-OCC-02 | Pre-built email templates | Medium |
| FR-OCC-03 | Personalization tokens (name, company, etc.) | Medium |
| FR-OCC-04 | Configurable send time | Low |
| FR-OCC-05 | Annual repeat option | Low |
| FR-OCC-06 | Opt-out controls | Medium |
| FR-OCC-07 | Manual send for testing | Low |

#### 6.19.2 Social Profile Integration (FR-SOC)

| ID | Requirement | Priority |
|----|-------------|----------|
| FR-SOC-01 | Connect social profiles (LinkedIn, Twitter, etc.) | Medium |
| FR-SOC-02 | Profile sync status tracking | Medium |
| FR-SOC-03 | Social activity feed | Medium |
| FR-SOC-04 | Create tasks from social events | Low |
| FR-SOC-05 | Disconnect profile functionality | Medium |

#### 6.19.3 Public Domain Intelligence (FR-INT)

| ID | Requirement | Priority |
|----|-------------|----------|
| FR-INT-01 | News alerts aggregation | Medium |
| FR-INT-02 | News categorization (Funding, Contract, Leadership, M&A, etc.) | Medium |
| FR-INT-03 | Relevance scoring | Medium |
| FR-INT-04 | Competitive intelligence entries | Medium |
| FR-INT-05 | Tech stack tracking | Low |
| FR-INT-06 | News subscription management | Low |

#### 6.19.4 Outbound Call Integration (FR-CALL)

| ID | Requirement | Priority |
|----|-------------|----------|
| FR-CALL-01 | Click-to-call functionality | Medium |
| FR-CALL-02 | DNC (Do Not Call) list checking | High |
| FR-CALL-03 | Call pop panel with contact info | Medium |
| FR-CALL-04 | Call disposition logging | Medium |
| FR-CALL-05 | Call history tracking | Medium |
| FR-CALL-06 | Call scripts | Low |

### 6.20 Platform Features

#### 6.20.1 Admin Controls (FR-ADM)

| ID | Requirement | Priority |
|----|-------------|----------|
| FR-ADM-01 | System settings management | High |
| FR-ADM-02 | Audit log viewing | High |
| FR-ADM-03 | Data backup controls | Medium |
| FR-ADM-04 | Integration settings | Medium |

#### 6.20.2 User Management (FR-USR)

| ID | Requirement | Priority |
|----|-------------|----------|
| FR-USR-01 | Create, Read, Update, Delete users | Critical |
| FR-USR-02 | Role assignment | Critical |
| FR-USR-03 | Team assignment | High |
| FR-USR-04 | User activation/deactivation | High |
| FR-USR-05 | User search and filtering | High |

#### 6.20.3 Reports (FR-RPT)

| ID | Requirement | Priority |
|----|-------------|----------|
| FR-RPT-01 | Pre-built report templates | High |
| FR-RPT-02 | Custom report builder | Medium |
| FR-RPT-03 | Report scheduling | Low |
| FR-RPT-04 | Report export (CSV, PDF) | High |

---

## 7. Non-Functional Requirements

### 7.1 Performance (NFR-PERF)

| ID | Requirement | Target |
|----|-------------|--------|
| NFR-PERF-01 | Page load time | < 3 seconds |
| NFR-PERF-02 | Search response time | < 1 second |
| NFR-PERF-03 | Form submission response | < 2 seconds |
| NFR-PERF-04 | Dashboard refresh | < 5 seconds |

### 7.2 Usability (NFR-USE)

| ID | Requirement | Target |
|----|-------------|--------|
| NFR-USE-01 | Responsive design support | Desktop, Tablet, Mobile |
| NFR-USE-02 | Theme support | Light, Dark, System |
| NFR-USE-03 | Keyboard navigation | Full support |
| NFR-USE-04 | Accessibility compliance | WCAG 2.1 AA |
| NFR-USE-05 | Command palette | ⌘K / Ctrl+K |

### 7.3 Reliability (NFR-REL)

| ID | Requirement | Target |
|----|-------------|--------|
| NFR-REL-01 | Application uptime | 99.9% |
| NFR-REL-02 | Data persistence | LocalStorage + Backend |
| NFR-REL-03 | Error handling | Graceful degradation |

### 7.4 Scalability (NFR-SCL)

| ID | Requirement | Target |
|----|-------------|--------|
| NFR-SCL-01 | Concurrent users | 1000+ |
| NFR-SCL-02 | Accounts supported | 100,000+ |
| NFR-SCL-03 | Opportunities supported | 500,000+ |

### 7.5 Compatibility (NFR-CMP)

| ID | Requirement | Target |
|----|-------------|--------|
| NFR-CMP-01 | Browsers supported | Chrome, Firefox, Safari, Edge |
| NFR-CMP-02 | Minimum browser version | Last 2 major versions |

---

## 8. User Roles & Permissions

### 8.1 Role Definitions

| Role | Description | Color |
|------|-------------|-------|
| **Administrator** | Full system access including user management and admin controls | Purple |
| **Sales Head** | Manage sales team, approve payouts, set targets | Blue |
| **Finance** | Approve payouts, view audit logs, financial reporting | Amber |
| **HR** | Manage users, approve payouts, view performance | Pink |
| **Sales** | Manage accounts, leads, opportunities, and quotes | Emerald |
| **Viewer** | Read-only access to most areas | Slate |

### 8.2 Permission Matrix

| Permission | Admin | Sales Head | Finance | HR | Sales | Viewer |
|------------|:-----:|:----------:|:-------:|:--:|:-----:|:------:|
| View Dashboard | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| View Accounts | ✅ | ✅ | ✅ | - | ✅ | ✅ |
| Manage Accounts | ✅ | ✅ | - | - | ✅ | - |
| View Contacts | ✅ | ✅ | - | - | ✅ | ✅ |
| Manage Contacts | ✅ | ✅ | - | - | ✅ | - |
| View Leads | ✅ | ✅ | - | - | ✅ | ✅ |
| Manage Leads | ✅ | ✅ | - | - | ✅ | - |
| View Opportunities | ✅ | ✅ | - | - | ✅ | ✅ |
| Manage Opportunities | ✅ | ✅ | - | - | ✅ | - |
| View Quotes | ✅ | ✅ | - | - | ✅ | ✅ |
| Manage Quotes | ✅ | ✅ | - | - | ✅ | - |
| View Contracts | ✅ | ✅ | ✅ | - | ✅ | ✅ |
| Manage Contracts | ✅ | - | - | - | - | - |
| View Orders | ✅ | ✅ | ✅ | - | ✅ | ✅ |
| Manage Orders | ✅ | - | - | - | - | - |
| View Targets | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| Manage Targets | ✅ | ✅ | - | - | - | - |
| View Incentives | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| Manage Incentives | ✅ | - | - | - | - | - |
| View Payouts | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| Manage Payouts | ✅ | - | ✅ | - | - | - |
| Approve Payouts | ✅ | ✅ | ✅ | ✅ | - | - |
| View Performance | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| View Admin | ✅ | - | ✅ | - | - | - |
| Manage Admin | ✅ | - | - | - | - | - |
| View Audit Logs | ✅ | - | ✅ | ✅ | - | - |
| Manage Users | ✅ | - | - | ✅ | - | - |
| View Reports | ✅ | ✅ | ✅ | ✅ | - | ✅ |
| Manage Settings | ✅ | - | - | - | - | - |

---

## 9. Module Specifications

### 9.1 Navigation Structure

```
SequelString CRM
├── Dashboard
├── [CRM Section]
│   ├── Accounts
│   ├── Account Map
│   ├── Contacts
│   ├── Leads
│   ├── Opportunities
│   ├── Quotes
│   ├── Contracts
│   └── Orders
├── [Activities]
│   └── Activities Log
├── [Intelligence Section]
│   ├── Forecasting
│   ├── Win/Loss Analysis
│   └── POC Tracking
├── [Incentive Engine]
│   ├── Targets
│   ├── Incentives
│   ├── Payouts
│   └── Performance
├── [Administration]
│   ├── Admin Controls
│   ├── User Management
│   └── Sales Stage Config
├── [Enterprise Features]
│   ├── Occasion-Based Email
│   ├── Social Integration
│   ├── Public Domain Intelligence
│   └── Call Integration
├── Reports
├── Pricing
├── Settings
└── User Guide
```

### 9.2 Module Interaction Diagram

```
┌─────────────┐     ┌─────────────┐     ┌─────────────┐
│   LEADS     │────▶│ OPPORTUNITIES│────▶│   QUOTES    │
└─────────────┘     └─────────────┘     └─────────────┘
                           │                    │
                           ▼                    ▼
                    ┌─────────────┐     ┌─────────────┐
                    │    POC      │     │  CONTRACTS  │
                    └─────────────┘     └─────────────┘
                                               │
                                               ▼
                                        ┌─────────────┐
                                        │   ORDERS    │
                                        └─────────────┘
                                               │
                                               ▼
┌─────────────┐     ┌─────────────┐     ┌─────────────┐
│  TARGETS    │◀────│  PAYOUTS    │◀────│ INCENTIVES  │
└─────────────┘     └─────────────┘     └─────────────┘
```

---

## 10. Data Models

### 10.1 Core Entities

#### Account Entity
```typescript
interface Account {
  id: string;
  name: string;
  legalName: string;
  type: 'enterprise' | 'government' | 'psu' | 'sme' | 'startup' | 'partner';
  classification: 'strategic' | 'key' | 'growth' | 'maintain' | 'transactional';
  status: 'prospect' | 'active' | 'dormant' | 'churned' | 'blacklisted';
  hierarchy: AccountHierarchy;
  ownerId: string;
  ownerName: string;
  region: string;
  territory: string;
  gstin?: string;
  pan?: string;
  industry: string;
  subIndustry: string;
  employeeCount: string;
  annualRevenue: string;
  healthScore: number; // 0-100
  engagementScore: number;
  riskScore: number;
  totalContractValue: number;
  activePipelineValue: number;
  tags: string[];
  createdAt: Date;
  updatedAt: Date;
}
```

#### Opportunity Entity
```typescript
interface Opportunity {
  id: string;
  name: string;
  accountId: string;
  accountName: string;
  stageId: string;
  stageName: string;
  status: 'open' | 'won' | 'lost' | 'on_hold' | 'abandoned';
  dealType: 'new_business' | 'expansion' | 'renewal' | 'upsell' | 'cross_sell';
  dealSize: number;
  probability: number;
  weightedValue: number;
  expectedCloseDate: Date;
  competitors: CompetitorInfo[];
  stageHistory: StageHistoryEntry[];
  createdAt: Date;
  updatedAt: Date;
}
```

#### Stakeholder Entity
```typescript
interface Stakeholder {
  id: string;
  accountId: string;
  contactId: string;
  name: string;
  title: string;
  department: string;
  roles: ContactRole[];
  powerScore: number; // 1-10
  influenceScore: number; // 1-10
  relationshipStrength: 'cold' | 'warm' | 'strong' | 'advocate';
  sentiment: 'positive' | 'neutral' | 'negative' | 'unknown';
  isKeyContact: boolean;
  isDecisionMaker: boolean;
}
```

#### Incentive Plan Entity
```typescript
interface IncentivePlan {
  id: string;
  name: string;
  description: string;
  commissionModel: CommissionModel;
  commissionBasis: CommissionBasis;
  payoutTrigger: PayoutTrigger;
  baseRate: number;
  slabs: CommissionSlab[];
  acceleratorThreshold: number;
  acceleratorMultiplier: number;
  discountPenaltyEnabled: boolean;
  effectiveFrom: string;
  effectiveTo: string;
  status: 'active' | 'draft' | 'inactive';
  isLocked: boolean;
}
```

#### Payout Entity
```typescript
interface Payout {
  id: string;
  salespersonId: string;
  salespersonName: string;
  period: string;
  frequency: PayoutFrequency;
  lineItems: PayoutLineItem[];
  grossAmount: number;
  holdbackAmount: number;
  clawbackAmount: number;
  netAmount: number;
  status: PayoutStatus;
  approvalLevel: number;
  approvedBy: string[];
  releaseDate: string | null;
}
```

---

## 11. Integration Requirements

### 11.1 Required Integrations

| Integration | Purpose | Priority | Status |
|-------------|---------|----------|--------|
| Email Service (SendGrid/Mailgun) | Occasion emails, notifications | Medium | Planned |
| CTI Provider (Twilio/Exotel) | Call integration | Medium | Simulated |
| LinkedIn API | Social profile sync | Medium | Simulated |
| News API | Public domain intelligence | Low | Simulated |
| Google/Microsoft Calendar | Activity scheduling | Low | Planned |
| Document Storage | Contract/Quote documents | Medium | Planned |

### 11.2 API Endpoints (Backend Requirements)

The frontend is designed to work with the following API structure:

- `GET/POST/PUT/DELETE /api/accounts`
- `GET/POST/PUT/DELETE /api/contacts`
- `GET/POST/PUT/DELETE /api/leads`
- `GET/POST/PUT/DELETE /api/opportunities`
- `GET/POST/PUT/DELETE /api/quotes`
- `GET/POST/PUT/DELETE /api/contracts`
- `GET/POST/PUT/DELETE /api/orders`
- `GET/POST/PUT/DELETE /api/activities`
- `GET/POST/PUT/DELETE /api/targets`
- `GET/POST/PUT/DELETE /api/incentive-plans`
- `GET/POST/PUT/DELETE /api/payouts`
- `GET/POST /api/auth/login|logout|register`
- `GET/PUT /api/users`
- `GET /api/audit-logs`
- `GET /api/reports`

---

## 12. User Interface Requirements

### 12.1 Design System

| Component | Technology |
|-----------|------------|
| Component Library | Shadcn/ui (Radix UI primitives) |
| CSS Framework | Tailwind CSS |
| Icons | Lucide React |
| Charts | Recharts (implied for dashboards) |
| Data Tables | Custom with sorting, filtering, pagination |
| Dialogs | Sheet (side panel) and Dialog (modal) |
| Notifications | Sonner (toast notifications) |

### 12.2 Theme Support

- **Light Mode**: Default bright theme
- **Dark Mode**: Full dark theme support
- **System Mode**: Follows OS preference
- **Persistent**: Theme preference stored in localStorage

### 12.3 Responsive Breakpoints

| Breakpoint | Width | Layout |
|------------|-------|--------|
| Mobile | < 640px | Single column, collapsed nav |
| Tablet | 640-1024px | 2 columns, side nav |
| Desktop | > 1024px | Full layout, expanded nav |

### 12.4 Keyboard Shortcuts

| Shortcut | Action |
|----------|--------|
| ⌘K / Ctrl+K | Open Command Palette |
| ⌘N / Ctrl+N | New Opportunity (in Account Map) |
| ⌘⇧C / Ctrl+Shift+C | Add Contact (in Account Map) |
| ⌘A / Ctrl+A | Log Activity (in Account Map) |
| ? | Show keyboard shortcuts help |
| Esc | Close dialog/modal |

---

## 13. Security Requirements

### 13.1 Authentication (SEC-AUTH)

| ID | Requirement | Priority |
|----|-------------|----------|
| SEC-AUTH-01 | Role-based login with email/password | Critical |
| SEC-AUTH-02 | Protected routes for authenticated users | Critical |
| SEC-AUTH-03 | Session management | High |
| SEC-AUTH-04 | Auto-logout on inactivity | Medium |
| SEC-AUTH-05 | SSO support (future) | Low |

### 13.2 Authorization (SEC-AUTHZ)

| ID | Requirement | Priority |
|----|-------------|----------|
| SEC-AUTHZ-01 | Role-based access control (RBAC) | Critical |
| SEC-AUTHZ-02 | Permission-based route protection | Critical |
| SEC-AUTHZ-03 | Component-level permission checks | High |
| SEC-AUTHZ-04 | API-level authorization (backend) | Critical |

### 13.3 Data Security (SEC-DATA)

| ID | Requirement | Priority |
|----|-------------|----------|
| SEC-DATA-01 | HTTPS enforcement | Critical |
| SEC-DATA-02 | Data encryption at rest | High |
| SEC-DATA-03 | XSS prevention | Critical |
| SEC-DATA-04 | CSRF protection | Critical |
| SEC-DATA-05 | Input validation and sanitization | Critical |

### 13.4 Audit & Compliance (SEC-AUDIT)

| ID | Requirement | Priority |
|----|-------------|----------|
| SEC-AUDIT-01 | Activity logging for all CRUD operations | High |
| SEC-AUDIT-02 | Audit log retention | High |
| SEC-AUDIT-03 | Immutable audit records | High |
| SEC-AUDIT-04 | Compliance reporting | Medium |

---

## 14. Assumptions & Constraints

### 14.1 Assumptions

1. Users have modern web browsers (Chrome, Firefox, Safari, Edge - last 2 versions)
2. Users have reliable internet connectivity
3. Backend API will follow RESTful conventions
4. Indian Rupee (INR) is the primary currency
5. Indian fiscal year (April - March) is the default
6. Single-tenant deployment per organization

### 14.2 Constraints

1. Frontend-only implementation in Phase 1 (mock data)
2. No mobile native app in Phase 1
3. English-only interface in Phase 1
4. Third-party integrations simulated in Phase 1
5. Limited offline capability

---

## 15. Dependencies

### 15.1 Technology Dependencies

| Dependency | Version | Purpose |
|------------|---------|---------|
| React | ^18.3.1 | Core UI framework |
| TypeScript | Latest | Type safety |
| Vite | ^5.4.19 | Build tool |
| Tailwind CSS | Latest | Styling |
| React Router DOM | ^6.x | Routing |
| React Query | ^5.x | Server state management |
| next-themes | Latest | Theme management |
| Radix UI | Various | Accessible primitives |
| Lucide React | Latest | Icons |
| date-fns | Latest | Date utilities |
| sonner | Latest | Toast notifications |
| DOMPurify | Latest | HTML sanitization (security) |

### 15.2 External Dependencies (Future)

- Authentication provider (OAuth 2.0)
- Email delivery service
- CTI/VoIP provider
- Cloud storage service
- News/Intelligence API

---

## 16. Acceptance Criteria

### 16.1 Module Acceptance Criteria

| Module | Criteria |
|--------|----------|
| Dashboard | All KPI widgets render correctly with mock data |
| Accounts | Full CRUD operations with import/export |
| Account Map | 360° view loads all tabs and data correctly |
| Contacts | Full CRUD with LinkedIn field and expandable rows |
| Leads | Full lifecycle from creation to conversion |
| Opportunities | Stage management with governance rules |
| Quotes | Builder creates line items correctly |
| Contracts | Full CRUD with status workflow |
| Orders | View and detail dialog functional |
| Activities | Logging with all activity types |
| Sales Stages | Configuration UI fully functional |
| POC Tracking | KPI tracking and scoring works |
| Forecasting | Charts render with correct data |
| Win/Loss | Analysis displays correctly |
| Targets | Multi-level target creation |
| Incentives | Plan configuration saves correctly |
| Payouts | Calculation and approval workflow |
| Performance | Dashboard displays rankings |
| Users | CRUD with role assignment |
| Admin | Settings and audit log access |
| Enterprise Features | All 4 features demonstrable |

### 16.2 Quality Criteria

- [ ] No TypeScript errors in build
- [ ] All pages load without console errors
- [ ] Responsive design works on all breakpoints
- [ ] Dark/Light theme switches correctly
- [ ] All forms validate input properly
- [ ] Navigation works correctly between all pages
- [ ] Command palette functions correctly
- [ ] Keyboard shortcuts work as documented

---

## 17. Appendix

### 17.1 Glossary

| Term | Definition |
|------|------------|
| Account | A company or organization that is a current or potential customer |
| Account Map | 360-degree view of an account with all related information |
| Champion | A contact who actively supports your solution internally |
| CTI | Computer Telephony Integration |
| DNC | Do Not Call list |
| GSTIN | Goods and Services Tax Identification Number (India) |
| KPI | Key Performance Indicator |
| PAN | Permanent Account Number (India tax ID) |
| POC | Proof of Concept |
| PSU | Public Sector Undertaking |
| RBAC | Role-Based Access Control |
| Stakeholder | A person involved in the buying decision |
| Weighted Pipeline | Deal value multiplied by probability |

### 17.2 Document References

| Document | Location |
|----------|----------|
| Technical Architecture | `/docs/TECHNICAL_ARCHITECTURE.md` |
| MERN Architecture | `/docs/MERN_ARCHITECTURE.md` |
| Implementation Status | `/docs/IMPLEMENTATION_STATUS.md` |
| Enterprise Features Tracker | `/docs/ENTERPRISE_FEATURES_TRACKER.md` |
| Deployment Guide | `/docs/DEPLOYMENT_GUIDE.md` |
| Infrastructure Requirements | `/docs/INFRASTRUCTURE_REQUIREMENTS.md` |

### 17.3 Version History

| Version | Date | Author | Changes |
|---------|------|--------|---------|
| 1.0 | Feb 01, 2026 | SequelString Product Team | Initial BRD release |

---

## Document Approval

| Role | Name | Signature | Date |
|------|------|-----------|------|
| Product Owner | | | |
| Business Analyst | | | |
| Technical Lead | | | |
| QA Lead | | | |
| Project Manager | | | |

---

*This document is confidential and intended for internal use and authorized stakeholders only.*

**© 2026 SequelString CRM. All Rights Reserved.**
