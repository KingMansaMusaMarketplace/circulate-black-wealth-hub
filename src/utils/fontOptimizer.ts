
// Font optimization utilities
export const preloadGoogleFonts = () => {
  const fonts = [
    'https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap',
    'https://fonts.googleapis.com/css2?family=Montserrat:wght@400;500;600;700&display=swap',
    'https://fonts.googleapis.com/css2?family=League+Spartan:wght@400;500;600;700&display=swap'
  ];

  fonts.forEach(fontUrl => {
    const link = document.createElement('link');
    link.rel = 'preload';
    link.as = 'style';
    link.href = fontUrl;
    document.head.appendChild(link);
    
    // Then load the actual stylesheet
    setTimeout(() => {
      const styleLink = document.createElement('link');
      styleLink.rel = 'stylesheet';
      styleLink.href = fontUrl;
      document.head.appendChild(styleLink);
    }, 100);
  });
};

export const optimizeFontDisplay = () => {
  const style = document.createElement('style');
  style.textContent = `
    @font-face {
      font-family: 'Inter';
      font-display: swap;
    }
    @font-face {
      font-family: 'Montserrat'; 
      font-display: swap;
    }
    @font-face {
      font-family: 'League Spartan';
      font-display: swap;
    }
  `;
  document.head.appendChild(style);
};

// Preload critical CSS
export const inlineCriticalCSS = () => {
  const criticalCSS = `
    .mansablue { color: #0F2876; }
    .mansagold { color: #DBA53A; }
    .hero-gradient { background: linear-gradient(135deg, #0F2876 0%, #19A7CE 100%); }
    .loading-skeleton { background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%); background-size: 200% 100%; animation: loading 1.5s infinite; }
    @keyframes loading { 0% { background-position: 200% 0; } 100% { background-position: -200% 0; } }
  `;
  
  const style = document.createElement('style');
  style.textContent = criticalCSS;
  document.head.insertBefore(style, document.head.firstChild);
};
