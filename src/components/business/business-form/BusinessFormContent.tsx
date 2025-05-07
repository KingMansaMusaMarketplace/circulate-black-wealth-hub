
import React from "react";
import { Form } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { useBusinessForm } from "./useBusinessForm";
import BasicInfoFields from "./BasicInfoFields";
import LocationFields from "./LocationFields";
import ContactFields from "./ContactFields";

const BusinessFormContent = () => {
  const { form, loading, onSubmit, isSubmitting } = useBusinessForm();

  if (loading && !isSubmitting) {
    return (
      <div className="flex justify-center items-center py-8">
        <Loader2 className="h-8 w-8 animate-spin text-mansablue" />
        <span className="ml-2">Loading business profile...</span>
      </div>
    );
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <BasicInfoFields />
        <LocationFields />
        <ContactFields />

        <div className="flex justify-end">
          <Button 
            type="submit" 
            disabled={isSubmitting}
            className="bg-mansablue hover:bg-mansablue-dark"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Saving...
              </>
            ) : (
              'Save Business Profile'
            )}
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default BusinessFormContent;
