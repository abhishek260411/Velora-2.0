/**
 * List all products that were added BEFORE the 220-product batch.
 * Strategy: Fetch all products, sort by createdAt, and identify the ones
 * that are NOT in the 220-product seed data files.
 */

const { initializeApp } = require("firebase/app");
const { getFirestore, collection, getDocs } = require("firebase/firestore");

// Load the 220 product names from seed files
const MEN_PRODUCTS = require("./seed_data_men");
const WOMEN_PRODUCTS = require("./seed_data_women");
const SHOES_PRODUCTS = require("./seed_data_shoes");
const ACCESSORIES_PRODUCTS = require("./seed_data_accessories");
const COLLECTION_PRODUCTS = require("./seed_data_collections");

const ALL_220_NAMES = new Set([
    ...MEN_PRODUCTS,
    ...WOMEN_PRODUCTS,
    ...SHOES_PRODUCTS,
    ...ACCESSORIES_PRODUCTS,
    ...COLLECTION_PRODUCTS
].map(p => p.name));

const firebaseConfig = {
    apiKey: "AIzaSyDm4c8eTKQ0KCU9qBP7ZEgC_kKuRBNq28U",
    authDomain: "velora-4a1d9.firebaseapp.com",
    projectId: "velora-4a1d9",
    storageBucket: "velora-4a1d9.firebasestorage.app",
    messagingSenderId: "325400175963",
    appId: "1:325400175963:web:2534fb0f9610e05cfb267e",
    measurementId: "G-Y28VRJZ14C"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

async function listOldProducts() {
    console.log("╔══════════════════════════════════════════════════════════╗");
    console.log("║   Fetching ALL products from Firestore...               ║");
    console.log("╚══════════════════════════════════════════════════════════╝\n");

    const snapshot = await getDocs(collection(db, "products"));
    const allProducts = [];

    snapshot.forEach(doc => {
        const data = doc.data();
        allProducts.push({
            id: doc.id,
            name: data.name,
            category: data.category || data.categoryId || "N/A",
            subCategory: data.subCategory || "N/A",
            price: data.price,
            brand: data.brand || "N/A",
            createdAt: data.createdAt ? data.createdAt.toDate() : null
        });
    });

    console.log(`Total products in Firestore: ${allProducts.length}`);
    console.log(`Products in 220-batch seed files: ${ALL_220_NAMES.size}\n`);

    // Find products NOT in the 220 batch
    const oldProducts = allProducts.filter(p => !ALL_220_NAMES.has(p.name));

    // Also find products that ARE in the 220 batch (for comparison)
    const batchProducts = allProducts.filter(p => ALL_220_NAMES.has(p.name));

    console.log("╔══════════════════════════════════════════════════════════╗");
    console.log("║   📋 PRODUCTS ADDED BEFORE THE 220 BATCH               ║");
    console.log("╠══════════════════════════════════════════════════════════╣");
    console.log(`║   Count: ${oldProducts.length}                                            ║`);
    console.log("╚══════════════════════════════════════════════════════════╝\n");

    if (oldProducts.length === 0) {
        console.log("  No products found outside the 220-batch.\n");
    } else {
        // Sort by category for readability
        oldProducts.sort((a, b) => {
            if (a.category !== b.category) return a.category.localeCompare(b.category);
            if (a.subCategory !== b.subCategory) return a.subCategory.localeCompare(b.subCategory);
            return a.name.localeCompare(b.name);
        });

        let currentCategory = "";
        let idx = 1;
        for (const p of oldProducts) {
            if (p.category !== currentCategory) {
                currentCategory = p.category;
                console.log(`\n  ── ${currentCategory.toUpperCase()} ──`);
            }
            console.log(`  ${String(idx).padStart(3)}. ${p.name}`);
            console.log(`       SubCategory: ${p.subCategory} | Price: ₹${p.price} | Brand: ${p.brand}`);
            console.log(`       Firestore ID: ${p.id}`);
            if (p.createdAt) {
                console.log(`       Created: ${p.createdAt.toISOString()}`);
            }
            idx++;
        }
    }

    console.log(`\n\n  📊 Summary:`);
    console.log(`     Old/Pre-batch products:  ${oldProducts.length}`);
    console.log(`     220-batch products:       ${batchProducts.length}`);
    console.log(`     Total in Firestore:       ${allProducts.length}`);

    process.exit(0);
}

listOldProducts().catch(err => {
    console.error("Error:", err.message);
    process.exit(1);
});
