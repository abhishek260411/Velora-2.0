"use client";

import { useState } from "react";
import { auth, db } from "@/lib/firebase";
import { signInWithEmailAndPassword } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { useRouter } from "next/navigation";

export default function LoginPage() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError("");

        try {
            // TEMPORARY MOCK LOGIN - Remove when Firebase is configured
            if (email === "admin@velora.com" && password === "admin123") {
                // Simulate loading delay
                await new Promise(resolve => setTimeout(resolve, 1000));
                router.push("/dashboard");
            } else {
                setError("Invalid credentials. Use: admin@velora.com / admin123");
            }
        } catch (err: any) {
            setError("Login failed. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex min-h-screen bg-white">
            {/* Left: Branding/Visual */}
            <div className="hidden lg:flex lg:w-3/5 bg-black relative overflow-hidden">
                <div className="absolute inset-0 opacity-40">
                    <img
                        src="https://images.unsplash.com/photo-1490481651871-ab68de25d43d?q=80&w=2070"
                        alt="Fashion Header"
                        className="object-cover w-full h-full grayscale"
                    />
                </div>
                <div className="relative z-10 flex flex-col justify-center px-12 text-white">
                    <h1 className="text-8xl font-black tracking-tighter mb-4">VELORA</h1>
                    <p className="text-xl tracking-widest text-gray-400">ADMINISTRATIVE SUITE</p>
                </div>
            </div>

            {/* Right: Login Form */}
            <div className="w-full lg:w-2/5 flex flex-col justify-center px-8 lg:px-24">
                <div className="max-w-md w-full mx-auto">
                    {/* Test Credentials Banner */}
                    <div className="mb-8 p-4 bg-blue-50 border border-blue-200 rounded-2xl">
                        <p className="text-xs font-black uppercase tracking-widest text-blue-600 mb-2">🔓 Test Credentials</p>
                        <div className="space-y-1 text-sm">
                            <p className="font-mono"><strong>Email:</strong> admin@velora.com</p>
                            <p className="font-mono"><strong>Password:</strong> admin123</p>
                        </div>
                        <p className="text-[10px] text-blue-500 mt-2 italic">Mock login enabled - Firebase not required</p>
                    </div>

                    <h2 className="text-3xl font-bold tracking-tight mb-2">WELCOME BACK</h2>
                    <p className="text-gray-500 mb-8">Enter your credentials to access the workspace.</p>

                    <form onSubmit={handleLogin} className="space-y-6">
                        <div>
                            <label className="text-xs font-bold uppercase tracking-wider text-gray-400">Email Address</label>
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="w-full border-b border-gray-200 py-3 focus:border-black outline-none transition-colors text-black"
                                placeholder="admin@velora.com"
                                required
                            />
                        </div>

                        <div>
                            <label className="text-xs font-bold uppercase tracking-wider text-gray-400">Password</label>
                            <input
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full border-b border-gray-200 py-3 focus:border-black outline-none transition-colors text-black"
                                placeholder="••••••••"
                                required
                            />
                        </div>

                        {error && <p className="text-red-500 text-sm font-medium">{error}</p>}

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-black text-white py-4 rounded-full font-bold tracking-widest hover:bg-gray-900 transition-all disabled:opacity-50"
                        >
                            {loading ? "VERIFYING..." : "ENTER WORKSPACE"}
                        </button>
                    </form>

                    <p className="mt-12 text-center text-xs text-gray-400 italic">
                        This station is for authorized administrators only. Unauthorized access is logged and prosecuted.
                    </p>
                </div>
            </div>
        </div>
    );
}
