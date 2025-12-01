# Quick Vercel Setup Guide

## The Issue

Your build is failing because Prisma Client needs to be generated. **This is now fixed!**

However, there are 2 more critical issues for Vercel:

### 1. SQLite Won't Work on Vercel ⚠️
Vercel is serverless - your database file will be deleted on each deployment.

### 2. File Uploads Won't Persist ⚠️
The `/public/uploads/` directory will be cleared on each deployment.

## Quick Fix Options

### Option A: Switch to PostgreSQL (Recommended)

**Easiest: Use Vercel Postgres**

1. **In Vercel Dashboard:**
   - Go to Storage → Create Database
   - Select Postgres
   - Copy the connection string (starts with `postgres://`)

2. **Update your `prisma/schema.prisma`:**
   ```prisma
   datasource db {
     provider = "postgresql"  // Changed from "sqlite"
     url      = env("DATABASE_URL")
   }
   ```

3. **Create migration locally:**
   ```bash
   # Set your Vercel Postgres URL temporarily
   export DATABASE_URL="your-vercel-postgres-url"
   
   # Create migration
   npx prisma migrate dev --name switch_to_postgres
   ```

4. **Add Environment Variables in Vercel:**
   - `DATABASE_URL` = your Vercel Postgres connection string
   - `ADMIN_EMAIL` = your admin email
   - `ADMIN_PASSWORD` = your secure password

5. **Push your changes:**
   ```bash
   git add .
   git commit -m "Switch to PostgreSQL for Vercel"
   git push
   ```

6. **After deployment, seed your database:**
   You'll need to run the seed script. Options:
   
   **Option 1: Run locally with production DB:**
   ```bash
   # Set DATABASE_URL to your Vercel Postgres URL
   export DATABASE_URL="your-vercel-postgres-url"
   npx tsx scripts/seed.ts
   ```
   
   **Option 2: Add a seed endpoint (temporary):**
   Create `app/api/admin/seed/route.ts`:
   ```typescript
   import { NextResponse } from "next/server";
   import { exec } from "child_process";
   import { promisify } from "util";

   const execAsync = promisify(exec);

   export async function POST(request: Request) {
     const { password } = await request.json();
     
     // Use a secret password to protect this endpoint
     if (password !== process.env.SEED_PASSWORD) {
       return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
     }

     try {
       await execAsync("npx tsx scripts/seed.ts");
       return NextResponse.json({ success: true });
     } catch (error) {
       return NextResponse.json({ error: String(error) }, { status: 500 });
     }
   }
   ```
   
   Add `SEED_PASSWORD` to Vercel env vars, then call:
   ```bash
   curl -X POST https://your-app.vercel.app/api/admin/seed \
     -H "Content-Type: application/json" \
     -d '{"password":"your-seed-password"}'
   ```
   
   **Delete this endpoint after seeding!**

### Option B: Use a Different Platform

If you want to keep SQLite and local file storage:

**Railway (Recommended Alternative):**
```bash
# Install Railway CLI
npm i -g @railway/cli

# Login and deploy
railway login
railway init
railway up
```

Railway supports persistent storage, so your SQLite and uploads will work!

**DigitalOcean App Platform:**
- Also supports persistent storage
- Connect your GitHub repo
- Configure build settings
- Deploy

## File Upload Solution for Vercel

Even with Postgres, file uploads won't persist. You need cloud storage:

### Quick Fix: Vercel Blob

1. **Install Vercel Blob:**
   ```bash
   npm install @vercel/blob
   ```

2. **Enable in Vercel Dashboard:**
   - Go to Storage → Blob
   - Enable it (free tier: 100GB bandwidth/month)

3. **Update `app/api/upload/route.ts`:**
   ```typescript
   import { put } from '@vercel/blob';
   
   // Replace the file writing code with:
   const blob = await put(filename, buffer, {
     access: 'public',
   });
   
   // Use blob.url instead of local path
   ```

### Alternative: Cloudflare R2 (More Storage)
- Free: 10GB storage, no egress fees
- Similar to AWS S3 but cheaper

## Current Build Status

✅ **Fixed:** Prisma generation (added `postinstall` script)
⚠️ **Needs Action:** Database (SQLite → PostgreSQL)
⚠️ **Needs Action:** File uploads (local → cloud storage)

## Recommended Path Forward

**For Production:**
1. Use PostgreSQL (Vercel Postgres is easiest)
2. Use Vercel Blob for file uploads
3. Total cost: $0 (within free tiers)

**For Testing:**
1. Deploy to Railway instead (supports SQLite + local files)
2. Cost: $5/month (more generous than Vercel for this use case)

## Summary

Your build error is **fixed** (Prisma generation), but Vercel requires:
- External database (can't use SQLite)
- Cloud storage for uploads (can't use local files)

**Choose your path:**
- 🚀 **Quick & Easy:** Switch to PostgreSQL + Vercel Blob
- 🛤️ **Keep Current Setup:** Deploy to Railway instead

Let me know which path you'd like to take!

