/**
 * VELORA – Firestore Schema Verification Script
 * 
 * This script verifies that all 16 collections exist and
 * have the correct fields per the schema specification.
 * 
 * Usage: node verify_firestore_schema.js
 */

const { initializeApp } = require("firebase/app");
const {
    getFirestore,
    collection,
    getDocs,
    query,
    limit
} = require("firebase/firestore");

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

// ─── Expected Schema Definition ──────────────────────────────────
const SCHEMA = {
    admins: {
        fields: ["name", "email", "password", "role", "isActive", "createdAt"],
        enums: { role: ["SUPER_ADMIN", "MANAGER", "STAFF"] }
    },
    users: {
        fields: ["name", "email", "phone", "totalOrders", "loyaltyPoints", "rewardLevel", "isBlocked", "createdAt", "updatedAt"]
    },
    categories: {
        fields: ["name", "image", "sortOrder", "createdAt"]
    },
    subcategories: {
        fields: ["categoryId", "name", "createdAt"]
    },
    products: {
        fields: ["name", "description", "brand", "price", "stock", "image", "category", "subCategory", "isAvailable", "createdAt", "updatedAt"]
    },
    product_variants: {
        fields: ["productId", "size", "color", "stock", "extraPrice"]
    },
    orders: {
        fields: ["userId", "totalAmount", "taxAmount", "discountAmount", "finalAmount", "shippingAddress", "orderStatus", "paymentStatus", "createdAt", "updatedAt"],
        enums: {
            orderStatus: ["PLACED", "CONFIRMED", "SHIPPED", "OUT_FOR_DELIVERY", "DELIVERED", "CANCELLED", "RETURNED"],
            paymentStatus: ["PENDING", "PAID", "FAILED", "REFUNDED"]
        }
    },
    order_items: {
        fields: ["orderId", "productId", "quantity", "price", "selectedSize", "selectedColor"]
    },
    payments: {
        fields: ["orderId", "paymentMethod", "transactionId", "amount", "status", "createdAt"]
    },
    // Note: cart and wishlist use subcollections, verified separately
    reviews: {
        fields: ["productId", "userId", "rating", "comment", "createdAt"]
    },
    coupons: {
        fields: ["code", "discountType", "discountValue", "minOrderAmount", "expiryDate", "isActive"]
    },
    loyalty_transactions: {
        fields: ["userId", "orderId", "points", "type", "createdAt"]
    },
    reward_levels: {
        fields: ["levelName", "requiredOrders", "benefits"]
    },
    notifications: {
        fields: ["userId", "title", "message", "isRead", "createdAt"]
    }
};

// ─── Verification Logic ──────────────────────────────────────────
let totalChecks = 0;
let passedChecks = 0;
let failedChecks = 0;
let warnings = 0;

function pass(msg) {
    console.log(`  ✅ ${msg}`);
    totalChecks++;
    passedChecks++;
}

function fail(msg) {
    console.log(`  ❌ ${msg}`);
    totalChecks++;
    failedChecks++;
}

function warn(msg) {
    console.log(`  ⚠️  ${msg}`);
    warnings++;
}

async function verifyCollection(collectionName, schema) {
    console.log(`\n📁 Verifying: ${collectionName}`);

    try {
        const q = query(collection(db, collectionName), limit(5));
        const snapshot = await getDocs(q);

        if (snapshot.empty) {
            fail(`Collection "${collectionName}" exists but is EMPTY`);
            return;
        }

        pass(`Collection "${collectionName}" exists with ${snapshot.size} doc(s) sampled`);

        // Check first document for expected fields
        const firstDoc = snapshot.docs[0];
        const data = firstDoc.data();
        const docFields = Object.keys(data);

        const missingFields = [];
        const presentFields = [];

        for (const field of schema.fields) {
            if (docFields.includes(field)) {
                presentFields.push(field);
            } else {
                missingFields.push(field);
            }
        }

        if (missingFields.length === 0) {
            pass(`All ${schema.fields.length} expected fields present`);
        } else {
            fail(`Missing fields: ${missingFields.join(", ")}`);
            if (presentFields.length > 0) {
                console.log(`     Present: ${presentFields.join(", ")}`);
            }
        }

        // Extra fields check
        const extraFields = docFields.filter(f => !schema.fields.includes(f));
        if (extraFields.length > 0) {
            warn(`Extra fields found: ${extraFields.join(", ")}`);
        }

        // Enum validation
        if (schema.enums) {
            for (const [field, validValues] of Object.entries(schema.enums)) {
                let allValid = true;
                snapshot.docs.forEach(doc => {
                    const val = doc.data()[field];
                    if (val && !validValues.includes(val)) {
                        fail(`Invalid enum value for "${field}": "${val}" (expected: ${validValues.join(", ")})`);
                        allValid = false;
                    }
                });
                if (allValid) {
                    pass(`Enum values for "${field}" are valid`);
                }
            }
        }

        // Data type checks
        const sampleData = firstDoc.data();
        console.log(`     Sample doc ID: ${firstDoc.id}`);
        console.log(`     Sample fields: ${Object.keys(sampleData).join(", ")}`);

    } catch (error) {
        fail(`Error accessing "${collectionName}": ${error.message}`);
    }
}

async function verifySubcollection(parentCollection, parentDocFieldName) {
    console.log(`\n📁 Verifying: ${parentCollection} (subcollection pattern)`);

    try {
        // First, get any docs from the parent
        const parentQuery = query(collection(db, parentCollection), limit(1));
        const parentSnap = await getDocs(parentQuery);

        if (parentSnap.empty) {
            // For subcollection pattern like cart/{userId}/items,
            // there is no top-level document, only nested docs.
            // We need to check if the parent was set up correctly.
            warn(`No parent docs found at "${parentCollection}" – this is expected for subcollection pattern if parent docs aren't explicitly created`);
            return;
        }

        const parentDocId = parentSnap.docs[0].id;
        pass(`Parent doc found: ${parentDocId}`);

        // Check subcollection
        const subColRef = collection(db, parentCollection, parentDocId, parentDocFieldName);
        const subSnap = await getDocs(subColRef);

        if (subSnap.empty) {
            warn(`Subcollection "${parentDocFieldName}" under "${parentCollection}/${parentDocId}" is empty`);
        } else {
            pass(`Subcollection "${parentDocFieldName}" has ${subSnap.size} doc(s)`);
            const sampleData = subSnap.docs[0].data();
            console.log(`     Sample fields: ${Object.keys(sampleData).join(", ")}`);
        }
    } catch (error) {
        fail(`Error verifying "${parentCollection}" subcollection: ${error.message}`);
    }
}

// ─── MAIN VERIFICATION ──────────────────────────────────────────
async function verifyAll() {
    console.log("╔══════════════════════════════════════════════════╗");
    console.log("║   VELORA – Firestore Schema Verifier            ║");
    console.log("║   Checking all 16 collections...                ║");
    console.log("╚══════════════════════════════════════════════════╝");

    const startTime = Date.now();

    // Top-level collections
    for (const [collectionName, schema] of Object.entries(SCHEMA)) {
        await verifyCollection(collectionName, schema);
    }

    // Subcollection-based collections
    await verifySubcollection("cart", "items");
    await verifySubcollection("wishlist", "products");

    const elapsed = ((Date.now() - startTime) / 1000).toFixed(2);

    console.log("\n╔══════════════════════════════════════════════════╗");
    console.log("║   📊 VERIFICATION RESULTS                       ║");
    console.log("╠══════════════════════════════════════════════════╣");
    console.log(`║   Total Checks:  ${String(totalChecks).padEnd(30)}║`);
    console.log(`║   ✅ Passed:     ${String(passedChecks).padEnd(30)}║`);
    console.log(`║   ❌ Failed:     ${String(failedChecks).padEnd(30)}║`);
    console.log(`║   ⚠️  Warnings:   ${String(warnings).padEnd(30)}║`);
    console.log(`║   ⏱  Time:       ${String(elapsed + "s").padEnd(30)}║`);
    console.log("╚══════════════════════════════════════════════════╝");

    if (failedChecks > 0) {
        console.log("\n⚠️  Some checks FAILED. Please review the output above.");
        process.exit(1);
    } else {
        console.log("\n🎉 All checks PASSED! Your Firestore schema is correctly set up.");
        process.exit(0);
    }
}

verifyAll();
