"use client";

import React, { useEffect, useState } from "react";
import { db } from "@/lib/firebase";
import { collection, query, orderBy, onSnapshot } from "firebase/firestore";
import { Search, Eye, Clock, CheckCircle, Truck, Package, XCircle, AlertTriangle, RefreshCw } from "lucide-react";
import Link from "next/link";

interface OrderItem {
    name?: string;
    image?: string;
    price?: number;
    quantity?: number;
    brand?: string;
}

interface Order {
    id: string;
    customerName: string;
    customerEmail: string;
    customerPhone: string;
    userId: string;
    total: number;
    status: string;
    normalizedStatus: string;
    createdAt: any;
    itemsCount: number;
    items: OrderItem[];
    paymentMethod: string;
    shippingAddress: any;
}

const STATUS_CONFIG: Record<string, { color: string; icon: React.ElementType }> = {
    pending: { color: "bg-yellow-100 text-yellow-700", icon: Clock },
    processing: { color: "bg-blue-100 text-blue-700", icon: Package },
    shipped: { color: "bg-purple-100 text-purple-700", icon: Truck },
    delivered: { color: "bg-green-100 text-green-700", icon: CheckCircle },
    cancelled: { color: "bg-red-100 text-red-700", icon: XCircle },
};

// Normalize status string to lowercase key for consistent matching
function normalizeStatus(status: any): string {
    if (!status) return "pending";
    const s = String(status).toLowerCase().trim();
    if (s === "confirm" || s === "confirmed") return "processing";
    if (["pending", "processing", "shipped", "delivered", "cancelled"].includes(s)) return s;
    return "pending";
}

// Safely extract the total from different possible field locations
function extractTotal(data: any): number {
    // Check for "totalAmount " (with space) from DB
    if (typeof data["totalAmount "] === "number") return data["totalAmount "];

    if (typeof data.total === "number") return data.total;
    if (typeof data.total === "string") {
        const parsed = parseFloat(String(data.total).replace(/[^\d.-]/g, ""));
        if (!isNaN(parsed)) return parsed;
    }
    if (data.billing?.total != null) {
        const val = typeof data.billing.total === "number"
            ? data.billing.total
            : parseFloat(String(data.billing.total).replace(/[^\d.-]/g, ""));
        if (!isNaN(val)) return val;
    }
    // Sum items prices as fallback
    const items = Array.isArray(data.items) ? data.items : (Array.isArray(data["items "]) ? data["items "] : []);
    if (items.length > 0) {
        return items.reduce((sum: number, item: any) => {
            const price = item.price ?? item["price "] ?? 0;
            const qty = item.quantity ?? item["quantity "] ?? 1;
            const p = typeof price === "number" ? price : parseFloat(price) || 0;
            const q = typeof qty === "number" ? qty : parseInt(qty) || 1;
            return sum + p * q;
        }, 0);
    }
    return 0;
}

// Map a Firestore document to our Order interface
function mapDocToOrder(id: string, data: any): Order {
    const normalizedStatus = normalizeStatus(data.status || data.orderStatus);
    const total = extractTotal(data);

    // Handle "items " with space
    const rawItems = Array.isArray(data.items) ? data.items : (Array.isArray(data["items "]) ? data["items "] : []);
    const items: OrderItem[] = rawItems.map((item: any) => ({
        name: item.name || item["name "] || "Unknown Item",
        image: item.image || item.imageUrl || "",
        price: item.price ?? item["price "] ?? 0,
        quantity: item.quantity ?? item["quantity "] ?? 1,
        brand: item.brand || "",
    }));

    const itemsCount = data.itemsCount || items.length || 0;

    // Handle "createAt " with space
    const createdAt = data.createdAt || data["createAt "] || data.orderDate || data.timestamp || null;

    return {
        id,
        customerName: data.customerName || data.userName || data.name || data.displayName || "Walk-in Customer",
        customerEmail: data.customerEmail || data.email || data.userEmail || "—",
        customerPhone: data.customerPhone || data.phone || data.userPhone || "",
        userId: data.userId || data.uid || "",
        total,
        status: data.status || data.orderStatus || "pending",
        normalizedStatus,
        createdAt,
        itemsCount,
        items,
        paymentMethod: data.paymentMethod || data.paymentStatus || "", // using paymentStatus as fallback
        shippingAddress: data.shippingAddress || data.address || null,
    };
}

export default function OrdersListPage() {
    const [orders, setOrders] = useState<Order[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [filter, setFilter] = useState("all");
    const [searchTerm, setSearchTerm] = useState("");

    const fetchOrders = () => {
        setLoading(true);
        setError(null);

        // Use a simple query without composite index requirements
        // We fetch all orders and filter on the client side
        const ordersRef = collection(db, "orders");

        let q;
        try {
            q = query(ordersRef, orderBy("createdAt", "desc"));
        } catch {
            // Fallback: fetch without ordering if index doesn't exist
            q = query(ordersRef);
        }

        const unsubscribe = onSnapshot(
            q,
            (snapshot) => {
                const ordersData = snapshot.docs.map((doc) =>
                    mapDocToOrder(doc.id, doc.data())
                );
                setOrders(ordersData);
                setLoading(false);
                setError(null);
            },
            (err) => {
                console.error("Firestore orders error:", err);

                // If the ordered query fails (missing index), try without ordering
                const fallbackQuery = query(ordersRef);
                const fallbackUnsub = onSnapshot(
                    fallbackQuery,
                    (snapshot) => {
                        const ordersData = snapshot.docs
                            .map((doc) => mapDocToOrder(doc.id, doc.data()))
                            .sort((a, b) => {
                                const aTime = a.createdAt?.toDate?.() || a.createdAt?.seconds
                                    ? new Date(a.createdAt.seconds * 1000)
                                    : new Date(0);
                                const bTime = b.createdAt?.toDate?.() || b.createdAt?.seconds
                                    ? new Date(b.createdAt.seconds * 1000)
                                    : new Date(0);
                                return bTime.getTime() - aTime.getTime();
                            });
                        setOrders(ordersData);
                        setLoading(false);
                        setError(null);
                    },
                    (fallbackErr) => {
                        console.error("Firestore fallback error:", fallbackErr);
                        setError(
                            fallbackErr.message || "Failed to fetch orders from database."
                        );
                        setLoading(false);
                    }
                );
                return () => fallbackUnsub();
            }
        );

        return unsubscribe;
    };

    useEffect(() => {
        const unsubscribe = fetchOrders();
        return () => {
            if (typeof unsubscribe === "function") unsubscribe();
        };
    }, []);

    // Client-side filtering by status and search
    const filteredOrders = orders.filter((o) => {
        const matchesFilter =
            filter === "all" || o.normalizedStatus === filter;
        const matchesSearch =
            !searchTerm ||
            o.customerName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            o.customerEmail?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            o.id.toLowerCase().includes(searchTerm.toLowerCase());
        return matchesFilter && matchesSearch;
    });

    // Count orders per status for badge display
    const statusCounts: Record<string, number> = { all: orders.length };
    orders.forEach((o) => {
        statusCounts[o.normalizedStatus] =
            (statusCounts[o.normalizedStatus] || 0) + 1;
    });

    const formatDate = (createdAt: any): string => {
        if (!createdAt) return "—";
        try {
            if (createdAt.toDate) return createdAt.toDate().toLocaleDateString("en-IN");
            if (createdAt.seconds) return new Date(createdAt.seconds * 1000).toLocaleDateString("en-IN");
            if (typeof createdAt === "string") return new Date(createdAt).toLocaleDateString("en-IN");
        } catch {
            return "—";
        }
        return "—";
    };

    return (
        <div className="space-y-8">
            {/* Header */}
            <div>
                <h2 className="text-sm font-bold tracking-[0.2em] text-gray-400 mb-1 uppercase">Operations</h2>
                <h1 className="text-3xl font-bold tracking-tight">ORDER MANAGEMENT</h1>
            </div>

            {/* Error Alert */}
            {error && (
                <div className="bg-red-50 border border-red-200 rounded-2xl p-6 flex items-start space-x-4">
                    <AlertTriangle className="text-red-500 flex-shrink-0 mt-0.5" size={20} />
                    <div className="flex-1">
                        <p className="text-sm font-bold text-red-700">Failed to load orders</p>
                        <p className="text-xs text-red-500 mt-1">{error}</p>
                    </div>
                    <button
                        onClick={() => fetchOrders()}
                        className="flex items-center space-x-2 px-4 py-2 bg-red-100 hover:bg-red-200 rounded-xl text-xs font-bold text-red-700 transition-colors"
                    >
                        <RefreshCw size={14} />
                        <span>Retry</span>
                    </button>
                </div>
            )}

            {/* Filter Tabs */}
            <div className="flex flex-wrap gap-2 border-b border-gray-100 pb-1">
                {["all", "pending", "processing", "shipped", "delivered", "cancelled"].map((s) => (
                    <button
                        key={s}
                        onClick={() => setFilter(s)}
                        className={`px-6 py-3 text-xs font-black uppercase tracking-widest transition-all flex items-center gap-2 ${filter === s
                            ? "border-b-2 border-black text-black"
                            : "text-gray-400 hover:text-black"
                            }`}
                    >
                        {s}
                        {(statusCounts[s] ?? 0) > 0 && (
                            <span className={`text-[9px] px-1.5 py-0.5 rounded-full ${filter === s ? "bg-black text-white" : "bg-gray-100 text-gray-500"}`}>
                                {statusCounts[s]}
                            </span>
                        )}
                    </button>
                ))}
            </div>

            {/* Search & Actions */}
            <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1 relative">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                    <input
                        type="text"
                        placeholder="Search by Order ID, Customer Name, or Email..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full bg-white border border-gray-100 rounded-2xl py-4 pl-12 pr-4 focus:border-black outline-none transition-all text-sm shadow-sm"
                    />
                </div>
                <button
                    onClick={() => fetchOrders()}
                    className="flex items-center justify-center space-x-2 px-6 py-4 bg-black text-white rounded-2xl text-xs font-black uppercase tracking-widest hover:bg-gray-900 transition-colors"
                >
                    <RefreshCw size={14} />
                    <span>Refresh</span>
                </button>
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
                            <tr>
                                <td colSpan={6} className="px-8 py-20 text-center">
                                    <div className="flex flex-col items-center space-y-3">
                                        <RefreshCw className="animate-spin text-gray-300" size={24} />
                                        <p className="text-gray-400 font-medium text-sm">Synchronizing with registry...</p>
                                    </div>
                                </td>
                            </tr>
                        ) : filteredOrders.length > 0 ? (
                            filteredOrders.map((order) => {
                                const statusKey = order.normalizedStatus as keyof typeof STATUS_CONFIG;
                                const StatusIcon = STATUS_CONFIG[statusKey]?.icon || Clock;
                                const statusColor = STATUS_CONFIG[statusKey]?.color || "bg-gray-100 text-gray-600";
                                return (
                                    <tr key={order.id} className="hover:bg-gray-50 transition-colors">
                                        <td className="px-8 py-6">
                                            <p className="font-bold text-sm uppercase tracking-tight">#{order.id.slice(0, 8)}</p>
                                            <p className="text-[10px] text-gray-400 font-medium">
                                                {formatDate(order.createdAt)}
                                            </p>
                                        </td>
                                        <td className="px-8 py-6">
                                            <p className="font-bold text-sm">{order.customerName || order.userId?.slice(0, 10) || "Walk-in Customer"}</p>
                                            <p className="text-[10px] text-gray-400 font-medium lowercase">{order.customerEmail || "—"}</p>
                                        </td>
                                        <td className="px-8 py-6 text-sm text-gray-500">{order.itemsCount || 1} {order.itemsCount === 1 ? "item" : "items"}</td>
                                        <td className="px-8 py-6">
                                            <span className={`inline-flex items-center px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest ${statusColor}`}>
                                                <StatusIcon size={12} className="mr-1.5" />
                                                {order.normalizedStatus}
                                            </span>
                                        </td>
                                        <td className="px-8 py-6 font-bold text-sm">₹{order.total?.toLocaleString("en-IN")}</td>
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
                            <tr>
                                <td colSpan={6} className="px-8 py-20 text-center">
                                    <div className="flex flex-col items-center space-y-3">
                                        <Package className="text-gray-200" size={40} />
                                        <p className="text-gray-400 font-medium text-sm">
                                            {filter !== "all"
                                                ? `No ${filter} orders found.`
                                                : searchTerm
                                                    ? "No orders match your search."
                                                    : "No orders in the database yet."}
                                        </p>
                                    </div>
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            {/* Summary Footer */}
            {!loading && orders.length > 0 && (
                <div className="flex items-center justify-between text-xs text-gray-400 px-2">
                    <p>
                        Showing <span className="font-bold text-black">{filteredOrders.length}</span> of{" "}
                        <span className="font-bold text-black">{orders.length}</span> orders
                    </p>
                    <p>
                        Total Revenue:{" "}
                        <span className="font-bold text-black">
                            ₹{orders.reduce((sum, o) => sum + (o.total || 0), 0).toLocaleString("en-IN")}
                        </span>
                    </p>
                </div>
            )}
        </div>
    );
}
