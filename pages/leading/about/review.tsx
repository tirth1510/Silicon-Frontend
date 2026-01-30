/* eslint-disable react/no-unescaped-entities */
"use client";

import { Star, Quote, CheckCircle2, Plus, User, Building2 } from "lucide-react";
import Image from "next/image";

interface Review {
  id: number;
  name: string;
  position: string;
  hospital: string;
  text: string;
  rating: number;
  theme: string; // Dynamic theme to match your brand colors
}

const reviews: Review[] = [
  {
    id: 1,
    name: "Dr. Arpan Shah",
    position: "Chief Surgeon",
    hospital: "Metro Heart Institute",
    text: "The precision and durability of the ICU furniture from Silicon Meditech are outstanding. It has significantly improved our workflow efficiency.",
    rating: 5,
    theme: "bg-[#00B5AD]", // Teal
  },
  {
    id: 2,
    name: "Dr. Sonalika Rao",
    position: "Managing Director",
    hospital: "City Care Hospital",
    text: "Finding affordable yet high-quality medical consumables in India was a challenge until we partnered with Silicon Meditech. Highly recommended.",
    rating: 5,
    theme: "bg-blue-900", // Blue
  },
  {
    id: 3,
    name: "Mr. Rajesh Khanna",
    position: "Purchase Manager",
    hospital: "LifeLine Multi-Specialty",
    text: "Their biomedical service team is exceptional. Maintenance and calibration are always on time, ensuring our equipment never fails during emergencies.",
    rating: 5,
    theme: "bg-[#FFB800]", // Gold
  },
];

export default function ReviewsSection() {
  return (
    <section className="relative py-24 bg-white overflow-hidden">
      {/* Background Decor */}
      <div className="absolute top-1/2 left-0 -translate-y-1/2 opacity-[0.03] pointer-events-none">
        <Plus className="w-[400px] h-[400px] text-blue-900" strokeWidth={5} />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* HEADER */}
        <div className="flex flex-col md:flex-row items-end justify-between gap-6 mb-16">
          <div className="space-y-4">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-50 rounded-xl border border-blue-100">
              <Star className="w-4 h-4 text-blue-600 fill-blue-600" />
              <span className="text-xs font-black uppercase tracking-widest text-blue-900">Patient Safety First</span>
            </div>
            <h2 className="text-5xl md:text-6xl font-black text-slate-900 tracking-tighter leading-none">
              Trusted by the <br />
              <span className="text-blue-900">Medical Fraternity.</span>
            </h2>
          </div>
          <p className="max-w-xs text-slate-500 font-bold text-sm leading-relaxed border-l-4 border-slate-100 pl-6 mb-2">
            Over 500+ Hospitals and 10,000+ Professionals rely on our technology every day.
          </p>
        </div>

        {/* REVIEWS GRID */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {reviews.map((review) => (
            <div
              key={review.id}
              className="group relative bg-slate-50 rounded-[3rem] p-10 flex flex-col justify-between transition-all duration-500 hover:shadow-2xl hover:-translate-y-2 border border-slate-100 overflow-hidden"
            >
              {/* Pop-out Decorative Background Icon */}
              <div className="absolute -right-4 -top-4 opacity-[0.03] group-hover:scale-125 transition-transform duration-700">
                <Building2 size={180} />
              </div>

              <div className="relative z-10">
                {/* Rating Stars */}
                <div className="flex gap-1 mb-8">
                  {[...Array(review.rating)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 text-[#FFB800] fill-[#FFB800]" />
                  ))}
                </div>

                {/* Quote Text */}
                <div className="relative">
                  <Quote className={`absolute -top-4 -left-6 w-12 h-12 ${review.theme.replace('bg-', 'text-')} opacity-10`} />
                  <p className="text-slate-700 font-bold text-lg leading-snug mb-10 italic">
                    "{review.text}"
                  </p>
                </div>
              </div>

              {/* User Profile Info */}
              <div className="relative z-10 pt-8 border-t border-slate-200 flex items-center gap-4">
                <div className={`w-14 h-14 rounded-2xl ${review.theme} flex items-center justify-center shrink-0 shadow-lg`}>
                  <User className="text-white w-7 h-7" />
                </div>
                <div>
                  <h4 className="text-slate-900 font-black tracking-tight leading-none mb-1">
                    {review.name}
                  </h4>
                  <p className="text-[10px] font-black uppercase tracking-widest text-blue-600 mb-0.5">
                    {review.position}
                  </p>
                  <div className="flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3 text-teal-600" />
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">
                      {review.hospital}
                    </span >
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* BOTTOM CTA */}
        <div className="mt-20 flex flex-col items-center gap-6">
          <div className="flex -space-x-4">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="w-12 h-12 rounded-full border-4 border-white bg-slate-200 flex items-center justify-center overflow-hidden">
                <User className="text-slate-400 w-6 h-6" />
              </div>
            ))}
            <div className="w-12 h-12 rounded-full border-4 border-white bg-blue-600 flex items-center justify-center text-white text-xs font-black">
              +10k
            </div>
          </div>
          <p className="text-slate-400 font-black uppercase text-[10px] tracking-[0.3em]">
            Join the community of certified healthcare leaders
          </p>
        </div>

      </div>
    </section>
  );
}