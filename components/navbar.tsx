/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState, useEffect } from "react";
import {
  ChevronDown, Package, LayoutDashboard, LogOut, MoreVertical,
  Layers, Stethoscope, Activity, ShieldCheck, Home, Info, Mail, Search, ArrowRight
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { useProfile } from "@/hooks/useprofile";
import { toast } from "sonner";
import { logoutService } from "@/services/auth.service";
import { SearchProducts } from "./search-products";
import { useCategories } from "@/hooks/useCategories";

const iconMap: Record<string, any> = {
  "1": Stethoscope,
  "2": Activity,
  "3": ShieldCheck,
  "4": Layers,
  default: Package,
};

export default function Navbar() {
  const [mobileMenu, setMobileMenu] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [mobileProductsOpen, setMobileProductsOpen] = useState(false);
  const pathname = usePathname();
  const router = useRouter();

  const { profile } = useProfile();
  const { categories: apiCategories } = useCategories();

  const isAuthenticated = profile && (profile.role === "user" || profile.role === "admin");

  const isActive = (path: string) => path === "/" ? pathname === "/" : pathname?.startsWith(path);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleLogout = async () => {
    try {
      await logoutService();
      toast.success("Logged out successfully");
      router.push("/login");
      setMobileMenu(false);
    } catch {
      toast.error("Logout failed");
    }
  };

  return (
    <>
      <header className={`fixed top-0 left-0 right-0 z-50 w-full transition-all duration-500 ${scrolled ? "bg-white shadow-xl py-0" : "bg-white/95 backdrop-blur-md py-1"}`}>
        <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 lg:h-20">
            
            {/* LEFT: Logo */}
            <Link href="/" className="shrink-0">
              <Image src="/logo.png" alt="Logo" width={150} height={40} className="sm:w-[170px] object-contain" />
            </Link>

            {/* CENTER: Desktop Navigation */}
            <div className="hidden md:flex items-center bg-slate-100/50 p-1.5 rounded-2xl border border-slate-200/60 gap-x-2">
              <Link href="/" className={`px-5 py-2.5 text-sm font-bold rounded-xl transition-all duration-300 ${isActive("/") ? "bg-blue-900 text-white shadow-lg" : "text-slate-600 hover:text-blue-900"}`}>Home</Link>
              <Link href="/about" className="px-5 py-2.5 text-sm font-bold rounded-xl text-slate-600 hover:text-blue-900">About</Link>

              <div className="relative" onMouseEnter={() => setIsDropdownOpen(true)} onMouseLeave={() => setIsDropdownOpen(false)}>
                <DropdownMenu open={isDropdownOpen} onOpenChange={setIsDropdownOpen} modal={false}>
                  <DropdownMenuTrigger asChild>
                    <button className={`flex items-center gap-2 px-5 py-2.5 text-sm font-bold rounded-xl outline-none transition-all duration-300 ${isActive("/products") || isDropdownOpen ? "bg-blue-900 text-white shadow-lg" : "text-slate-600 hover:text-blue-900"}`}>
                      Products <ChevronDown className={`h-3.5 w-3.5 transition-transform duration-300 ${isDropdownOpen ? 'rotate-180' : ''}`} />
                    </button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="center" className="w-[480px] mt-2 rounded-[2rem] shadow-2xl p-5 bg-white border border-slate-100 animate-in fade-in slide-in-from-top-4 duration-300">
                    <div className="grid grid-cols-2 gap-4">
                      {apiCategories?.slice(0, 4).map((item: any) => {
                        const Icon = iconMap[String(item.categoryId)] || iconMap.default;
                        return (
                          <div key={item._id} onClick={() => router.push(Number(item.categoryId) === 4 ? "/products/accessories" : `/products?category=${item.categorySlug}`)} className="flex items-center gap-4 p-4 rounded-2xl cursor-pointer hover:bg-blue-900 group transition-all duration-300 border border-transparent hover:shadow-xl">
                            <div className="w-12 h-12 rounded-full bg-blue-50 flex items-center justify-center shrink-0 group-hover:bg-white/20 transition-all duration-500">
                              <Icon className="w-6 h-6 text-blue-900 group-hover:text-white" />
                            </div>
                            <span className="text-sm font-bold text-slate-800 group-hover:text-white leading-tight">{item.categoryName}</span>
                          </div>
                        );
                      })}
                    </div>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
              <Link href="/contact" className="px-5 py-2.5 text-sm font-bold rounded-xl text-slate-600 hover:text-blue-900">Contact</Link>
            </div>

            {/* RIGHT: Actions */}
            <div className="flex items-center gap-3">
              <div className="hidden lg:block w-64 xl:w-80"><SearchProducts /></div>

              {/* Desktop Auth/Profile */}
              {!isAuthenticated ? (
                <div className="hidden sm:flex items-center gap-2">
                  <Link href="/login"><Button variant="ghost" className="text-blue-900 font-bold hover:bg-blue-50 rounded-xl px-5">Login</Button></Link>
                  <Link href="/signup"><Button className="bg-blue-900 hover:bg-slate-900 text-white font-bold rounded-xl px-6 shadow-lg shadow-blue-900/20">Sign Up</Button></Link>
                </div>
              ) : (
                <div className="hidden sm:block">
                  <DropdownMenu>
                    <DropdownMenuTrigger className="flex items-center gap-2 bg-blue-50 border border-blue-100 p-1.5 rounded-2xl outline-none hover:bg-white transition-all shadow-sm">
                      <div className="h-8 w-8 rounded-full bg-blue-900 flex items-center justify-center text-white font-bold text-xs uppercase">{profile?.username?.charAt(0)}</div>
                      <span className="text-blue-900 font-bold text-sm">{profile?.username}</span>
                      <ChevronDown className="h-3.5 w-3.5 text-blue-400" />
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-52 mt-2 rounded-2xl p-2 border-none shadow-2xl">
                      {profile?.role === "admin" && (
                        <DropdownMenuItem onClick={() => router.push("/dashboard")} className="font-bold py-3 cursor-pointer rounded-xl hover:bg-blue-50">
                          <LayoutDashboard className="w-4 h-4 mr-3 text-blue-900" /> Dashboard
                        </DropdownMenuItem>
                      )}
                      <DropdownMenuItem onClick={handleLogout} className="text-red-600 font-bold py-3 cursor-pointer rounded-xl hover:bg-red-50">
                        <LogOut className="w-4 h-4 mr-3" /> Logout
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              )}

              {/* MOBILE MENU TRIGGER */}
              <div className="md:hidden">
                <DropdownMenu open={mobileMenu} onOpenChange={setMobileMenu}>
                  <DropdownMenuTrigger asChild>
                    <button className="p-2.5 bg-slate-100 rounded-xl text-blue-900 outline-none active:scale-95 transition-all">
                      <MoreVertical size={22} />
                    </button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-[92vw] mt-3 rounded-[1.5rem] shadow-2xl p-4 bg-white border border-slate-100 animate-in zoom-in-95 duration-200">
                    <div className="flex flex-col gap-2">
                      
                      {/* Mobile Profile Section */}
                      {isAuthenticated && (
                        <div className="flex items-center gap-3 p-3 bg-blue-50 rounded-2xl mb-2">
                          <div className="h-10 w-10 rounded-full bg-blue-900 flex items-center justify-center text-white font-bold uppercase">{profile?.username?.charAt(0)}</div>
                          <div className="flex flex-col">
                            <span className="text-sm font-black text-blue-900 leading-none">{profile?.username}</span>
                            <span className="text-[10px] text-blue-600 font-bold mt-1 uppercase tracking-wider">{profile?.role}</span>
                          </div>
                        </div>
                      )}

                      {/* Mobile Search Bar */}
                      <div className="mb-2">
                         <SearchProducts />
                      </div>

                      <Link href="/" onClick={() => setMobileMenu(false)} className="p-4 rounded-xl font-bold text-slate-700 bg-slate-50 flex items-center gap-3"><Home size={18} /> Home</Link>
                      
                      <button onClick={(e) => { e.preventDefault(); setMobileProductsOpen(!mobileProductsOpen); }} className="p-4 rounded-xl font-bold text-slate-700 flex items-center justify-between w-full hover:bg-slate-50">
                        <div className="flex items-center gap-3"><Package size={18} /> Products</div>
                        <ChevronDown className={`w-4 h-4 transition-transform ${mobileProductsOpen ? "rotate-180" : ""}`} />
                      </button>

                      {mobileProductsOpen && (
                        <div className="grid grid-cols-2 gap-2 p-2 bg-blue-50/50 rounded-2xl mb-2">
                          {apiCategories?.slice(0, 4).map((item: any) => {
                            const Icon = iconMap[String(item.categoryId)] || iconMap.default;
                            return (
                              <div key={item._id} onClick={() => { router.push(`/products?category=${item.categorySlug}`); setMobileMenu(false); }} className="flex items-center gap-2 p-3 bg-white rounded-xl shadow-sm border border-blue-100">
                                <Icon className="w-4 h-4 text-blue-900" />
                                <span className="text-[11px] font-bold text-slate-700 line-clamp-1">{item.categoryName}</span>
                              </div>
                            );
                          })}
                        </div>
                      )}

                      <Link href="/about" onClick={() => setMobileMenu(false)} className="p-4 rounded-xl font-bold text-slate-700 flex items-center gap-3"><Info size={18} /> About Us</Link>
                      <Link href="/contact" onClick={() => setMobileMenu(false)} className="p-4 rounded-xl font-bold text-slate-700 flex items-center gap-3"><Mail size={18} /> Contact</Link>

                      {/* Mobile Auth/Profile Actions */}
                      <div className="mt-2 pt-4 border-t border-slate-100">
                        {!isAuthenticated ? (
                          <div className="grid grid-cols-2 gap-3">
                            <Link href="/login" onClick={() => setMobileMenu(false)}><Button variant="outline" className="w-full rounded-xl border-blue-900 text-blue-900 font-bold">Login</Button></Link>
                            <Link href="/signup" onClick={() => setMobileMenu(false)}><Button className="w-full rounded-xl bg-blue-900 font-bold">Sign Up</Button></Link>
                          </div>
                        ) : (
                          <div className="flex flex-col gap-2">
                             {profile?.role === "admin" && (
                               <Button onClick={() => { router.push("/dashboard"); setMobileMenu(false); }} className="w-full bg-blue-900 rounded-xl font-bold gap-2"><LayoutDashboard size={18}/> Dashboard</Button>
                             )}
                             <Button onClick={handleLogout} variant="ghost" className="w-full text-red-600 font-bold gap-2 hover:bg-red-50 rounded-xl"><LogOut size={18}/> Logout</Button>
                          </div>
                        )}
                      </div>
                    </div>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
          </div>
        </nav>
      </header>
      <div className="h-16 lg:h-20" />
    </>
  );
}