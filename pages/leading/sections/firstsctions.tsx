/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { ArrowRight, Award, CheckCircle, Zap, Shield, TrendingUp, Star, Users } from "lucide-react";
import Autoplay from "embla-carousel-autoplay";
import * as React from "react";
import ProductsPage from "./products2";
import Accessories from "./accessories";
import LimitedTimeDeal from "./limitedDeal"
import Category from "./category";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import Image from "next/image";
import Sell from "./sell"
type HeroSliderProps = {
  setCurrentSection?: (
    section: "home" | "portfolio" | "shop" | "about" | "contact"
  ) => void;
};

const slides = [
  {
    badge: "✨ Trusted by 500+ Healthcare Facilities",
    title: "Advanced Medical Technology",
    subtitle: "for Better Healthcare",
    description:
      "Empowering healthcare professionals with cutting-edge equipment and innovative solutions.",
    image: "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=1200&h=800&fit=crop&q=80",
  },
  {
    badge: "🔥 Top Selling Products",
    title: "Reliable Equipment",
    subtitle: "for Modern Hospitals",
    description: "Precision instruments designed for accuracy, durability and exceptional performance.",
    image: "https://images.unsplash.com/photo-1631815588090-d4bfec5b1ccb?w=1200&h=800&fit=crop&q=80",
  },
  {
    badge: "💎 Premium Quality",
    title: "Innovation That",
    subtitle: "Saves Lives",
    description: "Smart medical devices built for real-world healthcare needs and patient care excellence.",
    image: "https://images.unsplash.com/photo-1584982751601-97dcc096659c?w=1200&h=800&fit=crop&q=80",
  },
];

const stats = [
  { icon: Users, value: "500+", label: "Healthcare Facilities" },
  { icon: Award, value: "98%", label: "Customer Satisfaction" },
  { icon: TrendingUp, value: "50K+", label: "Products Delivered" },
  { icon: Shield, value: "ISO", label: "Certified Quality" },
];

const features = [
  { icon: CheckCircle, text: "FDA Approved Equipment" },
  { icon: Zap, text: "24/7 Technical Support" },
  { icon: Shield, text: "Warranty Protection" },
];

export default function HeroSlider({ setCurrentSection }: HeroSliderProps) {
  const autoplay = React.useRef(
    Autoplay({ delay: 5000, stopOnInteraction: false })
  );

  const [currentSlide, setCurrentSlide] = React.useState(0);
  const [api, setApi] = React.useState<any>();

  React.useEffect(() => {
    if (!api) {
      return;
    }

    setCurrentSlide(api.selectedScrollSnap());

    api.on("select", () => {
      setCurrentSlide(api.selectedScrollSnap());
    });
  }, [api]);

  return (
    <div className="bg-white">
      <section className="relative bg-white">
        <Carousel
          plugins={[autoplay.current]}
          className="w-full"
          onMouseEnter={autoplay.current.stop}
          onMouseLeave={autoplay.current.reset}
          setApi={setApi}
        >
          <CarouselContent>
            {slides.map((slide, index) => (
              <CarouselItem key={index}>
                {/* FULL SECTION SLIDE */}
                <section className="relative bg-white sm:py-16 py-10 ">
                  <div className="max-w-7xl mx-auto px-6">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center min-h-[600px]">
                      {/* LEFT CONTENT */}
                      <div className="space-y-6">
                        {/* Badge */}
                        <span className="inline-flex items-center gap-2 bg-blue-50 px-4 py-2 rounded-full text-blue-900 text-sm font-medium border border-blue-200">
                          <Star className="w-4 h-4 fill-blue-900 text-blue-900" />
                          {slide.badge}
                        </span>

                        {/* Title */}
                        <div>
                          <h1 className="text-4xl lg:text-5xl font-bold text-gray-900 leading-tight">
                            {slide.title}
                          </h1>
                          <h1 className="text-4xl lg:text-5xl font-bold text-blue-900 leading-tight">
                            {slide.subtitle}
                          </h1>
                        </div>

                        {/* Description */}
                        <p className="text-lg text-gray-600 leading-relaxed">
                          {slide.description}
                        </p>

                        {/* Features List */}
                        <div className="flex flex-wrap gap-3">
                          {features.map((feature, idx) => (
                            <div
                              key={idx}
                              className="flex items-center gap-2 bg-gray-50 px-4 py-2 rounded-lg border border-gray-200"
                            >
                              <feature.icon className="w-4 h-4 text-blue-900" />
                              <span className="text-sm font-medium text-gray-700">
                                {feature.text}
                              </span>
                            </div>
                          ))}
                        </div>

                        {/* Buttons */}
                        <div className="flex flex-col sm:flex-row gap-4 pt-4">
                          <button
                            onClick={() => setCurrentSection?.("shop")}
                            className="group bg-blue-900 text-white px-8 py-3 rounded-lg flex items-center justify-center gap-2 hover:bg-blue-800 transition-all duration-300 font-semibold"
                          >
                            Browse Products
                            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                          </button>

                          <button
                            onClick={() => setCurrentSection?.("portfolio")}
                            className="group bg-white text-blue-900 px-8 py-3 rounded-lg hover:bg-gray-50 transition-all duration-300 font-semibold border-2 border-blue-900"
                          >
                            View Portfolio
                          </button>
                        </div>
                      </div>

                      {/* RIGHT IMAGE */}
                      <div className="relative">
                        {/* Main Image Container */}
                        <div className="relative w-full h-[450px] rounded-2xl overflow-hidden shadow-xl border border-gray-200">
                          <Image
                            src={slide.image}
                            alt={slide.title}
                            fill
                            className="object-cover"
                            priority={index === 0}
                          />

                          {/* Floating Badge */}
                          <div className="absolute top-6 right-6 bg-white px-4 py-3 rounded-lg shadow-lg flex items-center gap-2 border border-gray-200">
                            <Award className="w-5 h-5 text-blue-900" />
                            <div>
                              <p className="text-xs text-gray-600">Quality</p>
                              <p className="text-sm font-bold text-blue-900">Certified</p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </section>
              </CarouselItem>
            ))}
          </CarouselContent>

          {/* CUSTOM ARROWS */}
          <CarouselPrevious className="left-8 bg-white hover:bg-gray-100 shadow-lg border border-gray-200 w-12 h-12" />
          <CarouselNext className="right-8 bg-white hover:bg-gray-100 shadow-lg border border-gray-200 w-12 h-12" />
        </Carousel>

        {/* PROGRESS INDICATOR */}
        <div className="flex justify-center gap-3 mt-8 pb-8">
          {slides.map((_, index) => (
            <button
              key={index}
              onClick={() => api?.scrollTo(index)}
              className={`transition-all duration-300 rounded-full ${currentSlide === index
                ? "w-12 h-3 bg-blue-900"
                : "w-3 h-3 bg-gray-300 hover:bg-gray-400"
                }`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      </section>

      {/* STATS SECTION */}
      <section className="py-16 bg-white border-y border-gray-200">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div
                key={index}
                className="text-center"
              >
                <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-900 rounded-xl mb-4 shadow-md">
                  <stat.icon className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-3xl font-bold text-blue-900 mb-1">
                  {stat.value}
                </h3>
                <p className="text-sm text-gray-600 font-medium">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
      
      <section>
        <LimitedTimeDeal />
      </section>

      <section className="bg-white">
        <Category />
      </section>

      <section>
        <Sell />
      </section>

      <section className="bg-white">
        <ProductsPage />
      </section>

      <section className="bg-white">
        <Accessories />
      </section>
    </div>
  );
}
