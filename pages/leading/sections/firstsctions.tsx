"use client";

import React from "react";
import Image from "next/image";
import Autoplay from "embla-carousel-autoplay";
import { ArrowRight, Star, Award, ShieldCheck, Truck, Clock } from "lucide-react";

import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { Button } from "@/components/ui/button";

// Import existing sections
import ProductCategorySection from "@/pages/leading/sections/category";
import AccessoriesPage from "@/pages/leading/sections/accessories";
import PremiumProductsPage from "@/pages/leading/sections/products2";

export default function LandingPage() {
  const autoplay = React.useRef(
    Autoplay({ delay: 5000, stopOnInteraction: true })
  );

  const slides = [
    {
      id: 1,
      badge: "New Arrival",
      title: "Advanced Medical",
      subtitle: "Technology Solutions",
      description: "Equipping healthcare professionals with state-of-the-art medical instruments and diagnostic tools for better patient care.",
      image: "https://images.unsplash.com/photo-1516549655169-df83a0774514?q=80&w=2070&auto=format&fit=crop",
      cta: "Explore Products",
    },
    {
      id: 2,
      badge: "Best Seller",
      title: "Precision & Accuracy",
      subtitle: "In Every Diagnosis",
      description: "Our range of diagnostic equipment ensures high precision and reliability, trusted by top hospitals worldwide.",
      image: "https://images.unsplash.com/photo-1579684385127-1ef15d508118?q=80&w=2080&auto=format&fit=crop",
      cta: "View Catalog",
    },
    {
      id: 3,
      badge: "Trusted Quality",
      title: "Healthcare Excellence",
      subtitle: "Delivered Globally",
      description: "We are committed to providing superior quality medical supplies with global standards and certifications.",
      image: "https://images.unsplash.com/photo-1584036561566-b93a50208c3c?q=80&w=2070&auto=format&fit=crop",
      cta: "Contact Sales",
    },
  ];

  const features = [
    {
      icon: ShieldCheck,
      title: "Certified Quality",
      desc: "ISO 9001:2015 Certified Products",
    },
    {
      icon: Truck,
      title: "Global Shipping",
      desc: "Reliable delivery to 50+ countries",
    },
    {
      icon: Clock,
      title: "24/7 Support",
      desc: "Expert technical assistance anytime",
    },
    {
      icon: Award,
      title: "Industry Leader",
      desc: "15+ Years of Healthcare Excellence",
    },
  ];

  return (
    <div className="flex flex-col w-full">
      {/* HERO SECTION */}
      <section className="relative w-full bg-gray-50 pt-20 lg:pt-0">
        <Carousel
          plugins={[autoplay.current]}
          className="w-full"
          opts={{
            loop: true,
          }}
        >
          <CarouselContent>
            {slides.map((slide) => (
              <CarouselItem key={slide.id}>
                <div className="relative w-full min-h-[600px] lg:h-[35vh] flex items-center">
                  {/* Background Image with Overlay */}
                  <div className="absolute inset-0 z-0">
                    <Image
                      src={slide.image}
                      alt={slide.title}
                      fill
                      className="object-cover"
                      priority
                    />
                    <div className="absolute inset-0 bg-gradient-to-r from-white/95 via-white/80 to-transparent lg:via-white/60"></div>
                  </div>

                  {/* Content */}
                  <div className="relative z-10 max-w-7xl mx-auto px-6 w-full">
                    <div className="max-w-2xl space-y-6 animate-in fade-in slide-in-from-left-8 duration-700">
                      <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-100 text-blue-800 text-sm font-semibold border border-blue-200 w-fit">
                        <Star className="w-4 h-4 fill-blue-800" />
                        {slide.badge}
                      </div>
                      
                      <div className="space-y-2">
                        <h1 className="text-5xl lg:text-7xl font-bold text-gray-900 leading-tight tracking-tight">
                          {slide.title}
                        </h1>
                        <h2 className="text-5xl lg:text-7xl font-bold text-blue-900 leading-tight tracking-tight">
                          {slide.subtitle}
                        </h2>
                      </div>

                      <p className="text-lg text-gray-700 leading-relaxed max-w-lg">
                        {slide.description}
                      </p>

                      <div className="flex flex-wrap gap-4 pt-4">
                        <Button 
                          size="lg" 
                          className="bg-blue-900 hover:bg-blue-800 text-white px-8 h-14 text-lg rounded-full shadow-lg hover:shadow-xl transition-all hover:-translate-y-1"
                        >
                          {slide.cta}
                          <ArrowRight className="ml-2 w-5 h-5" />
                        </Button>
                        <Button 
                          size="lg" 
                          variant="outline"
                          className="border-2 border-blue-900 text-blue-900 hover:bg-blue-50 px-8 h-14 text-lg rounded-full"
                        >
                          Learn More
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
          
          <div className="hidden lg:block absolute bottom-8 right-12 z-20 flex gap-2">
            <CarouselPrevious className="static translate-y-0 bg-white/80 hover:bg-white border-none shadow-md h-12 w-12" />
            <CarouselNext className="static translate-y-0 bg-white/80 hover:bg-white border-none shadow-md h-12 w-12" />
          </div>
        </Carousel>
      </section>

      {/* FEATURES STRIP */}
      <section className="bg-blue-900 py-12 text-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, idx) => (
              <div key={idx} className="flex items-center gap-4 p-4 rounded-xl bg-blue-800/50 border border-blue-700/50 hover:bg-blue-800 transition-colors">
                <div className="p-3 bg-white/10 rounded-lg">
                  <feature.icon className="w-8 h-8 text-blue-200" />
                </div>
                <div>
                  <h3 className="font-bold text-lg">{feature.title}</h3>
                  <p className="text-blue-200 text-sm">{feature.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CATEGORIES */}
      <ProductCategorySection />

      
      {/* CURATED SELECTION 
      <CuratedShopPage />*/}

      {/* PREMIUM PRODUCTS */}
      <PremiumProductsPage />

      {/* ACCESSORIES */}
      <AccessoriesPage />

      {/* NEWSLETTER / CTA SECTION */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-6">
          <div className="bg-blue-900 rounded-3xl p-8 lg:p-16 relative overflow-hidden text-center lg:text-left">
            {/* Background Pattern */}
            <div className="absolute top-0 right-0 w-full h-full opacity-10 pointer-events-none">
              <div className="absolute right-0 top-0 w-96 h-96 bg-white rounded-full blur-3xl transform translate-x-1/2 -translate-y-1/2"></div>
              <div className="absolute left-0 bottom-0 w-64 h-64 bg-blue-400 rounded-full blur-3xl transform -translate-x-1/2 translate-y-1/2"></div>
            </div>

            <div className="relative z-10 flex flex-col lg:flex-row items-center justify-between gap-10">
              <div className="max-w-2xl space-y-4">
                <h2 className="text-3xl lg:text-4xl font-bold text-white">
                  Ready to Upgrade Your Medical Equipment?
                </h2>
                <p className="text-blue-100 text-lg">
                  Join thousands of healthcare providers who trust Silicon Meditech for their equipment needs. Get exclusive offers and updates.
                </p>
              </div>
              <div className="flex flex-col sm:flex-row gap-4 w-full lg:w-auto">
                <Button size="lg" className="bg-white text-blue-900 hover:bg-gray-100 h-14 px-8 text-lg font-semibold rounded-full">
                  Get Started
                </Button>
                <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/10 h-14 px-8 text-lg font-semibold rounded-full bg-transparent">
                  Contact Sales
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
