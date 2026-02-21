
/**
 * VELORA – Complete Products Seeder (Refactored)
 * Seeds all products into Firestore "products" collection
 * 
 * Usage: node seed_velora_products.js
 */

const { initializeApp } = require("firebase/app");
const {
    getFirestore,
    collection,
    addDoc,
    serverTimestamp
} = require("firebase/firestore");

// Import Data
const MEN_PRODUCTS = require("./seed_data_men");
const WOMEN_PRODUCTS = require("./seed_data_women");
const SHOES_PRODUCTS = require("./seed_data_shoes");
const ACCESSORIES_PRODUCTS = require("./seed_data_accessories");
const COLLECTION_PRODUCTS = require("./seed_data_collections");

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

// ═══════════════════════════════════════════════════════════════
// 🚀 SEED FUNCTION
// ═══════════════════════════════════════════════════════════════
async function seedProducts() {
    const ALL_PRODUCTS = [
        ...MEN_PRODUCTS,
        ...WOMEN_PRODUCTS,
        ...SHOES_PRODUCTS,
        ...ACCESSORIES_PRODUCTS,
        ...COLLECTION_PRODUCTS
    ];

    console.log("╔══════════════════════════════════════════════════════╗");
    console.log("║   VELORA – Product Seeder                           ║");
    console.log("║   Adding " + ALL_PRODUCTS.length + " products to Firestore...              ║");
    console.log("╚══════════════════════════════════════════════════════╝\n");

    let success = 0;
    let failed = 0;
    const startTime = Date.now();

    for (const product of ALL_PRODUCTS) {
        try {
            const dataToSeed = {
                ...product,
                createdAt: serverTimestamp(),
                updatedAt: serverTimestamp()
            };

            // Remove nulls if any (e.g. discountPrice) if not needed, but Firestore handles nulls fine.
            // Ensure numbers are numbers

            const docRef = await addDoc(collection(db, "products"), dataToSeed);
            console.log(`  ✅ [${product.category}] ${product.name} (${docRef.id})`);
            success++;
        } catch (e) {
            console.error(`  ❌ [${product.category}] ${product.name}: ${e.message}`);
            failed++;
        }
    }

    const elapsed = ((Date.now() - startTime) / 1000).toFixed(2);

    console.log("\n╔══════════════════════════════════════════════════════╗");
    console.log("║   📊 SEEDING RESULTS                                ║");
    console.log("╠══════════════════════════════════════════════════════╣");
    console.log(`║   ✅ Successful:   ${String(success).padEnd(31)}║`);
    console.log(`║   ❌ Failed:       ${String(failed).padEnd(31)}║`);
    console.log(`║   ⏱  Time:         ${String(elapsed + "s").padEnd(31)}║`);
    console.log("╚══════════════════════════════════════════════════════╝");

    if (failed > 0) {
        process.exit(1);
    } else {
        console.log("\n🎉 All products added successfully!");
        process.exit(0);
    }
}

seedProducts();
