# VELORA Admin Panel - Firebase Setup Guide

## 🔥 Firebase Configuration Required

The admin panel uses Firebase for authentication and data storage. Follow these steps to set it up:

## Step 1: Create a Firebase Project

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click **"Add project"** or **"Create a project"**
3. Name it: `velora-fashion` (or any name you prefer)
4. Follow the setup wizard (you can disable Google Analytics for now)

## Step 2: Get Your Firebase Config

1. In Firebase Console, click the **⚙️ Settings** icon → **Project settings**
2. Scroll down to **"Your apps"** section
3. Click the **Web icon** (`</>`) to add a web app
4. Register app name: `VELORA Admin`
5. Copy the `firebaseConfig` object

## Step 3: Update Firebase Configuration

Open `src/lib/firebase.ts` and replace the placeholder values:

```typescript
const firebaseConfig = {
    apiKey: "YOUR_ACTUAL_API_KEY",           // Replace this
    authDomain: "your-project.firebaseapp.com",
    projectId: "your-project-id",
    storageBucket: "your-project.appspot.com",
    messagingSenderId: "123456789",          // Replace this
    appId: "1:123456789:web:abc123"          // Replace this
};
```

## Step 4: Enable Authentication

1. In Firebase Console, go to **Authentication** → **Get Started**
2. Click **Sign-in method** tab
3. Enable **Email/Password** provider
4. Click **Save**

## Step 5: Create Admin User

### Option A: Via Firebase Console (Recommended)
1. Go to **Authentication** → **Users** tab
2. Click **Add user**
3. Enter:
   - **Email**: `admin@velora.com`
   - **Password**: `Admin@123` (or your choice)
4. Click **Add user**
5. **Copy the User UID** (you'll need this next)

### Option B: Via the Login Screen
1. Just try to sign up with any email/password
2. Then follow Step 6 to give that user admin access

## Step 6: Grant Admin Role

1. In Firebase Console, go to **Firestore Database**
2. Click **Create database** (choose Test mode for now)
3. Click **Start collection**
   - Collection ID: `admins`
4. Add first document:
   - **Document ID**: Paste the User UID from Step 5
   - Add field:
     - Field: `role`
     - Type: `string`
     - Value: `admin`
5. Click **Save**

## Step 7: Enable Storage (For Product Images)

1. Go to **Storage** → **Get Started**
2. Choose **Test mode** for now
3. Click **Done**

## 🎉 You're Ready!

Now you can log in with:
- **Email**: `admin@velora.com`
- **Password**: `Admin@123` (or whatever you set)

---

## 🔐 Security Notes

- Change default passwords immediately
- Switch Firestore and Storage to production rules before deploying
- Never commit `firebase.ts` with real credentials to public repos
- Consider using environment variables for production

## 📝 Quick Test Credentials

After setup, your login will be:
```
Email: admin@velora.com
Password: Admin@123
```

---

Need help? The Firebase setup should take about 5-10 minutes total.
