"use client";

import { useRouter } from "next/navigation";
import {
  Mail,
  Phone,
  MapPin,
  Facebook,
  Twitter,
  Instagram,
  Heart,
  Plus,
  ArrowRight,
  ShieldCheck,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link"; // Hamesha Link component use karein SEO ke liye

export default function Footer() {
  const currentYear = new Date().getFullYear();
  const router = useRouter();

  // Programmatic navigation handler
  const navigateTo = (path: string) => {
    router.push(path);
  };

  return (
    <footer className="bg-slate-50 border-t border-slate-200 text-slate-600">
      {/* Upper Footer: CTA / Newsletter */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center mb-16 bg-white p-8 md:p-12 rounded-[3rem] shadow-xl shadow-slate-200/60 border border-slate-100 overflow-hidden relative">
          <div className="absolute -top-6 -right-6 opacity-[0.03] pointer-events-none">
            <Plus className="w-40 h-40 text-blue-900" strokeWidth={5} />
          </div>

          <div className="space-y-4">
            <h2 className="text-3xl md:text-4xl font-black text-slate-900 leading-tight tracking-tighter">
              Ready to upgrade your <br />
              <span className="text-blue-600">Medical Infrastructure?</span>
            </h2>
            <p className="text-slate-500 font-medium">
              Join 500+ healthcare facilities across India using our solutions.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-4">
            {/* Button click par navigate karne ke liye router.push ka use */}
            <button
              onClick={() => navigateTo("/products")}
              className="flex items-center justify-center gap-2 px-8 py-4 bg-white border border-blue-700 text-blue-700  rounded-2xl font-black text-sm uppercase tracking-widest hover:bg-slate-900 transition-all shadow-lg active:scale-95"
            >
              Product&apos;s <ArrowRight className="w-4 h-4" />
            </button>
            <button
              onClick={() => navigateTo("/contact")}
              className="flex items-center justify-center gap-2 px-8 py-4 bg-blue-700 text-white rounded-2xl font-black text-sm uppercase tracking-widest hover:bg-slate-900 transition-all shadow-lg active:scale-95"
            >
              Contact Us <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Main Links Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-12 pb-12">
          {/* Company Info */}
          <div className="space-y-6">
            <Link href="/">
              <Image
                src="/logo.png"
                alt="Silicon Meditech Logo"
                width={180}
                height={50}
                className="object-contain cursor-pointer"
              />
            </Link>
            <p className="text-sm font-medium leading-relaxed text-slate-500">
              Exalted manufacturers and suppliers of high-quality Medical
              Equipment, Hospital Furniture & Consumables in India since 2013.
            </p>
            <div className="flex gap-3">
              {[
                {
                  icon: Facebook,
                  color: "hover:bg-blue-600",
                  url: "https://facebook.com",
                },
                {
                  icon: Twitter,
                  color: "hover:bg-sky-500",
                  url: "https://twitter.com",
                },
                {
                  icon: Instagram,
                  color: "hover:bg-pink-600",
                  url: "https://instagram.com",
                },
              ].map((social, i) => (
                <a
                  key={i}
                  href={social.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`w-10 h-10 rounded-xl bg-white border border-slate-200 flex items-center justify-center transition-all duration-300 group shadow-sm ${social.color}`}
                >
                  <social.icon className="w-4 h-4 text-slate-400 group-hover:text-white transition-colors" />
                </a>
              ))}
            </div>
          </div>

          {/* Navigation Links (Corrected from ref to href) */}
          <div>
            <h3 className="text-slate-900 font-black uppercase tracking-widest text-xs mb-6">
              Company
            </h3>
            <ul className="space-y-4">
              {[
                { name: "Home", path: "/" },
                { name: "About Us", path: "/about" },
                { name: "Products", path: "/products" },
                { name: "Contact Us", path: "/contact" },
              ].map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.path}
                    className="text-sm font-bold text-slate-500 hover:text-blue-600 transition-colors flex items-center gap-2 group"
                  >
                    <div className="w-1.5 h-1.5 rounded-full bg-slate-300 group-hover:bg-blue-600 transition-colors"></div>
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Expertise Links */}
          <div>
            <h3 className="text-slate-900 font-black uppercase tracking-widest text-xs mb-6">
              Expertise
            </h3>
            <ul className="space-y-4">
              {[
                "Hospital Furniture",
                "Medical Consumables",
                "Biomedical Services",
              ].map((item) => (
                <li key={item}>
                  <Link
                    href="/products"
                    className="text-sm font-bold text-slate-500 hover:text-blue-600 transition-colors"
                  >
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Details */}
          <div>
            <h3 className="text-slate-900 font-black uppercase tracking-widest text-xs mb-6">
              Contact
            </h3>
            <ul className="space-y-4">
              <li className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center shrink-0">
                  <Phone className="w-4 h-4 text-blue-600" />
                </div>
                <a
                  href="tel:+911234567890"
                  className="text-sm font-bold text-slate-700 hover:text-blue-600"
                >
                  +91 123 456 7890
                </a>
              </li>
              <li className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-lg bg-teal-50 flex items-center justify-center shrink-0">
                  <Mail className="w-4 h-4 text-teal-600" />
                </div>
                <a
                  href="mailto:info@siliconmeditech.com"
                  className="text-sm font-bold text-slate-700 hover:text-blue-600"
                >
                  info@siliconmeditech.com
                </a>
              </li>
              <li className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center shrink-0">
                  <MapPin className="w-4 h-4 text-slate-600" />
                </div>
                <p className="text-sm font-bold text-slate-700">
                  Surat, Gujarat, India
                </p>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="bg-white border-t border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">
              © {currentYear}{" "}
              <span className="text-slate-900">Silicon Meditech</span>. All
              rights reserved.
            </p>
            <div className="flex items-center gap-6">
              <Link
                href="/privacy"
                className="text-xs font-bold text-slate-400 hover:text-blue-600 transition-colors"
              >
                Privacy
              </Link>
              <Link
                href="/terms"
                className="text-xs font-bold text-slate-400 hover:text-blue-600 transition-colors"
              >
                Terms
              </Link>
              <div className="h-4 w-px bg-slate-200 hidden md:block"></div>
              <p className="text-xs font-bold text-slate-400 uppercase tracking-widest flex items-center gap-1">
                Built with{" "}
                <Heart className="w-3 h-3 text-red-500 fill-red-500" /> in India
              </p>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
