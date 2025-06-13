
export interface BusinessCategory {
  id: string;
  name: string;
  description: string;
  icon: string;
  subcategories?: string[];
}

export const getCategoryById = (categories: BusinessCategory[], id: string): BusinessCategory | undefined => {
  return categories.find(category => category.id === id);
};

export const getCategoryOptions = (categories: BusinessCategory[]) => {
  return categories.map(category => ({
    value: category.id,
    label: category.name
  }));
};
