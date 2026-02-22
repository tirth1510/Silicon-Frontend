"use client";

import React, { useEffect } from "react";
import Image from "next/image";
import { motion, type Variants } from "framer-motion";
import Autoplay from "embla-carousel-autoplay";
import {
  Award,
  ShieldCheck,
  Globe,
  Zap,
  Truck,
  ChevronDown,
  TrendingUp,
  Shield,
  Loader2,
} from "lucide-react";

import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";
import { Button } from "@/components/ui/button";

import ProductCategorySection from "@/pages/leading/sections/category";
import AccessoriesPage from "@/pages/leading/sections/accessories";
import PremiumProductsPage from "@/pages/leading/sections/products2";

// Local imports
import Iso from "@/public/iso.png";
import Global from "@/public/gobalmap.png";
import Company from "@/public/company.png";
import Cdsco from "@/public/cdsco.png";
import Panters from "@/public/panters.png";
import Care from "@/public/care.png";
import { useRouter } from "next/navigation";
import { Providers } from "@/providers/providers";
import { useCategories } from "@/hooks/useCategories";
import { useAppReady } from "@/contexts/app-ready-context";
import { useQuery } from "@tanstack/react-query";
import {
  getAllModelsWithProductInfo,
  getValuableProductsService,
} from "@/services/model.api";
import axios from "axios";

function LandingPageContent() {
  const router = useRouter();
  const autoplay = React.useRef(
    Autoplay({ delay: 5000, stopOnInteraction: true }),
  );
  const heroContainerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.15, delayChildren: 0.3 },
    },
  };

  const heroItemVariants: Variants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, ease: "easeOut" },
    },
  };

  const slides = [
    {
      id: 1,
      title: "Committed to Quality",
      subtitle: "In Healthcare Equipment & Services",
      description:
        "Delivering excellence through high-standard medical instruments and dedicated support services, ensuring every product meets global safety benchmarks.",
      image: "/slides/1.png",
      cta: "View Our Services",
    },
    {
      id: 2,
      title: "Built on Manufacturing",
      subtitle: "Excellence in Healthcare",
      description:
        "Delivering Cost-Effective Healthcare Solutions Supported by Goblal Services Capabilities.",
      image: "/slides/second.png",
      cta: "View Our Services",
    },
  ];

  const features = [
    {
      title: "Global Supply",
      desc: "Seamless supply across Indian states and 10+ countries with real-time tracking.",
      iconBg: "bg-sky-500",
      icon: Globe,
      imgSrc: Global,
    },
    {
      title: "Market Leader",
      desc: "15+ Years of excellence in pioneering medical technology.",
      icon: Zap,
      imgSrc: Panters,
      iconBg: "bg-cyan-600",
    },
    {
      title: "ISO 13485.2016",
      desc: "Certified Quality Management ensuring global safety standards.",
      imgSrc: Iso,
      icon: ShieldCheck,
      iconBg: "bg-blue-600",
    },
    {
      title: "CDSCO Approved",
      desc: "Compliant with India's top medical regulatory standards.",
      imgSrc: Cdsco,
      icon: TrendingUp,
      iconBg: "bg-green-600",
    },

    {
      title: "24/7 Availability",
      desc: "Around-the-clock customer service for urgent medical supply needs.",
      imgSrc: Care,
      icon: ShieldCheck,
      iconBg: "bg-green-600",
    },
  ];

  // --- DATA FETCHING FOR LOADER ---
  const { categories, loading: loadingCategories } = useCategories();

  const { data: valuableData, isLoading: loadingValuable } = useQuery({
    queryKey: ["valuable-products"],
    queryFn: () => getValuableProductsService(),
  });

  const { data: allModelsData, isLoading: loadingModels } = useQuery({
    queryKey: ["all-models-info"],
    queryFn: () => getAllModelsWithProductInfo(),
  });

  const { data: accessoriesData, isLoading: loadingAccessories } = useQuery({
    queryKey: ["accessories-all"],
    queryFn: async () => {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/accessorize/all`,
      );
      return response.data;
    },
  });

  const { setReady } = useAppReady();
  const contentReady = !(
    loadingCategories ||
    loadingValuable ||
    loadingModels ||
    loadingAccessories
  );

  useEffect(() => {
    if (contentReady) setReady(true);
  }, [contentReady, setReady]);

  if (
    loadingCategories ||
    loadingValuable ||
    loadingModels ||
    loadingAccessories
  ) {
    return (
      <div className="flex min-h-screen w-full items-center justify-center bg-white">
        <Loader2 className="h-12 w-12 animate-spin text-blue-900" />
      </div>
    );
  }

  return (
    <div className="flex flex-col w-full bg-white overflow-x-hidden">
      <section className="relative w-full">
        <Carousel
          plugins={[autoplay.current]}
          className="w-full"
          opts={{ loop: true }}
        >
          <CarouselContent>
            {slides.map((slide) => (
              <CarouselItem key={slide.id}>
                {/* CHANGE: Mobile height h-[600px], Tablet/Desktop h-[800px] */}
                <div className="relative w-full h-[650px] md:h-[800px] flex flex-col items-center justify-center py-10 md:py-20 px-4 md:px-6 overflow-hidden">
                  {/* Background & Overlays */}
                  <div className="absolute inset-0 z-0">
                    <Image
                      src={slide.image}
                      alt={slide.title}
                      fill
                      className="object-cover scale-105"
                      priority
                    />
                    <div className="absolute inset-0 bg-blue-950/75" />
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_transparent_0%,_rgba(10,25,47,0.8)_100%)]" />
                  </div>

                  <motion.div
                    className="relative z-10 w-full flex flex-col items-center text-center"
                    variants={heroContainerVariants}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true }}
                  >
                    {/* Logo Section - Scaled for Mobile */}
                    <motion.div
                      variants={heroItemVariants}
                      className="mb-6 md:mb-16"
                    >
                      <div className="relative group">
                        <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 to-cyan-400 rounded-xl md:rounded-2xl blur opacity-25 group-hover:opacity-50 transition duration-1000" />
                        <div className="relative bg-white/95 backdrop-blur-sm p-3 md:p-4 px-6 md:px-8 rounded-xl md:rounded-2xl border border-white/20 shadow-2xl">
                          <Image
                            src={"/logo.png"}
                            alt={"Siliconmeditech"}
                            width={180} // Smaller for mobile
                            height={100}
                            className="md:w-[250px]" // Larger for desktop
                            priority
                          />
                        </div>
                      </div>
                    </motion.div>

                    {/* Title - Better Scaling */}
                    <motion.div variants={heroItemVariants}>
                      <h1 className="text-3xl sm:text-5xl lg:text-7xl font-extrabold tracking-tighter leading-tight text-white px-2">
                        {slide.title}
                        <span className="block mt-1 md:mt-2 font-bold italic text-2xl sm:text-5xl lg:text-6xl text-blue-400">
                          {slide.subtitle}
                        </span>
                      </h1>
                    </motion.div>

                    {/* Description - Compact for Mobile */}
                    <motion.p
                      variants={heroItemVariants}
                      className="mt-4 md:mt-8 text-sm md:text-xl max-w-2xl leading-relaxed font-medium px-4 text-blue-50/90"
                    >
                      {slide.description}
                    </motion.p>

                    {/* Buttons - Mobile Full Width or Stacked */}
                    <motion.div
                      variants={heroItemVariants}
                      className="flex flex-col sm:flex-row gap-3 md:gap-5 mt-8 md:mt-12 w-full max-w-[280px] sm:max-w-none sm:w-auto"
                    >
                      <Button
                        size="lg"
                        onClick={() => router.push("/about")}
                        className="bg-blue-500 hover:bg-blue-700 text-white px-8 md:px-12 h-12 md:h-16 text-sm md:text-lg font-bold rounded-full w-full sm:w-auto"
                      >
                        View Our Services 
                      </Button>
                      <Button
                        onClick={() => router.push("/contact")}
                        size="lg"
                        variant="outline"
                        className="h-12 md:h-16 px-8 md:px-12 text-sm md:text-lg font-bold rounded-full border-2 border-white text-white hover:bg-white hover:text-blue-900 bg-transparent w-full sm:w-auto"
                      >
                        Contact-Us
                      </Button>
                    </motion.div>
                  </motion.div>

                  {/* Scroll Indicator - Hidden on very small screens if necessary */}
                  <motion.div
                    animate={{ y: [0, 10, 0] }}
                    transition={{ duration: 2, repeat: Infinity }}
                    className="absolute bottom-4 md:bottom-8 z-20"
                  >
                    <ChevronDown className="w-8 h-8 md:w-10 md:h-10 text-white/50" />
                  </motion.div>
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
        </Carousel>
      </section>

      <section className="bg-slate-50 py-12 md:py-20">
        <div className="max-w-7xl mx-auto px-4">
          {/* GRID ADJUSTMENT: Mobile pe 2 columns (grid-cols-2) taki cards chote dikhe */}
          <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4 md:gap-8 items-stretch">
            {features.map((item, idx) => (
              <div
                key={idx}
                className="
            group bg-white rounded-xl md:rounded-2xl
            shadow-sm hover:shadow-xl
            transition-all duration-300
            overflow-hidden
            border border-slate-100
            flex flex-col h-full
            hover:-translate-y-1
            w-full 
          "
              >
                {/* IMAGE ADJUSTMENT: Mobile pe height kam kar di (h-32) */}
                <div className="relative h-32 sm:h-40 md:h-52 lg:h-48 w-full overflow-hidden shrink-0">
                  <Image
                    src={item.imgSrc}
                    alt={item.title}
                    fill
                    sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 20vw"
                    className="object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                </div>

                {/* CONTENT ADJUSTMENT: Mobile pe padding kam ki (p-3) aur font size chota */}
                <div className="p-3 md:p-6 flex flex-col flex-1">
                  <h3 className="text-sm md:text-xl font-bold text-slate-900 mb-1 md:mb-2 line-clamp-1 md:line-clamp-2">
                    {item.title}
                  </h3>

                  <p className="text-slate-500 text-[10px] md:text-sm leading-tight md:leading-relaxed line-clamp-2 md:line-clamp-4">
                    {item.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <div className="text-center w-full overflow-hidden">
        <ProductCategorySection categories={categories} />
        <div className="bg-white py-12 md:py-20">
          <PremiumProductsPage
            preFetchedValuable={valuableData}
            preFetchedAllModels={allModelsData}
          />
        </div>
        <AccessoriesPage preFetchedAccessories={accessoriesData} />
      </div>
    </div>
  );
}

export default function LandingPage() {
  return (
    <Providers>
      <LandingPageContent />
    </Providers>
  );
}
