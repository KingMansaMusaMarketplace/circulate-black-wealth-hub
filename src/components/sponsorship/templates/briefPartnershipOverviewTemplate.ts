export const getBriefPartnershipOverviewContent = (): string => {
  return `
    <div style="font-family: Arial, sans-serif; max-width: 700px; margin: 0 auto; padding: 30px; color: #000000; line-height: 1.6;">
      <!-- Header -->
      <div style="text-align: center; margin-bottom: 25px; border-bottom: 3px solid #000000; padding-bottom: 20px;">
        <h1 style="color: #000000; font-size: 28px; margin-bottom: 5px; font-weight: bold;">Partnership Overview</h1>
        <h2 style="color: #000000; font-size: 20px; margin-bottom: 10px; font-weight: bold;">Mansa Musa Marketplace</h2>
        <p style="font-size: 15px; color: #000000; margin: 0;">Building the Black Economic Ecosystem</p>
      </div>

      <!-- Mission & Impact -->
      <div style="margin-bottom: 25px;">
        <h3 style="color: #000000; font-size: 18px; margin-bottom: 10px; font-weight: bold;">Our Mission & Your Impact</h3>
        <p style="font-size: 15px; margin-bottom: 10px; color: #000000; line-height: 1.7;">Mansa Musa Marketplace builds, protects, and expands the Black economic ecosystem through intentional consumer behavior and strategic digital infrastructure. <strong>Your partnership directly supports Black-owned businesses and creates sustainable economic opportunities in underserved communities.</strong></p>
      </div>

      <!-- Partnership Tiers -->
      <div style="margin-bottom: 25px;">
        <h3 style="color: #000000; font-size: 18px; margin-bottom: 15px; font-weight: bold;">Partnership Opportunities</h3>
        
        <div style="display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 15px;">
          <div style="padding: 15px; border: 1px solid #d1d5db; border-radius: 6px; text-align: center;">
            <h4 style="color: #000000; margin-bottom: 8px; font-size: 16px; font-weight: bold;">Bronze</h4>
            <p style="font-weight: bold; margin-bottom: 8px; font-size: 15px; color: #000000;">$5,000/year</p>
            <ul style="font-size: 13px; margin: 0; padding-left: 15px; text-align: left; color: #000000; line-height: 1.6;">
              <li>Website footer logo</li>
              <li>Quarterly newsletter</li>
              <li>Community metrics</li>
              <li>Partnership certificate</li>
            </ul>
          </div>

          <div style="padding: 15px; border: 2px solid #000000; border-radius: 6px; text-align: center; background-color: #f5f5f5;">
            <h4 style="color: #000000; margin-bottom: 8px; font-size: 16px; font-weight: bold;">Silver ★</h4>
            <p style="font-weight: bold; margin-bottom: 8px; font-size: 15px; color: #000000;">$15,000/year</p>
            <ul style="font-size: 13px; margin: 0; padding-left: 15px; text-align: left; color: #000000; line-height: 1.6;">
              <li>Homepage logo</li>
              <li>Monthly newsletter feature</li>
              <li>Sponsored content</li>
              <li>Detailed analytics</li>
              <li>Account manager</li>
            </ul>
          </div>

          <div style="padding: 15px; border: 1px solid #d1d5db; border-radius: 6px; text-align: center;">
            <h4 style="color: #000000; margin-bottom: 8px; font-size: 16px; font-weight: bold;">Gold</h4>
            <p style="font-weight: bold; margin-bottom: 8px; font-size: 15px; color: #000000;">$35,000/year</p>
            <ul style="font-size: 13px; margin: 0; padding-left: 15px; text-align: left; color: #000000; line-height: 1.6;">
              <li>Prominent logo placement</li>
              <li>Co-branded content</li>
              <li>Event sponsorship</li>
              <li>Custom benefits</li>
              <li>Executive meetings</li>
            </ul>
          </div>
        </div>
      </div>

      <!-- Key Benefits -->
      <div style="margin-bottom: 25px;">
        <h3 style="color: #000000; font-size: 18px; margin-bottom: 10px; font-weight: bold;">Why Partner With Us?</h3>
        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 15px;">
          <div style="font-size: 14px;">
            <h4 style="color: #000000; margin-bottom: 5px; font-size: 15px; font-weight: bold;">Brand Alignment</h4>
            <p style="margin: 0; color: #000000; line-height: 1.6;">Authentic community engagement and meaningful social impact alignment.</p>
          </div>
          <div style="font-size: 14px;">
            <h4 style="color: #000000; margin-bottom: 5px; font-size: 15px; font-weight: bold;">Economic Impact</h4>
            <p style="margin: 0; color: #000000; line-height: 1.6;">Direct support for Black business growth and community wealth building.</p>
          </div>
        </div>
      </div>

      <!-- Contact & CTA -->
      <div style="text-align: center; padding: 18px; background-color: #1a1a1a; color: white; border-radius: 6px;">
        <h3 style="margin-bottom: 8px; font-size: 18px; font-weight: bold;">Ready to Make an Impact?</h3>
        <p style="margin-bottom: 12px; font-size: 15px;">Join us in building economic empowerment for Black communities</p>
        <div style="font-size: 14px;">
          <p style="margin: 5px 0;"><strong>Email:</strong> contact@mansamusamarketplace.com</p>
          <p style="margin: 5px 0;"><strong>Phone:</strong> 312.709.6006</p>
        </div>
      </div>

      <!-- Footer -->
      <div style="text-align: center; margin-top: 20px; font-size: 13px; color: #000000;">
        <p>© 2024 Mansa Musa Marketplace • www.mansamusamarketplace.com</p>
      </div>
    </div>
  `;
};
