"use client";

import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";

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

const sendContactMessage = async (data: ContactFormData) => {
  const apiBase = process.env.NEXT_PUBLIC_API_BASE_URL || "";
  if (!apiBase) throw new Error("API configuration error");
  const response = await fetch(`${apiBase}/api/contact/create`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || "Failed to send message");
  }

  return response.json();
};

export const useContactForm = () => {
  return useMutation<unknown, Error, ContactFormData>({
    mutationFn: sendContactMessage,
    onSuccess: () => {
      toast.success("Message sent successfully!");
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to send message");
    },
  });
};
