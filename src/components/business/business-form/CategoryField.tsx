
import React, { useState, useRef, useEffect } from 'react';
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '@/components/ui/command';
import { Check, ChevronsUpDown } from 'lucide-react';
import { cn } from '@/lib/utils';
import * as C from '@/data/categories';
const { businessCategories } = C;

const sortByName = (a: C.BusinessCategory, b: C.BusinessCategory) => a.name.localeCompare(b.name);
const CATEGORY_GROUPS = [
  { label: 'Beauty & Personal Care', items: C.beautyCategories },
  { label: 'Business Services', items: C.businessServiceCategories },
  { label: 'Education', items: C.educationCategories },
  { label: 'Entertainment & Events', items: C.entertainmentCategories },
  { label: 'Fitness & Wellness', items: C.fitnessCategories },
  { label: 'Food & Drink', items: C.foodCategories },
  { label: 'Health & Medical', items: C.medicalCategories },
  { label: 'Home & Local Services', items: [...C.serviceCategories, ...C.serviceProviderCategories] },
  { label: 'Legal', items: C.legalCategories },
  { label: 'Retail & Shopping', items: C.retailCategories },
  { label: 'Technology', items: C.technologyCategories },
  { label: 'Vacation Rentals & Stays', items: C.vacationRentalCategories },
  { label: 'Other', items: C.otherCategories },
].map(g => ({ ...g, items: [...g.items].sort(sortByName) }));
import { UseFormReturn } from 'react-hook-form';

interface CategoryFieldProps {
  form: UseFormReturn<any>;
  name: string;
}

const CategoryField: React.FC<CategoryFieldProps> = ({ form, name }) => {
  const [open, setOpen] = useState(false);
  const openedAtRef = useRef<number>(0);

  useEffect(() => {
    if (open) openedAtRef.current = Date.now();
  }, [open]);

  return (
    <FormField
      control={form.control}
      name={name}
      render={({ field }) => (
        <FormItem className="flex flex-col">
          <FormLabel>Business Category *</FormLabel>
          <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
              <FormControl>
                <Button
                  variant="outline"
                  role="combobox"
                  aria-expanded={open}
                  className={cn(
                    "w-full justify-between",
                    !field.value && "text-muted-foreground"
                  )}
                >
                  {field.value
                    ? businessCategories.find(
                        (category) => category.id === field.value
                      )?.name
                    : "Select your business category"}
                  <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                </Button>
              </FormControl>
            </PopoverTrigger>
            <PopoverContent className="w-full p-0 z-50 bg-background" sideOffset={4}>
              <Command>
                <CommandInput placeholder="Search categories..." />
                <CommandList className="max-h-[400px] overflow-y-auto">
                  <CommandEmpty>No category found.</CommandEmpty>
                  {CATEGORY_GROUPS.map((group) => (
                  <CommandGroup key={group.label} heading={group.label} className="[&_[cmdk-group-heading]]:text-mansagold [&_[cmdk-group-heading]]:font-bold [&_[cmdk-group-heading]]:uppercase [&_[cmdk-group-heading]]:tracking-wide">
                    {group.items.map((category) => (
                      <CommandItem
                        key={category.id}
                        value={category.name}
                        onSelect={() => {
                          // Guard against drift-click: ignore selections that fire
                          // within the first 300ms of the popover opening, which
                          // happens when a user clicks the trigger and releases
                          // over the first item without intending to choose it.
                          if (Date.now() - openedAtRef.current < 300) return;
                          form.setValue(name, category.id);
                          setOpen(false);
                        }}
                      >
                        <div className="flex items-center gap-2 w-full">
                          <span>{category.icon}</span>
                          <div className="flex-1">
                            <div className="font-medium">{category.name}</div>
                            <div className="text-xs text-gray-500">{category.description}</div>
                          </div>
                          <Check
                            className={cn(
                              "ml-auto h-4 w-4",
                              field.value === category.id ? "opacity-100" : "opacity-0"
                            )}
                          />
                        </div>
                      </CommandItem>
                    ))}
                  </CommandGroup>
                  ))}
                </CommandList>
              </Command>
            </PopoverContent>
          </Popover>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};

export default CategoryField;
