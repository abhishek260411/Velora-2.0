"use client";

import React, { useEffect, useState } from "react";
import { db } from "@/lib/firebase";
import { collection, query, orderBy, onSnapshot } from "firebase/firestore";
import { Search, User, Mail, Calendar, ExternalLink, ShieldCheck } from "lucide-react";
import Link from "next/link";

interface Customer {
    id: string;
    name: string;
    email: string;
    createdAt: any;
    totalOrders?: number;
    role?: string;
}

export default function UsersListPage() {
    const [users, setUsers] = useState<Customer[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");

    useEffect(() => {
        const q = query(collection(db, "users"), orderBy("createdAt", "desc"));
        const unsubscribe = onSnapshot(q, (snapshot) => {
            const usersData = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            } as Customer));
            setUsers(usersData);
            setLoading(false);
        });

        return () => unsubscribe();
    }, []);

    const filteredUsers = users.filter(u =>
        u.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        u.email?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="space-y-8">
            {/* Header */}
            <div>
                <h2 className="text-sm font-bold tracking-[0.2em] text-gray-400 mb-1 uppercase">Community</h2>
                <h1 className="text-3xl font-bold tracking-tight">CUSTOMER DIRECTORY</h1>
            </div>

            {/* Search */}
            <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1 relative">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                    <input
                        type="text"
                        placeholder="Search by name, email or registry ID..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full bg-white border border-gray-100 rounded-2xl py-4 pl-12 pr-4 focus:border-black outline-none transition-all text-sm shadow-sm"
                    />
                </div>
            </div>

            {/* Users Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {loading ? (
                    <div className="col-span-full py-20 text-center text-gray-400 font-medium">Downloading member profiles...</div>
                ) : filteredUsers.length > 0 ? (
                    filteredUsers.map((user) => (
                        <div key={user.id} className="bg-white border border-gray-100 p-8 rounded-3xl hover:border-black transition-all group relative overflow-hidden shadow-sm">
                            <div className="flex justify-between items-start mb-6">
                                <div className="p-4 bg-gray-50 rounded-2xl group-hover:bg-black group-hover:text-white transition-all">
                                    <User size={24} />
                                </div>
                                <div className="flex flex-col items-end">
                                    <span className={`px-3 py-1 rounded-full text-[8px] font-black uppercase tracking-widest ${user.role === 'admin' ? 'bg-black text-white' : 'bg-gray-100 text-gray-400'}`}>
                                        {user.role === 'admin' ? 'Authorized Admin' : 'Customer'}
                                    </span>
                                </div>
                            </div>

                            <div className="space-y-1">
                                <h3 className="text-lg font-black tracking-tight truncate">{user.name || "Anonymous User"}</h3>
                                <p className="text-xs text-gray-400 font-medium truncate lowercase">{user.email}</p>
                            </div>

                            <div className="mt-8 pt-6 border-t border-gray-50 grid grid-cols-2 gap-4">
                                <div>
                                    <p className="text-[9px] font-black uppercase tracking-widest text-gray-300 mb-1">Registered</p>
                                    <div className="flex items-center text-xs font-bold text-gray-500">
                                        <Calendar size={12} className="mr-1.5" />
                                        {user.createdAt?.toDate ? user.createdAt.toDate().toLocaleDateString('en-US', { month: 'short', year: 'numeric' }) : "Recently"}
                                    </div>
                                </div>
                                <div>
                                    <p className="text-[9px] font-black uppercase tracking-widest text-gray-300 mb-1">Engagement</p>
                                    <div className="flex items-center text-xs font-bold text-gray-500">
                                        <ShieldCheck size={12} className="mr-1.5" />
                                        Verified
                                    </div>
                                </div>
                            </div>

                            <button className="mt-8 w-full py-4 text-[10px] font-black uppercase tracking-[0.2em] border border-gray-100 rounded-xl hover:bg-black hover:text-white hover:border-black transition-all flex items-center justify-center space-x-2">
                                <span>View Activity</span>
                                <ExternalLink size={12} />
                            </button>
                        </div>
                    ))
                ) : (
                    <div className="col-span-full py-20 text-center text-gray-400 font-medium">No results found in current registry.</div>
                )}
            </div>
        </div>
    );
}
