# Kay Website Services

**KayCorp** is a full-stack Next.js application that powers the Kay Website Services marketing site and the **ThinkBox** educational platform — an offline-first, AI-powered knowledge explorer for learners aged 6–14.

---

## Architecture Overview

- **Framework**: Next.js 16 (App Router) with React 19 and TypeScript 5
- **Database**: MongoDB via Mongoose 8
- **Authentication**: JWT (signed cookies for admin, HTTP-only cookies for users)
- **AI Content**: Google Gemini + OpenRouter fallback for article generation
- **Email**: Resend for transactional mail
- **Real-time**: Pusher for WebSocket events
- **Deployment**: Vercel (with MongoDB Atlas for production)

### Key Routes

| Route | Purpose | Auth | Notes |
|-------|---------|------|-------|
| `/` | Marketing homepage | Public | Agency services, portfolio |
| `/products/thinkbox` | ThinkBox school plans, one-month trial, and sign-in | Public | Unified entry point for ThinkBox |
| `/products/thinkbox/pitchdeck` | ThinkBox pitch deck page | Public | Investor and partner overview |
| `/thinkbox` | Redirect to `/products/thinkbox` | Public | Canonical alias |
| `/dashboard` | User profile dashboard | User | Post-login profile view |
| `/system` | ThinkBox app (articles, backpack, XP) | User | Main educational interface |
| `/admin/demo-requests` | Admin panel for demo approvals | Admin | Cookie-based admin auth |
| `/api/login` | User login (returns JWT cookie) | Public | Rate-limited (10/15min) |
| `/api/logout` | User logout | User | Clears JWT cookie |
| `/api/admin/login` | Admin login (returns signed session cookie) | Public | Rate-limited (5/15min) |
| `/api/demo-request` | Submit demo signup | Public | Rate-limited (3/hour) |
| `/api/admin/demo-requests/approve` | Approve/reject demo requests | Admin | Sends setup token via email |
| `/api/contact` | Public contact form | Public | Rate-limited (5/hour) |

---

## Environment Variables

Create a `.env.local` file in the project root with the following:

### **Required** (app will fail startup if missing)

```bash
# MongoDB connection string (Atlas or local)
MONGODB_URI=mongodb+srv://user:pass@cluster.mongodb.net/kay-corp?retryWrites=true&w=majority

# JWT secret for user auth tokens (min 32 chars, random)
JWT_SECRET=your-secure-random-secret-min-32-chars

# Admin session secret for signed cookies (min 32 chars, random)
ADMIN_SESSION_SECRET=your-admin-secret-min-32-chars

# Resend API key for transactional email
RESEND_API_KEY=re_xxxxxxxxxxxx

# Google Gemini API key for article generation
GEMINI_API_KEY=AIzaSyXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX

# Public app URL (for email links)
NEXT_PUBLIC_APP_URL=https://kaycorp.tech
```

### **Optional** (features degrade gracefully if missing)

```bash
# OpenRouter API key (fallback for Gemini rate limits)
OPENROUTER_API_KEY=sk-or-v1-xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx

# Pusher credentials (real-time mobile sync feature)
PUSHER_APP_ID=123456
PUSHER_KEY=xxxxxxxxxxxxxx
PUSHER_SECRET=xxxxxxxxxxxxxx
PUSHER_CLUSTER=us2
NEXT_PUBLIC_PUSHER_KEY=xxxxxxxxxxxxxx
NEXT_PUBLIC_PUSHER_CLUSTER=us2

# NASA API key (for space imagery in ThinkBox)
NASA_API_KEY=DEMO_KEY  # DEMO_KEY works for dev; get free key at api.nasa.gov
```

### Generating Secrets

```bash
# Generate JWT_SECRET and ADMIN_SESSION_SECRET
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

---

## Local Development Setup

### Prerequisites

- **Node.js** 20+ and npm 10+
- **MongoDB** instance (local or Atlas)
- **Git**

### Installation

```bash
# Clone the repository
git clone https://github.com/kunini79/Kay-Website-Services.git
cd Kay-Website-Services

# Install dependencies
npm install

# Create environment file
cp .env.example .env.local  # Or create manually per section above

# Verify MongoDB connection (optional but recommended)
node -e "require('mongoose').connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/kay-corp').then(() => console.log('✓ MongoDB connected')).catch(e => console.error('✗ MongoDB failed:', e.message))"

# Start development server
npm run dev
```

The app will be available at **http://localhost:3000**

### Common Dev Tasks

```bash
# Type-check without building
npx tsc --noEmit

# Lint all files
npm run lint

# Build for production (tests for build errors)
npm run build

# Run production build locally
npm run start

# Download offline topic thumbnails (optional, for ThinkBox offline mode)
npm run download:topic-images
```

---

## Project Structure

```
Kay-Website-Services/
├── app/                        # Next.js App Router pages
│   ├── api/                   # API route handlers
│   │   ├── admin/            # Admin-only endpoints
│   │   ├── contact/          # Public contact form
│   │   ├── demo-request/     # Demo signup
│   │   ├── login/            # User authentication
│   │   └── logout/           # User logout
│   ├── products/thinkbox/    # ThinkBox marketing + signup page
│   ├── dashboard/            # User profile dashboard
│   ├── system/               # ThinkBox app (React client)
│   │   ├── components/       # UI components (Header, ArticleView, etc.)
│   │   ├── services/         # geminiService.ts (AI article generation)
│   │   └── types.ts          # TypeScript definitions
│   └── admin/                # Admin UI for demo approvals
├── components/                # Shared React components
├── lib/                       # Backend utilities
│   ├── auth.ts               # JWT creation/verification
│   ├── db.ts                 # MongoDB connection
│   ├── logger.ts             # Structured logging + request IDs
│   └── models/               # Mongoose schemas (DemoUser, DemoRequest)
├── utils/                     # Frontend/backend utilities
│   ├── animations.ts         # GSAP animation helpers
│   └── rateLimit.ts          # In-memory rate limiter
├── public/                    # Static assets
│   ├── projects/             # Portfolio project images
│   ├── ThinkBox/             # ThinkBox static assets
│   └── offline/              # Offline topic data (topics.json)
└── scripts/                   # Build/maintenance scripts
    └── download-topics.js    # Fetch offline topic thumbnails
```

---

## Deployment Checklist

### Vercel Deployment (Recommended)

1. **Push to GitHub**
   ```bash
   git add .
   git commit -m "Deploy: production release"
   git push origin main
   ```

2. **Create Vercel Project**
   - Connect GitHub repo at [vercel.com/new](https://vercel.com/new)
   - Framework preset: **Next.js**
   - Root directory: `./`

3. **Configure Environment Variables**
   - Go to Project Settings → Environment Variables
   - Add **all required env vars** from `.env.local` (copy-paste)
   - Set `NEXT_PUBLIC_APP_URL` to your production domain (e.g., `https://kaycorp.tech`)

4. **Deploy**
   - Vercel auto-deploys on every push to `main`
   - Monitor build logs for errors
   - Test critical flows:
     - ✅ Public pages load (`/`, `/products/thinkbox`)
     - ✅ Demo request submission works
     - ✅ User login → redirects to `/system`
     - ✅ Admin login → can approve/reject requests
     - ✅ Email delivery (check spam folder if needed)

5. **MongoDB Atlas Setup** (if not already configured)
   - Create free cluster at [cloud.mongodb.com](https://cloud.mongodb.com)
   - Whitelist Vercel IPs: `0.0.0.0/0` (or use Vercel's IP ranges)
   - Copy connection string to `MONGODB_URI` env var

6. **Custom Domain** (optional)
   - Add domain in Vercel Project Settings → Domains
   - Update `NEXT_PUBLIC_APP_URL` env var to match

### Post-Deployment Verification

```bash
# Test API health
curl https://your-domain.com/api/verify-auth
# Expected: {"message":"Unauthorized"} with 401 status (proves API works)

# Test rate limiting
for i in {1..6}; do curl -X POST https://your-domain.com/api/contact -d '{}'; done
# Expected: 429 Too Many Requests after 5 requests
```

---

## Security Notes

- **Secrets**: Never commit `.env.local` or expose secrets in client code
- **Rate Limiting**: All auth/email routes are rate-limited; current limits are in-memory (reset on restart)
- **Admin Auth**: Uses signed cookies (`ADMIN_SESSION_SECRET`) + role checks; never expose admin routes publicly
- **User Passwords**: Bcrypt-hashed with 12 rounds; setup tokens expire after 72 hours
- **JWT Tokens**: HTTP-only, secure cookies; expire after 7 days
- **Email Validation**: Server-side validation + HTML sanitization on all user inputs (see [lib/logger.ts](lib/logger.ts) for error classes)

---

## Troubleshooting

### Build Errors

**Issue**: `Cannot find module 'embla-carousel-react'`
- **Cause**: Missing type declarations (known issue)
- **Fix**: Ignore in TypeScript compilation — doesn't affect runtime
  ```bash
  npx tsc --noEmit --skipLibCheck
  ```

### Database Connection Fails

**Issue**: `MongoServerError: bad auth`
- **Fix**: Check `MONGODB_URI` credentials; ensure IP is whitelisted in Atlas

### Email Not Sending

**Issue**: `Failed to send email` in logs
- **Fix**: Verify `RESEND_API_KEY` is valid; check Resend dashboard for quota/errors
- **Fallback**: Emails fail gracefully — users still get created, but won't receive login links

### Gemini Rate Limits

**Issue**: `429 Too Many Requests` from Gemini API
- **Fix**: Set `OPENROUTER_API_KEY` as fallback; or upgrade Gemini quota at [ai.google.dev](https://ai.google.dev)

### Offline Topics Missing

**Issue**: ThinkBox shows "No offline topics" in `/system`
- **Fix**: Run `npm run download:topic-images` to populate `public/offline/topics.json`

---

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/my-feature`)
3. Commit changes with descriptive messages
4. Push to your fork and submit a Pull Request
5. Ensure all checks pass (TypeScript, ESLint, build)

---

## License

Proprietary — © 2026 KayCorp. All rights reserved.

---

## Support

- **Bugs/Features**: Open an issue on GitHub
- **Contact**: info@kaycorp.tech
- **Documentation**: This README + inline code comments
