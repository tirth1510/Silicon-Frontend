"use client";

import { useState, useEffect } from "react";
import {
  ShoppingCart,
  Search,
  Menu,
  X,
  User,
  ChevronDown,
  Smartphone,
  Heart,
  Package,
  LogIn,
  UserPlus,
  Home,
  Phone,
  Headphones,
  Info,
  Mail
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

export default function Navbar() {
  const [mobileMenu, setMobileMenu] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

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
    console.log("Searching for:", searchQuery);
    // Add your search logic here
  };

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-50 w-full bg-white/98 backdrop-blur-sm transition-all duration-300 ${scrolled ? "shadow-lg" : "shadow-md"
          }`}
      >
        {/* Main Navbar */}
        <nav className="w-full border-b border-gray-100">
          <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-8">
            <div className="flex items-center justify-between h-14 sm:h-16 lg:h-18">
              {/* LEFT: Brand Logo */}
              <div className="flex items-center shrink-0">
                <Link href="/" className="flex items-center gap-1.5 sm:gap-2 group">
                  <div className="bg-linear-to-br from-blue-600 to-blue-800 p-1.5 sm:p-2 rounded-lg shadow-sm group-hover:shadow-md transition-all duration-300 group-hover:scale-105">
                    <Smartphone className="h-4 w-4 sm:h-5 sm:w-5 lg:h-6 lg:w-6 text-white" />
                  </div>
                  <div className="flex flex-col">
                    <span className="text-base sm:text-lg lg:text-2xl font-bold text-gray-900 tracking-tight">
                      Silicon
                    </span>
                    <span className="hidden xs:block text-[9px] sm:text-[10px] lg:text-xs text-gray-500 -mt-0.5 lg:-mt-1 tracking-wide">
                      Smart Devices
                    </span>
                  </div>
                </Link>
              </div>

              {/* CENTER: Navigation Menu (Desktop & Tablet) */}
              <div className="hidden md:flex items-center space-x-1 lg:space-x-2">
                <Link
                  href="/"
                  className="px-2 lg:px-4 py-2 text-sm lg:text-base font-medium text-gray-700 hover:text-blue-700 hover:bg-blue-50 rounded-lg transition-all duration-200"
                >
                  Home
                </Link>

                <DropdownMenu>
                  <DropdownMenuTrigger className="flex items-center gap-1 px-2 lg:px-4 py-2 text-sm lg:text-base font-medium text-gray-700 hover:text-blue-700 hover:bg-blue-50 rounded-lg transition-all duration-200 outline-none">
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
                      <Smartphone className="h-4 w-4 mr-2" />
                      <Link href="/products/phones" className="flex-1">
                        Smartphones
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem className="cursor-pointer py-2.5">
                      <Headphones className="h-4 w-4 mr-2" />
                      <Link href="/products/accessories" className="flex-1">
                        Accessories
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem className="cursor-pointer py-2.5 text-blue-700 font-medium">
                      <Link href="/products/new" className="w-full">
                        ✨ New Arrivals
                      </Link>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>

                <Link
                  href="/about"
                  className="px-2 lg:px-4 py-2 text-sm lg:text-base font-medium text-gray-700 hover:text-blue-700 hover:bg-blue-50 rounded-lg transition-all duration-200"
                >
                  About
                </Link>

                <Link
                  href="/contact"
                  className="px-2 lg:px-4 py-2 text-sm lg:text-base font-medium text-gray-700 hover:text-blue-700 hover:bg-blue-50 rounded-lg transition-all duration-200"
                >
                  Contact
                </Link>
              </div>

              {/* RIGHT: Actions */}
              <div className="flex items-center gap-1 sm:gap-2 lg:gap-3">
                {/* Search - Desktop */}
                <form onSubmit={handleSearch} className="hidden lg:block">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" size={18} />
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
                  className={`lg:hidden p-2 rounded-lg transition-all duration-200 ${searchOpen ? "bg-blue-700 text-white" : "text-gray-700 hover:text-blue-700 hover:bg-blue-50"
                    }`}
                  aria-label="Toggle search"
                >
                  {searchOpen ? <X size={18} className="sm:w-5 sm:h-5" /> : <Search size={18} className="sm:w-5 sm:h-5" />}
                </button>

                {/* Wishlist - Hidden on smallest screens */}
                <Link
                  href="/wishlist"
                  className="hidden sm:flex p-2 text-gray-700 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all duration-200 relative"
                  aria-label="Wishlist"
                >
                  <Heart size={20} className="lg:w-6 lg:h-6" />
                  <span className="absolute -top-1 -right-1 h-4 w-4 flex items-center justify-center text-[10px] font-bold bg-red-600 text-white rounded-full">
                    3
                  </span>
                </Link>

                {/* Cart - Always visible */}
                <Link
                  href="/cart"
                  className="relative p-2 text-gray-700 hover:text-blue-700 hover:bg-blue-50 rounded-lg transition-all duration-200"
                  aria-label="Shopping cart"
                >
                  <ShoppingCart size={18} className="sm:w-5 sm:h-5 lg:w-6 lg:h-6" />
                  <span className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center text-[10px] sm:text-xs font-bold bg-blue-700 text-white rounded-full">
                    2
                  </span>
                </Link>

                {/* User Menu - Desktop & Tablet */}
                <div className="hidden sm:block">
                  <DropdownMenu>
                    <DropdownMenuTrigger className="flex items-center gap-1.5 px-2 sm:px-3 lg:px-4 py-2 text-sm lg:text-base font-medium text-white bg-blue-700 hover:bg-blue-800 rounded-lg transition-all duration-200 outline-none shadow-md hover:shadow-lg">
                      <User size={16} className="lg:w-5 lg:h-5" />
                      <span className="hidden md:inline">Account</span>
                      <ChevronDown className="h-3 w-3 lg:h-4 lg:w-4" />
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className="w-48 mt-2" align="end">
                      <DropdownMenuItem className="cursor-pointer py-2.5">
                        <LogIn className="h-4 w-4 mr-2" />
                        Login
                      </DropdownMenuItem>
                      <DropdownMenuItem className="cursor-pointer py-2.5">
                        <UserPlus className="h-4 w-4 mr-2" />
                        Sign Up
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem className="cursor-pointer py-2.5">
                        <Package className="h-4 w-4 mr-2" />
                        My Orders
                      </DropdownMenuItem>
                      <DropdownMenuItem className="cursor-pointer py-2.5">
                        <Heart className="h-4 w-4 mr-2" />
                        Wishlist
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
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
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" size={18} />
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
        className={`fixed top-0 right-0 h-full w-[85%] max-w-sm bg-white shadow-2xl z-50 md:hidden transform transition-transform duration-300 ease-out ${mobileMenu ? "translate-x-0" : "translate-x-full"
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
            {/* User Section - Mobile Only */}
            <div className="px-4 py-3 mb-2 bg-blue-50 border-y border-blue-100">
              <div className="flex items-center gap-3 mb-3">
                <div className="h-12 w-12 rounded-full bg-linear-to-br from-blue-600 to-blue-800 flex items-center justify-center">
                  <User className="h-6 w-6 text-white" />
                </div>
                <div className="flex-1">
                  <p className="font-semibold text-gray-900">Welcome!</p>
                  <p className="text-sm text-gray-600">Sign in to your account</p>
                </div>
              </div>
              <div className="flex gap-2">
                <Button className="flex-1 bg-blue-700 hover:bg-blue-800 text-white text-sm py-2">
                  <LogIn className="h-4 w-4 mr-1" />
                  Login
                </Button>
                <Button variant="outline" className="flex-1 text-sm py-2 border-blue-700 text-blue-700 hover:bg-blue-50">
                  <UserPlus className="h-4 w-4 mr-1" />
                  Sign Up
                </Button>
              </div>
            </div>

            {/* Navigation Links */}
            <div className="px-2">
              <Link
                href="/"
                className="flex items-center gap-3 px-4 py-3 text-base font-medium text-gray-700 hover:text-blue-700 hover:bg-blue-50 rounded-lg transition-all duration-200"
                onClick={() => setMobileMenu(false)}
              >
                <Home className="h-5 w-5" />
                Home
              </Link>

              {/* Products Section */}
              <div className="mt-1">
                <div className="px-4 py-2">
                  <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
                    Products
                  </p>
                </div>
                <Link
                  href="/products"
                  className="flex items-center gap-3 px-4 py-3 text-base text-gray-700 hover:text-blue-700 hover:bg-blue-50 rounded-lg transition-all duration-200"
                  onClick={() => setMobileMenu(false)}
                >
                  <Phone className="h-5 w-5" />
                  All Products
                </Link>
                <Link
                  href="/products/phones"
                  className="flex items-center gap-3 px-4 py-3 text-base text-gray-700 hover:text-blue-700 hover:bg-blue-50 rounded-lg transition-all duration-200"
                  onClick={() => setMobileMenu(false)}
                >
                  <Smartphone className="h-5 w-5" />
                  Smartphones
                </Link>
                <Link
                  href="/products/accessories"
                  className="flex items-center gap-3 px-4 py-3 text-base text-gray-700 hover:text-blue-700 hover:bg-blue-50 rounded-lg transition-all duration-200"
                  onClick={() => setMobileMenu(false)}
                >
                  <Headphones className="h-5 w-5" />
                  Accessories
                </Link>
                <Link
                  href="/products/new"
                  className="flex items-center gap-3 px-4 py-3 text-base text-blue-700 font-medium bg-blue-50 rounded-lg transition-all duration-200"
                  onClick={() => setMobileMenu(false)}
                >
                  ✨ New Arrivals
                </Link>
              </div>

              <Link
                href="/about"
                className="flex items-center gap-3 px-4 py-3 mt-1 text-base font-medium text-gray-700 hover:text-blue-700 hover:bg-blue-50 rounded-lg transition-all duration-200"
                onClick={() => setMobileMenu(false)}
              >
                <Info className="h-5 w-5" />
                About Us
              </Link>

              <Link
                href="/contact"
                className="flex items-center gap-3 px-4 py-3 text-base font-medium text-gray-700 hover:text-blue-700 hover:bg-blue-50 rounded-lg transition-all duration-200"
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
              href="/wishlist"
              className="flex items-center justify-between px-4 py-2.5 text-base text-gray-700 hover:text-red-600 hover:bg-white rounded-lg transition-all duration-200 border border-gray-200"
              onClick={() => setMobileMenu(false)}
            >
              <div className="flex items-center gap-2">
                <Heart className="h-5 w-5" />
                <span>My Wishlist</span>
              </div>
              <span className="text-xs bg-red-600 text-white px-2 py-0.5 rounded-full">3</span>
            </Link>
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
                Need help? <Link href="/support" className="text-blue-700 font-medium">Contact Support</Link>
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
