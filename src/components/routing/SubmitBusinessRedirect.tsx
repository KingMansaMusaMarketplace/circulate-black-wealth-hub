import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

/**
 * In the iPhone app the router reads "#submit-business" as a page address.
 * Send people home and open/scroll to the business submission box instead.
 */
const SubmitBusinessRedirect = () => {
  const navigate = useNavigate();
  useEffect(() => {
    navigate('/', { replace: true });
    let tries = 0;
    const t = window.setInterval(() => {
      const el = document.getElementById('submit-business');
      const btn = el?.querySelector('button') as HTMLButtonElement | null;
      if (el) {
        el.scrollIntoView({ behavior: 'smooth', block: 'start' });
        if (btn && btn.getAttribute('aria-expanded') === 'false') btn.click();
        window.clearInterval(t);
      } else if (++tries > 40) window.clearInterval(t);
    }, 150);
  }, [navigate]);
  return null;
};

export default SubmitBusinessRedirect;
