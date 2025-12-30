"use client";

import { ArrowRight, Award } from "lucide-react";
import Autoplay from "embla-carousel-autoplay";
import * as React from "react";
import ProductsPage from "./products2";
import Accessories from "./accessories";
import Category from "./category";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import Image from "next/image";

type HeroSliderProps = {
  setCurrentSection?: (
    section: "home" | "portfolio" | "shop" | "about" | "contact"
  ) => void;
};

const slides = [
  {
    badge: "✨ Trusted by 500+ Healthcare Facilities",
    title: "Advanced Medical Technology for Better Healthcare",
    description:
      "Empowering healthcare professionals with cutting-edge equipment.",
    image: "/p/image.png",
  },
  {
    badge: "🔥 Top Selling Products",
    title: "Reliable Equipment for Modern Hospitals",
    description: "Precision instruments designed for accuracy and durability.",
    image: "/p/image2.png",
  },
  {
    badge: "💎 Premium Quality",
    title: "Innovation That Saves Lives",
    description: "Smart medical devices built for real-world healthcare needs.",
    image: "/p/image.png",
  },
];

export default function HeroSlider({ setCurrentSection }: HeroSliderProps) {
  const autoplay = React.useRef(
    Autoplay({ delay: 5000, stopOnInteraction: false })
  );

  return (
    <div>
      <section>
        <Carousel
          plugins={[autoplay.current]}
          className="w-full"
          onMouseEnter={autoplay.current.stop}
          onMouseLeave={autoplay.current.reset}
        >
          <CarouselContent>
            {slides.map((slide, index) => (
              <CarouselItem key={index}>
                {/* FULL SECTION SLIDE */}
                <section className="relative bg-white pt-24 pb-16 rounded-b-3xl shadow-sm">
                  <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                    {/* LEFT */}
                    <div className="space-y-6">
                      <span className="inline-block bg-blue-500/20 px-4 py-1 rounded-full text-blue-700 text-sm">
                        {slide.badge}
                      </span>

                      <h1 className="text-4xl lg:text-5xl font-bold text-gray-900">
                        {slide.title}
                      </h1>

                      <p className="text-lg text-gray-600">
                        {slide.description}
                      </p>

                      <div className="flex gap-4">
                        <button
                          onClick={() => setCurrentSection?.("shop")}
                          className="bg-blue-600 text-white px-6 py-3 rounded-lg flex items-center gap-2 hover:bg-blue-700"
                        >
                          Browse Products <ArrowRight size={18} />
                        </button>

                        <button
                          onClick={() => setCurrentSection?.("portfolio")}
                          className="border-2 border-blue-600 text-blue-600 px-6 py-3 rounded-lg hover:bg-blue-50"
                        >
                          View Portfolio
                        </button>
                      </div>
                    </div>

                    {/* RIGHT */}
                    <div className="relative w-full h-[320px] lg:h-[420px]">
                      <Image
                        src={slide.image}
                        alt={slide.title}
                        fill
                        className="object-contain"
                        priority={index === 0}
                      />
                    </div>
                  </div>
                </section>
              </CarouselItem>
            ))}
          </CarouselContent>

          {/* OPTIONAL ARROWS */}
          <CarouselPrevious className="left-4" />
          <CarouselNext className="right-4" />
        </Carousel>
      </section>

      <section>
        <Category />
      </section>
     
      <section>
        <ProductsPage />
      </section>
      <section>
        <Accessories />
      </section>
    </div>
  );
}
