import React from 'react';
import { X } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { MaterialCategory, MaterialTag } from '@/types/material-category';

interface MaterialFiltersProps {
  categories: MaterialCategory[];
  tags: MaterialTag[];
  selectedCategories: string[];
  selectedTags: string[];
  onCategoryToggle: (categoryId: string) => void;
  onTagToggle: (tagId: string) => void;
  onClearFilters: () => void;
}

const MaterialFilters: React.FC<MaterialFiltersProps> = ({
  categories,
  tags,
  selectedCategories,
  selectedTags,
  onCategoryToggle,
  onTagToggle,
  onClearFilters
}) => {
  const hasFilters = selectedCategories.length > 0 || selectedTags.length > 0;

  return (
    <div className="space-y-6">
      {hasFilters && (
        <div className="flex items-center justify-between">
          <div className="flex flex-wrap gap-2">
            {selectedCategories.map(catId => {
              const category = categories.find(c => c.id === catId);
              return category ? (
                <Badge key={catId} variant="secondary" className="gap-1">
                  {category.name}
                  <X
                    className="h-3 w-3 cursor-pointer"
                    onClick={() => onCategoryToggle(catId)}
                  />
                </Badge>
              ) : null;
            })}
            {selectedTags.map(tagId => {
              const tag = tags.find(t => t.id === tagId);
              return tag ? (
                <Badge key={tagId} variant="outline" className="gap-1">
                  {tag.name}
                  <X
                    className="h-3 w-3 cursor-pointer"
                    onClick={() => onTagToggle(tagId)}
                  />
                </Badge>
              ) : null;
            })}
          </div>
          <Button variant="ghost" size="sm" onClick={onClearFilters}>
            Clear All
          </Button>
        </div>
      )}

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Categories</CardTitle>
          <CardDescription>Filter by material purpose</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          {categories.map(category => (
            <div key={category.id} className="flex items-center space-x-2">
              <Checkbox
                id={`category-${category.id}`}
                checked={selectedCategories.includes(category.id)}
                onCheckedChange={() => onCategoryToggle(category.id)}
              />
              <Label
                htmlFor={`category-${category.id}`}
                className="flex items-center space-x-2 cursor-pointer flex-1"
              >
                {category.color && (
                  <div
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: category.color }}
                  />
                )}
                <span>{category.name}</span>
              </Label>
            </div>
          ))}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Tags</CardTitle>
          <CardDescription>Filter by topic or campaign</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2">
            {tags.map(tag => {
              const isSelected = selectedTags.includes(tag.id);
              return (
                <Badge
                  key={tag.id}
                  variant={isSelected ? "default" : "outline"}
                  className="cursor-pointer"
                  onClick={() => onTagToggle(tag.id)}
                >
                  {tag.name}
                </Badge>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default MaterialFilters;
