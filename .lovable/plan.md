

# Batch URL Import: Extract Multiple Businesses Simultaneously

## Overview
Upgrade the "Import from URL" feature to accept multiple website URLs and extract data from all of them in parallel, dramatically speeding up the workflow for importing many businesses.

## What You'll Get

### Multi-URL Input
- Replace the single URL input with a textarea where you can paste multiple URLs (one per line)
- Support for bulk paste from spreadsheets or lists
- URL validation and formatting before processing

### Parallel Processing
- Extract data from up to 5 URLs simultaneously
- Real-time progress tracking for each URL
- Visual status indicators: pending, processing, completed, failed

### Batch Review Interface
- See all extracted businesses in a scrollable list
- Edit any business before saving
- Select which ones to save as drafts
- "Save All" button to create all drafts at once

### Error Handling
- Failed extractions shown with error messages
- Retry individual failed URLs
- Continue processing even if some URLs fail

## Technical Implementation

### 1. Update URLBusinessImport Component
- Change single `url` state to `urls: string[]` array
- Add textarea for multi-line URL input
- Implement parallel processing with `Promise.allSettled()`
- Track individual URL status in a map

### 2. Processing Queue UI
```text
+----------------------------------+
|  URL 1: example.com     [Done]   |
|  URL 2: business.com    [...]    |
|  URL 3: shop.net        [Queued] |
+----------------------------------+
```

### 3. Batch Results View
- Grid or list of extracted business cards
- Checkboxes to select which to save
- Inline editing for quick corrections
- Batch save action

### 4. Rate Limit Handling
- Process in batches of 3-5 to avoid API rate limits
- Add small delay between batches
- Show queue position for pending URLs

## Files to Modify

| File | Changes |
|------|---------|
| `src/components/admin/import/URLBusinessImport.tsx` | Multi-URL input, parallel processing, batch results UI |

## User Workflow

1. Open "Import from URL"
2. Paste multiple URLs (one per line)
3. Click "Extract All"
4. Watch progress as each URL is processed
5. Review all extracted data
6. Edit any entries as needed
7. Click "Save All as Drafts" or save individually

