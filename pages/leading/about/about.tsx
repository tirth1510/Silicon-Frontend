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
    <div className="pt-20">
      <section>
        <Achivments />
      </section>

      {/* Hero Section */}
      <div className="bg-linear-to-br from-blue-50 via-white to-purple-50 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16 max-w-4xl mx-auto">
           
            {/* <h1 className="text-5xl font-bold text-gray-900 mb-6 leading-tight">
              Transforming Healthcare with
              <span className="text-blue-900">
                {" "}
                Innovation & Excellence
              </span>
            </h1>
            <p className="text-gray-600 text-xl leading-relaxed">
              Silicon Meditech Private Limited are one of the Exalted
              Manufacturers and Suppliers of Medical Equipment, Hospital
              Furniture & Consumables in India. Founded in 2013, we have grown
              to become a recognized name in the healthcare industry.
            </p> */}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
            <div>
              <div className="bg-white border-2 border-blue-900 p-8 rounded-3xl text-center hover:shadow-xl transition-all duration-300 hover:border-blue-600">
                <div className="flex justify-center mb-4">
                  <div className="bg-gradient-to-br from-blue-900 to-blue-900 rounded-2xl p-4 shadow-lg">
                    <Settings size={40} className="text-white" />
                  </div>
                </div>
                <h5 className="text-gray-900 mb-4 font-bold text-2xl">
                  Professional Services
                </h5>
                <p className="text-blue-900 leading-relaxed max-w-3xl mx-auto text-lg">
                  Biomedical services include equipment repair, preventive
                  maintenance, performance calibration, and safety checks. Our
                  expert BE-Biomedical engineering team ensures minimal
                  downtime.
                </p>
              </div>

              {/* QUOTE */}
              {/* Container to keep cards side-by-side without increasing height */}
              <div className=" md:flex-row my-9">
                {/* Card 1: Teal/Medical Banner St-4 yle */}
                <div className="group relative mb-10 flex-1 bg-[#00B5AD] p-8 rounded-[2.5rem] shadow-xl overflow-hidden transition-all duration-500 hover:shadow-2xl hover:-translate-y-1">
                  {/* Decorative Elements */}
                  <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-2xl -mr-10 -mt-10 group-hover:bg-white/20 transition-colors"></div>
                  <div className="absolute bottom-4 right-8 opacity-10">
                    <Quote className="w-20 h-20 text-white fill-current" />
                  </div>

                  <div className="relative z-10 flex flex-col h-full justify-between">
                    <div>
                      <div className="w-10 h-1 rounded-full bg-white/40 mb-4"></div>
                      <p className="text-white text-base md:text-lg italic font-medium leading-relaxed mb-6">
                        "Our mission is to make advanced medical technology
                        accessible to every healthcare facility."
                      </p>
                    </div>

                    <div className="flex items-center gap-4">
                      <div className="h-10 w-10 rounded-xl bg-white/20 backdrop-blur-md border border-white/30 flex items-center justify-center">
                        <span className="text-white font-black text-xs">
                          KA
                        </span>
                      </div>
                      <div>
                        <p className="text-white font-black text-sm tracking-tight">
                          - Mr. Krunal Mistry
                        </p>
                        <p className="text-white/70 text-[10px] font-bold uppercase tracking-widest">
                          Managing director 
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Card 2: Blue/Professional Banner Style */}
                <div className="group relative flex-1 bg-blue-900 p-8 rounded-[2.5rem] shadow-xl overflow-hidden transition-all duration-500 hover:shadow-2xl hover:-translate-y-1">
                  {/* Decorative Elements */}
                  <div className="absolute bottom-0 left-0 w-32 h-32 bg-white/10 rounded-full blur-2xl -ml-10 -mb-10 group-hover:bg-white/20 transition-colors"></div>
                  <div className="absolute top-4 right-8 opacity-10">
                    <Plus className="w-16 h-16 text-white" strokeWidth={5} />
                  </div>

                  <div className="relative z-10 flex flex-col h-full justify-between">
                    <div>
                      <div className="w-10 h-1 rounded-full bg-white/40 mb-4"></div>
                      <p className="text-white text-base md:text-lg italic font-medium leading-relaxed mb-6">
                        "Innovation should serve humanity. We are committed to
                        technological excellence in India."
                      </p>
                    </div>

                    <div className="flex items-center gap-4">
                      <div className="h-10 w-10 rounded-xl bg-white/20 backdrop-blur-md border border-white/30 flex items-center justify-center">
                        <span className="text-white font-black text-xs">
                          NA
                        </span>
                      </div>
                      <div>
                        <p className="text-white font-black text-sm tracking-tight">
                          - Mr. Nirmal Patel
                        </p>
                        <p className="text-blue-100/70 text-[10px] font-bold uppercase tracking-widest">
                          Managing director 
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            {/* CEO Image + Achievement Card */}

            {/* Info Section */}
            <div className="space-y-8">
              {/* WHY US */}
              <div className="bg-gradient-to-br from-blue-50 to-purple-50 p-8 rounded-3xl border-2 border-blue-100 shadow-lg hover:shadow-xl transition-all duration-300">
                <div className="flex items-center justify-center gap-2 bg-blue-900 text-white px-6 py-3 rounded-full mb-6 w-fit mx-auto font-semibold">
                  <Heart size={18} />
                  <span>Why Choose Us?</span>
                </div>
                <p className="text-blue-900 text-center max-w-4xl mx-auto mb-6 leading-relaxed font-medium">
                  We have established ourselves as a leading supplier of
                  high-quality Medical Equipment, Hospital Furniture &
                  Consumables. Clients prefer us for the following reasons:
                </p>
                <ul className="text-blue-900 space-y-4 max-w-xl mx-auto">
                  {[
                    "ISO Certified Quality Products",
                    "State Of The Art Infrastructure",
                    "Comfortable, Durable and Reliable Products",
                    "Exclusive Range of Product",
                    "Experienced and Qualified Technicians",
                    "On Time Delivery",
                    "Customer Satisfaction",
                    "Affordable Price with Low Maintenance",
                  ].map((item, idx) => (
                    <li
                      key={idx}
                      className="flex items-center gap-3 bg-white/60 p-3 rounded-xl hover:bg-white transition-colors duration-200"
                    >
                      <CheckCircle
                        className="text-blue-700 shrink-0"
                        size={22}
                      />
                      <span className="font-medium">{item}</span>
                    </li>
                  ))}
                </ul>
                <p className="text-blue-900 text-center mt-6 max-w-4xl mx-auto leading-relaxed font-medium">
                  We believe our clients&apos; success is our success. Contact
                  us to explore our products and build a long-term partnership.
                </p>
              </div>

              {/* SERVICE */}
            </div>
          </div>
        </div>
      </div>
      
      {/* Our Values Section */}
      <div className="py-24 bg-white relative overflow-hidden">
        {/* Background Decoration */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full opacity-[0.02] pointer-events-none">
          <div className="absolute top-10 left-10 w-64 h-64 border-4 border-blue-900 rounded-full blur-3xl"></div>
          <div className="absolute bottom-10 right-10 w-96 h-96 border-4 border-teal-500 rounded-full blur-3xl"></div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center mb-16">
            <h2 className="text-5xl font-black text-slate-900 mb-4 tracking-tighter">
              Our Core <span className="text-blue-900">Values</span>
            </h2>
            <p className="text-slate-500 font-bold uppercase tracking-[0.3em] text-xs">
              The principles that guide our excellence
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* 1. Quality First - Professional Teal Style */}
            <div className="group relative bg-[#00B5AD] rounded-[2.5rem] p-10 h-[380px] flex flex-col justify-between overflow-hidden transition-all duration-500 hover:shadow-2xl hover:-translate-y-2">
              <div className="absolute -right-6 -top-6 opacity-10 group-hover:scale-110 transition-transform duration-700">
                <ShieldCheck
                  size={200}
                  className="text-white"
                  strokeWidth={1}
                />
              </div>
              <div className="relative z-10 w-16 h-16 bg-white/20 backdrop-blur-md rounded-2xl flex items-center justify-center border border-white/30 shadow-sm">
                <ShieldCheck className="text-white" size={32} />
              </div>
              <div className="relative z-10 space-y-4">
                <h3 className="text-3xl font-black text-white tracking-tight leading-none uppercase">
                  Quality First
                </h3>
                <p className="text-white/80 text-sm font-medium leading-relaxed">
                  We never compromise on the quality of our medical equipment
                  and ensure every product meets international standards.
                </p>
                <div className="w-12 h-1 bg-white/40 rounded-full"></div>
              </div>
            </div>

            {/* 2. Innovation - Deep Blue Modern Style */}
            <div className="group relative bg-[#1E3A8A] rounded-[2.5rem] p-10 h-[380px] flex flex-col justify-center overflow-hidden transition-all duration-500 hover:shadow-2xl hover:-translate-y-2 text-center border-b-8 border-blue-400">
              <div className="absolute inset-0 opacity-5">
                <div
                  className="absolute top-0 left-0 w-full h-full"
                  style={{
                    backgroundImage: `radial-gradient(circle at 2px 2px, white 1px, transparent 0)`,
                    backgroundSize: "24px 24px",
                  }}
                ></div>
              </div>
              <div className="relative z-10 flex flex-col items-center space-y-6">
                <div className="w-20 h-20 bg-blue-500 rounded-full flex items-center justify-center shadow-inner group-hover:rotate-12 transition-transform duration-500">
                  <Sparkles className="text-white" size={40} />
                </div>
                <div className="space-y-3">
                  <h3 className="text-3xl font-black text-white tracking-tight uppercase">
                    Innovation
                  </h3>
                  <p className="text-blue-100/80 text-sm font-medium leading-relaxed">
                    Constantly evolving with the latest medical technology to
                    provide cutting-edge solutions to healthcare providers.
                  </p>
                </div>
              </div>
            </div>

            {/* 3. Customer Care - Clean Pop-out Style */}
            <div className="group relative bg-slate-50 border-2 border-slate-100 rounded-[2.5rem] p-10 h-[380px] flex flex-col transition-all duration-500 hover:shadow-2xl hover:-translate-y-2 overflow-hidden">
              <div className="absolute bottom-0 right-0 p-8 opacity-5">
                <Heart size={150} className="text-blue-900" />
              </div>
              <div className="mb-8">
                <div className="inline-flex items-center gap-2 bg-blue-100 text-blue-700 px-4 py-2 rounded-xl font-black text-xs uppercase tracking-widest">
                  <Heart size={14} fill="currentColor" /> Priority
                </div>
              </div>
              <div className="mt-auto space-y-4">
                <h3 className="text-3xl font-black text-slate-900 tracking-tight leading-none uppercase">
                  Customer <span className="text-blue-600">Care</span>
                </h3>
                <p className="text-slate-500 text-sm font-bold leading-relaxed italic">
                  "Building lasting relationships through exceptional service,
                  timely delivery, and comprehensive support."
                </p>
                <div className="flex gap-1">
                  {[1, 2, 3, 4, 5].map((i) => (
                    <div
                      key={i}
                      className="w-2 h-2 rounded-full bg-blue-600"
                    ></div>
                  ))}
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
