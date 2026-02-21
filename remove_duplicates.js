/**
 * VELORA – Remove Duplicate Products from Firestore
 * 
 * Strategy:
 *   1. Fetch all products
 *   2. Group by name
 *   3. For duplicates, keep the BEST one (proper category name, most fields)
 *   4. Delete the rest
 * 
 * Usage: node remove_duplicates.js
 */

const { initializeApp } = require("firebase/app");
const {
    getFirestore,
    collection,
    getDocs,
    doc,
    deleteDoc
} = require("firebase/firestore");

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

// Valid readable category names
const VALID_CATEGORIES = ["Men", "Women", "Shoes", "Accessories"];

function scoreProduct(data) {
    let score = 0;
    // Prefer products with readable category names
    if (VALID_CATEGORIES.includes(data.category)) score += 10;
    if (VALID_CATEGORIES.includes(data.categoryId)) score += 10;
    // Prefer products with subCategory
    if (data.subCategory && data.subCategory !== "N/A" && data.subCategory !== "General") score += 5;
    // Prefer products with more fields filled
    if (data.brand) score += 1;
    if (data.description) score += 1;
    if (data.image) score += 1;
    if (data.stock) score += 1;
    if (data.sizes && data.sizes.length > 0) score += 1;
    if (data.isAvailable !== undefined) score += 1;
    if (data.rating) score += 1;
    return score;
}

async function removeDuplicates() {
    console.log("╔══════════════════════════════════════════════════════════╗");
    console.log("║   VELORA – Duplicate Product Remover                    ║");
    console.log("╚══════════════════════════════════════════════════════════╝\n");

    // Step 1: Fetch all products
    console.log("📥 Fetching all products from Firestore...");
    const snapshot = await getDocs(collection(db, "products"));
    const allProducts = [];

    snapshot.forEach(docSnap => {
        allProducts.push({
            id: docSnap.id,
            data: docSnap.data()
        });
    });

    console.log(`   Total products in Firestore: ${allProducts.length}\n`);

    // Step 2: Group by name
    const grouped = {};
    for (const product of allProducts) {
        const name = product.data.name;
        if (!grouped[name]) grouped[name] = [];
        grouped[name].push(product);
    }

    // Step 3: Find duplicates
    const duplicateGroups = Object.entries(grouped).filter(([_, items]) => items.length > 1);
    const toDelete = [];

    console.log("╔══════════════════════════════════════════════════════════╗");
    console.log("║   🔍 DUPLICATE ANALYSIS                                 ║");
    console.log("╚══════════════════════════════════════════════════════════╝\n");

    if (duplicateGroups.length === 0) {
        console.log("  ✅ No duplicates found!");
        process.exit(0);
    }

    console.log(`  Found ${duplicateGroups.length} products with duplicates:\n`);

    for (const [name, items] of duplicateGroups) {
        console.log(`  📦 "${name}" — ${items.length} copies`);

        // Score each copy
        const scored = items.map(item => ({
            ...item,
            score: scoreProduct(item.data)
        }));

        // Sort by score descending — keep the highest scored one
        scored.sort((a, b) => b.score - a.score);

        const keeper = scored[0];
        const duplicates = scored.slice(1);

        console.log(`     ✅ KEEP:   ID=${keeper.id} | category="${keeper.data.category || keeper.data.categoryId}" | score=${keeper.score}`);
        for (const dup of duplicates) {
            console.log(`     ❌ DELETE: ID=${dup.id} | category="${dup.data.category || dup.data.categoryId}" | score=${dup.score}`);
            toDelete.push(dup);
        }
        console.log();
    }

    console.log("╔══════════════════════════════════════════════════════════╗");
    console.log(`║   🗑️  Deleting ${toDelete.length} duplicate products...                  ║`);
    console.log("╚══════════════════════════════════════════════════════════╝\n");

    let deleted = 0;
    let failed = 0;

    for (const item of toDelete) {
        try {
            await deleteDoc(doc(db, "products", item.id));
            console.log(`  ✅ Deleted: "${item.data.name}" (${item.id})`);
            deleted++;
        } catch (e) {
            console.error(`  ❌ Failed to delete: "${item.data.name}" (${item.id}): ${e.message}`);
            failed++;
        }
    }

    console.log("\n╔══════════════════════════════════════════════════════════╗");
    console.log("║   📊 RESULTS                                            ║");
    console.log("╠══════════════════════════════════════════════════════════╣");
    console.log(`║   Total products before:   ${String(allProducts.length).padEnd(29)}║`);
    console.log(`║   Duplicates found:        ${String(toDelete.length).padEnd(29)}║`);
    console.log(`║   Successfully deleted:    ${String(deleted).padEnd(29)}║`);
    console.log(`║   Failed to delete:        ${String(failed).padEnd(29)}║`);
    console.log(`║   Total products after:    ${String(allProducts.length - deleted).padEnd(29)}║`);
    console.log("╚══════════════════════════════════════════════════════════╝");

    process.exit(0);
}

removeDuplicates().catch(err => {
    console.error("Error:", err.message);
    process.exit(1);
});
