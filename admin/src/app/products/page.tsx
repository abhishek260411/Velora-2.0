"use client";

import React, { useEffect, useState } from "react";
import { db } from "@/lib/firebase";
import { collection, onSnapshot, query, orderBy, deleteDoc, doc, updateDoc } from "firebase/firestore";
import { Plus, Search, Filter, MoreVertical, Edit2, Trash2, Eye, Star } from "lucide-react";
import Link from "next/link";
import BulkUploadButton from "@/components/BulkUploadButton";

interface Product {
    id: string;
    name: string;
    brand: string;
    price: number | string;
    category: string;
    image: string;
    isNewArrival: boolean;
    stock: number;
}

export default function ProductListPage() {
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");

    useEffect(() => {
        const q = query(collection(db, "products"), orderBy("createdAt", "desc"));
        const unsubscribe = onSnapshot(q, (snapshot) => {
            const productsData = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            } as Product));
            setProducts(productsData);
            setLoading(false);
        });

        return () => unsubscribe();
    }, []);

    const handleDelete = async (id: string) => {
        if (window.confirm("Are you sure you want to delete this product?")) {
            try {
                await deleteDoc(doc(db, "products", id));
            } catch (error) {
                console.error("Error deleting product:", error);
            }
        }
    };

    const toggleNewArrival = async (id: string, currentStatus: boolean) => {
        try {
            await updateDoc(doc(db, "products", id), {
                isNewArrival: !currentStatus
            });
        } catch (error) {
            console.error("Error toggling status:", error);
        }
    };

    const filteredProducts = products.filter(p =>
        p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.brand.toLowerCase().includes(searchTerm.toLowerCase())
    );



    return (
        <div className="space-y-8">
            {/* Header Area */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
                <div>
                    <h2 className="text-sm font-bold tracking-[0.2em] text-gray-400 mb-1 uppercase">Inventory</h2>
                    <h1 className="text-3xl font-bold tracking-tight">PRODUCTS</h1>
                </div>
                <div className="flex items-center space-x-3">
                    <BulkUploadButton />
                    <Link
                        href="/products/add"
                        className="bg-black text-white px-8 py-4 rounded-full font-bold text-sm tracking-widest flex items-center hover:bg-gray-900 transition-all"
                    >
                        <Plus size={18} className="mr-2" />
                        ADD NEW PRODUCT
                    </Link>
                </div>
            </div>

            {/* Filters & Search */}
            <div className="flex flex-col md:flex-row gap-4 bg-gray-50 p-4 rounded-2xl border border-gray-100">
                <div className="flex-1 relative">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                    <input
                        type="text"
                        placeholder="Search products by name or brand..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full bg-white border border-gray-200 rounded-xl py-3 pl-12 pr-4 focus:border-black outline-none transition-all text-sm"
                    />
                </div>
                <button className="bg-white border border-gray-200 px-6 py-3 rounded-xl flex items-center text-sm font-bold hover:border-black transition-all">
                    <Filter size={18} className="mr-2 text-gray-400" />
                    FILTER
                </button>
            </div>

            {/* Product Table */}
            <div className="bg-white border border-gray-100 rounded-3xl overflow-hidden">
                <table className="w-full text-left">
                    <thead>
                        <tr className="bg-gray-50 border-b border-gray-100">
                            <th className="px-8 py-5 text-xs font-black text-gray-400 uppercase tracking-widest">Product</th>
                            <th className="px-8 py-5 text-xs font-black text-gray-400 uppercase tracking-widest">Brand</th>
                            <th className="px-8 py-5 text-xs font-black text-gray-400 uppercase tracking-widest">Category</th>
                            <th className="px-8 py-5 text-xs font-black text-gray-400 uppercase tracking-widest">Price</th>
                            <th className="px-8 py-5 text-xs font-black text-gray-400 uppercase tracking-widest text-center">New Arrival</th>
                            <th className="px-8 py-5 text-xs font-black text-gray-400 uppercase tracking-widest text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                        {loading ? (
                            <tr>
                                <td colSpan={6} className="px-8 py-10 text-center text-gray-400 font-medium">Loading catalog...</td>
                            </tr>
                        ) : filteredProducts.length > 0 ? (
                            filteredProducts.map((p) => (
                                <tr key={p.id} className="hover:bg-gray-50 transition-colors group">
                                    <td className="px-8 py-6">
                                        <div className="flex items-center space-x-4">
                                            <div className="w-12 h-12 bg-gray-100 rounded-lg overflow-hidden border border-gray-100">
                                                <img
                                                    src={p.image || "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=100"}
                                                    alt={p.name}
                                                    className="w-full h-full object-cover"
                                                />
                                            </div>
                                            <div className="max-w-[200px]">
                                                <p className="font-bold text-sm truncate">{p.name}</p>
                                                <p className="text-[10px] text-gray-400 font-black uppercase tracking-widest truncate">{p.id.slice(0, 12)}</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-8 py-6 text-sm font-medium">{p.brand}</td>
                                    <td className="px-8 py-6 text-sm text-gray-500">{p.category}</td>
                                    <td className="px-8 py-6 font-bold text-sm">₹{p.price.toLocaleString()}</td>
                                    <td className="px-8 py-6 text-center">
                                        <button
                                            onClick={() => toggleNewArrival(p.id, p.isNewArrival)}
                                            className={`transition-colors ${p.isNewArrival ? "text-black" : "text-gray-200 hover:text-gray-300"}`}
                                        >
                                            <Star size={20} fill={p.isNewArrival ? "currentColor" : "none"} />
                                        </button>
                                    </td>
                                    <td className="px-8 py-6">
                                        <div className="flex items-center justify-end space-x-2">
                                            <Link href={`/products/edit/${p.id}`} className="p-2 text-gray-400 hover:text-black transition-colors">
                                                <Edit2 size={18} />
                                            </Link>
                                            <button
                                                onClick={() => handleDelete(p.id)}
                                                className="p-2 text-gray-400 hover:text-red-500 transition-colors"
                                            >
                                                <Trash2 size={18} />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan={6} className="px-8 py-10 text-center text-gray-400 font-medium">No products found matching your search.</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
