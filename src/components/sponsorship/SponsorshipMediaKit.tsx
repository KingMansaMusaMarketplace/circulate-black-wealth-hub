import React, { useState } from 'react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { FileText, Download, Share2, Users, TrendingUp, Award, DollarSign, Target, BarChart3 } from 'lucide-react';
import html2pdf from 'html2pdf.js';

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
            <li>Contact our partnership team at partnerships@mansamusamarketplace.com</li>
            <li>Schedule a consultation to discuss custom opportunities</li>
            <li>Review and sign partnership agreement</li>
            <li>Launch partnership with onboarding and asset preparation</li>
          </ol>
        </div>

        <div style="text-align: center; margin-top: 40px; padding: 20px; background-color: #1e40af; color: white; border-radius: 8px;">
          <h3 style="margin-bottom: 10px;">Ready to Partner?</h3>
          <p style="margin-bottom: 15px;">Contact our partnership team to get started</p>
          <p><strong>Email:</strong> partnerships@mansamusamarketplace.com</p>
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
      action: () => toast.info('Brand assets package would be downloaded in production'),
      buttonText: 'Download Assets'
    },
    {
      title: 'Impact Report',
      description: 'Latest community impact metrics and success stories',
      icon: BarChart3,
      action: () => toast.info('Impact report would be downloaded in production'),
      buttonText: 'Download Report'
    },
    {
      title: 'Media Kit',
      description: 'Press releases, fact sheets, and media contact information',
      icon: Share2,
      action: () => toast.info('Media kit would be downloaded in production'),
      buttonText: 'Download Kit'
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
                  disabled={item.title === 'Partnership Guide' && isGeneratingPDF}
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
