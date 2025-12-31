"use client";

import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { useContactForm } from "@/hooks/useContactForm";

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

/* ---------- WHATSAPP NUMBER (NO + SIGN) ---------- */
const WHATSAPP_NUMBER = "+918160496588"; // example: 919876543210

/* ---------- FORMAT WHATSAPP MESSAGE ---------- */
const formatWhatsAppMessage = (data: ContactFormData) => {
  return `
📩 *New Contact Form Submission*

👤 Name: ${data.name}
📧 Email: ${data.email}
📞 Phone: ${data.phone || "N/A"}

🏢 Company Name: ${data.companyName || "N/A"}
🏢 Company Email: ${data.companyEmail || "N/A"}
📍 Company Location: ${data.companyLocation || "N/A"}
☎️ Company Phone: ${data.companyPhoneNumber || "N/A"}

📝 Subject: ${data.messageTitle || "N/A"}

💬 Message:
${data.message}
`;
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

  const { mutate, isPending } = useContactForm();

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
      onSuccess: () => {
        // 1️⃣ Build WhatsApp message
        const message = formatWhatsAppMessage(formData);

        // 2️⃣ Encode message for URL
        const encodedMessage = encodeURIComponent(message);

        // 3️⃣ Open WhatsApp
        window.open(
          `https://wa.me/${WHATSAPP_NUMBER}?text=${encodedMessage}`,
          "_blank"
        );

        // 4️⃣ Reset form
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
    });
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="p-6 max-w-3xl mx-auto bg-white shadow-md rounded-lg space-y-6"
    >
      <h2 className="text-2xl font-semibold text-blue-900 text-center">
        Contact Us
      </h2>

      {/* ---------- PERSONAL INFO ---------- */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <Label>Name</Label>
          <Input
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
          />
        </div>

        <div className="space-y-2">
          <Label>Email</Label>
          <Input
            name="email"
            type="email"
            value={formData.email}
            onChange={handleChange}
            required
          />
        </div>

        <div className="space-y-2">
          <Label>Phone</Label>
          <Input
            name="phone"
            value={formData.phone}
            onChange={handleChange}
          />
        </div>
      </div>

      {/* ---------- COMPANY INFO ---------- */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <Label>Company Name</Label>
          <Input
            name="companyName"
            value={formData.companyName}
            onChange={handleChange}
          />
        </div>

        <div className="space-y-2">
          <Label>Company Email</Label>
          <Input
            name="companyEmail"
            value={formData.companyEmail}
            onChange={handleChange}
          />
        </div>

        <div className="space-y-2">
          <Label>Company Location</Label>
          <Input
            name="companyLocation"
            value={formData.companyLocation}
            onChange={handleChange}
          />
        </div>

        <div className="space-y-2">
          <Label>Company Phone</Label>
          <Input
            name="companyPhoneNumber"
            value={formData.companyPhoneNumber}
            onChange={handleChange}
          />
        </div>
      </div>

      {/* ---------- MESSAGE ---------- */}
      <div className="space-y-2">
        <Label>Message Title</Label>
        <Input
          name="messageTitle"
          value={formData.messageTitle}
          onChange={handleChange}
        />
      </div>

      <div className="space-y-2">
        <Label>Message</Label>
        <Textarea
          name="message"
          value={formData.message}
          onChange={handleChange}
          rows={5}
        />
      </div>

      <Button
        type="submit"
        disabled={isPending}
        className="w-full bg-blue-600 hover:bg-blue-700 text-white"
      >
        {isPending ? "Sending..." : "Send Message"}
      </Button>
    </form>
  );
}
