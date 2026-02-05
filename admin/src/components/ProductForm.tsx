"use client";

import React, { useState, useEffect } from "react";
import { db, storage } from "@/lib/firebase";
import { doc, getDoc, addDoc, collection, setDoc, serverTimestamp } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { useRouter } from "next/navigation";
import { Upload, X, ArrowLeft, Save, Loader2, Star } from "lucide-react";
import Link from "next/link";

interface ProductFormProps {
    productId?: string;
}

const CATEGORY_DATA: Record<string, string[]> = {
    "Shoes": [
        "Men's Sneakers", "Men's Running", "Men's Formal", "Men's Casual",
        "Women's Sneakers", "Women's Heels", "Women's Flats", "Women's Casual",
        "Unisex Sneakers", "Unisex Slides"
    ],
    "Men": ["Tops", "Bottoms", "Shirts", "Winter Wear"],
    "Women": ["Dresses", "Tops", "Bottoms", "Winter Wear", "Ethnic Wear"],
    "Accessories": [
        "Men's Wallets", "Men's Belts", "Men's Sunglasses", "Men's Watches",
        "Women's Handbags", "Women's Jewellery", "Women's Sunglasses", "Women's Watches"
    ]
};

export default function ProductForm({ productId }: ProductFormProps) {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [fetching, setFetching] = useState(!!productId);
    const [imageFile, setImageFile] = useState<File | null>(null);
    const [imagePreview, setImagePreview] = useState<string>("");

    const [formData, setFormData] = useState({
        name: "",
        brand: "",
        price: "",
        category: "Shoes",
        subCategory: "Men",
        description: "",
        isNewArrival: false,
        stock: "",
    });

    useEffect(() => {
        if (productId) {
            const fetchProduct = async () => {
                const docRef = doc(db, "products", productId);
                const docSnap = await getDoc(docRef);
                if (docSnap.exists()) {
                    const data = docSnap.data();
                    setFormData({
                        name: data.name,
                        brand: data.brand,
                        price: data.price.toString(),
                        category: data.category || "Shoes",
                        subCategory: data.subCategory || "Men", // Handle migration
                        description: data.description || "",
                        isNewArrival: data.isNewArrival || false,
                        stock: data.stock ? data.stock.toString() : "",
                    });
                    setImagePreview(data.image || "");
                }
                setFetching(false);
            };
            fetchProduct();
        }
    }, [productId]);

    const handleCategoryChange = (cols: string) => {
        const defaultSub = CATEGORY_DATA[cols]?.[0] || "";
        setFormData({ ...formData, category: cols, subCategory: defaultSub });
    };

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            setImageFile(file);
            setImagePreview(URL.createObjectURL(file));
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            let imageUrl = imagePreview;

            // 1. Upload new image if selected
            if (imageFile) {
                const storageRef = ref(storage, `products/${Date.now()}_${imageFile.name}`);
                const snapshot = await uploadBytes(storageRef, imageFile);
                imageUrl = await getDownloadURL(snapshot.ref);
            }

            const productData = {
                ...formData,
                price: parseFloat(formData.price),
                stock: parseInt(formData.stock) || 0,
                image: imageUrl,
                updatedAt: serverTimestamp(),
            };

            if (productId) {
                // Edit Mode
                await setDoc(doc(db, "products", productId), productData, { merge: true });
            } else {
                // Add Mode
                await addDoc(collection(db, "products"), {
                    ...productData,
                    createdAt: serverTimestamp(),
                });
            }

            router.push("/products");
        } catch (error) {
            console.error("Error saving product:", error);
            alert("Failed to save product. Check console.");
        } finally {
            setLoading(false);
        }
    };

    if (fetching) return <div className="flex justify-center py-20 text-gray-400">Loading product details...</div>;

    return (
        <div className="max-w-4xl mx-auto space-y-8">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                    <Link href="/products" className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                        <ArrowLeft size={24} />
                    </Link>
                    <div>
                        <h2 className="text-sm font-bold tracking-[0.2em] text-gray-400 mb-1 uppercase">
                            {productId ? "Update Catalog" : "Add to Catalog"}
                        </h2>
                        <h1 className="text-3xl font-bold tracking-tight">
                            {productId ? "EDIT PRODUCT" : "NEW PRODUCT"}
                        </h1>
                    </div>
                </div>
                <button
                    onClick={handleSubmit}
                    disabled={loading}
                    className="bg-black text-white px-10 py-4 rounded-full font-bold text-sm tracking-widest flex items-center hover:bg-gray-900 transition-all disabled:opacity-50"
                >
                    {loading ? <Loader2 size={18} className="animate-spin mr-2" /> : <Save size={18} className="mr-2" />}
                    {productId ? "UPDATE PRODUCT" : "PUBLISH PRODUCT"}
                </button>
            </div>

            <form className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {/* Left: Image Upload */}
                <div className="md:col-span-1 space-y-4">
                    <p className="text-xs font-black uppercase tracking-widest text-gray-400">Media</p>
                    <div className="relative group aspect-[3/4] bg-gray-50 border-2 border-dashed border-gray-200 rounded-3xl overflow-hidden flex flex-col items-center justify-center transition-all hover:border-black cursor-pointer">
                        {imagePreview ? (
                            <>
                                <img src={imagePreview} className="w-full h-full object-cover grayscale" />
                                <button
                                    type="button"
                                    onClick={() => { setImageFile(null); setImagePreview(""); }}
                                    className="absolute top-4 right-4 bg-black/80 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                                >
                                    <X size={16} />
                                </button>
                            </>
                        ) : (
                            <>
                                <div className="p-4 bg-white rounded-full shadow-sm mb-4">
                                    <Upload size={24} />
                                </div>
                                <p className="text-xs font-bold text-gray-500">Pick Cover Image</p>
                                <p className="text-[10px] text-gray-400 mt-1">JPEG, PNG or WEBP</p>
                            </>
                        )}
                        <input
                            type="file"
                            accept="image/*"
                            onChange={handleImageChange}
                            className="absolute inset-0 opacity-0 cursor-pointer"
                        />
                    </div>
                </div>

                {/* Right: Details */}
                <div className="md:col-span-2 space-y-8 bg-white border border-gray-100 p-8 rounded-3xl">
                    <p className="text-xs font-black uppercase tracking-widest text-gray-400">Basic Information</p>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="col-span-2">
                            <label className="text-[10px] font-black uppercase tracking-wider text-gray-400 mb-2 block">Product Name</label>
                            <input
                                type="text"
                                value={formData.name}
                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                className="w-full border-b border-gray-200 py-3 focus:border-black outline-none transition-colors text-lg font-bold"
                                placeholder="e.g. Velocity 2.0 Runners"
                                required
                            />
                        </div>

                        <div>
                            <label className="text-[10px] font-black uppercase tracking-wider text-gray-400 mb-2 block">Brand</label>
                            <input
                                type="text"
                                value={formData.brand}
                                onChange={(e) => setFormData({ ...formData, brand: e.target.value })}
                                className="w-full border-b border-gray-200 py-3 focus:border-black outline-none transition-colors"
                                placeholder="VELORA ORIGINALS"
                                required
                            />
                        </div>

                        <div>
                            <label className="text-[10px] font-black uppercase tracking-wider text-gray-400 mb-2 block">Price (INR)</label>
                            <input
                                type="number"
                                value={formData.price}
                                onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                                className="w-full border-b border-gray-200 py-3 focus:border-black outline-none transition-colors font-bold"
                                placeholder="₹ 12,999"
                                required
                            />
                        </div>

                        <div>
                            <label className="text-[10px] font-black uppercase tracking-wider text-gray-400 mb-2 block">Category</label>
                            <select
                                value={formData.category}
                                onChange={(e) => handleCategoryChange(e.target.value)}
                                className="w-full border-b border-gray-200 py-3 focus:border-black outline-none transition-colors bg-white"
                            >
                                {Object.keys(CATEGORY_DATA).map(cat => <option key={cat} value={cat}>{cat}</option>)}
                            </select>
                        </div>

                        <div>
                            <label className="text-[10px] font-black uppercase tracking-wider text-gray-400 mb-2 block">Sub-Category</label>
                            <select
                                value={formData.subCategory}
                                onChange={(e) => setFormData({ ...formData, subCategory: e.target.value })}
                                className="w-full border-b border-gray-200 py-3 focus:border-black outline-none transition-colors bg-white"
                            >
                                {CATEGORY_DATA[formData.category]?.map(sub => <option key={sub} value={sub}>{sub}</option>)}
                            </select>
                        </div>

                        <div>
                            <label className="text-[10px] font-black uppercase tracking-wider text-gray-400 mb-2 block">In Stock</label>
                            <input
                                type="number"
                                value={formData.stock}
                                onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
                                className="w-full border-b border-gray-200 py-3 focus:border-black outline-none transition-colors"
                                placeholder="50"
                                required
                            />
                        </div>
                    </div>

                    <div className="space-y-4">
                        <label className="text-[10px] font-black uppercase tracking-wider text-gray-400 block">Product Description</label>
                        <textarea
                            value={formData.description}
                            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                            className="w-full border border-gray-100 bg-gray-50 rounded-2xl p-4 min-h-[120px] focus:border-black outline-none transition-all text-sm leading-relaxed"
                            placeholder="Tell the velvet story of this product..."
                        />
                    </div>

                    <div className="pt-4 flex items-center justify-between border-t border-gray-50">
                        <div className="flex items-center space-x-4">
                            <button
                                type="button"
                                onClick={() => setFormData({ ...formData, isNewArrival: !formData.isNewArrival })}
                                className={`flex items-center space-x-2 px-6 py-3 rounded-full border transition-all ${formData.isNewArrival
                                    ? "bg-black text-white border-black"
                                    : "bg-white text-gray-400 border-gray-200 hover:border-black hover:text-black"
                                    }`}
                            >
                                <Star size={18} fill={formData.isNewArrival ? "currentColor" : "none"} />
                                <span className="text-xs font-black uppercase tracking-widest">Mark as New Arrival</span>
                            </button>
                        </div>
                        <p className="text-[10px] text-gray-400 font-medium">Auto-saving feature not enabled.</p>
                    </div>
                </div>
            </form>
        </div>
    );
}
