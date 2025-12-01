# Production Deployment Guide

This guide covers deploying your micro blog to production.

## Pre-Deployment Checklist

### 1. Environment Variables

Create production environment variables (don't commit these):

```bash
DATABASE_URL="your-production-database-url"
ADMIN_EMAIL="your-admin@email.com"
ADMIN_PASSWORD="strong-secure-password"
NODE_ENV="production"
```

**Important Security Notes:**
- Change the default admin credentials!
- Use a strong password (16+ characters, mix of letters, numbers, symbols)
- Keep your `.env` file secure and never commit it to git

### 2. Database Considerations

#### SQLite (Current Setup - Good for Small Sites)
- Simple, no external database needed
- Works well for low-traffic personal blogs
- File is stored locally, ensure it persists between deployments

#### PostgreSQL (Recommended for Production)
If you expect higher traffic or need better reliability:

1. Update `prisma/schema.prisma`:
```prisma
datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}
```

2. Update your `DATABASE_URL`:
```
postgresql://user:password@host:5432/dbname
```

3. Run migrations:
```bash
npx prisma migrate deploy
```

### 3. File Storage for Media

**Current Setup:** Files stored in `/public/uploads/`
- Works for single-server deployments
- Files may be lost on serverless platforms that don't persist filesystem

**Production Recommendations:**
Consider using cloud storage for media:
- **Vercel Blob Storage** (if deploying to Vercel)
- **AWS S3**
- **Cloudflare R2**
- **DigitalOcean Spaces**

## Deployment Platforms

### Option 1: Vercel (Recommended - Easiest)

1. **Install Vercel CLI:**
```bash
npm i -g vercel
```

2. **Login to Vercel:**
```bash
vercel login
```

3. **Deploy:**
```bash
vercel --prod
```

4. **Set Environment Variables:**
Go to your Vercel dashboard → Settings → Environment Variables

Add:
- `DATABASE_URL`
- `ADMIN_EMAIL`
- `ADMIN_PASSWORD`

**Important for SQLite on Vercel:**
- Vercel is serverless, so SQLite file will be ephemeral
- Consider using Vercel Postgres instead
- Or use a hosted database like Supabase, Railway, or PlanetScale

### Option 2: Railway

1. **Create account at [railway.app](https://railway.app)**

2. **Install Railway CLI:**
```bash
npm i -g @railway/cli
```

3. **Login and deploy:**
```bash
railway login
railway init
railway up
```

4. **Add environment variables in Railway dashboard**

5. **Optional: Add PostgreSQL:**
```bash
railway add postgresql
```
Railway will automatically set `DATABASE_URL`

### Option 3: DigitalOcean App Platform

1. Connect your GitHub repository
2. Configure build settings:
   - Build Command: `npm run build`
   - Run Command: `npm start`
3. Add environment variables
4. Deploy!

### Option 4: VPS (Hetzner, DigitalOcean, etc.)

1. **Provision a VPS with Ubuntu 22.04+**

2. **Install Node.js:**
```bash
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt-get install -y nodejs
```

3. **Install PM2 (Process Manager):**
```bash
sudo npm install -g pm2
```

4. **Clone and setup:**
```bash
git clone your-repo
cd garauxo
npm install
```

5. **Set environment variables:**
```bash
# Create .env file with production values
nano .env
```

6. **Build and run:**
```bash
npm run build
pm2 start npm --name "garauxo" -- start
pm2 startup
pm2 save
```

7. **Setup Nginx as reverse proxy:**
```bash
sudo apt install nginx
sudo nano /etc/nginx/sites-available/garauxo
```

Add:
```nginx
server {
    listen 80;
    server_name yourdomain.com;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

Enable site:
```bash
sudo ln -s /etc/nginx/sites-available/garauxo /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx
```

8. **Setup SSL with Let's Encrypt:**
```bash
sudo apt install certbot python3-certbot-nginx
sudo certbot --nginx -d yourdomain.com
```

## Post-Deployment

### 1. Test Everything
- Login functionality
- Post creation with media
- Post deletion
- Media uploads (images, videos, audio)

### 2. Setup Monitoring
Consider adding:
- Uptime monitoring (UptimeRobot, Better Uptime)
- Error tracking (Sentry)
- Analytics (Plausible, Simple Analytics)

### 3. Backup Strategy
For SQLite:
```bash
# Backup database
cp prisma/dev.db backups/backup-$(date +%Y%m%d).db

# Backup uploads
tar -czf backups/uploads-$(date +%Y%m%d).tar.gz public/uploads/
```

For PostgreSQL:
```bash
pg_dump $DATABASE_URL > backup.sql
```

### 4. Create Initial Admin User
```bash
npx tsx scripts/seed.ts
```

## Troubleshooting

### Database Connection Issues
- Verify `DATABASE_URL` is correctly set
- For SQLite, ensure the file path is writable
- For PostgreSQL, check connection string format

### File Upload Issues
- Check `/public/uploads/` directory permissions
- Verify max file size limits
- Check server disk space

### Build Failures
- Clear `.next` directory: `rm -rf .next`
- Clear node_modules: `rm -rf node_modules && npm install`
- Check Node.js version: `node --version` (needs 20.9.0+)

## Performance Optimization

### Enable Caching
Add to `next.config.ts`:
```typescript
images: {
  minimumCacheTTL: 60,
}
```

### Database Indexing
Already optimized in schema with `@unique` on email

### CDN for Static Assets
Use Cloudflare or similar CDN in front of your deployment

## Security Best Practices

✅ Already Implemented:
- Security headers (HSTS, XSS protection, etc.)
- Password hashing with bcryptjs
- HTTP-only cookies for sessions
- File type validation for uploads
- Protected API routes

🔒 Additional Recommendations:
- Enable 2FA for deployment platform
- Regular dependency updates: `npm audit fix`
- Monitor for security advisories
- Use strong admin password (16+ chars)
- Consider adding rate limiting for login attempts
- Regular database backups

## Maintenance

### Update Dependencies
```bash
npm update
npm audit fix
```

### Database Migrations
When schema changes:
```bash
npx prisma migrate deploy
```

### Monitor Logs
- Check application logs regularly
- Set up error alerts
- Monitor disk space for uploads

## Support

For issues or questions:
- Check Next.js docs: https://nextjs.org/docs
- Prisma docs: https://www.prisma.io/docs
- GitHub Issues: [your-repo-url]

---

**Ready to deploy? Start with Vercel for the easiest experience!**

