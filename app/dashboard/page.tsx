"use client";

import { useEffect, useState, useRef } from "react";
import { Card } from "@/components/ui/card";
import { Spinner } from "@/components/ui/spinner";
import {
  Package,
  ShoppingBag,
  TrendingUp,
  Eye,
} from "lucide-react";
import axios from "axios";

interface DashboardStats {
  totalProducts: number;
  totalAccessories: number;
  liveSales: number;
  viewSales: number;
}

export default function Dashboard() {
  const [stats, setStats] = useState<DashboardStats>({
    totalProducts: 0,
    totalAccessories: 0,
    liveSales: 0,
    viewSales: 0,
  });
  const [loading, setLoading] = useState(true);

  // Prevent duplicate API calls in React Strict Mode
  const hasFetchedRef = useRef(false);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);

        // Fetch all data in parallel to optimize performance - ONLY ONCE
        const [productsRes, accessoriesRes, salesRes] = await Promise.all([
          // Use correct products-with-models API
          axios.get("http://localhost:5000/api/demo/products-with-models").catch(() => ({ 
            data: { success: false, data: [] } 
          })),
          // Accessories API
          axios.get("http://localhost:5000/api/accessorize/all").catch(() => ({ 
            data: { success: false, products: [] } 
          })),
          // Sales scheme API
          axios.get("http://localhost:5000/api/demo/products/scheme/all").catch(() => ({ 
            data: { success: false, data: [] } 
          })),
        ]);

        // Get products data - use count from API response
        const totalProducts = productsRes.data.count || (productsRes.data.data || []).length;

        // Get accessories data - use count from API or array length
        const totalAccessories = accessoriesRes.data.count || (accessoriesRes.data.products || accessoriesRes.data.data || []).length;

        // Get sales data from scheme API
        const salesData = salesRes.data.data || [];
        
        // Count live sales and view sales by iterating through all models
        let liveSalesCount = 0;
        let viewSalesCount = 0;

        // The API returns array of models with schem data
        salesData.forEach((model: any) => {
          const schem = model.productModelDetails?.schem || {};
          
          // Count live sales (saleProduct)
          if (schem.saleProduct === true) {
            liveSalesCount++;
          }
          
          // Count view sales (other scheme types)
          if (
            schem.tradingProduct === true ||
            schem.recommendedProduct === true ||
            schem.companyProduct === true ||
            schem.valuableProduct === true
          ) {
            viewSalesCount++;
          }
        });

        setStats({
          totalProducts,
          totalAccessories,
          liveSales: liveSalesCount,
          viewSales: viewSalesCount,
        });
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
      } finally {
        setLoading(false);
      }
    };

    // Only fetch if we haven't already fetched
    if (!hasFetchedRef.current) {
      hasFetchedRef.current = true;
      fetchDashboardData();
    }
  }, []); // Empty dependency array ensures this runs only once

  const statsCards = [
    {
      title: "Products",
      value: stats.totalProducts,
      icon: Package,
      iconBg: "bg-gradient-to-br from-blue-100 to-indigo-100",
      iconColor: "text-blue-600",
      gradient: "from-blue-500 to-indigo-600",
      link: "/dashboard/product",
    },
    {
      title: "Accessories",
      value: stats.totalAccessories,
      icon: ShoppingBag,
      iconBg: "bg-gradient-to-br from-green-100 to-emerald-100",
      iconColor: "text-green-600",
      gradient: "from-green-500 to-emerald-600",
      link: "/dashboard/accessories",
    },
    {
      title: "Live Sales",
      value: stats.liveSales,
      icon: TrendingUp,
      iconBg: "bg-gradient-to-br from-orange-100 to-red-100",
      iconColor: "text-orange-600",
      gradient: "from-orange-500 to-red-600",
      link: "/dashboard/sales/all",
    },
    {
      title: "View Sales",
      value: stats.viewSales,
      icon: Eye,
      iconBg: "bg-gradient-to-br from-indigo-100 to-purple-100",
      iconColor: "text-indigo-600",
      gradient: "from-indigo-500 to-purple-600",
      link: "/dashboard/sales/view",
    },
  ];

  if (loading) {
    return (
      <div className="min-h-full flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="relative inline-block">
            <Spinner className="w-16 h-16" />
            <div className="absolute inset-0 animate-ping opacity-20">
              <Spinner className="w-16 h-16" />
            </div>
          </div>
          <p className="mt-6 text-xl font-semibold text-gray-700">Loading Dashboard...</p>
          <p className="mt-2 text-sm text-gray-500">Fetching your data</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="flex items-center justify-between bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl p-6 border border-blue-100">
        <div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
            Dashboard
          </h1>
          <p className="text-sm text-gray-600 mt-2 flex items-center gap-2">
            <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
            Welcome back! Here&apos;s what&apos;s happening today.
          </p>
        </div>
        <button
          onClick={() => window.location.reload()}
          className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold rounded-xl hover:from-blue-700 hover:to-indigo-700 transition-all duration-300 shadow-lg hover:shadow-xl"
        >
          <svg
            className="w-5 h-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
            />
          </svg>
          Refresh
        </button>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {statsCards.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <Card
                key={index}
                onClick={() => (window.location.href = stat.link)}
                className="relative overflow-hidden bg-white border-0 shadow-xl hover:shadow-2xl transition-all duration-500 group cursor-pointer transform hover:-translate-y-2"
              >
                {/* Animated Gradient Background */}
                <div className="absolute inset-0 bg-gradient-to-br from-gray-50 to-white opacity-50" />
                <div
                  className={`absolute top-0 right-0 w-64 h-64 bg-gradient-to-br ${stat.gradient} opacity-5 rounded-full -mr-32 -mt-32 group-hover:scale-150 group-hover:opacity-10 transition-all duration-700`}
                />

                <div className="relative p-8">
                  {/* Icon with animated background */}
                  <div className="flex items-start justify-between mb-6">
                    <div
                      className={`${stat.iconBg} p-5 rounded-3xl shadow-lg group-hover:shadow-2xl group-hover:scale-110 transition-all duration-500`}
                    >
                      <Icon className={`w-10 h-10 ${stat.iconColor}`} />
                    </div>
                    
                    {/* Arrow icon */}
                    <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <svg
                        className="w-6 h-6 text-gray-400"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M9 5l7 7-7 7"
                        />
                      </svg>
                    </div>
                  </div>

                  {/* Value and Title */}
                  <div className="space-y-2">
                    <h3
                      className={`text-6xl font-black bg-gradient-to-r ${stat.gradient} bg-clip-text text-transparent transform group-hover:scale-105 transition-transform duration-300`}
                    >
                      {stat.value}
                    </h3>
                    <p className="text-base font-bold text-gray-600 tracking-wide uppercase">
                      {stat.title}
                    </p>
                  </div>

                  {/* Bottom Accent Bar */}
                  <div className="absolute bottom-0 left-0 right-0">
                    <div
                      className={`h-2 bg-gradient-to-r ${stat.gradient} transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left`}
                    />
                  </div>
                </div>
              </Card>
            );
          })}
      </div>

      {/* Info Section */}
      <div className="p-6 bg-white rounded-2xl shadow-lg border border-blue-100">
        <div className="flex items-center gap-4 mb-4">
          <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center">
            <svg
              className="w-6 h-6 text-white"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </div>
          <h3 className="text-2xl font-bold text-gray-900">Quick Info</h3>
        </div>
        <p className="text-gray-600 text-lg leading-relaxed">
          Click on any card above to navigate to the respective section. The data is fetched in real-time from your database and updated automatically.
        </p>
      </div>
    </div>
  );
}
