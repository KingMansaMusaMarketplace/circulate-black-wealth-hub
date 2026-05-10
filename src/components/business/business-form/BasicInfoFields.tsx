
import React from "react";
import { useFormContext } from "react-hook-form";
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { BusinessFormValues } from "./models";
import CategoryField from "./CategoryField";

const BasicInfoFields = () => {
  const methods = useFormContext<BusinessFormValues>();
  const { control } = methods;

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <FormField
          control={control}
          name="businessName"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Business Name</FormLabel>
              <FormControl>
                <Input placeholder="Your Business Name" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <CategoryField form={methods} name="category" />
      </div>

      <FormField
        control={control}
        name="description"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Business Description</FormLabel>
            <FormControl>
              <Textarea
                placeholder="Describe your business..."
                className="min-h-[100px] scroll-mb-32"
                onFocus={(e) => {
                  // Ensure the field is fully visible above the iOS keyboard
                  setTimeout(() => {
                    e.currentTarget?.scrollIntoView({ block: "center", behavior: "smooth" });
                  }, 100);
                }}
                {...field}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </>
  );
};

export default BasicInfoFields;
