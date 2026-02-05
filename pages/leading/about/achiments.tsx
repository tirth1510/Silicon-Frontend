/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import {
  Building2,
  Users,
  Award,
  Globe,
  Plus,
  ArrowRight,
  ShieldCheck,
  Microscope,
} from "lucide-react";
import Image from "next/image";

interface Achievement {
  id: number;
  icon: any;
  value: string;
  label: string;
  theme: string;
}

const achievements: Achievement[] = [
  {
    id: 1,
    icon: Building2,
    value: "500+",
    label: "Healthcare Facilities",
    theme: "bg-[#00B5AD]",
  },
  {
    id: 2,
    icon: Users,
    value: "10k+",
    label: "Happy Customers",
    theme: "bg-[#FFB800]",
  },
  {
    id: 3,
    icon: Award,
    value: "15+",
    label: "Years Experience",
    theme: "bg-[#3B82F6]",
  },
  {
    id: 4,
    icon: Globe,
    value: "100+",
    label: "Cities Covered",
    theme: "bg-[#DBE3ED]",
  },
];

export default function AboutAchievementsSection() {
  return (
    <section className="relative w-full py-10 bg-white overflow-hidden">
      {/* --- ENHANCED BACKGROUND --- */}
      <div className="absolute inset-0 z-0">
        <div
          className="absolute top-0 left-0 w-full h-full opacity-[0.03] pointer-events-none"
          style={{
            backgroundImage: `radial-gradient(circle at 2px 2px, #1e3a8a 1px, transparent 0)`,
            backgroundSize: "48px 48px",
          }}
        />
        <div className="absolute top-1/4 -left-20 w-[500px] h-[500px] bg-blue-100 rounded-full blur-[120px] opacity-50" />
        <div className="absolute bottom-0 -right-20 w-[500px] h-[500px] bg-teal-50 rounded-full blur-[120px] opacity-50" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* --- TOP: COMPANY INTRODUCTION --- */}
        <div className="text-center max-w-4xl mx-auto mb-20 space-y-8">
          <div className="inline-flex items-center gap-3 px-6 pb-10 shadow-sm">
            <Image
              src="/logo.png"
              alt="Silicon Meditech Logo"
              width={440}
              height={106}
              className="inline-block mr-1"
            />
          </div>

          <h2 className="text-5xl md:text-6xl font-black text-slate-900 leading-[1] tracking-tighter">
            Transforming Healthcare with <br />
            <span className="text-blue-900">Innovation & Excellence</span>
          </h2>

          <h1 className="text-5xl font-bold text-gray-900 mb-6 leading-tight">
            <span className="text-blue-900"> </span>
          </h1>

          <p className="text-xl md:text-2xl font-medium text-slate-600 leading-relaxed">
            <span className="text-slate-900 font-black">
              Silicon Meditech Pvt. Ltd.
            </span>{" "}
            is one of the Exalted manufacturers and importers of new and
            refurbished products in the Country. The company were originally
            founded in 2013 in Surat. Since the Inception, we have Strived Hard
            and successfully nenowned ourservices in the Market as a Prominent Industry .
          </p>
        </div>

        {/* --- MIDDLE: ACHIEVEMENT BOXES --- */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 mb-24">
          {achievements.map((item) => {
            const Icon = item.icon;
            const isDark = item.theme !== "bg-[#DBE3ED]";

            return (
              <div
                key={item.id}
                className={`relative ${item.theme} rounded-[3rem] p-10 h-[280px] flex flex-col justify-between 
                           transition-all duration-500 hover:shadow-2xl hover:-translate-y-3 group overflow-hidden shadow-xl shadow-black/5`}
              >
                {/* Background Decor */}
                <div className="absolute -right-6 -top-6 opacity-10 group-hover:scale-125 transition-transform duration-700">
                  <Icon
                    size={160}
                    className={isDark ? "text-white" : "text-blue-900"}
                    strokeWidth={1}
                  />
                </div>

                <div className="p-4 w-fit rounded-2xl bg-white/20 backdrop-blur-md border border-white/30 shadow-sm">
                  <Icon
                    className={isDark ? "text-white" : "text-blue-900"}
                    size={32}
                  />
                </div>

                <div className="relative z-10">
                  <div
                    className={`text-6xl font-black tracking-tighter mb-2 ${isDark ? "text-white" : "text-slate-900"}`}
                  >
                    {item.value}
                  </div>
                  <div
                    className={`text-[11px] font-black uppercase tracking-[0.25em] opacity-80 ${isDark ? "text-white" : "text-blue-900"}`}
                  >
                    {item.label}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* --- BOTTOM: PARTNER LOGOS --- */}
        <div className="pt-16 border-t border-slate-100 text-center">
          <h4 className="text-[10px] font-black uppercase tracking-[0.5em] text-slate-400 mb-12">
            Trusted by the Best in Healthcare
          </h4>
        </div>
      </div>
    </section>
  );
}
