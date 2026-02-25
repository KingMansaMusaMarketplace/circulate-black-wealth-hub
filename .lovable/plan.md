

# Push Hero Backgrounds Toward True Black

**Goal**: Darken the hero section backgrounds from the current deep navy (`#020617` / `#0a1a3a` / `#0f172a`) toward true black (`#000000`) for a more premium, luxury feel -- inspired by the Musa Card aesthetic. This is fully reversible by changing the color values back.

**What changes (and what stays the same)**:
- All text, buttons, gold accents, and animations remain untouched
- Only the background gradient colors shift darker

---

## Files to Update

### 1. Homepage background (`src/pages/HomePage.tsx`)
- **Line 56**: Change `from-[#020617] via-[#0a1a3a] to-[#0f172a]` to `from-[#000000] via-[#050a18] to-[#030712]`
- Reduce the blue/gold orb opacity slightly so they glow against true black rather than washing out

### 2. Homepage Hero (`src/components/Hero.tsx`)
- **Line 11**: Change `from-[#020617] via-[#0a1a3a] to-[#0f172a]` to `from-[#000000] via-[#050a18] to-[#030712]`
- Bump the gold ambient orb opacity up slightly (from `/3` to `/5`) so gold glows more visibly against the darker canvas

### 3. Directory Hero (`src/components/directory/DirectoryHero.tsx`)
- **Line 14**: Change `from-slate-900 via-blue-900 to-slate-800` to `from-[#000000] via-[#060d1f] to-[#030712]`

### 4. How It Works Hero (`src/components/HowItWorks/HeroSection.tsx`)
- Add a darker overlay or push the glass-morphism backdrop toward true black

---

## Rollback Plan

If you don't like it, I simply revert these 4 gradient values back to their current colors:
- `from-[#020617] via-[#0a1a3a] to-[#0f172a]` (homepage + hero)
- `from-slate-900 via-blue-900 to-slate-800` (directory)

No structural or layout changes are involved -- just color hex values.

---

## Technical Details

| File | Current gradient | New gradient |
|------|-----------------|--------------|
| `HomePage.tsx` L56 | `#020617 / #0a1a3a / #0f172a` | `#000000 / #050a18 / #030712` |
| `Hero.tsx` L11 | `#020617 / #0a1a3a / #0f172a` | `#000000 / #050a18 / #030712` |
| `DirectoryHero.tsx` L14 | `slate-900 / blue-900 / slate-800` | `#000000 / #060d1f / #030712` |
| `HeroSection.tsx` (HowItWorks) | glass overlay `bg-white/5` | `bg-black/40` for deeper contrast |

Gold ambient orbs in `Hero.tsx` will get a slight opacity boost (`mansagold/3` to `mansagold/5`) so the gold glow pops more against the darker background.

