"use client";

import React, { useState } from "react";
import {
    Clock,
    Edit2,
    Trash2,
    Plus,
    CheckCircle,
    ShieldAlert,
    User,
    Settings,
    LogIn
} from "lucide-react";

export default function ActivityLogsPage() {
    const [filter, setFilter] = useState("all");

    // Mock Activity Data (Since Firestore implementation for logs wasn't explicitly requested in previous parts)
    const logData = [
        { id: 1, action: "Logged In", user: "Snehal Pinjari", time: "2 mins ago", type: "auth", details: "Successful login from 192.168.1.1" },
        { id: 2, action: "Updated Order Status", user: "Snehal Pinjari", time: "15 mins ago", type: "update", details: "Changed Order #ORD-8921 to 'Shipped'" },
        { id: 3, action: "Added New Product", user: "Admin", time: "1 hour ago", type: "create", details: "Published 'Velocity 2.0 Sneakers'" },
        { id: 4, action: "System Backup", user: "System", time: "3 hours ago", type: "system", details: "Daily database snapshot created." },
        { id: 5, action: "Deleted User", user: "Snehal Pinjari", time: "5 hours ago", type: "delete", details: "Removed inactive user 'test_user_01'" },
        { id: 6, action: "Updated Hero Banner", user: "Admin", time: "Yesterday", type: "update", details: "Replaced main banner with 'Summer Collection'" },
        { id: 7, action: "Exported Reports", user: "Snehal Pinjari", time: "Yesterday", type: "system", details: "Downloaded Monthly Revenue Report CSV" },
    ];

    const getIcon = (type: string) => {
        switch (type) {
            case "auth": return <LogIn size={16} className="text-blue-500" />;
            case "create": return <Plus size={16} className="text-green-500" />;
            case "update": return <Edit2 size={16} className="text-orange-500" />;
            case "delete": return <Trash2 size={16} className="text-red-500" />;
            case "system": return <Settings size={16} className="text-purple-500" />;
            default: return <Clock size={16} className="text-gray-500" />;
        }
    };

    const filteredLogs = filter === "all" ? logData : logData.filter(log => log.type === filter);

    return (
        <div className="max-w-4xl mx-auto space-y-10 pb-20">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                <div>
                    <h2 className="text-sm font-bold tracking-[0.2em] text-gray-400 mb-1 uppercase">Audit Trail</h2>
                    <h1 className="text-3xl font-bold tracking-tight">ACTIVITY LOGS</h1>
                </div>

                <div className="flex bg-gray-50 p-1 rounded-xl">
                    {["all", "auth", "update", "system"].map((option) => (
                        <button
                            key={option}
                            onClick={() => setFilter(option)}
                            className={`px-4 py-2 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all ${filter === option
                                    ? "bg-white text-black shadow-sm"
                                    : "text-gray-400 hover:text-black"
                                }`}
                        >
                            {option}
                        </button>
                    ))}
                </div>
            </div>

            {/* Timeline */}
            <div className="bg-white border border-gray-100 rounded-3xl p-8 relative">
                {/* Vertical Line */}
                <div className="absolute left-[59px] top-10 bottom-10 w-px bg-gray-100"></div>

                <div className="space-y-8">
                    {filteredLogs.map((log) => (
                        <div key={log.id} className="relative flex items-start group">
                            {/* Icon Marker */}
                            <div className="relative z-10 w-12 h-12 bg-white border border-gray-100 rounded-full flex items-center justify-center mr-6 group-hover:border-black transition-colors shadow-sm">
                                {getIcon(log.type)}
                            </div>

                            {/* Content */}
                            <div className="flex-1 pt-1">
                                <div className="flex justify-between items-start mb-1">
                                    <h4 className="font-bold text-sm">{log.action}</h4>
                                    <span className="text-[10px] font-black uppercase tracking-widest text-gray-400 bg-gray-50 px-2 py-1 rounded-md">{log.time}</span>
                                </div>
                                <p className="text-sm text-gray-500 mb-2">{log.details}</p>
                                <div className="flex items-center text-xs font-bold text-gray-400">
                                    <User size={12} className="mr-1" />
                                    {log.user}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            <div className="text-center">
                <p className="text-[10px] font-medium text-gray-300">Logs are retained for 90 days.</p>
            </div>
        </div>
    );
}
