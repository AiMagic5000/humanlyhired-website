import { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Terms of Service",
  description:
    "Terms and conditions governing the use of Brand Metrics LLC website and staffing services. Please read these terms carefully before using our services.",
};

const effectiveDate = "January 13, 2026";
const lastUpdated = "January 13, 2026";

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <section className="bg-gradient-to-br from-blue-600 to-blue-800 py-16">
        <div className="mx-auto max-w-4xl px-4 lg:px-8">
          <h1 className="text-4xl font-bold text-white">Terms of Service</h1>
          <p className="mt-4 text-blue-100 text-lg">
            Please read these terms carefully before using our services.
          </p>
          <div className="mt-6 flex flex-wrap gap-4 text-sm text-blue-200">
            <span>
              <strong className="text-white">Effective Date:</strong>{" "}
              {effectiveDate}
            </span>
            <span>|</span>
            <span>
              <strong className="text-white">Last Updated:</strong>{" "}
              {lastUpdated}
            </span>
          </div>
        </div>
      </section>

      <div className="mx-auto max-w-4xl px-4 py-12 lg:px-8">
        {/* Important Notice */}
        <div className="mb-12 rounded-xl border border-amber-200 bg-amber-50 p-6">
          <h2 className="text-lg font-semibold text-amber-900">
            Important Legal Notice
          </h2>
          <p className="mt-2 text-amber-800">
            These Terms of Service constitute a legally binding agreement
            between you and Brand Metrics LLC By accessing or using our
            website or services, you agree to be bound by these terms. This
            agreement contains an arbitration clause and class action waiver
            that affect your legal rights. Please review Sections 16 and 17
            carefully.
          </p>
        </div>

        {/* Table of Contents */}
        <nav className="mb-12 rounded-xl border border-gray-200 bg-gray-50 p-6">
          <h2 className="text-lg font-semibold text-gray-900">
            Table of Contents
          </h2>
          <ol className="mt-4 columns-1 gap-6 space-y-2 text-sm md:columns-2">
            {[
              { num: "1", title: "Acceptance of Terms" },
              { num: "2", title: "Description of Services" },
              { num: "3", title: "User Accounts and Registration" },
              { num: "4", title: "Employer Responsibilities" },
              { num: "5", title: "Candidate Responsibilities" },
              { num: "6", title: "Fees and Payment Terms" },
              { num: "7", title: "Intellectual Property Rights" },
              { num: "8", title: "User Content and Submissions" },
              { num: "9", title: "Prohibited Conduct" },
              { num: "10", title: "Third-Party Links and Services" },
              { num: "11", title: "Disclaimers and No Warranties" },
              { num: "12", title: "Limitation of Liability" },
              { num: "13", title: "Indemnification" },
              { num: "14", title: "Confidentiality" },
              { num: "15", title: "Governing Law" },
              { num: "16", title: "Dispute Resolution and Arbitration" },
              { num: "17", title: "Class Action Waiver" },
              { num: "18", title: "Termination" },
              { num: "19", title: "Service Modifications" },
              { num: "20", title: "General Provisions" },
              { num: "21", title: "Contact Information" },
            ].map((item) => (
              <li key={item.num}>
                <a
                  href={`#section-${item.num}`}
                  className="text-blue-600 hover:text-blue-800 hover:underline"
                >
                  {item.num}. {item.title}
                </a>
              </li>
            ))}
          </ol>
        </nav>

        {/* Terms Content */}
        <div className="prose prose-lg max-w-none prose-headings:scroll-mt-20 prose-h2:text-2xl prose-h2:font-bold prose-h2:text-gray-900 prose-h2:border-b prose-h2:border-gray-200 prose-h2:pb-3 prose-h3:text-xl prose-h3:font-semibold prose-h3:text-gray-800 prose-p:text-gray-700 prose-li:text-gray-700">
          {/* Section 1 */}
          <section id="section-1" className="mb-12">
            <h2>1. Acceptance of Terms</h2>
            <p>
              <strong>1.1 Agreement.</strong> These Terms of Service
              (&quot;Terms,&quot; &quot;Agreement,&quot; or &quot;Terms of
              Service&quot;) constitute a legally binding agreement between you
              (&quot;User,&quot; &quot;you,&quot; or &quot;your&quot;) and
              Brand Metrics LLC, a Wyoming corporation (&quot;Company,&quot;
              &quot;we,&quot; &quot;our,&quot; or &quot;us&quot;), governing your
              access to and use of the Company&apos;s website located at
              humanlyhired.com (the &quot;Website&quot;), mobile applications,
              and all related staffing and recruitment services (collectively,
              the &quot;Services&quot;).
            </p>
            <p>
              <strong>1.2 Acceptance.</strong> By accessing or using the
              Services, creating an account, clicking &quot;I Agree,&quot; or
              otherwise indicating acceptance of these Terms, you acknowledge
              that you have read, understood, and agree to be bound by these
              Terms and our{" "}
              <Link href="/privacy" className="text-blue-600 hover:underline">
                Privacy Policy
              </Link>
              , which is incorporated herein by reference. If you do not agree
              to these Terms, you must not access or use the Services.
            </p>
            <p>
              <strong>1.3 Capacity.</strong> By accepting these Terms, you
              represent and warrant that: (a) you are at least eighteen (18)
              years of age or the legal age of majority in your jurisdiction;
              (b) you have the legal capacity to enter into a binding agreement;
              (c) if accepting on behalf of an organization, you have the
              authority to bind that organization to these Terms; and (d) your
              use of the Services does not violate any applicable law or
              regulation.
            </p>
            <p>
              <strong>1.4 Electronic Agreement.</strong> You consent to receive
              communications from us electronically, and you agree that all
              agreements, notices, disclosures, and other communications that we
              provide to you electronically satisfy any legal requirement that
              such communications be in writing.
            </p>
            <p>
              <strong>1.5 Modifications.</strong> We reserve the right to modify
              these Terms at any time in our sole discretion. We will notify you
              of material changes by posting the updated Terms on our Website
              with a new &quot;Last Updated&quot; date, and, where appropriate,
              by sending you an email notification. Your continued use of the
              Services after any modifications indicates your acceptance of the
              modified Terms. If you do not agree to the modified Terms, you
              must discontinue use of the Services.
            </p>
          </section>

          {/* Section 2 */}
          <section id="section-2" className="mb-12">
            <h2>2. Description of Services</h2>
            <p>
              <strong>2.1 Services Overview.</strong> Brand Metrics LLC is a
              professional staffing and recruitment agency that connects job
              seekers (&quot;Candidates&quot;) with employers
              (&quot;Employers&quot; or &quot;Clients&quot;). Our Services
              include, but are not limited to:
            </p>
            <ul>
              <li>
                <strong>Executive Search:</strong> Retained and contingency
                search services for senior-level and executive positions
              </li>
              <li>
                <strong>Contract Staffing:</strong> Temporary and contract
                placement services for project-based or interim staffing needs
              </li>
              <li>
                <strong>Direct Hire Placement:</strong> Permanent placement
                services to help employers fill full-time positions
              </li>
              <li>
                <strong>Recruitment Process Outsourcing (RPO):</strong>{" "}
                End-to-end recruitment management services for enterprise
                clients
              </li>
              <li>
                <strong>Talent Sourcing:</strong> Candidate identification,
                screening, and qualification services
              </li>
              <li>
                <strong>Payroll Services:</strong> Payroll processing and
                administration for contract employees
              </li>
            </ul>

            <p>
              <strong>2.2 Service Limitations.</strong> The Services are
              provided to facilitate connections between Candidates and
              Employers. We do not guarantee employment for any Candidate, nor
              do we guarantee that Employers will find suitable candidates for
              any position. We act as an intermediary and are not a party to any
              employment relationship between Candidates and Employers.
            </p>

            <p>
              <strong>2.3 Service Availability.</strong> We strive to ensure
              that the Services are available at all times but do not guarantee
              uninterrupted or error-free operation. We reserve the right to
              suspend, modify, or discontinue any aspect of the Services at any
              time without prior notice or liability.
            </p>

            <p>
              <strong>2.4 Geographic Scope.</strong> Our Services are primarily
              offered to users within the United States. We make no
              representation that the Services are appropriate or available for
              use in other locations. Users who access the Services from outside
              the United States do so at their own risk and are responsible for
              compliance with local laws.
            </p>
          </section>

          {/* Section 3 */}
          <section id="section-3" className="mb-12">
            <h2>3. User Accounts and Registration</h2>
            <p>
              <strong>3.1 Account Creation.</strong> Certain features of the
              Services may require you to create an account. When creating an
              account, you agree to provide accurate, current, and complete
              information as prompted by the registration form, and to update
              such information to keep it accurate, current, and complete.
            </p>
            <p>
              <strong>3.2 Account Security.</strong> You are responsible for
              maintaining the confidentiality of your account credentials,
              including your username and password. You agree to: (a) use a
              strong, unique password; (b) not share your account credentials
              with any third party; (c) immediately notify us of any
              unauthorized use of your account or any other security breach; and
              (d) ensure that you log out of your account at the end of each
              session. You are solely responsible for all activities that occur
              under your account.
            </p>
            <p>
              <strong>3.3 Account Types.</strong> We offer different account
              types for Candidates and Employers, each with specific features
              and functionalities. You agree to use the appropriate account type
              for your intended purpose and not to misrepresent your status as a
              Candidate or Employer.
            </p>
            <p>
              <strong>3.4 Verification.</strong> We reserve the right to verify
              the information you provide and to request additional
              documentation to confirm your identity, qualifications, or
              authority to act on behalf of an organization. Failure to provide
              requested verification may result in suspension or termination of
              your account.
            </p>
            <p>
              <strong>3.5 Account Termination.</strong> We reserve the right to
              suspend or terminate your account at any time, with or without
              cause, and with or without notice. You may terminate your account
              at any time by contacting us. Upon termination, your right to
              access the Services will immediately cease, but certain provisions
              of these Terms will survive termination as set forth in Section
              18.
            </p>
          </section>

          {/* Section 4 */}
          <section id="section-4" className="mb-12">
            <h2>4. Employer Responsibilities</h2>
            <p>
              <strong>4.1 Accurate Information.</strong> Employers agree to
              provide accurate and complete information regarding job
              opportunities, including but not limited to job descriptions,
              qualifications, compensation, benefits, and working conditions.
              Employers shall not misrepresent any material aspect of a position
              or their organization.
            </p>
            <p>
              <strong>4.2 Legal Compliance.</strong> Employers agree to comply
              with all applicable federal, state, and local laws and
              regulations, including but not limited to:
            </p>
            <ul>
              <li>
                Title VII of the Civil Rights Act of 1964 (prohibition of
                discrimination based on race, color, religion, sex, or national
                origin)
              </li>
              <li>
                Age Discrimination in Employment Act (ADEA) (prohibition of
                discrimination against individuals 40 years of age or older)
              </li>
              <li>
                Americans with Disabilities Act (ADA) (prohibition of
                discrimination against qualified individuals with disabilities)
              </li>
              <li>
                Fair Labor Standards Act (FLSA) (minimum wage, overtime, and
                child labor requirements)
              </li>
              <li>
                Immigration Reform and Control Act (IRCA) (employment
                eligibility verification requirements)
              </li>
              <li>
                Equal Employment Opportunity laws at the federal, state, and
                local level
              </li>
              <li>
                State and local employment laws, including pay equity and ban
                the box laws
              </li>
            </ul>
            <p>
              <strong>4.3 Non-Discrimination.</strong> Employers agree not to
              discriminate against any Candidate on the basis of race, color,
              religion, sex, sexual orientation, gender identity, national
              origin, age, disability, veteran status, genetic information, or
              any other characteristic protected by applicable law.
            </p>
            <p>
              <strong>4.4 Candidate Information.</strong> Employers agree to
              maintain the confidentiality of Candidate information provided
              through our Services, to use such information solely for
              legitimate hiring purposes, and not to share Candidate information
              with unauthorized third parties.
            </p>
            <p>
              <strong>4.5 Direct Contact Prohibition.</strong> Unless otherwise
              agreed in writing, Employers agree not to solicit, hire, or engage
              Candidates introduced through our Services without using our
              placement services, during the period specified in the applicable
              service agreement (typically twelve (12) months from the date of
              introduction).
            </p>
            <p>
              <strong>4.6 Fees.</strong> Employers agree to pay all applicable
              fees as set forth in Section 6 and the applicable service
              agreement. Failure to pay fees when due may result in suspension
              of Services and collection actions.
            </p>
          </section>

          {/* Section 5 */}
          <section id="section-5" className="mb-12">
            <h2>5. Candidate Responsibilities</h2>
            <p>
              <strong>5.1 Accurate Information.</strong> Candidates agree to
              provide accurate, truthful, and complete information in all
              applications, resumes, and communications. This includes, but is
              not limited to, employment history, education, certifications,
              skills, and references. Misrepresentation of qualifications may
              result in immediate termination of your account and any employment
              placement.
            </p>
            <p>
              <strong>5.2 Availability.</strong> Candidates agree to accurately
              represent their availability for employment and to promptly notify
              us of any changes to their availability, employment status, or
              contact information.
            </p>
            <p>
              <strong>5.3 Professional Conduct.</strong> Candidates agree to
              conduct themselves professionally in all interactions with
              potential employers, including interviews, communications, and
              work assignments. This includes being punctual, prepared, and
              appropriately attired for interviews and work assignments.
            </p>
            <p>
              <strong>5.4 Background Checks.</strong> Candidates acknowledge and
              consent that Employers and/or the Company may conduct background
              checks, including but not limited to criminal history, employment
              verification, education verification, credit checks (where
              permitted by law), and drug screening. Candidates agree to
              cooperate with such checks and to provide any required
              authorizations.
            </p>
            <p>
              <strong>5.5 Confidentiality.</strong> Candidates agree to maintain
              the confidentiality of any proprietary or confidential information
              of the Company, Employers, or other Candidates that they may
              receive in connection with the Services.
            </p>
            <p>
              <strong>5.6 Exclusive Representation.</strong> During any active
              placement process, Candidates agree not to apply for the same
              position through other staffing agencies or directly with the
              Employer if they have been submitted by the Company, unless they
              first notify the Company in writing.
            </p>
            <p>
              <strong>5.7 No Fee to Candidates.</strong> The Company does not
              charge fees to Candidates for job placement services. Candidates
              should never be asked to pay for the opportunity to interview or
              be considered for a position.
            </p>
          </section>

          {/* Section 6 */}
          <section id="section-6" className="mb-12">
            <h2>6. Fees and Payment Terms</h2>
            <p>
              <strong>6.1 Employer Fees.</strong> Fees for staffing services are
              charged to Employers and are set forth in individual service
              agreements. Fee structures may include:
            </p>
            <ul>
              <li>
                <strong>Direct Hire Placement Fees:</strong> Calculated as a
                percentage of the placed candidate&apos;s first-year annual
                compensation
              </li>
              <li>
                <strong>Contract Staffing Rates:</strong> Hourly bill rates that
                include the contractor&apos;s pay rate plus a markup for our
                services, employer taxes, insurance, and administration
              </li>
              <li>
                <strong>Retained Search Fees:</strong> Engagement fees and
                completion fees for executive search assignments
              </li>
              <li>
                <strong>RPO Fees:</strong> Monthly management fees and/or
                per-hire fees as specified in the RPO agreement
              </li>
            </ul>
            <p>
              <strong>6.2 Payment Terms.</strong> Unless otherwise specified in
              the applicable service agreement: (a) invoices for direct hire
              placements are due upon candidate start date; (b) contract
              staffing invoices are issued weekly or bi-weekly and are due net
              thirty (30) days; (c) late payments may be subject to interest at
              the rate of one and one-half percent (1.5%) per month or the
              maximum rate permitted by law, whichever is less.
            </p>
            <p>
              <strong>6.3 Placement Guarantee.</strong> Direct hire placements
              are subject to our standard guarantee period as specified in the
              service agreement (typically ninety (90) days). If a placed
              candidate voluntarily resigns or is terminated for cause during
              the guarantee period, we will provide a replacement candidate at
              no additional fee or issue a prorated refund, at our discretion,
              subject to the terms and conditions of the service agreement.
            </p>
            <p>
              <strong>6.4 Conversion Fees.</strong> If an Employer wishes to
              convert a contract employee to a permanent, direct-hire position,
              a conversion fee will apply as specified in the service agreement.
              The conversion fee is typically calculated based on the number of
              hours worked and the remaining contract term.
            </p>
            <p>
              <strong>6.5 Taxes.</strong> All fees are exclusive of taxes. You
              are responsible for paying all applicable sales, use, value-added,
              and other taxes, except for taxes based on our net income.
            </p>
            <p>
              <strong>6.6 Disputes.</strong> Any fee disputes must be submitted
              in writing within thirty (30) days of the invoice date. Failure to
              dispute an invoice within this period constitutes acceptance of
              the charges.
            </p>
          </section>

          {/* Section 7 */}
          <section id="section-7" className="mb-12">
            <h2>7. Intellectual Property Rights</h2>
            <p>
              <strong>7.1 Company Intellectual Property.</strong> The Services,
              including the Website, all content, features, functionality, user
              interfaces, designs, graphics, logos, trademarks, service marks,
              trade names, domain names, taglines, software, code, data
              compilations, and all intellectual property rights therein, are
              owned by the Company or its licensors and are protected by United
              States and international copyright, trademark, patent, trade
              secret, and other intellectual property laws.
            </p>
            <p>
              <strong>7.2 Limited License.</strong> Subject to your compliance
              with these Terms, we grant you a limited, non-exclusive,
              non-transferable, non-sublicensable, revocable license to access
              and use the Services solely for their intended purpose. This
              license does not include the right to: (a) modify, copy,
              distribute, transmit, display, perform, reproduce, publish,
              license, create derivative works from, transfer, or sell any
              content, information, software, or services obtained from the
              Services; (b) use any data mining, robots, or similar data
              gathering or extraction methods; or (c) use the Services for any
              commercial purpose not expressly authorized.
            </p>
            <p>
              <strong>7.3 Trademark Notice.</strong> &quot;Humanly Hired,&quot;
              &quot;Brand Metrics LLC,&quot; and related logos and designs
              are trademarks or service marks of the Company. You may not use
              any of our trademarks without our prior written consent.
            </p>
            <p>
              <strong>7.4 Feedback.</strong> If you provide us with any
              feedback, suggestions, ideas, or recommendations regarding the
              Services (&quot;Feedback&quot;), you hereby assign to us all
              right, title, and interest in and to such Feedback. We shall be
              free to use, disclose, reproduce, license, distribute, and
              otherwise commercialize the Feedback as we see fit, without any
              obligation or compensation to you.
            </p>
          </section>

          {/* Section 8 */}
          <section id="section-8" className="mb-12">
            <h2>8. User Content and Submissions</h2>
            <p>
              <strong>8.1 User Content.</strong> &quot;User Content&quot; means
              any content, materials, or information that you submit, post,
              upload, or transmit through the Services, including but not
              limited to resumes, job descriptions, profile information,
              communications, and any other content.
            </p>
            <p>
              <strong>8.2 Ownership.</strong> You retain ownership of your User
              Content. However, by submitting User Content, you grant us a
              worldwide, non-exclusive, royalty-free, sublicensable,
              transferable license to use, reproduce, distribute, prepare
              derivative works of, display, and perform your User Content in
              connection with the Services and our business operations.
            </p>
            <p>
              <strong>8.3 Representations.</strong> You represent and warrant
              that: (a) you own or have the necessary rights to submit your User
              Content and to grant the licenses described herein; (b) your User
              Content does not infringe any third party&apos;s intellectual
              property rights, privacy rights, or other rights; (c) your User
              Content does not contain any viruses, malware, or harmful code;
              and (d) your User Content is accurate and not misleading.
            </p>
            <p>
              <strong>8.4 Prohibited Content.</strong> You agree not to submit
              User Content that: (a) is unlawful, defamatory, obscene, or
              offensive; (b) promotes discrimination, hatred, or violence; (c)
              contains personal information of third parties without their
              consent; (d) constitutes spam, advertising, or solicitation; (e)
              impersonates any person or entity; or (f) violates these Terms or
              any applicable law.
            </p>
            <p>
              <strong>8.5 Removal.</strong> We reserve the right, but have no
              obligation, to review, monitor, edit, or remove any User Content
              at our sole discretion, without notice, for any reason, including
              but not limited to violation of these Terms.
            </p>
          </section>

          {/* Section 9 */}
          <section id="section-9" className="mb-12">
            <h2>9. Prohibited Conduct</h2>
            <p>
              <strong>9.1 General Prohibitions.</strong> You agree not to engage
              in any of the following prohibited activities:
            </p>
            <ul>
              <li>
                Violating any applicable federal, state, local, or international
                law or regulation
              </li>
              <li>
                Providing false, inaccurate, or misleading information
              </li>
              <li>
                Impersonating any person or entity, or falsely claiming an
                affiliation with any person or entity
              </li>
              <li>
                Harassing, threatening, intimidating, or stalking any other user
                or Company employee
              </li>
              <li>
                Posting or transmitting any content that is unlawful,
                defamatory, obscene, pornographic, discriminatory, or otherwise
                objectionable
              </li>
              <li>
                Interfering with or disrupting the Services, servers, or
                networks connected to the Services
              </li>
              <li>
                Attempting to gain unauthorized access to any portion of the
                Services, other accounts, computer systems, or networks
              </li>
              <li>
                Using any automated means (bots, scrapers, crawlers) to access
                the Services or collect information
              </li>
              <li>
                Circumventing any security measures or access controls
              </li>
              <li>
                Reverse engineering, decompiling, or disassembling any software
                or technology used in the Services
              </li>
              <li>
                Using the Services for any commercial purpose not expressly
                authorized
              </li>
              <li>
                Transmitting any viruses, worms, malware, or other harmful code
              </li>
              <li>
                Collecting or harvesting personal information of other users
              </li>
              <li>
                Engaging in any activity that could harm minors
              </li>
            </ul>
            <p>
              <strong>9.2 Staffing-Specific Prohibitions.</strong> In addition
              to the general prohibitions above, you specifically agree not to:
            </p>
            <ul>
              <li>
                Submit false or fraudulent job applications, resumes, or
                qualifications
              </li>
              <li>
                Post fictitious job opportunities or job scams
              </li>
              <li>
                Use the Services to recruit for multi-level marketing, pyramid
                schemes, or similar arrangements
              </li>
              <li>
                Contact Candidates for purposes other than legitimate employment
                opportunities
              </li>
              <li>
                Charge Candidates any fees for job placement or consideration
              </li>
              <li>
                Circumvent our placement fees by hiring Candidates introduced by
                us without using our services
              </li>
              <li>
                Share or resell Candidate information with unauthorized third
                parties
              </li>
            </ul>
            <p>
              <strong>9.3 Consequences.</strong> Violation of these prohibited
              conduct provisions may result in immediate suspension or
              termination of your account, legal action, and cooperation with
              law enforcement authorities as appropriate.
            </p>
          </section>

          {/* Section 10 */}
          <section id="section-10" className="mb-12">
            <h2>10. Third-Party Links and Services</h2>
            <p>
              <strong>10.1 Third-Party Content.</strong> The Services may
              contain links to third-party websites, applications, services, or
              resources (&quot;Third-Party Services&quot;) that are not owned or
              controlled by us. We provide these links only as a convenience and
              do not endorse or assume any responsibility for the content,
              privacy policies, or practices of any Third-Party Services.
            </p>
            <p>
              <strong>10.2 Third-Party Terms.</strong> Your use of Third-Party
              Services is subject to the terms and policies of those third
              parties. You acknowledge and agree that we are not responsible or
              liable, directly or indirectly, for any damage or loss caused or
              alleged to be caused by or in connection with the use of or
              reliance on any Third-Party Services.
            </p>
            <p>
              <strong>10.3 Third-Party Integrations.</strong> The Services may
              integrate with or rely upon Third-Party Services for certain
              functionality, including but not limited to payment processing,
              background checks, and authentication. Your use of such
              integrations is subject to the applicable third party&apos;s
              terms.
            </p>
            <p>
              <strong>10.4 Job Boards.</strong> Job postings on the Website may
              also appear on third-party job boards and aggregator sites. We are
              not responsible for the practices or content of these third-party
              sites.
            </p>
          </section>

          {/* Section 11 */}
          <section id="section-11" className="mb-12">
            <h2>11. Disclaimers and No Warranties</h2>
            <p>
              <strong>11.1 AS-IS BASIS.</strong> THE SERVICES ARE PROVIDED ON AN
              &quot;AS IS&quot; AND &quot;AS AVAILABLE&quot; BASIS WITHOUT
              WARRANTIES OF ANY KIND, EITHER EXPRESS OR IMPLIED, INCLUDING BUT
              NOT LIMITED TO IMPLIED WARRANTIES OF MERCHANTABILITY, FITNESS FOR
              A PARTICULAR PURPOSE, TITLE, AND NON-INFRINGEMENT.
            </p>
            <p>
              <strong>11.2 NO GUARANTEE.</strong> WE DO NOT WARRANT THAT: (A)
              THE SERVICES WILL BE UNINTERRUPTED, TIMELY, SECURE, OR ERROR-FREE;
              (B) THE RESULTS OBTAINED FROM USE OF THE SERVICES WILL BE ACCURATE
              OR RELIABLE; (C) ANY ERRORS IN THE SERVICES WILL BE CORRECTED; OR
              (D) THE SERVICES WILL MEET YOUR REQUIREMENTS OR EXPECTATIONS.
            </p>
            <p>
              <strong>11.3 EMPLOYMENT DISCLAIMER.</strong> WE DO NOT GUARANTEE
              EMPLOYMENT FOR ANY CANDIDATE, NOR DO WE GUARANTEE THAT EMPLOYERS
              WILL FIND SUITABLE CANDIDATES FOR ANY POSITION. WE ARE NOT
              RESPONSIBLE FOR THE CONDUCT, QUALIFICATIONS, OR SUITABILITY OF ANY
              CANDIDATE OR EMPLOYER.
            </p>
            <p>
              <strong>11.4 THIRD-PARTY DISCLAIMER.</strong> WE ARE NOT
              RESPONSIBLE FOR THE ACTIONS, CONTENT, INFORMATION, OR DATA OF
              THIRD PARTIES, INCLUDING OTHER USERS OF THE SERVICES. WE DISCLAIM
              ALL LIABILITY ARISING FROM YOUR INTERACTIONS WITH OTHER USERS OR
              THIRD PARTIES.
            </p>
            <p>
              <strong>11.5 JURISDICTIONAL LIMITATIONS.</strong> SOME
              JURISDICTIONS DO NOT ALLOW THE EXCLUSION OF IMPLIED WARRANTIES, SO
              SOME OF THE ABOVE EXCLUSIONS MAY NOT APPLY TO YOU. IN SUCH
              JURISDICTIONS, OUR LIABILITY IS LIMITED TO THE GREATEST EXTENT
              PERMITTED BY LAW.
            </p>
          </section>

          {/* Section 12 */}
          <section id="section-12" className="mb-12">
            <h2>12. Limitation of Liability</h2>
            <p>
              <strong>12.1 EXCLUSION OF DAMAGES.</strong> TO THE MAXIMUM EXTENT
              PERMITTED BY APPLICABLE LAW, IN NO EVENT SHALL THE COMPANY, ITS
              AFFILIATES, OFFICERS, DIRECTORS, EMPLOYEES, AGENTS, LICENSORS, OR
              SERVICE PROVIDERS BE LIABLE FOR ANY INDIRECT, INCIDENTAL, SPECIAL,
              CONSEQUENTIAL, EXEMPLARY, OR PUNITIVE DAMAGES, INCLUDING BUT NOT
              LIMITED TO DAMAGES FOR LOSS OF PROFITS, REVENUE, GOODWILL, USE,
              DATA, OR OTHER INTANGIBLE LOSSES, REGARDLESS OF THE CAUSE OF
              ACTION OR WHETHER WE HAVE BEEN ADVISED OF THE POSSIBILITY OF SUCH
              DAMAGES.
            </p>
            <p>
              <strong>12.2 CAP ON LIABILITY.</strong> TO THE MAXIMUM EXTENT
              PERMITTED BY APPLICABLE LAW, THE TOTAL LIABILITY OF THE COMPANY
              AND ITS AFFILIATES, OFFICERS, DIRECTORS, EMPLOYEES, AGENTS,
              LICENSORS, AND SERVICE PROVIDERS, FOR ANY CLAIMS ARISING OUT OF OR
              RELATED TO THESE TERMS OR THE SERVICES, WHETHER IN CONTRACT, TORT,
              STRICT LIABILITY, OR ANY OTHER THEORY, SHALL NOT EXCEED THE
              GREATER OF: (A) THE AMOUNTS PAID BY YOU TO THE COMPANY DURING THE
              TWELVE (12) MONTHS IMMEDIATELY PRECEDING THE CLAIM; OR (B) ONE
              THOUSAND DOLLARS ($1,000).
            </p>
            <p>
              <strong>12.3 ESSENTIAL PURPOSE.</strong> YOU ACKNOWLEDGE THAT THE
              LIMITATIONS OF LIABILITY IN THIS SECTION ARE AN ESSENTIAL ELEMENT
              OF THE BARGAIN BETWEEN YOU AND THE COMPANY, AND THAT THE COMPANY
              WOULD NOT PROVIDE THE SERVICES WITHOUT THESE LIMITATIONS.
            </p>
            <p>
              <strong>12.4 JURISDICTIONAL LIMITATIONS.</strong> SOME
              JURISDICTIONS DO NOT ALLOW THE EXCLUSION OR LIMITATION OF
              LIABILITY FOR CONSEQUENTIAL OR INCIDENTAL DAMAGES, SO SOME OF THE
              ABOVE LIMITATIONS MAY NOT APPLY TO YOU. IN SUCH JURISDICTIONS, OUR
              LIABILITY IS LIMITED TO THE GREATEST EXTENT PERMITTED BY LAW.
            </p>
          </section>

          {/* Section 13 */}
          <section id="section-13" className="mb-12">
            <h2>13. Indemnification</h2>
            <p>
              <strong>13.1 Your Indemnification Obligations.</strong> You agree
              to defend, indemnify, and hold harmless the Company and its
              affiliates, officers, directors, employees, agents, licensors, and
              service providers from and against any and all claims, damages,
              obligations, losses, liabilities, costs, and expenses (including
              but not limited to attorneys&apos; fees) arising from or related
              to:
            </p>
            <ul>
              <li>Your use of the Services</li>
              <li>
                Your User Content or any content you submit through the Services
              </li>
              <li>Your violation of these Terms</li>
              <li>
                Your violation of any applicable law, regulation, or
                third-party right
              </li>
              <li>
                Your interaction with other users, Candidates, or Employers
              </li>
              <li>
                Any employment-related claims arising from your hiring,
                employment, or termination of any Candidate placed through our
                Services (for Employers)
              </li>
              <li>
                Any misrepresentation of your qualifications, experience, or
                identity (for Candidates)
              </li>
            </ul>
            <p>
              <strong>13.2 Indemnification Procedure.</strong> We will provide
              you with prompt written notice of any claim subject to
              indemnification. You shall not settle any claim without our prior
              written consent if the settlement would impose any obligation or
              liability on us. We reserve the right, at our own expense, to
              assume the exclusive defense and control of any matter subject to
              indemnification, and you agree to cooperate with our defense of
              such claims.
            </p>
          </section>

          {/* Section 14 */}
          <section id="section-14" className="mb-12">
            <h2>14. Confidentiality</h2>
            <p>
              <strong>14.1 Confidential Information.</strong>{" "}
              &quot;Confidential Information&quot; means any non-public
              information disclosed by one party to the other in connection with
              the Services, whether oral, written, or electronic, that is
              designated as confidential or that reasonably should be understood
              to be confidential given the nature of the information and
              circumstances of disclosure. Confidential Information includes,
              but is not limited to, business plans, financial information,
              customer lists, pricing information, trade secrets, proprietary
              technology, and Candidate information.
            </p>
            <p>
              <strong>14.2 Obligations.</strong> Each party agrees to: (a) hold
              the other party&apos;s Confidential Information in confidence; (b)
              use the Confidential Information only for the purposes of the
              Services and these Terms; (c) not disclose the Confidential
              Information to any third party except as expressly permitted; and
              (d) protect the Confidential Information using at least the same
              degree of care it uses to protect its own confidential
              information, but no less than reasonable care.
            </p>
            <p>
              <strong>14.3 Exceptions.</strong> Confidential Information does
              not include information that: (a) is or becomes publicly available
              through no fault of the receiving party; (b) was known to the
              receiving party prior to disclosure; (c) is independently
              developed by the receiving party without use of the disclosing
              party&apos;s Confidential Information; or (d) is lawfully obtained
              from a third party without restriction.
            </p>
            <p>
              <strong>14.4 Required Disclosure.</strong> A party may disclose
              Confidential Information if required by law, regulation, or legal
              process, provided that the disclosing party gives the other party
              reasonable advance notice (to the extent permitted by law) to
              allow the other party to seek a protective order or other
              appropriate remedy.
            </p>
          </section>

          {/* Section 15 */}
          <section id="section-15" className="mb-12">
            <h2>15. Governing Law</h2>
            <p>
              <strong>15.1 Choice of Law.</strong> These Terms and any dispute
              arising out of or related to these Terms or the Services shall be
              governed by and construed in accordance with the laws of the State
              of Wyoming, United States, without giving effect to any choice or
              conflict of law provision or rule that would cause the application
              of the laws of any other jurisdiction.
            </p>
            <p>
              <strong>15.2 Venue.</strong> Subject to the arbitration provisions
              in Section 16, any legal action or proceeding arising out of or
              related to these Terms or the Services shall be brought
              exclusively in the state or federal courts located in Laramie
              County, Wyoming. You consent to the personal jurisdiction and
              venue of such courts and waive any objection to the laying of
              venue in such courts.
            </p>
            <p>
              <strong>15.3 Waiver of Jury Trial.</strong> TO THE MAXIMUM EXTENT
              PERMITTED BY APPLICABLE LAW, YOU AND THE COMPANY HEREBY WAIVE ANY
              RIGHT TO A JURY TRIAL IN ANY PROCEEDING ARISING OUT OF OR RELATED
              TO THESE TERMS OR THE SERVICES.
            </p>
          </section>

          {/* Section 16 */}
          <section id="section-16" className="mb-12">
            <h2>16. Dispute Resolution and Arbitration</h2>
            <p>
              <strong>16.1 Informal Resolution.</strong> Before initiating any
              formal dispute resolution proceeding, you agree to first contact
              us at contact@humanlyhired.com to attempt to resolve the
              dispute informally. We will attempt to resolve the dispute
              informally by contacting you via email. If the dispute is not
              resolved within thirty (30) days of submission, either party may
              proceed with the formal dispute resolution procedures below.
            </p>
            <p>
              <strong>16.2 Binding Arbitration.</strong> If informal resolution
              fails, any dispute, controversy, or claim arising out of or
              relating to these Terms or the Services, including the formation,
              interpretation, breach, termination, or validity thereof, shall be
              finally settled by binding arbitration administered by the
              American Arbitration Association (&quot;AAA&quot;) in accordance
              with its Commercial Arbitration Rules and Mediation Procedures (or
              Consumer Arbitration Rules if applicable).
            </p>
            <p>
              <strong>16.3 Arbitration Terms.</strong> The arbitration shall be
              conducted by a single arbitrator with expertise in commercial or
              employment matters. The arbitration shall be conducted in English
              and shall take place in Cheyenne, Wyoming, or at another location
              mutually agreed upon by the parties. The arbitrator&apos;s
              decision shall be final and binding and may be entered as a
              judgment in any court of competent jurisdiction.
            </p>
            <p>
              <strong>16.4 Costs.</strong> Each party shall bear its own costs
              and attorneys&apos; fees incurred in connection with the
              arbitration. The arbitrator&apos;s fees and expenses shall be
              shared equally by the parties, except that if you are a consumer,
              the Company will pay any arbitration fees and costs that exceed
              the amount you would have paid to file a claim in court.
            </p>
            <p>
              <strong>16.5 Exceptions.</strong> Notwithstanding the foregoing:
              (a) either party may bring an individual action in small claims
              court if the claim qualifies; (b) either party may seek injunctive
              or other equitable relief in a court of competent jurisdiction to
              prevent the actual or threatened infringement, misappropriation,
              or violation of intellectual property rights or confidential
              information; and (c) claims for unpaid fees may be pursued in
              court or through arbitration at the Company&apos;s election.
            </p>
            <p>
              <strong>16.6 Opt-Out.</strong> You may opt out of this arbitration
              agreement by sending written notice of your decision to opt out to
              contact@humanlyhired.com within thirty (30) days of first
              accepting these Terms. Your notice must include your name,
              address, email address, and an unequivocal statement that you want
              to opt out of this arbitration agreement. If you opt out, neither
              you nor the Company will be bound by this arbitration agreement,
              but all other provisions of these Terms will remain in effect.
            </p>
          </section>

          {/* Section 17 */}
          <section id="section-17" className="mb-12">
            <h2>17. Class Action Waiver</h2>
            <p>
              <strong>17.1 Individual Claims Only.</strong> TO THE MAXIMUM
              EXTENT PERMITTED BY APPLICABLE LAW, YOU AND THE COMPANY AGREE THAT
              ANY PROCEEDINGS TO RESOLVE DISPUTES WILL BE CONDUCTED ONLY ON AN
              INDIVIDUAL BASIS AND NOT IN A CLASS, CONSOLIDATED, OR
              REPRESENTATIVE ACTION. YOU AND THE COMPANY EXPRESSLY WAIVE ANY
              RIGHT TO PARTICIPATE AS A PLAINTIFF OR CLASS MEMBER IN ANY CLASS
              ACTION OR REPRESENTATIVE PROCEEDING.
            </p>
            <p>
              <strong>17.2 No Consolidation.</strong> Unless both you and the
              Company agree, no arbitrator or judge may consolidate more than
              one person&apos;s claims or otherwise preside over any form of
              representative or class proceeding. The arbitrator may award
              relief only in favor of the individual party seeking relief and
              only to the extent necessary to provide relief warranted by that
              individual party&apos;s claim.
            </p>
            <p>
              <strong>17.3 Severability.</strong> If any portion of this class
              action waiver is found to be unenforceable or unlawful for any
              reason, the remainder of this Section 17 shall remain in effect.
              If the class action waiver is deemed unenforceable with respect to
              a particular claim, then the arbitration provisions shall not
              apply to that claim, and the claim shall be resolved in court.
            </p>
          </section>

          {/* Section 18 */}
          <section id="section-18" className="mb-12">
            <h2>18. Termination</h2>
            <p>
              <strong>18.1 Termination by You.</strong> You may terminate your
              account and your use of the Services at any time by contacting us
              at contact@humanlyhired.com or through your account settings.
              Termination will not relieve you of any obligations incurred prior
              to termination, including any outstanding fees or
              indemnification obligations.
            </p>
            <p>
              <strong>18.2 Termination by Us.</strong> We may suspend or
              terminate your access to the Services at any time, with or without
              cause, and with or without notice, including but not limited to
              situations where: (a) you breach any provision of these Terms; (b)
              we are required to do so by law; (c) we discontinue the Services;
              or (d) we determine, in our sole discretion, that your continued
              use poses a risk to the Company, other users, or third parties.
            </p>
            <p>
              <strong>18.3 Effect of Termination.</strong> Upon termination: (a)
              your right to access and use the Services will immediately cease;
              (b) we may delete your account and User Content; and (c) we are
              not obligated to retain or provide copies of your User Content.
            </p>
            <p>
              <strong>18.4 Survival.</strong> The following provisions shall
              survive termination of these Terms: Sections 6 (Fees and Payment
              Terms, to the extent of outstanding obligations), 7 (Intellectual
              Property Rights), 8 (User Content and Submissions), 11
              (Disclaimers), 12 (Limitation of Liability), 13 (Indemnification),
              14 (Confidentiality), 15 (Governing Law), 16 (Dispute Resolution
              and Arbitration), 17 (Class Action Waiver), 18.4 (Survival), and
              20 (General Provisions).
            </p>
          </section>

          {/* Section 19 */}
          <section id="section-19" className="mb-12">
            <h2>19. Service Modifications</h2>
            <p>
              <strong>19.1 Right to Modify.</strong> We reserve the right to
              modify, suspend, or discontinue any aspect of the Services at any
              time, including the availability of any feature, database, or
              content, with or without notice. We may also impose limits on
              certain features and services or restrict your access to parts or
              all of the Services without notice or liability.
            </p>
            <p>
              <strong>19.2 No Liability.</strong> We shall not be liable to you
              or any third party for any modification, suspension, or
              discontinuation of the Services or any part thereof.
            </p>
            <p>
              <strong>19.3 Notification.</strong> Where practicable, we will
              provide reasonable advance notice of material changes to the
              Services. However, we reserve the right to make changes without
              notice when necessary for legal, security, or operational reasons.
            </p>
          </section>

          {/* Section 20 */}
          <section id="section-20" className="mb-12">
            <h2>20. General Provisions</h2>
            <p>
              <strong>20.1 Entire Agreement.</strong> These Terms, together with
              our Privacy Policy and any other agreements or policies referenced
              herein, constitute the entire agreement between you and the
              Company regarding the Services and supersede all prior and
              contemporaneous understandings, agreements, representations, and
              warranties, both written and oral, regarding the Services.
            </p>
            <p>
              <strong>20.2 Severability.</strong> If any provision of these
              Terms is held to be invalid, illegal, or unenforceable by a court
              of competent jurisdiction, such invalidity, illegality, or
              unenforceability shall not affect any other provision of these
              Terms, and these Terms shall be construed as if such invalid,
              illegal, or unenforceable provision had never been contained
              herein. To the extent permitted by applicable law, the parties
              agree that any invalid, illegal, or unenforceable provision shall
              be replaced by a valid, legal, and enforceable provision that most
              closely achieves the intent of the original provision.
            </p>
            <p>
              <strong>20.3 Waiver.</strong> No waiver of any term, condition, or
              provision of these Terms shall be deemed a further or continuing
              waiver of such term, condition, or provision or any other term,
              condition, or provision. Our failure to exercise or enforce any
              right or provision of these Terms shall not constitute a waiver of
              such right or provision.
            </p>
            <p>
              <strong>20.4 Assignment.</strong> You may not assign, transfer, or
              delegate these Terms or any of your rights or obligations
              hereunder without our prior written consent. We may freely assign,
              transfer, or delegate these Terms or any of our rights or
              obligations hereunder without restriction. Any attempted
              assignment in violation of this section shall be null and void.
              Subject to the foregoing, these Terms shall be binding upon and
              inure to the benefit of the parties and their respective
              successors and assigns.
            </p>
            <p>
              <strong>20.5 Notices.</strong> Any notices or other communications
              required or permitted under these Terms shall be in writing and
              shall be deemed given when delivered personally, sent by email
              (with confirmation of receipt), sent by certified or registered
              mail (return receipt requested), or sent by nationally recognized
              overnight courier. Notices to the Company should be sent to the
              address provided in Section 21.
            </p>
            <p>
              <strong>20.6 Relationship of Parties.</strong> Nothing in these
              Terms shall be construed to create a joint venture, partnership,
              franchise, employment, or agency relationship between you and the
              Company. Neither party has the authority to bind the other or to
              incur any obligation on behalf of the other.
            </p>
            <p>
              <strong>20.7 Force Majeure.</strong> We shall not be liable for
              any failure or delay in performing our obligations under these
              Terms if such failure or delay results from circumstances beyond
              our reasonable control, including but not limited to acts of God,
              natural disasters, war, terrorism, riots, embargoes,
              cyber-attacks, government actions, labor disputes, utility
              failures, or internet disruptions.
            </p>
            <p>
              <strong>20.8 Headings.</strong> The section and subsection
              headings in these Terms are for convenience only and shall not
              affect the interpretation of these Terms.
            </p>
            <p>
              <strong>20.9 No Third-Party Beneficiaries.</strong> These Terms do
              not confer any rights, remedies, or benefits upon any person or
              entity other than the parties hereto and their respective
              successors and permitted assigns.
            </p>
            <p>
              <strong>20.10 Language.</strong> These Terms are written in
              English. If these Terms are translated into any other language,
              the English language version shall control in the event of any
              conflict or discrepancy.
            </p>
          </section>

          {/* Section 21 */}
          <section id="section-21" className="mb-12">
            <h2>21. Contact Information</h2>
            <p>
              If you have any questions, concerns, or feedback regarding these
              Terms of Service, please contact us:
            </p>

            <div className="my-6 rounded-xl border border-gray-200 bg-gray-50 p-6 not-prose">
              <p className="font-semibold text-gray-900 text-lg">
                Brand Metrics LLC
              </p>
              <p className="mt-2 text-gray-700">
                1501 South Greeley Highway, Suite C
                <br />
                Cheyenne, WY 82007
                <br />
                United States
              </p>
              <p className="mt-4 text-gray-700">
                <strong>Email:</strong>{" "}
                <a
                  href="mailto:contact@humanlyhired.com"
                  className="text-blue-600 hover:underline"
                >
                  contact@humanlyhired.com
                </a>
                <br />
                <strong>Legal Inquiries:</strong>{" "}
                <a
                  href="mailto:legal@humanlyhired.com"
                  className="text-blue-600 hover:underline"
                >
                  legal@humanlyhired.com
                </a>
                <br />
                <strong>Phone:</strong> (888) 762-6691
              </p>
            </div>

            <p>
              For matters related to your account, please log in to your account
              or contact us at{" "}
              <a
                href="mailto:support@humanlyhired.com"
                className="text-blue-600 hover:underline"
              >
                support@humanlyhired.com
              </a>
              .
            </p>
          </section>

          {/* Final Statement */}
          <section className="mt-16 rounded-xl border border-gray-200 bg-gray-50 p-8">
            <p className="text-center text-gray-600">
              These Terms of Service were last updated on{" "}
              <strong>{lastUpdated}</strong> and are effective as of{" "}
              <strong>{effectiveDate}</strong>.
            </p>
            <p className="mt-4 text-center text-gray-600">
              <strong>Brand Metrics LLC</strong>
              <br />
              1501 South Greeley Highway, Suite C
              <br />
              Cheyenne, WY 82007
              <br />A Wyoming Corporation
            </p>
            <p className="mt-6 text-center text-sm text-gray-500">
              By using our Services, you acknowledge that you have read,
              understood, and agree to be bound by these Terms of Service.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
