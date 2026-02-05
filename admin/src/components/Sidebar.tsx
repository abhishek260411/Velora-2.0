"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
    BarChart3,
    Package,
    ShoppingCart,
    Users,
    Settings,
    LogOut,
    Layers,
    PieChart,
    ScrollText
} from "lucide-react";
import { auth } from "@/lib/firebase";

const Sidebar = () => {
    const pathname = usePathname();

    const MENU_ITEMS = [
        { id: "dashboard", name: "Overview", icon: BarChart3, path: "/dashboard" },
        { id: "products", name: "Products", icon: Package, path: "/products" },
        { id: "orders", name: "Orders", icon: ShoppingCart, path: "/orders" },
        { id: "customers", name: "Customers", icon: Users, path: "/customers" },
        { id: "reports", name: "Reports", icon: PieChart, path: "/reports" },
        { id: "activity", name: "Activity Logs", icon: ScrollText, path: "/activity" },
        { id: "cms", name: "CMS", icon: Layers, path: "/cms" },
    ];

    return (
        <div className="w-64 h-screen bg-black text-white flex flex-col fixed left-0 top-0">
            {/* Branding */}
            <div className="p-8 border-b border-gray-900">
                <h1 className="text-2xl font-black tracking-tighter">VELORA</h1>
            </div>

            {/* Nav Links */}
            <nav className="flex-1 p-4 space-y-2">
                {MENU_ITEMS.map((item) => {
                    const Icon = item.icon;
                    const isActive = pathname === item.path;

                    return (
                        <Link
                            key={item.id}
                            href={item.path}
                            className={`flex items-center space-x-4 px-4 py-3 rounded-lg transition-all ${isActive ? "bg-white text-black font-bold" : "text-gray-400 hover:text-white hover:bg-gray-900"
                                }`}
                        >
                            <Icon size={20} />
                            <span className="text-sm tracking-wide">{item.name}</span>
                        </Link>
                    );
                })}
            </nav>

            {/* Footer Actions */}
            <div className="p-4 border-t border-gray-900 space-y-2">
                <Link
                    href="/settings"
                    className="flex items-center space-x-4 px-4 py-3 text-gray-400 hover:text-white hover:bg-gray-900 rounded-lg transition-all"
                >
                    <Settings size={20} />
                    <span className="text-sm tracking-wide">Settings</span>
                </Link>
                <button
                    onClick={() => auth.signOut()}
                    className="w-full flex items-center space-x-4 px-4 py-3 text-red-500 hover:bg-red-500/10 rounded-lg transition-all"
                >
                    <LogOut size={20} />
                    <span className="text-sm tracking-wide font-bold">Log Out</span>
                </button>
            </div>
        </div>
    );
};

export default Sidebar;
