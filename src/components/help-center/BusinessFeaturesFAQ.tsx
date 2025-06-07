
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';

const BusinessFeaturesFAQ = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-xl text-mansablue">Business Features</CardTitle>
      </CardHeader>
      <CardContent>
        <Accordion type="single" collapsible>
          <AccordionItem value="qr-management">
            <AccordionTrigger>How do I manage my QR codes?</AccordionTrigger>
            <AccordionContent>
              <div className="space-y-3 text-gray-600">
                <p>QR Code Management gives you full control:</p>
                <ul className="list-disc ml-6 space-y-2">
                  <li><strong>Create QR Codes:</strong> Generate codes for different promotions or locations</li>
                  <li><strong>Set Rewards:</strong> Define how many points customers earn per scan</li>
                  <li><strong>Expiration Dates:</strong> Set time limits for special offers</li>
                  <li><strong>Scan Limits:</strong> Control how many times each code can be used</li>
                  <li><strong>Analytics:</strong> Track which codes are performing best</li>
                  <li><strong>Bulk Actions:</strong> Create, edit, or delete multiple codes at once</li>
                </ul>
                <p>Use different QR codes for different campaigns to track their effectiveness!</p>
              </div>
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="analytics">
            <AccordionTrigger>What analytics are available?</AccordionTrigger>
            <AccordionContent>
              <div className="space-y-3 text-gray-600">
                <p>Your analytics dashboard provides insights into:</p>
                <ul className="list-disc ml-6 space-y-2">
                  <li><strong>QR Code Scans:</strong> Track total scans, unique visitors, and repeat customers</li>
                  <li><strong>Customer Engagement:</strong> See when customers visit most often</li>
                  <li><strong>Points Distributed:</strong> Monitor your loyalty program impact</li>
                  <li><strong>Profile Views:</strong> Track how often your business profile is viewed</li>
                  <li><strong>Geographic Data:</strong> See where your customers are coming from</li>
                  <li><strong>Performance Trends:</strong> Compare performance over different time periods</li>
                </ul>
                <p>Use these insights to optimize your marketing and customer engagement strategies.</p>
              </div>
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="customer-engagement">
            <AccordionTrigger>How can I engage with customers?</AccordionTrigger>
            <AccordionContent>
              <div className="space-y-3 text-gray-600">
                <p>Multiple ways to connect with your customers:</p>
                <ul className="list-disc ml-6 space-y-2">
                  <li><strong>Loyalty Rewards:</strong> Create attractive point-earning opportunities</li>
                  <li><strong>Special Offers:</strong> Use limited-time QR codes for promotions</li>
                  <li><strong>Business Updates:</strong> Post news and updates to your profile</li>
                  <li><strong>Customer Reviews:</strong> Respond to customer feedback</li>
                  <li><strong>Social Sharing:</strong> Encourage customers to share their experiences</li>
                  <li><strong>Email Marketing:</strong> Reach customers through our platform (coming soon)</li>
                </ul>
              </div>
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="verification">
            <AccordionTrigger>How does the verification process work?</AccordionTrigger>
            <AccordionContent>
              <div className="space-y-3 text-gray-600">
                <p>Getting verified builds customer trust:</p>
                <ol className="list-decimal ml-6 space-y-2">
                  <li><strong>Submit Application:</strong> Complete your business profile with accurate information</li>
                  <li><strong>Provide Documentation:</strong> Upload business license, tax ID, or other proof</li>
                  <li><strong>Review Process:</strong> Our team reviews applications within 3-5 business days</li>
                  <li><strong>Verification Badge:</strong> Approved businesses get a verified badge</li>
                  <li><strong>Enhanced Features:</strong> Verified businesses get priority placement and additional features</li>
                </ol>
                <p>Verified businesses see 3x more customer engagement on average!</p>
              </div>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </CardContent>
    </Card>
  );
};

export default BusinessFeaturesFAQ;
