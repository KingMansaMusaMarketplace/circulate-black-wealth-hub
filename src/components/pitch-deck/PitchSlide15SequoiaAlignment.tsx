import React from 'react';
import neuralBrainLogo from '@/assets/1325-neural-brain-logo.jpeg';

const PitchSlide15Contact: React.FC = () => {
  const highlights = [
    '$1.6T market',
    '27 patent claims',
    '8 revenue streams',
    '0 direct competitors',
    'Live production platform',
  ];

  return (
    <div
      style={{
        height: '100%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '48px 64px',
      }}
    >
      <div
        style={{
          width: '100%',
          maxWidth: '1320px',
          textAlign: 'center',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        <div
          style={{
            width: '104px',
            height: '104px',
            borderRadius: '24px',
            overflow: 'hidden',
            boxShadow: '0 18px 40px hsla(43, 100%, 50%, 0.18)',
            marginBottom: '28px',
          }}
        >
          <img
            src={neuralBrainLogo}
            alt="1325.AI Neural Brain Logo"
            style={{ width: '100%', height: '100%', objectFit: 'contain', display: 'block' }}
          />
        </div>

        <h2
          style={{
            fontSize: '76px',
            lineHeight: 1.02,
            fontWeight: 900,
            color: 'hsl(0 0% 100%)',
            margin: '0 0 20px 0',
          }}
        >
          Let's Build the <span style={{ color: 'hsl(43 100% 50%)' }}>Future</span>
        </h2>

        <p
          style={{
            fontSize: '29px',
            lineHeight: 1.4,
            color: 'hsl(0 0% 100% / 0.76)',
            margin: '0 0 34px 0',
            maxWidth: '1020px',
          }}
        >
          The economic operating system for the Black economy is live, patented, and ready to scale.
        </p>

        <div
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            justifyContent: 'center',
            gap: '14px',
            marginBottom: '40px',
            maxWidth: '1160px',
          }}
        >
          {highlights.map((item) => (
            <div
              key={item}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '12px',
                padding: '14px 22px',
                borderRadius: '999px',
                backgroundColor: 'hsl(210 31% 28% / 0.95)',
                border: '1px solid hsl(0 0% 100% / 0.14)',
                color: 'hsl(0 0% 100%)',
                fontSize: '18px',
                fontWeight: 700,
                lineHeight: 1,
              }}
            >
              <span style={{ color: 'hsl(146 45% 56%)', fontSize: '20px', lineHeight: 1 }}>✓</span>
              <span>{item}</span>
            </div>
          ))}
        </div>

        <div
          style={{
            width: '620px',
            padding: '36px 34px 28px',
            borderRadius: '18px',
            border: '2px solid hsl(43 100% 50%)',
            backgroundColor: 'hsl(223 100% 3% / 0.98)',
            boxShadow: '0 24px 60px hsla(223, 100%, 3%, 0.55)',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <div
            style={{
              fontSize: '34px',
              fontWeight: 800,
              lineHeight: 1.2,
              color: 'hsl(0 0% 100%)',
              marginBottom: '12px',
            }}
          >
            Thomas D. Bowling
          </div>

          <div
            style={{
              fontSize: '20px',
              fontWeight: 700,
              letterSpacing: '0.02em',
              color: 'hsl(43 100% 50%)',
              marginBottom: '26px',
            }}
          >
            Founder &amp; CEO, 1325.AI
          </div>

          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '12px',
              backgroundColor: 'hsl(43 100% 50%)',
              color: 'hsl(210 100% 13%)',
              fontWeight: 900,
              fontSize: '22px',
              lineHeight: 1,
              padding: '18px 28px',
              borderRadius: '14px',
              marginBottom: '22px',
              minWidth: '360px',
            }}
          >
            <span style={{ fontSize: '22px', lineHeight: 1 }}>✉</span>
            <span>Thomas@1325.AI</span>
            <span style={{ fontSize: '22px', lineHeight: 1 }}>→</span>
          </div>

          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              fontSize: '18px',
              fontWeight: 600,
              color: 'hsl(0 0% 100% / 0.78)',
            }}
          >
            <span style={{ lineHeight: 1 }}>🌐</span>
            <span>1325.AI</span>
          </div>
        </div>

        <div
          style={{
            marginTop: '28px',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '10px',
            color: 'hsl(0 0% 100% / 0.42)',
            fontSize: '18px',
            fontWeight: 500,
          }}
        >
          <span style={{ lineHeight: 1 }}>✦</span>
          <span>Confidential — For Investor Use Only</span>
        </div>
      </div>
    </div>
  );
};

export default PitchSlide15Contact;
