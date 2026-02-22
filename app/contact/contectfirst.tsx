"use client";

import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { useMutation } from "@tanstack/react-query";
import { submitContactEnquiry } from "@/services/enquiry.api";
import { toast } from "sonner";

/* ---------- TYPES ---------- */
type ContactFormData = {
  name: string;
  email: string;
  phone: string;
  companyName: string;
  companyEmail: string;
  companyLocation: string;
  companyPhoneNumber: string;
  messageTitle: string;
  message: string;
};

export default function ContactForm() {
  const [formData, setFormData] = useState<ContactFormData>({
    name: "",
    email: "",
    phone: "",
    companyName: "",
    companyEmail: "",
    companyLocation: "",
    companyPhoneNumber: "",
    messageTitle: "",
    message: "",
  });

  // ✅ Fixed: Kept only the useMutation setup and removed the conflicting custom hook
  const { mutate, isPending } = useMutation({
    mutationFn: submitContactEnquiry,
  });

  /* ---------- HANDLE INPUT CHANGE ---------- */
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  /* ---------- HANDLE SUBMIT ---------- */
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    mutate(formData, {
      onSuccess: (data) => {
        // 1️⃣ Show success toast or alert
        toast.success("Form submitted successfully!");

        // 2️⃣ Reset form completely
        setFormData({
          name: "",
          email: "",
          phone: "",
          companyName: "",
          companyEmail: "",
          companyLocation: "",
          companyPhoneNumber: "",
          messageTitle: "",
          message: "",
        });
      },
      onError: (error) => {
        // 3️⃣ Handle error 
        console.error("Submission failed:", error);
        alert("Something went wrong. Please try again.");
      }
    });
  };

  return (
    <div className="bg-white rounded-4xl shadow-md border border-gray-100 overflow-hidden">
      {/* Form Header */}
      <div className="bg-gradient-to-r from-blue-900 to-blue-800 p-6">
        <h2 className="text-2xl font-bold text-white mb-1">
          Send Us a Message
        </h2>
        <p className="text-blue-100 text-sm">
          Fill out the form and we&lsquo;ll get back to you soon
        </p>
      </div>

      <form onSubmit={handleSubmit} className="p-6 sm:p-8 space-y-6">

        {/* PERSONAL INFO */}
        <div className="space-y-4">
          <h3 className="text-sm font-semibold text-blue-900 uppercase tracking-wide border-b border-gray-200 pb-2">
            Personal Information
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label className="text-gray-700 text-sm">
                Name <span className="text-red-500">*</span>
              </Label>
              <Input
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="John Doe"
                required
                className="border-gray-300 focus:border-blue-900 focus:ring-blue-900"
              />
            </div>

            <div className="space-y-1.5">
              <Label className="text-gray-700 text-sm">
                Email <span className="text-red-500">*</span>
              </Label>
              <Input
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="john@example.com"
                required
                className="border-gray-300 focus:border-blue-900 focus:ring-blue-900"
              />
            </div>

            <div className="space-y-1.5">
              <Label className="text-gray-700 text-sm">Phone</Label>
              <Input
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                placeholder="+1 (555) 123-4567"
                className="border-gray-300 focus:border-blue-900 focus:ring-blue-900"
              />
            </div>
          </div>
        </div>

        {/* COMPANY INFO */}
        <div className="space-y-4">
          <h3 className="text-sm font-semibold text-blue-900 uppercase tracking-wide border-b border-gray-200 pb-2">
            Company Details <span className="text-gray-500 text-xs normal-case">(Optional)</span>
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label className="text-gray-700 text-sm">Company Name</Label>
              <Input
                name="companyName"
                value={formData.companyName}
                onChange={handleChange}
                placeholder="Acme Corporation"
                className="border-gray-300 focus:border-blue-900 focus:ring-blue-900"
              />
            </div>

            <div className="space-y-1.5">
              <Label className="text-gray-700 text-sm">Company Email</Label>
              <Input
                name="companyEmail"
                value={formData.companyEmail}
                onChange={handleChange}
                placeholder="contact@company.com"
                className="border-gray-300 focus:border-blue-900 focus:ring-blue-900"
              />
            </div>

            <div className="space-y-1.5">
              <Label className="text-gray-700 text-sm">Company Location</Label>
              <Input
                name="companyLocation"
                value={formData.companyLocation}
                onChange={handleChange}
                placeholder="New York, USA"
                className="border-gray-300 focus:border-blue-900 focus:ring-blue-900"
              />
            </div>

            <div className="space-y-1.5">
              <Label className="text-gray-700 text-sm">Company Phone</Label>
              <Input
                name="companyPhoneNumber"
                value={formData.companyPhoneNumber}
                onChange={handleChange}
                placeholder="+1 (555) 987-6543"
                className="border-gray-300 focus:border-blue-900 focus:ring-blue-900"
              />
            </div>
          </div>
        </div>

        {/* MESSAGE */}
        <div className="space-y-4">
          <h3 className="text-sm font-semibold text-blue-900 uppercase tracking-wide border-b border-gray-200 pb-2">
            Your Message
          </h3>
          <div className="space-y-4">
            <div className="space-y-1.5">
              <Label className="text-gray-700 text-sm">Subject</Label>
              <Input
                name="messageTitle"
                value={formData.messageTitle}
                onChange={handleChange}
                placeholder="How can we help you?"
                className="border-gray-300 focus:border-blue-900 focus:ring-blue-900"
              />
            </div>

            <div className="space-y-1.5">
              <Label className="text-gray-700 text-sm">Message</Label>
              <Textarea
                name="message"
                value={formData.message}
                onChange={handleChange}
                rows={5}
                required
                placeholder="Tell us more about your inquiry..."
                className="border-gray-300 focus:border-blue-900 focus:ring-blue-900 resize-none"
              />
            </div>
          </div>
        </div>

        {/* SUBMIT BUTTON */}
        <Button
          type="submit"
          disabled={isPending}
          className="w-full bg-gradient-to-r from-blue-900 to-blue-800 hover:from-blue-800 hover:to-blue-700 text-white font-semibold py-5 rounded-lg shadow-md hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isPending ? (
            <span className="flex items-center justify-center">
              <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Sending...
            </span>
          ) : (
            <span className="flex items-center justify-center">
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
              </svg>
              Send Message
            </span>
          )}
        </Button>

        <p className="text-center text-xs text-gray-500">
          We typically respond within 24 hours during business days
        </p>
      </form>
    </div>
  );
}
