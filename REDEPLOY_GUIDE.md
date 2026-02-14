# 🚀 Deployment Guide: Render (Backend) & Vercel (Frontend)

This guide will help you fix the Render deployment and host your website frontend on Vercel.

## 🛠️ Part 1: Fixing Render (Backend)

The "Failed" status on Render is likely because the environment variables are missing or incorrect.

### Step 1: Get your Supabase Connection String
1. Go to [Supabase Dashboard](https://database.new).
2. Go to **Project Settings** > **Database**.
3. Under **Connection string**, select **URI**.
4. It should look like this: `postgresql://postgres:[YOUR-PASSWORD]@db.doccrivrvhilboodzcin.supabase.co:5432/postgres`
5. **CRITICAL**: If your password has special characters (like `!`), replace them with codes (e.g., `!` becomes `%21`).
   * Example: `Anushka_CSuite_2026!` -> `Anushka_CSuite_2026%21`

### Step 2: Configure Render
1. Go to your [Render Dashboard](https://dashboard.render.com).
2. Select your **c-suite-backend** service.
3. Click **Environment** in the left sidebar.
4. Add the following **Environment Variables**:
   * `DATABASE_URL`: (The URL from Step 1)
   * `JWT_SECRET`: `development-secret-key` (or any random string)
   * `NODE_ENV`: `production`
   * `ALLOWED_ORIGINS`: `*`
5. Click **Save Changes**.
6. Go to **Events** and click **Manual Deploy** > **Clear Build Cache & Deploy**.

---

## 🌐 Part 2: Hosting on Vercel (Frontend)

Vercel is much faster and better for hosting the website parts (HTML/CSS/JS).

### Step 1: Prepare the code
I have already created a `vercel.json` file in your folder. This tells Vercel how to serve your files.

### Step 2: Connect to GitHub
1. Go to [Vercel Dashboard](https://vercel.com/dashboard).
2. Click **Add New** > **Project**.
3. Select your GitHub repository: `AnushkaBhatnagar523/c-suite`.
4. **Project Configuration**:
   * **Framework Preset**: Other (it will auto-detect static files).
   * **Root Directory**: `./` (Keep as default).
   * **Build Command**: (Leave empty).
   * **Output Directory**: (Leave empty).
5. Click **Deploy**.

### Step 3: Link Frontend to Backend
Once your Render backend is live (e.g., `https://c-suite-backend.onrender.com`), you must make sure the frontend knows where it is.
1. Open `js/script.js` and `login.html`.
2. Check the `API_BASE` variable. I have set it to `https://c-suite-backend.onrender.com/api`.
3. **If your Render URL is different**, change it to your actual Render URL.
4. Git Push the changes:
   ```bash
   git add .
   git commit -m "Update API URL for Vercel"
   git push origin main
   ```
5. Vercel will automatically redeploy with the new link!

---

## ❓ Common Issues
* **CORS Error**: Ensure `ALLOWED_ORIGINS` on Render is set to `*` or your Vercel URL.
* **Blank Page**: Check the browser console (F12) for errors.
* **Login Fails**: Ensure the `DATABASE_URL` on Render is correct and the `admin` user exists.
