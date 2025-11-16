
import React from 'react';
import { Form } from '@/components/ui/form';
import { LogIn } from 'lucide-react';
import { Separator } from '@/components/ui/separator';
import { SubmitButton } from './forms/SubmitButton';
import { sanitizeInput } from '@/lib/security/input-sanitizer';

// Import refactored components
import { EmailField } from './login/EmailField';
import { PasswordField } from './login/PasswordField';
import { RememberMeField } from './login/RememberMeField';
import { BenefitsSection } from './login/BenefitsSection';
import { FooterSection } from './login/FooterSection';
import { MFAHandler } from './login/MFAHandler';
import { useLoginForm } from './login/useLoginForm';

interface LoginFormProps {
  onSubmit: (email: string, password: string) => Promise<any>;
}

const LoginForm: React.FC<LoginFormProps> = ({ onSubmit }) => {
  const {
    form,
    isSubmitting,
    showMFAVerification,
    mfaData,
    handleFormSubmit,
    handleMFACancel
  } = useLoginForm({ onSubmit });

  // Render MFA component if needed
  if (showMFAVerification && mfaData) {
    return (
      <MFAHandler
        mfaData={mfaData}
        showMFAVerification={showMFAVerification}
        onCancel={handleMFACancel}
      />
    );
  }

  return (
    <div className="space-y-6">
      <BenefitsSection />

      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleFormSubmit)} className="space-y-4">
          <EmailField form={form} />
          <PasswordField form={form} />
          <RememberMeField form={form} />

          <SubmitButton 
            loading={isSubmitting}
            text="Sign In"
            loadingText="Signing in..."
            className="w-full bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 hover:from-blue-700 hover:via-purple-700 hover:to-pink-700 text-white font-bold py-6 text-lg shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-[1.02] mt-2"
            icon={<LogIn className="h-5 w-5" />}
          />
          
          <Separator className="my-4" />
          
          <FooterSection />
        </form>
      </Form>
    </div>
  );
};

export default LoginForm;
