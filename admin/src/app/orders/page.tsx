"use client";

import React, { useEffect, useState } from "react";
import { db } from "@/lib/firebase";
import { collection, query, orderBy, onSnapshot, where } from "firebase/firestore";
import { Search, Filter, Eye, Clock, CheckCircle, Truck, Package, XCircle } from "lucide-react";
import Link from "next/link";

interface Order {
    id: string;
    customerName: string;
    customerEmail: string;
    total: number;
    status: "pending" | "processing" | "shipped" | "delivered" | "cancelled";
    createdAt: any;
    itemsCount: number;
}

const STATUS_CONFIG = {
    pending: { color: "bg-yellow-100 text-yellow-700", icon: Clock },
    processing: { color: "bg-blue-100 text-blue-700", icon: Package },
    shipped: { color: "bg-purple-100 text-purple-700", icon: Truck },
    delivered: { color: "bg-green-100 text-green-700", icon: CheckCircle },
    cancelled: { color: "bg-red-100 text-red-700", icon: XCircle },
};

export default function OrdersListPage() {
    const [orders, setOrders] = useState<Order[]>([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState("all");
    const [searchTerm, setSearchTerm] = useState("");

    useEffect(() => {
        let q = query(collection(db, "orders"), orderBy("createdAt", "desc"));

        if (filter !== "all") {
            q = query(collection(db, "orders"), where("status", "==", filter), orderBy("createdAt", "desc"));
        }

        const unsubscribe = onSnapshot(q, (snapshot) => {
            const ordersData = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            } as Order));
            setOrders(ordersData);
            setLoading(false);
        });

        return () => unsubscribe();
    }, [filter]);

    const filteredOrders = orders.filter(o =>
        o.customerName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        o.id.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="space-y-8">
            {/* Header */}
            <div>
                <h2 className="text-sm font-bold tracking-[0.2em] text-gray-400 mb-1 uppercase">Operations</h2>
                <h1 className="text-3xl font-bold tracking-tight">ORDER MANAGEMENT</h1>
            </div>

            {/* Filter Tabs */}
            <div className="flex flex-wrap gap-2 border-b border-gray-100 pb-1">
                {["all", "pending", "processing", "shipped", "delivered", "cancelled"].map((s) => (
                    <button
                        key={s}
                        onClick={() => setFilter(s)}
                        className={`px-6 py-3 text-xs font-black uppercase tracking-widest transition-all ${filter === s
                                ? "border-b-2 border-black text-black"
                                : "text-gray-400 hover:text-black"
                            }`}
                    >
                        {s}
                    </button>
                ))}
            </div>

            {/* Search & Actions */}
            <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1 relative">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                    <input
                        type="text"
                        placeholder="Search by Order ID or Customer Name..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full bg-white border border-gray-100 rounded-2xl py-4 pl-12 pr-4 focus:border-black outline-none transition-all text-sm shadow-sm"
                    />
                </div>
            </div>

            {/* Orders Table */}
            <div className="bg-white border border-gray-100 rounded-3xl overflow-hidden shadow-sm">
                <table className="w-full text-left">
                    <thead>
                        <tr className="bg-gray-50 border-b border-gray-100">
                            <th className="px-8 py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest">Order ID</th>
                            <th className="px-8 py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest">Customer</th>
                            <th className="px-8 py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest">Items</th>
                            <th className="px-8 py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest">Status</th>
                            <th className="px-8 py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest">Amount</th>
                            <th className="px-8 py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                        {loading ? (
                            <tr><td colSpan={6} className="px-8 py-20 text-center text-gray-400 font-medium">Synchronizing with registry...</td></tr>
                        ) : filteredOrders.length > 0 ? (
                            filteredOrders.map((order) => {
                                const StatusIcon = STATUS_CONFIG[order.status]?.icon || Clock;
                                return (
                                    <tr key={order.id} className="hover:bg-gray-50 transition-colors">
                                        <td className="px-8 py-6">
                                            <p className="font-bold text-sm uppercase tracking-tight">#{order.id.slice(0, 8)}</p>
                                            <p className="text-[10px] text-gray-400 font-medium">
                                                {order.createdAt?.toDate ? order.createdAt.toDate().toLocaleDateString() : "Pending..."}
                                            </p>
                                        </td>
                                        <td className="px-8 py-6">
                                            <p className="font-bold text-sm">{order.customerName || "Walk-in Customer"}</p>
                                            <p className="text-[10px] text-gray-400 font-medium lowercase">{order.customerEmail}</p>
                                        </td>
                                        <td className="px-8 py-6 text-sm text-gray-500">{order.itemsCount || 1} units</td>
                                        <td className="px-8 py-6">
                                            <span className={`inline-flex items-center px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest ${STATUS_CONFIG[order.status]?.color || "bg-gray-100"}`}>
                                                <StatusIcon size={12} className="mr-1.5" />
                                                {order.status}
                                            </span>
                                        </td>
                                        <td className="px-8 py-6 font-bold text-sm">₹{order.total?.toLocaleString()}</td>
                                        <td className="px-8 py-6 text-right">
                                            <Link
                                                href={`/orders/${order.id}`}
                                                className="inline-flex items-center space-x-2 text-xs font-black uppercase tracking-widest hover:text-gray-400 transition-colors"
                                            >
                                                <span>Details</span>
                                                <Eye size={14} />
                                            </Link>
                                        </td>
                                    </tr>
                                );
                            })
                        ) : (
                            <tr><td colSpan={6} className="px-8 py-20 text-center text-gray-400 font-medium">No orders found in this category.</td></tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
