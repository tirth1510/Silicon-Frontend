/* eslint-disable @typescript-eslint/no-explicit-any */
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
import { useCategories } from "@/hooks/useCategories";
import { FaWhatsapp } from "react-icons/fa";

export default function Footer() {
  const currentYear = new Date().getFullYear();
  const router = useRouter();

  // Programmatic navigation handler
  const navigateTo = (path: string) => {
    router.push(path);
  };

  const { categories } = useCategories();

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
              <span className="text-blue-900">Medical Infrastructure?</span>
            </h2>
            <p className="text-slate-500 font-medium">
              Join 500+ healthcare facilities across India using our solutions.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-4">
            {/* Button click par navigate karne ke liye router.push ka use */}
            <button
              onClick={() => navigateTo("/products")}
              className="flex items-center justify-center gap-2 px-8 py-4 bg-white border border-blue-900 text-blue-900 hover:text-white  rounded-2xl font-black text-sm uppercase tracking-widest hover:bg-slate-900 transition-all shadow-lg active:scale-95"
            >
              Product&apos;s <ArrowRight className="w-4 h-4" />
            </button>
            <button
              onClick={() => navigateTo("/contact-us")}
              className="flex items-center justify-center gap-2 px-8 py-4 bg-blue-900 text-white rounded-2xl font-black text-sm uppercase tracking-widest hover:bg-slate-900 transition-all shadow-lg active:scale-95"
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
            <p className="text-sm font-medium leading-relaxed mt-3 ml-2 text-slate-500">
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
                  icon: Instagram,
                  color: "hover:bg-pink-600",
                  url: "https://www.instagram.com/silicon_meditech_pvt_ltd?igsh=cWMya3lxZWs1bGVq&utm_source=qr",
                },
                {
                  icon: FaWhatsapp,
                  color: "hover:bg-green-600",
                  url: "https://wa.me/919601551892",
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
                    className="text-sm font-bold text-slate-500 hover:text-blue-900 transition-colors flex items-center gap-2 group"
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
              Categories
            </h3>
            <ul className="space-y-4">
              {categories?.slice(0, 6).map((item: any) => (
                <li key={item._id}>
                  <Link
                    href={`/products?category=${item.categorySlug}`}
                    className="text-sm font-bold text-slate-500 hover:text-blue-600 transition-colors"
                  >
                    {item.categoryName}
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
                  +91 96015 51892 <br />
                  +91 94295 54465
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
                  siliconmeditech@gmail.com
                </a>
              </li>
              <li className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center shrink-0">
                  <MapPin className="w-4 h-4 text-slate-600" />
                </div>
                <a
                  href="https://www.google.com/maps/place/Silicon+Medi+Tech+Pvt+Ltd/@21.1645666,72.8196701,17z/data=!3m1!4b1!4m6!3m5!1s0x3be04dce7c1f68d3:0xc4a37b13297092d4!8m2!3d21.1645666!4d72.822245!16s%2Fg%2F11cmf9dbyr?entry=ttu&g_ep=EgoyMDI2MDIwMS4wIKXMDSoASAFQAw%3D%3D"
                  className="text-sm font-bold hover:text-blue-600 text-slate-700"
                >

                  09, Hariom Industrial Soc, Shantinath Mill Street, Navjivan Circle, Bhatar, Surat, Gujarat- 395017
                </a>
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
          </div>
        </div>
      </div>
    </footer>
  );
}
