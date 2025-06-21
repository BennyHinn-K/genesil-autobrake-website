# 🚀 Genesil Auto Spares - Setup Guide

## 🌐 **Your Live Website**
**https://genesilautospares.vercel.app**

---

## 📋 **Setup Checklist**

### ✅ **Completed:**
- [x] Website deployed to Vercel
- [x] Custom domain configured: `genesilautospares.vercel.app`
- [x] GitHub repository: https://github.com/BennyHinn-K/genesil-autobrake-website
- [x] All pages and features working

### 🔧 **Next Steps:**

---

## 🗄️ **1. Supabase Database Setup**

### **Step 1: Create Supabase Project**
1. Go to [https://supabase.com](https://supabase.com)
2. Sign up/Login with your GitHub account
3. Click **"New Project"**
4. **Project Name**: `genesil-autospares`
5. **Database Password**: Create a strong password
6. **Region**: Choose closest to your users (e.g., `West Europe`)
7. Click **"Create new project"**

### **Step 2: Get Database Credentials**
1. Go to **Settings** → **API**
2. Copy these values:
   - **Project URL** (starts with `https://`)
   - **anon public** key
   - **service_role** key (keep this secret!)

### **Step 3: Add Environment Variables to Vercel**
1. Go to [Vercel Dashboard](https://vercel.com/bennyhinns-projects-612c30e3/genesilautobrakewebsite21)
2. Click **Settings** → **Environment Variables**
3. Add these variables:

```
NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key-here
```

### **Step 4: Set Up Database Tables**
Run this SQL in Supabase SQL Editor:

```sql
-- Create products table
CREATE TABLE products (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  sku VARCHAR(50) UNIQUE NOT NULL,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  price DECIMAL(10,2) NOT NULL,
  original_price DECIMAL(10,2),
  category VARCHAR(100) NOT NULL,
  brand VARCHAR(100),
  image VARCHAR(500),
  images TEXT[],
  stock_quantity INTEGER DEFAULT 0,
  rating DECIMAL(3,2) DEFAULT 0,
  review_count INTEGER DEFAULT 0,
  features TEXT[],
  specifications JSONB,
  tags TEXT[],
  car_models TEXT[],
  in_stock BOOLEAN DEFAULT true,
  featured BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create orders table
CREATE TABLE orders (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  customer_name VARCHAR(255) NOT NULL,
  customer_phone VARCHAR(20) NOT NULL,
  customer_email VARCHAR(255),
  total_amount DECIMAL(10,2) NOT NULL,
  status VARCHAR(50) DEFAULT 'pending',
  mpesa_transaction_id VARCHAR(100),
  items JSONB NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create sync_logs table
CREATE TABLE sync_logs (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  action VARCHAR(100) NOT NULL,
  status VARCHAR(50) NOT NULL,
  message TEXT,
  details JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE sync_logs ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Products are viewable by everyone" ON products FOR SELECT USING (true);
CREATE POLICY "Orders are viewable by authenticated users" ON orders FOR SELECT USING (auth.role() = 'authenticated');
CREATE POLICY "Sync logs are viewable by authenticated users" ON sync_logs FOR SELECT USING (auth.role() = 'authenticated');
```

---

## 💳 **2. M-Pesa API Setup**

### **Step 1: Register for M-Pesa API**
1. Go to [Safaricom Developer Portal](https://developer.safaricom.co.ke/)
2. Create an account
3. Create a new app
4. Get your credentials:
   - **Consumer Key**
   - **Consumer Secret**
   - **Business Short Code**
   - **Passkey**

### **Step 2: Add M-Pesa Environment Variables to Vercel**
Add these to your Vercel Environment Variables:

```
MPESA_CONSUMER_KEY=your-consumer-key-here
MPESA_CONSUMER_SECRET=your-consumer-secret-here
MPESA_PASSKEY=your-passkey-here
MPESA_BUSINESS_SHORT_CODE=your-business-short-code-here
MPESA_ENVIRONMENT=sandbox
```

### **Step 3: Configure Webhooks**
1. Set up callback URL: `https://genesilautospares.vercel.app/api/mpesa/callback`
2. Test the integration in sandbox mode first

---

## 🔄 **3. Deploy with Environment Variables**

After adding all environment variables:

```bash
vercel --prod --force
```

---

## 🧪 **4. Testing Checklist**

### **Test Database Connection:**
- Visit: `https://genesilautospares.vercel.app/admin`
- Check if products load from database
- Test adding/editing products

### **Test M-Pesa Integration:**
- Add items to cart
- Go through checkout process
- Test payment flow (use sandbox credentials first)

### **Test All Features:**
- [ ] Homepage loads correctly
- [ ] Product catalog displays items
- [ ] Shopping cart works
- [ ] Checkout process completes
- [ ] Admin panel accessible
- [ ] M-Pesa payments work

---

## 🚨 **Important Notes:**

1. **Environment Variables**: Never commit these to Git
2. **M-Pesa Testing**: Always test in sandbox mode first
3. **Database Security**: Keep service role key secret
4. **Backup**: Regularly backup your Supabase database

---

## 📞 **Support**

If you encounter issues:
1. Check Vercel deployment logs
2. Verify environment variables are set correctly
3. Test database connection in Supabase dashboard
4. Check M-Pesa API status

---

**🎉 Your website will be fully functional once you complete these steps!** 