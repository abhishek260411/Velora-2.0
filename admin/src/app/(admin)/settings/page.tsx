"use client";

import React, { useState } from "react";
import {
    User,
    Bell,
    Shield,
    Globe,
    Smartphone,
    LogOut,
    ToggleLeft,
    ToggleRight,
    Check
} from "lucide-react";
import { auth } from "@/lib/firebase";

export default function SettingsPage() {
    const [activeTab, setActiveTab] = useState("profile");
    const [notifications, setNotifications] = useState({
        email: true,
        push: false,
        orders: true,
        updates: false
    });

    const [system, setSystem] = useState({
        maintenance: false,
        newArrivals: true,
        publicRegistration: true
    });

    const TABS = [
        { id: "profile", label: "Profile & Account", icon: User },
        { id: "notifications", label: "Notifications", icon: Bell },
        { id: "security", label: "Security", icon: Shield },
        { id: "system", label: "System Preferences", icon: Globe },
    ];

    return (
        <div className="max-w-5xl mx-auto space-y-10 pb-20">
            {/* Header */}
            <div>
                <h2 className="text-sm font-bold tracking-[0.2em] text-gray-400 mb-1 uppercase">Configuration</h2>
                <h1 className="text-3xl font-bold tracking-tight">SETTINGS</h1>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                {/* Sidebar Navigation */}
                <div className="lg:col-span-1 space-y-2">
                    {TABS.map((tab) => {
                        const Icon = tab.icon;
                        return (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id)}
                                className={`w-full flex items-center space-x-3 px-4 py-4 rounded-xl transition-all text-left ${activeTab === tab.id
                                        ? "bg-black text-white"
                                        : "bg-white text-gray-500 hover:bg-gray-50"
                                    }`}
                            >
                                <Icon size={18} />
                                <span className="text-xs font-bold uppercase tracking-wide">{tab.label}</span>
                            </button>
                        );
                    })}
                </div>

                {/* Content Area */}
                <div className="lg:col-span-3 bg-white border border-gray-100 p-8 rounded-3xl min-h-[500px]">
                    {activeTab === "profile" && (
                        <div className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-500">
                            <div className="flex items-center space-x-6">
                                <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center text-3xl font-black">
                                    SP
                                </div>
                                <div>
                                    <h3 className="text-xl font-bold">Snehal Pinjari</h3>
                                    <p className="text-gray-400 text-sm">Super Admin</p>
                                    <button className="mt-2 text-xs font-bold underline">Change Avatar</button>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-6 border-t border-gray-100">
                                <div>
                                    <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-2 block">Full Name</label>
                                    <input type="text" value="Snehal Pinjari" disabled className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm font-bold text-gray-500" />
                                </div>
                                <div>
                                    <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-2 block">Email Address</label>
                                    <input type="email" value="admin@velora.com" disabled className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm font-bold text-gray-500" />
                                </div>
                            </div>
                        </div>
                    )}

                    {activeTab === "notifications" && (
                        <div className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-500">
                            <div>
                                <h3 className="text-lg font-bold mb-1">Email Alerts</h3>
                                <p className="text-gray-400 text-xs text-medium mb-6">Manage what you receive in your inbox.</p>

                                <div className="space-y-4">
                                    {[
                                        { key: "orders", label: "New Order Confirmed", desc: "Get notified when a customer places an order." },
                                        { key: "updates", label: "Product Updates", desc: "Receive alerts for stock changes." },
                                        { key: "email", label: "Weekly Report", desc: "Summary of weekly performance." }
                                    ].map((item: any) => (
                                        <div key={item.key} className="flex items-center justify-between p-4 border border-gray-100 rounded-2xl">
                                            <div>
                                                <p className="font-bold text-sm">{item.label}</p>
                                                <p className="text-xs text-gray-400">{item.desc}</p>
                                            </div>
                                            <button
                                                onClick={() => setNotifications({ ...notifications, [item.key]: !notifications[item.key as keyof typeof notifications] })}
                                                className={`transition-colors ${notifications[item.key as keyof typeof notifications] ? "text-black" : "text-gray-300"}`}
                                            >
                                                {notifications[item.key as keyof typeof notifications] ? <ToggleRight size={32} /> : <ToggleLeft size={32} />}
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    )}

                    {activeTab === "system" && (
                        <div className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-500">
                            <div>
                                <h3 className="text-lg font-bold mb-1">System Configuration</h3>
                                <p className="text-gray-400 text-xs text-medium mb-6">Global settings for the VELORA storefront.</p>

                                <div className="space-y-4">
                                    <div className="flex items-center justify-between p-4 border border-gray-100 rounded-2xl bg-gray-50">
                                        <div className="flex items-center space-x-4">
                                            <Smartphone size={20} />
                                            <div>
                                                <p className="font-bold text-sm">Store Status</p>
                                                <p className="text-xs text-gray-400">Enable/Disable customer access.</p>
                                            </div>
                                        </div>
                                        <div className="flex items-center space-x-2 text-green-600 bg-white px-3 py-1 rounded-lg border border-gray-200">
                                            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                                            <span className="text-[10px] font-black uppercase tracking-widest">Live</span>
                                        </div>
                                    </div>

                                    <div className="flex items-center justify-between p-4 border border-gray-100 rounded-2xl">
                                        <div>
                                            <p className="font-bold text-sm">New Arrival Spotlight</p>
                                            <p className="text-xs text-gray-400">Automatically promote new products on home.</p>
                                        </div>
                                        <button
                                            onClick={() => setSystem({ ...system, newArrivals: !system.newArrivals })}
                                            className={`transition-colors ${system.newArrivals ? "text-black" : "text-gray-300"}`}
                                        >
                                            {system.newArrivals ? <ToggleRight size={32} /> : <ToggleLeft size={32} />}
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {activeTab === "security" && (
                        <div className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-500">
                            <div className="text-center py-10">
                                <Shield className="mx-auto text-gray-200 mb-4" size={48} />
                                <h3 className="text-lg font-bold mb-1">Security Settings</h3>
                                <p className="text-gray-400 text-xs mb-6">Password and 2FA settings are managed via Firebase Console.</p>
                                <button
                                    onClick={() => auth.signOut()}
                                    className="bg-red-50 text-red-500 px-6 py-3 rounded-xl text-xs font-black uppercase tracking-widest hover:bg-red-100 transition-all flex items-center justify-center mx-auto"
                                >
                                    <LogOut size={16} className="mr-2" />
                                    Sign Out Session
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
