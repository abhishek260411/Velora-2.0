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

require('dotenv').config();

const firebaseConfig = {
    apiKey: process.env.FIREBASE_API_KEY,
    authDomain: process.env.FIREBASE_AUTH_DOMAIN,
    projectId: process.env.FIREBASE_PROJECT_ID,
    storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
    messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID,
    appId: process.env.FIREBASE_APP_ID,
    measurementId: process.env.FIREBASE_MEASUREMENT_ID
};

if (!firebaseConfig.apiKey) {
    console.error("Missing FIREBASE_API_KEY environment variable. Make sure to set up your .env file.");
    process.exit(1);
}

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
            createdAt: (() => {
                if (data.createdAt && typeof data.createdAt.toDate === 'function') {
                    return data.createdAt.toDate();
                } else if (data.createdAt instanceof Date) {
                    return data.createdAt;
                } else {
                    const parsed = new Date(data.createdAt);
                    return isNaN(parsed.getTime()) ? null : parsed;
                }
            })()
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
