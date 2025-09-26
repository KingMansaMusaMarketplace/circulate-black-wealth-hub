export const getBriefPartnershipOverviewContent = (): string => {
  return `
    <div style="font-family: Arial, sans-serif; max-width: 700px; margin: 0 auto; padding: 30px; color: #333; line-height: 1.5;">
      <!-- Header -->
      <div style="text-align: center; margin-bottom: 25px; border-bottom: 3px solid #f59e0b; padding-bottom: 20px;">
        <h1 style="color: #1e40af; font-size: 28px; margin-bottom: 5px;">Partnership Overview</h1>
        <h2 style="color: #f59e0b; font-size: 20px; margin-bottom: 10px;">Mansa Musa Marketplace</h2>
        <p style="font-size: 14px; color: #666; margin: 0;">Building the Black Economic Ecosystem</p>
      </div>

      <!-- Mission & Impact -->
      <div style="margin-bottom: 25px;">
        <h3 style="color: #1e40af; font-size: 16px; margin-bottom: 10px;">Our Mission & Your Impact</h3>
        <p style="font-size: 13px; margin-bottom: 10px;">Mansa Musa Marketplace builds, protects, and expands the Black economic ecosystem through intentional consumer behavior and strategic digital infrastructure. <strong>Your partnership directly supports Black-owned businesses and creates sustainable economic opportunities in underserved communities.</strong></p>
      </div>

      <!-- Partnership Tiers -->
      <div style="margin-bottom: 25px;">
        <h3 style="color: #1e40af; font-size: 16px; margin-bottom: 15px;">Partnership Opportunities</h3>
        
        <div style="display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 15px;">
          <div style="padding: 12px; border: 1px solid #e5e7eb; border-radius: 6px; text-align: center;">
            <h4 style="color: #f59e0b; margin-bottom: 8px; font-size: 14px;">Bronze</h4>
            <p style="font-weight: bold; margin-bottom: 5px; font-size: 13px;">$5,000/year</p>
            <ul style="font-size: 11px; margin: 0; padding-left: 15px; text-align: left;">
              <li>Website footer logo</li>
              <li>Quarterly newsletter</li>
              <li>Community metrics</li>
              <li>Partnership certificate</li>
            </ul>
          </div>

          <div style="padding: 12px; border: 2px solid #f59e0b; border-radius: 6px; text-align: center; background-color: #fef3c7;">
            <h4 style="color: #f59e0b; margin-bottom: 8px; font-size: 14px;">Silver ★</h4>
            <p style="font-weight: bold; margin-bottom: 5px; font-size: 13px;">$15,000/year</p>
            <ul style="font-size: 11px; margin: 0; padding-left: 15px; text-align: left;">
              <li>Homepage logo</li>
              <li>Monthly newsletter feature</li>
              <li>Sponsored content</li>
              <li>Detailed analytics</li>
              <li>Account manager</li>
            </ul>
          </div>

          <div style="padding: 12px; border: 1px solid #e5e7eb; border-radius: 6px; text-align: center;">
            <h4 style="color: #f59e0b; margin-bottom: 8px; font-size: 14px;">Gold</h4>
            <p style="font-weight: bold; margin-bottom: 5px; font-size: 13px;">$35,000/year</p>
            <ul style="font-size: 11px; margin: 0; padding-left: 15px; text-align: left;">
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
        <h3 style="color: #1e40af; font-size: 16px; margin-bottom: 10px;">Why Partner With Us?</h3>
        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 15px;">
          <div style="font-size: 12px;">
            <h4 style="color: #f59e0b; margin-bottom: 5px;">Brand Alignment</h4>
            <p style="margin: 0;">Authentic community engagement and meaningful social impact alignment.</p>
          </div>
          <div style="font-size: 12px;">
            <h4 style="color: #f59e0b; margin-bottom: 5px;">Economic Impact</h4>
            <p style="margin: 0;">Direct support for Black business growth and community wealth building.</p>
          </div>
        </div>
      </div>

      <!-- Contact & CTA -->
      <div style="text-align: center; padding: 15px; background-color: #1e40af; color: white; border-radius: 6px;">
        <h3 style="margin-bottom: 8px; font-size: 16px;">Ready to Make an Impact?</h3>
        <p style="margin-bottom: 10px; font-size: 13px;">Join us in building economic empowerment for Black communities</p>
        <div style="font-size: 12px;">
          <p style="margin: 3px 0;"><strong>Email:</strong> contact@mansamusamarketplace.com</p>
          <p style="margin: 3px 0;"><strong>Phone:</strong> 312.709.6006</p>
        </div>
      </div>

      <!-- Footer -->
      <div style="text-align: center; margin-top: 20px; font-size: 11px; color: #666;">
        <p>© 2024 Mansa Musa Marketplace • www.mansamusamarketplace.com</p>
      </div>
    </div>
  `;
};