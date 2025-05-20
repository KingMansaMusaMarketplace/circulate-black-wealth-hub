
import React from 'react';
import { format } from 'date-fns';

// This is a component that represents the content of the sponsorship agreement
// In a real implementation, you'd use a PDF generation library to create a PDF from this content
const SponsorshipAgreement = () => {
  const currentDate = new Date();
  const formattedDate = format(currentDate, 'MMMM dd, yyyy');
  
  return (
    <div className="max-w-4xl mx-auto p-8 bg-white">
      <div className="text-center mb-8">
        <h1 className="text-2xl font-bold mb-2">CORPORATE SPONSORSHIP AGREEMENT</h1>
        <p className="text-lg">MANSA MUSA MARKETPLACE</p>
      </div>
      
      <div className="mb-6">
        <p className="font-medium">AGREEMENT DATE: {formattedDate}</p>
      </div>
      
      <section className="mb-6">
        <h2 className="text-xl font-bold mb-2">1. PARTIES</h2>
        <p>This Corporate Sponsorship Agreement (the "Agreement") is entered into between:</p>
        <p className="my-2"><strong>Mansa Musa Marketplace Inc.</strong>, a Delaware corporation with its principal place of business at [ADDRESS] ("MMM" or the "Company")</p>
        <p className="my-2">AND</p>
        <p className="my-2"><strong>[SPONSOR NAME]</strong>, a [STATE/COUNTRY] [ENTITY TYPE] with its principal place of business at [SPONSOR ADDRESS] (the "Sponsor").</p>
        <p className="my-2">(Each a "Party" and collectively the "Parties")</p>
      </section>
      
      <section className="mb-6">
        <h2 className="text-xl font-bold mb-2">2. SPONSORSHIP DETAILS</h2>
        <p className="mb-2">2.1 <u>Sponsorship Tier</u>: The Sponsor agrees to participate in the MMM Corporate Sponsorship Program at the following tier: [TIER NAME: Bronze/Silver/Gold/Platinum]</p>
        <p className="mb-2">2.2 <u>Sponsorship Amount</u>: $[AMOUNT] [USD/per month OR per annum]</p>
        <p className="mb-2">2.3 <u>Term</u>: This Agreement shall commence on [START DATE] and continue for [DURATION] (the "Initial Term"). Subject to Section 8, this Agreement shall automatically renew for successive [RENEWAL PERIOD] periods unless terminated by either Party in accordance with the terms herein.</p>
      </section>
      
      <section className="mb-6">
        <h2 className="text-xl font-bold mb-2">3. BENEFITS AND DELIVERABLES</h2>
        <p className="mb-2">3.1 <u>Company Obligations</u>: In consideration for the Sponsorship Amount, MMM shall provide the Sponsor with the benefits associated with the selected Sponsorship Tier, as detailed in Exhibit A attached hereto and incorporated herein by reference.</p>
        <p className="mb-2">3.2 <u>Timeline for Deliverables</u>: MMM shall implement the benefits outlined in Exhibit A according to the following timeline:</p>
        <ul className="list-disc pl-6 mb-2">
          <li>Digital recognition: Within 3-5 business days of Agreement execution and receipt of payment</li>
          <li>Marketing materials: Within 14 business days of Agreement execution</li>
          <li>Event participation: According to MMM's event calendar</li>
          <li>Performance reports: Quarterly, within 15 days of quarter end</li>
        </ul>
        <p className="mb-2">3.3 <u>Performance Metrics</u>: MMM shall provide regular reports measuring community economic impact, including metrics on circulation dollars, businesses supported, transaction volume, and community engagement as specified for the Sponsor's tier level.</p>
      </section>
      
      <section className="mb-6">
        <h2 className="text-xl font-bold mb-2">4. PAYMENT TERMS</h2>
        <p className="mb-2">4.1 <u>Payment Schedule</u>: Payment for annual sponsorships shall be made in full within 30 days of execution of this Agreement. Monthly sponsorships shall be paid on the first business day of each month.</p>
        <p className="mb-2">4.2 <u>Method of Payment</u>: Payments shall be made via [PAYMENT METHOD(S)] to the following account: [ACCOUNT DETAILS].</p>
        <p className="mb-2">4.3 <u>Late Payments</u>: Any payment received after the due date shall be subject to a late fee of [PERCENTAGE]% of the outstanding amount per month or the maximum rate permitted by applicable law, whichever is less.</p>
      </section>
      
      <section className="mb-6">
        <h2 className="text-xl font-bold mb-2">5. INTELLECTUAL PROPERTY RIGHTS</h2>
        <p className="mb-2">5.1 <u>License to Use Sponsor Materials</u>: The Sponsor grants MMM a non-exclusive, royalty-free license to use the Sponsor's name, logo, and other brand materials provided by the Sponsor solely for the purpose of fulfilling MMM's obligations under this Agreement.</p>
        <p className="mb-2">5.2 <u>License to Use MMM Materials</u>: MMM grants the Sponsor a non-exclusive, royalty-free license to use MMM's designated sponsor badge and approved marketing materials solely for the purpose of promoting the Sponsor's support of MMM during the Term of this Agreement.</p>
        <p className="mb-2">5.3 <u>Approval Process</u>: Each Party shall submit to the other Party for prior written approval all uses of the other Party's trademarks, logos, or other intellectual property. Such approval shall not be unreasonably withheld or delayed.</p>
      </section>
      
      <section className="mb-6">
        <h2 className="text-xl font-bold mb-2">6. REPRESENTATIONS AND WARRANTIES</h2>
        <p className="mb-2">6.1 <u>Mutual Representations</u>: Each Party represents and warrants that:</p>
        <ul className="list-disc pl-6 mb-2">
          <li>It has the full right, power, and authority to enter into and perform this Agreement;</li>
          <li>Its performance of this Agreement does not violate any agreement or obligation between it and any third party;</li>
          <li>It shall comply with all applicable laws, rules, and regulations in performing its obligations under this Agreement.</li>
        </ul>
        <p className="mb-2">6.2 <u>MMM Representations</u>: MMM represents and warrants that it shall use the Sponsorship Amount in accordance with its mission to promote economic circulation in Black communities and support Black-owned businesses.</p>
        <p className="mb-2">6.3 <u>Sponsor Representations</u>: Sponsor represents and warrants that its operations and business practices align with MMM's mission and values, and it is not engaged in activities that would damage MMM's reputation or conflict with its goals of economic empowerment for Black communities.</p>
      </section>
      
      <section className="mb-6">
        <h2 className="text-xl font-bold mb-2">7. CONFIDENTIALITY</h2>
        <p className="mb-2">7.1 <u>Confidential Information</u>: Each Party may disclose certain confidential and proprietary information to the other Party in connection with this Agreement. Such confidential information shall include, but not be limited to, business plans, financial information, technical data, marketing strategies, and other information marked as confidential or reasonably understood to be confidential ("Confidential Information").</p>
        <p className="mb-2">7.2 <u>Non-Disclosure</u>: Each Party agrees to maintain the confidentiality of the other Party's Confidential Information, using at least the same degree of care it uses to protect its own confidential information, but in no case less than reasonable care.</p>
        <p className="mb-2">7.3 <u>Exceptions</u>: The obligations of confidentiality shall not apply to information that: (a) is or becomes publicly available through no fault of the receiving Party; (b) was rightfully known to the receiving Party without restriction before receipt from the disclosing Party; (c) is rightfully obtained by the receiving Party from a third party without restriction; or (d) is independently developed by the receiving Party without access to the disclosing Party's Confidential Information.</p>
      </section>
      
      <section className="mb-6">
        <h2 className="text-xl font-bold mb-2">8. TERMINATION AND CANCELLATION</h2>
        <p className="mb-2">8.1 <u>Termination for Convenience</u>: Sponsor may terminate a monthly sponsorship with thirty (30) days' written notice to MMM. Annual sponsorships may not be terminated for convenience prior to the end of the Initial Term.</p>
        <p className="mb-2">8.2 <u>Termination for Cause</u>: Either Party may terminate this Agreement immediately upon written notice if the other Party:</p>
        <ul className="list-disc pl-6 mb-2">
          <li>Materially breaches any provision of this Agreement and fails to cure such breach within thirty (30) days after receiving written notice thereof;</li>
          <li>Becomes insolvent, files for bankruptcy, or is subject to an involuntary bankruptcy petition;</li>
          <li>Engages in any conduct that materially damages or is likely to materially damage the reputation of the other Party.</li>
        </ul>
        <p className="mb-2">8.3 <u>Effects of Termination</u>:</p>
        <ul className="list-disc pl-6 mb-2">
          <li>Upon termination, all licenses granted herein shall immediately terminate;</li>
          <li>Each Party shall cease using the other Party's intellectual property;</li>
          <li>For termination of annual sponsorships prior to the end of the Term, no refunds shall be provided unless termination is due to MMM's material breach;</li>
          <li>Sections 5 (for the period specified therein), 7, 9, 10, and 11 shall survive termination of this Agreement.</li>
        </ul>
      </section>
      
      <section className="mb-6">
        <h2 className="text-xl font-bold mb-2">9. LIMITATION OF LIABILITY</h2>
        <p className="mb-2">9.1 <u>Limitation</u>: EXCEPT FOR BREACHES OF SECTIONS 5 AND 7, IN NO EVENT SHALL EITHER PARTY BE LIABLE FOR ANY INDIRECT, INCIDENTAL, SPECIAL, PUNITIVE, OR CONSEQUENTIAL DAMAGES, INCLUDING LOST PROFITS, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGES.</p>
        <p className="mb-2">9.2 <u>Cap on Liability</u>: Except for payment obligations and breaches of Sections 5 and 7, each Party's total liability under this Agreement shall be limited to the Sponsorship Amount paid or payable under this Agreement.</p>
      </section>
      
      <section className="mb-6">
        <h2 className="text-xl font-bold mb-2">10. INDEMNIFICATION</h2>
        <p className="mb-2">10.1 <u>Mutual Indemnification</u>: Each Party (the "Indemnifying Party") shall indemnify, defend, and hold harmless the other Party, its affiliates, officers, directors, employees, and agents (collectively, the "Indemnified Party") from and against any and all third-party claims, damages, liabilities, costs, and expenses, including reasonable attorneys' fees, arising out of or related to the Indemnifying Party's breach of any representation, warranty, or covenant under this Agreement.</p>
        <p className="mb-2">10.2 <u>Indemnification Procedure</u>: The Indemnified Party shall: (a) promptly notify the Indemnifying Party in writing of any claim subject to indemnification; (b) give the Indemnifying Party sole control of the defense and settlement of such claim; and (c) provide reasonable cooperation to the Indemnifying Party at the Indemnifying Party's expense. The Indemnified Party may participate in the defense at its own expense.</p>
      </section>
      
      <section className="mb-6">
        <h2 className="text-xl font-bold mb-2">11. GENERAL PROVISIONS</h2>
        <p className="mb-2">11.1 <u>Entire Agreement</u>: This Agreement, including all exhibits and attachments, constitutes the entire agreement between the Parties with respect to the subject matter hereof and supersedes all prior and contemporaneous agreements or communications.</p>
        <p className="mb-2">11.2 <u>Amendments</u>: This Agreement may only be amended by a written document signed by authorized representatives of both Parties.</p>
        <p className="mb-2">11.3 <u>Assignment</u>: Neither Party may assign this Agreement or any rights or obligations hereunder without the prior written consent of the other Party, except that either Party may assign this Agreement to a successor in interest in the event of a merger, acquisition, or sale of all or substantially all of its assets.</p>
        <p className="mb-2">11.4 <u>Force Majeure</u>: Neither Party shall be liable for any failure or delay in performance due to causes beyond its reasonable control, including but not limited to acts of God, strikes, lockouts, riots, acts of war, epidemics, pandemics, governmental regulations imposed after the fact, fire, communication line failures, power failures, earthquakes, or other disasters.</p>
        <p className="mb-2">11.5 <u>Notices</u>: All notices under this Agreement shall be in writing and shall be deemed given when delivered personally, by email (with confirmation of receipt), or by certified mail (return receipt requested) to the address specified below or to such other address as the Party to receive the notice has designated by notice to the other Party.</p>
        <p className="mb-2">11.6 <u>Relationship of Parties</u>: The Parties are independent contractors. Nothing in this Agreement shall be construed to create a partnership, joint venture, agency, or employment relationship between the Parties.</p>
        <p className="mb-2">11.7 <u>No Waiver</u>: The failure of either Party to enforce any provision of this Agreement shall not be construed as a waiver of such provision or the right to enforce such provision.</p>
        <p className="mb-2">11.8 <u>Severability</u>: If any provision of this Agreement is found to be invalid or unenforceable, the remaining provisions shall remain in full force and effect.</p>
        <p className="mb-2">11.9 <u>Governing Law</u>: This Agreement shall be governed by and construed in accordance with the laws of [STATE/JURISDICTION] without regard to its conflict of laws principles.</p>
        <p className="mb-2">11.10 <u>Dispute Resolution</u>: Any disputes arising out of or related to this Agreement shall first be addressed through good faith negotiations between the Parties. If such negotiations fail to resolve the dispute within thirty (30) days, the dispute shall be submitted to binding arbitration in accordance with the rules of the American Arbitration Association. The arbitration shall be conducted in [CITY, STATE/JURISDICTION]. The prevailing Party shall be entitled to recover its reasonable attorneys' fees and costs.</p>
        <p className="mb-2">11.11 <u>Counterparts</u>: This Agreement may be executed in counterparts, each of which shall be deemed an original, but all of which together shall constitute one and the same instrument. Electronic signatures shall be deemed originals.</p>
      </section>
      
      <section className="mb-6">
        <h2 className="text-xl font-bold mb-2">12. SIGNATURES</h2>
        <p className="mb-2">IN WITNESS WHEREOF, the Parties have executed this Agreement as of the date first above written.</p>
        
        <div className="grid grid-cols-2 gap-8 mt-6">
          <div>
            <p className="font-bold">MANSA MUSA MARKETPLACE INC.</p>
            <p className="mt-10">By: ________________________</p>
            <p>Name: ______________________</p>
            <p>Title: _______________________</p>
            <p>Date: _______________________</p>
          </div>
          <div>
            <p className="font-bold">[SPONSOR NAME]</p>
            <p className="mt-10">By: ________________________</p>
            <p>Name: ______________________</p>
            <p>Title: _______________________</p>
            <p>Date: _______________________</p>
          </div>
        </div>
      </section>
      
      <section className="mb-6">
        <h2 className="text-xl font-bold mb-2">EXHIBIT A: SPONSORSHIP BENEFITS BY TIER</h2>
        <div className="border border-gray-300 p-4 rounded-md">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-300">
                <th className="py-2 text-left">Benefit</th>
                <th className="py-2 text-center">Bronze<br /><span className="text-sm font-normal">$1,000/mo</span></th>
                <th className="py-2 text-center">Silver<br /><span className="text-sm font-normal">$2,500/mo</span></th>
                <th className="py-2 text-center">Gold<br /><span className="text-sm font-normal">$5,000/mo</span></th>
                <th className="py-2 text-center">Platinum<br /><span className="text-sm font-normal">$10,000/mo</span></th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b border-gray-300">
                <td className="py-2">Logo on Website</td>
                <td className="py-2 text-center">✓</td>
                <td className="py-2 text-center">✓</td>
                <td className="py-2 text-center">✓</td>
                <td className="py-2 text-center">✓</td>
              </tr>
              <tr className="border-b border-gray-300">
                <td className="py-2">Social Media Mentions</td>
                <td className="py-2 text-center">1/quarter</td>
                <td className="py-2 text-center">1/month</td>
                <td className="py-2 text-center">2/month</td>
                <td className="py-2 text-center">4/month</td>
              </tr>
              <tr className="border-b border-gray-300">
                <td className="py-2">Newsletter Feature</td>
                <td className="py-2 text-center">-</td>
                <td className="py-2 text-center">1/quarter</td>
                <td className="py-2 text-center">1/month</td>
                <td className="py-2 text-center">2/month</td>
              </tr>
              <tr className="border-b border-gray-300">
                <td className="py-2">Event Participation</td>
                <td className="py-2 text-center">-</td>
                <td className="py-2 text-center">1/year</td>
                <td className="py-2 text-center">2/year</td>
                <td className="py-2 text-center">4/year</td>
              </tr>
              <tr className="border-b border-gray-300">
                <td className="py-2">Co-branded Content</td>
                <td className="py-2 text-center">-</td>
                <td className="py-2 text-center">-</td>
                <td className="py-2 text-center">1/quarter</td>
                <td className="py-2 text-center">1/month</td>
              </tr>
              <tr className="border-b border-gray-300">
                <td className="py-2">Impact Reports</td>
                <td className="py-2 text-center">Annually</td>
                <td className="py-2 text-center">Quarterly</td>
                <td className="py-2 text-center">Monthly</td>
                <td className="py-2 text-center">Custom</td>
              </tr>
              <tr>
                <td className="py-2">Custom Program Development</td>
                <td className="py-2 text-center">-</td>
                <td className="py-2 text-center">-</td>
                <td className="py-2 text-center">-</td>
                <td className="py-2 text-center">✓</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
};

export default SponsorshipAgreement;
