
import { toast } from 'sonner';

export const handleSocialClick = (url: string | undefined, platform: string) => {
  if (!url) {
    toast.info(`This team member doesn't have a ${platform} account linked yet.`);
    return;
  }
  
  // For demonstration purposes, if the URL is just '#', show a toast
  if (url === '#') {
    toast.info(`${platform} integration coming soon!`);
    return;
  }
  
  window.open(url, '_blank');
};

export const handleSendEmail = (email: string | undefined) => {
  if (!email) {
    toast.info("Email address not available yet.");
    return;
  }
  
  // If the email is just a placeholder, show a message
  if (email.includes('mansamusamarketplace.com')) {
    window.location.href = `mailto:${email}`;
  } else {
    toast.info("This is a demo email address. Real email integration coming soon!");
  }
};
