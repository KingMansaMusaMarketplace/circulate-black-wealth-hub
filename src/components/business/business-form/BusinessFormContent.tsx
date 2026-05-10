
import React, { useState } from "react";
import { Form } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Loader2, ArrowLeft, ArrowRight, Check, ImagePlus, X } from "lucide-react";
import { useBusinessForm } from "./useBusinessForm";
import BasicInfoFields from "./BasicInfoFields";
import LocationFields from "./LocationFields";
import ContactFields from "./ContactFields";
import { BusinessFormValues } from "./models";
import { useAuth } from "@/contexts/AuthContext";
import BusinessImageUpload from "@/components/business/BusinessImageUpload";
import { cn } from "@/lib/utils";

type StepKey = 1 | 2 | 3;

const STEPS: { key: StepKey; label: string; fields: (keyof BusinessFormValues)[] }[] = [
  { key: 1, label: "Basic Info", fields: ["businessName", "category", "description"] },
  { key: 2, label: "Location", fields: ["address", "city", "state", "zipCode"] },
  { key: 3, label: "Contact", fields: ["phone", "email", "website"] },
];

const BusinessFormContent = () => {
  const { user } = useAuth();
  const {
    form,
    loading,
    onSubmit,
    isSubmitting,
    profileId,
    savedProfile,
    setSavedProfile,
    hasDraft,
    restoreDraft,
    discardDraft,
  } = useBusinessForm();

  const [step, setStep] = useState<StepKey>(1);
  const [showBrandAssets, setShowBrandAssets] = useState(false);

  if (loading && !isSubmitting) {
    return (
      <div className="flex justify-center items-center py-8">
        <Loader2 className="h-8 w-8 animate-spin text-mansablue" />
        <span className="ml-2">Loading business profile...</span>
      </div>
    );
  }

  const handleNext = async () => {
    const currentStep = STEPS.find((s) => s.key === step);
    if (!currentStep) return;
    const ok = await form.trigger(currentStep.fields);
    if (ok) setStep((s) => (Math.min(3, s + 1) as StepKey));
  };

  const handleBack = () => setStep((s) => (Math.max(1, s - 1) as StepKey));

  // Show post-save success / brand assets reveal
  if (savedProfile && showBrandAssets && user?.id) {
    return (
      <div className="space-y-6 animate-fade-in">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h2 className="text-2xl font-bold text-foreground">Add your branding</h2>
            <p className="text-sm text-muted-foreground mt-1">
              Optional — upload a logo and banner now, or come back to it later.
            </p>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setShowBrandAssets(false)}
            className="shrink-0"
          >
            <X className="h-4 w-4 mr-1" />
            Skip for now
          </Button>
        </div>

        <BusinessImageUpload
          businessId={savedProfile.id!}
          ownerId={user.id}
          logoUrl={savedProfile.logo_url}
          bannerUrl={savedProfile.banner_url}
          onUpdate={(updates) =>
            setSavedProfile({ ...savedProfile, ...updates })
          }
        />

        <div className="flex justify-end gap-2 pt-4 border-t border-border/40">
          <Button
            variant="outline"
            onClick={() => setShowBrandAssets(false)}
          >
            Done
          </Button>
          <Button
            className="bg-mansablue hover:bg-mansablue-dark"
            onClick={() => { window.location.href = `/business/${savedProfile.id}`; }}
          >
            View my listing
          </Button>
        </div>
      </div>
    );
  }

  const currentStepData = STEPS.find((s) => s.key === step)!;
  const progressPct = (step / STEPS.length) * 100;

  return (
    <Form {...form}>
      {/* Draft restore banner */}
      {hasDraft && (
        <div className="mb-6 rounded-xl border-2 border-mansagold/40 bg-mansagold/5 p-4 flex items-start gap-3 animate-fade-in">
          <div className="flex-1">
            <p className="font-semibold text-foreground text-sm">
              We saved your last draft
            </p>
            <p className="text-xs text-muted-foreground mt-1">
              Pick up where you left off, or start fresh.
            </p>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <Button size="sm" variant="outline" onClick={discardDraft}>
              Discard
            </Button>
            <Button
              size="sm"
              onClick={restoreDraft}
              className="bg-mansagold hover:bg-mansagold/90 text-mansablue font-semibold"
            >
              Restore
            </Button>
          </div>
        </div>
      )}

      {/* Stepper */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-3">
          {STEPS.map((s, idx) => {
            const completed = step > s.key;
            const active = step === s.key;
            return (
              <React.Fragment key={s.key}>
                <button
                  type="button"
                  onClick={() => {
                    // Allow jumping back, but only forward via Next (validation)
                    if (s.key < step) setStep(s.key);
                  }}
                  className={cn(
                    "flex items-center gap-2 transition-all",
                    s.key < step && "cursor-pointer hover:opacity-80",
                    s.key > step && "cursor-not-allowed opacity-60"
                  )}
                  disabled={s.key > step}
                >
                  <div
                    className={cn(
                      "w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-all",
                      active && "bg-mansagold text-mansablue ring-4 ring-mansagold/30",
                      completed && "bg-mansablue text-white",
                      !active && !completed && "bg-muted text-muted-foreground"
                    )}
                  >
                    {completed ? <Check className="h-4 w-4" /> : s.key}
                  </div>
                  <span
                    className={cn(
                      "text-sm font-medium hidden sm:inline",
                      active ? "text-foreground" : "text-muted-foreground"
                    )}
                  >
                    {s.label}
                  </span>
                </button>
                {idx < STEPS.length - 1 && (
                  <div className="flex-1 h-0.5 bg-muted mx-2 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-mansagold transition-all duration-300"
                      style={{ width: step > s.key ? "100%" : "0%" }}
                    />
                  </div>
                )}
              </React.Fragment>
            );
          })}
        </div>
        <div className="text-xs text-muted-foreground sm:hidden text-center">
          Step {step} of {STEPS.length} — {currentStepData.label}
        </div>
        {/* Mobile-only thin bar */}
        <div className="sm:hidden mt-2 h-1 bg-muted rounded-full overflow-hidden">
          <div
            className="h-full bg-mansagold transition-all duration-300"
            style={{ width: `${progressPct}%` }}
          />
        </div>
      </div>

      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="space-y-6 pb-28 sm:pb-6"
      >
        {step === 1 && <BasicInfoFields />}
        {step === 2 && <LocationFields />}
        {step === 3 && <ContactFields />}

        {/* Sticky action bar — mobile: fixed at bottom; desktop: inline at end */}
        <div
          className={cn(
            "flex items-center justify-between gap-3",
            "sm:relative sm:bg-transparent sm:border-0 sm:p-0",
            "fixed bottom-0 left-0 right-0 z-40 bg-card/95 backdrop-blur-md border-t border-border p-4",
            "pb-[max(1rem,env(safe-area-inset-bottom))]"
          )}
        >
          {step > 1 ? (
            <Button
              type="button"
              variant="outline"
              onClick={handleBack}
              disabled={isSubmitting}
              className="flex-1 sm:flex-none"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back
            </Button>
          ) : (
            <div className="hidden sm:block" />
          )}

          {step < 3 ? (
            <Button
              type="button"
              onClick={handleNext}
              className="flex-1 sm:flex-none bg-mansablue hover:bg-mansablue-dark"
            >
              Next
              <ArrowRight className="h-4 w-4 ml-2" />
            </Button>
          ) : (
            <div className="flex items-center gap-2 flex-1 sm:flex-none justify-end">
              {savedProfile && (
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setShowBrandAssets(true)}
                  className="hidden sm:inline-flex"
                >
                  <ImagePlus className="h-4 w-4 mr-2" />
                  Add branding
                </Button>
              )}
              <Button
                type="submit"
                disabled={isSubmitting}
                className="flex-1 sm:flex-none bg-mansablue hover:bg-mansablue-dark"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Saving...
                  </>
                ) : profileId ? (
                  "Update Profile"
                ) : (
                  "Save Business Profile"
                )}
              </Button>
            </div>
          )}
        </div>

        {/* Post-save inline CTA to add brand assets */}
        {step === 3 && savedProfile && !showBrandAssets && (
          <div className="rounded-xl border-2 border-dashed border-mansagold/40 bg-mansagold/5 p-4 flex items-center gap-3 mt-2">
            <ImagePlus className="h-5 w-5 text-mansagold shrink-0" />
            <div className="flex-1 text-sm">
              <p className="font-semibold text-foreground">
                Want to stand out? Add a logo and banner.
              </p>
              <p className="text-xs text-muted-foreground">
                Optional — listings with branding get more clicks.
              </p>
            </div>
            <Button
              type="button"
              size="sm"
              variant="outline"
              onClick={() => setShowBrandAssets(true)}
            >
              Add now
            </Button>
          </div>
        )}
      </form>
    </Form>
  );
};

export default BusinessFormContent;
