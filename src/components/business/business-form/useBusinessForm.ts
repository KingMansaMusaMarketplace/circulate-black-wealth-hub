
import { useState, useEffect, useRef } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { useAuth } from "@/contexts/AuthContext";
import { businessFormSchema, BusinessFormValues, defaultFormValues } from "./models";
import { saveBusinessProfile, fetchBusinessProfile, BusinessProfile } from "@/lib/api/business-api";
import { supabase } from "@/integrations/supabase/client";

const draftKey = (userId: string) => `business-form-draft:${userId}`;

const isMeaningfulDraft = (v: Partial<BusinessFormValues>) =>
  !!(v && (v.businessName || v.description || v.category || v.address || v.city));

export const useBusinessForm = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [profileId, setProfileId] = useState<string | undefined>(undefined);
  const [savedProfile, setSavedProfile] = useState<BusinessProfile | null>(null);
  const [hasDraft, setHasDraft] = useState(false);
  const draftRestorableRef = useRef<Partial<BusinessFormValues> | null>(null);
  const skipAutosaveRef = useRef(true);

  const form = useForm<BusinessFormValues>({
    resolver: zodResolver(businessFormSchema),
    defaultValues: defaultFormValues,
  });

  // Load existing profile or detect draft on mount
  useEffect(() => {
    const loadBusinessProfile = async () => {
      if (!user?.id) return;

      setLoading(true);
      try {
        const profile = await fetchBusinessProfile(user.id);
        if (profile) {
          setProfileId(profile.id);
          setSavedProfile(profile);
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
          // Profile exists — drop any stale draft
          try { localStorage.removeItem(draftKey(user.id)); } catch {}
        } else {
          // No server profile — check for a saved draft
          try {
            const raw = localStorage.getItem(draftKey(user.id));
            if (raw) {
              const parsed = JSON.parse(raw) as Partial<BusinessFormValues>;
              if (isMeaningfulDraft(parsed)) {
                draftRestorableRef.current = parsed;
                setHasDraft(true);
              }
            }
          } catch {}
        }
      } catch (error) {
        console.error("Error loading business profile:", error);
      } finally {
        setLoading(false);
        // Allow autosave only after initial load completes
        setTimeout(() => { skipAutosaveRef.current = false; }, 50);
      }
    };

    loadBusinessProfile();
  }, [user?.id, form]);

  // Debounced autosave to localStorage
  useEffect(() => {
    if (!user?.id) return;
    let timer: ReturnType<typeof setTimeout> | null = null;
    const sub = form.watch((values) => {
      if (skipAutosaveRef.current) return;
      if (savedProfile) return; // Don't draft after profile exists
      if (timer) clearTimeout(timer);
      timer = setTimeout(() => {
        try {
          if (isMeaningfulDraft(values as Partial<BusinessFormValues>)) {
            localStorage.setItem(draftKey(user.id), JSON.stringify(values));
          }
        } catch {}
      }, 800);
    });
    return () => {
      if (timer) clearTimeout(timer);
      sub.unsubscribe();
    };
  }, [user?.id, form, savedProfile]);

  const restoreDraft = () => {
    if (!draftRestorableRef.current) return;
    form.reset({ ...defaultFormValues, ...draftRestorableRef.current });
    setHasDraft(false);
    toast.success("Draft restored — pick up where you left off.");
  };

  const discardDraft = () => {
    if (user?.id) {
      try { localStorage.removeItem(draftKey(user.id)); } catch {}
    }
    draftRestorableRef.current = null;
    setHasDraft(false);
  };

  const sendBusinessLiveEmail = async (profile: BusinessProfile) => {
    if (!profile?.email || !profile?.id) return;
    try {
      await supabase.functions.invoke("send-transactional-email", {
        body: {
          templateName: "business-live-confirmation",
          recipientEmail: profile.email,
          idempotencyKey: `business-live-${profile.id}`,
          templateData: {
            businessName: profile.business_name,
            category: profile.category,
            listingUrl: `${window.location.origin}/business/${profile.id}`,
          },
        },
      });
    } catch (e) {
      console.warn("Business-live email send failed (non-blocking):", e);
    }
  };

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

      const isFirstSave = !profileId;
      const result = await saveBusinessProfile(profileData);
      if (result.success && result.data?.id) {
        setProfileId(result.data.id);
        setSavedProfile(result.data);
        // Clear draft on successful save
        try { localStorage.removeItem(draftKey(user.id)); } catch {}

        toast.success("Business profile saved successfully!", {
          description: "Your listing is now live on the directory.",
          action: {
            label: "View in directory",
            onClick: () => { window.location.href = `/directory`; },
          },
          duration: 8000,
        });

        // Fire-and-forget confirmation email on first save only
        if (isFirstSave) {
          void sendBusinessLiveEmail(result.data);
        }
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
    profileId,
    savedProfile,
    setSavedProfile,
    hasDraft,
    restoreDraft,
    discardDraft,
  };
};
