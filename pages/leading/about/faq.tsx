"use client";

import * as React from "react";
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "@/components/ui/accordion";

type FAQItem = {
  question: string;
  answer: string;
};

const faqData: FAQItem[] = [
  {
    question: "What is your refund policy?",
    answer:
      "We offer a full refund within 30 days of purchase if you are not satisfied.",
  },
  {
    question: "How can I contact support?",
    answer:
      "You can reach our support team via email at support@example.com or call us at +1 234 567 890.",
  },
  {
    question: "Do you offer team plans?",
    answer:
      "Yes, we offer team plans with discounted rates for multiple users.",
  },
];

export default function FAQ() {
  return (
   <section className="w-full bg-blue/50 text-white lg:py-16 py-12 lg:px-20 px-8 rounded-3xl shadow-xl">
  <div className="max-w-6xl mx-auto">
    <h2 className="text-2xl lg:text-4xl font-bold mb-8 text-center text-blue-900">
      Frequently Asked Questions
    </h2>

    {/* Grid for two items per row on desktop */}
    <div className="grid gap-6 lg:grid-cols-2">
      {faqData.map((item, index) => (
        <Accordion
          key={index}
          type="single"
          collapsible
          className="space-y-0"
        >
          <AccordionItem
            value={`item-${index}`}
            className="bg-white border border-blue-800 rounded-xl shadow-md 
                       data-[state=open]:border-blue-900 max-sm:rounded-lg max-sm:border max-sm:shadow-sm"
          >
            <AccordionTrigger
              className="text-blue-900 text-lg font-bold px-6 py-4 
                         hover:bg-sky-50 rounded-xl transition-all
                         data-[state=open]:border-2 data-[state=open]:border-blue-900
                         max-sm:text-base max-sm:px-4 max-sm:py-3 max-sm:rounded-lg 
                         max-sm:data-[state=open]:border max-sm:data-[state=open]:border-blue-900"
            >
              {item.question}
            </AccordionTrigger>

            <AccordionContent
              className="text-blue-800 px-6 py-4 border-t border-blue-200
                         max-sm:px-4 max-sm:py-3 max-sm:text-sm"
            >
              {item.answer}
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      ))}
    </div>
  </div>
</section>

  );
}
