/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import {
  Building2,
  Users,
  Award,
  Globe,
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
    <section className="relative w-full py-10 md:py-20 bg-white overflow-hidden">
      {/* --- BACKGROUND DECOR --- */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <div
          className="absolute top-0 left-0 w-full h-full opacity-[0.03]"
          style={{
            backgroundImage: `radial-gradient(circle at 2px 2px, #1e3a8a 1px, transparent 0)`,
            backgroundSize: "32px 32px",
          }}
        />
        <div className="absolute top-1/4 -left-20 w-[300px] md:w-[500px] h-[300px] md:h-[500px] bg-blue-100 rounded-full blur-[80px] md:blur-[120px] opacity-40" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* --- TOP: COMPANY INTRODUCTION (Unchanged Text) --- */}
        <div className="text-center max-w-4xl mx-auto mb-12 md:mb-20 space-y-6 md:space-y-8">
          <div className="inline-flex items-center justify-center w-full pb-4 md:pb-10">
            <Image
              src="/logo.png"
              alt="Silicon Meditech Logo"
              width={440}
              height={106}
              className="w-[220px] sm:w-[300px] md:w-[440px] h-auto object-contain"
              priority
            />
          </div>

          <h2 className="text-3xl md:text-6xl font-black text-slate-900 leading-[1.1] tracking-tighter">
            Transforming Healthcare with <br className="hidden sm:block" />
            <span className="text-blue-900">Innovation & Excellence</span>
          </h2>

          <p className="text-sm md:text-2xl font-medium text-slate-600 leading-relaxed">
            <span className="text-slate-900 font-black">
              Silicon Meditech Pvt. Ltd.
            </span>{" "}
            is one of the Exalted manufacturers and importers of new and
            refurbished products in the Country. The company were originally
            founded in 2013 in Surat. Since the Inception, we have Strived Hard
            and successfully nenowned our services in the Market as a Prominent Industry.
          </p>
        </div>

        {/* --- MIDDLE: ACHIEVEMENT BOXES (2 Columns on Mobile) --- */}
        <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-3 md:gap-8 mb-16">
          {achievements.map((item) => {
            const Icon = item.icon;
            const isDark = item.theme !== "bg-[#DBE3ED]";

            return (
              <div
                key={item.id}
                className={`relative ${item.theme} rounded-2xl md:rounded-[3rem] p-5 md:p-10 h-[170px] md:h-[280px] flex flex-col justify-between 
                           transition-all duration-500 hover:shadow-2xl group overflow-hidden shadow-lg shadow-black/5`}
              >
                {/* Background Decor Icon */}
                <div className="absolute -right-2 -top-2 opacity-10 group-hover:scale-110 transition-transform duration-700">
                  <Icon
                    size={90}
                    className={`${isDark ? "text-white" : "text-blue-900"} md:w-[160px] md:h-[160px]`}
                    strokeWidth={1}
                  />
                </div>

                {/* Top Icon Badge */}
                <div className="p-2 md:p-4 w-fit rounded-xl bg-white/20 backdrop-blur-md border border-white/30">
                  <Icon
                    className={isDark ? "text-white" : "text-blue-900"}
                    size={20}
                  />
                </div>

                <div className="relative z-10">
                  <div
                    className={`text-3xl md:text-6xl font-black tracking-tighter mb-0.5 ${isDark ? "text-white" : "text-slate-900"}`}
                  >
                    {item.value}
                  </div>
                  <div
                    className={`text-[8px] md:text-[11px] font-black uppercase tracking-wider md:tracking-[0.25em] opacity-80 ${isDark ? "text-white" : "text-blue-900"}`}
                  >
                    {item.label}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* --- BOTTOM: PARTNER LOGOS --- */}
        <div className="pt-10 md:pt-16 border-t border-slate-100 text-center">
          <h4 className="text-[9px] md:text-[10px] font-black uppercase tracking-[0.3em] md:tracking-[0.5em] text-slate-400">
            Trusted by the Best in Healthcare
          </h4>
        </div>
      </div>
    </section>
  );
}