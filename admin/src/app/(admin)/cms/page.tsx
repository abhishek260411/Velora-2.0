"use client";

import React, { useState, useEffect } from "react";
import { Upload, X, Save, Eye, Image as ImageIcon, Sparkles, Tag, Plus, Trash2, Percent } from "lucide-react";
import { db } from "@/lib/firebase";
import { collection, onSnapshot, addDoc, updateDoc, deleteDoc, doc, query, orderBy } from "firebase/firestore";

interface Banner {
    id: string;
    title: string;
    subtitle: string;
    imageUrl: string;
    ctaText: string;
    isActive: boolean;
}

interface Collection {
    id: string;
    title: string;
    description: string;
    imageUrl: string;
    itemCount: number;
    isActive: boolean;
}

interface Promotion {
    id: string;
    code: string;
    discount: string;
    description: string;
    isActive: boolean;
}

export default function CMSPage() {
    const [activeTab, setActiveTab] = useState("banners");
    const [banners, setBanners] = useState<Banner[]>([]);
    const [collections, setCollections] = useState<Collection[]>([]);
    const [promotions, setPromotions] = useState<Promotion[]>([]);

    const [editingBanner, setEditingBanner] = useState<Banner | null>(null);
    const [editingCollection, setEditingCollection] = useState<Collection | null>(null);
    const [editingPromotion, setEditingPromotion] = useState<Promotion | null>(null);
    const [previewImage, setPreviewImage] = useState<string>("");

    // Accessibility Refs
    const bannerModalRef = React.useRef<HTMLDivElement>(null);
    const lastFocusedElement = React.useRef<HTMLElement | null>(null);

    // Escape and Focus Trap for Banner Modal
    React.useEffect(() => {
        if (editingBanner) {
            lastFocusedElement.current = document.activeElement as HTMLElement;
            bannerModalRef.current?.focus();

            const handleKeyDown = (e: KeyboardEvent) => {
                if (e.key === "Escape") {
                    setEditingBanner(null);
                    setPreviewImage("");
                }

                if (e.key === "Tab" && bannerModalRef.current) {
                    const focusableElements = bannerModalRef.current.querySelectorAll(
                        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
                    );
                    const firstElement = focusableElements[0] as HTMLElement;
                    const lastElement = focusableElements[focusableElements.length - 1] as HTMLElement;

                    if (e.shiftKey) {
                        if (document.activeElement === firstElement) {
                            lastElement.focus();
                            e.preventDefault();
                        }
                    } else {
                        if (document.activeElement === lastElement) {
                            firstElement.focus();
                            e.preventDefault();
                        }
                    }
                }
            };

            window.addEventListener("keydown", handleKeyDown);
            return () => {
                window.removeEventListener("keydown", handleKeyDown);
                lastFocusedElement.current?.focus();
            };
        }
    }, [editingBanner]);

    // Deletion Confirmation State
    const [confirmModal, setConfirmModal] = useState<{
        isOpen: boolean;
        type: "collection" | "promotion";
        id: string;
        name: string;
    }>({ isOpen: false, type: "collection", id: "", name: "" });

    // Clear preview when switching editing context
    React.useEffect(() => {
        setPreviewImage("");
    }, [editingBanner?.id, editingCollection?.id]);

    // Fetch Data from Firestore
    useEffect(() => {
        const unsubBanners = onSnapshot(query(collection(db, "banners")), (snap) => {
            setBanners(snap.docs.map(d => ({ id: d.id, ...d.data() } as Banner)));
        });
        const unsubCollections = onSnapshot(query(collection(db, "collections")), (snap) => {
            setCollections(snap.docs.map(d => ({ id: d.id, ...d.data() } as Collection)));
        });
        const unsubPromotions = onSnapshot(query(collection(db, "promotions")), (snap) => {
            setPromotions(snap.docs.map(d => ({ id: d.id, ...d.data() } as Promotion)));
        });

        return () => {
            unsubBanners();
            unsubCollections();
            unsubPromotions();
        };
    }, []);


    const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setPreviewImage(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSaveBanner = async () => {
        if (editingBanner) {
            const updated = {
                ...editingBanner,
                imageUrl: previewImage || editingBanner.imageUrl
            };

            try {
                // Check if it's a new banner or existing (by checking if ID exists in current list)
                // Note: The UI currently doesn't support creating new banners, only editing. 
                // But for robustness:
                if (banners.some(b => b.id === updated.id)) {
                    const { id, ...data } = updated;
                    await updateDoc(doc(db, "banners", id), data);
                    alert("✅ Banner updated successfully!");
                } else {
                    // If we add create functionality later
                    const { id, ...data } = updated;
                    await addDoc(collection(db, "banners"), data);
                    alert("✅ Banner created successfully!");
                }

                setEditingBanner(null);
                setPreviewImage("");
            } catch (e) {
                console.error("Error saving banner:", e);
                alert("❌ Failed to save banner.");
            }
        }
    };

    const toggleBannerStatus = async (id: string) => {
        const banner = banners.find(b => b.id === id);
        if (banner) {
            try {
                await updateDoc(doc(db, "banners", id), { isActive: !banner.isActive });
            } catch (e) {
                console.error("Error updating banner status:", e);
            }
        }
    };

    // Collection Handlers
    const handleSaveCollection = async () => {
        if (editingCollection) {
            const updated = {
                ...editingCollection,
                imageUrl: previewImage || editingCollection.imageUrl
            };

            try {
                if (collections.some(c => c.id === updated.id)) {
                    const { id, ...data } = updated;
                    await updateDoc(doc(db, "collections", id), data);
                } else {
                    const { id, ...data } = updated;
                    await addDoc(collection(db, "collections"), data);
                }
                setEditingCollection(null);
                setPreviewImage("");
                alert("✅ Collection saved successfully!");
            } catch (e) {
                console.error("Error saving collection:", e);
                alert("❌ Failed to save collection.");
            }
        }
    };

    const toggleCollectionStatus = async (id: string) => {
        const col = collections.find(c => c.id === id);
        if (col) {
            try {
                await updateDoc(doc(db, "collections", id), { isActive: !col.isActive });
            } catch (e) {
                console.error("Error toggling collection:", e);
            }
        }
    };

    const deleteCollection = (id: string) => {
        const item = collections.find(c => c.id === id);
        if (item) {
            setConfirmModal({
                isOpen: true,
                type: "collection",
                id: id,
                name: item.title
            });
        }
    };

    const confirmDelete = async () => {
        try {
            if (confirmModal.type === "collection") {
                await deleteDoc(doc(db, "collections", confirmModal.id));
            } else {
                await deleteDoc(doc(db, "promotions", confirmModal.id));
            }
            setConfirmModal({ ...confirmModal, isOpen: false });
        } catch (e) {
            console.error("Error deleting item:", e);
            alert("❌ Failed to delete item.");
        }
    };

    // Promotion Handlers
    const handleSavePromotion = async () => {
        if (editingPromotion) {
            try {
                if (promotions.some(p => p.id === editingPromotion.id)) {
                    const { id, ...data } = editingPromotion;
                    await updateDoc(doc(db, "promotions", id), data);
                } else {
                    const { id, ...data } = editingPromotion;
                    await addDoc(collection(db, "promotions"), data);
                }
                setEditingPromotion(null);
                alert("✅ Promotion saved successfully!");
            } catch (e) {
                console.error("Error saving promotion:", e);
                alert("❌ Failed to save promotion.");
            }
        }
    };

    const togglePromotionStatus = async (id: string) => {
        const promo = promotions.find(p => p.id === id);
        if (promo) {
            try {
                await updateDoc(doc(db, "promotions", id), { isActive: !promo.isActive });
            } catch (e) {
                console.error("Error toggling promotion:", e);
            }
        }
    };

    const deletePromotion = (id: string) => {
        const item = promotions.find(p => p.id === id);
        if (item) {
            setConfirmModal({
                isOpen: true,
                type: "promotion",
                id: id,
                name: item.code
            });
        }
    };

    return (
        <div className="space-y-10 pb-20">
            {/* Header */}
            <div>
                <h2 className="text-sm font-bold tracking-[0.2em] text-gray-400 mb-1 uppercase">Content Management</h2>
                <h1 className="text-3xl font-bold tracking-tight">CMS STUDIO</h1>
            </div>

            {/* Tabs */}
            <div className="flex space-x-2 border-b border-gray-100">
                {["banners", "collections", "promotions"].map((tab) => (
                    <button
                        key={tab}
                        onClick={() => setActiveTab(tab)}
                        className={`px-6 py-3 text-xs font-black uppercase tracking-widest transition-all ${activeTab === tab
                            ? "border-b-2 border-black text-black"
                            : "text-gray-400 hover:text-black"
                            }`}
                    >
                        {tab}
                    </button>
                ))}
            </div>

            {/* Banners Tab */}
            {activeTab === "banners" && (
                <div className="space-y-8">
                    {/* Banner List */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {banners.map((banner) => (
                            <div key={banner.id} className="bg-white border border-gray-100 rounded-3xl overflow-hidden group hover:border-black transition-all">
                                <div className="relative h-48 bg-gray-100 overflow-hidden">
                                    <img
                                        src={banner.imageUrl}
                                        alt={banner.title}
                                        className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all"
                                    />
                                    <div className="absolute top-4 right-4">
                                        <span className={`px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest ${banner.isActive
                                            ? "bg-green-500 text-white"
                                            : "bg-gray-200 text-gray-500"
                                            }`}>
                                            {banner.isActive ? "LIVE" : "DRAFT"}
                                        </span>
                                    </div>
                                </div>
                                <div className="p-6">
                                    <h3 className="font-black text-lg mb-1">{banner.title}</h3>
                                    <p className="text-sm text-gray-500 mb-4">{banner.subtitle}</p>
                                    <div className="flex space-x-2">
                                        <button
                                            onClick={() => setEditingBanner(banner)}
                                            className="flex-1 bg-black text-white px-4 py-2 rounded-xl text-xs font-bold hover:bg-gray-800 transition-all"
                                        >
                                            EDIT
                                        </button>
                                        <button
                                            onClick={() => toggleBannerStatus(banner.id)}
                                            className="flex-1 border border-gray-200 px-4 py-2 rounded-xl text-xs font-bold hover:border-black transition-all"
                                        >
                                            {banner.isActive ? "DEACTIVATE" : "ACTIVATE"}
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Edit Modal */}
                    {editingBanner && (
                        <div
                            className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
                            role="dialog"
                            aria-modal="true"
                            aria-labelledby="banner-edit-title"
                        >
                            <div
                                ref={bannerModalRef}
                                tabIndex={-1}
                                className="bg-white rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto outline-none"
                            >
                                <div className="p-8 space-y-6">
                                    <div className="flex justify-between items-center">
                                        <h2 id="banner-edit-title" className="text-2xl font-black">EDIT BANNER</h2>
                                        <button
                                            onClick={() => { setEditingBanner(null); setPreviewImage(""); }}
                                            className="p-2 hover:bg-gray-100 rounded-full transition-all"
                                        >
                                            <X size={24} />
                                        </button>
                                    </div>

                                    {/* Image Upload */}
                                    <div>
                                        <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-2 block">Banner Image</label>
                                        <div className="relative aspect-[21/9] bg-gray-100 rounded-2xl overflow-hidden border-2 border-dashed border-gray-200 hover:border-black transition-all cursor-pointer group">
                                            {(previewImage || editingBanner.imageUrl) && (
                                                <img
                                                    src={previewImage || editingBanner.imageUrl}
                                                    alt="Preview"
                                                    className="w-full h-full object-cover"
                                                />
                                            )}
                                            <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/0 group-hover:bg-black/10 transition-all">
                                                <Upload size={32} className="text-gray-400 mb-2" />
                                                <p className="text-xs font-bold text-gray-500">Click to upload new image</p>
                                            </div>
                                            <input
                                                type="file"
                                                accept="image/*"
                                                onChange={handleImageUpload}
                                                className="absolute inset-0 opacity-0 cursor-pointer"
                                            />
                                        </div>
                                    </div>

                                    {/* Form Fields */}
                                    <div className="space-y-4">
                                        <div>
                                            <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-2 block">Title</label>
                                            <input
                                                type="text"
                                                value={editingBanner.title}
                                                onChange={(e) => setEditingBanner({ ...editingBanner, title: e.target.value })}
                                                className="w-full border-b border-gray-200 py-3 focus:border-black outline-none transition-colors text-black font-bold text-lg"
                                            />
                                        </div>
                                        <div>
                                            <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-2 block">Subtitle</label>
                                            <input
                                                type="text"
                                                value={editingBanner.subtitle}
                                                onChange={(e) => setEditingBanner({ ...editingBanner, subtitle: e.target.value })}
                                                className="w-full border-b border-gray-200 py-3 focus:border-black outline-none transition-colors text-black"
                                            />
                                        </div>
                                        <div>
                                            <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-2 block">CTA Button Text</label>
                                            <input
                                                type="text"
                                                value={editingBanner.ctaText}
                                                onChange={(e) => setEditingBanner({ ...editingBanner, ctaText: e.target.value })}
                                                className="w-full border-b border-gray-200 py-3 focus:border-black outline-none transition-colors text-black font-bold"
                                            />
                                        </div>
                                    </div>

                                    {/* Actions */}
                                    <div className="flex space-x-4 pt-4">
                                        <button
                                            onClick={handleSaveBanner}
                                            className="flex-1 bg-black text-white px-6 py-4 rounded-full font-bold text-sm tracking-widest hover:bg-gray-800 transition-all flex items-center justify-center"
                                        >
                                            <Save size={18} className="mr-2" />
                                            SAVE CHANGES
                                        </button>
                                        <button
                                            onClick={() => { setEditingBanner(null); setPreviewImage(""); }}
                                            className="px-6 py-4 border border-gray-200 rounded-full font-bold text-sm tracking-widest hover:border-black transition-all"
                                        >
                                            CANCEL
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            )}

            {/* Collections Tab */}
            {activeTab === "collections" && (
                <div className="space-y-8">
                    <div className="flex justify-end">
                        <button
                            onClick={() => setEditingCollection({
                                id: Date.now().toString(),
                                title: "",
                                description: "",
                                imageUrl: "",
                                itemCount: 0,
                                isActive: true
                            })}
                            className="bg-black text-white px-6 py-3 rounded-xl text-xs font-bold hover:bg-gray-800 transition-all flex items-center"
                        >
                            <Plus size={16} className="mr-2" />
                            CREATE COLLECTION
                        </button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {collections.map((collection) => (
                            <div key={collection.id} className="bg-white border border-gray-100 rounded-3xl overflow-hidden group hover:border-black transition-all">
                                <div className="relative h-48 bg-gray-100 overflow-hidden">
                                    <img
                                        src={collection.imageUrl || "/placeholder.png"}
                                        alt={collection.title}
                                        className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all"
                                    />
                                    <div className="absolute top-4 right-4">
                                        <span className={`px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest ${collection.isActive
                                            ? "bg-green-500 text-white"
                                            : "bg-gray-200 text-gray-500"
                                            }`}>
                                            {collection.isActive ? "ACTIVE" : "HIDDEN"}
                                        </span>
                                    </div>
                                </div>
                                <div className="p-6">
                                    <div className="flex justify-between items-start mb-2">
                                        <h3 className="font-black text-lg">{collection.title}</h3>
                                        <span className="text-xs font-bold text-gray-400 bg-gray-50 px-2 py-1 rounded-lg">{collection.itemCount} Items</span>
                                    </div>
                                    <p className="text-sm text-gray-500 mb-4">{collection.description}</p>
                                    <div className="flex space-x-2">
                                        <button
                                            onClick={() => setEditingCollection(collection)}
                                            className="flex-1 bg-black text-white px-4 py-2 rounded-xl text-xs font-bold hover:bg-gray-800 transition-all"
                                        >
                                            EDIT
                                        </button>
                                        <button
                                            onClick={() => deleteCollection(collection.id)}
                                            className="p-2 border border-gray-200 rounded-xl text-red-500 hover:bg-red-50 hover:border-red-200 transition-all"
                                        >
                                            <Trash2 size={16} />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Edit Collection Modal */}
                    {editingCollection && (
                        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                            <div className="bg-white rounded-3xl max-w-lg w-full max-h-[90vh] overflow-y-auto">
                                <div className="p-8 space-y-6">
                                    <div className="flex justify-between items-center">
                                        <h2 className="text-2xl font-black">
                                            {collections.find(c => c.id === editingCollection.id) ? "EDIT COLLECTION" : "NEW COLLECTION"}
                                        </h2>
                                        <button
                                            onClick={() => { setEditingCollection(null); setPreviewImage(""); }}
                                            className="p-2 hover:bg-gray-100 rounded-full transition-all"
                                        >
                                            <X size={24} />
                                        </button>
                                    </div>

                                    <div>
                                        <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-2 block">Cover Image</label>
                                        <div className="relative aspect-video bg-gray-100 rounded-2xl overflow-hidden border-2 border-dashed border-gray-200 hover:border-black transition-all cursor-pointer group">
                                            {(previewImage || editingCollection.imageUrl) && (
                                                <img
                                                    src={previewImage || editingCollection.imageUrl}
                                                    alt="Preview"
                                                    className="w-full h-full object-cover"
                                                />
                                            )}
                                            <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/0 group-hover:bg-black/10 transition-all">
                                                <Upload size={32} className="text-gray-400 mb-2" />
                                                <p className="text-xs font-bold text-gray-500">Upload Image</p>
                                            </div>
                                            <input
                                                type="file"
                                                accept="image/*"
                                                onChange={handleImageUpload}
                                                className="absolute inset-0 opacity-0 cursor-pointer"
                                            />
                                        </div>
                                    </div>

                                    <div className="space-y-4">
                                        <div>
                                            <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-2 block">Title</label>
                                            <input
                                                type="text"
                                                value={editingCollection.title}
                                                onChange={(e) => setEditingCollection({ ...editingCollection, title: e.target.value })}
                                                className="w-full border-b border-gray-200 py-3 focus:border-black outline-none transition-colors text-black font-bold text-lg"
                                                placeholder="e.g. Summer Essentials"
                                            />
                                        </div>
                                        <div>
                                            <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-2 block">Description</label>
                                            <textarea
                                                value={editingCollection.description}
                                                onChange={(e) => setEditingCollection({ ...editingCollection, description: e.target.value })}
                                                className="w-full border-b border-gray-200 py-3 focus:border-black outline-none transition-colors text-black resize-none"
                                                rows={2}
                                                placeholder="Brief description of this collection..."
                                            />
                                        </div>
                                        <div>
                                            <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-2 block">Item Count (Manual Override)</label>
                                            <input
                                                type="number"
                                                value={editingCollection.itemCount}
                                                onChange={(e) => setEditingCollection({ ...editingCollection, itemCount: parseInt(e.target.value) || 0 })}
                                                className="w-full border-b border-gray-200 py-3 focus:border-black outline-none transition-colors text-black font-bold"
                                            />
                                        </div>
                                        <div className="flex items-center space-x-3 pt-2">
                                            <button
                                                onClick={() => setEditingCollection({ ...editingCollection, isActive: !editingCollection.isActive })}
                                                className={`w-12 h-6 rounded-full transition-colors relative ${editingCollection.isActive ? "bg-black" : "bg-gray-200"}`}
                                            >
                                                <div className={`w-4 h-4 bg-white rounded-full absolute top-1 transition-all ${editingCollection.isActive ? "left-7" : "left-1"}`} />
                                            </button>
                                            <span className="text-xs font-bold text-gray-500">{editingCollection.isActive ? "Visible in Store" : "Hidden from Store"}</span>
                                        </div>
                                    </div>

                                    <button
                                        onClick={handleSaveCollection}
                                        className="w-full bg-black text-white px-6 py-4 rounded-full font-bold text-sm tracking-widest hover:bg-gray-800 transition-all flex items-center justify-center"
                                    >
                                        <Save size={18} className="mr-2" />
                                        SAVE COLLECTION
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            )}

            {/* Promotions Tab */}
            {activeTab === "promotions" && (
                <div className="space-y-8">
                    <div className="flex justify-end">
                        <button
                            onClick={() => setEditingPromotion({
                                id: Date.now().toString(),
                                code: "",
                                discount: "",
                                description: "",
                                isActive: true
                            })}
                            className="bg-black text-white px-6 py-3 rounded-xl text-xs font-bold hover:bg-gray-800 transition-all flex items-center"
                        >
                            <Plus size={16} className="mr-2" />
                            NEW PROMOTION
                        </button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {promotions.map((promo) => (
                            <div key={promo.id} className="bg-white border border-gray-100 p-6 rounded-3xl group hover:border-black transition-all relative overflow-hidden">
                                <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                                    <Tag size={100} className="transform rotate-12" />
                                </div>
                                <div className="relative z-10">
                                    <div className="flex justify-between items-start mb-6">
                                        <div className="p-3 bg-gray-50 rounded-xl">
                                            <Percent size={24} />
                                        </div>
                                        <button
                                            onClick={() => togglePromotionStatus(promo.id)}
                                            className={`w-10 h-5 rounded-full transition-colors relative ${promo.isActive ? "bg-green-500" : "bg-gray-200"}`}
                                        >
                                            <div className={`w-3 h-3 bg-white rounded-full absolute top-1 transition-all ${promo.isActive ? "left-6" : "left-1"}`} />
                                        </button>
                                    </div>
                                    <h3 className="font-black text-2xl tracking-tight mb-1">{promo.code}</h3>
                                    <p className="text-sm font-bold text-black mb-2">{promo.discount}</p>
                                    <p className="text-xs text-gray-500 mb-6">{promo.description}</p>

                                    <div className="flex space-x-2">
                                        <button
                                            onClick={() => setEditingPromotion(promo)}
                                            className="flex-1 bg-black text-white px-4 py-2 rounded-xl text-xs font-bold hover:bg-gray-800 transition-all"
                                        >
                                            EDIT
                                        </button>
                                        <button
                                            onClick={() => deletePromotion(promo.id)}
                                            className="p-2 border border-gray-200 rounded-xl text-red-500 hover:bg-red-50 hover:border-red-200 transition-all"
                                        >
                                            <Trash2 size={16} />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Edit Promotion Modal */}
                    {editingPromotion && (
                        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                            <div className="bg-white rounded-3xl max-w-sm w-full">
                                <div className="p-8 space-y-6">
                                    <div className="flex justify-between items-center">
                                        <h2 className="text-xl font-black">PROMOTION DETAILS</h2>
                                        <button
                                            onClick={() => setEditingPromotion(null)}
                                            className="p-2 hover:bg-gray-100 rounded-full transition-all"
                                        >
                                            <X size={20} />
                                        </button>
                                    </div>

                                    <div className="space-y-4">
                                        <div>
                                            <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-2 block">Promo Code</label>
                                            <input
                                                type="text"
                                                value={editingPromotion.code}
                                                onChange={(e) => setEditingPromotion({ ...editingPromotion, code: e.target.value.toUpperCase() })}
                                                className="w-full border-b border-gray-200 py-3 focus:border-black outline-none transition-colors text-black font-black text-xl tracking-widest uppercase"
                                                placeholder="CODE"
                                            />
                                        </div>
                                        <div>
                                            <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-2 block">Discount Value</label>
                                            <input
                                                type="text"
                                                value={editingPromotion.discount}
                                                onChange={(e) => setEditingPromotion({ ...editingPromotion, discount: e.target.value })}
                                                className="w-full border-b border-gray-200 py-3 focus:border-black outline-none transition-colors text-black font-bold"
                                                placeholder="e.g. 20% OFF or $50 OFF"
                                            />
                                        </div>
                                        <div>
                                            <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-2 block">Description</label>
                                            <textarea
                                                value={editingPromotion.description}
                                                onChange={(e) => setEditingPromotion({ ...editingPromotion, description: e.target.value })}
                                                className="w-full border-b border-gray-200 py-3 focus:border-black outline-none transition-colors text-black resize-none"
                                                rows={2}
                                                placeholder="Terms or description..."
                                            />
                                        </div>
                                    </div>

                                    <button
                                        onClick={handleSavePromotion}
                                        className="w-full bg-black text-white px-6 py-4 rounded-full font-bold text-sm tracking-widest hover:bg-gray-800 transition-all flex items-center justify-center"
                                    >
                                        <Save size={18} className="mr-2" />
                                        SAVE PROMO
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            )}
            {/* Deletion Confirmation Modal */}
            {confirmModal.isOpen && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-[60] p-4">
                    <div className="bg-white rounded-3xl max-w-sm w-full p-8 space-y-6 shadow-2xl">
                        <div className="text-center space-y-2">
                            <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-4">
                                <Trash2 className="text-red-500" size={32} />
                            </div>
                            <h2 className="text-xl font-black uppercase tracking-tight">Confirm Deletion</h2>
                            <p className="text-sm text-gray-500">
                                Are you sure you want to delete <span className="font-bold text-black">{confirmModal.name}</span>? This action cannot be undone.
                            </p>
                        </div>
                        <div className="flex space-x-3">
                            <button
                                onClick={() => setConfirmModal({ ...confirmModal, isOpen: false })}
                                className="flex-1 px-4 py-3 border border-gray-100 rounded-xl text-xs font-bold hover:border-black transition-all"
                            >
                                CANCEL
                            </button>
                            <button
                                onClick={confirmDelete}
                                className="flex-1 bg-red-500 text-white px-4 py-3 rounded-xl text-xs font-bold hover:bg-red-600 transition-all"
                            >
                                DELETE
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
