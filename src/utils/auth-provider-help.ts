
export const getProviderSetupUrl = (provider: string): string => {
  const projectId = 'agoclnqfyinwjxdmjnns';
  return `https://supabase.com/dashboard/project/${projectId}/auth/providers`;
};

export const getProviderSetupInstructions = (provider: string): string => {
  switch (provider) {
    case 'google':
      return 'To enable Google authentication, you need to create OAuth credentials in the Google Cloud Console and add them to Supabase. Make sure your Client IDs do not contain spaces.';
    case 'facebook':
      return 'To enable Facebook authentication, you need to create an app in the Facebook Developer Portal and add the credentials to Supabase.';
    case 'github':
      return 'To enable GitHub authentication, you need to create an OAuth app in GitHub and add the credentials to Supabase.';
    default:
      return 'To enable this authentication provider, please configure it in your Supabase project settings.';
  }
};
