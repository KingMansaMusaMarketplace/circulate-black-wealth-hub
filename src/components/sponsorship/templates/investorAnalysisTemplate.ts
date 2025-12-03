
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
        <p style="font-size: 14px; line-height: 1.8; margin-bottom: 15px; color: #000000;">
          Mansa Musa Marketplace is a comprehensive digital ecosystem designed to empower Black-owned businesses 
          and strengthen economic circulation within the African American community. Named after the legendary 
          West African emperor known for his immense wealth and generosity, our platform embodies the spirit 
          of economic empowerment and community prosperity.
        </p>
        <div style="background: #f8f9fa; padding: 20px; border-left: 4px solid #000000; margin: 20px 0;">
          <h3 style="font-size: 16px; color: #000000; margin-bottom: 10px; font-weight: bold;">THE BILLION-DOLLAR VERDICT</h3>
          <p style="font-size: 14px; line-height: 1.6; margin: 0; color: #000000;">
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
        <table style="width: 100%; border-collapse: collapse; margin-bottom: 25px; color: #000000;">
          <tr style="background: #000000; color: white;">
            <th style="padding: 12px; text-align: left; border: 1px solid #ddd; color: #ffffff;">Market Segment</th>
            <th style="padding: 12px; text-align: right; border: 1px solid #ddd; color: #ffffff;">Value</th>
          </tr>
          <tr>
            <td style="padding: 12px; border: 1px solid #ddd; color: #000000;">Black Consumer Spending Power (Annual)</td>
            <td style="padding: 12px; text-align: right; border: 1px solid #ddd; font-weight: bold; color: #000000;">$1.6 Trillion</td>
          </tr>
          <tr style="background: #f8f9fa;">
            <td style="padding: 12px; border: 1px solid #ddd; color: #000000;">Black-Owned Businesses in U.S.</td>
            <td style="padding: 12px; text-align: right; border: 1px solid #ddd; color: #000000;">3.1 Million</td>
          </tr>
          <tr>
            <td style="padding: 12px; border: 1px solid #ddd; color: #000000;">Average Annual Revenue per Black Business</td>
            <td style="padding: 12px; text-align: right; border: 1px solid #ddd; color: #000000;">$142,000</td>
          </tr>
          <tr style="background: #f8f9fa;">
            <td style="padding: 12px; border: 1px solid #ddd; color: #000000;">Projected Black Spending Power by 2030</td>
            <td style="padding: 12px; text-align: right; border: 1px solid #ddd; font-weight: bold; color: #000000;">$2.1 Trillion</td>
          </tr>
        </table>

        <h3 style="font-size: 16px; color: #000000; margin-bottom: 15px; font-weight: bold;">The Market Gap</h3>
        <p style="font-size: 14px; line-height: 1.8; margin-bottom: 15px; color: #000000;">
          Despite significant spending power, Black communities face systemic challenges:
        </p>
        <ul style="font-size: 14px; line-height: 1.8; padding-left: 25px; margin-bottom: 20px; color: #000000;">
          <li style="color: #000000;">Only 2% of Black consumer dollars circulate within Black communities</li>
          <li style="color: #000000;">Black-owned businesses receive less than 1% of venture capital funding</li>
          <li style="color: #000000;">Limited access to business tools, financing, and growth resources</li>
          <li style="color: #000000;">Fragmented discovery of Black-owned businesses</li>
        </ul>
      </div>

      <!-- Platform Assessment -->
      <div style="margin-bottom: 40px;">
        <h2 style="font-size: 20px; color: #000000; border-bottom: 2px solid #000000; padding-bottom: 10px; margin-bottom: 20px; font-weight: bold;">
          PLATFORM ASSESSMENT
        </h2>
        
        <h3 style="font-size: 16px; color: #000000; margin-bottom: 15px; font-weight: bold;">Technical Infrastructure</h3>
        <table style="width: 100%; border-collapse: collapse; margin-bottom: 25px; color: #000000;">
          <tr style="background: #000000; color: white;">
            <th style="padding: 12px; text-align: left; border: 1px solid #ddd; color: #ffffff;">Component</th>
            <th style="padding: 12px; text-align: right; border: 1px solid #ddd; color: #ffffff;">Scale</th>
          </tr>
          <tr>
            <td style="padding: 12px; border: 1px solid #ddd; color: #000000;">Total Application Pages/Views</td>
            <td style="padding: 12px; text-align: right; border: 1px solid #ddd; font-weight: bold; color: #000000;">130+</td>
          </tr>
          <tr style="background: #f8f9fa;">
            <td style="padding: 12px; border: 1px solid #ddd; color: #000000;">Database Tables</td>
            <td style="padding: 12px; text-align: right; border: 1px solid #ddd; font-weight: bold; color: #000000;">110+</td>
          </tr>
          <tr>
            <td style="padding: 12px; border: 1px solid #ddd; color: #000000;">Edge Functions (Backend Logic)</td>
            <td style="padding: 12px; text-align: right; border: 1px solid #ddd; font-weight: bold; color: #000000;">67</td>
          </tr>
          <tr style="background: #f8f9fa;">
            <td style="padding: 12px; border: 1px solid #ddd; color: #000000;">Revenue Streams</td>
            <td style="padding: 12px; text-align: right; border: 1px solid #ddd; font-weight: bold; color: #000000;">6+</td>
          </tr>
          <tr>
            <td style="padding: 12px; border: 1px solid #ddd; color: #000000;">Mobile App Ready</td>
            <td style="padding: 12px; text-align: right; border: 1px solid #ddd; color: #000000;">Yes (iOS & Android)</td>
          </tr>
        </table>

        <h3 style="font-size: 16px; color: #000000; margin-bottom: 15px; font-weight: bold;">Core Features</h3>
        <ul style="font-size: 14px; line-height: 1.8; padding-left: 25px; margin-bottom: 20px; color: #000000;">
          <li style="color: #000000;"><strong>Business Directory:</strong> Comprehensive listings with search, filtering, and reviews</li>
          <li style="color: #000000;"><strong>Loyalty Points System:</strong> Gamified engagement rewarding community participation</li>
          <li style="color: #000000;"><strong>Community Savings Circles:</strong> Traditional "Susu" system digitized for group savings</li>
          <li style="color: #000000;"><strong>Business Management Suite:</strong> Invoicing, expenses, inventory, customer management</li>
          <li style="color: #000000;"><strong>AI Assistant (Mansa AI):</strong> Intelligent business guidance and recommendations</li>
          <li style="color: #000000;"><strong>Sales Agent Network:</strong> Commission-based referral program with tiered rewards</li>
          <li style="color: #000000;"><strong>Corporate Sponsorship Portal:</strong> Structured partnership opportunities</li>
          <li style="color: #000000;"><strong>Event Management:</strong> Community events and networking features</li>
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
            <p style="font-size: 14px; margin: 0; color: #000000;">Connects consumers, businesses, corporate sponsors, and sales agents in a unified ecosystem with network effects.</p>
          </div>
          <div style="background: #f8f9fa; padding: 15px; border-radius: 8px;">
            <h4 style="color: #000000; margin-bottom: 8px; font-weight: bold;">2. Community Finance Innovation</h4>
            <p style="font-size: 14px; margin: 0; color: #000000;">Digital savings circles (Susu) tap into trusted cultural practices, creating sticky engagement and financial inclusion.</p>
          </div>
          <div style="background: #f8f9fa; padding: 15px; border-radius: 8px;">
            <h4 style="color: #000000; margin-bottom: 8px; font-weight: bold;">3. Comprehensive Business Tools</h4>
            <p style="font-size: 14px; margin: 0; color: #000000;">Full-stack business management reduces need for multiple subscriptions, increasing platform stickiness.</p>
          </div>
          <div style="background: #f8f9fa; padding: 15px; border-radius: 8px;">
            <h4 style="color: #000000; margin-bottom: 8px; font-weight: bold;">4. AI-Powered Intelligence</h4>
            <p style="font-size: 14px; margin: 0; color: #000000;">Mansa AI provides personalized recommendations, business insights, and automated assistance.</p>
          </div>
          <div style="background: #f8f9fa; padding: 15px; border-radius: 8px;">
            <h4 style="color: #000000; margin-bottom: 8px; font-weight: bold;">5. Mobile-First Architecture</h4>
            <p style="font-size: 14px; margin: 0; color: #000000;">Native iOS and Android apps ensure accessibility for the 85%+ of Black Americans who are smartphone users.</p>
          </div>
        </div>
      </div>

      <!-- Revenue Model -->
      <div style="margin-bottom: 40px;">
        <h2 style="font-size: 20px; color: #000000; border-bottom: 2px solid #000000; padding-bottom: 10px; margin-bottom: 20px; font-weight: bold;">
          REVENUE MODEL
        </h2>
        
        <table style="width: 100%; border-collapse: collapse; margin-bottom: 25px; color: #000000;">
          <tr style="background: #000000; color: white;">
            <th style="padding: 12px; text-align: left; border: 1px solid #ddd; color: #ffffff;">Revenue Stream</th>
            <th style="padding: 12px; text-align: left; border: 1px solid #ddd; color: #ffffff;">Model</th>
            <th style="padding: 12px; text-align: right; border: 1px solid #ddd; color: #ffffff;">Potential</th>
          </tr>
          <tr>
            <td style="padding: 12px; border: 1px solid #ddd; color: #000000;">Business Subscriptions</td>
            <td style="padding: 12px; border: 1px solid #ddd; color: #000000;">$29-199/month tiers</td>
            <td style="padding: 12px; text-align: right; border: 1px solid #ddd; color: #000000;">High</td>
          </tr>
          <tr style="background: #f8f9fa;">
            <td style="padding: 12px; border: 1px solid #ddd; color: #000000;">Corporate Sponsorships</td>
            <td style="padding: 12px; border: 1px solid #ddd; color: #000000;">$5K-100K+ packages</td>
            <td style="padding: 12px; text-align: right; border: 1px solid #ddd; color: #000000;">Very High</td>
          </tr>
          <tr>
            <td style="padding: 12px; border: 1px solid #ddd; color: #000000;">Transaction Fees</td>
            <td style="padding: 12px; border: 1px solid #ddd; color: #000000;">2-3% on bookings</td>
            <td style="padding: 12px; text-align: right; border: 1px solid #ddd; color: #000000;">High</td>
          </tr>
          <tr style="background: #f8f9fa;">
            <td style="padding: 12px; border: 1px solid #ddd; color: #000000;">Savings Circle Fees</td>
            <td style="padding: 12px; border: 1px solid #ddd; color: #000000;">1-2% management fee</td>
            <td style="padding: 12px; text-align: right; border: 1px solid #ddd; color: #000000;">Medium</td>
          </tr>
          <tr>
            <td style="padding: 12px; border: 1px solid #ddd; color: #000000;">Premium Features</td>
            <td style="padding: 12px; border: 1px solid #ddd; color: #000000;">AI, analytics, tools</td>
            <td style="padding: 12px; text-align: right; border: 1px solid #ddd; color: #000000;">Medium</td>
          </tr>
          <tr style="background: #f8f9fa;">
            <td style="padding: 12px; border: 1px solid #ddd; color: #000000;">Advertising</td>
            <td style="padding: 12px; border: 1px solid #ddd; color: #000000;">Featured listings, promotions</td>
            <td style="padding: 12px; text-align: right; border: 1px solid #ddd; color: #000000;">Medium</td>
          </tr>
        </table>
      </div>

      <!-- Growth Projections -->
      <div style="margin-bottom: 40px;">
        <h2 style="font-size: 20px; color: #000000; border-bottom: 2px solid #000000; padding-bottom: 10px; margin-bottom: 20px; font-weight: bold;">
          5-YEAR GROWTH PROJECTIONS
        </h2>
        
        <table style="width: 100%; border-collapse: collapse; margin-bottom: 25px; color: #000000;">
          <tr style="background: #000000; color: white;">
            <th style="padding: 12px; text-align: left; border: 1px solid #ddd; color: #ffffff;">Metric</th>
            <th style="padding: 12px; text-align: center; border: 1px solid #ddd; color: #ffffff;">Year 1</th>
            <th style="padding: 12px; text-align: center; border: 1px solid #ddd; color: #ffffff;">Year 2</th>
            <th style="padding: 12px; text-align: center; border: 1px solid #ddd; color: #ffffff;">Year 3</th>
            <th style="padding: 12px; text-align: center; border: 1px solid #ddd; color: #ffffff;">Year 5</th>
          </tr>
          <tr>
            <td style="padding: 12px; border: 1px solid #ddd; color: #000000;">Registered Users</td>
            <td style="padding: 12px; text-align: center; border: 1px solid #ddd; color: #000000;">50K</td>
            <td style="padding: 12px; text-align: center; border: 1px solid #ddd; color: #000000;">250K</td>
            <td style="padding: 12px; text-align: center; border: 1px solid #ddd; color: #000000;">1M</td>
            <td style="padding: 12px; text-align: center; border: 1px solid #ddd; color: #000000;">5M</td>
          </tr>
          <tr style="background: #f8f9fa;">
            <td style="padding: 12px; border: 1px solid #ddd; color: #000000;">Listed Businesses</td>
            <td style="padding: 12px; text-align: center; border: 1px solid #ddd; color: #000000;">5K</td>
            <td style="padding: 12px; text-align: center; border: 1px solid #ddd; color: #000000;">25K</td>
            <td style="padding: 12px; text-align: center; border: 1px solid #ddd; color: #000000;">100K</td>
            <td style="padding: 12px; text-align: center; border: 1px solid #ddd; color: #000000;">500K</td>
          </tr>
          <tr>
            <td style="padding: 12px; border: 1px solid #ddd; color: #000000;">Paying Subscribers</td>
            <td style="padding: 12px; text-align: center; border: 1px solid #ddd; color: #000000;">500</td>
            <td style="padding: 12px; text-align: center; border: 1px solid #ddd; color: #000000;">5K</td>
            <td style="padding: 12px; text-align: center; border: 1px solid #ddd; color: #000000;">25K</td>
            <td style="padding: 12px; text-align: center; border: 1px solid #ddd; color: #000000;">150K</td>
          </tr>
          <tr style="background: #f8f9fa;">
            <td style="padding: 12px; border: 1px solid #ddd; color: #000000;">Annual Revenue (ARR)</td>
            <td style="padding: 12px; text-align: center; border: 1px solid #ddd; color: #000000;">$500K</td>
            <td style="padding: 12px; text-align: center; border: 1px solid #ddd; color: #000000;">$5M</td>
            <td style="padding: 12px; text-align: center; border: 1px solid #ddd; color: #000000;">$25M</td>
            <td style="padding: 12px; text-align: center; border: 1px solid #ddd; color: #000000;">$150M</td>
          </tr>
          <tr>
            <td style="padding: 12px; border: 1px solid #ddd; font-weight: bold; color: #000000;">Estimated Valuation</td>
            <td style="padding: 12px; text-align: center; border: 1px solid #ddd; color: #000000;">$5M</td>
            <td style="padding: 12px; text-align: center; border: 1px solid #ddd; color: #000000;">$50M</td>
            <td style="padding: 12px; text-align: center; border: 1px solid #ddd; color: #000000;">$250M</td>
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
        
        <ol style="font-size: 14px; line-height: 1.8; padding-left: 25px; color: #000000;">
          <li style="margin-bottom: 15px; color: #000000;">
            <strong>Traction & User Growth:</strong> Demonstrate product-market fit with consistent month-over-month growth in users and businesses.
          </li>
          <li style="margin-bottom: 15px; color: #000000;">
            <strong>Revenue Validation:</strong> Prove multiple revenue streams with paying customers across subscription tiers and sponsorship levels.
          </li>
          <li style="margin-bottom: 15px; color: #000000;">
            <strong>Strategic Partnerships:</strong> Secure partnerships with major corporations, financial institutions, and community organizations.
          </li>
          <li style="margin-bottom: 15px; color: #000000;">
            <strong>Funding & Resources:</strong> Raise capital to accelerate growth, expand team, and scale marketing efforts.
          </li>
          <li style="margin-bottom: 15px; color: #000000;">
            <strong>Community Engagement:</strong> Build authentic relationships with Black business owners and community leaders.
          </li>
        </ol>
      </div>

      <!-- Contact Information -->
      <div style="background: #000000; color: white; padding: 30px; border-radius: 8px; text-align: center;">
        <h2 style="font-size: 20px; color: #ffffff; margin-bottom: 20px; font-weight: bold;">CONTACT INFORMATION</h2>
        <p style="font-size: 18px; margin-bottom: 10px; font-weight: bold; color: #ffffff;">Thomas D. Bowling</p>
        <p style="font-size: 14px; margin-bottom: 5px; color: #ffffff;">Founder & CEO</p>
        <p style="font-size: 14px; margin-bottom: 5px; color: #ffffff;"><strong>Email:</strong> contact@mansamusamarketplace.com</p>
        <p style="font-size: 14px; margin-bottom: 0; color: #ffffff;"><strong>Phone:</strong> 312.709.6006</p>
      </div>

      <!-- Footer -->
      <div style="text-align: center; margin-top: 40px; padding-top: 20px; border-top: 1px solid #ddd;">
        <p style="font-size: 12px; color: #000000;">© 2025 Mansa Musa Marketplace. All rights reserved.</p>
      </div>
    </div>
  `;
};
