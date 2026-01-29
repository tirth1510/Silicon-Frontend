/* eslint-disable react-hooks/immutability */
"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import Firstsctionns from "@/pages/leading/sections/firstsctions";

export default function LandingPage() {
  const [showWelcome, setShowWelcome] = useState(true);
  const [hasMounted, setHasMounted] = useState(false);

  useEffect(() => {
    setHasMounted(true);
    const hasSeen = localStorage.getItem("hasSeenWelcome");
    if (hasSeen) {
      setShowWelcome(false);
    }
  }, []);

  useEffect(() => {
    if (showWelcome) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }
  }, [showWelcome]);

  useEffect(() => {
    if (!showWelcome) return;

    const handleScroll = (e: WheelEvent) => {
      if (e.deltaY > 0) {
        handleEnterSite();
      }
    };

    window.addEventListener("wheel", handleScroll);
    return () => window.removeEventListener("wheel", handleScroll);
  }, [showWelcome]);

  const handleEnterSite = () => {
    localStorage.setItem("hasSeenWelcome", "true");
    setShowWelcome(false);
  };

  // Prevent hydration flicker
  if (!hasMounted) return null;

  return (
    <div className="relative w-full min-h-screen bg-white">
      {/* 1. WELCOME SCREEN */}
      <motion.div
        initial={false}
        animate={{ y: showWelcome ? "0%" : "-100%" }}
        transition={{ duration: 1, ease: [0.76, 0, 0.24, 1] }}
        className="fixed inset-0 z-[100] flex items-center justify-center bg-blue-900"
      >
        <div className="max-w-md w-full text-center px-6">
          <motion.div
            initial="hidden"
            animate={showWelcome ? "visible" : "hidden"}
            variants={{
              hidden: { opacity: 0 },
              visible: {
                opacity: 1,
                transition: { staggerChildren: 0.1, delayChildren: 0.2 },
              },
            }}
          >
            <motion.div
              variants={{
                hidden: { opacity: 0, y: 20 },
                visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
              }}
            >
              <Image
                src="/logo.png"
                alt="Logo"
                width={200}
                height={80}
                className="mx-auto mb-8 brightness-0 invert"
              />
            </motion.div>
            <motion.h2
              variants={{
                hidden: { opacity: 0, y: 20 },
                visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
              }}
              className="text-3xl md:text-4xl font-bold text-white mb-4 leading-tight"
            >
              Welcome to <br /> Silicon Meditech
            </motion.h2>
            <motion.p
              variants={{
                hidden: { opacity: 0, y: 20 },
                visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
              }}
              className="text-blue-100 mb-10 text-lg"
            >
              Innovation in Healthcare supply chains.
            </motion.p>
            <motion.div
              variants={{
                hidden: { opacity: 0, y: 20 },
                visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
              }}
            >
              <Button
                onClick={handleEnterSite}
                className="bg-white text-blue-900 hover:bg-blue-50 px-12 h-14 rounded-full font-bold text-lg shadow-xl"
              >
                Explore Now
              </Button>
            </motion.div>
          </motion.div>
        </div>
      </motion.div>

      {/* 2. HOME SCREEN */}
      <motion.div
        initial={false}
        animate={{ y: showWelcome ? "100vh" : "0%" }}
        transition={{ duration: 1, ease: [0.76, 0, 0.24, 1] }}
        onAnimationComplete={() => {
          if (!showWelcome) {
            // Trigger resize to ensure ScrollTrigger recalculates positions
            window.dispatchEvent(new Event("resize"));
          }
        }}
        className="relative w-full"
      >
        <Firstsctionns />
      </motion.div>
    </div>
  );
}