
# Split-View Map Directory Enhancement

## Overview
Transform the directory from a simple scrollable list into a powerful split-view experience with an interactive map on the right side and a scrollable business list on the left. This is the pattern used by Yelp, Airbnb, and Google Maps — and it will make your directory feel world-class.

---

## What You'll Get

**Desktop Experience:**
- Left panel (40% width): Scrollable business cards
- Right panel (60% width): Interactive Mapbox map with business pins
- Clicking a pin highlights the corresponding card in the list
- Hovering over a card highlights the pin on the map
- Map stays fixed while you scroll the list

**Mobile Experience:**
- Floating "Show Map" button at the bottom
- Tapping it opens a full-screen map overlay
- Tap a pin to see a mini business card, then tap to view details

---

## Technical Implementation

### 1. Create Split-View Container Component
**New file:** `src/components/directory/DirectorySplitView.tsx`

A responsive layout component that:
- Uses CSS Grid for the split layout on desktop
- Shows list-only on mobile with a floating map toggle
- Maintains the premium dark/gold aesthetic
- Syncs scroll position with map markers

### 2. Create Compact Business Card for Map Panel
**New file:** `src/components/directory/CompactBusinessCard.tsx`

A smaller, more condensed card optimized for the split-view:
- Horizontal layout (image left, details right)
- Hover state that triggers map marker highlight
- Click to navigate to business detail
- Shows: image, name, category, rating, distance

### 3. Enhanced Map Component for Split-View
**Modify:** `src/components/MapView/MapboxMap.tsx`

Add new capabilities:
- `highlightedBusinessId` prop for syncing with list hover
- Animated marker highlighting (pulse effect on hover)
- `onMarkerHover` callback for two-way sync
- Improved marker clustering for dense areas

### 4. Mobile Map Sheet
**New file:** `src/components/directory/MobileMapSheet.tsx`

A drawer-style overlay for mobile:
- Uses Vaul sheet component
- Full-screen map with business pins
- Bottom card preview when pin is tapped
- Swipe down to dismiss

### 5. Update Directory Page
**Modify:** `src/pages/DirectoryPage.tsx`

Integrate the split-view:
- Add toggle button for map view (already partially exists)
- Wrap business list in split-view container
- Pass map sync handlers to both list and map
- Preserve all existing filters and search functionality

---

## Layout Structure

```text
┌─────────────────────────────────────────────────────────┐
│  Header / Search / Category Pills                       │
├─────────────────────────────────────────────────────────┤
│                    │                                    │
│  Business List     │     Interactive Map                │
│  (scrollable)      │     (sticky position)              │
│                    │                                    │
│  ┌──────────────┐  │     ┌─────────────────────────┐    │
│  │ Card 1       │  │     │    📍  📍               │    │
│  └──────────────┘  │     │         📍   📍        │    │
│  ┌──────────────┐  │     │    📍        📍        │    │
│  │ Card 2       │  │     │                        │    │
│  └──────────────┘  │     │  📍     📍             │    │
│  ┌──────────────┐  │     │              📍        │    │
│  │ Card 3       │  │     │    📍                  │    │
│  └──────────────┘  │     └─────────────────────────┘    │
│       ...          │                                    │
│                    │                                    │
└─────────────────────────────────────────────────────────┘
```

---

## Files to Create/Modify

| Action | File | Purpose |
|--------|------|---------|
| Create | `src/components/directory/DirectorySplitView.tsx` | Main split-view layout container |
| Create | `src/components/directory/CompactBusinessCard.tsx` | Condensed card for list panel |
| Create | `src/components/directory/MobileMapSheet.tsx` | Mobile-friendly map drawer |
| Modify | `src/components/MapView/MapboxMap.tsx` | Add highlight sync capabilities |
| Modify | `src/pages/DirectoryPage.tsx` | Integrate split-view mode |

---

## Interaction Flow

1. **User hovers card in list** → Map marker pulses gold
2. **User clicks map marker** → List scrolls to that business card, card highlights
3. **User clicks card** → Navigates to business detail page
4. **On mobile** → Floating "Map" button opens fullscreen map sheet

---

## Estimated Effort
This is a medium-complexity feature that will significantly upgrade the user experience. The existing MapboxMap and business list components provide a solid foundation.

