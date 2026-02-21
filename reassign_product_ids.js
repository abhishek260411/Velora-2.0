/**
 * VELORA – Reassign Product IDs to Sequential Numbers
 * 
 * Old Seed:  1 – 42
 * New Batch: 43 – 252
 * 
 * Strategy:
 *   1. Fetch all products
 *   2. Separate into old/new using seed data names
 *   3. Sort each group by category → subCategory → name
 *   4. Create new docs with IDs "1","2","3"...
 *   5. Delete old docs
 * 
 * Usage: node reassign_product_ids.js
 */

const { initializeApp } = require("firebase/app");
const {
    getFirestore,
    collection,
    getDocs,
    doc,
    setDoc,
    deleteDoc
} = require("firebase/firestore");

// Load seed data names for the 220 batch
const MEN_PRODUCTS = require("./seed_data_men");
const WOMEN_PRODUCTS = require("./seed_data_women");
const SHOES_PRODUCTS = require("./seed_data_shoes");
const ACCESSORIES_PRODUCTS = require("./seed_data_accessories");
const COLLECTION_PRODUCTS = require("./seed_data_collections");

const BATCH_220_NAMES = new Set([
    ...MEN_PRODUCTS, ...WOMEN_PRODUCTS, ...SHOES_PRODUCTS,
    ...ACCESSORIES_PRODUCTS, ...COLLECTION_PRODUCTS
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

const sortFn = (a, b) => {
    const catA = a.data.category || a.data.categoryId || "ZZZ";
    const catB = b.data.category || b.data.categoryId || "ZZZ";
    if (catA !== catB) return catA.localeCompare(catB);
    const subA = a.data.subCategory || "General";
    const subB = b.data.subCategory || "General";
    if (subA !== subB) return subA.localeCompare(subB);
    return (a.data.name || "").localeCompare(b.data.name || "");
};

async function reassignIds() {
    console.log("╔══════════════════════════════════════════════════════════╗");
    console.log("║   VELORA – Reassign Product IDs (1 to 252)              ║");
    console.log("╚══════════════════════════════════════════════════════════╝\n");

    // Step 1: Fetch all products
    console.log("📥 Fetching all products...");
    const snapshot = await getDocs(collection(db, "products"));
    const allProducts = [];
    snapshot.forEach(docSnap => {
        allProducts.push({ oldId: docSnap.id, data: docSnap.data() });
    });
    console.log(`   Found ${allProducts.length} products.\n`);

    // Step 2: Separate old vs new
    const oldProducts = allProducts.filter(p => !BATCH_220_NAMES.has(p.data.name));
    const newProducts = allProducts.filter(p => BATCH_220_NAMES.has(p.data.name));

    // Step 3: Sort each group
    oldProducts.sort(sortFn);
    newProducts.sort(sortFn);

    console.log(`   Old Seed products:  ${oldProducts.length}`);
    console.log(`   New Batch products: ${newProducts.length}`);
    console.log(`   Total:              ${oldProducts.length + newProducts.length}\n`);

    // Step 4: Build the ordered list with new IDs
    const ordered = [];
    let id = 1;
    for (const p of oldProducts) {
        ordered.push({ newId: String(id), oldId: p.oldId, data: p.data });
        id++;
    }
    for (const p of newProducts) {
        ordered.push({ newId: String(id), oldId: p.oldId, data: p.data });
        id++;
    }

    console.log("╔══════════════════════════════════════════════════════════╗");
    console.log("║   🚀 PHASE 1: Creating new documents with numeric IDs  ║");
    console.log("╚══════════════════════════════════════════════════════════╝\n");

    let created = 0;
    let createFailed = 0;

    for (const item of ordered) {
        try {
            const newDocRef = doc(db, "products", item.newId);
            await setDoc(newDocRef, item.data);
            console.log(`  ✅ [${item.newId}] ${item.data.name}  (old: ${item.oldId})`);
            created++;
        } catch (e) {
            console.error(`  ❌ [${item.newId}] ${item.data.name}: ${e.message}`);
            createFailed++;
        }
    }

    console.log(`\n  Created: ${created} | Failed: ${createFailed}\n`);

    if (createFailed > 0) {
        console.error("⚠️  Some creates failed. Aborting delete phase to avoid data loss.");
        process.exit(1);
    }

    console.log("╔══════════════════════════════════════════════════════════╗");
    console.log("║   🗑️  PHASE 2: Deleting old documents                   ║");
    console.log("╚══════════════════════════════════════════════════════════╝\n");

    // Collect old IDs that need deletion (exclude any that are the same as new IDs)
    const newIdSet = new Set(ordered.map(o => o.newId));
    const toDelete = ordered.filter(o => o.oldId !== o.newId && !newIdSet.has(o.oldId));
    // Also handle case where old ID matches a different product's new ID
    // We need to be careful: only delete old IDs that are NOT also new IDs
    const oldIdsToDelete = [];
    const allOldIds = ordered.map(o => o.oldId);
    for (const item of ordered) {
        if (item.oldId !== item.newId) {
            // Only delete if this old ID is not being used as another product's new ID
            // (numeric IDs 1-252 could potentially collide with existing random IDs, but very unlikely)
            if (!newIdSet.has(item.oldId)) {
                oldIdsToDelete.push(item.oldId);
            }
        }
    }

    let deleted = 0;
    let deleteFailed = 0;

    for (const oldId of oldIdsToDelete) {
        try {
            await deleteDoc(doc(db, "products", oldId));
            console.log(`  🗑️  Deleted old: ${oldId}`);
            deleted++;
        } catch (e) {
            console.error(`  ❌ Failed to delete: ${oldId}: ${e.message}`);
            deleteFailed++;
        }
    }

    console.log("\n╔══════════════════════════════════════════════════════════╗");
    console.log("║   📊 FINAL RESULTS                                      ║");
    console.log("╠══════════════════════════════════════════════════════════╣");
    console.log(`║   ✅ New docs created:    ${String(created).padEnd(30)}║`);
    console.log(`║   🗑️  Old docs deleted:    ${String(deleted).padEnd(30)}║`);
    console.log(`║   ❌ Create failures:     ${String(createFailed).padEnd(30)}║`);
    console.log(`║   ❌ Delete failures:     ${String(deleteFailed).padEnd(30)}║`);
    console.log(`║   📦 Product IDs now:     1 to ${String(ordered.length).padEnd(24)}║`);
    console.log("╚══════════════════════════════════════════════════════════╝");

    console.log("\n🎉 All products now have sequential IDs from 1 to " + ordered.length + "!");
    process.exit(0);
}

reassignIds().catch(err => {
    console.error("Fatal error:", err.message);
    process.exit(1);
});
