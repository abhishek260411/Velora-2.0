"use client";

import React, { useRef, useState } from "react";
import Papa from "papaparse";
import { db } from "@/lib/firebase";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { Upload, Loader2, FileText, CheckCircle, AlertCircle } from "lucide-react";

export default function BulkUploadButton() {
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [uploading, setUploading] = useState(false);
    const [status, setStatus] = useState<"idle" | "success" | "error">("idle");
    const [message, setMessage] = useState("");

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setUploading(true);
        setStatus("idle");
        setMessage("Parsing CSV...");

        Papa.parse(file, {
            header: true,
            skipEmptyLines: true,
            complete: async (results: Papa.ParseResult<any>) => {
                try {
                    const products = results.data;
                    if (products.length === 0) {
                        throw new Error("No products found in CSV.");
                    }

                    setMessage(`Uploading ${products.length} products...`);
                    const promises = products.map((product: any) => {
                        // Basic validation / cleaning
                        const cleanProduct = {
                            name: product.name || "Untitled Product",
                            brand: product.brand || "Generic",
                            category: product.category || "Uncategorized",
                            subCategory: product.subCategory || "",
                            price: parseFloat(product.price) || 0,
                            stock: parseInt(product.stock) || 0,
                            description: product.description || "",
                            isNewArrival: product.isNewArrival === "true" || product.isNewArrival === true,
                            image: product.image || "", // Use URL provided in CSV or empty
                            createdAt: serverTimestamp(),
                            updatedAt: serverTimestamp(),
                        };
                        return addDoc(collection(db, "products"), cleanProduct);
                    });

                    await Promise.all(promises);
                    setStatus("success");
                    setMessage(`Successfully added ${products.length} products!`);

                    // Reset after 3 seconds
                    setTimeout(() => {
                        setStatus("idle");
                        setMessage("");
                    }, 3000);

                } catch (err) {
                    console.error("Upload error:", err);
                    setStatus("error");
                    setMessage("Failed to upload products. Check console.");
                } finally {
                    setUploading(false);
                    if (fileInputRef.current) fileInputRef.current.value = "";
                }
            },
            error: (err: Error) => {
                console.error("CSV Parse error:", err);
                setStatus("error");
                setMessage("Failed to parse CSV file.");
                setUploading(false);
            }
        });
    };

    return (
        <div className="relative">
            <input
                type="file"
                ref={fileInputRef}
                accept=".csv"
                onChange={handleFileChange}
                className="hidden"
            />

            <button
                onClick={() => fileInputRef.current?.click()}
                disabled={uploading}
                className={`
                    px-6 py-4 rounded-full font-bold text-sm tracking-widest flex items-center transition-all border
                    ${status === "success"
                        ? "bg-green-50 border-green-200 text-green-700 hover:bg-green-100"
                        : status === "error"
                            ? "bg-red-50 border-red-200 text-red-700 hover:bg-red-100"
                            : "bg-white border-gray-200 hover:border-black text-black"
                    }
                `}
            >
                {uploading ? (
                    <Loader2 size={18} className="animate-spin mr-2" />
                ) : status === "success" ? (
                    <CheckCircle size={18} className="mr-2" />
                ) : status === "error" ? (
                    <AlertCircle size={18} className="mr-2" />
                ) : (
                    <FileText size={18} className="mr-2" />
                )}

                {uploading ? "PROCESSING..." : status === "success" ? "DONE" : status === "error" ? "FAILED" : "IMPORT CSV"}
            </button>

            {message && (
                <div className="absolute top-full mt-2 left-0 w-64 bg-black text-white text-xs p-3 rounded-xl z-50 shadow-xl">
                    {message}
                </div>
            )}
        </div>
    );
}
