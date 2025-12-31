"use client";

import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogTitle,
  DialogDescription,
  DialogClose,
} from "@/components/ui/dialog";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Phone, MessageCircle, Mail } from "lucide-react";

type CEO = {
  name: string;
  role: string;
  degree: string;
  image: string;
  bio: string;
  mobile: string;
  whatsapp: string;
  email: string;
};

const ceos: CEO[] = [
  {
    name: "Mr. Krunal Adiyecha",
    role: "Chief Executive Officer",
    degree: "MBBS, MD",
    image: "/ceo.jpg",
    bio: "Dr. Rahul Mehta has over 20 years of experience in healthcare, leading Silicon Meditech Private Limited with vision and innovation.",
    mobile: "+91 9876543210",
    whatsapp: "+91 9876543210",
    email: "rahul.mehta@siliconmeditech.com",
  },
  {
    name: "Mr. Nirmal",
    role: "Chief Operating Officer",
    degree: "BDS, MBA",
    image: "/ceo2.jpg",
    bio: "Dr. Priya Sharma oversees operations, ensuring high-quality medical equipment production and customer satisfaction across India.",
    mobile: "+91 9123456780",
    whatsapp: "+91 9123456780",
    email: "priya.sharma@siliconmeditech.com",
  },
];

export default function CEOSection() {
  return (
    <TooltipProvider>
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12 max-w-2xl mx-auto">
            <h2 className="text-3xl font-bold text-blue-900 mb-4">
              Our Leadership
            </h2>
            <p className="text-gray-600 text-lg">
              Meet the visionary leaders driving our mission forward. Our team
              combines years of expertise in healthcare, operations, and
              innovation to ensure excellence in everything we do.
            </p>
          </div>

          <div className="grid gap-8 sm:grid-cols-2">
            {ceos.map((ceo, idx) => (
              <Dialog key={idx}>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <DialogTrigger asChild>
                      <div className="cursor-pointer bg-white border border-gray-200 rounded-3xl shadow-md hover:shadow-xl transition-all flex flex-col sm:flex-row items-center sm:items-start p-6">
                        {/* Image */}
                        <img
                          src={ceo.image}
                          alt={ceo.name}
                          className="w-32 h-32 rounded-full object-cover border-4 border-gray-100 mb-4 sm:mb-0 sm:mr-6 flex-shrink-0"
                        />

                        {/* Text */}
                        <div className="flex flex-col items-center sm:items-start text-center sm:text-left">
                          <h3 className="text-xl font-bold text-gray-900">
                            {ceo.name}
                          </h3>
                          <span className="text-gray-600 italic">
                            {ceo.degree}
                          </span>
                          <span className="text-gray-500 mb-2">{ceo.role}</span>
                          <p className="text-gray-700 line-clamp-3">
                            {ceo.bio}
                          </p>
                        </div>
                      </div>
                    </DialogTrigger>
                  </TooltipTrigger>
                  <TooltipContent
                    side="top"
                    className="bg-white border-2 h-10 px-4 pb-4  border-blue-900 text-blue-900 rounded-md  "
                  >
                    Click for more information
                  </TooltipContent>
                </Tooltip>

                <DialogContent className="sm:max-w-2xl w-full rounded-3xl p-6">
                  <div className="flex flex-col sm:flex-row gap-6 items-center">
                    {/* Left image */}
                    <img
                      src={ceo.image}
                      alt={ceo.name}
                      className="w-32 h-32 rounded-full object-cover border-4 border-gray-100"
                    />
                    {/* Right content */}
                    <div className="flex flex-col gap-2">
                      <DialogTitle className="text-2xl font-bold text-gray-900">
                        {ceo.name}
                      </DialogTitle>
                      <span className="text-gray-600 italic">{ceo.degree}</span>
                      <span className="text-gray-500">{ceo.role}</span>
                      <DialogDescription className="text-gray-700 mt-2">
                        {ceo.bio}
                      </DialogDescription>

                      {/* Contact info */}
                      <div className="flex gap-4 mt-4">
                        <a
                          href={`tel:${ceo.mobile}`}
                          className="flex items-center gap-1 px-3 py-2 bg-blue-50 text-blue-700 rounded-full hover:bg-blue-100 transition"
                        >
                          <Phone size={16} /> Call
                        </a>
                        <a
                          href={`https://wa.me/${ceo.whatsapp}`}
                          target="_blank"
                          className="flex items-center gap-1 px-3 py-2 bg-green-50 text-green-700 rounded-full hover:bg-green-100 transition"
                        >
                          <MessageCircle size={16} /> WhatsApp
                        </a>
                        <a
                          href={`mailto:${ceo.email}`}
                          className="flex items-center gap-1 px-3 py-2 bg-red-50 text-red-700 rounded-full hover:bg-red-100 transition"
                        >
                          <Mail size={16} /> Email
                        </a>
                      </div>
                    </div>
                  </div>

                  <div className="mt-6 text-center">
                    <DialogClose className="px-6 py-2 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition">
                      Close
                    </DialogClose>
                  </div>
                </DialogContent>
              </Dialog>
            ))}
          </div>
        </div>
      </section>
    </TooltipProvider>
  );
}
