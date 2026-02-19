"use client";

import { Mail, Phone, MapPin, Clock, Send, Plus } from "lucide-react";
import ContactFirst from "./contectfirst";

export default function Contact() {
  const contactDetails = [
    {
      title: "Email Us",
      info1: "siliconmeditech@gmail.com",
      icon: Mail,
      theme: "bg-[#00B5AD]",
      href1: "mailto:siliconmeditech@gmail.com",
    },
    {
      title: "Call Us",
      info1: "+91 96015 51892",
      info2: "+91 94295 54465",
      icon: Phone,
      theme: "bg-[#FFB800]",
      href1: "tel:+919601551892",
      href2: "tel:+919429554465",
    },
    {
      title: "Visit Us",
      info1: "09, Hariom Industrial Soc, Navjivan Circle, Bhatar",
      info2: "Surat, Gujarat - 395017",
      icon: MapPin,
      theme: "bg-blue-900",
      href1: "https://maps.google.com",
      href2: "#",
    },
  ];

  return (
    <div className="min-h-screen bg-slate-50 overflow-x-hidden">
      {/* HERO SECTION */}
      <div className="pt-24 md:pt-32 pb-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-10">
            <div className="space-y-6 max-w-2xl text-center md:text-left">
              <h1 className="text-4xl sm:text-5xl md:text-6xl font-black text-slate-900 leading-[1.1] tracking-tight">
                How can we <span className="text-blue-900">help you?</span>
              </h1>
              <p className="text-base md:text-lg text-slate-600 font-medium leading-relaxed max-w-lg mx-auto md:mx-0">
                Have questions about our medical equipment or services? Our team
                of experts is ready to provide the right solution.
              </p>
            </div>

            {/* Visual Decorative Element - Hidden on Small Screens */}
            <div className="hidden lg:block relative shrink-0">
              <div className="w-56 h-56 bg-blue-600 rounded-[3rem] rotate-12 flex items-center justify-center shadow-2xl animate-pulse">
                <Plus className="text-white w-24 h-24 opacity-20" strokeWidth={4} />
                <Send className="absolute text-white w-16 h-16 -rotate-12" />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* MAIN CONTENT */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 md:gap-12 items-start">
          
          {/* LEFT SIDE - CONTACT CARDS */}
          <div className="lg:col-span-1 space-y-6">
            {contactDetails.map((item, idx) => (
              <div
                key={idx}
                className={`group relative ${item.theme} rounded-[2rem] md:rounded-[2.5rem] p-6 md:p-8 min-h-[180px] flex items-center transition-all duration-500 hover:shadow-2xl hover:-translate-y-1 overflow-hidden shadow-lg`}
              >
                {/* Background Pattern */}
                <div className="absolute top-4 right-6 opacity-10">
                  <Plus className="w-16 h-16 text-white group-hover:rotate-90 transition-transform duration-700" strokeWidth={4} />
                </div>

                <div className="relative z-10 w-full space-y-4">
                  <div className="bg-white/20 w-12 h-12 rounded-xl flex items-center justify-center border border-white/30 backdrop-blur-md">
                    <item.icon className="text-white w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="text-xl md:text-2xl font-black text-white tracking-tight mb-2">
                      {item.title}
                    </h3>
                    <div className="space-y-1">
                      <a href={item.href1} className="block text-white/90 font-bold text-sm md:text-base hover:underline break-words">
                        {item.info1}
                      </a>
                      {item.info2 && (
                        <a href={item.href2} className="block text-white/90 font-bold text-sm md:text-base hover:underline">
                          {item.info2}
                        </a>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}

            {/* Business Hours Card */}
            <div className="bg-white rounded-[2rem] md:rounded-[2.5rem] p-6 md:p-8 border border-slate-200 shadow-sm space-y-6">
              <div className="flex items-center gap-4">
                <div className="bg-blue-50 p-3 rounded-2xl">
                  <Clock className="w-6 h-6 text-blue-600" />
                </div>
                <h3 className="text-xl font-black text-slate-900 tracking-tight">
                  Business Hours
                </h3>
              </div>
              <div className="space-y-4">
                {[
                  { days: "Monday – Saturday", time: "10:00 AM – 7:00 PM", color: "text-slate-900" },
                  { days: "Sunday", time: "Closed", color: "text-red-600" },
                ].map((row, i) => (
                  <div key={i} className="flex justify-between items-center border-b border-slate-50 pb-2">
                    <span className="text-xs md:text-sm font-bold text-slate-500">{row.days}</span>
                    <span className={`text-xs md:text-sm font-black ${row.color}`}>{row.time}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* RIGHT SIDE - CONTACT FORM */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-[2.5rem] p-1 shadow-sm">
               <ContactFirst />
            </div>
          </div>
        </div>

        {/* MAP SECTION */}
        <div className="mt-16 md:mt-24">
          <div className="bg-slate-900 rounded-[2.5rem] md:rounded-[3.5rem] overflow-hidden shadow-2xl relative group">
            {/* Map Info Card - Desktop only */}
            <div className="absolute top-8 left-8 z-10 bg-white p-6 rounded-2xl shadow-2xl border border-slate-100 hidden md:block transition-all group-hover:scale-105">
              <h4 className="font-black text-slate-900 text-lg flex items-center gap-2">
                <MapPin className="text-blue-600 w-5 h-5" />
                Headquarters
              </h4>
              <p className="text-slate-500 text-sm font-bold mt-2 max-w-[200px]">
                09, Hariom Industrial Soc, Bhatar, Surat, Gujarat
              </p>
            </div>
            
            <div className="w-full h-[350px] md:h-[500px]">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3721.218386823374!2d72.8080!3d21.15!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMjHCsDA5JzAwLjAiTiA3MsKwNDgnMjguOCJF!5e0!3m2!1sen!2sin!4v1234567890"
                className="w-full h-full grayscale hover:grayscale-0 transition-all duration-1000"
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