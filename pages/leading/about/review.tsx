/* eslint-disable react/no-unescaped-entities */
"use client";

import { Star, Quote, CheckCircle2, Plus, User, Building2 } from "lucide-react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";
import Autoplay from "embla-carousel-autoplay";
import React from "react";

interface Review {
  id: number;
  name: string;
  position: string;
  hospital: string;
  text: string;
  rating: number;
  theme: string;
}

const reviews: Review[] = [
  {
    id: 1,
    name: "Mr Kamlesh Vekariya",
    position: "CEO",
    hospital: "Korida Medical System",
    text: "Excellent service. Guidance is provided anytime it’s needed. Thank you for the consistent support.",
    rating: 5,
    theme: "bg-[#00B5AD]",
  },
  {
    id: 2,
    name: "Dr. Suchay Parikh",
    position: "Intensivist",
    hospital: "Shrizee Hospital",
    text: "Professional approach and continuous support. Guidance is clear and extremely helpful.",
    rating: 5,
    theme: "bg-blue-900",
  },
  {
    id: 3,
    name: "Mr. Bhumit Koisa",
    position: "Head Bio-Medical",
    hospital: "Parul Sevashram Hospital",
    text: "Skilled and dependable technical team. Issues are resolved without unnecessary delays.",
    rating: 4,
    theme: "bg-[#FFB800]",
  },
];

export default function ReviewsSection() {
  const plugin = React.useRef(
    Autoplay({ delay: 4000, stopOnInteraction: true })
  );

  return (
    <section className="relative py-12 md:py-24 bg-white overflow-hidden">
      {/* Background Decor */}
      <div className="absolute top-1/2 left-0 -translate-y-1/2 opacity-[0.03] pointer-events-none">
        <Plus className="w-[200px] h-[200px] md:w-[400px] md:h-[400px] text-blue-900" strokeWidth={5} />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* HEADER */}
        <div className="flex flex-col md:flex-row items-center md:items-end justify-between gap-6 mb-12 md:mb-16 text-center md:text-left">
          <div className="space-y-4">
            <h2 className="text-3xl md:text-6xl font-black text-slate-900 tracking-tighter leading-tight">
              Trusted by the <br />
              <span className="text-blue-900">Medical Fraternity.</span>
            </h2>
          </div>
          <p className="max-w-xs text-slate-500 font-bold text-xs md:text-sm leading-relaxed md:border-l-4 md:border-slate-100 md:pl-6">
            Over 500+ Hospitals and 10,000+ Professionals rely on our technology every day.
          </p>
        </div>

        {/* REVIEWS CAROUSEL (Mobile) & GRID (Desktop) */}
        <Carousel
          plugins={[plugin.current]}
          className="w-full"
          opts={{
            align: "start",
            loop: true,
          }}
        >
          <CarouselContent className="-ml-4">
            {reviews.map((review) => (
              <CarouselItem key={review.id} className="pl-4 basis-full md:basis-1/3">
                <div className="group relative bg-slate-50 rounded-[2.5rem] md:rounded-[3rem] p-8 md:p-10 h-full min-h-[400px] flex flex-col justify-between transition-all duration-500 hover:shadow-xl border border-slate-100 overflow-hidden">
                  
                  {/* Background Icon */}
                  <div className="absolute -right-4 -top-4 opacity-[0.03] group-hover:scale-125 transition-transform duration-700">
                    <Building2 size={150} />
                  </div>

                  <div className="relative z-10">
                    {/* Stars */}
                    <div className="flex gap-1 mb-6 md:mb-8">
                      {[...Array(review.rating)].map((_, i) => (
                        <Star key={i} className="w-3.5 h-3.5 md:w-4 md:h-4 text-[#FFB800] fill-[#FFB800]" />
                      ))}
                    </div>

                    {/* Text */}
                    <div className="relative">
                      <Quote className={`absolute -top-3 -left-4 w-8 h-8 md:w-12 md:h-12 ${review.theme.replace('bg-', 'text-')} opacity-10`} />
                      <p className="text-slate-700 font-bold text-base md:text-lg leading-snug mb-8 md:mb-10 italic">
                        "{review.text}"
                      </p>
                    </div>
                  </div>

                  {/* Profile */}
                  <div className="relative z-10 pt-6 md:pt-8 border-t border-slate-200 flex items-center gap-3 md:gap-4">
                    <div className={`w-12 h-12 md:w-14 md:h-14 rounded-xl md:rounded-2xl ${review.theme} flex items-center justify-center shrink-0 shadow-lg`}>
                      <User className="text-white w-6 h-6 md:w-7 md:h-7" />
                    </div>
                    <div className="min-w-0 text-left">
                      <h4 className="text-slate-900 font-black tracking-tight leading-none mb-1 text-sm md:text-base truncate">
                        {review.name}
                      </h4>
                      <p className="text-[9px] md:text-[10px] font-black uppercase tracking-widest text-blue-600 mb-1">
                        {review.position}
                      </p>
                      <div className="flex items-center gap-1">
                        <CheckCircle2 className="w-3 h-3 text-teal-600 shrink-0" />
                        <span className="text-[9px] md:text-[10px] font-bold text-slate-400 uppercase tracking-tighter truncate">
                          {review.hospital}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
        </Carousel>

        {/* BOTTOM CTA */}
        <div className="mt-16 md:mt-20 flex flex-col items-center gap-4 md:gap-6">
          <div className="flex -space-x-3 md:-space-x-4">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="w-10 h-10 md:w-12 md:h-12 rounded-full border-2 md:border-4 border-white bg-slate-200 flex items-center justify-center overflow-hidden">
                <User className="text-slate-400 w-5 h-5 md:w-6 md:h-6" />
              </div>
            ))}
            <div className="w-10 h-10 md:w-12 md:h-12 rounded-full border-2 md:border-4 border-white bg-blue-600 flex items-center justify-center text-white text-[10px] md:text-xs font-black">
              +10k
            </div>
          </div>
          <p className="text-slate-400 font-black uppercase text-[8px] md:text-[10px] tracking-[0.2em] md:tracking-[0.3em] text-center px-4">
            Join the community of certified healthcare leaders
          </p>
        </div>
      </div>
    </section>
  );
}