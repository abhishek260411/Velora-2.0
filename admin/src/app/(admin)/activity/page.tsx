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

import { db } from "@/lib/firebase";
import { collection, onSnapshot, query, orderBy, Timestamp } from "firebase/firestore";

interface ActivityLog {
    id: string;
    action: string;
    user: string;
    type: "auth" | "create" | "update" | "delete" | "system";
    details: string;
    createdAt: Timestamp;
}

export default function ActivityLogsPage() {
    const [filter, setFilter] = useState("all");
    const [searchTerm, setSearchTerm] = useState("");
    const [logs, setLogs] = useState<ActivityLog[]>([]);

    React.useEffect(() => {
        const q = query(collection(db, "activity_logs"), orderBy("createdAt", "desc"));
        const unsubscribe = onSnapshot(q, (snapshot) => {
            const logsData = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            } as ActivityLog));
            setLogs(logsData);
        }, (error) => {
            console.error("Error fetching activity logs:", error);
            setLogs([]);
        });
        return () => unsubscribe();
    }, []);

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

    const handleSearch = (val: string) => {
        setSearchTerm(val);
        if (val !== "") setFilter("all");
    };

    const formatTime = (timestamp: Timestamp) => {
        if (!timestamp) return "";
        const date = timestamp.toDate();
        const now = new Date();
        const diff = (now.getTime() - date.getTime()) / 1000;

        if (diff < 60) return "Just now";
        if (diff < 3600) {
            const mins = Math.floor(diff / 60);
            return `${mins} ${mins === 1 ? 'min' : 'mins'} ago`;
        }
        if (diff < 86400) {
            const hours = Math.floor(diff / 3600);
            return `${hours} ${hours === 1 ? 'hour' : 'hours'} ago`;
        }
        return date.toLocaleDateString();
    };

    const filteredLogs = logs.filter(log => {
        const matchesFilter = filter === "all" || log.type === filter;
        const matchesSearch = log.user.toLowerCase().includes(searchTerm.toLowerCase()) ||
            log.action.toLowerCase().includes(searchTerm.toLowerCase());
        return matchesFilter && matchesSearch;
    });

    return (
        <div className="max-w-4xl mx-auto space-y-10 pb-20">
            {/* Header */}
            <div className="flex flex-col space-y-6">
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                    <div>
                        <h2 className="text-sm font-bold tracking-[0.2em] text-gray-400 mb-1 uppercase">Audit Trail</h2>
                        <h1 className="text-3xl font-bold tracking-tight">ACTIVITY LOGS</h1>
                    </div>

                    <div className="flex bg-gray-50 p-1 rounded-xl">
                        {["all", "auth", "create", "delete", "update", "system"].map((option) => (
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

                <div className="relative">
                    <input
                        type="text"
                        placeholder="Search logs by user or action..."
                        value={searchTerm}
                        onChange={(e) => handleSearch(e.target.value)}
                        className="w-full bg-white border border-gray-100 rounded-2xl py-4 px-6 focus:border-black outline-none transition-all text-sm shadow-sm"
                    />
                </div>
            </div>

            {/* Timeline */}
            <div className="bg-white border border-gray-100 rounded-3xl p-8 relative">
                {/* Vertical Line */}
                <div className="absolute left-[59px] top-10 bottom-10 w-px bg-gray-100"></div>

                <div className="space-y-8">
                    {filteredLogs.length === 0 ? (
                        <div className="text-center py-10 text-gray-400 text-sm">No activity logs found.</div>
                    ) : (
                        filteredLogs.map((log) => (
                            <div key={log.id} className="relative flex items-start group">
                                {/* Icon Marker */}
                                <div className="relative z-10 w-12 h-12 bg-white border border-gray-100 rounded-full flex items-center justify-center mr-6 group-hover:border-black transition-colors shadow-sm">
                                    {getIcon(log.type)}
                                </div>

                                {/* Content */}
                                <div className="flex-1 pt-1">
                                    <div className="flex justify-between items-start mb-1">
                                        <h4 className="font-bold text-sm">{log.action}</h4>
                                        <span className="text-[10px] font-black uppercase tracking-widest text-gray-400 bg-gray-50 px-2 py-1 rounded-md">{formatTime(log.createdAt)}</span>
                                    </div>
                                    <p className="text-sm text-gray-500 mb-2">{log.details}</p>
                                    <div className="flex items-center text-xs font-bold text-gray-400">
                                        <User size={12} className="mr-1" />
                                        {log.user}
                                    </div>
                                </div>
                            </div>
                        )))}
                </div>
            </div>

            <div className="text-center">
                <p className="text-[10px] font-medium text-gray-300">Logs are retained for 90 days.</p>
            </div>
        </div>
    );
}
