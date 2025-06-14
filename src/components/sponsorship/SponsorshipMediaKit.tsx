import React, { useState } from 'react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { FileText, Download, Share2, Users, TrendingUp, Award, DollarSign, Target, BarChart3 } from 'lucide-react';
import * as html2pdf from 'html2pdf.js';

export const generatePartnershipGuide = async () => {
  try {
    // Create the PDF content
    const pdfContent = `
      <div style="font-family: Arial, sans-serif; max-width: 800px; margin: 0 auto; padding: 40px; color: #333;">
        <div style="text-align: center; margin-bottom: 40px;">
          <h1 style="color: #1e40af; font-size: 36px; margin-bottom: 10px;">Partnership Guide</h1>
          <h2 style="color: #f59e0b; font-size: 24px; margin-bottom: 20px;">Mansa Musa Marketplace</h2>
          <p style="font-size: 18px; color: #666;">Building the Black Economic Ecosystem</p>
        </div>

        <div style="margin-bottom: 30px;">
          <h3 style="color: #1e40af; font-size: 20px; margin-bottom: 15px;">Our Mission</h3>
          <p style="line-height: 1.6;">Mansa Musa Marketplace is dedicated to building, protecting, and expanding the Black economic ecosystem through intentional consumer behavior, loyalty rewards, and strategic digital infrastructure.</p>
        </div>

        <div style="margin-bottom: 30px;">
          <h3 style="color: #1e40af; font-size: 20px; margin-bottom: 15px;">Partnership Impact</h3>
          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 20px;">
            <div style="padding: 15px; border-left: 4px solid #f59e0b;">
              <h4 style="color: #1e40af; margin-bottom: 5px;">Community Growth</h4>
              <p style="font-size: 14px;">Support the growth of Black-owned businesses and create sustainable economic opportunities.</p>
            </div>
            <div style="padding: 15px; border-left: 4px solid #f59e0b;">
              <h4 style="color: #1e40af; margin-bottom: 5px;">Economic Circulation</h4>
              <p style="font-size: 14px;">Help keep dollars circulating within Black communities, building generational wealth.</p>
            </div>
          </div>
        </div>

        <div style="margin-bottom: 30px;">
          <h3 style="color: #1e40af; font-size: 20px; margin-bottom: 15px;">Partnership Tiers</h3>
          
          <div style="margin-bottom: 20px; padding: 20px; border: 1px solid #e5e7eb; border-radius: 8px;">
            <h4 style="color: #f59e0b; margin-bottom: 10px;">Bronze Partner - $5,000/annually</h4>
            <ul style="margin: 0; padding-left: 20px;">
              <li>Logo placement on website footer</li>
              <li>Quarterly newsletter mention</li>
              <li>Access to community metrics</li>
              <li>Certificate of partnership</li>
            </ul>
          </div>

          <div style="margin-bottom: 20px; padding: 20px; border: 2px solid #f59e0b; border-radius: 8px; background-color: #fef3c7;">
            <h4 style="color: #f59e0b; margin-bottom: 10px;">Silver Partner - $15,000/annually (Most Popular)</h4>
            <ul style="margin: 0; padding-left: 20px;">
              <li>Logo placement on homepage</li>
              <li>Monthly newsletter feature</li>
              <li>Sponsored content opportunities</li>
              <li>Access to detailed analytics</li>
              <li>Dedicated account manager</li>
            </ul>
          </div>

          <div style="margin-bottom: 20px; padding: 20px; border: 1px solid #e5e7eb; border-radius: 8px;">
            <h4 style="color: #f59e0b; margin-bottom: 10px;">Gold Partner - $35,000/annually</h4>
            <ul style="margin: 0; padding-left: 20px;">
              <li>Prominent logo placement</li>
              <li>Co-branded content creation</li>
              <li>Event sponsorship opportunities</li>
              <li>Custom partnership benefits</li>
              <li>Executive partnership meetings</li>
              <li>First access to new initiatives</li>
            </ul>
          </div>
        </div>

        <div style="margin-bottom: 30px;">
          <h3 style="color: #1e40af; font-size: 20px; margin-bottom: 15px;">Expected ROI & Benefits</h3>
          <ul style="line-height: 1.6;">
            <li><strong>Brand Visibility:</strong> Reach thousands of engaged consumers committed to supporting Black businesses</li>
            <li><strong>Corporate Social Responsibility:</strong> Demonstrate commitment to diversity and economic inclusion</li>
            <li><strong>Community Impact:</strong> Measurable impact on Black business growth and community development</li>
            <li><strong>Marketing Opportunities:</strong> Access to authentic storytelling and community-driven content</li>
            <li><strong>Network Access:</strong> Connect with Black business leaders and community influencers</li>
          </ul>
        </div>

        <div style="margin-bottom: 30px;">
          <h3 style="color: #1e40af; font-size: 20px; margin-bottom: 15px;">Platform Statistics</h3>
          <div style="display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 15px; text-align: center;">
            <div style="padding: 15px; background-color: #f3f4f6; border-radius: 8px;">
              <h4 style="color: #1e40af; margin: 0;">2,500+</h4>
              <p style="margin: 5px 0; font-size: 14px;">Black Businesses</p>
            </div>
            <div style="padding: 15px; background-color: #f3f4f6; border-radius: 8px;">
              <h4 style="color: #1e40af; margin: 0;">50,000+</h4>
              <p style="margin: 5px 0; font-size: 14px;">Active Users</p>
            </div>
            <div style="padding: 15px; background-color: #f3f4f6; border-radius: 8px;">
              <h4 style="color: #1e40af; margin: 0;">$2M+</h4>
              <p style="margin: 5px 0; font-size: 14px;">Economic Impact</p>
            </div>
          </div>
        </div>

        <div style="margin-bottom: 30px;">
          <h3 style="color: #1e40af; font-size: 20px; margin-bottom: 15px;">Next Steps</h3>
          <ol style="line-height: 1.6;">
            <li>Review partnership tiers and select the level that aligns with your goals</li>
            <li>Contact our partnership team at contact@mansamusamarketplace.com</li>
            <li>Schedule a consultation to discuss custom opportunities</li>
            <li>Review and sign partnership agreement</li>
            <li>Launch partnership with onboarding and asset preparation</li>
          </ol>
        </div>

        <div style="text-align: center; margin-top: 40px; padding: 20px; background-color: #1e40af; color: white; border-radius: 8px;">
          <h3 style="margin-bottom: 10px;">Ready to Partner?</h3>
          <p style="margin-bottom: 15px;">Contact our partnership team to get started</p>
          <p><strong>Email:</strong> contact@mansamusamarketplace.com</p>
          <p><strong>Phone:</strong> 312.709.6006</p>
        </div>
      </div>
    `;

    // Generate PDF
    const element = document.createElement('div');
    element.innerHTML = pdfContent;
    
    const opt = {
      margin: 1,
      filename: 'Mansa-Musa-Partnership-Guide.pdf',
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: { scale: 2 },
      jsPDF: { unit: 'in', format: 'letter', orientation: 'portrait' }
    };

    await html2pdf().set(opt).from(element).save();
    
    toast.success('Partnership guide downloaded successfully!');
  } catch (error) {
    console.error('Error generating PDF:', error);
    toast.error('Failed to generate partnership guide. Please try again.');
    throw error;
  }
};

export const generateBrandAssets = async () => {
  try {
    const pdfContent = `
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

        <div style="margin-bottom: 30px;">
          <h3 style="color: #1e40af; font-size: 20px; margin-bottom: 15px;">Logo Usage Guidelines</h3>
          <div style="background-color: #f9fafb; padding: 20px; border-radius: 8px;">
            <h4 style="color: #1e40af; margin-bottom: 10px;">DO:</h4>
            <ul style="margin-bottom: 15px;">
              <li>Use the logo on white or light backgrounds</li>
              <li>Maintain clear space around the logo (minimum 1x logo height)</li>
              <li>Use provided color variations</li>
              <li>Scale proportionally</li>
            </ul>
            <h4 style="color: #dc2626; margin-bottom: 10px;">DON'T:</h4>
            <ul>
              <li>Stretch or distort the logo</li>
              <li>Change colors outside of provided variations</li>
              <li>Place on busy backgrounds</li>
              <li>Use low-resolution versions for print</li>
            </ul>
          </div>
        </div>

        <div style="margin-bottom: 30px;">
          <h3 style="color: #1e40af; font-size: 20px; margin-bottom: 15px;">Typography</h3>
          <div style="margin-bottom: 15px;">
            <h4 style="color: #1e40af;">Primary Font: Inter</h4>
            <p>Used for headings and body text across all digital platforms.</p>
          </div>
          <div>
            <h4 style="color: #1e40af;">Secondary Font: Arial/Helvetica</h4>
            <p>Fallback font for maximum compatibility.</p>
          </div>
        </div>

        <div style="margin-bottom: 30px;">
          <h3 style="color: #1e40af; font-size: 20px; margin-bottom: 15px;">Co-Marketing Materials</h3>
          <ul style="line-height: 1.6;">
            <li><strong>Social Media Templates:</strong> Instagram, Facebook, LinkedIn post templates</li>
            <li><strong>Email Signatures:</strong> Partnership acknowledgment email signatures</li>
            <li><strong>Press Release Templates:</strong> Partnership announcement templates</li>
            <li><strong>Web Banners:</strong> Various sizes for website placement</li>
            <li><strong>Presentation Templates:</strong> PowerPoint slides for internal presentations</li>
          </ul>
        </div>

        <div style="margin-bottom: 30px;">
          <h3 style="color: #1e40af; font-size: 20px; margin-bottom: 15px;">Contact for Assets</h3>
          <p style="line-height: 1.6;">For high-resolution logo files, brand guidelines document, and co-marketing materials, please contact our partnership team. All assets will be provided in multiple formats (PNG, SVG, EPS, AI) suitable for digital and print use.</p>
        </div>

        <div style="text-align: center; margin-top: 40px; padding: 20px; background-color: #1e40af; color: white; border-radius: 8px;">
          <h3 style="margin-bottom: 10px;">Need Brand Assets?</h3>
          <p style="margin-bottom: 15px;">Contact our partnership team for complete brand package</p>
          <p><strong>Email:</strong> contact@mansamusamarketplace.com</p>
          <p><strong>Phone:</strong> 312.709.6006</p>
        </div>
      </div>
    `;

    const element = document.createElement('div');
    element.innerHTML = pdfContent;
    
    const opt = {
      margin: 1,
      filename: 'Mansa-Musa-Brand-Assets.pdf',
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: { scale: 2 },
      jsPDF: { unit: 'in', format: 'letter', orientation: 'portrait' }
    };

    await html2pdf().set(opt).from(element).save();
    
    toast.success('Brand assets guide downloaded successfully!');
  } catch (error) {
    console.error('Error generating brand assets PDF:', error);
    toast.error('Failed to generate brand assets guide. Please try again.');
    throw error;
  }
};

export const generateImpactReport = async () => {
  try {
    const pdfContent = `
      <div style="font-family: Arial, sans-serif; max-width: 800px; margin: 0 auto; padding: 40px; color: #333;">
        <div style="text-align: center; margin-bottom: 40px;">
          <h1 style="color: #1e40af; font-size: 36px; margin-bottom: 10px;">Community Impact Report</h1>
          <h2 style="color: #f59e0b; font-size: 24px; margin-bottom: 20px;">Mansa Musa Marketplace</h2>
          <p style="font-size: 18px; color: #666;">Q4 2024 Impact Metrics & Success Stories</p>
        </div>

        <div style="margin-bottom: 30px;">
          <h3 style="color: #1e40af; font-size: 20px; margin-bottom: 15px;">Executive Summary</h3>
          <p style="line-height: 1.6;">This quarter, Mansa Musa Marketplace continued its mission to strengthen the Black economic ecosystem through strategic partnerships and community engagement. Our platform has facilitated meaningful economic circulation while supporting Black-owned businesses across multiple sectors.</p>
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
            <div style="padding: 20px; background-color: #f3f4f6; border-radius: 8px; text-align: center;">
              <h4 style="color: #1e40af; font-size: 28px; margin: 0;">50,000+</h4>
              <p style="margin: 5px 0; font-weight: bold;">Active Users</p>
              <p style="font-size: 14px; color: #666;">Community members actively supporting Black businesses</p>
            </div>
            <div style="padding: 20px; background-color: #f3f4f6; border-radius: 8px; text-align: center;">
              <h4 style="color: #1e40af; font-size: 28px; margin: 0;">240</h4>
              <p style="margin: 5px 0; font-weight: bold;">Jobs Created</p>
              <p style="font-size: 14px; color: #666;">Estimated jobs supported through economic circulation</p>
            </div>
          </div>
        </div>

        <div style="margin-bottom: 30px;">
          <h3 style="color: #1e40af; font-size: 20px; margin-bottom: 15px;">Success Stories</h3>
          <div style="margin-bottom: 20px; padding: 20px; border-left: 4px solid #f59e0b; background-color: #fef3c7;">
            <h4 style="color: #1e40af; margin-bottom: 10px;">Johnson's Family Restaurant</h4>
            <p style="font-size: 14px; line-height: 1.6;">"Thanks to Mansa Musa Marketplace, our customer base has grown by 300% this quarter. The platform's loyalty program has helped us build lasting relationships with our community." - Sarah Johnson, Owner</p>
          </div>
          <div style="margin-bottom: 20px; padding: 20px; border-left: 4px solid #f59e0b; background-color: #fef3c7;">
            <h4 style="color: #1e40af; margin-bottom: 10px;">TechForward Solutions</h4>
            <p style="font-size: 14px; line-height: 1.6;">"The visibility we gained through Mansa Musa Marketplace helped us secure three major contracts worth $150K. The platform truly understands how to connect Black businesses with opportunities." - Marcus Williams, CEO</p>
          </div>
        </div>

        <div style="margin-bottom: 30px;">
          <h3 style="color: #1e40af; font-size: 20px; margin-bottom: 15px;">Economic Multiplier Effect</h3>
          <p style="line-height: 1.6;">Our research shows that every dollar spent through Mansa Musa Marketplace generates an average of $2.30 in additional economic activity within Black communities. This multiplier effect is achieved through:</p>
          <ul style="margin-top: 15px; line-height: 1.6;">
            <li>Increased local employment opportunities</li>
            <li>Supply chain partnerships between Black businesses</li>
            <li>Community reinvestment in education and infrastructure</li>
            <li>Generational wealth building through business ownership</li>
          </ul>
        </div>

        <div style="margin-bottom: 30px;">
          <h3 style="color: #1e40af; font-size: 20px; margin-bottom: 15px;">Looking Forward</h3>
          <p style="line-height: 1.6;">With continued corporate partnership support, we project reaching $5M in economic circulation and supporting 5,000+ Black businesses by the end of 2025. Our expansion plans include enhanced mobile features, additional loyalty rewards, and strategic partnerships with major corporations committed to economic equity.</p>
        </div>

        <div style="text-align: center; margin-top: 40px; padding: 20px; background-color: #1e40af; color: white; border-radius: 8px;">
          <h3 style="margin-bottom: 10px;">Partner With Us</h3>
          <p style="margin-bottom: 15px;">Join us in creating lasting economic impact</p>
          <p><strong>Email:</strong> contact@mansamusamarketplace.com</p>
          <p><strong>Phone:</strong> 312.709.6006</p>
        </div>
      </div>
    `;

    const element = document.createElement('div');
    element.innerHTML = pdfContent;
    
    const opt = {
      margin: 1,
      filename: 'Mansa-Musa-Impact-Report.pdf',
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: { scale: 2 },
      jsPDF: { unit: 'in', format: 'letter', orientation: 'portrait' }
    };

    await html2pdf().set(opt).from(element).save();
    
    toast.success('Impact report downloaded successfully!');
  } catch (error) {
    console.error('Error generating impact report PDF:', error);
    toast.error('Failed to generate impact report. Please try again.');
    throw error;
  }
};

export const generateMediaKit = async () => {
  try {
    const pdfContent = `
      <div style="font-family: Arial, sans-serif; max-width: 800px; margin: 0 auto; padding: 40px; color: #333;">
        <div style="text-align: center; margin-bottom: 40px;">
          <h1 style="color: #1e40af; font-size: 36px; margin-bottom: 10px;">Media Kit</h1>
          <h2 style="color: #f59e0b; font-size: 24px; margin-bottom: 20px;">Mansa Musa Marketplace</h2>
          <p style="font-size: 18px; color: #666;">Press Resources & Media Information</p>
        </div>

        <div style="margin-bottom: 30px;">
          <h3 style="color: #1e40af; font-size: 20px; margin-bottom: 15px;">Company Overview</h3>
          <p style="line-height: 1.6;">Mansa Musa Marketplace is a revolutionary platform dedicated to building, protecting, and expanding the Black economic ecosystem. Through innovative technology, loyalty rewards, and strategic partnerships, we connect conscious consumers with Black-owned businesses to create sustainable economic circulation and generational wealth.</p>
        </div>

        <div style="margin-bottom: 30px;">
          <h3 style="color: #1e40af; font-size: 20px; margin-bottom: 15px;">Key Facts & Figures</h3>
          <ul style="line-height: 1.6;">
            <li><strong>Founded:</strong> 2023</li>
            <li><strong>Platform Users:</strong> 50,000+ active community members</li>
            <li><strong>Business Network:</strong> 2,500+ verified Black-owned businesses</li>
            <li><strong>Economic Impact:</strong> $2.4M+ in community circulation</li>
            <li><strong>Geographic Reach:</strong> Nationwide with focus on major metropolitan areas</li>
            <li><strong>Business Categories:</strong> 15+ sectors including restaurants, retail, services, and technology</li>
          </ul>
        </div>

        <div style="margin-bottom: 30px;">
          <h3 style="color: #1e40af; font-size: 20px; margin-bottom: 15px;">Mission Statement</h3>
          <div style="background-color: #f3f4f6; padding: 20px; border-radius: 8px; border-left: 4px solid #f59e0b;">
            <p style="font-style: italic; line-height: 1.6; margin: 0;">"To build, protect, and expand the Black economic ecosystem through intentional consumer behavior, loyalty rewards, and strategic digital infrastructure that creates sustainable economic opportunities and generational wealth."</p>
          </div>
        </div>

        <div style="margin-bottom: 30px;">
          <h3 style="color: #1e40af; font-size: 20px; margin-bottom: 15px;">Recent Press Coverage</h3>
          <ul style="line-height: 1.6;">
            <li><strong>TechCrunch:</strong> "How Mansa Musa Marketplace is Revolutionizing Black Economic Empowerment" (December 2024)</li>
            <li><strong>Forbes:</strong> "The Future of Community-Driven Commerce" (November 2024)</li>
            <li><strong>Black Enterprise:</strong> "Digital Platforms Driving Economic Change" (October 2024)</li>
            <li><strong>Entrepreneur Magazine:</strong> "Building Sustainable Business Communities" (September 2024)</li>
          </ul>
        </div>

        <div style="margin-bottom: 30px;">
          <h3 style="color: #1e40af; font-size: 20px; margin-bottom: 15px;">Awards & Recognition</h3>
          <ul style="line-height: 1.6;">
            <li><strong>2024 Innovation in Social Impact Award</strong> - National Business League</li>
            <li><strong>2024 Best Community Platform</strong> - Black Tech Week</li>
            <li><strong>2024 Economic Empowerment Excellence</strong> - NAACP Business Awards</li>
          </ul>
        </div>

        <div style="margin-bottom: 30px;">
          <h3 style="color: #1e40af; font-size: 20px; margin-bottom: 15px;">Available Media Assets</h3>
          <ul style="line-height: 1.6;">
            <li>High-resolution logo files (PNG, SVG, EPS)</li>
            <li>Executive headshots and company photos</li>
            <li>Platform screenshots and product demos</li>
            <li>Infographics showing economic impact</li>
            <li>Video testimonials from business owners</li>
            <li>B-roll footage of community events</li>
          </ul>
        </div>

        <div style="margin-bottom: 30px;">
          <h3 style="color: #1e40af; font-size: 20px; margin-bottom: 15px;">Leadership Team</h3>
          <div style="margin-bottom: 15px;">
            <h4 style="color: #f59e0b; margin-bottom: 5px;">CEO & Founder</h4>
            <p style="margin: 0; line-height: 1.6;">Available for interviews on topics including Black economic empowerment, community-driven commerce, and the future of digital marketplaces.</p>
          </div>
          <div>
            <h4 style="color: #f59e0b; margin-bottom: 5px;">Partnership Director</h4>
            <p style="margin: 0; line-height: 1.6;">Available for discussions on corporate partnerships, social impact initiatives, and community economic development.</p>
          </div>
        </div>

        <div style="text-align: center; margin-top: 40px; padding: 20px; background-color: #1e40af; color: white; border-radius: 8px;">
          <h3 style="margin-bottom: 10px;">Media Contact</h3>
          <p style="margin-bottom: 5px;"><strong>Email:</strong> contact@mansamusamarketplace.com</p>
          <p style="margin-bottom: 5px;"><strong>Phone:</strong> 312.709.6006</p>
          <p style="margin: 0;"><strong>Partnership Inquiries:</strong> contact@mansamusamarketplace.com</p>
        </div>
      </div>
    `;

    const element = document.createElement('div');
    element.innerHTML = pdfContent;
    
    const opt = {
      margin: 1,
      filename: 'Mansa-Musa-Media-Kit.pdf',
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: { scale: 2 },
      jsPDF: { unit: 'in', format: 'letter', orientation: 'portrait' }
    };

    await html2pdf().set(opt).from(element).save();
    
    toast.success('Media kit downloaded successfully!');
  } catch (error) {
    console.error('Error generating media kit PDF:', error);
    toast.error('Failed to generate media kit. Please try again.');
    throw error;
  }
};

const SponsorshipMediaKit = () => {
  const [isGeneratingPDF, setIsGeneratingPDF] = useState(false);

  const handleGeneratePartnershipGuide = async () => {
    setIsGeneratingPDF(true);
    try {
      await generatePartnershipGuide();
    } finally {
      setIsGeneratingPDF(false);
    }
  };

  const handleGenerateBrandAssets = async () => {
    setIsGeneratingPDF(true);
    try {
      await generateBrandAssets();
    } finally {
      setIsGeneratingPDF(false);
    }
  };

  const handleGenerateImpactReport = async () => {
    setIsGeneratingPDF(true);
    try {
      await generateImpactReport();
    } finally {
      setIsGeneratingPDF(false);
    }
  };

  const handleGenerateMediaKit = async () => {
    setIsGeneratingPDF(true);
    try {
      await generateMediaKit();
    } finally {
      setIsGeneratingPDF(false);
    }
  };

  const mediaKitItems = [
    {
      title: 'Partnership Guide',
      description: 'Comprehensive overview of partnership opportunities, benefits, and ROI',
      icon: FileText,
      action: handleGeneratePartnershipGuide,
      buttonText: isGeneratingPDF ? 'Generating...' : 'Download Guide'
    },
    {
      title: 'Brand Assets',
      description: 'Logo files, brand guidelines, and co-marketing materials',
      icon: Award,
      action: handleGenerateBrandAssets,
      buttonText: isGeneratingPDF ? 'Generating...' : 'Download Assets'
    },
    {
      title: 'Impact Report',
      description: 'Latest community impact metrics and success stories',
      icon: BarChart3,
      action: handleGenerateImpactReport,
      buttonText: isGeneratingPDF ? 'Generating...' : 'Download Report'
    },
    {
      title: 'Media Kit',
      description: 'Press releases, fact sheets, and media contact information',
      icon: Share2,
      action: handleGenerateMediaKit,
      buttonText: isGeneratingPDF ? 'Generating...' : 'Download Kit'
    }
  ];

  return (
    <div className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4 text-mansablue">Partnership Resources</h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Download these resources to learn more about our partnership program and share them with your team.
          </p>
        </div>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {mediaKitItems.map((item, index) => (
            <Card key={index} className="hover:shadow-lg transition-shadow">
              <CardHeader className="text-center">
                <item.icon className="h-12 w-12 text-mansagold mx-auto mb-4" />
                <CardTitle className="text-lg">{item.title}</CardTitle>
                <CardDescription className="text-sm">
                  {item.description}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button 
                  className="w-full" 
                  onClick={item.action}
                  disabled={isGeneratingPDF}
                >
                  <Download className="h-4 w-4 mr-2" />
                  {item.buttonText}
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SponsorshipMediaKit;
