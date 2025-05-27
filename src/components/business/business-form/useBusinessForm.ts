
import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { useAuth } from "@/contexts/auth";
import { businessFormSchema, BusinessFormValues, defaultFormValues } from "./models";
import { saveBusinessProfile, fetchBusinessProfile, BusinessProfile } from "@/lib/api/business-api";

export const useBusinessForm = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [profileId, setProfileId] = useState<string | undefined>(undefined);
  
  const form = useForm<BusinessFormValues>({
    resolver: zodResolver(businessFormSchema),
    defaultValues: defaultFormValues,
  });

  // Fetch business profile on component mount
  useEffect(() => {
    const loadBusinessProfile = async () => {
      if (!user?.id) return;
      
      setLoading(true);
      try {
        const profile = await fetchBusinessProfile(user.id);
        if (profile) {
          setProfileId(profile.id);
          form.reset({
            businessName: profile.business_name,
            description: profile.description,
            category: profile.category,
            address: profile.address,
            city: profile.city,
            state: profile.state,
            zipCode: profile.zip_code,
            phone: profile.phone,
            email: profile.email,
            website: profile.website || "",
          });
        }
      } catch (error) {
        console.error("Error loading business profile:", error);
      } finally {
        setLoading(false);
      }
    };

    loadBusinessProfile();
  }, [user?.id, form]);

  const onSubmit = async (values: BusinessFormValues) => {
    if (!user?.id) {
      toast.error("You must be logged in to save your business profile");
      return;
    }

    setLoading(true);
    
    try {
      const profileData: BusinessProfile = {
        id: profileId,
        owner_id: user.id,
        business_name: values.businessName,
        description: values.description,
        category: values.category,
        address: values.address,
        city: values.city,
        state: values.state,
        zip_code: values.zipCode,
        phone: values.phone,
        email: values.email,
        website: values.website || undefined,
      };

      const result = await saveBusinessProfile(profileData);
      if (result.success && result.data?.id) {
        setProfileId(result.data.id);
        toast.success("Business profile saved successfully!");
      }
    } catch (error: any) {
      console.error("Error saving business profile:", error);
      toast.error(`Failed to save: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  return {
    form,
    loading,
    onSubmit,
    isSubmitting: form.formState.isSubmitting,
  };
};
