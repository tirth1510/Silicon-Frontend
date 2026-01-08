"use client";

import { Award, CheckCircle, Settings, Target, Users, Heart, Sparkles, TrendingUp, Shield } from "lucide-react";
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

      {/* Hero Section */}
      <div className="bg-gradient-to-br from-blue-50 via-white to-purple-50 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16 max-w-4xl mx-auto">
            <div className="inline-flex items-center gap-2 bg-blue-100 text-blue-700 px-4 py-2 rounded-full mb-6 font-medium">
              <Sparkles size={18} />
              <span>Leading Healthcare Solutions Provider Since 2013</span>
            </div>
            <h1 className="text-5xl font-bold text-gray-900 mb-6 leading-tight">
              Transforming Healthcare with
              <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent"> Innovation & Excellence</span>
            </h1>
            <p className="text-gray-600 text-xl leading-relaxed">
              Silicon Meditech Private Limited Medicorp are one of the Exalted
              Manufacturers and Suppliers of Medical Equipment, Hospital Furniture
              & Consumables in India. Founded in 2013, we have grown to become a
              recognized name in the healthcare industry.
            </p>
          </div>

          {/* Stats Section */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-16">
            {[
              { label: "Years of Excellence", value: "11+", icon: TrendingUp },
              { label: "Happy Clients", value: "500+", icon: Users },
              { label: "Products Range", value: "1000+", icon: Shield },
              { label: "Service Cities", value: "50+", icon: Target },
            ].map((stat, idx) => (
              <div key={idx} className="bg-white p-6 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100 hover:border-blue-200 hover:scale-105">
                <div className="flex items-center justify-center mb-3">
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-100 to-purple-100 rounded-full flex items-center justify-center">
                    <stat.icon className="w-6 h-6 text-blue-600" />
                  </div>
                </div>
                <div className="text-3xl font-bold text-gray-900 text-center mb-1">{stat.value}</div>
                <div className="text-gray-600 text-sm text-center">{stat.label}</div>
              </div>
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
            {/* CEO Image + Achievement Card */}
            <div className="relative h-[600px] rounded-3xl overflow-hidden shadow-2xl group">
              <div className="absolute inset-0 bg-gradient-to-t from-blue-900/60 via-blue-900/20 to-transparent"></div>
              <div className="absolute inset-0 bg-gradient-to-br from-blue-600/10 to-purple-600/10"></div>

              <div className="absolute -bottom-6 -right-6 bg-white p-6 rounded-2xl shadow-2xl max-w-xs transform group-hover:scale-105 transition-transform duration-300">
                <div className="flex items-center space-x-4">
                  <div className="w-14 h-14 bg-gradient-to-br from-purple-100 to-blue-100 rounded-full flex items-center justify-center">
                    <Award className="w-7 h-7 text-purple-600" />
                  </div>
                  <div>
                    <div className="text-gray-900 font-semibold text-lg">Healthcare Leader 2024</div>
                    <div className="text-gray-500">Global Recognition</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Info Section */}
            <div className="space-y-8">
              {/* WHY US */}
              <div className="bg-gradient-to-br from-blue-50 to-purple-50 p-8 rounded-3xl border-2 border-blue-100 shadow-lg hover:shadow-xl transition-all duration-300">
                <div className="flex items-center justify-center gap-2 bg-gradient-to-r from-purple-600 to-blue-600 text-white px-6 py-3 rounded-full mb-6 w-fit mx-auto font-semibold">
                  <Heart size={18} />
                  <span>Why Choose Us?</span>
                </div>
                <p className="text-blue-900 text-center max-w-4xl mx-auto mb-6 leading-relaxed font-medium">
                  We have established ourselves as a leading supplier of
                  high-quality Medical Equipment, Hospital Furniture &
                  Consumables. Clients prefer us for the following reasons:
                </p>
                <ul className="text-blue-900 space-y-4 max-w-xl mx-auto">
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
                    <li key={idx} className="flex items-center gap-3 bg-white/60 p-3 rounded-xl hover:bg-white transition-colors duration-200">
                      <CheckCircle className="text-blue-700 shrink-0" size={22} />
                      <span className="font-medium">{item}</span>
                    </li>
                  ))}
                </ul>
                <p className="text-blue-900 text-center mt-6 max-w-4xl mx-auto leading-relaxed font-medium">
                  We believe our clients' success is our success. Contact us to
                  explore our products and build a long-term partnership.
                </p>
              </div>

              {/* SERVICE */}
              <div className="bg-white border-2 border-blue-900 p-8 rounded-3xl text-center hover:shadow-xl transition-all duration-300 hover:border-blue-600">
                <div className="flex justify-center mb-4">
                  <div className="bg-gradient-to-br from-blue-900 to-blue-700 rounded-2xl p-4 shadow-lg">
                    <Settings size={40} className="text-white" />
                  </div>
                </div>
                <h5 className="text-gray-900 mb-4 font-bold text-2xl">
                  Professional Services
                </h5>
                <p className="text-blue-900 leading-relaxed max-w-3xl mx-auto text-lg">
                  Biomedical services include equipment repair, preventive
                  maintenance, performance calibration, and safety checks. Our
                  expert BE-Biomedical engineering team ensures minimal downtime.
                </p>
              </div>

              {/* QUOTE */}
              <div className="relative bg-gradient-to-r from-blue-600 to-purple-600 p-8 rounded-3xl shadow-xl overflow-hidden">
                <div className="absolute top-0 right-0 w-40 h-40 bg-white/10 rounded-full -mr-20 -mt-20"></div>
                <div className="absolute bottom-0 left-0 w-32 h-32 bg-white/10 rounded-full -ml-16 -mb-16"></div>
                <div className="relative">
                  <div className="text-6xl text-white/30 mb-4">"</div>
                  <p className="text-white text-lg italic mb-4 leading-relaxed">
                    Our mission is to make advanced medical technology accessible to
                    every healthcare facility. Innovation should serve humanity.
                  </p>
                  <p className="text-white font-bold text-xl">
                    - Mr. Krunal Adiyecha
                  </p>
                  <p className="text-blue-100 text-sm mt-1">Founder & CEO</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Our Values Section */}
      <div className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Our Core Values</h2>
            <p className="text-gray-600 text-lg max-w-2xl mx-auto">
              The principles that guide everything we do
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                title: "Quality First",
                desc: "We never compromise on the quality of our medical equipment and ensure every product meets international standards.",
                gradient: "from-blue-500 to-blue-600"
              },
              {
                title: "Innovation",
                desc: "Constantly evolving with the latest medical technology to provide cutting-edge solutions to healthcare providers.",
                gradient: "from-purple-500 to-purple-600"
              },
              {
                title: "Customer Care",
                desc: "Building lasting relationships through exceptional service, timely delivery, and comprehensive support.",
                gradient: "from-pink-500 to-pink-600"
              },
            ].map((value, idx) => (
              <div key={idx} className="bg-gradient-to-br from-gray-50 to-white p-8 rounded-3xl border border-gray-200 hover:border-gray-300 hover:shadow-xl transition-all duration-300 group">
                <div className={`w-16 h-16 bg-gradient-to-br ${value.gradient} rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300 shadow-lg`}>
                  <CheckCircle className="text-white" size={32} />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-4">{value.title}</h3>
                <p className="text-gray-600 leading-relaxed">{value.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      <Ceo />
      <LimitedDeals />
      <Category />
      <FAQ />
    </div>
  );
}

export default About;