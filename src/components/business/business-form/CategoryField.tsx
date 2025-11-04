
import React, { useState } from 'react';
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '@/components/ui/command';
import { Check, ChevronsUpDown } from 'lucide-react';
import { cn } from '@/lib/utils';
import { businessCategories } from '@/data/categories';
import { UseFormReturn } from 'react-hook-form';

interface CategoryFieldProps {
  form: UseFormReturn<any>;
  name: string;
}

const CategoryField: React.FC<CategoryFieldProps> = ({ form, name }) => {
  const [open, setOpen] = useState(false);

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
                  <CommandGroup>
                    {businessCategories.map((category) => (
                      <CommandItem
                        key={category.id}
                        value={category.name}
                        onSelect={() => {
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
