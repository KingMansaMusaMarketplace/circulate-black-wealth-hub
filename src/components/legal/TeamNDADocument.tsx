import React from 'react';

interface TeamNDADocumentProps {
  companyName?: string;
  recipientName?: string;
  effectiveDate?: string;
  inventorName?: string;
}

const TeamNDADocument: React.FC<TeamNDADocumentProps> = ({
  companyName = "1325.AI, LLC",
  recipientName = "[RECIPIENT NAME]",
  effectiveDate = new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }),
  inventorName = "Thomas D. Bowling"
}) => {
  return (
    <div className="prose prose-sm max-w-none dark:prose-invert">
      <div className="text-center mb-8">
        <h1 className="text-2xl font-bold mb-2">CONFIDENTIAL INFORMATION AND</h1>
        <h1 className="text-2xl font-bold mb-2">NON-DISCLOSURE AGREEMENT</h1>
        <p className="text-sm text-muted-foreground">(Team Member / Insider Access)</p>
      </div>

      <div className="bg-warning/10 border border-warning/30 rounded-lg p-4 mb-6">
        <p className="text-sm font-semibold text-warning-foreground mb-0">
          ⚠️ NOTICE: This Agreement contains binding legal obligations including confidentiality requirements, 
          non-competition provisions, and intellectual property assignments. By signing, you acknowledge that 
          you have had the opportunity to seek independent legal counsel.
        </p>
      </div>

      <p className="font-semibold">
        This CONFIDENTIAL INFORMATION AND NON-DISCLOSURE AGREEMENT ("Agreement") is entered into as of{' '}
        <span className="underline">{effectiveDate}</span> ("Effective Date")
      </p>

      <p><strong>BETWEEN:</strong></p>
      
      <p className="ml-4">
        <strong>{companyName}</strong>, an Illinois limited liability company, with its principal place of business 
        in Chicago, Illinois, including its subsidiaries, affiliates, successors, and assigns (collectively, 
        the "Company" or "Disclosing Party")
      </p>

      <p><strong>AND:</strong></p>
      
      <p className="ml-4">
        <strong>{recipientName}</strong> ("Recipient" or "Receiving Party")
      </p>

      <p>(Each individually a "Party" and collectively the "Parties")</p>

      <hr className="my-6" />

      <h2 className="text-xl font-bold">RECITALS</h2>
      
      <p>
        <strong>WHEREAS</strong>, the Company has developed and owns proprietary technology, trade secrets, 
        and intellectual property related to its Platform-as-a-Service ("PaaS") business, including but not 
        limited to the 1325.AI platform, Community Marketplace Attribution Language (CMAL), Voice AI Systems, 
        Susu Circle Savings Infrastructure, Fraud Detection Systems, and Economic Karma algorithms, as 
        documented in U.S. Provisional Patent Application No. 63/969,202, filed January 27, 2026;
      </p>

      <p>
        <strong>WHEREAS</strong>, the Recipient desires to participate as a team member, advisor, or contributor 
        to the Company's operations and will have access to Confidential Information;
      </p>

      <p>
        <strong>WHEREAS</strong>, the Parties acknowledge that the relationship between them may be one of 
        friendship or family connection, and expressly agree that such personal relationship does not diminish 
        or modify the legal obligations contained herein;
      </p>

      <p>
        <strong>NOW, THEREFORE</strong>, in consideration of the mutual covenants and agreements herein contained, 
        and for other good and valuable consideration, the receipt and sufficiency of which are hereby acknowledged, 
        the Parties agree as follows:
      </p>

      <hr className="my-6" />

      <h2 className="text-xl font-bold">ARTICLE 1: DEFINITIONS</h2>

      <p>
        <strong>1.1 "Confidential Information"</strong> means any and all information, whether written, oral, 
        electronic, visual, or in any other form, that is disclosed by the Company to the Recipient or that 
        the Recipient learns, discovers, or develops in connection with the Company's business, including but 
        not limited to:
      </p>

      <ul className="list-none ml-4">
        <li>(a) <strong>Technical Information:</strong> Source code, object code, algorithms, software architecture, 
        system designs, API specifications, database schemas, technical documentation, development methodologies, 
        testing procedures, and any modifications or derivatives thereof;</li>
        
        <li>(b) <strong>Business Information:</strong> Business plans, financial projections, revenue models, 
        pricing strategies, marketing plans, customer lists, vendor relationships, partnership agreements, 
        investor communications, and strategic initiatives;</li>
        
        <li>(c) <strong>Proprietary Systems:</strong> The Community Marketplace Attribution Language (CMAL), 
        Voice AI architecture, Susu Circle savings infrastructure, Economic Karma scoring algorithms, 
        Fraud Detection systems, API Gateway architecture, and all 27 patent claims documented in USPTO 
        Application 63/969,202;</li>
        
        <li>(d) <strong>Trade Secrets:</strong> Any information that derives independent economic value from 
        not being generally known to competitors and is subject to reasonable efforts to maintain its secrecy, 
        as defined under the Illinois Trade Secrets Act (765 ILCS 1065) and the Defend Trade Secrets Act of 
        2016 (18 U.S.C. § 1836);</li>
        
        <li>(e) <strong>Personnel Information:</strong> Information about employees, contractors, advisors, 
        and team members, including compensation, performance, and personal contact information;</li>
        
        <li>(f) <strong>Third-Party Information:</strong> Any confidential information of third parties that 
        the Company has received under obligation of confidentiality.</li>
      </ul>

      <p>
        <strong>1.2 "Excluded Information"</strong> means information that the Recipient can demonstrate by 
        clear and convincing evidence:
      </p>

      <ul className="list-none ml-4">
        <li>(a) Was publicly available at the time of disclosure through no fault of the Recipient;</li>
        <li>(b) Was lawfully in the Recipient's possession prior to disclosure, as evidenced by contemporaneous 
        written records;</li>
        <li>(c) Was independently developed by the Recipient without use of or reference to Confidential 
        Information, as evidenced by contemporaneous written records;</li>
        <li>(d) Was lawfully obtained from a third party who had the right to disclose it without restriction.</li>
      </ul>

      <p>
        <strong>1.3 "Intellectual Property"</strong> means all patents, patent applications, copyrights, 
        trademarks, trade secrets, know-how, inventions, discoveries, improvements, designs, and any other 
        intellectual property rights, whether registered or unregistered.
      </p>

      <hr className="my-6" />

      <h2 className="text-xl font-bold">ARTICLE 2: CONFIDENTIALITY OBLIGATIONS</h2>

      <p>
        <strong>2.1 Non-Disclosure.</strong> The Recipient agrees to hold all Confidential Information in 
        strict confidence and not to disclose, publish, or otherwise disseminate any Confidential Information 
        to any third party without the prior written consent of the Company, except as expressly permitted 
        by this Agreement.
      </p>

      <p>
        <strong>2.2 Standard of Care.</strong> The Recipient shall protect Confidential Information using 
        the same degree of care that the Recipient uses to protect their own most sensitive confidential 
        information, but in no event less than a reasonable degree of care. The Recipient acknowledges that 
        due to their personal relationship with Company personnel, they may have access to information in 
        informal settings, and agrees that such informal access does not diminish the confidential nature 
        of the information.
      </p>

      <p>
        <strong>2.3 Limited Use.</strong> The Recipient shall use Confidential Information solely for the 
        purpose of performing services for or providing advice to the Company ("Permitted Purpose") and 
        for no other purpose whatsoever.
      </p>

      <p>
        <strong>2.4 No Copies.</strong> The Recipient shall not copy, reproduce, or duplicate any Confidential 
        Information except as reasonably necessary for the Permitted Purpose, and all such copies shall be 
        subject to this Agreement.
      </p>

      <p>
        <strong>2.5 Security Measures.</strong> The Recipient shall implement and maintain appropriate 
        physical, technical, and administrative safeguards to protect Confidential Information, including:
      </p>

      <ul className="list-none ml-4">
        <li>(a) Using strong, unique passwords and enabling two-factor authentication on all accounts 
        that may access Confidential Information;</li>
        <li>(b) Not accessing Confidential Information on public or unsecured networks;</li>
        <li>(c) Securing all devices containing Confidential Information with encryption and password protection;</li>
        <li>(d) Immediately reporting any suspected security breach or unauthorized access to the Company.</li>
      </ul>

      <p>
        <strong>2.6 Required Disclosures.</strong> If the Recipient is legally compelled to disclose any 
        Confidential Information, the Recipient shall: (a) provide prompt written notice to the Company to 
        enable the Company to seek a protective order or other appropriate remedy; (b) cooperate with the 
        Company in seeking such protection; and (c) disclose only such portion of the Confidential Information 
        as is legally required.
      </p>

      <hr className="my-6" />

      <h2 className="text-xl font-bold">ARTICLE 3: INTELLECTUAL PROPERTY ASSIGNMENT</h2>

      <p>
        <strong>3.1 Work Product Assignment.</strong> The Recipient hereby irrevocably assigns and transfers 
        to the Company all right, title, and interest in and to any and all Intellectual Property that the 
        Recipient creates, develops, invents, or contributes to, whether solely or jointly with others, that:
      </p>

      <ul className="list-none ml-4">
        <li>(a) Relates to the Company's actual or anticipated business, research, or development;</li>
        <li>(b) Results from work performed for the Company;</li>
        <li>(c) Uses or incorporates any Confidential Information;</li>
        <li>(d) Is developed using any Company resources, facilities, or equipment.</li>
      </ul>

      <p>
        <strong>3.2 Moral Rights Waiver.</strong> To the extent permitted by applicable law, the Recipient 
        hereby waives any and all moral rights in any Work Product, including rights of attribution and 
        integrity.
      </p>

      <p>
        <strong>3.3 Further Assurances.</strong> The Recipient agrees to execute any documents and take any 
        actions reasonably requested by the Company to perfect, register, or enforce the Company's rights 
        in any Work Product, including patent applications, copyright registrations, and assignments. If 
        the Recipient is unable or unwilling to execute such documents, the Recipient hereby irrevocably 
        designates and appoints the Company and its officers as the Recipient's agent and attorney-in-fact 
        to execute such documents on the Recipient's behalf.
      </p>

      <p>
        <strong>3.4 Prior Inventions.</strong> Any Intellectual Property that the Recipient owned prior to 
        the Effective Date ("Prior Inventions") is excluded from this assignment only if listed in 
        Exhibit A attached hereto. If no Exhibit A is attached, the Recipient represents that there are 
        no Prior Inventions.
      </p>

      <hr className="my-6" />

      <h2 className="text-xl font-bold">ARTICLE 4: NON-COMPETITION</h2>

      <p>
        <strong>4.1 Non-Competition Covenant.</strong> During the Recipient's engagement with the Company 
        and for a period of twenty-four (24) months following the termination of such engagement for any 
        reason, the Recipient shall not, directly or indirectly:
      </p>

      <ul className="list-none ml-4">
        <li>(a) Engage in, own, manage, operate, control, be employed by, consult for, or participate in 
        the ownership, management, operation, or control of any business that competes with the Company's 
        PaaS platform, community marketplace technology, or circular economy infrastructure;</li>
        <li>(b) Develop, market, sell, or license any product or service that is substantially similar to 
        or competitive with any product or service offered by the Company;</li>
        <li>(c) Replicate, clone, or create derivative works of any of the Company's proprietary systems, 
        including but not limited to CMAL, Voice AI, Susu Circles, Economic Karma, or the API licensing 
        infrastructure.</li>
      </ul>

      <p>
        <strong>4.2 Geographic Scope.</strong> The restrictions in Section 4.1 shall apply worldwide, as 
        the Company operates a digital platform accessible globally via the internet.
      </p>

      <p>
        <strong>4.3 Reasonableness.</strong> The Recipient acknowledges that: (a) the restrictions in this 
        Article are reasonable and necessary to protect the Company's legitimate business interests; (b) the 
        Recipient has had the opportunity to negotiate these terms; and (c) the Recipient has skills and 
        abilities that will enable them to obtain other employment or business opportunities.
      </p>

      <hr className="my-6" />

      <h2 className="text-xl font-bold">ARTICLE 5: NON-SOLICITATION</h2>

      <p>
        <strong>5.1 Non-Solicitation of Employees.</strong> During the Recipient's engagement with the 
        Company and for a period of twenty-four (24) months thereafter, the Recipient shall not, directly 
        or indirectly, recruit, solicit, or induce any employee, contractor, or advisor of the Company to 
        terminate their relationship with the Company or to become employed by or provide services to any 
        other person or entity.
      </p>

      <p>
        <strong>5.2 Non-Solicitation of Customers.</strong> During the Recipient's engagement with the 
        Company and for a period of twenty-four (24) months thereafter, the Recipient shall not, directly 
        or indirectly, solicit, divert, or take away any customer, client, vendor, or business partner of 
        the Company with whom the Recipient had contact or about whom the Recipient received Confidential 
        Information.
      </p>

      <p>
        <strong>5.3 Non-Interference.</strong> The Recipient shall not, directly or indirectly, interfere 
        with, disrupt, or attempt to disrupt any existing or prospective business relationship between the 
        Company and any third party.
      </p>

      <hr className="my-6" />

      <h2 className="text-xl font-bold">ARTICLE 6: RETURN OF MATERIALS</h2>

      <p>
        <strong>6.1 Return Obligation.</strong> Upon the termination of the Recipient's engagement with the 
        Company for any reason, or upon the Company's request at any time, the Recipient shall immediately:
      </p>

      <ul className="list-none ml-4">
        <li>(a) Return to the Company all documents, materials, equipment, and other property belonging to 
        the Company or containing Confidential Information;</li>
        <li>(b) Permanently delete all electronic files containing Confidential Information from all devices, 
        systems, and cloud storage under the Recipient's control;</li>
        <li>(c) Provide written certification of compliance with this Section.</li>
      </ul>

      <p>
        <strong>6.2 No Retention.</strong> The Recipient shall not retain any copies, extracts, or summaries 
        of Confidential Information in any form whatsoever.
      </p>

      <hr className="my-6" />

      <h2 className="text-xl font-bold">ARTICLE 7: REMEDIES</h2>

      <p>
        <strong>7.1 Injunctive Relief.</strong> The Recipient acknowledges and agrees that:
      </p>

      <ul className="list-none ml-4">
        <li>(a) The Confidential Information is unique and valuable, and its unauthorized disclosure or use 
        would cause irreparable harm to the Company for which monetary damages would be inadequate;</li>
        <li>(b) In the event of any actual or threatened breach of this Agreement, the Company shall be 
        entitled to seek injunctive relief, specific performance, and other equitable remedies without the 
        necessity of proving actual damages or posting a bond;</li>
        <li>(c) Such equitable remedies shall be in addition to, and not in lieu of, any other remedies 
        available at law or in equity.</li>
      </ul>

      <p>
        <strong>7.2 Monetary Damages.</strong> In addition to equitable relief, the Company shall be entitled 
        to recover all damages caused by any breach of this Agreement, including:
      </p>

      <ul className="list-none ml-4">
        <li>(a) Actual damages, including lost profits, lost business opportunities, and diminution in value;</li>
        <li>(b) Consequential and incidental damages;</li>
        <li>(c) Disgorgement of any profits or benefits obtained by the Recipient as a result of the breach;</li>
        <li>(d) Punitive or exemplary damages to the fullest extent permitted by law.</li>
      </ul>

      <p>
        <strong>7.3 Attorneys' Fees.</strong> In any action to enforce this Agreement, the prevailing party 
        shall be entitled to recover its reasonable attorneys' fees, costs, and expenses.
      </p>

      <p>
        <strong>7.4 Tolling.</strong> If the Recipient violates any provision of Articles 4 or 5, the 
        applicable restricted period shall be extended by the duration of such violation.
      </p>

      <hr className="my-6" />

      <h2 className="text-xl font-bold">ARTICLE 8: TERM AND SURVIVAL</h2>

      <p>
        <strong>8.1 Term.</strong> This Agreement shall commence on the Effective Date and shall continue 
        until terminated by either Party upon thirty (30) days' written notice.
      </p>

      <p>
        <strong>8.2 Survival.</strong> The obligations of confidentiality set forth in Article 2 shall 
        survive termination of this Agreement and shall continue for a period of ten (10) years from the 
        date of disclosure of the applicable Confidential Information, or for so long as the Confidential 
        Information remains a trade secret under applicable law, whichever is longer. The provisions of 
        Articles 3, 4, 5, 6, 7, 9, 10, and 11 shall survive termination of this Agreement indefinitely 
        or for the periods specified therein.
      </p>

      <hr className="my-6" />

      <h2 className="text-xl font-bold">ARTICLE 9: REPRESENTATIONS AND WARRANTIES</h2>

      <p><strong>9.1 Recipient's Representations.</strong> The Recipient represents and warrants that:</p>

      <ul className="list-none ml-4">
        <li>(a) The Recipient has the legal capacity and authority to enter into this Agreement;</li>
        <li>(b) This Agreement does not conflict with any other agreement to which the Recipient is a party;</li>
        <li>(c) The Recipient has not previously disclosed any Confidential Information to any third party;</li>
        <li>(d) The Recipient understands that the personal relationship between the Recipient and Company 
        personnel does not create any exception to or modification of the obligations contained herein;</li>
        <li>(e) The Recipient has had the opportunity to seek independent legal advice prior to signing 
        this Agreement.</li>
      </ul>

      <hr className="my-6" />

      <h2 className="text-xl font-bold">ARTICLE 10: GOVERNING LAW AND DISPUTE RESOLUTION</h2>

      <p>
        <strong>10.1 Governing Law.</strong> This Agreement shall be governed by and construed in accordance 
        with the laws of the State of Illinois, without regard to its conflict of laws principles.
      </p>

      <p>
        <strong>10.2 Jurisdiction.</strong> The Parties hereby irrevocably submit to the exclusive jurisdiction 
        of the state and federal courts located in Cook County, Illinois, for any action arising out of or 
        relating to this Agreement. The Parties waive any objection to venue in such courts.
      </p>

      <p>
        <strong>10.3 Waiver of Jury Trial.</strong> EACH PARTY HEREBY IRREVOCABLY WAIVES ANY RIGHT TO A JURY 
        TRIAL IN ANY ACTION OR PROCEEDING ARISING OUT OF OR RELATING TO THIS AGREEMENT.
      </p>

      <hr className="my-6" />

      <h2 className="text-xl font-bold">ARTICLE 11: GENERAL PROVISIONS</h2>

      <p>
        <strong>11.1 Entire Agreement.</strong> This Agreement constitutes the entire agreement between the 
        Parties with respect to the subject matter hereof and supersedes all prior and contemporaneous 
        agreements, understandings, negotiations, and discussions, whether oral or written.
      </p>

      <p>
        <strong>11.2 Amendment.</strong> This Agreement may only be amended or modified by a written 
        instrument signed by both Parties.
      </p>

      <p>
        <strong>11.3 Waiver.</strong> No waiver of any provision of this Agreement shall be effective unless 
        in writing and signed by the waiving Party. No waiver shall be deemed a continuing waiver or a 
        waiver of any other provision.
      </p>

      <p>
        <strong>11.4 Severability.</strong> If any provision of this Agreement is held to be invalid, illegal, 
        or unenforceable, such provision shall be modified to the minimum extent necessary to make it valid, 
        legal, and enforceable, and the remaining provisions shall continue in full force and effect. The 
        Parties expressly authorize any court of competent jurisdiction to reform any overbroad provision 
        to the extent necessary to make it enforceable.
      </p>

      <p>
        <strong>11.5 Assignment.</strong> The Recipient may not assign or transfer this Agreement or any 
        rights or obligations hereunder without the prior written consent of the Company. The Company may 
        freely assign this Agreement to any successor in interest.
      </p>

      <p>
        <strong>11.6 Notices.</strong> All notices under this Agreement shall be in writing and shall be 
        deemed given when delivered personally, sent by certified mail (return receipt requested), or sent 
        by overnight courier to the addresses set forth above or to such other address as a Party may 
        designate in writing.
      </p>

      <p>
        <strong>11.7 Counterparts.</strong> This Agreement may be executed in counterparts, each of which 
        shall be deemed an original, and all of which together shall constitute one and the same instrument. 
        Electronic signatures shall be deemed valid and binding.
      </p>

      <p>
        <strong>11.8 No Employment Relationship.</strong> Nothing in this Agreement shall be construed to 
        create an employment relationship between the Parties. The Recipient's engagement is as an independent 
        contractor, advisor, or volunteer, as applicable.
      </p>

      <p>
        <strong>11.9 Third-Party Beneficiaries.</strong> {inventorName}, as the founder and principal inventor 
        of the Company's technology, is an intended third-party beneficiary of this Agreement with the right 
        to enforce its provisions.
      </p>

      <hr className="my-6" />

      <h2 className="text-xl font-bold">ARTICLE 12: ACKNOWLEDGMENTS</h2>

      <p><strong>12.1 Voluntary Execution.</strong> The Recipient acknowledges that:</p>

      <ul className="list-none ml-4">
        <li>(a) The Recipient has carefully read and fully understands all provisions of this Agreement;</li>
        <li>(b) The Recipient is signing this Agreement voluntarily and of their own free will;</li>
        <li>(c) The Recipient has had a reasonable opportunity to consult with independent legal counsel 
        before signing;</li>
        <li>(d) The Recipient's personal relationship with Company personnel does not excuse non-compliance 
        with this Agreement;</li>
        <li>(e) Violation of this Agreement may result in civil liability, including substantial monetary 
        damages, and may also constitute criminal conduct under applicable trade secret laws.</li>
      </ul>

      <hr className="my-6" />

      <div className="mt-8 border-t pt-6">
        <p className="font-bold text-center mb-6">SIGNATURE PAGE</p>
        
        <p className="mb-4">
          <strong>IN WITNESS WHEREOF</strong>, the Parties have executed this Agreement as of the Effective Date.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-8">
          <div className="border rounded-lg p-4">
            <p className="font-bold mb-4">{companyName}</p>
            <div className="space-y-4">
              <div>
                <p className="text-sm text-muted-foreground mb-1">Signature:</p>
                <div className="border-b border-foreground h-8"></div>
              </div>
              <div>
                <p className="text-sm text-muted-foreground mb-1">Name: {inventorName}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground mb-1">Title: Founder & Chief Architect</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground mb-1">Date:</p>
                <div className="border-b border-foreground h-6 w-48"></div>
              </div>
            </div>
          </div>

          <div className="border rounded-lg p-4">
            <p className="font-bold mb-4">RECIPIENT</p>
            <div className="space-y-4">
              <div>
                <p className="text-sm text-muted-foreground mb-1">Signature:</p>
                <div className="border-b border-foreground h-8"></div>
              </div>
              <div>
                <p className="text-sm text-muted-foreground mb-1">Printed Name:</p>
                <div className="border-b border-foreground h-6 w-48"></div>
              </div>
              <div>
                <p className="text-sm text-muted-foreground mb-1">Address:</p>
                <div className="border-b border-foreground h-6 w-full"></div>
                <div className="border-b border-foreground h-6 w-full mt-2"></div>
              </div>
              <div>
                <p className="text-sm text-muted-foreground mb-1">Date:</p>
                <div className="border-b border-foreground h-6 w-48"></div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <hr className="my-6" />

      <div className="mt-8">
        <h2 className="text-xl font-bold">EXHIBIT A: PRIOR INVENTIONS</h2>
        <p className="text-sm text-muted-foreground mb-4">
          (To be completed by Recipient. If none, write "NONE".)
        </p>
        <div className="border rounded-lg p-4 min-h-[150px]">
          <div className="border-b border-dashed border-muted-foreground h-6 w-full mb-2"></div>
          <div className="border-b border-dashed border-muted-foreground h-6 w-full mb-2"></div>
          <div className="border-b border-dashed border-muted-foreground h-6 w-full mb-2"></div>
          <div className="border-b border-dashed border-muted-foreground h-6 w-full mb-2"></div>
        </div>
      </div>

      <div className="mt-8 text-center text-xs text-muted-foreground border-t pt-4">
        <p>CONFIDENTIAL — {companyName}</p>
        <p>Patent Pending: USPTO Application No. 63/969,202</p>
        <p>© {new Date().getFullYear()} {companyName}. All rights reserved.</p>
      </div>
    </div>
  );
};

export default TeamNDADocument;
