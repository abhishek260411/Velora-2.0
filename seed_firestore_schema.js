/**
 * VELORA – Fashion E-Commerce App + Admin Panel
 * Firebase Firestore – Full Schema Seeder
 * 
 * This script seeds ALL 16 collections with sample data
 * matching the exact schema specification.
 * 
 * Usage: node seed_firestore_schema.js
 */

const { initializeApp } = require("firebase/app");
const {
    getFirestore,
    collection,
    addDoc,
    doc,
    setDoc,
    serverTimestamp,
    Timestamp
} = require("firebase/firestore");

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
    console.error("Missing FIREBASE_API_KEY. Exiting...");
    process.exit(1);
}

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// ─── Helpers ─────────────────────────────────────────────────────
let stats = { success: 0, failed: 0 };

async function addToCollection(collectionName, data, label) {
    try {
        const docRef = await addDoc(collection(db, collectionName), data);
        console.log(`  ✅ [${collectionName}] Added: ${label} (${docRef.id})`);
        stats.success++;
        return docRef.id;
    } catch (e) {
        console.error(`  ❌ [${collectionName}] Failed: ${label}`, e.message);
        stats.failed++;
        return null;
    }
}

async function setSubDoc(path, data, label) {
    try {
        const docRef = doc(db, path);
        await setDoc(docRef, data);
        console.log(`  ✅ [${path}] Added: ${label}`);
        stats.success++;
        return true;
    } catch (e) {
        console.error(`  ❌ [${path}] Failed: ${label}`, e.message);
        stats.failed++;
        return false;
    }
}

// ─── 1️⃣ ADMINS ──────────────────────────────────────────────────
async function seedAdmins() {
    console.log("\n📁 Seeding ADMINS...");
    const admins = [
        {
            name: "Snehal Pinjari",
            email: "snehal@velora.com",
            role: "SUPER_ADMIN",
            isActive: true,
            createdAt: serverTimestamp()
        },
        {
            name: "Manager User",
            email: "manager@velora.com",
            role: "MANAGER",
            isActive: true,
            createdAt: serverTimestamp()
        },
        {
            name: "Staff User",
            email: "staff@velora.com",
            role: "STAFF",
            isActive: true,
            createdAt: serverTimestamp()
        }
    ];

    const adminIds = [];
    for (const admin of admins) {
        const id = await addToCollection("admins", admin, admin.name);
        adminIds.push(id);
    }
    return adminIds;
}

// ─── 2️⃣ USERS ───────────────────────────────────────────────────
async function seedUsers() {
    console.log("\n📁 Seeding USERS...");
    const users = [
        {
            name: "Rahul Sharma",
            email: "rahul@gmail.com",
            phone: "+91-9876543210",
            totalOrders: 5,
            loyaltyPoints: 250,
            rewardLevel: "Silver",
            isBlocked: false,
            createdAt: serverTimestamp(),
            updatedAt: serverTimestamp()
        },
        {
            name: "Priya Desai",
            email: "priya@gmail.com",
            phone: "+91-9988776655",
            totalOrders: 12,
            loyaltyPoints: 600,
            rewardLevel: "Gold",
            isBlocked: false,
            createdAt: serverTimestamp(),
            updatedAt: serverTimestamp()
        },
        {
            name: "Arjun Mehta",
            email: "arjun@gmail.com",
            phone: "+91-8877665544",
            totalOrders: 0,
            loyaltyPoints: 0,
            rewardLevel: "Bronze",
            isBlocked: false,
            createdAt: serverTimestamp(),
            updatedAt: serverTimestamp()
        },
        {
            name: "Ananya Gupta",
            email: "ananya@gmail.com",
            phone: "+91-7766554433",
            totalOrders: 25,
            loyaltyPoints: 1200,
            rewardLevel: "Platinum",
            isBlocked: false,
            createdAt: serverTimestamp(),
            updatedAt: serverTimestamp()
        }
    ];

    const userIds = [];
    for (const user of users) {
        const id = await addToCollection("users", user, user.name);
        userIds.push(id);
    }
    return userIds;
}

// ─── 3️⃣ CATEGORIES ────────────────────────────────────────────────
async function seedCategories() {
    console.log("\n📁 Seeding CATEGORIES...");
    const categories = [
        {
            name: "Men",
            image: "https://images.unsplash.com/photo-1617137968427-85924c800a22?auto=format&fit=crop&q=80&w=800",
            sortOrder: 1,
            createdAt: serverTimestamp()
        },
        {
            name: "Women",
            image: "https://images.unsplash.com/photo-1483985988355-763728e1935b?auto=format&fit=crop&q=80&w=800",
            sortOrder: 2,
            createdAt: serverTimestamp()
        },
        {
            name: "Shoes",
            image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&q=80&w=800",
            sortOrder: 3,
            createdAt: serverTimestamp()
        },
        {
            name: "Accessories",
            image: "https://images.unsplash.com/photo-1523170335258-f5ed11844a49?auto=format&fit=crop&q=80&w=800",
            sortOrder: 4,
            createdAt: serverTimestamp()
        }
    ];

    const categoryIds = [];
    for (const cat of categories) {
        const id = await addToCollection("categories", cat, cat.name);
        categoryIds.push({ id, name: cat.name });
    }
    return categoryIds;
}

// ─── 4️⃣ SUBCATEGORIES ────────────────────────────────────────────
async function seedSubcategories(categoryIds) {
    console.log("\n📁 Seeding SUBCATEGORIES...");

    const getCatId = (name) => {
        const cat = categoryIds.find(c => c.name === name);
        return cat ? cat.id : null;
    };

    const subcategories = [
        { categoryId: getCatId("Men"), name: "Shirts", createdAt: serverTimestamp() },
        { categoryId: getCatId("Men"), name: "T-Shirts", createdAt: serverTimestamp() },
        { categoryId: getCatId("Men"), name: "Jeans", createdAt: serverTimestamp() },
        { categoryId: getCatId("Men"), name: "Jackets", createdAt: serverTimestamp() },
        { categoryId: getCatId("Women"), name: "Dresses", createdAt: serverTimestamp() },
        { categoryId: getCatId("Women"), name: "Tops", createdAt: serverTimestamp() },
        { categoryId: getCatId("Women"), name: "Sarees", createdAt: serverTimestamp() },
        { categoryId: getCatId("Shoes"), name: "Sneakers", createdAt: serverTimestamp() },
        { categoryId: getCatId("Shoes"), name: "Formal Shoes", createdAt: serverTimestamp() },
        { categoryId: getCatId("Shoes"), name: "Sandals", createdAt: serverTimestamp() },
        { categoryId: getCatId("Accessories"), name: "Watches", createdAt: serverTimestamp() },
        { categoryId: getCatId("Accessories"), name: "Bags", createdAt: serverTimestamp() },
        { categoryId: getCatId("Accessories"), name: "Jewellery", createdAt: serverTimestamp() },
        { categoryId: getCatId("Accessories"), name: "Sunglasses", createdAt: serverTimestamp() }
    ];

    const subCatIds = [];
    for (const sub of subcategories) {
        const id = await addToCollection("subcategories", sub, sub.name);
        subCatIds.push({ id, name: sub.name, categoryId: sub.categoryId });
    }
    return subCatIds;
}

// ─── 5️⃣ PRODUCTS ───────────────────────────────────────────────
async function seedProducts(categoryIds, subCatIds) {
    console.log("\n📁 Seeding PRODUCTS...");

    const getCatId = (name) => categoryIds.find(c => c.name === name)?.id || null;
    const getSubCatId = (name) => subCatIds.find(s => s.name === name)?.id || null;

    const products = [
        {
            name: "Classic Oxford Shirt",
            description: "Premium cotton oxford shirt with button-down collar. Perfect for both casual and semi-formal occasions.",
            brand: "VELORA CLASSIC",
            price: 2499,
            discountPrice: 1999,
            stock: 50,
            images: [
                "https://images.unsplash.com/photo-1596755094514-f87e34085b2c?auto=format&fit=crop&q=80&w=800"
            ],
            categoryId: getCatId("Men"),
            subCategoryId: getSubCatId("Shirts"),
            rating: 4.5,
            totalReviews: 28,
            isAvailable: true,
            isNewArrival: false,
            isFeatured: true,
            createdAt: serverTimestamp(),
            updatedAt: serverTimestamp()
        },
        {
            name: "Slim Fit Denim Jeans",
            description: "Modern slim fit jeans with stretch technology for maximum comfort and style.",
            brand: "VELORA DENIM",
            price: 3299,
            discountPrice: 2799,
            stock: 40,
            images: [
                "https://images.unsplash.com/photo-1542272604-787c3835535d?auto=format&fit=crop&q=80&w=800"
            ],
            categoryId: getCatId("Men"),
            subCategoryId: getSubCatId("Jeans"),
            rating: 4.3,
            totalReviews: 45,
            isAvailable: true,
            isNewArrival: true,
            isFeatured: false,
            createdAt: serverTimestamp(),
            updatedAt: serverTimestamp()
        },
        {
            name: "Graphic Print T-Shirt",
            description: "Trendy oversized graphic tee made from 100% organic cotton.",
            brand: "VELORA STREET",
            price: 1299,
            discountPrice: 999,
            stock: 100,
            images: [
                "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&q=80&w=800"
            ],
            categoryId: getCatId("Men"),
            subCategoryId: getSubCatId("T-Shirts"),
            rating: 4.1,
            totalReviews: 62,
            isAvailable: true,
            isNewArrival: false,
            isFeatured: false,
            createdAt: serverTimestamp(),
            updatedAt: serverTimestamp()
        },
        {
            name: "Silk Evening Gown",
            description: "Exquisite mulberry silk gown with a draped back and hand-stitched detailing.",
            brand: "VELORA COUTURE",
            price: 12499,
            discountPrice: 10999,
            stock: 10,
            images: [
                "https://images.unsplash.com/photo-1539008835060-31053086ebc3?auto=format&fit=crop&q=80&w=800"
            ],
            categoryId: getCatId("Women"),
            subCategoryId: getSubCatId("Dresses"),
            rating: 4.8,
            totalReviews: 15,
            isAvailable: true,
            isNewArrival: false,
            isFeatured: true,
            createdAt: serverTimestamp(),
            updatedAt: serverTimestamp()
        },
        {
            name: "Bohemian Crop Top",
            description: "Free-spirited bohemian crop top with intricate embroidery and tassel details.",
            brand: "VELORA TREND",
            price: 1799,
            discountPrice: 1499,
            stock: 60,
            images: [
                "https://images.unsplash.com/photo-1525507119028-ed4c629a60a3?auto=format&fit=crop&q=80&w=800"
            ],
            categoryId: getCatId("Women"),
            subCategoryId: getSubCatId("Tops"),
            rating: 4.0,
            totalReviews: 33,
            isAvailable: true,
            isNewArrival: true,
            isFeatured: false,
            createdAt: serverTimestamp(),
            updatedAt: serverTimestamp()
        },
        {
            name: "Velora Cloud Runners",
            description: "Next-gen mesh sneakers with responsive foam technology for all-day comfort.",
            brand: "VELORA SPORTS",
            price: 6499,
            discountPrice: 5499,
            stock: 25,
            images: [
                "https://images.unsplash.com/photo-1560769629-975ec94e6a86?auto=format&fit=crop&q=80&w=800"
            ],
            categoryId: getCatId("Shoes"),
            subCategoryId: getSubCatId("Sneakers"),
            rating: 4.7,
            totalReviews: 88,
            isAvailable: true,
            isNewArrival: false,
            isFeatured: true,
            createdAt: serverTimestamp(),
            updatedAt: serverTimestamp()
        },
        {
            name: "Midnight Stellar Watch",
            description: "A timeless masterpiece featuring a sapphire crystal face and premium Italian leather strap.",
            brand: "VELORA LUXE",
            price: 18499,
            discountPrice: 15999,
            stock: 15,
            images: [
                "https://images.unsplash.com/photo-1524592094714-0f0654e20314?auto=format&fit=crop&q=80&w=800"
            ],
            categoryId: getCatId("Accessories"),
            subCategoryId: getSubCatId("Watches"),
            rating: 4.9,
            totalReviews: 22,
            isAvailable: true,
            isNewArrival: false,
            isFeatured: true,
            createdAt: serverTimestamp(),
            updatedAt: serverTimestamp()
        },
        {
            name: "Noir Leather Tote",
            description: "Spacious handcrafted leather tote with gold-tone hardware and internal organizers.",
            brand: "VELORA PARIS",
            price: 8999,
            discountPrice: 7499,
            stock: 12,
            images: [
                "https://images.unsplash.com/photo-1584917865442-de89df76afd3?auto=format&fit=crop&q=80&w=800"
            ],
            categoryId: getCatId("Accessories"),
            subCategoryId: getSubCatId("Bags"),
            rating: 4.6,
            totalReviews: 19,
            isAvailable: true,
            isNewArrival: true,
            isFeatured: false,
            createdAt: serverTimestamp(),
            updatedAt: serverTimestamp()
        }
    ];

    const productIds = [];
    for (const product of products) {
        if (!product.categoryId) {
            console.warn(`  ⚠️ Skipping product "${product.name}" due to missing category mapping`);
            continue;
        }
        const id = await addToCollection("products", product, product.name);
        productIds.push({ id, name: product.name, price: product.price, categoryId: product.categoryId });
    }
    return productIds;
}

// ─── 6️⃣ PRODUCT_VARIANTS ───────────────────────────────────────
async function seedProductVariants(productIds) {
    console.log("\n📁 Seeding PRODUCT_VARIANTS...");

    const getProductId = (name) => productIds.find(p => p.name === name)?.id || "";

    const variants = [
        // Classic Oxford Shirt variants
        { productId: getProductId("Classic Oxford Shirt"), size: "S", color: "White", stock: 10, extraPrice: 0 },
        { productId: getProductId("Classic Oxford Shirt"), size: "M", color: "White", stock: 15, extraPrice: 0 },
        { productId: getProductId("Classic Oxford Shirt"), size: "L", color: "Blue", stock: 12, extraPrice: 0 },
        { productId: getProductId("Classic Oxford Shirt"), size: "XL", color: "Blue", stock: 8, extraPrice: 100 },
        // Slim Fit Denim Jeans variants
        { productId: getProductId("Slim Fit Denim Jeans"), size: "30", color: "Dark Blue", stock: 15, extraPrice: 0 },
        { productId: getProductId("Slim Fit Denim Jeans"), size: "32", color: "Dark Blue", stock: 10, extraPrice: 0 },
        { productId: getProductId("Slim Fit Denim Jeans"), size: "34", color: "Black", stock: 8, extraPrice: 0 },
        // Cloud Runners variants
        { productId: getProductId("Velora Cloud Runners"), size: "8", color: "Black/Red", stock: 5, extraPrice: 0 },
        { productId: getProductId("Velora Cloud Runners"), size: "9", color: "Black/Red", stock: 8, extraPrice: 0 },
        { productId: getProductId("Velora Cloud Runners"), size: "10", color: "White/Blue", stock: 6, extraPrice: 200 },
        // Silk Evening Gown variants
        { productId: getProductId("Silk Evening Gown"), size: "S", color: "Midnight Black", stock: 3, extraPrice: 0 },
        { productId: getProductId("Silk Evening Gown"), size: "M", color: "Burgundy", stock: 4, extraPrice: 500 },
        { productId: getProductId("Silk Evening Gown"), size: "L", color: "Emerald Green", stock: 3, extraPrice: 500 },
    ];

    for (const variant of variants) {
        await addToCollection("product_variants", variant, `${variant.size}/${variant.color}`);
    }
}

// ─── 7️⃣ ORDERS ──────────────────────────────────────────────────
async function seedOrders(userIds) {
    console.log("\n📁 Seeding ORDERS...");

    const orders = [
        {
            userId: userIds[0],
            totalAmount: 4498,
            taxAmount: 810,
            discountAmount: 500,
            finalAmount: 4808,
            shippingAddress: {
                street: "42 MG Road",
                city: "Mumbai",
                state: "Maharashtra",
                pincode: "400001",
                phone: "+91-9876543210"
            },
            orderStatus: "DELIVERED",
            paymentStatus: "PAID",
            createdAt: serverTimestamp(),
            updatedAt: serverTimestamp()
        },
        {
            userId: userIds[1],
            totalAmount: 12499,
            taxAmount: 2250,
            discountAmount: 1500,
            finalAmount: 13249,
            shippingAddress: {
                street: "15 Park Street",
                city: "Pune",
                state: "Maharashtra",
                pincode: "411001",
                phone: "+91-9988776655"
            },
            orderStatus: "SHIPPED",
            paymentStatus: "PAID",
            createdAt: serverTimestamp(),
            updatedAt: serverTimestamp()
        },
        {
            userId: userIds[0],
            totalAmount: 6499,
            taxAmount: 1170,
            discountAmount: 0,
            finalAmount: 7669,
            shippingAddress: {
                street: "42 MG Road",
                city: "Mumbai",
                state: "Maharashtra",
                pincode: "400001",
                phone: "+91-9876543210"
            },
            orderStatus: "PLACED",
            paymentStatus: "PENDING",
            createdAt: serverTimestamp(),
            updatedAt: serverTimestamp()
        },
        {
            userId: userIds[3],
            totalAmount: 18499,
            taxAmount: 3330,
            discountAmount: 2000,
            finalAmount: 19829,
            shippingAddress: {
                street: "78 Jubilee Hills",
                city: "Hyderabad",
                state: "Telangana",
                pincode: "500033",
                phone: "+91-7766554433"
            },
            orderStatus: "CONFIRMED",
            paymentStatus: "PAID",
            createdAt: serverTimestamp(),
            updatedAt: serverTimestamp()
        },
        {
            userId: userIds[1],
            totalAmount: 3299,
            taxAmount: 594,
            discountAmount: 300,
            finalAmount: 3593,
            shippingAddress: {
                street: "15 Park Street",
                city: "Pune",
                state: "Maharashtra",
                pincode: "411001",
                phone: "+91-9988776655"
            },
            orderStatus: "CANCELLED",
            paymentStatus: "REFUNDED",
            createdAt: serverTimestamp(),
            updatedAt: serverTimestamp()
        }
    ];

    const orderIds = [];
    for (let i = 0; i < orders.length; i++) {
        if (!orders[i].userId) {
            console.warn(`  ⚠️ Skipping order #${i + 1} due to missing userId`);
            continue;
        }
        const id = await addToCollection("orders", orders[i], `Order #${i + 1}`);
        orderIds.push({ id, userId: orders[i].userId });
    }
    return orderIds;
}

// ─── 8️⃣ ORDER_ITEMS ────────────────────────────────────────────
async function seedOrderItems(orderIds, productIds) {
    console.log("\n📁 Seeding ORDER_ITEMS...");

    const orderItems = [
        {
            orderId: orderIds[0]?.id,
            productId: productIds[0]?.id,
            quantity: 1,
            price: 1999,
            selectedSize: "M",
            selectedColor: "White"
        },
        {
            orderId: orderIds[0]?.id,
            productId: productIds[2]?.id,
            quantity: 2,
            price: 999,
            selectedSize: "L",
            selectedColor: "Black"
        },
        {
            orderId: orderIds[1]?.id,
            productId: productIds[3]?.id,
            quantity: 1,
            price: 10999,
            selectedSize: "M",
            selectedColor: "Burgundy"
        },
        {
            orderId: orderIds[2]?.id,
            productId: productIds[5]?.id,
            quantity: 1,
            price: 5499,
            selectedSize: "9",
            selectedColor: "Black/Red"
        },
        {
            orderId: orderIds[3]?.id,
            productId: productIds[6]?.id,
            quantity: 1,
            price: 15999,
            selectedSize: "",
            selectedColor: ""
        }
    ];

    for (const item of orderItems) {
        if (!item.orderId) {
            console.warn(`  ⚠️ Skipping order item for missing orderId`);
            continue;
        }
        await addToCollection("order_items", item, `Order ${item.orderId?.substring(0, 6)}`);
    }
}

// ─── 9️⃣ PAYMENTS ───────────────────────────────────────────────
async function seedPayments(orderIds) {
    console.log("\n📁 Seeding PAYMENTS...");

    const payments = [
        {
            orderId: orderIds[0]?.id,
            paymentMethod: "UPI",
            transactionId: "TXN_UPI_" + Date.now() + "_001",
            amount: 4808,
            status: "SUCCESS",
            createdAt: serverTimestamp()
        },
        {
            orderId: orderIds[1]?.id,
            paymentMethod: "CARD",
            transactionId: "TXN_CARD_" + Date.now() + "_002",
            amount: 13249,
            status: "SUCCESS",
            createdAt: serverTimestamp()
        },
        {
            orderId: orderIds[2]?.id,
            paymentMethod: "COD",
            transactionId: "TXN_COD_" + Date.now() + "_003",
            amount: 7669,
            status: "PENDING",
            createdAt: serverTimestamp()
        },
        {
            orderId: orderIds[3]?.id,
            paymentMethod: "UPI",
            transactionId: "TXN_UPI_" + Date.now() + "_004",
            amount: 19829,
            status: "SUCCESS",
            createdAt: serverTimestamp()
        },
        {
            orderId: orderIds[4]?.id,
            paymentMethod: "CARD",
            transactionId: "TXN_CARD_" + Date.now() + "_005",
            amount: 3593,
            status: "REFUNDED",
            createdAt: serverTimestamp()
        }
    ];

    for (const payment of payments) {
        await addToCollection("payments", payment, `Payment ${payment.paymentMethod}`);
    }
}

// ─── 🔟 CART (Subcollection Pattern) ────────────────────────────
async function seedCart(userIds, productIds) {
    console.log("\n📁 Seeding CART (subcollection)...");

    // User 1 cart items  (cart/{userId}/items/{auto})
    const user1CartItems = [
        {
            productId: productIds[1]?.id,
            quantity: 1,
            selectedSize: "32",
            selectedColor: "Dark Blue",
            addedAt: serverTimestamp()
        },
        {
            productId: productIds[6]?.id,
            quantity: 1,
            selectedSize: "",
            selectedColor: "",
            addedAt: serverTimestamp()
        }
    ];

    if (userIds[0]) {
        for (const item of user1CartItems) {
            const path = `cart/${userIds[0]}/items`;
            await addToCollection(path, item, `Cart item for user ${userIds[0]?.substring(0, 6)}`);
        }
    }

    // User 3 cart items
    const user3CartItems = [
        {
            productId: productIds[4]?.id,
            quantity: 2,
            selectedSize: "S",
            selectedColor: "White",
            addedAt: serverTimestamp()
        }
    ];

    if (userIds[2]) {
        for (const item of user3CartItems) {
            const path = `cart/${userIds[2]}/items`;
            await addToCollection(path, item, `Cart item for user ${userIds[2]?.substring(0, 6)}`);
        }
    }
}

// ─── 1️⃣1️⃣ WISHLIST (Subcollection Pattern) ─────────────────────
async function seedWishlist(userIds, productIds) {
    console.log("\n📁 Seeding WISHLIST (subcollection)...");

    // User 2 wishlist
    const user2Wishlist = [
        { productId: productIds[0]?.id, addedAt: serverTimestamp() },
        { productId: productIds[5]?.id, addedAt: serverTimestamp() },
        { productId: productIds[6]?.id, addedAt: serverTimestamp() }
    ];

    for (const item of user2Wishlist) {
        const path = `wishlist/${userIds[1]}/products`;
        await addToCollection(path, item, `Wishlist for user ${userIds[1]?.substring(0, 6)}`);
    }

    // User 4 wishlist
    const user4Wishlist = [
        { productId: productIds[3]?.id, addedAt: serverTimestamp() },
        { productId: productIds[7]?.id, addedAt: serverTimestamp() }
    ];

    for (const item of user4Wishlist) {
        const path = `wishlist/${userIds[3]}/products`;
        await addToCollection(path, item, `Wishlist for user ${userIds[3]?.substring(0, 6)}`);
    }
}

// ─── 1️⃣2️⃣ REVIEWS ──────────────────────────────────────────────
async function seedReviews(productIds, userIds) {
    console.log("\n📁 Seeding REVIEWS...");

    const reviews = [
        {
            productId: productIds[0]?.id,
            userId: userIds[0],
            rating: 5,
            comment: "Excellent quality shirt! The fabric is soft and the fit is perfect.",
            createdAt: serverTimestamp()
        },
        {
            productId: productIds[0]?.id,
            userId: userIds[1],
            rating: 4,
            comment: "Good shirt, slightly loose around the waist but overall great.",
            createdAt: serverTimestamp()
        },
        {
            productId: productIds[3]?.id,
            userId: userIds[1],
            rating: 5,
            comment: "Absolutely stunning gown! Got so many compliments at the party.",
            createdAt: serverTimestamp()
        },
        {
            productId: productIds[5]?.id,
            userId: userIds[3],
            rating: 4,
            comment: "Very comfortable for running. The foam technology really works!",
            createdAt: serverTimestamp()
        },
        {
            productId: productIds[6]?.id,
            userId: userIds[0],
            rating: 5,
            comment: "Premium quality watch. Worth every rupee!",
            createdAt: serverTimestamp()
        },
        {
            productId: productIds[2]?.id,
            userId: userIds[2],
            rating: 3,
            comment: "Decent t-shirt but the print quality could be better.",
            createdAt: serverTimestamp()
        }
    ];

    for (const review of reviews) {
        await addToCollection("reviews", review, `Review by user ${review.userId?.substring(0, 6)}`);
    }
}

// ─── 1️⃣3️⃣ COUPONS ──────────────────────────────────────────────
async function seedCoupons() {
    console.log("\n📁 Seeding COUPONS...");

    const coupons = [
        {
            code: "WELCOME10",
            discountType: "PERCENTAGE",
            discountValue: 10,
            minOrderAmount: 999,
            expiryDate: Timestamp.fromDate(new Date("2026-12-31T23:59:59")),
            isActive: true
        },
        {
            code: "FLAT500",
            discountType: "FIXED",
            discountValue: 500,
            minOrderAmount: 2999,
            expiryDate: Timestamp.fromDate(new Date("2026-06-30T23:59:59")),
            isActive: true
        },
        {
            code: "SUMMER25",
            discountType: "PERCENTAGE",
            discountValue: 25,
            minOrderAmount: 1999,
            expiryDate: Timestamp.fromDate(new Date("2026-08-31T23:59:59")),
            isActive: true
        },
        {
            code: "VIP2000",
            discountType: "FIXED",
            discountValue: 2000,
            minOrderAmount: 9999,
            expiryDate: Timestamp.fromDate(new Date("2026-03-31T23:59:59")),
            isActive: false
        }
    ];

    for (const coupon of coupons) {
        await addToCollection("coupons", coupon, coupon.code);
    }
}

// ─── 1️⃣4️⃣ LOYALTY_TRANSACTIONS ──────────────────────────────────
async function seedLoyaltyTransactions(userIds, orderIds) {
    console.log("\n📁 Seeding LOYALTY_TRANSACTIONS...");

    const transactions = [
        {
            userId: userIds[0],
            orderId: orderIds[0]?.id,
            points: 50,
            type: "EARN",
            createdAt: serverTimestamp()
        },
        {
            userId: userIds[1],
            orderId: orderIds[1]?.id,
            points: 130,
            type: "EARN",
            createdAt: serverTimestamp()
        },
        {
            userId: userIds[0],
            orderId: orderIds[2]?.id,
            points: 100,
            type: "REDEEM",
            createdAt: serverTimestamp()
        },
        {
            userId: userIds[3],
            orderId: orderIds[3]?.id,
            points: 200,
            type: "EARN",
            createdAt: serverTimestamp()
        }
    ];

    for (const tx of transactions) {
        await addToCollection("loyalty_transactions", tx, `${tx.type} ${tx.points}pts`);
    }
}

// ─── 1️⃣5️⃣ REWARD_LEVELS ────────────────────────────────────────
async function seedRewardLevels() {
    console.log("\n📁 Seeding REWARD_LEVELS...");

    const levels = [
        {
            levelName: "Bronze",
            requiredOrders: 0,
            benefits: "Basic member. Earn 1 point per ₹100 spent."
        },
        {
            levelName: "Silver",
            requiredOrders: 5,
            benefits: "5% extra discount on all orders. Earn 2 points per ₹100 spent."
        },
        {
            levelName: "Gold",
            requiredOrders: 10,
            benefits: "10% extra discount. Free shipping on orders above ₹999. Earn 3 points per ₹100."
        },
        {
            levelName: "Platinum",
            requiredOrders: 20,
            benefits: "15% extra discount. Free shipping always. Priority support. Earn 5 points per ₹100."
        }
    ];

    for (const level of levels) {
        await addToCollection("reward_levels", level, level.levelName);
    }
}

// ─── 1️⃣6️⃣ NOTIFICATIONS ────────────────────────────────────────
async function seedNotifications(userIds) {
    console.log("\n📁 Seeding NOTIFICATIONS...");

    const notifications = [
        {
            userId: userIds[0],
            title: "Order Delivered!",
            message: "Your order #1 has been delivered successfully. Rate your products now!",
            isRead: true,
            createdAt: serverTimestamp()
        },
        {
            userId: userIds[1],
            title: "Order Shipped",
            message: "Your order #2 has been shipped. Track it now!",
            isRead: false,
            createdAt: serverTimestamp()
        },
        {
            userId: userIds[0],
            title: "New Coupon Available!",
            message: "Use code WELCOME10 to get 10% off on your next order!",
            isRead: false,
            createdAt: serverTimestamp()
        },
        {
            userId: userIds[3],
            title: "Loyalty Level Up! 🎉",
            message: "Congratulations! You've reached Platinum level. Enjoy exclusive benefits!",
            isRead: false,
            createdAt: serverTimestamp()
        },
        {
            userId: userIds[1],
            title: "Refund Processed",
            message: "Your refund of ₹3,593 for order #5 has been processed.",
            isRead: true,
            createdAt: serverTimestamp()
        },
        {
            userId: userIds[2],
            title: "Welcome to Velora!",
            message: "Start shopping and earn loyalty points on every purchase!",
            isRead: false,
            createdAt: serverTimestamp()
        }
    ];

    for (const notif of notifications) {
        await addToCollection("notifications", notif, notif.title);
    }
}

// ═══════════════════════════════════════════════════════════════
// 🚀 MAIN SEED FUNCTION
// ═══════════════════════════════════════════════════════════════
async function seedAll() {
    console.log("╔══════════════════════════════════════════════════╗");
    console.log("║   VELORA – Firestore Full Schema Seeder         ║");
    console.log("║   Seeding all 16 collections...                 ║");
    console.log("╚══════════════════════════════════════════════════╝\n");

    const startTime = Date.now();

    try {
        // 1. Admins
        const adminIds = await seedAdmins();

        // 2. Users
        const userIds = await seedUsers();

        // 3. Categories
        const categoryIds = await seedCategories();

        // 4. Subcategories (depends on categories)
        const subCatIds = await seedSubcategories(categoryIds);

        // 5. Products (depends on categories & subcategories)
        const productIds = await seedProducts(categoryIds, subCatIds);

        // 6. Product Variants (depends on products)
        await seedProductVariants(productIds);

        // 7. Orders (depends on users)
        const orderIds = await seedOrders(userIds);

        // 8. Order Items (depends on orders & products)
        await seedOrderItems(orderIds, productIds);

        // 9. Payments (depends on orders)
        await seedPayments(orderIds);

        // 10. Cart – subcollection (depends on users & products)
        await seedCart(userIds, productIds);

        // 11. Wishlist – subcollection (depends on users & products)
        await seedWishlist(userIds, productIds);

        // 12. Reviews (depends on products & users)
        await seedReviews(productIds, userIds);

        // 13. Coupons
        await seedCoupons();

        // 14. Loyalty Transactions (depends on users & orders)
        await seedLoyaltyTransactions(userIds, orderIds);

        // 15. Reward Levels
        await seedRewardLevels();

        // 16. Notifications (depends on users)
        await seedNotifications(userIds);

        const elapsed = ((Date.now() - startTime) / 1000).toFixed(2);

        console.log("\n╔══════════════════════════════════════════════════╗");
        console.log("║   🎉 SEEDING COMPLETE                           ║");
        console.log("╠══════════════════════════════════════════════════╣");
        console.log(`║   ✅ Successful: ${String(stats.success).padEnd(30)}║`);
        console.log(`║   ❌ Failed:     ${String(stats.failed).padEnd(30)}║`);
        console.log(`║   ⏱  Time:       ${String(elapsed + "s").padEnd(30)}║`);
        console.log("╚══════════════════════════════════════════════════╝");

        if (stats.failed > 0) {
            process.exit(1);
        } else {
            process.exit(0);
        }
    } catch (error) {
        console.error("\n💥 FATAL ERROR during seeding:", error);
        process.exit(1);
    }
}

seedAll();
