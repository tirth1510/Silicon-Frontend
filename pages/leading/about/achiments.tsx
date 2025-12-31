"use client";

import { Building2, Users, Award, Globe } from "lucide-react";

const achievements = [
  { id: 1, icon: Building2, value: "500+", label: "Healthcare Facilities Served" },
  { id: 2, icon: Users, value: "10,000+", label: "Satisfied Customers" },
  { id: 3, icon: Award, value: "15+ Years", label: "Industry Experience" },
  { id: 4, icon: Globe, value: "25+ Cities", label: "Pan India Presence" },
];

export default function AboutAchievementsSection() {
  return (
    <section className="relative w-full py-24 overflow-hidden">
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          {/* LEFT – ABOUT */}
          <div>
            <div className="inline-block mb-6 px-8 py-2 rounded-full border border-blue-300 bg-white/50 backdrop-blur shadow-lg">
              <h2 className="text-blue-700 font-semibold tracking-wide">About Us</h2>
            </div>

            <h3 className="text-3xl md:text-4xl font-bold text-blue-900 mb-6 leading-tight">
              Trusted Medical Technology Partner
              <br className="hidden sm:block" />
              Across India
            </h3>

            <div className="space-y-5 text-blue-900 text-lg leading-relaxed">
              <p>
                <span className="font-semibold">
                  Silicon Meditech Private Limited Medicorp
                </span>{" "}
                is a reputed manufacturer and supplier of advanced medical
                equipment, hospital furniture, and healthcare consumables.
              </p>
              <p>
                Founded in 2013 in Surat, we have built a strong reputation for
                delivering reliable, affordable, and clinically effective
                solutions to hospitals and healthcare professionals.
              </p>
              <p>
                Our commitment to quality, innovation, and long-term
                partnerships has enabled us to establish a strong pan-India
                presence.
              </p>
            </div>
          </div>

          {/* RIGHT – ACHIEVEMENTS */}
          <div className="flex flex-col justify-center bg-gray-100 p-8 rounded-3xl space-y-6 shadow-lg">
            {achievements.map((item) => {
              const Icon = item.icon;
              return (
                <div
                  key={item.id}
                  className="flex items-center bg-white/50 rounded-2xl p-5
                             border border-blue-900 shadow-md hover:shadow-xl transition"
                >
                  {/* Icon on Left */}
                  <div className="flex-shrink-0 w-16 h-16 flex items-center justify-center rounded-full bg-blue-100 mr-5">
                    <Icon className="text-blue-900" size={32} />
                  </div>

                  {/* Text on Right */}
                  <div className="flex flex-col">
                    <span className="text-2xl font-bold text-blue-900">{item.value}</span>
                    <span className="text-blue-700 text-sm">{item.label}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
