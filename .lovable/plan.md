

# Create Notion Databases for Mansa Musa Marketplace

Set up three Notion databases to serve as your project management hub.

## 1. Business Listings Tracker
A database to track all businesses being onboarded to the marketplace.

**Properties:**
- Business Name (title)
- Category (select: Restaurant, Beauty, Fashion, Technology, Retail, Financial Services, Health, etc.)
- Status (select: Lead, Applied, Under Review, Approved, Published, Rejected)
- Website URL
- Contact Email
- Contact Phone
- City / State
- Subscription Plan (select: Free, Basic $50/yr, Premium)
- Verified (checkbox)
- Featured (checkbox)
- Date Added
- Notes (rich text)

## 2. Feature Roadmap
A database to plan and prioritize marketplace features.

**Properties:**
- Feature Name (title)
- Status (select: Backlog, To Do, In Progress, Done)
- Priority (select: Critical, High, Medium, Low)
- Category (select: Frontend, Backend, Mobile, Integration, Design)
- Target Date
- Description (rich text)
- Assigned To (people)

## 3. Content Hub
A database to manage FAQs, program details, and marketplace content.

**Properties:**
- Content Title (title)
- Type (select: FAQ, Blog Post, Program Details, Policy, Help Article)
- Status (select: Draft, In Review, Published, Archived)
- Section (select: Business Owners, Customers, Sales Agents, Corporate, General)
- Last Updated
- Content (rich text)

## Technical Details

- All three databases will be created as standalone workspace-level databases using the Notion `create-database` tool
- Each uses appropriate Notion property types (SELECT, MULTI_SELECT, DATE, CHECKBOX, URL, EMAIL, RICH_TEXT, PEOPLE)
- Categories in the Business Listings Tracker will match the existing app categories (from `src/data/categories/`)

