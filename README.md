# C-Suite Website

A premium financial advisory website with a dynamic content management system. Built with a modern glassmorphism design and a streamlined backend for managing blogs, services, and circulars.

## 🚀 Quick Start

### 1. Run Everything (Windows)
Double-click the `start.bat` file in the root directory. This will:
- Start the Node.js backend server.
- Open the Home Page (`index.html`).
- Open the Admin Portal (`admin.html`).

### 2. Manual Start
**Backend:**
```powershell
cd backend
npm start
```

**Frontend:**
Open `index.html` in your browser.

---

## 📝 Content Management

Manage your website content effortlessly directly from the home page:

1. Scroll to the footer or click the **Admin Portal** link.
2. Use the tabs within the **Admin Portal** section to navigate between **Blogs**, **Circulars**, and **Services**.
3. Fill out the forms to add new content or delete existing items.
4. The website updates in real-time as you submit!

---

## 🛠️ Features

- **Dynamic Sections**: Homepage automatically updates with the latest blogs and circulars.
- **Simplified Backend**: Content management via a direct API (no login required for local use).
- **Basic Analytics**: Tracks page views and popular content automatically.
- **Enterprise-Ready**: 
  - **Pagination**: Efficiently handles large lists of blogs.
  - **Search**: Built-in search functionality for all content.
  - **Backups**: Built-in database backup utility.

---

## 📁 System Utilities

### Database Backups
Located in the `backend/` folder:
- **Create Backup**: `npm run backup`
- **List Backups**: `npm run backup:list`
- **Restore**: `npm run backup:restore <filename>`

### Project Structure
- `index.html`: Main home page.
- `admin.html`: Content management dashboard.
- `india.html`, `uae.html`, `usa.html`: Country-specific service pages.
- `backend/`: Node.js/Express server and SQLite/PostgreSQL database.

---

## 🔐 Security & Deployment

- **CORS Protection**: Configured to allow local and production origins.
- **Sanitization**: Blog content is automatically sanitized to prevent XSS.
- **SEO Ready**: Semantic HTML and automated meta-tag management.

For production deployment (Railway, VPS, etc.), please refer to `DEPLOYMENT_GUIDE.md`.
