import { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description:
    "Comprehensive privacy policy for Brand Metrics LLC Learn how we collect, use, protect, and share your personal information in compliance with GDPR, CCPA, and applicable privacy laws.",
};

const effectiveDate = "January 13, 2026";
const lastUpdated = "January 13, 2026";

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <section className="bg-gradient-to-br from-blue-600 to-blue-800 py-16">
        <div className="mx-auto max-w-4xl px-4 lg:px-8">
          <h1 className="text-4xl font-bold text-white">Privacy Policy</h1>
          <p className="mt-4 text-blue-100 text-lg">
            Your privacy is important to us. This policy explains how we handle
            your information.
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
        {/* Quick Summary */}
        <div className="mb-12 rounded-xl border border-blue-200 bg-blue-50 p-6">
          <h2 className="text-lg font-semibold text-blue-900">
            Privacy at a Glance
          </h2>
          <p className="mt-2 text-blue-800">
            Brand Metrics LLC respects your privacy. We collect information
            to provide staffing services, never sell your personal data to third
            parties, implement industry-standard security measures, and provide
            you with rights to access, correct, or delete your data. For
            complete details, please read the full policy below.
          </p>
        </div>

        {/* Table of Contents */}
        <nav className="mb-12 rounded-xl border border-gray-200 bg-gray-50 p-6">
          <h2 className="text-lg font-semibold text-gray-900">
            Table of Contents
          </h2>
          <ol className="mt-4 columns-1 gap-6 space-y-2 text-sm md:columns-2">
            {[
              { num: "1", title: "Introduction and Scope" },
              { num: "2", title: "Information We Collect" },
              { num: "3", title: "How We Use Your Information" },
              { num: "4", title: "Information Sharing and Disclosure" },
              { num: "5", title: "Data Security Measures" },
              { num: "6", title: "Your Privacy Rights" },
              { num: "7", title: "California Privacy Rights (CCPA)" },
              { num: "8", title: "European Privacy Rights (GDPR)" },
              { num: "9", title: "Cookie Policy" },
              { num: "10", title: "Third-Party Services" },
              { num: "11", title: "Data Retention" },
              { num: "12", title: "Children's Privacy" },
              { num: "13", title: "International Data Transfers" },
              { num: "14", title: "Changes to This Policy" },
              { num: "15", title: "Contact Information" },
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

        {/* Policy Content */}
        <div className="prose prose-lg max-w-none prose-headings:scroll-mt-20 prose-h2:text-2xl prose-h2:font-bold prose-h2:text-gray-900 prose-h2:border-b prose-h2:border-gray-200 prose-h2:pb-3 prose-h3:text-xl prose-h3:font-semibold prose-h3:text-gray-800 prose-p:text-gray-700 prose-li:text-gray-700">
          {/* Section 1 */}
          <section id="section-1" className="mb-12">
            <h2>1. Introduction and Scope</h2>
            <p>
              <strong>1.1</strong> Brand Metrics LLC, a Wyoming corporation
              (&quot;Company,&quot; &quot;we,&quot; &quot;our,&quot; or
              &quot;us&quot;), is committed to protecting the privacy and
              security of the personal information entrusted to us. This Privacy
              Policy (&quot;Policy&quot;) describes our practices regarding the
              collection, use, disclosure, and protection of personal
              information obtained through our website located at
              humanlyhired.com (the &quot;Website&quot;), our mobile
              applications, and our staffing and recruitment services
              (collectively, the &quot;Services&quot;).
            </p>
            <p>
              <strong>1.2</strong> This Policy applies to all individuals who
              access or use our Services, including but not limited to: (a) job
              seekers and candidates who submit applications or resumes through
              our platform; (b) employers and hiring managers who utilize our
              recruitment services; (c) visitors to our Website; (d) current and
              former employees and contractors; and (e) any other individuals
              whose personal information we may process in connection with our
              business operations.
            </p>
            <p>
              <strong>1.3</strong> By accessing or using our Services, you
              acknowledge that you have read, understood, and agree to be bound
              by the terms of this Privacy Policy. If you do not agree with any
              part of this Policy, you should not access or use our Services.
            </p>
            <p>
              <strong>1.4</strong> This Policy is incorporated into and subject
              to our{" "}
              <Link href="/terms" className="text-blue-600 hover:underline">
                Terms of Service
              </Link>
              . Capitalized terms used but not defined in this Policy shall have
              the meanings ascribed to them in the Terms of Service.
            </p>
          </section>

          {/* Section 2 */}
          <section id="section-2" className="mb-12">
            <h2>2. Information We Collect</h2>

            <h3>2.1 Personal Information You Provide Directly</h3>
            <p>
              We collect personal information that you voluntarily provide to us
              when you register for an account, submit a job application, engage
              our services, subscribe to our newsletter, participate in surveys,
              contact us for support, or otherwise interact with our Services.
              This information may include:
            </p>
            <ul>
              <li>
                <strong>Identity Information:</strong> Full legal name, maiden
                name, preferred name, date of birth, gender, photographs, and
                government-issued identification numbers (such as Social
                Security Number, driver&apos;s license number, or passport
                number, collected only when necessary for employment
                verification, background checks, or payroll processing)
              </li>
              <li>
                <strong>Contact Information:</strong> Postal address (including
                street, city, state, and ZIP code), email address (personal and
                professional), telephone numbers (home, mobile, and work), and
                emergency contact information
              </li>
              <li>
                <strong>Professional Information:</strong> Resume/CV, cover
                letters, work history and employment records, job titles and
                descriptions, salary and compensation history, professional
                licenses and certifications, educational background (degrees,
                institutions, graduation dates), skills assessments and test
                results, and professional references
              </li>
              <li>
                <strong>Financial Information:</strong> Bank account details for
                direct deposit (for placed candidates), tax withholding
                information (W-4, state withholding forms), and billing
                information for employer clients
              </li>
              <li>
                <strong>Demographic Information:</strong> Race, ethnicity,
                veteran status, and disability status (collected voluntarily for
                Equal Employment Opportunity compliance and reporting purposes)
              </li>
              <li>
                <strong>Communication Records:</strong> Content of emails,
                messages, chat transcripts, voicemails, and other communications
                with us, as well as records of your preferences for receiving
                communications
              </li>
            </ul>

            <h3>2.2 Information Collected Automatically</h3>
            <p>
              When you access our Website or use our Services, we automatically
              collect certain information through cookies, web beacons, and
              other tracking technologies. This information may include:
            </p>
            <ul>
              <li>
                <strong>Device Information:</strong> Hardware model, operating
                system and version, unique device identifiers (UDID, IDFA,
                Android ID), MAC address, browser type and version, screen
                resolution, and device settings
              </li>
              <li>
                <strong>Usage Information:</strong> Pages and content viewed,
                features used, search queries submitted, links clicked, time and
                duration of visits, navigation paths through our Website, error
                logs, and interaction patterns
              </li>
              <li>
                <strong>Location Information:</strong> IP address, geographic
                location derived from IP address, time zone settings, and (with
                your consent) precise GPS location from mobile devices
              </li>
              <li>
                <strong>Network Information:</strong> Internet service provider,
                network connection type, bandwidth, and network performance data
              </li>
              <li>
                <strong>Referral Information:</strong> URL of the website that
                referred you to our Website, search terms used to find us, and
                advertising identifiers
              </li>
            </ul>

            <h3>2.3 Information from Third-Party Sources</h3>
            <p>
              We may receive personal information about you from third-party
              sources and combine it with information we collect directly. These
              third-party sources include:
            </p>
            <ul>
              <li>
                <strong>Background Check Providers:</strong> Criminal history,
                credit reports (where permitted by law), education verification,
                employment verification, professional license verification, and
                drug screening results
              </li>
              <li>
                <strong>Professional Networks:</strong> Information from
                LinkedIn, Indeed, and other professional platforms you authorize
                us to access
              </li>
              <li>
                <strong>References:</strong> Information provided by your
                professional references regarding your work history,
                performance, and character
              </li>
              <li>
                <strong>Former Employers:</strong> Employment verification,
                dates of employment, job titles, and eligibility for rehire
              </li>
              <li>
                <strong>Public Records:</strong> Court records, property
                records, professional license databases, and other publicly
                available information
              </li>
              <li>
                <strong>Business Partners:</strong> Information from staffing
                industry partners, vendor management systems, and applicant
                tracking systems used by our employer clients
              </li>
            </ul>

            <h3>2.4 Sensitive Personal Information</h3>
            <p>
              In certain circumstances, we may collect sensitive personal
              information, including Social Security Numbers, government
              identification numbers, financial account information, health
              information related to drug screening or fitness-for-duty
              assessments, and information revealing racial or ethnic origin
              (for EEO compliance). We collect sensitive information only when
              necessary for specific, legitimate purposes and with appropriate
              safeguards.
            </p>
          </section>

          {/* Section 3 */}
          <section id="section-3" className="mb-12">
            <h2>3. How We Use Your Information</h2>

            <h3>3.1 Primary Business Purposes</h3>
            <p>
              We use the personal information we collect for the following
              primary business purposes:
            </p>
            <ul>
              <li>
                <strong>Recruitment Services:</strong> To match candidates with
                employment opportunities, evaluate qualifications, facilitate
                interviews, and coordinate the hiring process between candidates
                and employers
              </li>
              <li>
                <strong>Employment Processing:</strong> To process job
                applications, conduct background checks, verify credentials,
                assess skills, and make placement decisions
              </li>
              <li>
                <strong>Payroll and Benefits Administration:</strong> To process
                payroll for placed candidates, administer employee benefits,
                withhold and remit taxes, and comply with employment and tax
                laws
              </li>
              <li>
                <strong>Client Services:</strong> To provide staffing solutions
                to our employer clients, fulfill contractual obligations, and
                deliver requested services
              </li>
              <li>
                <strong>Account Management:</strong> To create and manage user
                accounts, authenticate users, and maintain account security
              </li>
            </ul>

            <h3>3.2 Communication Purposes</h3>
            <p>We use your information to communicate with you regarding:</p>
            <ul>
              <li>
                Job opportunities that match your qualifications and preferences
              </li>
              <li>Application status updates and interview scheduling</li>
              <li>
                Employment onboarding, work assignments, and payroll
                notifications
              </li>
              <li>
                Responses to your inquiries, requests, and customer support
                needs
              </li>
              <li>
                Service announcements, policy updates, and important notices
              </li>
              <li>
                Marketing communications, newsletters, and promotional materials
                (with your consent)
              </li>
              <li>
                Surveys and feedback requests to improve our services
              </li>
            </ul>

            <h3>3.3 Security and Compliance Purposes</h3>
            <p>
              We use your information to protect our business and comply with
              legal requirements:
            </p>
            <ul>
              <li>
                Detecting, investigating, and preventing fraud, security
                breaches, and other prohibited or illegal activities
              </li>
              <li>
                Enforcing our Terms of Service and other contractual obligations
              </li>
              <li>
                Complying with applicable laws, regulations, legal processes,
                and governmental requests
              </li>
              <li>
                Meeting employment law requirements, including I-9 verification,
                E-Verify, and EEO reporting
              </li>
              <li>Protecting our rights, property, and legitimate interests</li>
              <li>
                Responding to legal claims and establishing or defending legal
                positions
              </li>
            </ul>

            <h3>3.4 Analytics and Improvement</h3>
            <p>
              We use your information to analyze and improve our Services:
            </p>
            <ul>
              <li>
                Understanding how users interact with our Website and Services
              </li>
              <li>Analyzing trends, usage patterns, and user preferences</li>
              <li>
                Measuring the effectiveness of our recruitment processes and
                services
              </li>
              <li>
                Improving user experience, functionality, and content of our
                Website
              </li>
              <li>
                Developing new features, products, and services
              </li>
              <li>
                Conducting research and analysis for business development
              </li>
            </ul>

            <h3>3.5 Legal Bases for Processing (EEA/UK Users)</h3>
            <p>
              For users in the European Economic Area and United Kingdom, we
              process your personal information based on the following legal
              grounds:
            </p>
            <ul>
              <li>
                <strong>Contract Performance:</strong> Processing necessary to
                fulfill our contractual obligations to you
              </li>
              <li>
                <strong>Legitimate Interests:</strong> Processing necessary for
                our legitimate business interests, provided those interests are
                not overridden by your fundamental rights
              </li>
              <li>
                <strong>Legal Compliance:</strong> Processing necessary to
                comply with legal obligations
              </li>
              <li>
                <strong>Consent:</strong> Processing based on your explicit
                consent, which you may withdraw at any time
              </li>
            </ul>
          </section>

          {/* Section 4 */}
          <section id="section-4" className="mb-12">
            <h2>4. Information Sharing and Disclosure</h2>

            <h3>4.1 Disclosure to Employers and Clients</h3>
            <p>
              The primary purpose of our Services is to connect candidates with
              employers. Accordingly, we share candidate information with
              potential employers, including your resume, contact information,
              work history, skills, qualifications, and other information
              relevant to employment opportunities. We obtain your consent
              before sharing your information with specific employers for
              consideration for particular positions.
            </p>

            <h3>4.2 Service Providers and Business Partners</h3>
            <p>
              We engage third-party companies and individuals to perform
              services on our behalf. These service providers have access to
              personal information only to perform specific tasks and are
              contractually obligated to protect your information. Categories of
              service providers include:
            </p>
            <ul>
              <li>
                Background check and employment verification providers
              </li>
              <li>Payroll processing and benefits administration services</li>
              <li>Drug testing and health screening facilities</li>
              <li>Cloud hosting and data storage providers</li>
              <li>Email delivery and communication platforms</li>
              <li>Customer relationship management (CRM) systems</li>
              <li>Applicant tracking and HR software providers</li>
              <li>
                Analytics and marketing services
              </li>
              <li>Legal, accounting, and professional advisory services</li>
              <li>IT security and fraud prevention services</li>
            </ul>

            <h3>4.3 Legal and Regulatory Disclosures</h3>
            <p>
              We may disclose your personal information when required or
              permitted by law, including:
            </p>
            <ul>
              <li>
                In response to lawful requests by public authorities, including
                law enforcement, regulatory agencies, courts, and government
                bodies
              </li>
              <li>
                To comply with subpoenas, court orders, legal process, or
                government investigations
              </li>
              <li>
                To meet national security or law enforcement requirements
              </li>
              <li>
                To report suspected criminal activity or comply with mandatory
                reporting obligations
              </li>
              <li>
                To file employment-related reports required by federal, state,
                or local law (such as EEO-1 reports, new hire reporting, and
                workers&apos; compensation filings)
              </li>
            </ul>

            <h3>4.4 Business Transfers</h3>
            <p>
              In the event of a merger, acquisition, reorganization,
              bankruptcy, or sale of all or a portion of our assets, your
              personal information may be transferred to the acquiring entity.
              We will provide notice before your personal information becomes
              subject to a different privacy policy.
            </p>

            <h3>4.5 Protection of Rights</h3>
            <p>
              We may disclose personal information when we believe disclosure is
              necessary to protect our rights, property, or safety, or the
              rights, property, or safety of our users, employees, or others.
              This includes exchanging information with other companies and
              organizations for fraud protection and credit risk reduction.
            </p>

            <h3>4.6 With Your Consent</h3>
            <p>
              We may share your personal information with third parties when you
              have given us explicit consent to do so.
            </p>

            <h3>4.7 No Sale of Personal Information</h3>
            <p>
              <strong>
                We do not sell, rent, or lease your personal information to
                third parties for their marketing purposes.
              </strong>{" "}
              We do not engage in the sale of personal information as defined by
              the California Consumer Privacy Act (CCPA) or similar state
              privacy laws.
            </p>
          </section>

          {/* Section 5 */}
          <section id="section-5" className="mb-12">
            <h2>5. Data Security Measures</h2>

            <h3>5.1 Security Program</h3>
            <p>
              We maintain a comprehensive information security program designed
              to protect your personal information from unauthorized access,
              use, disclosure, alteration, and destruction. Our security program
              includes administrative, technical, and physical safeguards
              appropriate to the nature and sensitivity of the information we
              process.
            </p>

            <h3>5.2 Technical Safeguards</h3>
            <p>
              Our technical security measures include but are not limited to:
            </p>
            <ul>
              <li>
                Encryption of data in transit using Transport Layer Security
                (TLS 1.2 or higher)
              </li>
              <li>
                Encryption of sensitive data at rest using AES-256 encryption
              </li>
              <li>
                Secure network architecture with firewalls and intrusion
                detection systems
              </li>
              <li>
                Multi-factor authentication for access to sensitive systems
              </li>
              <li>Regular security assessments and penetration testing</li>
              <li>Automated vulnerability scanning and patch management</li>
              <li>
                Secure software development practices and code review
              </li>
              <li>Access logging and security monitoring</li>
            </ul>

            <h3>5.3 Administrative Safeguards</h3>
            <p>Our administrative security measures include:</p>
            <ul>
              <li>
                Written information security policies and procedures
              </li>
              <li>
                Employee background checks and security training
              </li>
              <li>
                Role-based access controls and least privilege principles
              </li>
              <li>Confidentiality agreements with employees and contractors</li>
              <li>
                Vendor security assessments and contractual security
                requirements
              </li>
              <li>Incident response and breach notification procedures</li>
              <li>Regular security audits and compliance assessments</li>
            </ul>

            <h3>5.4 Physical Safeguards</h3>
            <p>Our physical security measures include:</p>
            <ul>
              <li>Secure data center facilities with access controls</li>
              <li>
                Physical access restrictions to systems containing personal
                information
              </li>
              <li>Secure disposal of physical media containing personal data</li>
              <li>Environmental controls to protect against physical threats</li>
            </ul>

            <h3>5.5 Limitations</h3>
            <p>
              While we implement commercially reasonable security measures, no
              method of transmission over the Internet or electronic storage is
              completely secure. We cannot guarantee the absolute security of
              your personal information. You are responsible for maintaining the
              confidentiality of your account credentials and for any activity
              that occurs under your account.
            </p>

            <h3>5.6 Breach Notification</h3>
            <p>
              In the event of a data breach that compromises your personal
              information, we will notify you in accordance with applicable law.
              We will also notify appropriate regulatory authorities as required
              by law.
            </p>
          </section>

          {/* Section 6 */}
          <section id="section-6" className="mb-12">
            <h2>6. Your Privacy Rights</h2>

            <h3>6.1 Access and Portability</h3>
            <p>
              You have the right to request access to the personal information
              we hold about you. Upon verification of your identity, we will
              provide you with a copy of your personal information in a
              structured, commonly used, and machine-readable format where
              technically feasible.
            </p>

            <h3>6.2 Correction and Update</h3>
            <p>
              You have the right to request correction of inaccurate personal
              information and to update incomplete information. You may update
              certain account information directly through your account
              settings. For other corrections, please contact us using the
              information provided in Section 15.
            </p>

            <h3>6.3 Deletion</h3>
            <p>
              You have the right to request deletion of your personal
              information, subject to certain exceptions. We may retain personal
              information as necessary to comply with legal obligations, resolve
              disputes, enforce our agreements, or for other legitimate business
              purposes. We will inform you if we cannot fulfill your deletion
              request and explain the reasons.
            </p>

            <h3>6.4 Restriction of Processing</h3>
            <p>
              You have the right to request that we restrict the processing of
              your personal information under certain circumstances, such as
              when you contest the accuracy of the information or object to our
              processing.
            </p>

            <h3>6.5 Objection</h3>
            <p>
              You have the right to object to the processing of your personal
              information for certain purposes, including direct marketing. If
              you object to processing for direct marketing purposes, we will
              stop processing your information for such purposes.
            </p>

            <h3>6.6 Withdrawal of Consent</h3>
            <p>
              Where we process your personal information based on your consent,
              you have the right to withdraw your consent at any time.
              Withdrawal of consent does not affect the lawfulness of processing
              conducted prior to withdrawal.
            </p>

            <h3>6.7 Marketing Communications</h3>
            <p>
              You may opt out of receiving marketing communications from us at
              any time by clicking the &quot;unsubscribe&quot; link in our
              emails, adjusting your communication preferences in your account
              settings, or contacting us directly. Even if you opt out of
              marketing communications, we may still send you transactional or
              administrative messages related to your account or our Services.
            </p>

            <h3>6.8 Exercising Your Rights</h3>
            <p>
              To exercise any of these rights, please contact us using the
              information provided in Section 15. We will respond to your
              request within the timeframe required by applicable law (typically
              30-45 days). We may request additional information to verify your
              identity before processing your request.
            </p>

            <h3>6.9 Non-Discrimination</h3>
            <p>
              We will not discriminate against you for exercising your privacy
              rights. We will not deny you services, charge different prices,
              provide a different quality of service, or retaliate against you
              for exercising your rights under this Policy or applicable privacy
              laws.
            </p>
          </section>

          {/* Section 7 */}
          <section id="section-7" className="mb-12">
            <h2>7. California Privacy Rights (CCPA/CPRA)</h2>

            <h3>7.1 Scope</h3>
            <p>
              This section applies to California residents and supplements the
              information contained in this Privacy Policy. It describes the
              rights granted under the California Consumer Privacy Act of 2018
              (CCPA), as amended by the California Privacy Rights Act of 2020
              (CPRA), and explains how California residents may exercise those
              rights.
            </p>

            <h3>7.2 Categories of Personal Information</h3>
            <p>
              In the preceding twelve (12) months, we have collected the
              following categories of personal information as defined by the
              CCPA:
            </p>
            <ul>
              <li>
                <strong>Identifiers:</strong> Name, alias, postal address, email
                address, account name, Social Security Number, driver&apos;s
                license number, passport number, and similar identifiers
              </li>
              <li>
                <strong>
                  Personal Information under Cal. Civ. Code 1798.80(e):
                </strong>{" "}
                Name, address, telephone number, education, employment,
                employment history, and financial information
              </li>
              <li>
                <strong>
                  Protected Classification Characteristics:
                </strong>{" "}
                Age, race, national origin, citizenship, marital status, sex,
                gender, veteran or military status, and disability (for EEO
                purposes)
              </li>
              <li>
                <strong>Commercial Information:</strong> Records of services
                purchased or considered
              </li>
              <li>
                <strong>Internet or Network Activity:</strong> Browsing history,
                search history, and information regarding interaction with our
                Website
              </li>
              <li>
                <strong>Geolocation Data:</strong> Physical location derived
                from IP address
              </li>
              <li>
                <strong>Professional or Employment Information:</strong> Job
                history, qualifications, references, and related information
              </li>
              <li>
                <strong>Education Information:</strong> Educational records and
                student records
              </li>
              <li>
                <strong>Inferences:</strong> Profiles reflecting preferences,
                characteristics, and behavior
              </li>
              <li>
                <strong>Sensitive Personal Information:</strong> Social Security
                Number, driver&apos;s license number, precise geolocation, and
                racial or ethnic origin
              </li>
            </ul>

            <h3>7.3 Sources of Personal Information</h3>
            <p>
              We collect personal information from the following categories of
              sources: (a) directly from you; (b) from your devices
              automatically; (c) from third-party sources including background
              check providers, professional networks, and references; and (d)
              from publicly available sources.
            </p>

            <h3>7.4 Purposes for Collection and Use</h3>
            <p>
              We collect and use personal information for the business and
              commercial purposes described in Section 3 of this Policy,
              including providing staffing services, processing employment
              applications, communicating with you, ensuring security and
              preventing fraud, complying with legal requirements, and
              conducting analytics and research.
            </p>

            <h3>7.5 Disclosure of Personal Information</h3>
            <p>
              In the preceding twelve (12) months, we have disclosed personal
              information to the categories of recipients described in Section 4
              of this Policy, including employers and clients, service
              providers, background check providers, and government authorities
              as required by law.
            </p>

            <h3>7.6 Sale and Sharing of Personal Information</h3>
            <p>
              <strong>
                We do not sell personal information as defined by the CCPA.
              </strong>{" "}
              We do not share personal information for cross-context behavioral
              advertising purposes. We have not sold or shared personal
              information in the preceding twelve (12) months.
            </p>

            <h3>7.7 Rights of California Residents</h3>
            <p>
              California residents have the following rights under the
              CCPA/CPRA:
            </p>
            <ul>
              <li>
                <strong>Right to Know:</strong> The right to request information
                about the categories and specific pieces of personal information
                we have collected, the sources of collection, the purposes for
                collection, and the categories of third parties with whom we
                share personal information
              </li>
              <li>
                <strong>Right to Delete:</strong> The right to request deletion
                of personal information, subject to certain exceptions
              </li>
              <li>
                <strong>Right to Correct:</strong> The right to request
                correction of inaccurate personal information
              </li>
              <li>
                <strong>Right to Opt-Out:</strong> The right to opt out of the
                sale or sharing of personal information (note: we do not sell or
                share personal information)
              </li>
              <li>
                <strong>Right to Limit:</strong> The right to limit the use and
                disclosure of sensitive personal information
              </li>
              <li>
                <strong>Right to Non-Discrimination:</strong> The right not to
                receive discriminatory treatment for exercising privacy rights
              </li>
            </ul>

            <h3>7.8 Exercising California Rights</h3>
            <p>
              To exercise your California privacy rights, please contact us
              using the methods described in Section 15. You may also designate
              an authorized agent to make a request on your behalf. We will
              verify your identity before processing requests and may request
              additional information to confirm your identity or the authority
              of your authorized agent.
            </p>

            <h3>7.9 Response Timing</h3>
            <p>
              We will respond to verifiable consumer requests within forty-five
              (45) days of receipt. If we require additional time (up to an
              additional 45 days), we will inform you of the reason and
              extension period in writing.
            </p>

            <h3>7.10 California Shine the Light</h3>
            <p>
              California Civil Code Section 1798.83 permits California residents
              to request information about our disclosure of personal
              information to third parties for their direct marketing purposes.
              As stated above, we do not disclose personal information to third
              parties for their direct marketing purposes.
            </p>

            <h3>7.11 Do Not Track</h3>
            <p>
              California Business and Professions Code Section 22575(b) requires
              disclosure of how we respond to Do Not Track signals. Currently,
              there is no industry consensus on how to respond to Do Not Track
              signals, and our Website does not currently respond to such
              signals. However, you can manage your cookie preferences as
              described in Section 9.
            </p>
          </section>

          {/* Section 8 */}
          <section id="section-8" className="mb-12">
            <h2>8. European Privacy Rights (GDPR)</h2>

            <h3>8.1 Scope</h3>
            <p>
              This section applies to individuals in the European Economic Area
              (EEA), United Kingdom, and Switzerland, and supplements the
              information contained in this Privacy Policy. It describes the
              rights granted under the General Data Protection Regulation
              (GDPR), the UK GDPR, and the Swiss Federal Data Protection Act.
            </p>

            <h3>8.2 Data Controller</h3>
            <p>
              Brand Metrics LLC is the data controller for personal
              information collected through our Services. Our contact
              information is provided in Section 15. We have not appointed a
              Data Protection Officer but may be contacted at the address below
              for data protection inquiries.
            </p>

            <h3>8.3 Legal Bases for Processing</h3>
            <p>
              We process personal information on the following legal bases:
            </p>
            <ul>
              <li>
                <strong>Performance of Contract:</strong> Processing necessary
                for the performance of a contract with you or to take steps at
                your request prior to entering into a contract (such as
                processing your job application or providing staffing services)
              </li>
              <li>
                <strong>Legitimate Interests:</strong> Processing necessary for
                our legitimate interests or those of a third party, except where
                such interests are overridden by your interests or fundamental
                rights (such as conducting analytics, improving our services,
                and preventing fraud)
              </li>
              <li>
                <strong>Legal Obligation:</strong> Processing necessary for
                compliance with a legal obligation to which we are subject (such
                as employment law compliance and responding to legal requests)
              </li>
              <li>
                <strong>Consent:</strong> Processing based on your freely given,
                specific, informed, and unambiguous consent (such as marketing
                communications and certain data sharing)
              </li>
            </ul>

            <h3>8.4 Rights of European Data Subjects</h3>
            <p>
              Under the GDPR, you have the following rights regarding your
              personal information:
            </p>
            <ul>
              <li>
                <strong>Right of Access (Article 15):</strong> The right to
                obtain confirmation of whether we process your personal data and
                access to that data
              </li>
              <li>
                <strong>Right to Rectification (Article 16):</strong> The right
                to have inaccurate personal data corrected and incomplete data
                completed
              </li>
              <li>
                <strong>Right to Erasure (Article 17):</strong> The right to
                have personal data erased under certain circumstances (also
                known as the &quot;right to be forgotten&quot;)
              </li>
              <li>
                <strong>Right to Restriction (Article 18):</strong> The right to
                restrict processing under certain circumstances
              </li>
              <li>
                <strong>Right to Data Portability (Article 20):</strong> The
                right to receive personal data in a structured, commonly used,
                machine-readable format and transmit it to another controller
              </li>
              <li>
                <strong>Right to Object (Article 21):</strong> The right to
                object to processing based on legitimate interests or for direct
                marketing purposes
              </li>
              <li>
                <strong>
                  Rights Related to Automated Decision-Making (Article 22):
                </strong>{" "}
                The right not to be subject to decisions based solely on
                automated processing that produce legal or similarly significant
                effects
              </li>
              <li>
                <strong>Right to Withdraw Consent (Article 7):</strong> The
                right to withdraw consent at any time without affecting the
                lawfulness of processing based on consent before withdrawal
              </li>
            </ul>

            <h3>8.5 Exercising European Rights</h3>
            <p>
              To exercise your rights under the GDPR, please contact us using
              the information in Section 15. We will respond to your request
              within one (1) month of receipt. This period may be extended by
              two (2) additional months where necessary, taking into account the
              complexity and number of requests.
            </p>

            <h3>8.6 Complaints</h3>
            <p>
              If you believe that our processing of your personal information
              violates the GDPR or other applicable data protection laws, you
              have the right to lodge a complaint with a supervisory authority
              in the EU member state of your habitual residence, place of work,
              or place of the alleged infringement.
            </p>

            <h3>8.7 International Data Transfers</h3>
            <p>
              We are based in the United States and process data primarily in
              the United States. When we transfer personal data from the EEA,
              UK, or Switzerland to the United States, we implement appropriate
              safeguards as described in Section 13.
            </p>
          </section>

          {/* Section 9 */}
          <section id="section-9" className="mb-12">
            <h2>9. Cookie Policy</h2>

            <h3>9.1 What Are Cookies</h3>
            <p>
              Cookies are small text files that are stored on your device when
              you visit a website. They are widely used to make websites work
              more efficiently, provide information to website owners, and
              enable certain functionalities. We also use similar technologies
              such as web beacons, pixels, and local storage.
            </p>

            <h3>9.2 Types of Cookies We Use</h3>
            <p>We use the following types of cookies on our Website:</p>
            <ul>
              <li>
                <strong>Strictly Necessary Cookies:</strong> These cookies are
                essential for the Website to function and cannot be disabled.
                They are usually set in response to actions you take, such as
                setting privacy preferences, logging in, or filling in forms.
                You can set your browser to block these cookies, but some parts
                of the Website may not function properly.
              </li>
              <li>
                <strong>Performance and Analytics Cookies:</strong> These
                cookies collect information about how you use our Website, such
                as which pages you visit and any errors you encounter. This
                information is used to improve how the Website works. These
                cookies do not directly identify you.
              </li>
              <li>
                <strong>Functional Cookies:</strong> These cookies enable
                enhanced functionality and personalization, such as remembering
                your preferences and settings. If you do not allow these
                cookies, some or all of these features may not function
                properly.
              </li>
              <li>
                <strong>Targeting and Advertising Cookies:</strong> These
                cookies may be set through our Website by our advertising
                partners. They are used to build a profile of your interests and
                show you relevant advertisements on other websites. They do not
                directly store personal information but are based on uniquely
                identifying your browser and device.
              </li>
            </ul>

            <h3>9.3 Third-Party Cookies</h3>
            <p>
              We use third-party services that may set cookies on your device,
              including:
            </p>
            <ul>
              <li>
                <strong>Google Analytics:</strong> For website analytics and
                performance monitoring. Google&apos;s privacy policy is
                available at{" "}
                <a
                  href="https://policies.google.com/privacy"
                  className="text-blue-600 hover:underline"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  https://policies.google.com/privacy
                </a>
              </li>
              <li>
                <strong>Clerk:</strong> For authentication and user account
                management
              </li>
              <li>
                <strong>LinkedIn:</strong> For social sharing and professional
                network integration
              </li>
            </ul>

            <h3>9.4 Managing Cookies</h3>
            <p>You can control and manage cookies in several ways:</p>
            <ul>
              <li>
                <strong>Browser Settings:</strong> Most browsers allow you to
                view, delete, and block cookies from websites. Note that
                deleting all cookies will also delete any opt-out cookies you
                have set.
              </li>
              <li>
                <strong>Cookie Consent Tool:</strong> When you first visit our
                Website, you may be presented with a cookie consent banner that
                allows you to accept or decline non-essential cookies.
              </li>
              <li>
                <strong>Opt-Out Tools:</strong> You can opt out of Google
                Analytics by installing the Google Analytics Opt-out Browser
                Add-on. You can opt out of interest-based advertising through
                the Digital Advertising Alliance at{" "}
                <a
                  href="https://optout.aboutads.info"
                  className="text-blue-600 hover:underline"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  optout.aboutads.info
                </a>
              </li>
            </ul>

            <h3>9.5 Consequences of Disabling Cookies</h3>
            <p>
              If you choose to disable cookies, some features of our Website may
              not function properly. For example, you may not be able to log in
              to your account, save preferences, or access certain
              functionalities that rely on cookies.
            </p>
          </section>

          {/* Section 10 */}
          <section id="section-10" className="mb-12">
            <h2>10. Third-Party Services</h2>

            <h3>10.1 Third-Party Websites</h3>
            <p>
              Our Website may contain links to third-party websites, platforms,
              and services that are not owned or controlled by us. These include
              links to employer websites, job boards, professional networks, and
              other external resources. This Privacy Policy does not apply to
              third-party websites or services. We encourage you to review the
              privacy policies of any third-party websites you visit.
            </p>

            <h3>10.2 Third-Party Service Providers</h3>
            <p>
              We integrate with and use various third-party services to operate
              our business and provide our Services. These third-party services
              have their own privacy policies and data practices. Key categories
              include:
            </p>
            <ul>
              <li>
                <strong>Cloud Infrastructure:</strong> We use cloud hosting
                providers to store and process data
              </li>
              <li>
                <strong>Authentication Services:</strong> We use Clerk for user
                authentication and account management
              </li>
              <li>
                <strong>Payment Processing:</strong> We use secure payment
                processors for financial transactions
              </li>
              <li>
                <strong>Communication Tools:</strong> We use email service
                providers for correspondence and notifications
              </li>
              <li>
                <strong>Background Check Services:</strong> We partner with
                licensed consumer reporting agencies for background screening
              </li>
            </ul>

            <h3>10.3 Social Media</h3>
            <p>
              Our Website may include social media features and integrations.
              These features may collect your IP address, track which pages you
              visit, and set cookies. Your interactions with social media
              features are governed by the privacy policies of the respective
              social media companies.
            </p>

            <h3>10.4 Job Boards and Professional Networks</h3>
            <p>
              We may source candidates from and post positions to third-party
              job boards and professional networks such as LinkedIn, Indeed, and
              ZipRecruiter. When you apply for a position through these
              platforms, your information may be subject to both our Privacy
              Policy and the privacy policy of the third-party platform.
            </p>
          </section>

          {/* Section 11 */}
          <section id="section-11" className="mb-12">
            <h2>11. Data Retention</h2>

            <h3>11.1 Retention Periods</h3>
            <p>
              We retain personal information for as long as necessary to fulfill
              the purposes for which it was collected, comply with legal
              obligations, resolve disputes, and enforce our agreements. The
              retention period depends on the context and type of information:
            </p>
            <ul>
              <li>
                <strong>Candidate Information:</strong> We retain candidate
                profiles, resumes, and application materials for a minimum of
                three (3) years from the date of last contact or application to
                consider you for future opportunities and comply with
                recordkeeping requirements. You may request deletion of your
                information at any time.
              </li>
              <li>
                <strong>Employment Records:</strong> For candidates we place, we
                retain employment records (including payroll, tax, and benefits
                information) for a minimum of seven (7) years after the end of
                employment to comply with tax, employment, and labor laws.
              </li>
              <li>
                <strong>Client and Employer Information:</strong> We retain
                client account information and contracts for the duration of the
                business relationship and for a minimum of seven (7) years
                thereafter.
              </li>
              <li>
                <strong>Background Check Information:</strong> We retain
                background check results in accordance with the Fair Credit
                Reporting Act (FCRA) and applicable state laws, typically for
                the duration of employment plus seven (7) years.
              </li>
              <li>
                <strong>Website Usage Data:</strong> We retain analytics and
                usage data in aggregated or anonymized form for analytical
                purposes. Identifiable usage data is typically retained for up
                to two (2) years.
              </li>
              <li>
                <strong>Communication Records:</strong> We retain correspondence
                and communication records for a minimum of three (3) years.
              </li>
            </ul>

            <h3>11.2 Criteria for Retention</h3>
            <p>
              In determining retention periods, we consider the nature and
              sensitivity of the information, the purposes for processing,
              applicable legal requirements, statute of limitations for
              potential claims, and our legitimate business interests.
            </p>

            <h3>11.3 Deletion</h3>
            <p>
              When personal information is no longer required, we will securely
              delete or anonymize it. Deletion may not be immediate due to
              technical requirements, backup systems, or legal holds. We will
              make reasonable efforts to delete your information from all
              systems within a reasonable timeframe.
            </p>
          </section>

          {/* Section 12 */}
          <section id="section-12" className="mb-12">
            <h2>12. Children&apos;s Privacy</h2>

            <h3>12.1 Age Restrictions</h3>
            <p>
              Our Services are intended for individuals who are at least
              eighteen (18) years of age or the legal age of majority in their
              jurisdiction. We do not knowingly collect, use, or disclose
              personal information from children under the age of eighteen (18)
              or the applicable age of majority.
            </p>

            <h3>12.2 COPPA Compliance</h3>
            <p>
              Our Website and Services are not directed at children under the
              age of thirteen (13), and we do not knowingly collect personal
              information from children under thirteen (13) in compliance with
              the Children&apos;s Online Privacy Protection Act (COPPA).
            </p>

            <h3>12.3 Parental Notification</h3>
            <p>
              If we become aware that we have collected personal information
              from a child under the age of thirteen (13) without verification
              of parental consent, we will take steps to delete that information
              as quickly as possible. If you believe we may have collected
              information from a child under thirteen (13), please contact us
              immediately using the information in Section 15.
            </p>
          </section>

          {/* Section 13 */}
          <section id="section-13" className="mb-12">
            <h2>13. International Data Transfers</h2>

            <h3>13.1 Location of Processing</h3>
            <p>
              Brand Metrics LLC is headquartered in the United States, and
              our primary data processing activities occur in the United States.
              By using our Services, you acknowledge that your personal
              information will be transferred to, processed, and stored in the
              United States, which may have different data protection laws than
              your country of residence.
            </p>

            <h3>13.2 Transfers from the European Economic Area</h3>
            <p>
              When we transfer personal data from the EEA, UK, or Switzerland to
              the United States, we implement appropriate safeguards to ensure
              adequate protection, including:
            </p>
            <ul>
              <li>
                <strong>Standard Contractual Clauses:</strong> We use EU
                Commission-approved Standard Contractual Clauses (SCCs) for data
                transfers to countries without an adequacy decision
              </li>
              <li>
                <strong>UK International Data Transfer Agreement:</strong> For
                transfers from the UK, we use the UK International Data Transfer
                Agreement or UK Addendum to SCCs as appropriate
              </li>
              <li>
                <strong>Supplementary Measures:</strong> We implement additional
                technical and organizational measures as necessary to ensure the
                effectiveness of the transfer mechanism
              </li>
            </ul>

            <h3>13.3 Data Localization</h3>
            <p>
              We will comply with any applicable data localization requirements
              that mandate personal information be stored or processed within
              specific jurisdictions.
            </p>

            <h3>13.4 Obtaining Copies of Safeguards</h3>
            <p>
              You may request a copy of the safeguards we use for international
              data transfers by contacting us using the information in Section
              15.
            </p>
          </section>

          {/* Section 14 */}
          <section id="section-14" className="mb-12">
            <h2>14. Changes to This Policy</h2>

            <h3>14.1 Right to Update</h3>
            <p>
              We reserve the right to modify this Privacy Policy at any time.
              Changes may be made to reflect changes in our data practices,
              legal requirements, industry standards, or business operations.
            </p>

            <h3>14.2 Notification of Changes</h3>
            <p>
              When we make material changes to this Privacy Policy, we will
              notify you by posting the updated Policy on our Website with a new
              &quot;Last Updated&quot; date, sending you an email notification
              (if we have your email address), or providing a prominent notice
              on our Website or through our Services. We encourage you to review
              this Policy periodically.
            </p>

            <h3>14.3 Continued Use</h3>
            <p>
              Your continued use of our Services after the effective date of any
              changes constitutes your acceptance of the updated Privacy Policy.
              If you do not agree with the changes, you should discontinue use
              of our Services and contact us to request deletion of your
              personal information.
            </p>

            <h3>14.4 Prior Versions</h3>
            <p>
              Prior versions of this Privacy Policy may be obtained by
              contacting us using the information in Section 15.
            </p>
          </section>

          {/* Section 15 */}
          <section id="section-15" className="mb-12">
            <h2>15. Contact Information</h2>

            <h3>15.1 Privacy Inquiries</h3>
            <p>
              If you have any questions, concerns, or requests regarding this
              Privacy Policy or our privacy practices, please contact us:
            </p>

            <div className="my-6 rounded-xl border border-gray-200 bg-gray-50 p-6 not-prose">
              <p className="font-semibold text-gray-900 text-lg">
                Brand Metrics LLC
              </p>
              <p className="mt-2 text-gray-700">
                Attn: Privacy Officer
                <br />
                1501 South Greeley Highway, Suite C
                <br />
                Cheyenne, WY 82007
                <br />
                United States
              </p>
              <p className="mt-4 text-gray-700">
                <strong>Email:</strong>{" "}
                <a
                  href="mailto:privacy@humanlyhired.com"
                  className="text-blue-600 hover:underline"
                >
                  privacy@humanlyhired.com
                </a>
                <br />
                <strong>General Inquiries:</strong>{" "}
                <a
                  href="mailto:contact@humanlyhired.com"
                  className="text-blue-600 hover:underline"
                >
                  contact@humanlyhired.com
                </a>
                <br />
                <strong>Phone:</strong> (888) 762-6691
              </p>
            </div>

            <h3>15.2 Response Time</h3>
            <p>
              We will acknowledge receipt of your inquiry within five (5)
              business days and will respond to your request within the
              timeframe required by applicable law (typically thirty (30) to
              forty-five (45) days, depending on your jurisdiction and the
              nature of your request).
            </p>

            <h3>15.3 Verification</h3>
            <p>
              To protect your privacy and security, we may require verification
              of your identity before responding to requests. We may ask for
              information sufficient to verify your identity, such as your name,
              email address, and other identifying information associated with
              your account or prior interactions with us.
            </p>

            <h3>15.4 Complaints</h3>
            <p>
              If you are not satisfied with our response to your privacy
              concern, you may have the right to lodge a complaint with a data
              protection authority in your jurisdiction. We would, however,
              appreciate the opportunity to address your concerns before you
              contact a supervisory authority, so please contact us first.
            </p>
          </section>

          {/* Final Statement */}
          <section className="mt-16 rounded-xl border border-gray-200 bg-gray-50 p-8">
            <p className="text-center text-gray-600">
              This Privacy Policy was last updated on{" "}
              <strong>{lastUpdated}</strong> and is effective as of{" "}
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
          </section>
        </div>
      </div>
    </div>
  );
}
