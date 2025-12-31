"use client";

import Link from "next/link";
import {
  Smartphone,
  Mail,
  Phone,
  MapPin,
  Facebook,
  Twitter,
  Instagram,
  Heart,
} from "lucide-react";
import Image from "next/image";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-gray-300">
      {/* Main Footer Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Company Info */}
          <div>
            <Link href="/" className="flex items-center gap-2 group mb-4">
              <Image
                src="/logo.png"
                alt="Silicon Meditech Logo"
                width={200}
                height={60}
                priority
              />
            </Link>

            <p className="text-sm text-gray-400 mb-5 leading-relaxed">
              Your trusted destination for the latest smartphones, accessories,
              and tech gadgets.
            </p>

            {/* Social Media */}
            <div className="flex gap-3">
              <Link
                href="https://facebook.com"
                target="_blank"
                className="w-9 h-9 rounded-lg bg-gray-800 hover:bg-blue-600 flex items-center justify-center transition-all duration-300 group"
                aria-label="Facebook"
              >
                <Facebook className="w-4 h-4 text-gray-400 group-hover:text-white" />
              </Link>
              <Link
                href="https://twitter.com"
                target="_blank"
                className="w-9 h-9 rounded-lg bg-gray-800 hover:bg-sky-500 flex items-center justify-center transition-all duration-300 group"
                aria-label="Twitter"
              >
                <Twitter className="w-4 h-4 text-gray-400 group-hover:text-white" />
              </Link>
              <Link
                href="https://instagram.com"
                target="_blank"
                className="w-9 h-9 rounded-lg bg-gray-800 hover:bg-gradient-to-br hover:from-purple-600 hover:to-pink-600 flex items-center justify-center transition-all duration-300 group"
                aria-label="Instagram"
              >
                <Instagram className="w-4 h-4 text-gray-400 group-hover:text-white" />
              </Link>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-white font-bold mb-4 text-base">Quick Links</h3>
            <ul className="space-y-2.5">
              <li>
                <Link
                  href="/"
                  className="text-sm text-gray-400 hover:text-blue-500 transition-colors duration-200"
                >
                  Home
                </Link>
              </li>
              <li>
                <Link
                  href="/about"
                  className="text-sm text-gray-400 hover:text-blue-500 transition-colors duration-200"
                >
                  About Us
                </Link>
              </li>
              <li>
                <Link
                  href="/products"
                  className="text-sm text-gray-400 hover:text-blue-500 transition-colors duration-200"
                >
                  Products
                </Link>
              </li>
              <li>
                <Link
                  href="/contact"
                  className="text-sm text-gray-400 hover:text-blue-500 transition-colors duration-200"
                >
                  Contact Us
                </Link>
              </li>
            </ul>
          </div>

          {/* Products */}
          <div>
            <h3 className="text-white font-bold mb-4 text-base">Products</h3>
            <ul className="space-y-2.5">
              <li>
                <Link
                  href="/products/phones"
                  className="text-sm text-gray-400 hover:text-blue-500 transition-colors duration-200"
                >
                  Smartphones
                </Link>
              </li>
              <li>
                <Link
                  href="/products/accessories"
                  className="text-sm text-gray-400 hover:text-blue-500 transition-colors duration-200"
                >
                  Accessories
                </Link>
              </li>
              <li>
                <Link
                  href="/products/new"
                  className="text-sm text-gray-400 hover:text-blue-500 transition-colors duration-200"
                >
                  New Arrivals
                </Link>
              </li>
              <li>
                <Link
                  href="/cart"
                  className="text-sm text-gray-400 hover:text-blue-500 transition-colors duration-200"
                >
                  Shopping Cart
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-white font-bold mb-4 text-base">Contact Us</h3>
            <ul className="space-y-3">
              <li className="flex items-start gap-2">
                <Phone className="w-4 h-4 text-blue-500 flex-shrink-0 mt-0.5" />
                <div>
                  <a
                    href="tel:+911234567890"
                    className="text-sm text-gray-400 hover:text-blue-500 transition-colors"
                  >
                    +91 123 456 7890
                  </a>
                </div>
              </li>
              <li className="flex items-start gap-2">
                <Mail className="w-4 h-4 text-blue-500 flex-shrink-0 mt-0.5" />
                <div>
                  <a
                    href="mailto:support@silicon.com"
                    className="text-sm text-gray-400 hover:text-blue-500 transition-colors"
                  >
                    support@silicon.com
                  </a>
                </div>
              </li>
              <li className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-blue-500 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm text-gray-400">
                    123 Tech Street, City, State 12345
                  </p>
                </div>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
            {/* Copyright */}
            <p className="text-sm text-gray-400 text-center sm:text-left">
              © {currentYear}{" "}
              <span className="text-white font-semibold">Silicon</span>. All
              rights reserved. Made with{" "}
              <Heart className="inline w-3 h-3 text-red-500 fill-red-500" />
            </p>

            {/* Legal Links */}
            <div className="flex flex-wrap items-center justify-center gap-4 text-sm">
              <Link
                href="/privacy"
                className="text-gray-400 hover:text-blue-500 transition-colors duration-200"
              >
                Privacy Policy
              </Link>
              <Link
                href="/terms"
                className="text-gray-400 hover:text-blue-500 transition-colors duration-200"
              >
                Terms of Service
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
