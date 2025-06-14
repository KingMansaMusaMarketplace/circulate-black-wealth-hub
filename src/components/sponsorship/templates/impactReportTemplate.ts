
export const getImpactReportContent = (): string => {
  return `
    <div style="font-family: Arial, sans-serif; max-width: 800px; margin: 0 auto; padding: 40px; color: #333;">
      <div style="text-align: center; margin-bottom: 40px;">
        <h1 style="color: #1e40af; font-size: 36px; margin-bottom: 10px;">Community Impact Report</h1>
        <h2 style="color: #f59e0b; font-size: 24px; margin-bottom: 20px;">Mansa Musa Marketplace</h2>
        <p style="font-size: 18px; color: #666;">Q4 2024 Impact Metrics & Success Stories</p>
      </div>

      <div style="margin-bottom: 30px;">
        <h3 style="color: #1e40af; font-size: 20px; margin-bottom: 15px;">Key Impact Metrics</h3>
        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 20px;">
          <div style="padding: 20px; background-color: #f3f4f6; border-radius: 8px; text-align: center;">
            <h4 style="color: #1e40af; font-size: 28px; margin: 0;">$2.4M</h4>
            <p style="margin: 5px 0; font-weight: bold;">Economic Circulation</p>
            <p style="font-size: 14px; color: #666;">Total dollars circulated through Black businesses</p>
          </div>
          <div style="padding: 20px; background-color: #f3f4f6; border-radius: 8px; text-align: center;">
            <h4 style="color: #1e40af; font-size: 28px; margin: 0;">2,500+</h4>
            <p style="margin: 5px 0; font-weight: bold;">Businesses Supported</p>
            <p style="font-size: 14px; color: #666;">Black-owned businesses on our platform</p>
          </div>
        </div>
      </div>

      <div style="text-align: center; margin-top: 40px; padding: 20px; background-color: #1e40af; color: white; border-radius: 8px;">
        <h3 style="margin-bottom: 10px;">Partner With Us</h3>
        <p style="margin-bottom: 15px;">Join us in creating lasting economic impact</p>
        <p><strong>Email:</strong> contact@mansamusamarketplace.com</p>
        <p><strong>Phone:</strong> 312.709.6006</p>
      </div>
    </div>
  `;
};
