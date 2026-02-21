/**
 * VELORA – Unified Product Seeder
 * Seeds ALL product data files into Firestore:
 *   - Men (30), Women (30), Shoes (60), Accessories (40), Collections (60+)
 * Skips duplicates by checking product name.
 * 
 * Usage: node seed_all_products.js
 */

const { initializeApp } = require("firebase/app");
const { getFirestore, collection, addDoc, serverTimestamp, query, where, getDocs } = require("firebase/firestore");

// ─── Firebase Config ─────────────────────────────────────────────
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

// ─── Load all data files ─────────────────────────────────────────
const menProducts = require("./seed_data_men.js");
const womenProducts = require("./seed_data_women.js");
const shoesProducts = require("./seed_data_shoes.js");
const accessoriesProducts = require("./seed_data_accessories.js");
const collectionProducts = require("./seed_data_collections.js");

// ─── Merge all products ──────────────────────────────────────────
const ALL_PRODUCTS = [
    ...menProducts,
    ...womenProducts,
    ...shoesProducts,
    ...accessoriesProducts,
    ...collectionProducts
];

// ─── Seed Function ───────────────────────────────────────────────
async function seedAll() {
    console.log("╔══════════════════════════════════════════════════╗");
    console.log("║   VELORA – Unified Product Seeder               ║");
    console.log("╚══════════════════════════════════════════════════╝");
    console.log(`\nTotal products to process: ${ALL_PRODUCTS.length}`);
    console.log(`  Men:          ${menProducts.length}`);
    console.log(`  Women:        ${womenProducts.length}`);
    console.log(`  Shoes:        ${shoesProducts.length}`);
    console.log(`  Accessories:  ${accessoriesProducts.length}`);
    console.log(`  Collections:  ${collectionProducts.length}`);
    console.log("");

    let added = 0;
    let skipped = 0;
    let failed = 0;

    for (let i = 0; i < ALL_PRODUCTS.length; i++) {
        const item = ALL_PRODUCTS[i];
        const progress = `[${i + 1}/${ALL_PRODUCTS.length}]`;

        try {
            // Check for duplicate by name
            const q = query(collection(db, "products"), where("name", "==", item.name));
            const snap = await getDocs(q);

            if (!snap.empty) {
                console.log(`${progress} ⚠️ Skipped (exists): ${item.name}`);
                skipped++;
                continue;
            }

            // Build the product document
            const productDoc = {
                name: item.name,
                description: item.description,
                brand: "Velora",
                price: item.price,
                stock: item.stock,
                image: item.image,
                category: item.category || item.categoryId || "General",
                categoryId: item.categoryId || item.category || "General",
                subCategory: item.subCategory || "General",
                isAvailable: item.isAvailable !== undefined ? item.isAvailable : true,
                isNewArrival: item.isNewArrival || false,
                isTrending: item.isTrending || false,
                isOnSale: item.isOnSale || false,
                discountPrice: item.discountPrice || null,
                rating: 4.5,
                reviews: 0,
                createdAt: serverTimestamp(),
                updatedAt: serverTimestamp()
            };

            await addDoc(collection(db, "products"), productDoc);
            console.log(`${progress} ✅ Added: ${item.name}`);
            added++;
        } catch (e) {
            console.error(`${progress} ❌ Failed: ${item.name} – ${e.message}`);
            failed++;
        }
    }

    console.log("\n╔══════════════════════════════════════════════════╗");
    console.log("║   📊 SEEDING RESULTS                            ║");
    console.log("╠══════════════════════════════════════════════════╣");
    console.log(`║   ✅ Added:    ${String(added).padEnd(34)}║`);
    console.log(`║   ⚠️ Skipped:  ${String(skipped).padEnd(34)}║`);
    console.log(`║   ❌ Failed:   ${String(failed).padEnd(34)}║`);
    console.log(`║   📦 Total:    ${String(ALL_PRODUCTS.length).padEnd(34)}║`);
    console.log("╚══════════════════════════════════════════════════╝");

    process.exit(0);
}

seedAll();
