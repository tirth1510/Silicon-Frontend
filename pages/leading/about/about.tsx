"use client";

import { Award, CheckCircle, Settings } from "lucide-react";
import ProductsPage from "./products2";
import Accessories from "./accessories";
import FAQ from "./faq";
import Category from "@/pages/leading/sections/category";
import Achivments from "./achiments";
import LimitedDeals from "../sections/limitedDeal";
import Ceo from "./ceo";
export function About() {
  return (
    <div className="pt-20">
      <section>
        <Achivments />
      </section>

      <div className="py-10 bg-white max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12 max-w-2xl mx-auto">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">About Us</h2>
          <p className="text-gray-600 text-lg leading-relaxed">
            Silicon Meditech Private Limited Medicorp are one of the Exalted
            Manufacturers and Suppliers of Medical Equipment, Hospital Furniture
            & Consumables in India. Founded in 2013, we have grown to become a
            recognized name in the healthcare industry.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* CEO Image + Achievement Card */}
          <div className="relative h-[600px] rounded-2xl overflow-hidden shadow-2xl">
            <div className="absolute inset-0 bg-gradient-to-t from-blue-900/40 to-transparent"></div>

            <div className="absolute -bottom-6 -right-6 bg-white p-6 rounded-xl shadow-2xl max-w-xs">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
                  <Award className="w-6 h-6 text-purple-600" />
                </div>
                <div>
                  <div className="text-gray-900">Healthcare Leader 2024</div>
                  <div className="text-gray-500">Global Recognition</div>
                </div>
              </div>
            </div>
          </div>

          {/* Info Section */}
          <div className="mt-10 lg:mt-0 space-y-12">
            {/* WHY US */}
            <div className="bg-gradient-to-br from-blue-50 to-purple-50 p-8 rounded-2xl border border-blue-200 shadow-sm">
              <div className="inline-block bg-purple-100 text-purple-600 px-6 py-2 rounded-full mb-6 text-center mx-auto">
                Why Us?
              </div>
              <p className="text-blue-900 text-center max-w-4xl mx-auto mb-6 leading-relaxed">
                We have established ourselves as a leading supplier of
                high-quality Medical Equipment, Hospital Furniture &
                Consumables. Clients prefer us for the following reasons:
              </p>
              <ul className="text-blue-900 space-y-3 max-w-xl mx-auto">
                {[
                  "ISO Certified Quality Products",
                  "State Of The Art Infrastructure",
                  "Comfortable, Durable and Reliable Products",
                  "Exclusive Range of Product",
                  "Experienced and Qualified Technicians",
                  "On Time Delivery",
                  "Customer Satisfaction",
                  "Affordable Price with Low Maintenance",
                ].map((item, idx) => (
                  <li key={idx} className="flex items-center gap-3">
                    <CheckCircle className="text-blue-700 shrink-0" size={22} />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
              <p className="text-blue-900 text-center mt-6 max-w-4xl mx-auto leading-relaxed">
                We believe our clients’ success is our success. Contact us to
                explore our products and build a long-term partnership.
              </p>
            </div>

            {/* SERVICE */}
            <div className="bg-white border-2 border-blue-900 w-full p-6 rounded-2xl text-center">
              <div className="flex justify-center mb-4">
                <div className="border-2 rounded-2xl p-3 border-blue-900">
                  <Settings size={35} className="text-blue-900" />
                </div>
              </div>
              <h5 className="text-gray-900 mb-3 font-semibold text-xl">
                Service
              </h5>
              <p className="text-blue-900 leading-relaxed max-w-3xl mx-auto">
                Biomedical services include equipment repair, preventive
                maintenance, performance calibration, and safety checks. Our
                expert BE-Biomedical engineering team ensures minimal downtime.
              </p>
            </div>

            {/* QUOTE */}
            <div className="border-l-4 border-blue-600 pl-6 py-4 max-w-3xl mx-auto">
              <p className="text-gray-600 italic mb-3">
                Our mission is to make advanced medical technology accessible to
                every healthcare facility. Innovation should serve humanity.
              </p>
              <p className="text-gray-900 font-semibold">
                - Mr. Krunal Adiyecha
              </p>
            </div>
          </div>
        </div>
      </div>
      <Ceo />
      <LimitedDeals />
      <Category />
      <ProductsPage />
      <Accessories />
      <FAQ />
    </div>
  );
}
