# Micro Blog

A simple, clean, and bulletproof micro-blogging platform built with Next.js, similar to Twitter but designed for a single user.

## Features

- 🔐 **Single-user authentication** - Secure login for the blog owner
- ✍️ **WYSIWYG editor** - Rich text editing with TipTap
- 📝 **Post management** - Create, view, and delete posts
- 📸 **Media support** - Upload images, videos, and audio files
- 🎨 **Clean UI** - Simple and modern design with Tailwind CSS
- 💾 **SQLite database** - Lightweight local storage with Prisma ORM
- 🔒 **Production-ready** - Security headers, rate limiting, and more

## Getting Started

### Prerequisites

- Node.js (v20.9.0 or higher recommended, v20.0.0 minimum for dev mode)
- npm or yarn

**Note:** If you encounter Node version warnings, either upgrade Node.js to v20.9.0+ or run in development mode with `npm run dev` which is more lenient.

### Installation

1. **Install dependencies:**
```bash
npm install --legacy-peer-deps
```

2. **Set up the database:**
The database and admin user should already be initialized. If not, run:
```bash
npx prisma migrate dev
npx tsx scripts/seed.ts
```

3. **Configure admin credentials (optional):**
Edit the `.env` file to change your admin credentials:
```env
DATABASE_URL="file:./dev.db"
ADMIN_EMAIL="your-email@example.com"
ADMIN_PASSWORD="your-secure-password"
```

If you change credentials, re-run the seed script:
```bash
npx tsx scripts/seed.ts
```

### Running the Application

**Development:**
```bash
npm run dev
```

**Production:**
```bash
npm run build
npm start
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Additional Commands

```bash
npm run db:migrate   # Run database migrations (production)
npm run db:seed      # Seed admin user
npm run db:backup    # Backup database and uploads
npm run db:studio    # Open Prisma Studio (database GUI)
```

## Usage

### Login
Use the admin credentials you set in your `.env` file (see Configuration above).

**Important:** Change the default credentials before deploying to production!

### Creating Posts

1. Click **Login** in the top right corner
2. Enter your credentials
3. Click **New Post** to access the editor
4. Write your content using the WYSIWYG editor
5. Upload media (images, videos, audio) - optional
6. Click **Publish Post** to make it live

### Managing Posts

- **View posts:** All posts are displayed on the home page
- **Delete posts:** When logged in, click the "Delete" button on any post

## Tech Stack

- **Framework:** Next.js 16
- **Language:** TypeScript
- **Database:** SQLite with Prisma ORM
- **Styling:** Tailwind CSS v4
- **Editor:** TipTap (WYSIWYG)
- **Authentication:** Custom session-based auth with bcryptjs

## Project Structure

```
/app
  /api              # API routes
    /auth           # Authentication endpoints
    /posts          # Post CRUD endpoints
  /components       # React components
    RichTextEditor.tsx
    PostCard.tsx
  /lib              # Utility functions
    auth.ts         # Auth helpers
    prisma.ts       # Database client
    seed.ts         # Database seeding
  /admin            # Protected admin page
  /login            # Login page
  page.tsx          # Home page
/prisma
  schema.prisma     # Database schema
  /migrations       # Database migrations
/scripts
  seed.ts           # Seed script
```

## API Endpoints

### Authentication
- `POST /api/auth/login` - Login (rate limited: 5 attempts per 15 minutes)
- `POST /api/auth/logout` - Logout
- `GET /api/auth/check` - Check authentication status

### Posts
- `GET /api/posts` - Get all posts
- `POST /api/posts` - Create a new post (protected)
- `DELETE /api/posts/[id]` - Delete a post (protected)

### Media
- `POST /api/upload` - Upload media file (protected, rate limited: 20 uploads per 10 minutes)

## Security

- ✅ Passwords hashed with bcryptjs (10 rounds)
- ✅ HTTP-only cookies for session management
- ✅ Rate limiting on login (5 attempts per 15 min) and uploads (20 per 10 min)
- ✅ Security headers (HSTS, XSS protection, frame options, etc.)
- ✅ File upload validation (type and size checks)
- ✅ Protected API routes with authentication checks
- ✅ CSRF protection via Next.js

## Production Deployment

**See [DEPLOYMENT.md](./DEPLOYMENT.md) for detailed production deployment instructions.**

Quick start for production:

1. **Update environment variables:**
   - Change `ADMIN_EMAIL` and `ADMIN_PASSWORD`
   - Update `DATABASE_URL` for production database

2. **Build the application:**
   ```bash
   npm run build
   ```

3. **Deploy to Vercel (easiest):**
   ```bash
   npm i -g vercel
   vercel --prod
   ```

4. **Or deploy to any platform:**
   - Railway, DigitalOcean, AWS, etc.
   - See DEPLOYMENT.md for platform-specific guides

**Important Production Notes:**
- Consider using PostgreSQL instead of SQLite for better scalability
- Use cloud storage (S3, Cloudflare R2) for media files on serverless platforms
- Set up regular backups with `npm run db:backup`
- Monitor logs and set up error tracking (Sentry recommended)

## Maintenance

**Backup database and uploads:**
```bash
npm run db:backup
```

**Update dependencies:**
```bash
npm update
npm audit fix
```

**View database in GUI:**
```bash
npm run db:studio
```

## License

MIT
