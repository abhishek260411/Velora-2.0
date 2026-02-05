const { initializeApp } = require("firebase/app");
const { getFirestore, collection, addDoc, serverTimestamp } = require("firebase/firestore");

// Configuration matching src/config/firebase.js but using require for Node.js
const firebaseConfig = {
    apiKey: "YOUR_API_KEY", // Note: For a local admin script, standard auth might fail if not using service account or valid credentials. 
    // However, since we are largely in dev mode, we can try using the web SDK if auth rules allow public write or if we are authenticated.
    // Better approach: ensure firebase.js in src is usable? 
    // Actually, let's assume we need to copy the config details correctly or use a placeholder if the user has it in a file.
    // I will rely on the fact that I can paste the config here.
    // WAIT: I don't have the API Key in plain text in previous turns (I might have seen it in a file).
    // Let me read src/config/firebase.js first to get the config.
};

// ... I will read the file in a separate step to get the config, then write this file.
// Integrating the data directly:

const PRODUCTS = [
    // --- SHOES: Men's Running ---
    {
        name: "Men Pro Running Shoes",
        brand: "VELORA SPORTS",
        category: "Shoes",
        subCategory: "Men's Running",
        price: 3499,
        image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&q=80&w=600",
        isNewArrival: true,
        stock: 30,
        description: "High-performance running shoes with superior cushioning."
    },
    {
        name: "Men Lightweight Runner",
        brand: "VELORA ACTIVE",
        category: "Shoes",
        subCategory: "Men's Running",
        price: 3199,
        image: "https://images.unsplash.com/photo-1491553895911-0055eca6402d?auto=format&fit=crop&q=80&w=600",
        isNewArrival: false,
        stock: 28,
        description: "Lightweight running shoes designed for long-distance comfort."
    },
    {
        name: "Men Marathon Shoes",
        brand: "VELORA PRO",
        category: "Shoes",
        subCategory: "Men's Running",
        price: 3799,
        image: "https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?auto=format&fit=crop&q=80&w=600",
        isNewArrival: true,
        stock: 22,
        description: "Professional marathon shoes with energy-return sole."
    },
    {
        name: "Men Daily Running Shoes",
        brand: "VELORA ACTIVE",
        category: "Shoes",
        subCategory: "Men's Running",
        price: 2699,
        image: "https://images.unsplash.com/photo-1588117260148-132d75836872?auto=format&fit=crop&q=80&w=600", // Placeholder replacement
        isNewArrival: false,
        stock: 35,
        description: "Daily-use running shoes for fitness and jogging."
    },
    {
        name: "Men Cushion Run Shoes",
        brand: "VELORA COMFORT",
        category: "Shoes",
        subCategory: "Men's Running",
        price: 2999,
        image: "https://images.unsplash.com/photo-1627964434918-62d2d9b68759?auto=format&fit=crop&q=80&w=600", // Placeholder replacement
        isNewArrival: true,
        stock: 26,
        description: "Extra-cushioned running shoes for joint protection."
    },

    // --- SHOES: Men's Formal ---
    {
        name: "Men Leather Oxford Shoes",
        brand: "VELORA CLASSIC",
        category: "Shoes",
        subCategory: "Men's Formal",
        price: 3599,
        image: "https://images.unsplash.com/photo-1614252369475-531eba835eb1?auto=format&fit=crop&q=80&w=600",
        isNewArrival: true,
        stock: 25,
        description: "Premium leather Oxford shoes for formal occasions."
    },
    {
        name: "Men Office Lace-Up Shoes",
        brand: "VELORA OFFICE",
        category: "Shoes",
        subCategory: "Men's Formal",
        price: 3399,
        image: "https://images.unsplash.com/photo-1533867617858-e7b97e0605df?auto=format&fit=crop&q=80&w=600",
        isNewArrival: false,
        stock: 30,
        description: "Office-ready lace-up shoes with polished finish."
    },
    {
        name: "Men Formal Derby Shoes",
        brand: "VELORA ELITE",
        category: "Shoes",
        subCategory: "Men's Formal",
        price: 3799,
        image: "https://images.unsplash.com/photo-1551446339-1e5c6f164ec2?auto=format&fit=crop&q=80&w=600", // Needs reliable formal shoes image
        isNewArrival: true,
        stock: 20,
        description: "Elegant Derby shoes with classic formal design."
    },
    {
        name: "Men Business Formal Shoes",
        brand: "VELORA WORK",
        category: "Shoes",
        subCategory: "Men's Formal",
        price: 3299,
        image: "https://images.unsplash.com/photo-1478146896981-b80fe463b330?auto=format&fit=crop&q=80&w=600",
        isNewArrival: false,
        stock: 27,
        description: "Business-style formal shoes for professional wear."
    },
    {
        name: "Men Premium Formal Shoes",
        brand: "VELORA LUXE",
        category: "Shoes",
        subCategory: "Men's Formal",
        price: 3999,
        image: "https://images.unsplash.com/photo-1549298916-b41d501d3772?auto=format&fit=crop&q=80&w=600",
        isNewArrival: true,
        stock: 18,
        description: "Premium handcrafted formal shoes with leather sole."
    },

    // --- MEN: Tops ---
    {
        name: "Men Cotton T-Shirt",
        brand: "VELORA BASICS",
        category: "Men",
        subCategory: "Tops",
        price: 899,
        image: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&q=80&w=600",
        isNewArrival: true,
        stock: 80,
        description: "Soft cotton t-shirt for daily casual wear."
    },
    {
        name: "Men Polo T-Shirt",
        brand: "VELORA WEAR",
        category: "Men",
        subCategory: "Tops",
        price: 1199,
        image: "https://images.unsplash.com/photo-1586363104862-3a5e2ab60d99?auto=format&fit=crop&q=80&w=600",
        isNewArrival: false,
        stock: 65,
        description: "Classic polo t-shirt with premium fabric."
    },
    {
        name: "Men Printed T-Shirt",
        brand: "VELORA TREND",
        category: "Men",
        subCategory: "Tops",
        price: 999,
        image: "https://images.unsplash.com/photo-1576566588028-4147f3842f27?auto=format&fit=crop&q=80&w=600",
        isNewArrival: true,
        stock: 70,
        description: "Stylish printed t-shirt with modern fit."
    },
    {
        name: "Men Oversized T-Shirt",
        brand: "VELORA STREET",
        category: "Men",
        subCategory: "Tops",
        price: 1299,
        image: "https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?auto=format&fit=crop&q=80&w=600",
        isNewArrival: false,
        stock: 55,
        description: "Oversized t-shirt inspired by street fashion."
    },
    {
        name: "Men Sports T-Shirt",
        brand: "VELORA ACTIVE",
        category: "Men",
        subCategory: "Tops",
        price: 1099,
        image: "https://images.unsplash.com/photo-1581655353564-df123a1eb820?auto=format&fit=crop&q=80&w=600",
        isNewArrival: true,
        stock: 60,
        description: "Moisture-wicking sports t-shirt for workouts."
    },

    // --- WOMEN: Tops ---
    {
        name: "Women Crop Top",
        brand: "VELORA TREND",
        category: "Women",
        subCategory: "Tops",
        price: 999,
        image: "https://images.unsplash.com/photo-1503342394128-c104d54dba01?auto=format&fit=crop&q=80&w=600",
        isNewArrival: true,
        stock: 70,
        description: "Trendy crop top with stretchable fabric."
    },
    {
        name: "Women Casual Top",
        brand: "VELORA WEAR",
        category: "Women",
        subCategory: "Tops",
        price: 1199,
        image: "https://images.unsplash.com/photo-1563826998-f2b96fa5300e?auto=format&fit=crop&q=80&w=600",
        isNewArrival: false,
        stock: 65,
        description: "Comfortable casual top for everyday use."
    },
    {
        name: "Women Ribbed Top",
        brand: "VELORA STREET",
        category: "Women",
        subCategory: "Tops",
        price: 1099,
        image: "https://images.unsplash.com/photo-1434389677669-e08b4cac3105?auto=format&fit=crop&q=80&w=600",
        isNewArrival: true,
        stock: 60,
        description: "Ribbed fitted top with modern silhouette."
    },
    {
        name: "Women Blouse Top",
        brand: "VELORA CLASSIC",
        category: "Women",
        subCategory: "Tops",
        price: 1399,
        image: "https://images.unsplash.com/photo-1551163943-3f6a29e39454?auto=format&fit=crop&q=80&w=600",
        isNewArrival: false,
        stock: 45,
        description: "Elegant blouse suitable for formal and casual wear."
    },
    {
        name: "Women Tunic Top",
        brand: "VELORA COMFORT",
        category: "Women",
        subCategory: "Tops",
        price: 1499,
        image: "https://images.unsplash.com/photo-1549488344-c7079f8501dd?auto=format&fit=crop&q=80&w=600",
        isNewArrival: true,
        stock: 50,
        description: "Long tunic top designed for comfort and style."
    },

    // --- ACCESSORIES: Men's Wallets ---
    {
        name: "Men Leather Wallet",
        brand: "VELORA CLASSIC",
        category: "Accessories",
        subCategory: "Men's Wallets",
        price: 1499,
        image: "https://images.unsplash.com/photo-1627123424574-181ce90b94c0?auto=format&fit=crop&q=80&w=600",
        isNewArrival: false,
        stock: 100,
        description: "Genuine leather wallet with multiple card slots."
    },
    {
        name: "Men Slim Wallet",
        brand: "VELORA URBAN",
        category: "Accessories",
        subCategory: "Men's Wallets",
        price: 1299,
        image: "https://images.unsplash.com/photo-1627483262268-9c2b5b2ee910?auto=format&fit=crop&q=80&w=600",
        isNewArrival: true,
        stock: 90,
        description: "Slim profile wallet for minimal everyday carry."
    },
    {
        name: "Men RFID Wallet",
        brand: "VELORA SECURE",
        category: "Accessories",
        subCategory: "Men's Wallets",
        price: 1699,
        image: "https://images.unsplash.com/photo-1558584859-4f810167c050?auto=format&fit=crop&q=80&w=600",
        isNewArrival: true,
        stock: 75,
        description: "RFID-protected wallet to secure cards and data."
    },
    {
        name: "Men Bi-Fold Wallet",
        brand: "VELORA DAILY",
        category: "Accessories",
        subCategory: "Men's Wallets",
        price: 1399,
        image: "https://images.unsplash.com/photo-1598532163257-ae3c6b2524b6?auto=format&fit=crop&q=80&w=600",
        isNewArrival: false,
        stock: 85,
        description: "Classic bifold wallet with durable stitching."
    },
    {
        name: "Men Premium Wallet",
        brand: "VELORA LUXE",
        category: "Accessories",
        subCategory: "Men's Wallets",
        price: 1899,
        image: "https://images.unsplash.com/photo-1627123424574-181ce90b94c0?auto=format&fit=crop&q=80&w=600", // Reuse of nice wallet image for now
        isNewArrival: true,
        stock: 60,
        description: "Premium leather wallet with elegant finish."
    }
];
