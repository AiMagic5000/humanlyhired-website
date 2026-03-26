"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import { Phone, Mail, MapPin, Clock, Send, CheckCircle, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { siteConfig } from "@/lib/config";

const contactSchema = z.object({
  firstName: z.string().min(2, "First name is required"),
  lastName: z.string().min(2, "Last name is required"),
  email: z.string().email("Valid email is required"),
  phone: z.string().optional(),
  company: z.string().optional(),
  subject: z.string().min(5, "Subject must be at least 5 characters"),
  message: z.string().min(10, "Message must be at least 10 characters"),
  type: z.enum(["general", "employer", "candidate"]).optional(),
});

type ContactFormData = z.infer<typeof contactSchema>;

export default function ContactPage() {
  const [submitted, setSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ContactFormData>({
    resolver: zodResolver(contactSchema),
    defaultValues: {
      type: "general",
    },
  });

  const onSubmit = async (data: ContactFormData) => {
    setIsSubmitting(true);

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: `${data.firstName} ${data.lastName}`,
          ...data,
        }),
      });

      const result = await response.json();

      if (result.success) {
        setSubmitted(true);
        reset();
        toast.success("Message sent successfully!");
      } else {
        toast.error(result.error || "Failed to send message");
      }
    } catch (error) {
      console.error("Contact form error:", error);
      toast.error("An error occurred. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="bg-gradient-to-br from-blue-600 to-blue-800 py-20">
        <div className="mx-auto max-w-7xl px-4 lg:px-8">
          <div className="max-w-3xl">
            <h1 className="text-4xl sm:text-5xl font-bold text-white">Contact Us</h1>
            <p className="mt-6 text-xl text-blue-100">
              Have questions? We&apos;re here to help. Reach out and let&apos;s start a conversation.
            </p>
          </div>
        </div>
      </section>

      {/* Contact Content */}
      <section className="py-20 bg-white">
        <div className="mx-auto max-w-7xl px-4 lg:px-8">
          <div className="grid gap-12 lg:grid-cols-2">
            {/* Contact Info */}
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Get in Touch</h2>
              <p className="mt-4 text-gray-600">
                Whether you&apos;re looking to hire top talent or find your next career opportunity,
                our team is ready to assist you.
              </p>

              <div className="mt-10 space-y-6">
                <div className="flex items-start gap-4">
                  <div className="rounded-full bg-blue-100 p-3 text-blue-600">
                    <Phone className="h-6 w-6" />
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900">Phone</p>
                    <a
                      href={`tel:${siteConfig.contact.phone.replace(/[^0-9]/g, "")}`}
                      className="text-gray-600 hover:text-blue-600"
                    >
                      {siteConfig.contact.phone}
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="rounded-full bg-blue-100 p-3 text-blue-600">
                    <Mail className="h-6 w-6" />
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900">Email</p>
                    <a
                      href={`mailto:${siteConfig.contact.email}`}
                      className="text-gray-600 hover:text-blue-600"
                    >
                      {siteConfig.contact.email}
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="rounded-full bg-blue-100 p-3 text-blue-600">
                    <MapPin className="h-6 w-6" />
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900">Address</p>
                    <p className="text-gray-600">{siteConfig.contact.address.full}</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="rounded-full bg-blue-100 p-3 text-blue-600">
                    <Clock className="h-6 w-6" />
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900">Business Hours</p>
                    <p className="text-gray-600">Monday - Friday: 8:00 AM - 6:00 PM MST</p>
                    <p className="text-gray-600">Saturday - Sunday: Closed</p>
                  </div>
                </div>
              </div>

              {/* Quick Contact Options */}
              <div className="mt-10 p-6 bg-gray-50 rounded-2xl">
                <h3 className="font-semibold text-gray-900 mb-4">Quick Contact Options</h3>
                <div className="grid sm:grid-cols-2 gap-3">
                  <a
                    href={`tel:${siteConfig.contact.phone.replace(/[^0-9]/g, "")}`}
                    className="flex items-center justify-center gap-2 py-3 px-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    <Phone className="w-4 h-4" />
                    Call Now
                  </a>
                  <a
                    href={`mailto:${siteConfig.contact.email}`}
                    className="flex items-center justify-center gap-2 py-3 px-4 bg-white border border-gray-200 text-gray-900 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    <Mail className="w-4 h-4" />
                    Email Us
                  </a>
                </div>
              </div>
            </div>

            {/* Contact Form */}
            <div className="bg-gray-50 rounded-2xl p-8">
              {submitted ? (
                <div className="text-center py-12">
                  <div className="mx-auto w-16 h-16 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600 mb-4">
                    <CheckCircle className="h-8 w-8" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900">Message Sent!</h3>
                  <p className="mt-2 text-gray-600">
                    Thank you for reaching out. We&apos;ll get back to you within 24 hours.
                  </p>
                  <Button className="mt-6" onClick={() => setSubmitted(false)}>
                    Send Another Message
                  </Button>
                </div>
              ) : (
                <>
                  <h2 className="text-2xl font-bold text-gray-900">Send Us a Message</h2>
                  <p className="mt-2 text-gray-600">Fill out the form below and we&apos;ll respond promptly.</p>

                  <form onSubmit={handleSubmit(onSubmit)} className="mt-8 space-y-6">
                    {/* I am a... */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        I am a...
                      </label>
                      <div className="grid grid-cols-3 gap-2 sm:gap-3">
                        <label className="min-w-0">
                          <input
                            type="radio"
                            {...register("type")}
                            value="candidate"
                            className="sr-only peer"
                          />
                          <div className="text-center py-2.5 sm:py-3 px-2 sm:px-4 border border-gray-300 rounded-lg cursor-pointer peer-checked:border-blue-600 peer-checked:bg-blue-50 peer-checked:text-blue-600 hover:bg-gray-50 transition-colors text-xs sm:text-sm truncate">
                            Job Seeker
                          </div>
                        </label>
                        <label className="min-w-0">
                          <input
                            type="radio"
                            {...register("type")}
                            value="employer"
                            className="sr-only peer"
                          />
                          <div className="text-center py-2.5 sm:py-3 px-2 sm:px-4 border border-gray-300 rounded-lg cursor-pointer peer-checked:border-blue-600 peer-checked:bg-blue-50 peer-checked:text-blue-600 hover:bg-gray-50 transition-colors text-xs sm:text-sm truncate">
                            Employer
                          </div>
                        </label>
                        <label className="min-w-0">
                          <input
                            type="radio"
                            {...register("type")}
                            value="general"
                            className="sr-only peer"
                            defaultChecked
                          />
                          <div className="text-center py-2.5 sm:py-3 px-2 sm:px-4 border border-gray-300 rounded-lg cursor-pointer peer-checked:border-blue-600 peer-checked:bg-blue-50 peer-checked:text-blue-600 hover:bg-gray-50 transition-colors text-xs sm:text-sm truncate">
                            Other
                          </div>
                        </label>
                      </div>
                    </div>

                    <div className="grid gap-6 sm:grid-cols-2">
                      <div>
                        <label htmlFor="firstName" className="block text-sm font-medium text-gray-700 mb-2">
                          First Name *
                        </label>
                        <Input
                          id="firstName"
                          {...register("firstName")}
                          placeholder="John"
                          className={errors.firstName ? "border-red-500" : ""}
                        />
                        {errors.firstName && (
                          <p className="text-sm text-red-500 mt-1">{errors.firstName.message}</p>
                        )}
                      </div>
                      <div>
                        <label htmlFor="lastName" className="block text-sm font-medium text-gray-700 mb-2">
                          Last Name *
                        </label>
                        <Input
                          id="lastName"
                          {...register("lastName")}
                          placeholder="Doe"
                          className={errors.lastName ? "border-red-500" : ""}
                        />
                        {errors.lastName && (
                          <p className="text-sm text-red-500 mt-1">{errors.lastName.message}</p>
                        )}
                      </div>
                    </div>

                    <div>
                      <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                        Email *
                      </label>
                      <Input
                        id="email"
                        type="email"
                        {...register("email")}
                        placeholder="john@example.com"
                        className={errors.email ? "border-red-500" : ""}
                      />
                      {errors.email && (
                        <p className="text-sm text-red-500 mt-1">{errors.email.message}</p>
                      )}
                    </div>

                    <div className="grid gap-6 sm:grid-cols-2">
                      <div>
                        <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">
                          Phone
                        </label>
                        <Input
                          id="phone"
                          type="tel"
                          {...register("phone")}
                          placeholder="(555) 123-4567"
                        />
                      </div>
                      <div>
                        <label htmlFor="company" className="block text-sm font-medium text-gray-700 mb-2">
                          Company
                        </label>
                        <Input
                          id="company"
                          {...register("company")}
                          placeholder="Your company"
                        />
                      </div>
                    </div>

                    <div>
                      <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-2">
                        Subject *
                      </label>
                      <Input
                        id="subject"
                        {...register("subject")}
                        placeholder="How can we help?"
                        className={errors.subject ? "border-red-500" : ""}
                      />
                      {errors.subject && (
                        <p className="text-sm text-red-500 mt-1">{errors.subject.message}</p>
                      )}
                    </div>

                    <div>
                      <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-2">
                        Message *
                      </label>
                      <textarea
                        id="message"
                        {...register("message")}
                        rows={5}
                        placeholder="Tell us more about your needs..."
                        className={`flex w-full rounded-lg border ${
                          errors.message ? "border-red-500" : "border-gray-300"
                        } bg-white px-4 py-3 text-sm placeholder:text-gray-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:border-transparent`}
                      />
                      {errors.message && (
                        <p className="text-sm text-red-500 mt-1">{errors.message.message}</p>
                      )}
                    </div>

                    <Button type="submit" className="w-full" size="lg" disabled={isSubmitting}>
                      {isSubmitting ? (
                        <>
                          <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                          Sending...
                        </>
                      ) : (
                        <>
                          <Send className="mr-2 h-5 w-5" />
                          Send Message
                        </>
                      )}
                    </Button>
                  </form>
                </>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Map Section */}
      <section className="py-12 bg-gray-50">
        <div className="mx-auto max-w-7xl px-4 lg:px-8">
          <div className="rounded-2xl overflow-hidden h-96">
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3006.8267082456!2d-104.80199432357866!3d41.13071181134131!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x876f3e8c9a8c0001%3A0x1234567890abcdef!2s1501%20S%20Greeley%20Hwy%2C%20Cheyenne%2C%20WY%2082007!5e0!3m2!1sen!2sus!4v1704067200000!5m2!1sen!2sus"
              width="100%"
              height="100%"
              style={{ border: 0 }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title={`Map showing ${siteConfig.contact.address.full}`}
            />
          </div>
          <div className="mt-4 text-center">
            <a
              href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(siteConfig.contact.address.full)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 font-medium"
            >
              <MapPin className="w-4 h-4" />
              Get Directions
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
