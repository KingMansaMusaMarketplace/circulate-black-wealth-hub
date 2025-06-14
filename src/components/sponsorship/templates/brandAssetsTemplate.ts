
export const getBrandAssetsContent = (): string => {
  return `
    <div style="font-family: Arial, sans-serif; max-width: 800px; margin: 0 auto; padding: 40px; color: #333;">
      <div style="text-align: center; margin-bottom: 40px;">
        <h1 style="color: #1e40af; font-size: 36px; margin-bottom: 10px;">Brand Assets Package</h1>
        <h2 style="color: #f59e0b; font-size: 24px; margin-bottom: 20px;">Mansa Musa Marketplace</h2>
        <p style="font-size: 18px; color: #666;">Logo Files, Brand Guidelines & Co-Marketing Materials</p>
      </div>

      <div style="margin-bottom: 30px;">
        <h3 style="color: #1e40af; font-size: 20px; margin-bottom: 15px;">Brand Colors</h3>
        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 20px;">
          <div style="padding: 20px; background-color: #1e40af; color: white; border-radius: 8px; text-align: center;">
            <h4 style="margin: 0;">Mansa Blue</h4>
            <p style="margin: 5px 0; font-size: 14px;">#1e40af</p>
            <p style="margin: 5px 0; font-size: 14px;">RGB(30, 64, 175)</p>
          </div>
          <div style="padding: 20px; background-color: #f59e0b; color: white; border-radius: 8px; text-align: center;">
            <h4 style="margin: 0;">Mansa Gold</h4>
            <p style="margin: 5px 0; font-size: 14px;">#f59e0b</p>
            <p style="margin: 5px 0; font-size: 14px;">RGB(245, 158, 11)</p>
          </div>
        </div>
      </div>

      <div style="text-align: center; margin-top: 40px; padding: 20px; background-color: #1e40af; color: white; border-radius: 8px;">
        <h3 style="margin-bottom: 10px;">Need Brand Assets?</h3>
        <p style="margin-bottom: 15px;">Contact our partnership team for complete brand package</p>
        <p><strong>Email:</strong> contact@mansamusamarketplace.com</p>
        <p><strong>Phone:</strong> 312.709.6006</p>
      </div>
    </div>
  `;
};
