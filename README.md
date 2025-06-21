# Genesil Auto Brake Website

A modern e-commerce website for Genesil Auto Brake, built with Next.js 14, TypeScript, and Tailwind CSS.

## 🚀 Features

- **Modern E-commerce Platform**: Complete online store with product catalog, shopping cart, and checkout
- **M-Pesa Integration**: Secure mobile money payments through M-Pesa API
- **Admin Dashboard**: Comprehensive admin panel for product and order management
- **Responsive Design**: Mobile-first design that works on all devices
- **Real-time Updates**: Live product synchronization and status updates
- **Authentication**: Secure user authentication and authorization
- **Database Integration**: Supabase backend for data management

## 🛠️ Tech Stack

- **Frontend**: Next.js 14, React 18, TypeScript
- **Styling**: Tailwind CSS, Radix UI Components
- **Backend**: Next.js API Routes, Supabase
- **Payment**: M-Pesa API Integration
- **Database**: Supabase PostgreSQL
- **Deployment**: Vercel (recommended)

## 📁 Project Structure

```
genesilautobrakewebsite21/
├── app/                    # Next.js 14 app directory
│   ├── admin/             # Admin dashboard
│   ├── api/               # API routes
│   ├── components/        # React components
│   ├── context/           # React context providers
│   └── ...                # Other app pages
├── components/            # Shared UI components
├── lib/                   # Utility functions and configurations
├── public/                # Static assets
└── types/                 # TypeScript type definitions
```

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn
- Git

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/BennyHinn-K/genesil-autobrake-website.git
   cd genesil-autobrake-website
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   Create a `.env.local` file with:
   ```env
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
   MPESA_CONSUMER_KEY=your_mpesa_consumer_key
   MPESA_CONSUMER_SECRET=your_mpesa_consumer_secret
   MPESA_PASSKEY=your_mpesa_passkey
   MPESA_BUSINESS_SHORT_CODE=your_business_short_code
   ```

4. **Run the development server**
   ```bash
   npm run dev
   ```

5. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 📱 Features Overview

### Customer Features
- **Product Catalog**: Browse and search products
- **Shopping Cart**: Add/remove items, quantity management
- **Checkout**: Secure checkout with M-Pesa integration
- **Order Tracking**: Track order status and history
- **Responsive Design**: Works on mobile, tablet, and desktop

### Admin Features
- **Product Management**: Add, edit, delete products
- **Order Management**: View and update order status
- **Database Management**: Sync and manage data
- **M-Pesa Status**: Monitor payment transactions
- **Analytics**: View sales and performance metrics

## 🔧 Configuration

### M-Pesa Setup
1. Register for M-Pesa API access
2. Configure your business short code
3. Set up webhook endpoints
4. Test transactions in sandbox mode

### Supabase Setup
1. Create a Supabase project
2. Set up database tables
3. Configure authentication
4. Set up row level security

## 🚀 Deployment

### Deploy to Vercel

1. **Connect to Vercel**
   - Install Vercel CLI: `npm i -g vercel`
   - Run: `vercel`

2. **Configure Environment Variables**
   - Add all environment variables in Vercel dashboard
   - Set up production M-Pesa credentials

3. **Deploy**
   ```bash
   vercel --prod
   ```

### Alternative Deployment Options
- **Netlify**: Configure build settings for Next.js
- **Railway**: Deploy with database integration
- **AWS**: Use Amplify or EC2

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature-name`
3. Commit changes: `git commit -m 'Add feature'`
4. Push to branch: `git push origin feature-name`
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👨‍💻 Author

**BennyHinn-K**
- Email: karisg800@gmail.com
- GitHub: [@BennyHinn-K](https://github.com/BennyHinn-K)

## 🙏 Acknowledgments

- Next.js team for the amazing framework
- Vercel for hosting and deployment
- Supabase for backend services
- M-Pesa for payment integration
- Tailwind CSS for styling utilities

---

**Genesil Auto Brake** - Your trusted partner in automotive safety solutions. 