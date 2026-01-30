"use client";

import { Mail, Phone, MapPin, Clock, Send, Plus } from "lucide-react";
import ContactFirst from "./contectfirst";

export default function Contact() {
  const contactDetails = [
    {
      title: "Email Us",
      info1: "info@meditech.com",
      info2: "sales@meditech.com",
      icon: Mail,
      theme: "bg-[#00B5AD]", // Medical Teal
      href1: "mailto:info@meditech.com",
      href2: "mailto:sales@meditech.com"
    },
    {
      title: "Call Us",
      info1: "Sales: +1 (555) 123-4567",
      info2: "Support: +1 (555) 123-4568",
      icon: Phone,
      theme: "bg-[#FFB800]", // Care Yellow
      href1: "tel:+15551234567",
      href2: "tel:+15551234568"
    },
    {
      title: "Visit Us",
      info1: "123 Medical Boulevard",
      info2: "New York, NY 10001",
      icon: MapPin,
      theme: "bg-blue-900", // Health Blue
      href1: "#",
      href2: "#"
    }
  ];

  return (
    <div className="min-h-screen bg-slate-50">
      {/* HERO SECTION */}
      <div className="pt-24 pb-12 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-10">
            <div className="space-y-6 max-w-2xl">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-100 rounded-full text-blue-700 font-bold text-xs uppercase tracking-widest">
                <Send className="w-4 h-4" />
                Get in Touch
              </div>
              <h1 className="text-5xl md:text-6xl font-black text-slate-900 leading-[1.1] tracking-tight">
                How can we <span className="text-blue-900">help you?</span>
              </h1>
              <p className="text-lg text-slate-600 font-medium leading-relaxed">
                Have questions about our medical equipment or services?
                Our team of experts is ready to provide the right solution.
              </p>
            </div>

            {/* Visual Decorative Element */}
            <div className="hidden lg:block relative">
              <div className="w-64 h-64 bg-blue-600 rounded-[3rem] rotate-12 flex items-center justify-center shadow-2xl">
                <Plus className="text-white w-32 h-32 opacity-20" strokeWidth={4} />
                <Send className="absolute text-white w-20 h-20 -rotate-12" />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* MAIN CONTENT */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 items-start">

          {/* LEFT SIDEBAR - CONTACT INFO */}
          <div className="lg:col-span-1 space-y-8">
            {contactDetails.map((item, idx) => (
              <div
                key={idx}
                className={`group relative ${item.theme} rounded-[2.5rem] p-8 h-[200px] overflow-visible flex items-center transition-all duration-500 hover:shadow-2xl hover:-translate-y-1`}
              >
                {/* Background Plus Pattern */}
                <div className="absolute top-4 right-6 opacity-10">
                  <Plus className="w-20 h-20 text-white" strokeWidth={4} />
                </div>

                <div className="relative z-10 w-full space-y-4">
                  <div className="bg-white/20 w-12 h-12 rounded-2xl flex items-center justify-center border border-white/30 backdrop-blur-md">
                    <item.icon className="text-white w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-black text-white tracking-tight mb-2">{item.title}</h3>
                    <div className="space-y-0.5">
                      <a href={item.href1} className="block text-white/90 font-bold text-sm hover:underline">{item.info1}</a>
                      <a href={item.href2} className="block text-white/90 font-bold text-sm hover:underline">{item.info2}</a>
                    </div>
                  </div>
                </div>
              </div>
            ))}

            {/* BUSINESS HOURS - REDESIGNED */}
            <div className="bg-white rounded-[2.5rem] p-8 border border-slate-200 shadow-sm space-y-6">
              <div className="flex items-center gap-4">
                <div className="bg-blue-50 p-3 rounded-2xl">
                  <Clock className="w-6 h-6 text-blue-600" />
                </div>
                <h3 className="text-xl font-black text-slate-900 tracking-tight">Business Hours</h3>
              </div>
              <div className="space-y-4">
                {[
                  { days: "Monday – Friday", time: "8:00 AM – 6:00 PM", color: "text-slate-900" },
                  { days: "Saturday", time: "9:00 AM – 2:00 PM", color: "text-slate-900" },
                  { days: "Sunday", time: "Closed", color: "text-red-600" }
                ].map((row, i) => (
                  <div key={i} className="flex justify-between items-center border-b border-slate-50 pb-2">
                    <span className="text-sm font-bold text-slate-500">{row.days}</span>
                    <span className={`text-sm font-black ${row.color}`}>{row.time}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* RIGHT SIDE - CONTACT FORM */}
          <div className="lg:col-span-2">
            <ContactFirst />
          </div>

        </div>

        {/* MAP SECTION */}
        <div className="mt-20">
          <div className="bg-slate-900 rounded-[3rem] overflow-hidden shadow-2xl relative">
            <div className="absolute top-8 left-8 z-10 bg-white p-4 rounded-2xl shadow-xl border border-slate-100 hidden md:block">
              <h4 className="font-black text-slate-900 text-lg flex items-center gap-2">
                <MapPin className="text-blue-600 w-5 h-5" />
                Headquarters
              </h4>
              <p className="text-slate-500 text-sm font-bold mt-1">123 Medical Boulevard, NY</p>
            </div>
            <div className="w-full h-[450px]">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3720.6941518634853!2d72.81967007559992!3d21.164566580519015!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3be04dce7c1f68d3%3A0xc4a37b13297092d4!2sSilicon%20Medi%20Tech%20Pvt%20Ltd!5e0!3m2!1sen!2sin!4v1764504972615!5m2!1sen!2sin"
                className="w-full h-full"
                style={{ border: 0 }}
                loading="lazy"
                allowFullScreen
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}