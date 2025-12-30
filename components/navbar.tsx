"use client";

import { useState } from "react";
import { ShoppingCart, Search, Menu, X } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";

export default function Navbar() {
  const [mobileMenu, setMobileMenu] = useState(false);

  return (
    <header className="fixed top-0 left-0 right-0 z-50 w-full bg-white shadow-md">
      <nav className="flex items-center justify-between h-20 px-4 md:px-10 border-b border-gray-300">
        
        <div className="flex items-center w-1/4">
          <h1 className="text-3xl font-bold text-blue-900 cursor-pointer">
            MyBrand
          </h1>
        </div>

        {/* CENTER: Menu Items */}
        <div className="hidden md:flex items-center justify-center gap-8 w-1/2 text-lg font-medium">
          <a href="#" className="hover:text-blue-700 transition">Home</a>

          <DropdownMenu>
            <DropdownMenuTrigger className="cursor-pointer hover:text-blue-700 transition">
              Products
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-44">
              <DropdownMenuItem>Products</DropdownMenuItem>
              <DropdownMenuItem>Accessories</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <a href="#" className="hover:text-blue-700 transition">About</a>
          <a href="#" className="hover:text-blue-700 transition">Contact</a>
        </div>

        {/* RIGHT: Search + Cart + Login */}
        <div className="flex items-center justify-end gap-3 w-1/4">
          <div className="relative hidden md:flex">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input
              type="text"
              placeholder="Search..."
              className="pl-10 pr-4 py-2 border rounded-lg w-48 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <Button className="py-2 px-4 md:py-3 md:px-8 bg-blue-700 text-white font-bold text-sm md:text-lg hover:bg-blue-500 shadow-md hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200">
            Login
          </Button>

          <button className="relative">
            <ShoppingCart size={22} />
            <span className="absolute -top-1 -right-1 text-xs bg-blue-900 text-white rounded-full px-1">
              2
            </span>
          </button>

          {/* Mobile Menu Button */}
          <button className="md:hidden ml-2" onClick={() => setMobileMenu(!mobileMenu)}>
            {mobileMenu ? <X size={28} /> : <Menu size={28} />}
          </button>
        </div>
      </nav>

      {/* Mobile Menu */}
      {mobileMenu && (
        <div className="md:hidden w-full bg-white border-t border-gray-300 px-4 py-3 flex flex-col gap-2 shadow-md">
          <a href="#" className="py-2 hover:bg-gray-100 rounded">Home</a>

          <DropdownMenu>
            <DropdownMenuTrigger className="py-2 w-full text-left hover:bg-gray-100 rounded">
              Products
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-full">
              <DropdownMenuItem>Products</DropdownMenuItem>
              <DropdownMenuItem>Accessories</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <a href="#" className="py-2 hover:bg-gray-100 rounded">About</a>
          <a href="#" className="py-2 hover:bg-gray-100 rounded">Contact</a>

          <div className="flex flex-col md:flex-row items-center gap-2 mt-2">
            <input
              type="text"
              placeholder="Search..."
              className="flex-1 pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <Button className="py-3 px-8 bg-blue-900 text-white font-bold text-lg hover:bg-blue-800 shadow-md hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200">
              Login
            </Button>
          </div>
        </div>
      )}
    </header>
  );
}
