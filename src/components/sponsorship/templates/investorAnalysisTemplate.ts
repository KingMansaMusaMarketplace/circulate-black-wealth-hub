
export const getInvestorAnalysisContent = (): string => {
  const currentDate = new Date().toLocaleDateString('en-US', { 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  });

  return `
    <div style="font-family: 'Georgia', serif; max-width: 800px; margin: 0 auto; padding: 40px; color: #000000;">
      
      <!-- Cover Page -->
      <div style="text-align: center; padding: 60px 0; border-bottom: 3px solid #000000; margin-bottom: 40px;">
        <h1 style="font-size: 32px; color: #000000; margin-bottom: 10px; font-weight: bold;">
          MANSA MUSA MARKETPLACE
        </h1>
        <h2 style="font-size: 24px; color: #000000; margin-bottom: 30px; font-weight: bold;">
          Billion-Dollar Business Analysis
        </h2>
        <p style="font-size: 16px; color: #000000; margin-bottom: 5px;">Investment Opportunity Assessment</p>
        <p style="font-size: 16px; color: #000000;">${currentDate}</p>
      </div>

      <!-- Executive Summary -->
      <div style="margin-bottom: 40px;">
        <h2 style="font-size: 20px; color: #000000; border-bottom: 2px solid #000000; padding-bottom: 10px; margin-bottom: 20px; font-weight: bold;">
          EXECUTIVE SUMMARY
        </h2>
        <p style="font-size: 14px; line-height: 1.8; margin-bottom: 15px;">
          Mansa Musa Marketplace is a comprehensive digital ecosystem designed to empower Black-owned businesses 
          and strengthen economic circulation within the African American community. Named after the legendary 
          West African emperor known for his immense wealth and generosity, our platform embodies the spirit 
          of economic empowerment and community prosperity.
        </p>
        <div style="background: #f8f9fa; padding: 20px; border-left: 4px solid #000000; margin: 20px 0;">
          <h3 style="font-size: 16px; color: #000000; margin-bottom: 10px; font-weight: bold;">THE BILLION-DOLLAR VERDICT</h3>
          <p style="font-size: 14px; line-height: 1.6; margin: 0;">
            <strong>Yes, Mansa Musa Marketplace has legitimate billion-dollar potential.</strong> The platform addresses 
            a $1.6 trillion market opportunity with a unique 4-sided marketplace model, comprehensive feature set, 
            and clear path to scale. With proper execution, strategic partnerships, and continued development, 
            this platform could achieve unicorn status within 5-7 years.
          </p>
        </div>
      </div>

      <!-- Market Opportunity -->
      <div style="margin-bottom: 40px;">
        <h2 style="font-size: 20px; color: #000000; border-bottom: 2px solid #000000; padding-bottom: 10px; margin-bottom: 20px; font-weight: bold;">
          MARKET OPPORTUNITY
        </h2>
        
        <h3 style="font-size: 16px; color: #000000; margin-bottom: 15px; font-weight: bold;">Total Addressable Market</h3>
        <table style="width: 100%; border-collapse: collapse; margin-bottom: 25px;">
          <tr style="background: #000000; color: white;">
            <th style="padding: 12px; text-align: left; border: 1px solid #ddd;">Market Segment</th>
            <th style="padding: 12px; text-align: right; border: 1px solid #ddd;">Value</th>
          </tr>
          <tr>
            <td style="padding: 12px; border: 1px solid #ddd;">Black Consumer Spending Power (Annual)</td>
            <td style="padding: 12px; text-align: right; border: 1px solid #ddd; font-weight: bold;">$1.6 Trillion</td>
          </tr>
          <tr style="background: #f8f9fa;">
            <td style="padding: 12px; border: 1px solid #ddd;">Black-Owned Businesses in U.S.</td>
            <td style="padding: 12px; text-align: right; border: 1px solid #ddd;">3.1 Million</td>
          </tr>
          <tr>
            <td style="padding: 12px; border: 1px solid #ddd;">Average Annual Revenue per Black Business</td>
            <td style="padding: 12px; text-align: right; border: 1px solid #ddd;">$142,000</td>
          </tr>
          <tr style="background: #f8f9fa;">
            <td style="padding: 12px; border: 1px solid #ddd;">Projected Black Spending Power by 2030</td>
            <td style="padding: 12px; text-align: right; border: 1px solid #ddd; font-weight: bold;">$2.1 Trillion</td>
          </tr>
        </table>

        <h3 style="font-size: 16px; color: #000000; margin-bottom: 15px; font-weight: bold;">The Market Gap</h3>
        <p style="font-size: 14px; line-height: 1.8; margin-bottom: 15px;">
          Despite significant spending power, Black communities face systemic challenges:
        </p>
        <ul style="font-size: 14px; line-height: 1.8; padding-left: 25px; margin-bottom: 20px;">
          <li>Only 2% of Black consumer dollars circulate within Black communities</li>
          <li>Black-owned businesses receive less than 1% of venture capital funding</li>
          <li>Limited access to business tools, financing, and growth resources</li>
          <li>Fragmented discovery of Black-owned businesses</li>
        </ul>
      </div>

      <!-- Platform Assessment -->
      <div style="margin-bottom: 40px;">
        <h2 style="font-size: 20px; color: #000000; border-bottom: 2px solid #000000; padding-bottom: 10px; margin-bottom: 20px; font-weight: bold;">
          PLATFORM ASSESSMENT
        </h2>
        
        <h3 style="font-size: 16px; color: #000000; margin-bottom: 15px; font-weight: bold;">Technical Infrastructure</h3>
        <table style="width: 100%; border-collapse: collapse; margin-bottom: 25px;">
          <tr style="background: #000000; color: white;">
            <th style="padding: 12px; text-align: left; border: 1px solid #ddd;">Component</th>
            <th style="padding: 12px; text-align: right; border: 1px solid #ddd;">Scale</th>
          </tr>
          <tr>
            <td style="padding: 12px; border: 1px solid #ddd;">Total Application Pages/Views</td>
            <td style="padding: 12px; text-align: right; border: 1px solid #ddd; font-weight: bold;">130+</td>
          </tr>
          <tr style="background: #f8f9fa;">
            <td style="padding: 12px; border: 1px solid #ddd;">Database Tables</td>
            <td style="padding: 12px; text-align: right; border: 1px solid #ddd; font-weight: bold;">110+</td>
          </tr>
          <tr>
            <td style="padding: 12px; border: 1px solid #ddd;">Edge Functions (Backend Logic)</td>
            <td style="padding: 12px; text-align: right; border: 1px solid #ddd; font-weight: bold;">67</td>
          </tr>
          <tr style="background: #f8f9fa;">
            <td style="padding: 12px; border: 1px solid #ddd;">Revenue Streams</td>
            <td style="padding: 12px; text-align: right; border: 1px solid #ddd; font-weight: bold;">6+</td>
          </tr>
          <tr>
            <td style="padding: 12px; border: 1px solid #ddd;">Mobile App Ready</td>
            <td style="padding: 12px; text-align: right; border: 1px solid #ddd;">Yes (iOS & Android)</td>
          </tr>
        </table>

        <h3 style="font-size: 16px; color: #000000; margin-bottom: 15px; font-weight: bold;">Core Features</h3>
        <ul style="font-size: 14px; line-height: 1.8; padding-left: 25px; margin-bottom: 20px;">
          <li><strong>Business Directory:</strong> Comprehensive listings with search, filtering, and reviews</li>
          <li><strong>Loyalty Points System:</strong> Gamified engagement rewarding community participation</li>
          <li><strong>Community Savings Circles:</strong> Traditional "Susu" system digitized for group savings</li>
          <li><strong>Business Management Suite:</strong> Invoicing, expenses, inventory, customer management</li>
          <li><strong>AI Assistant (Mansa AI):</strong> Intelligent business guidance and recommendations</li>
          <li><strong>Sales Agent Network:</strong> Commission-based referral program with tiered rewards</li>
          <li><strong>Corporate Sponsorship Portal:</strong> Structured partnership opportunities</li>
          <li><strong>Event Management:</strong> Community events and networking features</li>
        </ul>
      </div>

      <!-- Competitive Advantages -->
      <div style="margin-bottom: 40px;">
        <h2 style="font-size: 20px; color: #000000; border-bottom: 2px solid #000000; padding-bottom: 10px; margin-bottom: 20px; font-weight: bold;">
          COMPETITIVE ADVANTAGES
        </h2>
        
        <div style="display: grid; gap: 15px;">
          <div style="background: #f8f9fa; padding: 15px; border-radius: 8px;">
            <h4 style="color: #000000; margin-bottom: 8px; font-weight: bold;">1. Four-Sided Marketplace Model</h4>
            <p style="font-size: 14px; margin: 0;">Connects consumers, businesses, corporate sponsors, and sales agents in a unified ecosystem with network effects.</p>
          </div>
          <div style="background: #f8f9fa; padding: 15px; border-radius: 8px;">
            <h4 style="color: #000000; margin-bottom: 8px; font-weight: bold;">2. Community Finance Innovation</h4>
            <p style="font-size: 14px; margin: 0;">Digital savings circles (Susu) tap into trusted cultural practices, creating sticky engagement and financial inclusion.</p>
          </div>
          <div style="background: #f8f9fa; padding: 15px; border-radius: 8px;">
            <h4 style="color: #000000; margin-bottom: 8px; font-weight: bold;">3. Comprehensive Business Tools</h4>
            <p style="font-size: 14px; margin: 0;">Full-stack business management reduces need for multiple subscriptions, increasing platform stickiness.</p>
          </div>
          <div style="background: #f8f9fa; padding: 15px; border-radius: 8px;">
            <h4 style="color: #000000; margin-bottom: 8px; font-weight: bold;">4. AI-Powered Intelligence</h4>
            <p style="font-size: 14px; margin: 0;">Mansa AI provides personalized recommendations, business insights, and automated assistance.</p>
          </div>
          <div style="background: #f8f9fa; padding: 15px; border-radius: 8px;">
            <h4 style="color: #000000; margin-bottom: 8px; font-weight: bold;">5. Mobile-First Architecture</h4>
            <p style="font-size: 14px; margin: 0;">Native iOS and Android apps ensure accessibility for the 85%+ of Black Americans who are smartphone users.</p>
          </div>
        </div>
      </div>

      <!-- Revenue Model -->
      <div style="margin-bottom: 40px;">
        <h2 style="font-size: 20px; color: #000000; border-bottom: 2px solid #000000; padding-bottom: 10px; margin-bottom: 20px; font-weight: bold;">
          REVENUE MODEL
        </h2>
        
        <table style="width: 100%; border-collapse: collapse; margin-bottom: 25px;">
          <tr style="background: #000000; color: white;">
            <th style="padding: 12px; text-align: left; border: 1px solid #ddd;">Revenue Stream</th>
            <th style="padding: 12px; text-align: left; border: 1px solid #ddd;">Model</th>
            <th style="padding: 12px; text-align: right; border: 1px solid #ddd;">Potential</th>
          </tr>
          <tr>
            <td style="padding: 12px; border: 1px solid #ddd;">Business Subscriptions</td>
            <td style="padding: 12px; border: 1px solid #ddd;">$29-199/month tiers</td>
            <td style="padding: 12px; text-align: right; border: 1px solid #ddd;">High</td>
          </tr>
          <tr style="background: #f8f9fa;">
            <td style="padding: 12px; border: 1px solid #ddd;">Corporate Sponsorships</td>
            <td style="padding: 12px; border: 1px solid #ddd;">$5K-100K+ packages</td>
            <td style="padding: 12px; text-align: right; border: 1px solid #ddd;">Very High</td>
          </tr>
          <tr>
            <td style="padding: 12px; border: 1px solid #ddd;">Transaction Fees</td>
            <td style="padding: 12px; border: 1px solid #ddd;">2-3% on bookings</td>
            <td style="padding: 12px; text-align: right; border: 1px solid #ddd;">High</td>
          </tr>
          <tr style="background: #f8f9fa;">
            <td style="padding: 12px; border: 1px solid #ddd;">Savings Circle Fees</td>
            <td style="padding: 12px; border: 1px solid #ddd;">1-2% management fee</td>
            <td style="padding: 12px; text-align: right; border: 1px solid #ddd;">Medium</td>
          </tr>
          <tr>
            <td style="padding: 12px; border: 1px solid #ddd;">Premium Features</td>
            <td style="padding: 12px; border: 1px solid #ddd;">AI, analytics, tools</td>
            <td style="padding: 12px; text-align: right; border: 1px solid #ddd;">Medium</td>
          </tr>
          <tr style="background: #f8f9fa;">
            <td style="padding: 12px; border: 1px solid #ddd;">Advertising</td>
            <td style="padding: 12px; border: 1px solid #ddd;">Featured listings, promotions</td>
            <td style="padding: 12px; text-align: right; border: 1px solid #ddd;">Medium</td>
          </tr>
        </table>
      </div>

      <!-- Growth Projections -->
      <div style="margin-bottom: 40px;">
        <h2 style="font-size: 20px; color: #000000; border-bottom: 2px solid #000000; padding-bottom: 10px; margin-bottom: 20px; font-weight: bold;">
          5-YEAR GROWTH PROJECTIONS
        </h2>
        
        <table style="width: 100%; border-collapse: collapse; margin-bottom: 25px;">
          <tr style="background: #000000; color: white;">
            <th style="padding: 12px; text-align: left; border: 1px solid #ddd;">Metric</th>
            <th style="padding: 12px; text-align: center; border: 1px solid #ddd;">Year 1</th>
            <th style="padding: 12px; text-align: center; border: 1px solid #ddd;">Year 2</th>
            <th style="padding: 12px; text-align: center; border: 1px solid #ddd;">Year 3</th>
            <th style="padding: 12px; text-align: center; border: 1px solid #ddd;">Year 5</th>
          </tr>
          <tr>
            <td style="padding: 12px; border: 1px solid #ddd;">Registered Users</td>
            <td style="padding: 12px; text-align: center; border: 1px solid #ddd;">50K</td>
            <td style="padding: 12px; text-align: center; border: 1px solid #ddd;">250K</td>
            <td style="padding: 12px; text-align: center; border: 1px solid #ddd;">1M</td>
            <td style="padding: 12px; text-align: center; border: 1px solid #ddd;">5M</td>
          </tr>
          <tr style="background: #f8f9fa;">
            <td style="padding: 12px; border: 1px solid #ddd;">Listed Businesses</td>
            <td style="padding: 12px; text-align: center; border: 1px solid #ddd;">5K</td>
            <td style="padding: 12px; text-align: center; border: 1px solid #ddd;">25K</td>
            <td style="padding: 12px; text-align: center; border: 1px solid #ddd;">100K</td>
            <td style="padding: 12px; text-align: center; border: 1px solid #ddd;">500K</td>
          </tr>
          <tr>
            <td style="padding: 12px; border: 1px solid #ddd;">Paying Subscribers</td>
            <td style="padding: 12px; text-align: center; border: 1px solid #ddd;">500</td>
            <td style="padding: 12px; text-align: center; border: 1px solid #ddd;">5K</td>
            <td style="padding: 12px; text-align: center; border: 1px solid #ddd;">25K</td>
            <td style="padding: 12px; text-align: center; border: 1px solid #ddd;">150K</td>
          </tr>
          <tr style="background: #f8f9fa;">
            <td style="padding: 12px; border: 1px solid #ddd;">Annual Revenue (ARR)</td>
            <td style="padding: 12px; text-align: center; border: 1px solid #ddd;">$500K</td>
            <td style="padding: 12px; text-align: center; border: 1px solid #ddd;">$5M</td>
            <td style="padding: 12px; text-align: center; border: 1px solid #ddd;">$25M</td>
            <td style="padding: 12px; text-align: center; border: 1px solid #ddd;">$150M</td>
          </tr>
          <tr>
            <td style="padding: 12px; border: 1px solid #ddd; font-weight: bold;">Estimated Valuation</td>
            <td style="padding: 12px; text-align: center; border: 1px solid #ddd;">$5M</td>
            <td style="padding: 12px; text-align: center; border: 1px solid #ddd;">$50M</td>
            <td style="padding: 12px; text-align: center; border: 1px solid #ddd;">$250M</td>
            <td style="padding: 12px; text-align: center; border: 1px solid #ddd; font-weight: bold; color: #000000;">$1.5B</td>
          </tr>
        </table>
        
        <p style="font-size: 14px; color: #000000; font-style: italic;">
          *Projections based on 10x ARR multiple for high-growth marketplace companies. Actual results may vary based on market conditions and execution.
        </p>
      </div>

      <!-- Key Requirements -->
      <div style="margin-bottom: 40px;">
        <h2 style="font-size: 20px; color: #000000; border-bottom: 2px solid #000000; padding-bottom: 10px; margin-bottom: 20px; font-weight: bold;">
          KEY REQUIREMENTS FOR SUCCESS
        </h2>
        
        <ol style="font-size: 14px; line-height: 1.8; padding-left: 25px;">
          <li style="margin-bottom: 15px;">
            <strong>Traction & User Growth:</strong> Demonstrate product-market fit with consistent month-over-month growth in users and businesses.
          </li>
          <li style="margin-bottom: 15px;">
            <strong>Revenue Validation:</strong> Prove multiple revenue streams with paying customers across subscription tiers and sponsorship levels.
          </li>
          <li style="margin-bottom: 15px;">
            <strong>Strategic Partnerships:</strong> Secure partnerships with major corporations, financial institutions, and community organizations.
          </li>
          <li style="margin-bottom: 15px;">
            <strong>Funding & Resources:</strong> Raise capital to accelerate growth, expand team, and scale marketing efforts.
          </li>
          <li style="margin-bottom: 15px;">
            <strong>Community Engagement:</strong> Build authentic relationships with Black business owners and community leaders.
          </li>
        </ol>
      </div>

      <!-- Contact Information -->
      <div style="background: #000000; color: white; padding: 30px; border-radius: 8px; text-align: center;">
        <h2 style="font-size: 20px; color: #ffffff; margin-bottom: 20px;">CONTACT INFORMATION</h2>
        <p style="font-size: 18px; margin-bottom: 10px; font-weight: bold;">Thomas D. Bowling</p>
        <p style="font-size: 14px; margin-bottom: 5px;">Founder & CEO</p>
        <p style="font-size: 14px; margin-bottom: 5px;">Email: contact@mansamusamarketplace.com</p>
        <p style="font-size: 14px; margin-bottom: 20px;">Phone: 312.709.6006</p>
        <p style="font-size: 14px; color: #ccc;">
          © ${new Date().getFullYear()} Mansa Musa Marketplace. All rights reserved.
        </p>
      </div>

    </div>
  `;
};
