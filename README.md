# Spott - Event Management Platform

🔗 **Live Demo:** [https://spott-apvy.vercel.app/](https://spott-apvy.vercel.app/)

## Overview

Spott is a modern event management platform built with Next.js and Convex. It allows users to create, discover, and register for events with features like QR code ticketing, event search, and user authentication.

---

## 🛠️ Tech Stack

### Frontend
- **React** - `18.3.1` - UI library
- **Next.js** - `14.2.5` - React framework with App Router
- **TypeScript/JavaScript** - Programming language
- **Tailwind CSS** - `4` - Utility-first CSS framework
- **shadcn/ui** - `3.8.5` - Reusable component library

### UI Components & Libraries
- **Radix UI** - `1.4.3` - Headless UI component system
  - `@radix-ui/react-avatar` - `1.1.11`
  - `@radix-ui/react-dialog` - `1.1.15`
  - `@radix-ui/react-label` - `2.1.8`
  - `@radix-ui/react-popover` - `1.1.15`
  - `@radix-ui/react-progress` - `1.1.8`
  - `@radix-ui/react-select` - `2.2.6`
  - `@radix-ui/react-separator` - `1.1.8`
  - `@radix-ui/react-slot` - `1.2.4`
  - `@radix-ui/react-tabs` - `1.1.13`
- **Lucide React** - `0.561.0` - Icon library
- **Sonner** - `2.0.7` - Toast notifications
- **Embla Carousel** - `8.6.0` - Carousel component

### Backend & Database
- **Convex** - `1.31.0` - Backend platform with real-time database
- **Clerk** - Authentication & user management
  - `@clerk/nextjs` - `6.37.3`
  - `@clerk/themes` - `2.4.43`

### Forms & Validation
- **React Hook Form** - `7.71.1` - Form state management
- **@hookform/resolvers** - `5.2.2` - Form validation resolvers
- **Zod** - `4.3.6` - TypeScript-first schema validation

### Utilities & Features
- **Date-fns** - `4.1.0` - Date manipulation
- **QR Code** - QR code generation and scanning
- `html5-qrcode` - `2.3.8` - QR code scanner
- `react-qr-code` - `2.0.18` - QR code generator
- **Country State City** - `3.2.1` - Location data
- **Lodash** - `4.17.23` - Utility functions
- **class-variance-authority** - `0.7.1` - Component styling
- **clsx** - `2.1.1` - Conditional CSS classes
- **tailwind-merge** - `3.5.0` - Merge Tailwind classes
- **next-themes** - `0.4.6` - Dark mode support

### Development Tools
- **ESLint** - `9` - Code linting
- **PostCSS** - `@tailwindcss/postcss` - `4` - CSS processing
- **React Day Picker** - `9.12.0` - Date picker component

---

## 📋 Prerequisites

Before you begin, ensure you have the following installed:
- **Node.js** - `v18+` (recommended `v20+`)
- **npm** or **yarn** - Package manager
- **Git** - Version control
- **Convex Account** - For backend (free tier available)
- **Clerk Account** - For authentication (free tier available)

---

## 🚀 Installation & Setup

### 1. Clone the Repository
```bash
git clone https://github.com/your-username/spott.git
cd spott
```

### 2. Install Dependencies
```bash
npm install
# or
yarn install
```

### 3. Environment Variables

Create a `.env.local` file in the root directory with the following variables:

```env
# Clerk Authentication
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key
CLERK_SECRET_KEY=your_clerk_secret_key
NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up
NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL=/
NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL=/

# Convex Backend
NEXT_PUBLIC_CONVEX_URL=your_convex_url
CONVEX_DEPLOYMENT=your_convex_deployment
```

### 4. Get API Keys

**For Clerk:**
1. Go to [clerk.com](https://clerk.com)
2. Create a new application
3. Copy your `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` and `CLERK_SECRET_KEY`

**For Convex:**
1. Go to [convex.dev](https://convex.dev)
2. Create a new project
3. Copy your `NEXT_PUBLIC_CONVEX_URL`

### 5. Initialize Convex
```bash
npx convex dev
```

This will:
- Create a Convex project
- Set up the database
- Generate TypeScript types

### 6. Sync Database Schema
```bash
npx convex deploy
```

---

---

## ✨ Features

- ✅ **User Authentication** - Secure sign-in/sign-up with Clerk
- ✅ **Event Creation** - Create and manage events
- ✅ **Event Discovery** - Search and explore events by location
- ✅ **Event Registration** - Register for events with real-time updates
- ✅ **QR Code Ticketing** - Generate and scan QR codes for tickets
- ✅ **Event Management** - View attendees and check-ins
- ✅ **Dark/Light Mode** - Theme switching support
- ✅ **Responsive Design** - Mobile-first UI
- ✅ **Real-time Updates** - Powered by Convex
- ✅ **Location-based Search** - Find events near you

---

## 🔐 Security

- Sensitive data is stored in `.env.local`
- Authentication handled by Clerk
- Backend operations secured with Convex
- QR codes used for ticket verification

---
