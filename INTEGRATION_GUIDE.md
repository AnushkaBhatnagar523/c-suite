# C-Suite Website - Backend & Frontend Integration Guide

## 🎉 Successfully Connected!

Your C-Suite website now has a fully functional backend connected to the frontend.

## 🚀 What's Been Set Up

### Backend (Node.js + Express + SQLite)
- **Location**: `backend/` directory
- **Database**: SQLite database at `backend/database/csuite.db`
- **Port**: Running on `http://localhost:5000`
- **API Endpoints**:
  - `GET /health` - Health check
  - `GET /api/services` - Get all services
  - `GET /api/services/:slug` - Get service by slug
  - `GET /api/blogs` - Get all blogs
  - `GET /api/blogs/slug/:slug` - Get blog by slug
  - `GET /api/circulars` - Get all circulars
  - Admin endpoints (protected with JWT authentication)

### Frontend
- **Static HTML files** in the root directory
- **Dynamic service pages** using `service.html?slug=<service-slug>`
- **Dynamic blog pages** using `blog.html?slug=<blog-slug>`

### Services Migrated to Database
The following services are now in the database and accessible via the API:
1. **Audit & Assurance** (`/api/services/audit`)
2. **Compliance & Registrations** (`/api/services/compliance`)
3. **Income Tax Services** (`/api/services/income-tax`)
4. **GST Services** (`/api/services/gst`)
5. **Labour Law Compliance** (`/api/services/labour-law`)

## 📝 How to Use

### Starting the Backend Server
```powershell
cd backend
npm start
```
The server will start on port 5000.

### Accessing the Website
1. Make sure the backend is running
2. Open `index.html` in your browser (or use a local server like Live Server)
3. The frontend will automatically fetch data from the backend

### Admin Panel
Access the admin panel at:
- `admin-login.html` - Login page
- `admin-dashboard.html` - Dashboard
- `admin-blogs.html` - Manage blogs
- `admin-circulars.html` - Manage circulars
- `admin-services.html` - Manage services

**Default Admin Credentials**: You'll need to create an admin user first using the backend API.

## 🔧 Next Steps

### 1. Create an Admin User
You can create an admin user by making a POST request to `/api/admin/register`:
```powershell
Invoke-WebRequest -Uri "http://localhost:5000/api/admin/register" `
  -Method POST `
  -Headers @{"Content-Type"="application/json"} `
  -Body '{"username":"admin","password":"your-secure-password"}'
```

### 2. Add Content via Admin Panel
1. Login to the admin panel
2. Add blogs, circulars, and manage services
3. Content will automatically appear on the frontend

### 3. Deploy to Production
When ready to deploy:
- **Backend**: Deploy to a Node.js hosting service (Heroku, Railway, Render, etc.)
- **Frontend**: Deploy to Vercel, Netlify, or any static hosting
- Update the `API_BASE` URL in `js/script.js` to point to your production backend

## 🗂️ File Structure
```
csuite website/
├── backend/
│   ├── app.js              # Main server file
│   ├── database/
│   │   ├── db.js           # Database connection
│   │   └── csuite.db       # SQLite database
│   ├── controllers/        # API logic
│   ├── routes/             # API routes
│   ├── middlewares/        # Auth middleware
│   └── migrate_services.js # Service migration script
├── css/
│   ├── style.css           # Main styles
│   └── admin.css           # Admin panel styles
├── js/
│   └── script.js           # Frontend JavaScript
├── images/                 # Image assets
├── index.html              # Homepage
├── india.html              # India services
├── uae.html                # UAE services
├── usa.html                # USA services
├── service.html            # Dynamic service template
├── blog.html               # Dynamic blog template
└── admin-*.html            # Admin panel pages
```

## 🎨 Features

### Dynamic Content Management
- ✅ Services are now database-driven
- ✅ Blogs can be added/edited via admin panel
- ✅ Circulars can be managed dynamically
- ✅ No need to edit HTML files for content updates

### Static Service Pages (Optional)
The following static service pages still exist and can be used or removed:
- `service-audit.html`
- `service-compliance.html`
- `service-gst.html`
- `service-income-tax.html`
- `service-labour-law.html`

**Recommendation**: These can be deleted since the dynamic `service.html` now handles all services.

## 🔐 Security Notes
- Change default admin credentials immediately
- Use environment variables for sensitive data (JWT secret, etc.)
- Enable CORS only for your production domain
- Use HTTPS in production

## 📞 Support
For any issues or questions, refer to the backend logs or check the browser console for frontend errors.

---
**Status**: ✅ Backend and Frontend Successfully Connected!
