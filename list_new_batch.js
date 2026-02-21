/**
 * List products with IDs 43 to 252
 */

const { initializeApp } = require("firebase/app");
const { getFirestore, doc, getDoc } = require("firebase/firestore");

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

async function listNewBatch() {
    console.log("# Phase 2 – New 220 Batch Products (IDs 43-252)\n");

    // We can fetch them in parallel for speed
    const promises = [];
    for (let i = 43; i <= 252; i++) {
        promises.push(getDoc(doc(db, "products", String(i))).then(snap => ({ id: i, snap })));
    }

    const results = await Promise.all(promises);

    // Filter out any that might be missing (shouldn't be) and sort by ID
    const products = results
        .filter(r => r.snap.exists())
        .map(r => {
            const d = r.snap.data();
            return {
                id: r.id,
                name: d.name,
                category: d.category || d.categoryId,
                subCategory: d.subCategory
            };
        })
        .sort((a, b) => a.id - b.id);

    // Print table
    console.log("| ID | Name | Category | SubCategory |");
    console.log("|---|---|---|---|");

    for (const p of products) {
        console.log(`| ${p.id} | ${p.name} | ${p.category} | ${p.subCategory} |`);
    }

    process.exit(0);
}

listNewBatch().catch(console.error);
