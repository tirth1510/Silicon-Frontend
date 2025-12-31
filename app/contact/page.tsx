"use client";
import { Mail, Phone, MapPin } from "lucide-react";
import ContactFirst from "./contectfirst";

export default function Contact() {
  return (
    <div className="mt-17">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

          {/* LEFT SIDEBAR (DESKTOP ONLY) */}
          <div className="hidden lg:block space-y-6">

            {/* EMAIL */}
            <div className="bg-white p-6 rounded-xl shadow-sm">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                <Mail className="w-6 h-6 text-blue-900" />
              </div>
              <h3 className="text-blue-900 mb-2 font-semibold">Email Us</h3>
              <p className="text-blue-900">info@meditech.com</p>
              <p className="text-blue-900">sales@meditech.com</p>
            </div>

            {/* PHONE */}
            <div className="bg-white p-6 rounded-xl shadow-sm">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                <Phone className="w-6 h-6 text-blue-900" />
              </div>
              <h3 className="text-blue-900 mb-2 font-semibold">Call Us</h3>
              <p className="text-blue-900">Sales: +1 (555) 123-4567</p>
              <p className="text-blue-900">Support: +1 (555) 123-4568</p>
            </div>

            {/* ADDRESS */}
            <div className="bg-white p-6 rounded-xl shadow-sm">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                <MapPin className="w-6 h-6 text-blue-900" />
              </div>
              <h3 className="text-blue-900 mb-2 font-semibold">Visit Us</h3>
              <p className="text-blue-900 leading-relaxed">
                123 Medical Boulevard <br />
                New York, NY 10001 <br />
                United States
              </p>
            </div>

            {/* BUSINESS HOURS */}
            <div className="bg-white p-6 rounded-xl text-blue-900 border border-blue-900">
              <h4 className="mb-2 font-semibold">Business Hours</h4>
              <p>Mon–Fri: 8:00 AM – 6:00 PM</p>
              <p>Saturday: 9:00 AM – 2:00 PM</p>
              <p>Sunday: Closed</p>
            </div>
          </div>

          {/* RIGHT CONTENT */}
          <div className="lg:col-span-2 space-y-8">

            {/* CONTACT FORM */}
            <ContactFirst />

            {/* MOBILE CONTACT BOX */}
            <div className="lg:hidden space-y-6">
              <div className="bg-white p-6 rounded-xl shadow-sm space-y-6">

                {/* EMAIL */}
                <div className="border-2 border-blue-900 p-5 rounded-2xl flex items-start gap-4">
                  <div className="w-14 h-14 bg-white border-2 border-blue-900 rounded-2xl flex items-center justify-center shadow-sm">
                    <Mail className="w-7 h-7 text-blue-900" />
                  </div>
                  <div>
                    <h3 className="text-blue-900 font-semibold mb-1 text-lg">Email Us</h3>
                    <p className="text-blue-900">info@meditech.com</p>
                    <p className="text-blue-900">sales@meditech.com</p>
                  </div>
                </div>

                {/* PHONE */}
                <div className="border-2 border-blue-900 p-5 rounded-2xl flex items-start gap-4">
                  <div className="w-14 h-14 bg-white border-2 border-blue-900 rounded-2xl flex items-center justify-center shadow-sm">
                    <Phone className="w-7 h-7 text-blue-900" />
                  </div>
                  <div>
                    <h3 className="text-blue-900 font-semibold mb-1 text-lg">Call Us</h3>
                    <p className="text-blue-900">Sales: +1 (555) 123-4567</p>
                    <p className="text-blue-900">Support: +1 (555) 123-4568</p>
                  </div>
                </div>

                {/* ADDRESS */}
                <div className="border-2 border-blue-900 p-5 rounded-2xl flex items-start gap-4">
                  <div className="w-14 h-14 bg-white border-2 border-blue-900 rounded-2xl flex items-center justify-center shadow-sm">
                    <MapPin className="w-7 h-7 text-blue-900" />
                  </div>
                  <div>
                    <h3 className="text-blue-900 mb-1 font-semibold text-lg">Visit Us</h3>
                    <p className="text-blue-900 leading-relaxed">
                      123 Medical Boulevard <br />
                      New York, NY 10001 <br />
                      United States
                    </p>
                  </div>
                </div>

                {/* HOURS */}
                <div className="border-2 border-blue-900 p-5 rounded-2xl text-blue-900">
                  <h4 className="mb-2 font-semibold text-lg">Business Hours</h4>
                  <p>Mon–Fri: 8:00 AM – 6:00 PM</p>
                  <p>Saturday: 9:00 AM – 2:00 PM</p>
                  <p>Sunday: Closed</p>
                </div>

              </div>
            </div>

            {/* MAP */}
            <div className="bg-gray-200 rounded-xl overflow-hidden w-full h-72 sm:h-96">
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
    </div>
  );
}
