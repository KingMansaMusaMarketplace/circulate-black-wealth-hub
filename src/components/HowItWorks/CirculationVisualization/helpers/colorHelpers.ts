
type HighlightColor = 'text-mansagold' | 'text-mansablue' | '';

export const getHighlightColor = (step: number): HighlightColor => {
  switch (step) {
    case 0: return 'text-mansagold';
    case 1: return 'text-mansablue';
    case 2: return 'text-mansagold';
    case 3: return 'text-mansablue';
    default: return '';
  }
};

export default getHighlightColor;
