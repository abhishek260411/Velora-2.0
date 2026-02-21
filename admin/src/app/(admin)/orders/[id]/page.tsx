"use client";

import React, { useEffect, useState } from "react";
import { db } from "@/lib/firebase";
import { doc, getDoc, updateDoc, onSnapshot } from "firebase/firestore";
import { useParams, useRouter } from "next/navigation";
import {
    ArrowLeft,
    Truck,
    Package,
    CheckCircle,
    Clock,
    XCircle,
    Loader2,
    MapPin,
    CreditCard,
    User,
    Mail,
    Phone
} from "lucide-react";
import Link from "next/link";

const STATUS_OPTIONS = ["pending", "processing", "shipped", "delivered", "cancelled"];

export default function OrderDetailsPage() {
    const params = useParams();
    const router = useRouter();
    const id = params.id as string;

    const [order, setOrder] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [updating, setUpdating] = useState(false);

    useEffect(() => {
        const unsubscribe = onSnapshot(doc(db, "orders", id), (docSnap) => {
            if (docSnap.exists()) {
                const data = docSnap.data();
                // Handle DB fields with trailing spaces
                const rawTotal = data.total ?? data["totalAmount "] ?? data.billing?.total ?? 0;
                const total = typeof rawTotal === "number"
                    ? rawTotal
                    : parseFloat(String(rawTotal).replace(/[^\d.-]/g, "")) || 0;

                const rawItems = Array.isArray(data.items) ? data.items : (Array.isArray(data["items "]) ? data["items "] : []);
                const items = rawItems.map((item: any) => ({
                    name: item.name || item["name "] || "Unknown Item",
                    image: item.image || item.imageUrl || "",
                    price: item.price ?? item["price "] ?? 0,
                    quantity: item.quantity ?? item["quantity "] ?? 1,
                    brand: item.brand || "",
                }));

                const finalTotal = total > 0 ? total : items.reduce((sum: number, it: any) => sum + ((it.price || 0) * (it.quantity || 1)), 0);

                const mappedOrder = {
                    id: docSnap.id,
                    ...data,
                    customerName: data.customerName || data.userName || data.name || data.displayName || "Customer",
                    customerEmail: data.customerEmail || data.email || data.userEmail || "—",
                    customerPhone: data.customerPhone || data.phone || data.userPhone || "+91 XXXXXXXXXX",
                    total: finalTotal,
                    items,
                    status: (data.status || data.orderStatus || "pending").toLowerCase(),
                    paymentMethod: data.paymentMethod || data.paymentStatus || "Prepaid",
                    shippingAddress: data.shippingAddress || data.address || null,
                    createdAt: data.createdAt || data["createAt "] || data.orderDate || null,
                };
                setOrder(mappedOrder);
            }
            setLoading(false);
        });

        return () => unsubscribe();
    }, [id]);

    const handleStatusUpdate = async (newStatus: string) => {
        setUpdating(true);
        try {
            await updateDoc(doc(db, "orders", id), {
                status: newStatus,
                updatedAt: new Date()
            });
        } catch (error) {
            console.error("Error updating status:", error);
            alert("Failed to update status.");
        } finally {
            setUpdating(false);
        }
    };

    if (loading) return (
        <div className="flex flex-col items-center justify-center py-40 space-y-4">
            <Loader2 className="animate-spin text-gray-400" size={32} />
            <p className="text-xs font-black uppercase tracking-[0.2em] text-gray-400">Decrypting Transaction...</p>
        </div>
    );

    if (!order) return <div className="text-center py-20">Order not found.</div>;

    return (
        <div className="max-w-5xl mx-auto space-y-10 pb-20">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                <div className="flex items-center space-x-6">
                    <Link href="/orders" className="p-3 hover:bg-gray-100 rounded-full transition-all">
                        <ArrowLeft size={24} />
                    </Link>
                    <div>
                        <h2 className="text-sm font-bold tracking-[0.3em] text-gray-400 mb-1 uppercase">Order Reference</h2>
                        <h1 className="text-3xl font-black tracking-tight uppercase">#{order.id.slice(0, 8)}</h1>
                    </div>
                </div>

                <div className="flex items-center bg-gray-50 p-2 rounded-2xl border border-gray-100">
                    {STATUS_OPTIONS.map((status) => (
                        <button
                            key={status}
                            onClick={() => handleStatusUpdate(status)}
                            disabled={updating || order.status?.toLowerCase() === status}
                            className={`px-6 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${order.status?.toLowerCase() === status
                                ? "bg-black text-white shadow-lg"
                                : "text-gray-400 hover:text-black disabled:opacity-50"
                                }`}
                        >
                            {status}
                        </button>
                    ))}
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
                {/* Left: Items & Summary */}
                <div className="lg:col-span-2 space-y-8">
                    {/* Items List */}
                    <div className="bg-white border border-gray-100 rounded-3xl overflow-hidden shadow-sm">
                        <div className="px-8 py-5 border-b border-gray-100 bg-gray-50/50 flex justify-between items-center">
                            <h3 className="text-xs font-black tracking-widest text-gray-400 uppercase">Cart Contents</h3>
                            <span className="text-xs font-bold">{order.items?.length || 0} Items</span>
                        </div>
                        <div className="divide-y divide-gray-100">
                            {order.items?.map((item: any, idx: number) => (
                                <div key={idx} className="px-8 py-6 flex items-center space-x-6 hover:bg-gray-50 transition-colors">
                                    <div className="w-16 h-16 bg-gray-100 rounded-xl overflow-hidden flex-shrink-0">
                                        <img src={item.image} alt={item.name} className="w-full h-full object-cover grayscale" />
                                    </div>
                                    <div className="flex-1">
                                        <h4 className="font-bold text-sm tracking-tight">{item.name}</h4>
                                        <p className="text-[10px] text-gray-400 font-black uppercase tracking-widest">{item.brand}</p>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-xs font-bold text-gray-400">Qty: {item.quantity}</p>
                                        <p className="font-black text-sm">₹{item.price?.toLocaleString()}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                        <div className="p-8 bg-black text-white flex justify-between items-center">
                            <div>
                                <p className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-1">Total Impact</p>
                                <p className="text-3xl font-black">₹{order.total?.toLocaleString()}</p>
                            </div>
                            <div className="text-right">
                                <p className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-1">Payment Method</p>
                                <div className="flex items-center justify-end space-x-2">
                                    <CreditCard size={14} />
                                    <span className="text-sm font-bold uppercase">{order.paymentMethod || "Prepaid"}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Right: Customer Info */}
                <div className="space-y-8">
                    {/* Customer Card */}
                    <div className="bg-white border border-gray-100 p-8 rounded-3xl shadow-sm space-y-6">
                        <h3 className="text-xs font-black tracking-widest text-gray-400 uppercase border-b border-gray-50 pb-4 flex items-center">
                            <User size={14} className="mr-2" />
                            Customer Profile
                        </h3>
                        <div className="space-y-4">
                            <div>
                                <p className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-1">Full Name</p>
                                <p className="text-sm font-bold">{order.customerName}</p>
                            </div>
                            <div className="flex items-center space-x-3">
                                <Mail size={14} className="text-gray-400" />
                                <span className="text-sm font-medium lowercase">{order.customerEmail}</span>
                            </div>
                            <div className="flex items-center space-x-3">
                                <Phone size={14} className="text-gray-400" />
                                <span className="text-sm font-medium">{order.customerPhone || "+91 9XXXXXXXXX"}</span>
                            </div>
                        </div>
                    </div>

                    {/* Shipping Card */}
                    <div className="bg-gray-50 border border-gray-100 p-8 rounded-3xl shadow-sm space-y-6">
                        <h3 className="text-xs font-black tracking-widest text-gray-400 uppercase border-b border-gray-100 pb-4 flex items-center">
                            <MapPin size={14} className="mr-2" />
                            Delivery Manifest
                        </h3>
                        <div className="space-y-1">
                            <p className="text-sm font-bold leading-relaxed">
                                {order.shippingAddress?.street || "123 Velvet Boulevard"}
                            </p>
                            <p className="text-sm font-medium text-gray-500">
                                {order.shippingAddress?.city || "Milan"}, {order.shippingAddress?.state || "Italy"}
                            </p>
                            <p className="text-xs font-black uppercase tracking-widest text-gray-400 mt-2">
                                ZIP: {order.shippingAddress?.zip || "20121"}
                            </p>
                        </div>

                        <div className="pt-6 border-t border-gray-100">
                            <div className="flex items-center justify-between text-xs">
                                <span className="font-black text-gray-400 uppercase tracking-widest">Courier</span>
                                <span className="font-bold">VELORA EXPRESS</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
