/**
 * Generate PRD of all products, divided into Old Seeded and New Seeded.
 */

const { initializeApp } = require("firebase/app");
const { getFirestore, collection, getDocs } = require("firebase/firestore");

const MEN_PRODUCTS = require("./seed_data_men");
const WOMEN_PRODUCTS = require("./seed_data_women");
const SHOES_PRODUCTS = require("./seed_data_shoes");
const ACCESSORIES_PRODUCTS = require("./seed_data_accessories");
const COLLECTION_PRODUCTS = require("./seed_data_collections");

const ALL_220_NAMES = new Set([
    ...MEN_PRODUCTS, ...WOMEN_PRODUCTS, ...SHOES_PRODUCTS,
    ...ACCESSORIES_PRODUCTS, ...COLLECTION_PRODUCTS
].map(p => p.name));

require('dotenv').config();

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

async function generatePRD() {
    // Fetch categories first to resolve names
    const catSnapshot = await getDocs(collection(db, "categories"));
    const categoryMap = {};
    catSnapshot.forEach(docSnap => {
        categoryMap[docSnap.id] = docSnap.data().name || docSnap.id;
    });

    const snapshot = await getDocs(collection(db, "products"));
    const allProducts = [];
    snapshot.forEach(docSnap => {
        const d = docSnap.data();
        const rawCat = d.category || d.categoryId;
        let resolvedCat = categoryMap[rawCat];
        if (!resolvedCat && rawCat) {
            resolvedCat = `[UNRESOLVED: ${rawCat}]`;
        }

        allProducts.push({
            id: docSnap.id,
            name: d.name,
            category: resolvedCat || "Uncategorized",
            subCategory: d.subCategory || "General",
            price: d.price,
            discountPrice: d.discountPrice || null,
            brand: d.brand || "Velora",
            description: d.description || "",
            stock: d.stock || 0,
            image: d.image || (d.images && d.images[0]) || "",
            isNewArrival: d.isNewArrival || false,
            isTrending: d.isTrending || false,
            isOnSale: d.isOnSale || false,
            isAvailable: d.isAvailable !== undefined ? d.isAvailable : true,
            rating: d.rating || 0,
            sizes: d.sizes || [],
            createdAt: (() => {
                if (d.createdAt && typeof d.createdAt.toDate === 'function') return d.createdAt.toDate().toISOString();
                if (typeof d.createdAt === 'string') {
                    const parsed = new Date(d.createdAt);
                    return isNaN(parsed.getTime()) ? "N/A" : parsed.toISOString();
                }
                if (typeof d.createdAt === 'number') return new Date(d.createdAt).toISOString();
                return "N/A";
            })()
        });
    });

    const oldProducts = allProducts.filter(p => !ALL_220_NAMES.has(p.name));
    const newProducts = allProducts.filter(p => ALL_220_NAMES.has(p.name));

    // Sort both
    const sortFn = (a, b) => {
        if (a.category !== b.category) return a.category.localeCompare(b.category);
        if (a.subCategory !== b.subCategory) return a.subCategory.localeCompare(b.subCategory);
        return a.name.localeCompare(b.name);
    };
    oldProducts.sort(sortFn);
    newProducts.sort(sortFn);

    // Group by category
    function groupByCategory(products) {
        const groups = {};
        for (const p of products) {
            const cat = p.category;
            if (!groups[cat]) groups[cat] = {};
            const sub = p.subCategory;
            if (!groups[cat][sub]) groups[cat][sub] = [];
            groups[cat][sub].push(p);
        }
        return groups;
    }

    const oldGrouped = groupByCategory(oldProducts);
    const newGrouped = groupByCategory(newProducts);

    // Build PRD markdown
    let prd = "";

    prd += `# VELORA – Product Catalog PRD\n\n`;
    prd += `**Document Version:** 1.0  \n`;
    prd += `**Date:** ${new Date().toISOString().split("T")[0]}  \n`;
    prd += `**Project:** Velora – Premium Fashion E-Commerce  \n`;
    prd += `**Prepared By:** Auto-generated from Firestore  \n\n`;
    prd += `---\n\n`;

    prd += `## 1. Overview\n\n`;
    prd += `This document provides a complete catalog of all products currently in the Velora Firestore database. Products are divided into two phases:\n\n`;
    prd += `| Metric | Count |\n`;
    prd += `|--------|-------|\n`;
    prd += `| **Phase 1 – Initial Seed (Old Products)** | ${oldProducts.length} |\n`;
    prd += `| **Phase 2 – Expanded Catalog (220 Batch)** | ${newProducts.length} |\n`;
    prd += `| **Total Products in Database** | ${allProducts.length} |\n\n`;
    prd += `---\n\n`;

    // Category breakdown
    prd += `## 2. Category Breakdown\n\n`;
    prd += `### Phase 1 – Initial Seed\n\n`;
    prd += `| Category | SubCategories | Product Count |\n`;
    prd += `|----------|---------------|---------------|\n`;
    for (const [cat, subs] of Object.entries(oldGrouped).sort()) {
        const total = Object.values(subs).reduce((s, arr) => s + arr.length, 0);
        const subNames = Object.keys(subs).sort().join(", ");
        prd += `| ${cat} | ${subNames} | ${total} |\n`;
    }

    prd += `\n### Phase 2 – 220 Batch\n\n`;
    prd += `| Category | SubCategories | Product Count |\n`;
    prd += `|----------|---------------|---------------|\n`;
    for (const [cat, subs] of Object.entries(newGrouped).sort()) {
        const total = Object.values(subs).reduce((s, arr) => s + arr.length, 0);
        const subNames = Object.keys(subs).sort().join(", ");
        prd += `| ${cat} | ${subNames} | ${total} |\n`;
    }

    prd += `\n---\n\n`;

    // Phase 1 detailed list
    prd += `## 3. Phase 1 – Initial Seed Products (${oldProducts.length} Products)\n\n`;
    prd += `These products were added during the initial setup of the Velora platform, prior to the large-scale 220-product catalog expansion.\n\n`;

    let globalIdx = 1;
    for (const [cat, subs] of Object.entries(oldGrouped).sort()) {
        prd += `### 3.${Object.keys(oldGrouped).sort().indexOf(cat) + 1} ${cat}\n\n`;
        for (const [sub, products] of Object.entries(subs).sort()) {
            prd += `#### ${sub}\n\n`;
            prd += `| # | Product Name | Brand | Price (₹) | Discount (₹) | Stock | New Arrival | Trending | On Sale | Rating |\n`;
            prd += `|---|-------------|-------|-----------|--------------|-------|-------------|----------|---------|--------|\n`;
            for (const p of products) {
                prd += `| ${globalIdx} | ${p.name} | ${p.brand} | ${p.price ? p.price.toLocaleString("en-IN") : "N/A"} | ${p.discountPrice ? p.discountPrice.toLocaleString("en-IN") : "—"} | ${p.stock} | ${p.isNewArrival ? "✅" : "—"} | ${p.isTrending ? "✅" : "—"} | ${p.isOnSale ? "✅" : "—"} | ${p.rating || "—"} |\n`;
                globalIdx++;
            }
            prd += `\n`;
        }
    }

    prd += `---\n\n`;

    // Phase 2 detailed list
    prd += `## 4. Phase 2 – Expanded Catalog (${newProducts.length} Products)\n\n`;
    prd += `These products were added as part of the large-scale catalog expansion to build out the full Velora shopping experience across all categories.\n\n`;

    globalIdx = 1;
    for (const [cat, subs] of Object.entries(newGrouped).sort()) {
        prd += `### 4.${Object.keys(newGrouped).sort().indexOf(cat) + 1} ${cat}\n\n`;
        for (const [sub, products] of Object.entries(subs).sort()) {
            prd += `#### ${sub}\n\n`;
            prd += `| # | Product Name | Brand | Price (₹) | Discount (₹) | Stock | New Arrival | Trending | On Sale | Rating |\n`;
            prd += `|---|-------------|-------|-----------|--------------|-------|-------------|----------|---------|--------|\n`;
            for (const p of products) {
                prd += `| ${globalIdx} | ${p.name} | ${p.brand} | ${p.price ? p.price.toLocaleString("en-IN") : "N/A"} | ${p.discountPrice ? p.discountPrice.toLocaleString("en-IN") : "—"} | ${p.stock} | ${p.isNewArrival ? "✅" : "—"} | ${p.isTrending ? "✅" : "—"} | ${p.isOnSale ? "✅" : "—"} | ${p.rating || "—"} |\n`;
                globalIdx++;
            }
            prd += `\n`;
        }
    }

    prd += `---\n\n`;

    // Price analysis
    prd += `## 5. Price Analysis\n\n`;

    const calcStats = (products) => {
        const prices = products.map(p => p.price).filter(p => p);
        if (prices.length === 0) return { min: 0, max: 0, avg: 0 };
        return {
            min: Math.min(...prices),
            max: Math.max(...prices),
            avg: Math.round(prices.reduce((s, p) => s + p, 0) / prices.length)
        };
    };

    const oldStats = calcStats(oldProducts);
    const newStats = calcStats(newProducts);
    const allStats = calcStats(allProducts);

    prd += `| Metric | Phase 1 (Old) | Phase 2 (New) | Overall |\n`;
    prd += `|--------|---------------|---------------|----------|\n`;
    prd += `| Min Price | ₹${oldStats.min.toLocaleString("en-IN")} | ₹${newStats.min.toLocaleString("en-IN")} | ₹${allStats.min.toLocaleString("en-IN")} |\n`;
    prd += `| Max Price | ₹${oldStats.max.toLocaleString("en-IN")} | ₹${newStats.max.toLocaleString("en-IN")} | ₹${allStats.max.toLocaleString("en-IN")} |\n`;
    prd += `| Avg Price | ₹${oldStats.avg.toLocaleString("en-IN")} | ₹${newStats.avg.toLocaleString("en-IN")} | ₹${allStats.avg.toLocaleString("en-IN")} |\n`;
    prd += `| Products with Discount | ${oldProducts.filter(p => p.discountPrice).length} | ${newProducts.filter(p => p.discountPrice).length} | ${allProducts.filter(p => p.discountPrice).length} |\n`;
    prd += `| Products on Sale | ${oldProducts.filter(p => p.isOnSale).length} | ${newProducts.filter(p => p.isOnSale).length} | ${allProducts.filter(p => p.isOnSale).length} |\n`;
    prd += `| New Arrivals | ${oldProducts.filter(p => p.isNewArrival).length} | ${newProducts.filter(p => p.isNewArrival).length} | ${allProducts.filter(p => p.isNewArrival).length} |\n`;
    prd += `| Trending | ${oldProducts.filter(p => p.isTrending).length} | ${newProducts.filter(p => p.isTrending).length} | ${allProducts.filter(p => p.isTrending).length} |\n`;

    prd += `\n---\n\n`;
    prd += `## 6. Firestore IDs Reference\n\n`;
    prd += `<details>\n<summary>Click to expand full Firestore ID mapping</summary>\n\n`;
    prd += `### Phase 1 IDs\n\n`;
    prd += `| Product Name | Firestore ID |\n`;
    prd += `|-------------|-------------|\n`;
    for (const p of oldProducts) {
        prd += `| ${p.name} | \`${p.id}\` |\n`;
    }
    prd += `\n### Phase 2 IDs\n\n`;
    prd += `| Product Name | Firestore ID |\n`;
    prd += `|-------------|-------------|\n`;
    for (const p of newProducts) {
        prd += `| ${p.name} | \`${p.id}\` |\n`;
    }
    prd += `\n</details>\n\n`;
    prd += `---\n\n`;
    prd += `*End of Document*\n`;

    // Write file
    const fs = require("fs");
    fs.writeFileSync("VELORA_PRODUCT_CATALOG_PRD.md", prd, "utf8");
    console.log(`✅ PRD generated: VELORA_PRODUCT_CATALOG_PRD.md`);
    console.log(`   Old products: ${oldProducts.length}`);
    console.log(`   New products: ${newProducts.length}`);
    console.log(`   Total: ${allProducts.length}`);
    process.exit(0);
}

generatePRD().catch(err => {
    console.error("Error:", err.message);
    process.exit(1);
});
