import { useCountUp } from '@/hooks/useCountUp';

interface CountUpNumberProps {
  end: number;
  duration?: number;
  suffix?: string;
  prefix?: string;
  className?: string;
}

const CountUpNumber = ({ 
  end, 
  duration = 2000, 
  suffix = '', 
  prefix = '',
  className = ''
}: CountUpNumberProps) => {
  const { count, ref } = useCountUp({ end, duration });

  return (
    <span ref={ref} className={className}>
      {prefix}{count.toLocaleString()}{suffix}
    </span>
  );
};

export default CountUpNumber;
