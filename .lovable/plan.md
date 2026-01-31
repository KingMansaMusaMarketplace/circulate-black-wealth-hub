
# Plan: Implement Customer 360 View, Workflow Automation Builder, and Helpdesk System

## Overview
This plan implements three enterprise-grade features to match Salesforce capabilities using existing infrastructure at **zero additional cost**. All three features will leverage the existing Supabase database, React components, and UI patterns already established in the project.

---

## Feature 1: Customer 360 View

### What You'll Get
A unified dashboard showing **everything about a customer in one place**:
- Contact information and profile details
- Complete interaction history (calls, emails, meetings)
- Purchase and transaction timeline
- QR scan activity and loyalty points
- Active support tickets
- Tags and custom fields
- Upcoming follow-ups and reminders

### Implementation

**New Components:**
- `src/components/crm/Customer360View.tsx` - Main unified view component
- `src/components/crm/Customer360Timeline.tsx` - Chronological activity feed
- `src/components/crm/Customer360Sidebar.tsx` - Quick stats and actions

**Updates:**
- Modify `CustomerDetailPage.tsx` to integrate the new 360 view
- Create API function `getCustomer360Data()` in `customer-api.ts` that aggregates:
  - Customer profile from `customers` table
  - Interactions from `customer_interactions` table
  - Transactions from `transactions` table
  - QR scans from `qr_scans` table
  - Invoices from `invoices` table
  - Loyalty points from `loyalty_points` table
  - Support tickets from `support_tickets` table

**No Database Changes Required** - Uses existing tables

---

## Feature 2: Workflow Automation Builder

### What You'll Get
A no-code visual builder where businesses can create **if-then automation rules**:
- Trigger: "When a customer makes a purchase over $100"
- Action: "Send a thank you email" OR "Add VIP tag" OR "Notify sales rep"

Example workflows:
- Auto-upgrade customer to VIP when lifetime value exceeds $1,000
- Send follow-up reminder 7 days after last contact
- Alert when a customer hasn't purchased in 30 days
- Auto-assign new leads to sales agents

### Implementation

**New Database Tables:**

```text
workflows
├── id (uuid)
├── business_id (uuid)
├── name (text)
├── description (text)
├── is_active (boolean)
├── trigger_type (enum: purchase, customer_created, tag_added, inactivity, etc.)
├── trigger_config (jsonb) - conditions like "amount > 100"
├── created_at / updated_at

workflow_actions
├── id (uuid)
├── workflow_id (uuid)
├── action_type (enum: send_email, add_tag, update_status, notify_user, create_task)
├── action_config (jsonb) - email template, tag name, etc.
├── execution_order (integer)

workflow_executions
├── id (uuid)
├── workflow_id (uuid)
├── customer_id (uuid)
├── trigger_data (jsonb)
├── status (pending, completed, failed)
├── executed_at
```

**New Components:**
- `src/pages/WorkflowBuilderPage.tsx` - Main page for managing workflows
- `src/components/workflows/WorkflowList.tsx` - List of existing workflows
- `src/components/workflows/WorkflowEditor.tsx` - Visual workflow editor
- `src/components/workflows/TriggerSelector.tsx` - Choose trigger conditions
- `src/components/workflows/ActionBuilder.tsx` - Define actions
- `src/lib/api/workflow-api.ts` - CRUD operations for workflows

**New Edge Function:**
- `supabase/functions/execute-workflow/index.ts` - Processes workflow triggers

**Database Triggers (execute workflows):**
- Trigger on `transactions` insert to check purchase workflows
- Trigger on `customers` insert/update to check customer workflows

---

## Feature 3: Helpdesk Ticketing System (Enhancement)

### What You'll Get
Building on the existing `SupportTicketManager.tsx`, we'll add:
- **Customer-facing ticket submission** (currently admin-only)
- **Knowledge Base** with searchable articles
- **SLA Tracking** with response time goals
- **Canned Responses** for common questions
- **Ticket Assignment** to specific team members
- **Customer Portal** to view their own tickets

### Implementation

**New Database Tables:**

```text
knowledge_base_articles
├── id (uuid)
├── business_id (uuid, nullable for global articles)
├── title (text)
├── content (text)
├── category (text)
├── is_published (boolean)
├── view_count (integer)
├── helpful_count (integer)
├── created_at / updated_at

sla_policies
├── id (uuid)
├── business_id (uuid)
├── priority (text)
├── first_response_hours (integer)
├── resolution_hours (integer)
├── is_active (boolean)

canned_responses
├── id (uuid)
├── business_id (uuid)
├── title (text)
├── content (text)
├── category (text)
├── usage_count (integer)
```

**New Pages:**
- `src/pages/SubmitTicketPage.tsx` - Customer ticket submission
- `src/pages/MyTicketsPage.tsx` - Customer portal to view their tickets
- `src/pages/KnowledgeBasePage.tsx` - Public searchable knowledge base

**New Components:**
- `src/components/helpdesk/TicketSubmissionForm.tsx`
- `src/components/helpdesk/KnowledgeBaseSearch.tsx`
- `src/components/helpdesk/ArticleCard.tsx`
- `src/components/helpdesk/SLAIndicator.tsx` - Shows if ticket is within SLA
- `src/components/helpdesk/CannedResponsePicker.tsx`

**Updates:**
- Enhance `SupportTicketManager.tsx` with SLA tracking and canned responses
- Add routes to `App.tsx` for new customer-facing pages

---

## Files to Create

| File | Purpose |
|------|---------|
| `src/components/crm/Customer360View.tsx` | Unified customer view |
| `src/components/crm/Customer360Timeline.tsx` | Activity timeline |
| `src/components/crm/Customer360Sidebar.tsx` | Quick stats panel |
| `src/pages/WorkflowBuilderPage.tsx` | Workflow management |
| `src/components/workflows/WorkflowList.tsx` | Workflow listing |
| `src/components/workflows/WorkflowEditor.tsx` | Visual editor |
| `src/components/workflows/TriggerSelector.tsx` | Trigger configuration |
| `src/components/workflows/ActionBuilder.tsx` | Action configuration |
| `src/lib/api/workflow-api.ts` | Workflow API functions |
| `supabase/functions/execute-workflow/index.ts` | Workflow execution |
| `src/pages/SubmitTicketPage.tsx` | Customer ticket submission |
| `src/pages/MyTicketsPage.tsx` | Customer ticket portal |
| `src/pages/KnowledgeBasePage.tsx` | Knowledge base |
| `src/components/helpdesk/TicketSubmissionForm.tsx` | Ticket form |
| `src/components/helpdesk/KnowledgeBaseSearch.tsx` | KB search |
| `src/components/helpdesk/ArticleCard.tsx` | Article display |
| `src/components/helpdesk/SLAIndicator.tsx` | SLA status |
| `src/components/helpdesk/CannedResponsePicker.tsx` | Quick responses |
| `src/lib/api/helpdesk-api.ts` | Helpdesk API functions |

## Files to Modify

| File | Changes |
|------|---------|
| `src/pages/CustomerDetailPage.tsx` | Integrate Customer 360 View |
| `src/lib/api/customer-api.ts` | Add `getCustomer360Data()` function |
| `src/components/admin/SupportTicketManager.tsx` | Add SLA tracking & canned responses |
| `src/App.tsx` | Add new routes |

---

## Database Migrations Required

1. **Workflow tables** (workflows, workflow_actions, workflow_executions)
2. **Helpdesk tables** (knowledge_base_articles, sla_policies, canned_responses)
3. **RLS policies** for all new tables (business-scoped access)

---

## Implementation Order

1. **Customer 360 View** (no DB changes, fastest to deliver)
2. **Helpdesk Enhancement** (builds on existing system)
3. **Workflow Automation** (most complex, requires edge function)

---

## Cost Summary

| Feature | Database | Edge Functions | External APIs |
|---------|----------|----------------|---------------|
| Customer 360 | Included | None | None |
| Workflow Builder | Included | Included (Supabase) | None |
| Helpdesk | Included | None | None |
| **Total Additional Cost** | **$0** | **$0** | **$0** |

All features use your existing Supabase plan with no external API dependencies.
