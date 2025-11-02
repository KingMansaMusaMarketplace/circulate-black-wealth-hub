import { useSearchParams } from 'react-router-dom';

export const useScreenshotMode = () => {
  const [searchParams] = useSearchParams();
  return searchParams.get('screenshot') === 'true';
};
