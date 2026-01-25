
export const getBrandAssetsContent = (): string => {
  return `
    <div style="font-family: Arial, sans-serif; max-width: 800px; margin: 0 auto; padding: 40px; color: #000000;">
      <div style="text-align: center; margin-bottom: 40px;">
        <h1 style="color: #000000; font-size: 36px; margin-bottom: 10px; font-weight: bold;">Brand Assets Package</h1>
        <h2 style="color: #000000; font-size: 24px; margin-bottom: 20px; font-weight: bold;">Mansa Musa Marketplace</h2>
        <p style="font-size: 18px; color: #000000;">Logo Files, Brand Guidelines & Co-Marketing Materials</p>
      </div>

      <div style="margin-bottom: 30px;">
        <h3 style="color: #000000; font-size: 20px; margin-bottom: 15px; font-weight: bold;">Brand Colors</h3>
        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 20px;">
          <div style="padding: 20px; background-color: #1e40af; color: white; border-radius: 8px; text-align: center;">
            <h4 style="margin: 0; font-size: 18px; font-weight: bold;">Mansa Blue</h4>
            <p style="margin: 8px 0; font-size: 15px;">#1e40af</p>
            <p style="margin: 8px 0; font-size: 15px;">RGB(30, 64, 175)</p>
          </div>
          <div style="padding: 20px; background-color: #b45309; color: white; border-radius: 8px; text-align: center;">
            <h4 style="margin: 0; font-size: 18px; font-weight: bold;">Mansa Gold</h4>
            <p style="margin: 8px 0; font-size: 15px;">#b45309</p>
            <p style="margin: 8px 0; font-size: 15px;">RGB(180, 83, 9)</p>
          </div>
        </div>
      </div>

      <div style="text-align: center; margin-top: 40px; padding: 20px; background-color: #1a1a1a; color: white; border-radius: 8px;">
        <h3 style="margin-bottom: 10px; font-size: 20px; font-weight: bold;">Need Brand Assets?</h3>
        <p style="margin-bottom: 15px; font-size: 16px;">Contact our partnership team for complete brand package</p>
        <p style="font-size: 16px;"><strong>Email:</strong> Thomas@1325.AI</p>
        <p style="font-size: 16px;"><strong>Phone:</strong> 312.709.6006</p>
      </div>
    </div>
  `;
};
