// Expand a category-group label or slug (e.g. "Restaurants" / "restaurants")
// into the list of DB category names that actually exist in the businesses table.
// Returns null when the input is a single concrete DB category (no expansion needed).

import { CATEGORY_GROUPS } from "@/lib/seo/category-groups";

export function expandCategoryGroup(category?: string | null): string[] | null {
  if (!category || category === "all") return null;
  const normalized = category.trim().toLowerCase();
  const group = CATEGORY_GROUPS.find(
    (g) => g.slug.toLowerCase() === normalized || g.label.toLowerCase() === normalized
  );
  return group ? group.categories : null;
}
