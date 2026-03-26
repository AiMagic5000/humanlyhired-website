import { Metadata } from "next";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { siteConfig } from "@/lib/config";

export const metadata: Metadata = {
  title: "Frequently Asked Questions",
  description: "Find answers to common questions about Humanly Hired's services, process, and policies.",
};

const faqs = {
  candidates: [
    {
      question: "How do I apply for jobs?",
      answer: "You can browse our open positions on our Jobs page and apply directly through our website. Simply click 'Apply Now' on any job listing and submit your resume along with your contact information.",
    },
    {
      question: "Is there a fee to use your services as a job seeker?",
      answer: "No, our services are completely free for job seekers. We are compensated by employers when we successfully place candidates in their organizations.",
    },
    {
      question: "How long does the hiring process typically take?",
      answer: "The timeline varies depending on the position and employer. Generally, you can expect to hear back within 1-2 weeks of applying if you're selected for an interview. The entire process from application to offer typically takes 2-4 weeks.",
    },
    {
      question: "What types of jobs do you offer?",
      answer: "We offer positions across multiple industries including technology, healthcare, finance, manufacturing, retail, and logistics. We have opportunities for full-time, part-time, contract, and temporary positions.",
    },
    {
      question: "Will you help me prepare for interviews?",
      answer: "Yes! Our recruiters provide interview coaching and tips to help you present your best self. We'll share information about the company culture, common interview questions, and what the employer is looking for.",
    },
  ],
  employers: [
    {
      question: "How does your fee structure work?",
      answer: "Our fees vary based on the type of service and position. For direct hire placements, we typically charge a percentage of the candidate's first-year salary. Contract staffing rates include hourly bill rates. Contact us for a detailed quote based on your specific needs.",
    },
    {
      question: "What is your replacement guarantee?",
      answer: "We offer a 90-day replacement guarantee on all direct hire placements. If a candidate doesn't work out within the first 90 days, we'll find a replacement at no additional cost.",
    },
    {
      question: "How quickly can you fill a position?",
      answer: "Our average time-to-fill is 14 days, though this can vary based on the role's requirements and market conditions. For urgent needs, we can often present qualified candidates within 48-72 hours.",
    },
    {
      question: "What is your screening process?",
      answer: "Our rigorous 5-step screening process includes resume review, phone screening, skills assessment, in-person or video interview, and background/reference checks. We ensure every candidate we present is thoroughly vetted.",
    },
    {
      question: "Do you offer RPO (Recruitment Process Outsourcing)?",
      answer: "Yes, we offer full RPO services where we can manage your entire recruitment function or specific hiring projects. This includes everything from job posting to onboarding support.",
    },
  ],
  general: [
    {
      question: "How can I contact Humanly Hired?",
      answer: `You can reach us by phone at ${siteConfig.contact.phone}, email at ${siteConfig.contact.email}, or visit our office at ${siteConfig.contact.address.full}. You can also use the contact form on our website.`,
    },
    {
      question: "What industries do you specialize in?",
      answer: "We specialize in Technology & IT, Healthcare, Finance & Accounting, Manufacturing, Retail & Hospitality, and Logistics & Warehouse staffing. Our industry-specialized recruiters understand the unique requirements of each sector.",
    },
    {
      question: "What areas do you serve?",
      answer: "While we're headquartered in Wyoming, we serve clients and candidates nationwide. Many of our positions offer remote work options as well.",
    },
    {
      question: "How do you ensure quality placements?",
      answer: "We maintain a 98% client satisfaction rate through our thorough screening process, industry expertise, and commitment to understanding both employer needs and candidate aspirations. Our goal is always to create successful, long-term matches.",
    },
  ],
};

export default function FAQPage() {
  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="bg-gradient-to-br from-blue-600 to-blue-800 py-20">
        <div className="mx-auto max-w-7xl px-4 lg:px-8">
          <div className="max-w-3xl">
            <h1 className="text-4xl sm:text-5xl font-bold text-white">
              Frequently Asked Questions
            </h1>
            <p className="mt-6 text-xl text-blue-100">
              Find answers to common questions about our services and process.
            </p>
          </div>
        </div>
      </section>

      {/* FAQs */}
      <section className="py-20 bg-white">
        <div className="mx-auto max-w-4xl px-4 lg:px-8">
          {/* For Candidates */}
          <div className="mb-16">
            <h2 className="text-2xl font-bold text-gray-900 mb-8">For Job Seekers</h2>
            <div className="space-y-6">
              {faqs.candidates.map((faq, index) => (
                <div key={index} className="border-b border-gray-100 pb-6">
                  <h3 className="text-lg font-semibold text-gray-900">{faq.question}</h3>
                  <p className="mt-3 text-gray-600">{faq.answer}</p>
                </div>
              ))}
            </div>
          </div>

          {/* For Employers */}
          <div className="mb-16">
            <h2 className="text-2xl font-bold text-gray-900 mb-8">For Employers</h2>
            <div className="space-y-6">
              {faqs.employers.map((faq, index) => (
                <div key={index} className="border-b border-gray-100 pb-6">
                  <h3 className="text-lg font-semibold text-gray-900">{faq.question}</h3>
                  <p className="mt-3 text-gray-600">{faq.answer}</p>
                </div>
              ))}
            </div>
          </div>

          {/* General */}
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-8">General Questions</h2>
            <div className="space-y-6">
              {faqs.general.map((faq, index) => (
                <div key={index} className="border-b border-gray-100 pb-6">
                  <h3 className="text-lg font-semibold text-gray-900">{faq.question}</h3>
                  <p className="mt-3 text-gray-600">{faq.answer}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 bg-gray-50">
        <div className="mx-auto max-w-7xl px-4 lg:px-8 text-center">
          <h2 className="text-2xl font-bold text-gray-900">Still Have Questions?</h2>
          <p className="mt-4 text-gray-600 max-w-2xl mx-auto">
            Our team is here to help. Reach out and we&apos;ll get back to you as soon as possible.
          </p>
          <Button asChild size="lg" className="mt-6">
            <Link href="/contact">Contact Us</Link>
          </Button>
        </div>
      </section>
    </div>
  );
}
