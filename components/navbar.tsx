/* eslint-disable react/jsx-no-undef */
/* eslint-disable react/no-unescaped-entities */
"use client";

import { useState, useEffect } from "react";
import {
  Search,
  Menu,
  X,
  User,
  ChevronDown,
  Smartphone,
  Package,
  LogIn,
  UserPlus,
  Home,
  Phone,
  Headphones,
  Info,
  Mail,
  HomeIcon,
  User2Icon,
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
import NavbarLoader from "./loader";
import ShinyText from "@/components/gif/wellcome";
import { toast } from "sonner";
import { logoutService } from "@/services/auth.service";

export default function Navbar() {
  const [mobileMenu, setMobileMenu] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const pathname = usePathname();

  const { profile, loading } = useProfile();
  const router = useRouter();
  // Helper function to check if link is active

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
    if (path === "/") {
      return pathname === "/";
    }
    return pathname?.startsWith(path);
  };

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close mobile menu on resize
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) {
        setMobileMenu(false);
        setSearchOpen(false);
      }
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Prevent body scroll when mobile menu is open
  useEffect(() => {
    if (mobileMenu) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [mobileMenu]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    // Add your search logic here
  };

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-50 w-full bg-white/98 backdrop-blur-sm transition-all duration-300 ${
          scrolled ? "shadow-lg" : "shadow-md"
        }`}
      >
        {/* Main Navbar */}
        <nav className="w-full border-b border-gray-100">
          <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-8">
            <div className="flex items-center justify-between h-14 sm:h-16 lg:h-18">
              {/* LEFT: Brand Logo */}
              <div className="flex items-center shrink-0">
                <Link
                  href="/"
                  className="flex items-center gap-1.5 sm:gap-2 group"
                >
                  <Image
                    src="/logo.png"
                    alt="siliconmeditech"
                    width={170} // set width
                    height={10} // set height
                    className="object-contain"
                  />
                </Link>
              </div>

              {/* CENTER: Navigation Menu (Desktop & Tablet) */}
              <div className="hidden md:flex items-center space-x-1 lg:space-x-2">
                <Link
                  href="/"
                  className={`px-2 lg:px-4 py-2 text-sm lg:text-base font-medium rounded-lg transition-all duration-200 ${
                    isActive("/")
                      ? "text-blue-700 bg-blue-50 font-semibold"
                      : "text-gray-700 hover:text-blue-700 hover:bg-blue-50"
                  }`}
                >
                  Home
                </Link>

                <DropdownMenu>
                  <DropdownMenuTrigger
                    className={`flex items-center gap-1 px-2 lg:px-4 py-2 text-sm lg:text-base font-medium rounded-lg transition-all duration-200 outline-none ${
                      isActive("/products")
                        ? "text-blue-700 bg-blue-50 font-semibold"
                        : "text-gray-700 hover:text-blue-700 hover:bg-blue-50"
                    }`}
                  >
                    Products
                    <ChevronDown className="h-3 w-3 lg:h-4 lg:w-4" />
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="w-56 mt-2" align="center">
                    <DropdownMenuItem className="cursor-pointer py-2.5">
                      <Phone className="h-4 w-4 mr-2" />
                      <Link href="/products" className="flex-1">
                        All Products
                      </Link>
                    </DropdownMenuItem>

                    <DropdownMenuItem className="cursor-pointer py-2.5">
                      <Headphones className="h-4 w-4 mr-2" />
                      <Link href="/products/accessories" className="flex-1">
                        Accessories
                      </Link>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>

                <Link
                  href="/about"
                  className={`px-2 lg:px-4 py-2 text-sm lg:text-base font-medium rounded-lg transition-all duration-200 ${
                    isActive("/about")
                      ? "text-blue-700 bg-blue-50 font-semibold"
                      : "text-gray-700 hover:text-blue-700 hover:bg-blue-50"
                  }`}
                >
                  About
                </Link>

                <Link
                  href="/contact"
                  className={`px-2 lg:px-4 py-2 text-sm lg:text-base font-medium rounded-lg transition-all duration-200 ${
                    isActive("/contact")
                      ? "text-blue-700 bg-blue-50 font-semibold"
                      : "text-gray-700 hover:text-blue-700 hover:bg-blue-50"
                  }`}
                >
                  Contact - US
                </Link>
              </div>

              {/* RIGHT: Actions */}
              <div className="flex items-center gap-1 sm:gap-2 lg:gap-3">
                {/* Search - Desktop */}
                <form onSubmit={handleSearch} className="hidden lg:block">
                  <div className="relative">
                    <Search
                      className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
                      size={18}
                    />
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="Search products..."
                      className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg w-48 xl:w-64 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                    />
                  </div>
                </form>

                {/* Search Icon - Mobile/Tablet */}
                <button
                  onClick={() => setSearchOpen(!searchOpen)}
                  className={`lg:hidden p-2 rounded-lg transition-all duration-200 ${
                    searchOpen
                      ? "bg-blue-700 text-white"
                      : "text-gray-700 hover:text-blue-700 hover:bg-blue-50"
                  }`}
                  aria-label="Toggle search"
                >
                  {searchOpen ? (
                    <X size={18} className="sm:w-5 sm:h-5" />
                  ) : (
                    <Search size={18} className="sm:w-5 sm:h-5" />
                  )}
                </button>

                {/* User Menu - Desktop & Tablet */}

                <div className="hidden sm:block pl-10">
                  {loading ? (
                    <NavbarLoader />
                  ) : profile?.role === "admin" ? (
                    /* 🛡️ ADMIN */
                    <div className="flex items-center gap-3">
                      <Button
                        onClick={() => router.push("/dashboard")}
                        className="flex items-center bg-white border-2 border-blue-900 hover:bg-blue-50 text-blue-900"
                      >
                        <HomeIcon className="h-4 w-4 mr-2" />
                        Dashboard
                      </Button>

                      <Button
                        variant="destructive"
                        onClick={handleLogout}
                        className="flex items-center"
                      >
                        Logout
                      </Button>
                    </div>
                  ) : profile?.role === "user" ? (
                    /* 👤 USER */
                    <div className="flex items-center gap-3 border-2 border-blue-900 px-4 py-2 rounded-xl">
                      <User2Icon className="h-5 w-5 text-blue-700" />
                      <span className="text-sm lg:text-base font-semibold text-blue-700">
                        Hello : {profile.username}
                      </span>

                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={handleLogout}
                        className="text-red-600 hover:text-red-700"
                      >
                        Logout
                      </Button>
                    </div>
                  ) : (
                    /* 🔓 NOT LOGGED IN */
                    <DropdownMenu>
                      <DropdownMenuTrigger className="flex items-center gap-1.5 px-3 py-2 text-sm font-medium text-white bg-blue-700 hover:bg-blue-800 rounded-lg shadow-md">
                        <User size={16} />
                        <span className="hidden md:inline">Account</span>
                        <ChevronDown className="h-4 w-4" />
                      </DropdownMenuTrigger>

                      <DropdownMenuContent className="w-48 mt-2" align="end">
                        <DropdownMenuItem asChild>
                          <Link href="/login" className="flex items-center">
                            <LogIn className="h-4 w-4 mr-2" />
                            Login
                          </Link>
                        </DropdownMenuItem>

                        <DropdownMenuItem asChild>
                          <Link href="/signup" className="flex items-center">
                            <UserPlus className="h-4 w-4 mr-2" />
                            Sign Up
                          </Link>
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  )}
                </div>

                {/* Mobile Menu Button */}
                <button
                  className="md:hidden p-2 text-gray-700 hover:text-blue-700 hover:bg-blue-50 rounded-lg transition-all duration-200"
                  onClick={() => setMobileMenu(!mobileMenu)}
                  aria-label="Toggle menu"
                >
                  {mobileMenu ? <X size={22} /> : <Menu size={22} />}
                </button>
              </div>
            </div>
          </div>
        </nav>

        {/* Mobile/Tablet Search Bar */}
        {searchOpen && (
          <div className="lg:hidden border-t border-gray-200 bg-white animate-in slide-in-from-top duration-200">
            <div className="max-w-7xl mx-auto px-3 sm:px-4 py-3">
              <form onSubmit={handleSearch} className="relative">
                <Search
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
                  size={18}
                />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search for products, brands..."
                  className="w-full pl-10 pr-4 py-2.5 sm:py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-base"
                  autoFocus
                />
              </form>
            </div>
          </div>
        )}
      </header>

      {/* Mobile Menu Overlay */}
      {mobileMenu && (
        <div
          className="fixed inset-0 bg-black/60 z-40 md:hidden animate-in fade-in duration-200"
          onClick={() => setMobileMenu(false)}
        />
      )}

      {/* Mobile Menu Drawer */}
      <aside
        className={`fixed top-0 right-0 h-full w-[85%] max-w-sm bg-white shadow-2xl z-50 md:hidden transform transition-transform duration-300 ease-out ${
          mobileMenu ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex flex-col h-full">
          {/* Mobile Menu Header */}
          <div className="flex items-center justify-between p-4 border-b border-gray-200 bg-linear-to-r from-blue-50 to-white">
            <div className="flex items-center gap-2">
              <div className="bg-linear-to-br from-blue-600 to-blue-800 p-2 rounded-lg shadow-sm">
                <Smartphone className="h-5 w-5 text-white" />
              </div>
              <div>
                <h2 className="text-lg font-bold text-gray-900">Menu</h2>
                <p className="text-xs text-gray-500">Explore our products</p>
              </div>
            </div>
            <button
              onClick={() => setMobileMenu(false)}
              className="p-2 text-gray-700 hover:text-blue-700 hover:bg-blue-50 rounded-lg transition-all duration-200"
            >
              <X size={24} />
            </button>
          </div>

          {/* Mobile Menu Content */}
          <div className="flex-1 overflow-y-auto py-2">
            {profile?.role === "admin" ? (
              <div className="px-4 py-3 mb-2 bg-blue-50 border-y border-blue-100">
                <div className="flex items-center gap-3 mb-3">
                  <div className="flex-1">
                    <p className="font-bold text-blue-900">
                      <ShinyText
                        text={`✨ Welcome ${profile.username}`}
                        speed={2}
                        delay={0}
                        color="#1E3A8A"
                        shineColor="#ffffff"
                        spread={120}
                        direction="left"
                        yoyo={false}
                        pauseOnHover={false}
                      />
                    </p>
                    <p className="text-sm text-gray-600 pl-7">
                      {profile.email}
                    </p>
                  </div>
                </div>
                <div className="flex flex-col gap-2">
                  <Button asChild className="flex items-center w-full bg-blue-700 hover:bg-blue-800 text-white">
                    <Link href="/dashboard">
                      <HomeIcon className="h-4 w-4 mr-2" />
                      Dashboard
                    </Link>
                  </Button>
                  <Button
                    variant="destructive"
                    onClick={handleLogout}
                    className="w-full"
                  >
                    Logout
                  </Button>
                </div>
              </div>
            ) : profile?.role === "user" ? (
              <div className="px-4 py-3 mb-2 bg-blue-50 border-y border-blue-100">
                <div className="flex items-center gap-3 pt-1 mb-3">
                  <div className="h-12 w-12 rounded-full bg-linear-to-br from-blue-600 to-blue-800 flex items-center justify-center">
                    <User className="h-6 w-6 text-white" />
                  </div>
                  <div className="flex-1">
                    <p className="font-bold text-blue-900">
                      <ShinyText
                        text={`✨ Welcome ${profile.username}`}
                        speed={2}
                        delay={0}
                        color="#1E3A8A"
                        shineColor="#ffffff"
                        spread={120}
                        direction="left"
                        yoyo={false}
                        pauseOnHover={false}
                      />
                    </p>
                    <p className="text-sm text-gray-600 pl-7">
                      {profile.email}
                    </p>
                  </div>
                </div>
                <Button
                  size="sm"
                  variant="destructive"
                  onClick={handleLogout}
                  className="w-full"
                >
                  Logout
                </Button>
              </div>
            ) : (
              <div className="px-4 py-3 mb-2 bg-blue-50 border-y border-blue-100">
                <ShinyText
                  text="✨ Wellcome"
                  speed={2}
                  delay={0}
                  color="#1E3A8A"
                  shineColor="#ffffff"
                  spread={120}
                  direction="left"
                  yoyo={false}
                  pauseOnHover={false}
                />
                <div className="flex items-center gap-3 mb-3">
                  <div className="h-12 w-12 rounded-full bg-linear-to-br from-blue-600 to-blue-800 flex items-center justify-center">
                    <User className="h-6 w-6 text-white" />
                  </div>
                  <div className="flex-1">
                    <p className="font-semibold text-gray-900">Welcome!</p>
                    <p className="text-sm text-gray-600">
                      Sign in to your account
                    </p>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button asChild className="flex-1 bg-blue-700 hover:bg-blue-800 text-white text-sm py-2">
                    <Link href="/login">
                      <LogIn className="h-4 w-4 mr-1" />
                      Login
                    </Link>
                  </Button>
                  <Button
                    asChild
                    variant="outline"
                    className="flex-1 text-sm py-2 border-blue-700 text-blue-700 hover:bg-blue-50"
                  >
                    <Link href="/signup">
                      <UserPlus className="h-4 w-4 mr-1" />
                      Sign Up
                    </Link>
                  </Button>
                </div>
              </div>
            )}
            <div className="px-2">
              <Link
                href="/"
                className={`flex items-center gap-3 px-4 py-3 text-base font-medium rounded-lg transition-all duration-200 ${
                  isActive("/")
                    ? "text-blue-700 bg-blue-50 font-semibold"
                    : "text-gray-700 hover:text-blue-700 hover:bg-blue-50"
                }`}
                onClick={() => setMobileMenu(false)}
              >
                <Home className="h-5 w-5" />
                Home
              </Link>

              {/* Products Section */}
              <div className="mt-1">
                <div className="px-4 py-2">
                  <p
                    className={`text-xs font-semibold uppercase tracking-wide ${
                      isActive("/products") ? "text-blue-700" : "text-gray-500"
                    }`}
                  >
                    Products
                  </p>
                </div>
                <Link
                  href="/products"
                  className={`flex items-center gap-3 px-4 py-3 text-base rounded-lg transition-all duration-200 ${
                    pathname === "/products"
                      ? "text-blue-700 bg-blue-50 font-semibold"
                      : "text-gray-700 hover:text-blue-700 hover:bg-blue-50"
                  }`}
                  onClick={() => setMobileMenu(false)}
                >
                  <Phone className="h-5 w-5" />
                  All Products
                </Link>
                <Link
                  href="/products/accessories"
                  className={`flex items-center gap-3 px-4 py-3 text-base rounded-lg transition-all duration-200 ${
                    pathname === "/products/accessories"
                      ? "text-blue-700 bg-blue-50 font-semibold"
                      : "text-gray-700 hover:text-blue-700 hover:bg-blue-50"
                  }`}
                  onClick={() => setMobileMenu(false)}
                >
                  <Headphones className="h-5 w-5" />
                  Accessories
                </Link>
              </div>

              <Link
                href="/about"
                className={`flex items-center gap-3 px-4 py-3 mt-1 text-base font-medium rounded-lg transition-all duration-200 ${
                  isActive("/about")
                    ? "text-blue-700 bg-blue-50 font-semibold"
                    : "text-gray-700 hover:text-blue-700 hover:bg-blue-50"
                }`}
                onClick={() => setMobileMenu(false)}
              >
                <Info className="h-5 w-5" />
                About Us
              </Link>

              <Link
                href="/contact"
                className={`flex items-center gap-3 px-4 py-3 text-base font-medium rounded-lg transition-all duration-200 ${
                  isActive("/contact")
                    ? "text-blue-700 bg-blue-50 font-semibold"
                    : "text-gray-700 hover:text-blue-700 hover:bg-blue-50"
                }`}
                onClick={() => setMobileMenu(false)}
              >
                <Mail className="h-5 w-5" />
                Contact Us
              </Link>
            </div>
          </div>

          {/* Mobile Menu Footer */}
          <div className="border-t border-gray-200 p-4 space-y-2 bg-gray-50">
            <Link
              href="/orders"
              className="flex items-center justify-between px-4 py-2.5 text-base text-gray-700 hover:text-blue-700 hover:bg-white rounded-lg transition-all duration-200 border border-gray-200"
              onClick={() => setMobileMenu(false)}
            >
              <div className="flex items-center gap-2">
                <Package className="h-5 w-5" />
                <span>My Orders</span>
              </div>
            </Link>
            <div className="pt-2 border-t border-gray-300">
              <p className="text-xs text-center text-gray-500">
                Need help?{" "}
                <Link href="/support" className="text-blue-700 font-medium">
                  Contact Support
                </Link>
              </p>
            </div>
          </div>
        </div>
      </aside>

      {/* Spacer to prevent content from going under fixed navbar */}
      <div className="h-20 sm:h-22 lg:h-24" />
    </>
  );
}
