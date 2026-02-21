"use client";

import React, { useState } from "react";
import {
    Download,
    TrendingUp,
    TrendingDown,
    Calendar,
    IndianRupee,
    ShoppingCart,
    Users,
    ArrowUpRight,
    PieChart
} from "lucide-react";

export default function ReportsPage() {
    const [timeRange, setTimeRange] = useState("30");
    const [loading, setLoading] = useState(true);
    const [stats, setStats] = useState({
        totalRevenue: 0,
        totalOrders: 0,
        revenueData: Array(12).fill(0),
        categoryData: [] as { name: string; value: number; color: string }[]
    });

    React.useEffect(() => {
        const fetchReportData = async () => {
            const { collection, getDocs } = await import("firebase/firestore");
            const { db } = await import("@/lib/firebase");

            try {
                const ordersSnap = await getDocs(collection(db, "orders"));
                let revenue = 0;
                let orderCount = 0;
                const monthlyRevenue = Array(12).fill(0);
                const categoryCounts: Record<string, number> = {};

                ordersSnap.forEach(doc => {
                    const data = doc.data();
                    const total = Number(data.total) || 0;
                    revenue += total;
                    orderCount++;

                    // Monthly Revenue
                    if (data.createdAt && typeof data.createdAt.toDate === 'function') {
                        const date = data.createdAt.toDate();
                        if (!isNaN(date.getTime())) {
                            const month = date.getMonth(); // 0-11
                            monthlyRevenue[month] += total;
                        } else {
                            console.warn(`Invalid date for order ${doc.id}`);
                        }
                    } else {
                        console.warn(`Missing or invalid createdAt for order ${doc.id}`);
                    }

                    // Category Distribution
                    const items = data.items || [];
                    items.forEach((item: any) => {
                        // Infer category from item data or default (since we might not store category on order item directly)
                        // This assumes item might have a category field, otherwise mocks or general bucket
                        const cat = item.category || "General";
                        categoryCounts[cat] = (categoryCounts[cat] || 0) + 1;
                    });
                });

                // Process Category Data
                const totalItems = Object.values(categoryCounts).reduce((a, b) => a + b, 0);
                const processedCategories = Object.keys(categoryCounts).map((key, index) => ({
                    name: key,
                    value: totalItems ? Math.round((categoryCounts[key] / totalItems) * 100) : 0,
                    color: index === 0 ? "bg-black" : index === 1 ? "bg-gray-600" : index === 2 ? "bg-gray-400" : "bg-gray-200"
                })).sort((a, b) => b.value - a.value).slice(0, 4);

                setStats({
                    totalRevenue: revenue,
                    totalOrders: orderCount,
                    revenueData: monthlyRevenue,
                    categoryData: processedCategories.length > 0 ? processedCategories : [
                        { name: "General", value: 100, color: "bg-black" }
                    ]
                });
                setLoading(false);
            } catch (error) {
                console.error("Error fetching reports:", error);
                setLoading(false);
            }
        };

        fetchReportData();
    }, []);

    const revenueData = stats.revenueData;
    const categories = stats.categoryData;

    return (
        <div className="space-y-10 pb-20">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                <div>
                    <h2 className="text-sm font-bold tracking-[0.2em] text-gray-400 mb-1 uppercase">Analytics</h2>
                    <h1 className="text-3xl font-bold tracking-tight">BUSINESS INTELLIGENCE</h1>
                </div>

                <div className="flex items-center space-x-4">
                    <select
                        value={timeRange}
                        onChange={(e) => setTimeRange(e.target.value)}
                        className="bg-white border border-gray-100 text-sm font-bold rounded-xl px-4 py-3 outline-none focus:border-black transition-all"
                    >
                        <option value="30">Year to Date (2025-26)</option>
                    </select>
                    <button className="bg-black text-white px-6 py-3 rounded-xl font-bold text-sm tracking-widest flex items-center hover:bg-gray-900 transition-all">
                        <Download size={16} className="mr-2" />
                        EXPORT
                    </button>
                </div>
            </div>

            {/* Quick Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-black text-white p-8 rounded-3xl relative overflow-hidden group">
                    <div className="relative z-10">
                        <div className="flex justify-between items-start mb-4">
                            <div className="p-3 bg-white/10 rounded-xl">
                                <IndianRupee size={20} />
                            </div>
                            <div className="flex items-center text-green-400 text-xs font-bold bg-green-400/10 px-2 py-1 rounded-lg">
                                <ArrowUpRight size={12} className="mr-1" />
                                Real-time
                            </div>
                        </div>
                        <p className="text-gray-400 text-xs font-bold uppercase tracking-widest mb-1">Total Revenue</p>
                        <h3 className="text-3xl font-black tracking-tight">
                            {loading ? "..." : `₹${stats.totalRevenue.toLocaleString()}`}
                        </h3>
                    </div>
                    <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-white/5 rounded-full blur-3xl group-hover:bg-white/10 transition-all" />
                </div>

                <div className="bg-white border border-gray-100 p-8 rounded-3xl relative overflow-hidden group hover:border-black transition-all">
                    <div className="flex justify-between items-start mb-4">
                        <div className="p-3 bg-gray-50 rounded-xl group-hover:bg-black group-hover:text-white transition-all">
                            <ShoppingCart size={20} />
                        </div>
                    </div>
                    <p className="text-gray-400 text-xs font-bold uppercase tracking-widest mb-1">Total Orders</p>
                    <h3 className="text-3xl font-black tracking-tight">{loading ? "..." : stats.totalOrders}</h3>
                </div>

                <div className="bg-white border border-gray-100 p-8 rounded-3xl relative overflow-hidden group hover:border-black transition-all">
                    <div className="flex justify-between items-start mb-4">
                        <div className="p-3 bg-gray-50 rounded-xl group-hover:bg-black group-hover:text-white transition-all">
                            <Users size={20} />
                        </div>
                    </div>
                    <p className="text-gray-400 text-xs font-bold uppercase tracking-widest mb-1">Avg. Order Value</p>
                    <h3 className="text-3xl font-black tracking-tight">
                        {loading ? "..." : `₹${stats.totalOrders > 0 ? Math.round(stats.totalRevenue / stats.totalOrders).toLocaleString() : 0}`}
                    </h3>
                </div>
            </div>

            {/* Charts Section */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Revenue Growth Chart */}
                <div className="lg:col-span-2 bg-white border border-gray-100 p-8 rounded-3xl">
                    <div className="flex justify-between items-center mb-10">
                        <h3 className="text-xs font-black tracking-widest text-gray-400 uppercase flex items-center">
                            <TrendingUp size={16} className="mr-2 text-black" />
                            Revenue Statistics (2025-26)
                        </h3>
                    </div>

                    {/* Custom CSS Bar Chart */}
                    <div className="h-64 relative flex">
                        {/* Chart Area */}
                        <div className="flex-1 relative">
                            {/* Horizontal Grid Lines */}
                            <div className="absolute inset-0 flex flex-col justify-between pointer-events-none">
                                {[0, 1, 2, 3, 4].map((i) => (
                                    <div key={i} className="w-full border-t border-gray-100"></div>
                                ))}
                            </div>

                            {/* Bar Chart */}
                            <div className="h-full flex items-end justify-between space-x-2 relative z-10">
                                {revenueData.map((revenue, i) => {
                                    // Scale height relative to max revenue (avoid division by zero)
                                    const maxRev = Math.max(...revenueData, 10000);
                                    const heightPercent = (revenue / maxRev) * 100;

                                    return (
                                        <div key={i} className="flex-1 flex flex-col justify-end group cursor-pointer">
                                            <div
                                                className="w-full bg-black rounded-t-lg group-hover:shadow-lg transition-all relative"
                                                style={{ height: `${heightPercent}%`, minHeight: '4px' }}
                                            >
                                                <div className="absolute -top-10 left-1/2 -translate-x-1/2 bg-black text-white text-[10px] font-bold py-1 px-2 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-10">
                                                    ₹{revenue.toLocaleString()}
                                                </div>
                                            </div>
                                            {/* <div className="h-1 w-full bg-gray-100 mt-2 rounded-full"></div> */}
                                            <p className="text-center text-[8px] md:text-[10px] text-black font-bold mt-2 uppercase">{["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"][i]}</p>
                                        </div>
                                    )
                                })}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Category Distribution */}
                <div className="bg-gray-50 border border-gray-100 p-8 rounded-3xl">
                    <h3 className="text-xs font-black tracking-widest text-gray-400 uppercase mb-8 flex items-center">
                        <PieChart size={16} className="mr-2 text-black" />
                        Sales by Category
                    </h3>

                    <div className="space-y-6">
                        {categories.map((cat, i) => (
                            <div key={i}>
                                <div className="flex justify-between items-end mb-2">
                                    <span className="text-sm font-bold">{cat.name}</span>
                                    <span className="text-xs font-bold text-gray-500">{cat.value}%</span>
                                </div>
                                <div className="w-full h-3 bg-gray-200 rounded-full overflow-hidden">
                                    <div
                                        className={`h-full ${cat.color}`}
                                        style={{ width: `${cat.value}%` }}
                                    ></div>
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="mt-10 p-6 bg-white rounded-2xl border border-gray-100">
                        <p className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-2">Insight</p>
                        <p className="text-sm font-medium leading-relaxed">
                            <span className="font-bold text-black">Sneakers</span> remain the top-performing category, contributing to <span className="font-bold text-black">45%</span> of total revenue this month. Consider expanding the "Velocity" line.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
