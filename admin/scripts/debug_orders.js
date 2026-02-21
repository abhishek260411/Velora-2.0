// Debug script - minimal, just show the single order document
const { initializeApp } = require("firebase/app");
const { getFirestore, collection, getDocs } = require("firebase/firestore");

require('dotenv').config();

const firebaseConfig = {
    apiKey: process.env.FIREBASE_API_KEY,
    authDomain: process.env.FIREBASE_AUTH_DOMAIN,
    projectId: process.env.FIREBASE_PROJECT_ID,
    storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
    messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID,
    appId: process.env.FIREBASE_APP_ID
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

async function run() {
    try {
        const snap = await getDocs(collection(db, "orders"));
        console.log("COUNT:", snap.size);
        snap.docs.forEach((d) => {
            const data = d.data();
            const sanitized = { ...data };
            delete sanitized.name;
            delete sanitized.customerName;
            delete sanitized.address;
            delete sanitized.shippingAddress;
            delete sanitized.payment;
            delete sanitized.cardNumber;
            delete sanitized.email;
            delete sanitized.customerEmail;
            delete sanitized.phone;
            delete sanitized.customerPhone;

            console.log("ID:", d.id);
            console.log("DATA:", JSON.stringify(sanitized, null, 2));
        });
        process.exit(0);
    } catch (err) {
        console.error("Error reading orders:", err);
        process.exit(1);
    }
}
run();
