"use client";

import { useState, useEffect } from "react";
import {
  Search, Menu, X, User, ChevronDown, Smartphone, Package,
  LogIn, UserPlus, Home, Phone, Headphones, Info, Mail,
  HomeIcon, User2Icon, LayoutGrid, ChevronRight
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { useProfile } from "@/hooks/useprofile";
import { useCategories } from "@/hooks/useCategories";
import NavbarLoader from "./loader";
import ShinyText from "@/components/gif/wellcome";
import { toast } from "sonner";
import { logoutService } from "@/services/auth.service";

// --- TypeScript Interfaces ---
interface Category {
  _id: string;
  categoryName: string;
  categorySlug: string;
}

interface UserProfile {
  username: string;
  email: string;
  role: "admin" | "user";
}

export default function Navbar() {
  const [mobileMenu, setMobileMenu] = useState<boolean>(false);
  const [searchOpen, setSearchOpen] = useState<boolean>(false);
  const [scrolled, setScrolled] = useState<boolean>(false);
  const [isCatOpen, setIsCatOpen] = useState<boolean>(false); // Mobile category accordion
  const [searchQuery, setSearchQuery] = useState<string>("");

  const pathname = usePathname();
  const router = useRouter();
  
  // Custom hooks with types (assuming hooks return these types)
  const { profile, loading } = useProfile() as { profile: UserProfile | null; loading: boolean };
  const { categories, loading: catLoading } = useCategories() as { categories: Category[] | null; loading: boolean };

  const handleLogout = async (): Promise<void> => {
    try {
      await logoutService();
      toast.success("Logged out successfully");
      router.push("/login");
    } catch {
      toast.error("Logout failed");
    }
  };

  const isActive = (path: string): boolean => {
    if (path === "/") return pathname === "/";
    return pathname?.startsWith(path) || false;
  };

  useEffect(() => {
    const handleScroll = (): void => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <>
      <header className={`fixed top-0 left-0 right-0 z-50 w-full bg-white/98 backdrop-blur-sm transition-all duration-300 ${scrolled ? "shadow-lg" : "shadow-md"}`}>
        <nav className="w-full border-b border-gray-100">
          <div className="max-w-7xl mx-auto px-4 lg:px-8">
            <div className="flex items-center justify-between h-16 lg:h-20">
              
              {/* LOGO */}
              <div className="flex items-center shrink-0">
                <Link href="/" className="group">
                  <Image src="/logo.png" alt="logo" width={170} height={40} className="object-contain" priority />
                </Link>
              </div>

              {/* DESKTOP MENU */}
              <div className="hidden md:flex items-center space-x-2">
                <Link href="/" className={`px-4 py-2 text-sm font-medium rounded-xl transition-all ${isActive("/") ? "text-blue-700 bg-blue-50 font-bold" : "text-gray-700 hover:bg-gray-50"}`}>
                  Home
                </Link>

                {/* DYNAMIC DROPDOWN */}
                <DropdownMenu>
                  <DropdownMenuTrigger className={`group flex items-center gap-1 px-4 py-2 text-sm font-medium rounded-xl transition-all outline-none ${isActive("/products") ? "text-blue-700 bg-blue-50 font-bold" : "text-gray-700 hover:bg-gray-50"}`}>
                    Our Products
                    <ChevronDown className="h-4 w-4 transition-transform group-data-[state=open]:rotate-180" />
                  </DropdownMenuTrigger>
                  
                  <DropdownMenuContent className="w-72 mt-2 p-2 shadow-2xl border-gray-100 rounded-2xl animate-in zoom-in-95 duration-200" align="start">
                    <DropdownMenuItem asChild className="focus:bg-blue-600 focus:text-white cursor-pointer rounded-xl mb-1 p-3 transition-colors">
                      <Link href="/products" className="flex items-center w-full font-bold">
                        <LayoutGrid className="h-4 w-4 mr-2" />
                        All Categories
                      </Link>
                    </DropdownMenuItem>
                    
                    <DropdownMenuSeparator className="my-2" />
                    
                    <div className="max-h-[60vh] overflow-y-auto px-1">
                      {catLoading ? (
                        <div className="p-4 text-center text-xs text-gray-400 italic">Loading categories...</div>
                      ) : (
                        categories?.map((cat) => (
                          <DropdownMenuItem key={cat._id} asChild className="focus:bg-blue-50 cursor-pointer rounded-xl py-3 px-4">
                            <Link href={`/products?category=${cat.categorySlug}`} className="flex items-center justify-between w-full group/item">
                              <span className="text-gray-700 font-medium group-hover/item:text-blue-700">{cat.categoryName}</span>
                              <ChevronRight className="h-4 w-4 text-gray-300 group-hover/item:text-blue-600 transition-transform group-hover/item:translate-x-1" />
                            </Link>
                          </DropdownMenuItem>
                        ))
                      )}
                    </div>
                  </DropdownMenuContent>
                </DropdownMenu>

                <Link href="/about" className={`px-4 py-2 text-sm font-medium rounded-xl transition-all ${isActive("/about") ? "text-blue-700 bg-blue-50 font-bold" : "text-gray-700 hover:bg-gray-50"}`}>
                  About
                </Link>
                <Link href="/contact" className={`px-4 py-2 text-sm font-medium rounded-xl transition-all ${isActive("/contact") ? "text-blue-700 bg-blue-50 font-bold" : "text-gray-700 hover:bg-gray-50"}`}>
                  Contact Us
                </Link>
              </div>

              {/* RIGHT ACTIONS */}
              <div className="flex items-center gap-3">
                {/* Search (Desktop) */}
                <div className="hidden lg:block relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                  <input 
                    type="text" 
                    placeholder="Search medical products..." 
                    className="pl-9 pr-4 py-2 bg-gray-50 border-none rounded-xl w-44 xl:w-60 text-sm focus:ring-2 focus:ring-blue-500 transition-all outline-none"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>

                {/* Profile Section */}
                <div className="hidden sm:block">
                  {loading ? <NavbarLoader /> : (
                    profile ? (
                      <div className="flex items-center gap-3 bg-blue-50 pl-4 pr-1 py-1 rounded-2xl border border-blue-100">
                        <span className="text-sm font-bold text-blue-800">Hi, {profile.username}</span>
                        <Button size="sm" variant="ghost" onClick={handleLogout} className="text-red-500 hover:bg-red-50 rounded-xl hover:text-red-600">Logout</Button>
                      </div>
                    ) : (
                      <Link href="/login">
                        <Button className="bg-blue-700 hover:bg-blue-800 rounded-xl px-6 font-bold shadow-lg shadow-blue-100">Login</Button>
                      </Link>
                    )
                  )}
                </div>

                <button onClick={() => setMobileMenu(true)} className="md:hidden p-2 text-gray-600 hover:bg-gray-100 rounded-xl transition-colors">
                  <Menu size={24} />
                </button>
              </div>
            </div>
          </div>
        </nav>
      </header>

      {/* MOBILE DRAWER */}
      <aside className={`fixed inset-y-0 right-0 z-[100] w-[300px] bg-white shadow-2xl transition-transform duration-300 transform ${mobileMenu ? "translate-x-0" : "translate-x-full"}`}>
        <div className="flex flex-col h-full">
          <div className="p-6 border-b flex items-center justify-between bg-blue-600 text-white">
            <span className="font-black tracking-tighter text-2xl">SILICON MEDI</span>
            <button onClick={() => setMobileMenu(false)} className="p-2 bg-white/20 rounded-xl hover:bg-white/30 transition-colors"><X size={20} /></button>
          </div>

          <div className="flex-1 overflow-y-auto p-4 space-y-2">
            <Link href="/" onClick={() => setMobileMenu(false)} className="flex items-center gap-3 p-4 font-bold text-gray-700 hover:bg-blue-50 rounded-2xl">
              <Home size={20} /> Home
            </Link>

            {/* Mobile Accordion */}
            <div className="space-y-1">
              <button 
                onClick={() => setIsCatOpen(!isCatOpen)}
                className={`flex items-center justify-between w-full p-4 font-bold rounded-2xl transition-all ${isCatOpen ? "bg-blue-700 text-white shadow-xl" : "text-gray-700 hover:bg-blue-50"}`}
              >
                <div className="flex items-center gap-3"><Package size={20} /> Products</div>
                <ChevronDown className={`w-4 h-4 transition-transform ${isCatOpen ? "rotate-180" : ""}`} />
              </button>
              
              {isCatOpen && (
                <div className="pl-6 py-2 space-y-1 animate-in slide-in-from-top-2 duration-300">
                  <Link href="/products" onClick={() => setMobileMenu(false)} className="block p-3 text-sm font-black text-blue-600 border-b border-blue-50 mb-2">View All Categories</Link>
                  {categories?.map((cat) => (
                    <Link key={cat._id} href={`/products?category=${cat.categorySlug}`} onClick={() => setMobileMenu(false)} className="block p-3 text-sm font-semibold text-gray-600 hover:text-blue-700 border-l-2 border-gray-100 hover:border-blue-600">
                      {cat.categoryName}
                    </Link>
                  ))}
                </div>
              )}
            </div>

            <Link href="/about" onClick={() => setMobileMenu(false)} className="flex items-center gap-3 p-4 font-bold text-gray-700 hover:bg-blue-50 rounded-2xl">
              <Info size={20} /> About Us
            </Link>
            <Link href="/contact" onClick={() => setMobileMenu(false)} className="flex items-center gap-3 p-4 font-bold text-gray-700 hover:bg-blue-50 rounded-2xl">
              <Mail size={20} /> Contact Us
            </Link>
          </div>

          <div className="p-6 bg-gray-50 border-t">
             {profile ? (
               <Button variant="destructive" onClick={handleLogout} className="w-full rounded-2xl py-7 font-black text-lg">LOGOUT</Button>
             ) : (
               <Link href="/login" onClick={() => setMobileMenu(false)}>
                 <Button className="w-full bg-blue-700 rounded-2xl py-7 font-black text-lg shadow-xl shadow-blue-100">SIGN IN</Button>
               </Link>
             )}
          </div>
        </div>
      </aside>

      <div className="h-16 lg:h-20" />
    </>
  );
}