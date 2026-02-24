"use client";

import { useEffect, useState } from "react";
import { db } from "@/lib/firebase";
import { collection, query, limit, onSnapshot, orderBy, Timestamp } from "firebase/firestore";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
    Package,
    ShoppingCart,
    Users,
    IndianRupee,
    TrendingUp,
    Clock,
    AlertCircle
} from "lucide-react";

interface Order {
    id: string;
    customerName?: string;
    total?: number;
    status?: string;
    createdAt?: Timestamp;
    date?: string;
}

export default function DashboardPage() {
    const router = useRouter();
    const [recentOrders, setRecentOrders] = useState<Order[]>([]);
    const [lastUpdated, setLastUpdated] = useState<string>("Just now");
    const [error, setError] = useState<string | null>(null);
    const [stats, setStats] = useState({
        products: 42,
        orders: 128,
        users: 856,
        revenue: "₹1,24,500",
        growth: "+12.5%"
    });

    useEffect(() => {
        // Real-time listener for recent orders
        const q = query(collection(db, "orders"), orderBy("createdAt", "desc"), limit(5));
        const unsubscribe = onSnapshot(q, (snapshot) => {
            const ordersData = snapshot.docs.map(doc => {
                const data = doc.data();
                return {
                    id: doc.id,
                    ...data,
                    total: Number(data.total) || 0,
                } as Order;
            });
            setRecentOrders(ordersData);
            setLastUpdated(new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }));
            setError(null);
        }, (err) => {
            console.error("Dashboard Sync Error:", err);
            setError("Unable to sync live data");
        });

        // Fetch Stats
        let mounted = true;
        const fetchStats = async () => {
            const { getDocs } = await import("firebase/firestore");

            try {
                const [productsSnap, usersSnap, ordersSnap] = await Promise.all([
                    getDocs(collection(db, "products")),
                    getDocs(collection(db, "users")),
                    getDocs(collection(db, "orders"))
                ]);

                if (!mounted) return;

                const totalRevenue = ordersSnap.docs.reduce((acc, doc) => {
                    const d = doc.data();
                    const val = Number(d.total) || 0;
                    return acc + val;
                }, 0);

                setStats(prev => ({
                    ...prev,
                    products: productsSnap.size,
                    users: usersSnap.size,
                    orders: ordersSnap.size,
                    revenue: "₹" + totalRevenue.toLocaleString("en-IN")
                }));

            } catch (e) {
                console.error("Stats fetch error:", e);
            }
        };
        fetchStats();

        return () => {
            mounted = false;
            unsubscribe();
        };
    }, []);

    const KPI_CARDS = [
        { title: "Total Products", value: stats.products, icon: Package },
        { title: "Active Orders", value: stats.orders, icon: ShoppingCart },
        { title: "Registered Users", value: stats.users, icon: Users },
        { title: "Total Revenue", value: stats.revenue, icon: IndianRupee },
    ];

    return (
        <div className="space-y-10">
            {/* Header */}
            <div className="flex justify-between items-end">
                <div>
                    <h2 className="text-sm font-bold tracking-[0.2em] text-gray-400 mb-1 uppercase">Overview</h2>
                    <h1 className="text-3xl font-bold tracking-tight">DASHBOARD</h1>
                </div>
                <div className="flex items-center space-x-2 text-xs font-medium text-gray-500 bg-gray-100 px-4 py-2 rounded-full">
                    <Clock size={14} />
                    <span>Last updated: {lastUpdated}</span>
                </div>
            </div>

            {error && (
                <div className="bg-red-50 border border-red-100 rounded-2xl p-4 flex items-center space-x-3 text-red-800 animate-in fade-in slide-in-from-top-2 duration-300">
                    <AlertCircle size={18} />
                    <span className="text-sm font-medium">{error}</span>
                </div>
            )}

            {/* KPI Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {KPI_CARDS.map((card, i) => {
                    const Icon = card.icon;
                    return (
                        <div key={i} className="bg-white border border-gray-100 p-8 rounded-2xl hover:border-black transition-all group">
                            <div className="flex justify-between items-start mb-6">
                                <div className="p-3 bg-gray-50 rounded-xl group-hover:bg-black group-hover:text-white transition-all">
                                    <Icon size={24} />
                                </div>
                                <div className="flex items-center text-green-500 text-xs font-bold">
                                    <TrendingUp size={14} className="mr-1" />
                                    <span>{stats.growth || "N/A"}</span>
                                </div>
                            </div>
                            <p className="text-gray-400 text-xs font-bold uppercase tracking-widest mb-1">{card.title}</p>
                            <h3 className="text-2xl font-black">{card.value}</h3>
                        </div>
                    );
                })}
            </div>

            {/* Middle Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Revenue Projection Card (Big) */}
                <div className="lg:col-span-2 bg-black text-white p-6 md:p-10 rounded-3xl relative overflow-hidden min-h-[300px]">
                    <div className="relative z-10 h-full flex flex-col justify-between">
                        <div>
                            <h3 className="text-2xl md:text-4xl font-black tracking-tighter mb-2">QUARTERLY GROWTH</h3>
                            <p className="text-gray-400 font-medium text-sm md:text-base max-w-xs">Revenue is trending upward compared to last season's projection.</p>
                        </div>
                        <div className="flex flex-col md:flex-row items-start md:items-end justify-between mt-8 md:mt-12 gap-4">
                            <div className="flex flex-wrap gap-3 md:gap-4">
                                <div className="bg-white/10 px-4 md:px-6 py-3 md:py-4 rounded-2xl backdrop-blur-sm">
                                    <p className="text-gray-500 text-[10px] font-black uppercase tracking-widest mb-1">Status</p>
                                    <p className="text-xs md:text-sm font-bold">Outperforming</p>
                                </div>
                            </div>
                            <button className="w-full md:w-auto bg-white text-black px-6 md:px-10 py-3 md:py-4 rounded-full font-bold text-xs md:text-sm tracking-widest hover:bg-gray-200 transition-all">
                                VIEW REPORT
                            </button>
                        </div>
                    </div>
                    {/* Visual Decoration */}
                    <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -mr-20 -mt-20 blur-3xl"></div>
                </div>

                {/* Quick Actions / Recent Activity */}
                <div className="bg-gray-50 p-6 md:p-8 rounded-3xl border border-gray-100">
                    <h3 className="text-xs md:text-sm font-black tracking-widest text-gray-400 uppercase mb-4 md:mb-6">QUICK ACTIONS</h3>
                    <div className="space-y-3 md:space-y-4">
                        <button
                            onClick={() => router.push('/admin/cms')}
                            className="w-full flex items-center justify-between p-3 md:p-4 bg-white rounded-2xl border border-gray-100 hover:border-black transition-all group"
                        >
                            <span className="font-bold text-xs md:text-sm group-hover:text-black">Update Hero Banner</span>
                            <Package size={16} className="group-hover:scale-110 transition-transform" />
                        </button>
                        <button
                            onClick={() => router.push('/admin/products')}
                            className="w-full flex items-center justify-between p-3 md:p-4 bg-white rounded-2xl border border-gray-100 hover:border-black transition-all group"
                        >
                            <span className="font-bold text-xs md:text-sm group-hover:text-black">Bulk Inventory Check</span>
                            <ShoppingCart size={16} className="group-hover:scale-110 transition-transform" />
                        </button>
                        <button
                            onClick={() => router.push('/admin/reports')}
                            className="w-full flex items-center justify-between p-3 md:p-4 bg-white rounded-2xl border border-gray-100 hover:border-black transition-all group"
                        >
                            <span className="font-bold text-xs md:text-sm group-hover:text-black">Generate User Report</span>
                            <Users size={16} className="group-hover:scale-110 transition-transform" />
                        </button>
                    </div>
                </div>
            </div>

            {/* Recent Orders Table */}
            <div className="space-y-6">
                <div className="flex justify-between items-center">
                    <h3 className="text-sm font-black tracking-widest text-gray-400 uppercase">RECENT TRANSACTIONS</h3>
                    <Link href="/admin/orders" className="text-xs font-bold underline">VIEW ALL ORDERS</Link>
                </div>
                <div className="bg-white border border-gray-100 rounded-3xl overflow-hidden">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="bg-gray-50 border-b border-gray-100">
                                <th className="px-8 py-5 text-xs font-black text-gray-400 uppercase tracking-widest">Order ID</th>
                                <th className="px-8 py-5 text-xs font-black text-gray-400 uppercase tracking-widest">Customer</th>
                                <th className="px-8 py-5 text-xs font-black text-gray-400 uppercase tracking-widest">Date</th>
                                <th className="px-8 py-5 text-xs font-black text-gray-400 uppercase tracking-widest">Amount</th>
                                <th className="px-8 py-5 text-xs font-black text-gray-400 uppercase tracking-widest">Status</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {recentOrders.length > 0 ? (
                                recentOrders.map((order) => (
                                    <tr key={order.id} className="hover:bg-gray-50 transition-colors">
                                        <td className="px-8 py-6 font-bold text-sm">#{order.id.slice(0, 8).toUpperCase()}</td>
                                        <td className="px-8 py-6 text-sm">{order.customerName || "Anonymous"}</td>
                                        <td className="px-8 py-6 text-sm text-gray-500">
                                            {order.createdAt?.toDate ? order.createdAt.toDate().toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) : (order.date || "Just now")}
                                        </td>
                                        <td className="px-8 py-6 font-bold text-sm">₹{order.total?.toLocaleString() || "0"}</td>
                                        <td className="px-8 py-6">
                                            <span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest ${order.status?.toUpperCase() === 'PAID' ? "bg-black text-white" : "border border-gray-200 text-gray-400"
                                                }`}>
                                                {order.status?.toUpperCase() || "PENDING"}
                                            </span>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan={5} className="px-8 py-10 text-center text-sm text-gray-400 font-medium">
                                        No recent orders
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
