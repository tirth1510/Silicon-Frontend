/* eslint-disable react/jsx-no-undef */
/* eslint-disable react/no-unescaped-entities */
"use client";

import { useState, useEffect } from "react";
import {
  Search,
  X,
  User,
  ChevronDown,
  Package,
  LogIn,
  UserPlus,
  Home,
  Info,
  Mail,
  LayoutDashboard,
  LogOut,
  MoreVertical,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { useProfile } from "@/hooks/useprofile";
import NavbarLoader from "./loader";
import { toast } from "sonner";
import { logoutService } from "@/services/auth.service";
import { SearchProducts } from './search-products';

export default function Navbar() {
  const [mobileMenu, setMobileMenu] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();

  const { profile, loading } = useProfile();
  const router = useRouter();

  const isAuthenticated = profile && (profile.role === "user" || profile.role === "admin");

  const handleLogout = async () => {
    try {
      await logoutService();
      toast.success("Logged out successfully");
      router.push("/login");
    } catch {
      toast.error("Logout failed");
    }
  };

  const isActive = (path: string) => {
    if (path === "/") return pathname === "/";
    return pathname?.startsWith(path);
  };

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-50 w-full transition-all duration-300 ${
          scrolled ? "bg-white shadow-lg py-1" : "bg-white/95 backdrop-blur-md shadow-sm py-2"
        }`}
      >
        <nav className="w-full border-b border-gray-100/50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-14 sm:h-16 lg:h-20">
              
              {/* LEFT: Logo */}
              <div className="flex items-center shrink-0">
                <Link href="/" className="flex items-center">
                  <Image
                    src="/logo.png"
                    alt="Silicon Meditech"
                    width={150}
                    height={40}
                    className="object-contain sm:w-[180px]"
                  />
                </Link>
              </div>

              {/* CENTER: Desktop Nav */}
              <div className="hidden md:flex items-center bg-gray-50/50 p-1 rounded-2xl border border-gray-100 gap-x-1">
                <Link href="/" className={`px-4 py-2 text-sm font-semibold rounded-xl transition-all ${isActive("/") ? "bg-white text-blue-700 shadow-sm" : "text-gray-600 hover:text-blue-600"}`}>
                  Home
                </Link>
                <Link href="/about" className={`px-4 py-2 text-sm font-semibold rounded-xl transition-all ${isActive("/about") ? "bg-white text-blue-700 shadow-sm" : "text-gray-600 hover:text-blue-600"}`}>
                  About
                </Link>
                <Link href="/contact" className={`px-4 py-2 text-sm font-semibold rounded-xl transition-all ${isActive("/contact") ? "bg-white text-blue-700 shadow-sm" : "text-gray-600 hover:text-blue-600"}`}>
                  Contact
                </Link>
              </div>

              {/* RIGHT: Actions */}
              <div className="flex items-center gap-2 sm:gap-4">
                <div className="hidden lg:block w-64 xl:w-80">
                  <SearchProducts />
                </div>

                {/* Desktop Account Logic */}
                <div className="hidden sm:flex items-center">
                  {loading ? (
                    <NavbarLoader />
                  ) : isAuthenticated ? (
                    <DropdownMenu>
                      <DropdownMenuTrigger className="flex items-center gap-2 bg-blue-50 border border-blue-100 pl-2 pr-3 py-1.5 rounded-2xl cursor-pointer outline-none transition-all hover:bg-blue-100">
                        <div className="h-8 w-8 rounded-full bg-blue-600 flex items-center justify-center text-white font-bold text-sm uppercase">
                          {profile?.username?.charAt(0)}
                        </div>
                        <span className="text-xs font-bold text-blue-900 hidden lg:block">{profile?.username}</span>
                        <ChevronDown className="h-3.5 w-3.5 text-blue-400" />
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="w-56 mt-2 rounded-2xl shadow-xl p-2">
                        <DropdownMenuLabel className="text-xs font-bold text-gray-400 uppercase px-2">Account Settings</DropdownMenuLabel>
                        {profile?.role === "admin" && (
                          <DropdownMenuItem onClick={() => router.push("/dashboard")} className="rounded-lg py-2.5 cursor-pointer">
                            <LayoutDashboard className="h-4 w-4 mr-2" /> Dashboard
                          </DropdownMenuItem>
                        )}
                        <DropdownMenuSeparator />
                        <DropdownMenuItem onClick={handleLogout} className="text-red-600 rounded-lg py-2.5 font-semibold cursor-pointer focus:bg-red-50 focus:text-red-700">
                          <LogOut className="h-4 w-4 mr-2" /> Logout
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  ) : (
                    <div className="flex items-center gap-x-2">
                      <Link href="/login">
                        <Button variant="ghost" className="text-blue-700 hover:text-blue-800 hover:bg-blue-50 rounded-xl px-5 font-bold">
                          Login
                        </Button>
                      </Link>
                      <Link href="/signup">
                        <Button className="bg-blue-700 hover:bg-blue-800 rounded-xl px-5 font-bold shadow-sm transition-all text-white">
                          Sign Up
                        </Button>
                      </Link>
                    </div>
                  )}
                </div>

                {/* Mobile Toggle Icons */}
                <div className="flex md:hidden items-center gap-2">
                  <button onClick={() => { setSearchOpen(!searchOpen); setMobileMenu(false); }} className={`p-2 rounded-xl transition-all ${searchOpen ? 'bg-blue-700 text-white shadow-md' : 'bg-gray-100 text-gray-600'}`}>
                    {searchOpen ? <X size={20} /> : <Search size={20} />}
                  </button>
                  <button onClick={() => { setMobileMenu(!mobileMenu); setSearchOpen(false); }} className={`p-2 rounded-xl transition-all ${mobileMenu ? 'bg-blue-700 text-white shadow-md' : 'bg-gray-100 text-gray-600'}`}>
                    {mobileMenu ? <X size={20} /> : <MoreVertical size={20} />}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </nav>

        {/* Mobile Search Overlay */}
        {searchOpen && (
          <div className="md:hidden border-t border-gray-100 bg-white p-4 animate-in slide-in-from-top duration-300">
            <SearchProducts />
          </div>
        )}

        {/* Mobile Menu Overlay */}
        {mobileMenu && (
          <div className="md:hidden border-t border-gray-100 bg-white animate-in slide-in-from-top duration-300 shadow-2xl">
            <div className="p-4 space-y-4">
              {isAuthenticated ? (
                <div className="flex items-center gap-3 p-4 bg-blue-50 rounded-2xl">
                  <div className="h-12 w-12 rounded-full bg-blue-600 flex items-center justify-center text-white font-bold text-lg uppercase">
                    {profile?.username?.charAt(0)}
                  </div>
                  <div>
                    <p className="text-sm font-bold text-blue-900 leading-tight">{profile?.username}</p>
                    <p className="text-[10px] text-blue-600 font-bold uppercase tracking-wider">{profile?.role}</p>
                  </div>
                </div>
              ) : (
                <div className="p-4 bg-gray-50 rounded-2xl text-center border border-dashed border-gray-200">
                   <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">Welcome Guest</p>
                </div>
              )}

              <div className="grid grid-cols-1 gap-1">
                <Link href="/" onClick={() => setMobileMenu(false)} className={`flex items-center gap-3 p-3 rounded-xl font-medium ${isActive("/") ? "bg-blue-50 text-blue-700" : "text-gray-700"}`}>
                  <Home size={18} /> Home
                </Link>
                <Link href="/products" onClick={() => setMobileMenu(false)} className="flex items-center gap-3 p-3 rounded-xl font-medium text-gray-700 hover:bg-gray-50">
                  <Package size={18} /> Products
                </Link>
                <Link href="/about" onClick={() => setMobileMenu(false)} className="flex items-center gap-3 p-3 rounded-xl font-medium text-gray-700 hover:bg-gray-50">
                  <Info size={18} /> About Us
                </Link>
                <Link href="/contact" onClick={() => setMobileMenu(false)} className="flex items-center gap-3 p-3 rounded-xl font-medium text-gray-700 hover:bg-gray-50">
                  <Mail size={18} /> Contact Us
                </Link>
                {profile?.role === "admin" && (
                  <Link href="/dashboard" onClick={() => setMobileMenu(false)} className="flex items-center gap-3 p-3 bg-blue-900 text-white rounded-xl font-bold shadow-sm transition-all hover:bg-blue-950">
                    <LayoutDashboard size={18} /> Admin Dashboard
                  </Link>
                )}
              </div>

              <div className="pt-4 border-t border-gray-100">
                {isAuthenticated ? (
                  <Button onClick={handleLogout} variant="destructive" className="w-full rounded-xl py-6 font-bold text-base shadow-sm">
                    <LogOut className="h-5 w-5 mr-2" /> Logout
                  </Button>
                ) : (
                  <div className="flex gap-3">
                    <Button asChild className="flex-1 bg-blue-700 hover:bg-blue-800 rounded-xl py-6 font-bold shadow-md">
                      <Link href="/login" onClick={() => setMobileMenu(false)}>
                        <LogIn className="h-5 w-5 mr-2" /> Login
                      </Link>
                    </Button>
                    <Button asChild variant="outline" className="flex-1 border-blue-700 text-blue-700 hover:bg-blue-50 rounded-xl py-6 font-bold">
                      <Link href="/signup" onClick={() => setMobileMenu(false)}>
                        <UserPlus className="h-5 w-5 mr-2" /> Sign Up
                      </Link>
                    </Button>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </header>

      <div className="h-14 sm:h-16 lg:h-20" />
    </>
  );
}