"use client";

import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogTitle,
  DialogDescription,
  DialogClose,
} from "@/components/ui/dialog";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Phone, MessageCircle, Mail, Plus, ArrowRight, Award, UserCircle, PhoneIcon } from "lucide-react";
import Image from "next/image";

type CEO = {
  name: string;
  role: string;
  degree: string;
  image: string;
  bio: string;
  mobile: string;
  whatsapp: string;
  email: string;
  theme: string;
};

const ceos: CEO[] = [
 
  {
   name: "Mr. Krunal Mistry",
   role: "Managing director",
   degree: "B.E. Biomedical Engineering",
   image: "/ceo/image7.png",
   bio: "Mr. Krunal Mistry has over 20 years of experience in healthcare, leading Silicon Meditech Private Limited with vision and innovation.",
   mobile: "+91 9429554465",
   whatsapp: "+919429554465",
   email: "krunal@siliconmeditech.com",
   theme: "bg-[#00B5AD]", 
 },
  {
    name: "Mr. Nirmal Patel",
    role: "Managing director",
    degree: "B.E. Biomedical Engineering",
    image: "/ceo/nirmal2.png",
    bio: "Mr. Nirmal oversees global operations, ensuring high-quality medical equipment production and customer satisfaction across India.",
    mobile: "+91 9601551892",
    whatsapp: "+919601551892",
    email: "nirmalpatel247@gmail.com",
    theme: "bg-blue-900", 
  },
];

export default function CEOSection() {
  return (
    <TooltipProvider>
      <section className="py-24 bg-white overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

          {/* Section Header */}
          <div className="mb-16">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-50 rounded-xl mb-4 border border-blue-100">
              <Award className="w-4 h-4 text-blue-700" />
              <span className="text-xs font-black uppercase tracking-widest text-blue-900">Our Leadership</span>
            </div>
            <h2 className="text-4xl md:text-5xl font-black text-slate-900 tracking-tighter">
              Visionary Minds <span className="text-blue-900">Behind Us.</span>
            </h2>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
            {ceos.map((ceo, idx) => (
              <Dialog key={idx}>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <DialogTrigger asChild>
                      <div className={`group relative ${ceo.theme} rounded-[3rem] p-8 h-[280px] cursor-pointer 
                                     transition-all duration-500 hover:shadow-2xl hover:-translate-y-2 flex items-center overflow-visible shadow-xl shadow-black/5`}>

                        {/* Background Plus Pattern */}
                        <div className="absolute top-6 right-10 opacity-10 pointer-events-none">
                          <Plus className="w-24 h-24 text-white" strokeWidth={5} />
                        </div>

                        {/* Text Content (Left Side) */}
                        <div className="relative z-10 w-[60%] flex flex-col h-full justify-between">
                          <div className="space-y-2">
                            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-white/70">
                              {ceo.role}
                            </span>
                            <h3 className="text-3xl font-black text-white leading-none tracking-tighter">
                              {ceo.name}
                            </h3>
                            <p className="text-sm font-bold text-white/80 italic">
                              {ceo.degree}
                            </p>
                           <div className="space-y-2">
                            <p className="text-sm font-bold text-white/80 italic">
                              <PhoneIcon className="w-4 h-4 inline mr-1" /> {ceo.mobile}
                            </p>
                          </div>

                          </div>
                          <button className="flex items-center gap-2 w-fit px-6 py-3 bg-white text-slate-900 rounded-2xl font-black text-xs uppercase tracking-widest transition-all group-hover:bg-slate-900 group-hover:text-white">
                            View Profile <ArrowRight className="w-4 h-4" />
                          </button>
                        </div>

                        <div className="absolute -right-4 -bottom-2 w-[45%] h-[115%] flex items-end justify-end pointer-events-none">
                          <Image
                            src={ceo.image}
                            alt={ceo.name}
                            width={200}
                            height={200}
                            className="object-cover w-full h-full rounded-[2.5rem] border-4 border-white shadow-2xl transition-transform duration-700 group-hover:scale-105"
                          />
                        </div>
                        {/* Image Pop-out (Right Side) */}
                      </div>
                    </DialogTrigger>
                  </TooltipTrigger>
                  <TooltipContent side="top" className="bg-blue-900 text-white font-bold text-xs border-none rounded-lg mx-2 py-2">
                    {ceo.name}
                  </TooltipContent>
                </Tooltip>

                {/* MODAL DESIGN */}
                <DialogContent className="sm:max-w-2xl w-[95%] rounded-[3rem] p-0 overflow-hidden border-none shadow-2xl">
                  <div className={`${ceo.theme} p-10 text-white`}>
                    <div className="flex flex-col sm:flex-row gap-8 items-center">
                      <Image
                        src={ceo.image}
                        alt={ceo.name}

                        width={128}
                        height={128}
                        className="w-32 h-32 rounded-[2rem] object-cover border-4 border-white/30 shadow-xl"
                      />
                      <div className="space-y-2 text-center sm:text-left">
                        <DialogTitle className="text-4xl font-black tracking-tighter text-white">
                          {ceo.name}
                        </DialogTitle>
                        <p className="text-lg font-bold text-white/80">{ceo.role}</p>
                        <p className="text-sm font-medium italic text-white/60">{ceo.degree}</p>
                      </div>
                    </div>
                  </div>

                  <div className="p-10 bg-white">
                    

                    {/* Contact info Icons */}
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-8">
                      <a href={`tel:${ceo.mobile}`} className="flex items-center justify-center gap-3 p-4 bg-blue-50 text-blue-700 rounded-2xl font-bold hover:bg-blue-100 transition">
                        <Phone size={20} /> Call
                      </a>
                      <a href={`https://wa.me/${ceo.whatsapp}`} target="_blank" className="flex items-center justify-center gap-3 p-4 bg-green-50 text-green-700 rounded-2xl font-bold hover:bg-green-100 transition">
                        <MessageCircle size={20} /> WhatsApp
                      </a>
                      <a href={`mailto:${ceo.email}`} className="flex items-center justify-center gap-3 p-4 bg-red-50 text-red-700 rounded-2xl font-bold hover:bg-red-100 transition">
                        <Mail size={20} /> Email
                      </a>
                    </div>

                    <div className="mt-10 flex justify-center">
                      <DialogClose className="px-10 py-4 bg-slate-900 text-white rounded-2xl font-black text-sm uppercase tracking-widest hover:bg-blue-700 transition">
                        Close Profile
                      </DialogClose>
                    </div>
                  </div>
                </DialogContent>
              </Dialog>
            ))}
          </div>
        </div>
      </section>
    </TooltipProvider>
  );
}