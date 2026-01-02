"use client";
import { Mail, Phone, MapPin, Clock, Send } from "lucide-react";
import ContactFirst from "./contectfirst";

export default function Contact() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* HERO SECTION */}
      <div className="pt-20 pb-12">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center space-y-6 mb-12">
            <div className="inline-block">
              <div className="flex items-center justify-center w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-blue-100 to-purple-100 rounded-xl shadow-lg">
                <Send className="w-8 h-8 text-blue-600" />
              </div>
            </div>
            <h1 className="text-4xl sm:text-5xl font-bold text-gray-900">
              Contact Us
            </h1>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto leading-relaxed">
              Have questions? We're here to help you find the right solution.
            </p>
          </div>
        </div>
      </div>

      {/* MAIN CONTENT */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pb-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

          {/* LEFT SIDEBAR - CONTACT INFO */}
          <div className="lg:col-span-1 space-y-6">

            {/* EMAIL */}
            <div className="group bg-white p-6 rounded-xl shadow-md hover:shadow-lg border border-gray-100 transition-all duration-300">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-900 to-blue-800 rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <Mail className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-gray-900 mb-3 font-semibold text-lg">Email Us</h3>
              <a href="mailto:info@meditech.com" className="block text-gray-600 hover:text-blue-900 text-sm mb-2 transition-colors">
                info@meditech.com
              </a>
              <a href="mailto:sales@meditech.com" className="block text-gray-600 hover:text-blue-900 text-sm transition-colors">
                sales@meditech.com
              </a>
            </div>

            {/* PHONE */}
            <div className="group bg-white p-6 rounded-xl shadow-md hover:shadow-lg border border-gray-100 transition-all duration-300">
              <div className="w-12 h-12 bg-gradient-to-br from-green-600 to-green-500 rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <Phone className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-gray-900 mb-3 font-semibold text-lg">Call Us</h3>
              <a href="tel:+15551234567" className="block text-gray-600 hover:text-green-600 text-sm mb-2 transition-colors">
                Sales: +1 (555) 123-4567
              </a>
              <a href="tel:+15551234568" className="block text-gray-600 hover:text-green-600 text-sm transition-colors">
                Support: +1 (555) 123-4568
              </a>
            </div>

            {/* ADDRESS */}
            <div className="group bg-white p-6 rounded-xl shadow-md hover:shadow-lg border border-gray-100 transition-all duration-300">
              <div className="w-12 h-12 bg-gradient-to-br from-orange-600 to-orange-500 rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <MapPin className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-gray-900 mb-3 font-semibold text-lg">Visit Us</h3>
              <p className="text-gray-600 text-sm leading-relaxed">
                123 Medical Boulevard<br />
                New York, NY 10001<br />
                United States
              </p>
            </div>

            {/* BUSINESS HOURS */}
            <div className="bg-white border-l-4 border-blue-900 p-6 rounded-xl shadow-md">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                  <Clock className="w-5 h-5 text-blue-900" />
                </div>
                <h3 className="font-semibold text-lg text-gray-900">Business Hours</h3>
              </div>
              <div className="space-y-3 text-sm">
                <div>
                  <span className="text-gray-600">Monday – Friday</span>
                  <p className="font-semibold text-gray-900 mt-1">8:00 AM – 6:00 PM</p>
                </div>
                <div>
                  <span className="text-gray-600">Saturday</span>
                  <p className="font-semibold text-gray-900 mt-1">9:00 AM – 2:00 PM</p>
                </div>
                <div>
                  <span className="text-gray-600">Sunday</span>
                  <p className="font-semibold text-red-600 mt-1">Closed</p>
                </div>
              </div>
            </div>

          </div>

          {/* RIGHT SIDE - CONTACT FORM */}
          <div className="lg:col-span-2">
            <ContactFirst />
          </div>

        </div>

        {/* MAP - FULL WIDTH BELOW */}
        <div className="bg-white rounded-xl overflow-hidden shadow-md border border-gray-100 mt-12">
          <div className="bg-gradient-to-r from-blue-900 to-blue-800 p-5">
            <h3 className="text-white font-semibold flex items-center text-lg">
              <MapPin className="w-5 h-5 mr-2" />
              Find Us Here
            </h3>
          </div>
          <div className="w-full h-80">
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3720.6941518634853!2d72.81967007559992!3d21.164566580519015!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3be04dce7c1f68d3%3A0xc4a37b13297092d4!2sSilicon%20Medi%20Tech%20Pvt%20Ltd!5e0!3m2!1sen!2sin!4v1764504972615!5m2!1sen!2sin"
              className="w-full h-full"
              style={{ border: 0 }}
              loading="lazy"
              allowFullScreen
            />
          </div>
        </div>
      </div>
    </div>
  );
}
