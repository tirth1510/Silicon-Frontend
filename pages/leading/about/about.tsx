/* eslint-disable react/no-unescaped-entities */
"use client";

import {
  Award,
  CheckCircle,
  Settings,
  Target,
  Users,
  Heart,
  Sparkles,
  TrendingUp,
  Shield,
  Plus,
  Quote,
  ShieldCheck,
} from "lucide-react";
import FAQ from "./faq";
import Category from "@/pages/leading/sections/category";
import Achivments from "./achiments";
import Ceo from "./ceo";
import { Providers } from "@/providers/providers";
import ReviewsSection from "./review";

export function About() {
  return (
    <div className="pt-16 md:pt-20 overflow-hidden">
      <section>
        <Achivments />
      </section>

      {/* Hero Section / Professional Services */}
      <div className="bg-gradient-to-br from-blue-50 via-white to-purple-50 py-10 md:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-12 items-start">
            <div>
              {/* Professional Services Card */}
              <div className="bg-white border-2 border-blue-900 p-6 md:p-8 rounded-3xl text-center hover:shadow-xl transition-all duration-300 hover:border-blue-600">
                <div className="flex justify-center mb-4">
                  <div className="bg-blue-900 rounded-2xl p-3 md:p-4 shadow-lg">
                    <Settings size={32} className="text-white md:w-10 md:h-10" />
                  </div>
                </div>
                <h5 className="text-gray-900 mb-4 font-bold text-xl md:text-2xl">
                  Professional Services
                </h5>
                <p className="text-blue-900 leading-relaxed text-sm md:text-lg">
                  Biomedical services include equipment repair, preventive
                  maintenance, performance calibration, and safety checks. Our
                  expert BE-Biomedical engineering team ensures minimal
                  downtime.
                </p>
              </div>

              {/* CEO QUOTES - SIDE BY SIDE ON TABLET/DESKTOP, STACKED ON MOBILE */}
              <div className="flex flex-col sm:flex-row gap-4 my-8 md:my-9">
                {/* Card 1: Teal Quote */}
                <div className="group relative flex-1 bg-[#00B5AD] p-6 md:p-8 rounded-[2rem] md:rounded-[2.5rem] shadow-xl overflow-hidden transition-all duration-500 hover:-translate-y-1">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-2xl -mr-10 -mt-10"></div>
                  <div className="absolute bottom-4 right-6 opacity-10">
                    <Quote className="w-12 h-12 md:w-20 md:h-20 text-white fill-current" />
                  </div>

                  <div className="relative z-10 flex flex-col h-full justify-between">
                    <div>
                      <div className="w-10 h-1 rounded-full bg-white/40 mb-4"></div>
                      <p className="text-white text-sm md:text-base italic font-medium leading-relaxed mb-6">
                        "Our mission is to make advanced medical technology
                        accessible to every healthcare facility."
                      </p>
                    </div>

                    <div className="flex items-center gap-3">
                      <div className="h-8 w-8 md:h-10 md:w-10 rounded-lg bg-white/20 backdrop-blur-md flex items-center justify-center border border-white/30 shrink-0">
                        <span className="text-white font-black text-[10px]">KA</span>
                      </div>
                      <div className="min-w-0">
                        <p className="text-white font-black text-xs md:text-sm truncate">- Mr. Krunal Mistry</p>
                        <p className="text-white/70 text-[8px] md:text-[10px] font-bold uppercase tracking-widest">Managing Director</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Card 2: Blue Quote */}
                <div className="group relative flex-1 bg-blue-900 p-6 md:p-8 rounded-[2rem] md:rounded-[2.5rem] shadow-xl overflow-hidden transition-all duration-500 hover:-translate-y-1">
                  <div className="absolute bottom-0 left-0 w-32 h-32 bg-white/10 rounded-full blur-2xl -ml-10 -mb-10"></div>
                  <div className="absolute top-4 right-6 opacity-10">
                    <Plus className="w-10 h-10 md:w-16 md:h-16 text-white" strokeWidth={5} />
                  </div>

                  <div className="relative z-10 flex flex-col h-full justify-between">
                    <div>
                      <div className="w-10 h-1 rounded-full bg-white/40 mb-4"></div>
                      <p className="text-white text-sm md:text-base italic font-medium leading-relaxed mb-6">
                        "Innovation should serve humanity. We are committed to
                        technological excellence in India."
                      </p>
                    </div>

                    <div className="flex items-center gap-3">
                      <div className="h-8 w-8 md:h-10 md:w-10 rounded-lg bg-white/20 backdrop-blur-md flex items-center justify-center border border-white/30 shrink-0">
                        <span className="text-white font-black text-[10px]">NA</span>
                      </div>
                      <div className="min-w-0">
                        <p className="text-white font-black text-xs md:text-sm truncate">- Mr. Nirmal Patel</p>
                        <p className="text-blue-100/70 text-[8px] md:text-[10px] font-bold uppercase tracking-widest">Managing Director</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* WHY CHOOSE US SECTION */}
            <div className="space-y-8">
              <div className="bg-gradient-to-br from-blue-50 to-purple-50 p-6 md:p-8 rounded-3xl border-2 border-blue-100 shadow-lg transition-all duration-300">
                <div className="flex items-center justify-center gap-2 bg-blue-900 text-white px-5 py-2.5 rounded-full mb-6 w-fit mx-auto font-semibold text-sm md:text-base">
                  <Heart size={16} />
                  <span>Why Choose Us?</span>
                </div>
                <p className="text-blue-900 text-center mb-6 leading-relaxed font-medium text-sm md:text-lg px-2">
                  We have established ourselves as a leading supplier of
                  high-quality Medical Equipment and Furniture.
                </p>
                <ul className="text-blue-900 space-y-3">
                  {[
                    "ISO Certified Quality Products",
                    "State Of The Art Infrastructure",
                    "Durable and Reliable Products",
                    "Experienced Technicians",
                    "On Time Delivery",
                    "Customer Satisfaction",
                    "Affordable Price",
                  ].map((item, idx) => (
                    <li
                      key={idx}
                      className="flex items-center gap-3 bg-white/60 p-2.5 md:p-3 rounded-xl hover:bg-white transition-all text-xs md:text-sm"
                    >
                      <CheckCircle className="text-blue-700 shrink-0" size={18} />
                      <span className="font-medium">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* OUR VALUES SECTION */}
      <div className="py-16 md:py-24 bg-white relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center mb-10 md:mb-16">
            <h2 className="text-3xl md:text-5xl font-black text-slate-900 mb-4 tracking-tighter">
              Our Core <span className="text-blue-900">Values</span>
            </h2>
            <p className="text-slate-500 font-bold uppercase tracking-[0.2em] text-[10px] md:text-xs">
              The principles that guide our excellence
            </p>
          </div>

          {/* Core Values Grid - Stacked on mobile, 3 columns on desktop */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
            {/* Value 1: Quality */}
            <div className="group relative bg-[#00B5AD] rounded-[2rem] md:rounded-[2.5rem] p-8 md:p-10 h-[320px] md:h-[380px] flex flex-col justify-between overflow-hidden transition-all duration-500 hover:shadow-2xl">
              <div className="absolute -right-6 -top-6 opacity-10">
                <ShieldCheck size={180} className="text-white" strokeWidth={1} />
              </div>
              <div className="relative z-10 w-14 h-14 bg-white/20 backdrop-blur-md rounded-2xl flex items-center justify-center border border-white/30">
                <ShieldCheck className="text-white" size={28} />
              </div>
              <div className="relative z-10 space-y-3">
                <h3 className="text-2xl md:text-3xl font-black text-white tracking-tight uppercase">Quality First</h3>
                <p className="text-white/80 text-xs md:text-sm font-medium leading-relaxed">
                  We never compromise on the quality of our medical equipment
                  and international standards.
                </p>
                <div className="w-12 h-1 bg-white/40 rounded-full"></div>
              </div>
            </div>

            {/* Value 2: Innovation */}
            <div className="group relative bg-[#1E3A8A] rounded-[2rem] md:rounded-[2.5rem] p-8 md:p-10 h-[320px] md:h-[380px] flex flex-col justify-center overflow-hidden transition-all duration-500 border-b-8 border-blue-400">
              <div className="relative z-10 flex flex-col items-center space-y-4 md:space-y-6 text-center">
                <div className="w-16 h-16 md:w-20 md:h-20 bg-blue-500 rounded-full flex items-center justify-center shadow-inner">
                  <Sparkles className="text-white" size={32} />
                </div>
                <div className="space-y-3">
                  <h3 className="text-2xl md:text-3xl font-black text-white tracking-tight uppercase">Innovation</h3>
                  <p className="text-blue-100/80 text-xs md:text-sm font-medium leading-relaxed">
                    Constantly evolving with the latest medical technology to
                    provide cutting-edge solutions.
                  </p>
                </div>
              </div>
            </div>

            {/* Value 3: Customer Care */}
            <div className="group relative bg-slate-50 border-2 border-slate-100 rounded-[2rem] md:rounded-[2.5rem] p-8 md:p-10 h-[320px] md:h-[380px] flex flex-col transition-all duration-500 hover:shadow-2xl overflow-hidden">
              <div className="mb-4">
                <div className="inline-flex items-center gap-2 bg-blue-100 text-blue-700 px-3 py-1.5 rounded-xl font-black text-[10px] uppercase tracking-widest">
                  <Heart size={12} fill="currentColor" /> Priority
                </div>
              </div>
              <div className="mt-auto space-y-3">
                <h3 className="text-2xl md:text-3xl font-black text-slate-900 tracking-tight leading-none uppercase">Customer Care</h3>
                <p className="text-slate-500 text-xs md:text-sm font-bold leading-relaxed italic">
                  "Building lasting relationships through exceptional service and comprehensive support."
                </p>
                <div className="flex gap-1">
                  {[1, 2, 3].map((i) => <div key={i} className="w-1.5 h-1.5 rounded-full bg-blue-600"></div>)}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Ceo />
      <ReviewsSection />
    </div>
  );
}

export default function WrappedAbout() {
  return (
    <Providers>
      <About />
    </Providers>
  );
}