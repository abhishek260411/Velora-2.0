
const ACCESSORIES_PRODUCTS = [
    // ═══════════════════════════════════════════════════════════════
    // WOMEN WATCHES
    // ═══════════════════════════════════════════════════════════════
    {
        name: "Women Classic Gold Watch",
        description: "Elegant gold-tone watch for formal occasions.",
        price: 3999,
        image: "women_classic_gold_watch.png",
        stock: 40,
        category: "Accessories",
        categoryId: "Accessories",
        subCategory: "Watches",
        isAvailable: true
    },
    {
        name: "Women Silver Mesh Watch",
        description: "Minimal silver mesh strap watch with sleek dial.",
        price: 3499,
        image: "women_silver_mesh_watch.png",
        stock: 45,
        category: "Accessories",
        categoryId: "Accessories",
        subCategory: "Watches",
        isAvailable: true
    },
    {
        name: "Women Rose Gold Watch",
        description: "Luxury rose gold watch with premium finish.",
        price: 4299,
        image: "women_rose_gold_watch.png",
        stock: 35,
        category: "Accessories",
        categoryId: "Accessories",
        subCategory: "Watches",
        isAvailable: true
    },
    {
        name: "Women Leather Strap Watch",
        description: "Classic leather strap watch for everyday style.",
        price: 3199,
        image: "women_leather_strap_watch.png",
        stock: 50,
        category: "Accessories",
        categoryId: "Accessories",
        subCategory: "Watches",
        isAvailable: true
    },
    {
        name: "Women Chronograph Watch",
        description: "Premium chronograph watch with detailed dial.",
        price: 4999,
        image: "women_chronograph_watch.png",
        stock: 30,
        category: "Accessories",
        categoryId: "Accessories",
        subCategory: "Watches",
        isAvailable: true
    },
    {
        name: "Women Minimalist Black Watch",
        description: "Minimal black dial watch for modern elegance.",
        price: 3599,
        image: "women_minimal_black_watch.png",
        stock: 40,
        category: "Accessories",
        categoryId: "Accessories",
        subCategory: "Watches",
        isAvailable: true
    },
    {
        name: "Women Diamond Accent Watch",
        description: "Luxury watch with subtle diamond accents.",
        price: 5999,
        image: "women_diamond_watch.png",
        stock: 20,
        category: "Accessories",
        categoryId: "Accessories",
        subCategory: "Watches",
        isAvailable: true
    },
    {
        name: "Women Smart Casual Watch",
        description: "Stylish casual watch for daily wear.",
        price: 2799,
        image: "women_smart_casual_watch.png",
        stock: 55,
        category: "Accessories",
        categoryId: "Accessories",
        subCategory: "Watches",
        isAvailable: true
    },
    {
        name: "Women Premium Bracelet Watch",
        description: "Elegant bracelet-style watch for formal events.",
        price: 4499,
        image: "women_bracelet_watch.png",
        stock: 35,
        category: "Accessories",
        categoryId: "Accessories",
        subCategory: "Watches",
        isAvailable: true
    },
    {
        name: "Women Vintage Classic Watch",
        description: "Vintage-inspired watch with classic dial.",
        price: 3899,
        image: "women_vintage_watch.png",
        stock: 30,
        category: "Accessories",
        categoryId: "Accessories",
        subCategory: "Watches",
        isAvailable: true
    },

    // ═══════════════════════════════════════════════════════════════
    // BAGS
    // ═══════════════════════════════════════════════════════════════
    {
        name: "Women Leather Tote Bag",
        description: "Spacious leather tote bag for office and travel.",
        price: 5499,
        image: "women_leather_tote.png",
        stock: 30,
        category: "Accessories",
        categoryId: "Accessories",
        subCategory: "Bags",
        isAvailable: true
    },
    {
        name: "Women Crossbody Sling Bag",
        description: "Compact sling bag for casual outings.",
        price: 2499,
        image: "women_crossbody_bag.png",
        stock: 50,
        category: "Accessories",
        categoryId: "Accessories",
        subCategory: "Bags",
        isAvailable: true
    },
    {
        name: "Women Designer Handbag",
        description: "Premium designer handbag with elegant finish.",
        price: 6999,
        image: "women_designer_handbag.png",
        stock: 20,
        category: "Accessories",
        categoryId: "Accessories",
        subCategory: "Bags",
        isAvailable: true
    },
    {
        name: "Men Leather Laptop Bag",
        description: "Professional leather laptop bag for office use.",
        price: 4999,
        image: "men_leather_laptop_bag.png",
        stock: 25,
        category: "Accessories",
        categoryId: "Accessories",
        subCategory: "Bags",
        isAvailable: true
    },
    {
        name: "Men Casual Backpack",
        description: "Durable backpack suitable for daily commute.",
        price: 2799,
        image: "men_casual_backpack.png",
        stock: 45,
        category: "Accessories",
        categoryId: "Accessories",
        subCategory: "Bags",
        isAvailable: true
    },
    {
        name: "Women Mini Shoulder Bag",
        description: "Stylish mini shoulder bag for parties.",
        price: 2299,
        image: "women_mini_shoulder_bag.png",
        stock: 50,
        category: "Accessories",
        categoryId: "Accessories",
        subCategory: "Bags",
        isAvailable: true
    },
    {
        name: "Men Travel Duffel Bag",
        description: "Spacious duffel bag for travel and gym.",
        price: 3599,
        image: "men_travel_duffel.png",
        stock: 35,
        category: "Accessories",
        categoryId: "Accessories",
        subCategory: "Bags",
        isAvailable: true
    },
    {
        name: "Women Elegant Clutch Bag",
        description: "Premium clutch bag for evening events.",
        price: 2999,
        image: "women_elegant_clutch.png",
        stock: 40,
        category: "Accessories",
        categoryId: "Accessories",
        subCategory: "Bags",
        isAvailable: true
    },
    {
        name: "Men Office Briefcase",
        description: "Formal briefcase with professional design.",
        price: 5299,
        image: "men_office_briefcase.png",
        stock: 30,
        category: "Accessories",
        categoryId: "Accessories",
        subCategory: "Bags",
        isAvailable: true
    },
    {
        name: "Women Premium Backpack",
        description: "Modern backpack with stylish finish.",
        price: 3199,
        image: "women_premium_backpack.png",
        stock: 40,
        category: "Accessories",
        categoryId: "Accessories",
        subCategory: "Bags",
        isAvailable: true
    },

    // ═══════════════════════════════════════════════════════════════
    // JEWELLERY
    // ═══════════════════════════════════════════════════════════════
    {
        name: "Women Gold Plated Necklace",
        description: "Elegant gold plated necklace for festive occasions.",
        price: 2499,
        image: "women_gold_necklace.png",
        stock: 50,
        category: "Accessories",
        categoryId: "Accessories",
        subCategory: "Jewellery",
        isAvailable: true
    },
    {
        name: "Women Diamond Stud Earrings",
        description: "Minimal diamond stud earrings with premium shine.",
        price: 2999,
        image: "women_diamond_earrings.png",
        stock: 40,
        category: "Accessories",
        categoryId: "Accessories",
        subCategory: "Jewellery",
        isAvailable: true
    },
    {
        name: "Women Silver Charm Bracelet",
        description: "Stylish silver bracelet with elegant charms.",
        price: 1999,
        image: "women_silver_bracelet.png",
        stock: 60,
        category: "Accessories",
        categoryId: "Accessories",
        subCategory: "Jewellery",
        isAvailable: true
    },
    {
        name: "Women Traditional Jhumka Earrings",
        description: "Beautiful traditional jhumkas for ethnic wear.",
        price: 1799,
        image: "women_jhumka.png",
        stock: 55,
        category: "Accessories",
        categoryId: "Accessories",
        subCategory: "Jewellery",
        isAvailable: true
    },
    {
        name: "Men Stainless Steel Chain",
        description: "Premium stainless steel chain for modern look.",
        price: 2199,
        image: "men_steel_chain.png",
        stock: 45,
        category: "Accessories",
        categoryId: "Accessories",
        subCategory: "Jewellery",
        isAvailable: true
    },
    {
        name: "Men Leather Wrist Bracelet",
        description: "Trendy leather bracelet for casual style.",
        price: 1499,
        image: "men_leather_bracelet.png",
        stock: 60,
        category: "Accessories",
        categoryId: "Accessories",
        subCategory: "Jewellery",
        isAvailable: true
    },
    {
        name: "Women Pearl Necklace Set",
        description: "Elegant pearl necklace set for formal events.",
        price: 3499,
        image: "women_pearl_set.png",
        stock: 35,
        category: "Accessories",
        categoryId: "Accessories",
        subCategory: "Jewellery",
        isAvailable: true
    },
    {
        name: "Men Silver Ring",
        description: "Classic silver ring with premium finish.",
        price: 1899,
        image: "men_silver_ring.png",
        stock: 50,
        category: "Accessories",
        categoryId: "Accessories",
        subCategory: "Jewellery",
        isAvailable: true
    },
    {
        name: "Women Minimal Gold Ring",
        description: "Simple gold ring for daily elegance.",
        price: 1599,
        image: "women_gold_ring.png",
        stock: 65,
        category: "Accessories",
        categoryId: "Accessories",
        subCategory: "Jewellery",
        isAvailable: true
    },
    {
        name: "Men Luxury Cufflinks",
        description: "Premium cufflinks for formal attire.",
        price: 2799,
        image: "men_cufflinks.png",
        stock: 30,
        category: "Accessories",
        categoryId: "Accessories",
        subCategory: "Jewellery",
        isAvailable: true
    },

    // ═══════════════════════════════════════════════════════════════
    // EYEWEAR
    // ═══════════════════════════════════════════════════════════════
    {
        name: "Men Aviator Sunglasses",
        description: "Classic aviator sunglasses with UV protection.",
        price: 2499,
        image: "men_aviator_sunglasses.png",
        stock: 50,
        category: "Accessories",
        categoryId: "Accessories",
        subCategory: "Eyewear",
        isAvailable: true
    },
    {
        name: "Women Cat Eye Sunglasses",
        description: "Stylish cat eye sunglasses for trendy look.",
        price: 2199,
        image: "women_cat_eye_sunglasses.png",
        stock: 55,
        category: "Accessories",
        categoryId: "Accessories",
        subCategory: "Eyewear",
        isAvailable: true
    },
    {
        name: "Men Polarized Sunglasses",
        description: "Polarized sunglasses with premium lens clarity.",
        price: 2999,
        image: "men_polarized_sunglasses.png",
        stock: 40,
        category: "Accessories",
        categoryId: "Accessories",
        subCategory: "Eyewear",
        isAvailable: true
    },
    {
        name: "Women Oversized Sunglasses",
        description: "Oversized sunglasses with fashionable frame.",
        price: 2399,
        image: "women_oversized_sunglasses.png",
        stock: 50,
        category: "Accessories",
        categoryId: "Accessories",
        subCategory: "Eyewear",
        isAvailable: true
    },
    {
        name: "Men Square Frame Sunglasses",
        description: "Modern square frame sunglasses for daily wear.",
        price: 1999,
        image: "men_square_sunglasses.png",
        stock: 60,
        category: "Accessories",
        categoryId: "Accessories",
        subCategory: "Eyewear",
        isAvailable: true
    },
    {
        name: "Women Gradient Lens Sunglasses",
        description: "Elegant gradient lens sunglasses with UV protection.",
        price: 2299,
        image: "women_gradient_sunglasses.png",
        stock: 45,
        category: "Accessories",
        categoryId: "Accessories",
        subCategory: "Eyewear",
        isAvailable: true
    },
    {
        name: "Men Sports Sunglasses",
        description: "Lightweight sports sunglasses for active lifestyle.",
        price: 2699,
        image: "men_sports_sunglasses.png",
        stock: 50,
        category: "Accessories",
        categoryId: "Accessories",
        subCategory: "Eyewear",
        isAvailable: true
    },
    {
        name: "Women Classic Round Sunglasses",
        description: "Vintage-inspired round sunglasses.",
        price: 2099,
        image: "women_round_sunglasses.png",
        stock: 55,
        category: "Accessories",
        categoryId: "Accessories",
        subCategory: "Eyewear",
        isAvailable: true
    },
    {
        name: "Men Luxury Metal Frame Sunglasses",
        description: "Premium metal frame sunglasses with elegant design.",
        price: 3299,
        image: "men_metal_frame_sunglasses.png",
        stock: 30,
        category: "Accessories",
        categoryId: "Accessories",
        subCategory: "Eyewear",
        isAvailable: true
    },
    {
        name: "Women Designer Sunglasses",
        description: "Luxury designer sunglasses with bold frame.",
        price: 3599,
        image: "women_designer_sunglasses.png",
        stock: 25,
        category: "Accessories",
        categoryId: "Accessories",
        subCategory: "Eyewear",
        isAvailable: true
    }
];

module.exports = ACCESSORIES_PRODUCTS;
