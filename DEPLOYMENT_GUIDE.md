# C-Suite Website - Deployment Guide

## 🚀 Phase 8: Deployment

This guide covers deploying your C-Suite website to production.

---

## 📋 Pre-Deployment Checklist

### Backend Preparation
- [ ] Update `.env` with production values
- [ ] Change JWT_SECRET to a strong random string
- [ ] Configure ALLOWED_ORIGINS for your production domain
- [ ] Test all API endpoints locally
- [ ] Create initial admin user
- [ ] Backup the SQLite database

### Frontend Preparation
- [ ] Update API_BASE URL in `js/script.js` to production backend URL
- [ ] Test all pages locally
- [ ] Optimize images (if needed)
- [ ] Remove any console.log statements
- [ ] Test admin panel functionality

---

## 🎯 Deployment Options

### Option 1: Railway (Recommended for Beginners)

**Backend Deployment:**

1. **Install Railway CLI** (optional):
   ```powershell
   npm install -g @railway/cli
   ```

2. **Prepare for Railway:**
   - Create a `railway.json` in the backend folder:
   ```json
   {
     "$schema": "https://railway.app/railway.schema.json",
     "build": {
       "builder": "NIXPACKS"
     },
     "deploy": {
       "startCommand": "node app.js",
       "restartPolicyType": "ON_FAILURE",
       "restartPolicyMaxRetries": 10
     }
   }
   ```

3. **Deploy via Railway Dashboard:**
   - Go to https://railway.app
   - Sign up/Login with GitHub
   - Click "New Project" → "Deploy from GitHub repo"
   - Select your repository
   - Set root directory to `backend`
   - Add environment variables in Railway dashboard:
     - `PORT` (Railway auto-assigns, but you can use 5000)
     - `JWT_SECRET` (generate a strong secret)
     - `NODE_ENV=production`
     - `ALLOWED_ORIGINS=https://your-frontend-domain.vercel.app`

4. **Get your backend URL:**
   - Railway will provide a URL like: `https://your-app.railway.app`

**Frontend Deployment (Vercel):**

1. **Prepare frontend:**
   - Update `js/script.js`:
   ```javascript
   const API_BASE = 'https://your-app.railway.app/api';
   ```

2. **Deploy to Vercel:**
   - Go to https://vercel.com
   - Import your GitHub repository
   - Set root directory to `/` (project root)
   - Deploy!

---

### Option 2: Render

**Backend on Render:**

1. Go to https://render.com
2. Create a new "Web Service"
3. Connect your GitHub repository
4. Configure:
   - **Root Directory**: `backend`
   - **Build Command**: `npm install`
   - **Start Command**: `node app.js`
   - **Environment**: Node
5. Add environment variables (same as Railway)
6. Deploy!

**Frontend on Render (Static Site):**

1. Create a new "Static Site"
2. Connect repository
3. Set build command: (leave empty for static HTML)
4. Set publish directory: `/`
5. Deploy!

---

### Option 3: VPS (DigitalOcean, Linode, AWS EC2)

**For Advanced Users:**

1. **Setup VPS:**
   ```bash
   # SSH into your VPS
   ssh root@your-vps-ip

   # Update system
   apt update && apt upgrade -y

   # Install Node.js
   curl -fsSL https://deb.nodesource.com/setup_18.x | bash -
   apt install -y nodejs

   # Install PM2 (process manager)
   npm install -g pm2

   # Install Nginx (reverse proxy)
   apt install -y nginx
   ```

2. **Deploy Backend:**
   ```bash
   # Clone your repository
   git clone https://github.com/your-username/csuite-website.git
   cd csuite-website/backend

   # Install dependencies
   npm install

   # Create .env file
   nano .env
   # (Add your production environment variables)

   # Start with PM2
   pm2 start app.js --name csuite-backend
   pm2 save
   pm2 startup
   ```

3. **Configure Nginx:**
   ```bash
   nano /etc/nginx/sites-available/csuite
   ```

   Add:
   ```nginx
   server {
       listen 80;
       server_name api.your-domain.com;

       location / {
           proxy_pass http://localhost:5000;
           proxy_http_version 1.1;
           proxy_set_header Upgrade $http_upgrade;
           proxy_set_header Connection 'upgrade';
           proxy_set_header Host $host;
           proxy_cache_bypass $http_upgrade;
       }
   }
   ```

   Enable and restart:
   ```bash
   ln -s /etc/nginx/sites-available/csuite /etc/nginx/sites-enabled/
   nginx -t
   systemctl restart nginx
   ```

4. **Setup SSL with Let's Encrypt:**
   ```bash
   apt install -y certbot python3-certbot-nginx
   certbot --nginx -d api.your-domain.com
   ```

5. **Deploy Frontend:**
   - Use Nginx to serve static files
   - Or use Vercel/Netlify for frontend

---

## 🗄️ Database Management

### SQLite in Production

**Option 1: Keep SQLite (Good for small-medium traffic)**
- Backup regularly using cron jobs
- Store database in persistent volume (Railway/Render provide this)

**Backup Script:**
```bash
#!/bin/bash
DATE=$(date +%Y%m%d_%H%M%S)
cp /path/to/backend/database/csuite.db /path/to/backups/csuite_$DATE.db
# Keep only last 7 days
find /path/to/backups -name "csuite_*.db" -mtime +7 -delete
```

**Option 2: Migrate to PostgreSQL (For scaling)**
- Use Railway's PostgreSQL addon
- Or use Supabase (free tier available)
- Requires code changes to use PostgreSQL instead of SQLite

---

## 🔐 Security Best Practices

1. **Environment Variables:**
   - Never commit `.env` to Git
   - Use strong JWT secrets (32+ characters)
   - Rotate secrets periodically

2. **CORS:**
   - Only allow your production domain
   - Remove wildcard (*) origins

3. **Rate Limiting:**
   Add to `backend/app.js`:
   ```javascript
   const rateLimit = require('express-rate-limit');
   
   const limiter = rateLimit({
       windowMs: 15 * 60 * 1000, // 15 minutes
       max: 100 // limit each IP to 100 requests per windowMs
   });
   
   app.use('/api/', limiter);
   ```

4. **HTTPS:**
   - Always use HTTPS in production
   - Railway/Render provide this automatically
   - For VPS, use Let's Encrypt

---

## 📊 Monitoring & Maintenance

### Health Checks
Your backend has a `/health` endpoint. Set up monitoring:
- **UptimeRobot** (free): https://uptimerobot.com
- **Pingdom** (paid): https://www.pingdom.com

### Logs
- **Railway/Render**: View logs in dashboard
- **VPS**: Use PM2 logs: `pm2 logs csuite-backend`

### Database Backups
- Schedule daily backups
- Test restore process monthly
- Store backups in separate location (AWS S3, Google Cloud Storage)

---

## 🎉 Post-Deployment

1. **Create Admin User:**
   ```powershell
   Invoke-WebRequest -Uri "https://your-backend-url.com/api/admin/register" `
     -Method POST `
     -Headers @{"Content-Type"="application/json"} `
     -Body '{"username":"admin","password":"SecurePassword123!"}'
   ```

2. **Test Everything:**
   - [ ] Homepage loads
   - [ ] Services pages work
   - [ ] Blog section displays
   - [ ] Admin login works
   - [ ] Can create/edit content via admin panel

3. **Update DNS:**
   - Point your domain to the deployed frontend
   - Point api.yourdomain.com to backend (if using VPS)

---

## 🚨 Troubleshooting

### Backend won't start
- Check environment variables
- Verify Node.js version (18+)
- Check logs for errors

### CORS errors
- Verify ALLOWED_ORIGINS includes your frontend URL
- Check if protocol (http/https) matches

### Database errors
- Ensure database file has write permissions
- Check if persistent storage is configured

### 404 on API calls
- Verify API_BASE URL in frontend
- Check if backend is running
- Test endpoints with curl/Postman

---

## 📞 Support Resources

- **Railway Docs**: https://docs.railway.app
- **Render Docs**: https://render.com/docs
- **Vercel Docs**: https://vercel.com/docs
- **Express.js**: https://expressjs.com
- **SQLite**: https://www.sqlite.org/docs.html

---

## ✅ Deployment Checklist

**Before Going Live:**
- [ ] Backend deployed and accessible
- [ ] Frontend deployed and accessible
- [ ] Environment variables configured
- [ ] CORS properly configured
- [ ] Admin user created
- [ ] SSL/HTTPS enabled
- [ ] Database backed up
- [ ] Monitoring set up
- [ ] DNS configured
- [ ] All pages tested in production

**Congratulations! Your C-Suite website is now live! 🎉**
