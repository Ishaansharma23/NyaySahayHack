# 🚀 Deployment Guide for NyaySahay

## Quick Overview
- **Frontend**: Vercel (React + Vite)
- **Backend**: Render (Node.js + Express)

---

## 📋 Pre-Deployment Checklist

### 1. Prepare Your Repositories
```bash
# Initialize git if not already done
git init
git add .
git commit -m "Initial commit"

# Push to GitHub
git remote add origin https://github.com/YOUR_USERNAME/nyaaysahay.git
git push -u origin main
```

### 2. Collect All Environment Variables
Make sure you have all these values ready:

#### Backend Environment Variables
- MongoDB URI
- JWT Secret
- Stream API Key & Secret
- ImageKit credentials
- Razorpay API Keys
- Email service credentials (Nodemailer)
- Pinecone API Key
- Gemini/Claude API Keys

#### Frontend Environment Variables
- Backend API URL (will be your Render URL)

---

## 🖥️ Backend Deployment (Render)

### Step 1: Create Render Account
1. Go to [render.com](https://render.com)
2. Sign up using GitHub

### Step 2: Create New Web Service
1. Click **"New +"** → **"Web Service"**
2. Connect your GitHub repository
3. Select your backend directory: `NyaySahayHack/backend`

### Step 3: Configure Service
```
Name: nyaaysahay-backend
Region: Choose nearest to your users
Branch: main
Root Directory: backend (or NyaySahayHack/backend)
Environment: Node
Build Command: npm install
Start Command: npm start
```

### Step 4: Add Environment Variables
In Render dashboard, go to **Environment** tab and add all variables:
```env
NODE_ENV=production
PORT=3000
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_key

# Stream
STREAM_API_KEY=your_stream_key
STREAM_API_SECRET=your_stream_secret

# ImageKit
IMAGEKIT_PUBLIC_KEY=your_imagekit_public_key
IMAGEKIT_PRIVATE_KEY=your_imagekit_private_key
IMAGEKIT_URL_ENDPOINT=your_imagekit_url

# Razorpay
RAZORPAY_KEY_ID=your_razorpay_key
RAZORPAY_KEY_SECRET=your_razorpay_secret

# Email (Nodemailer)
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_app_password

# Pinecone
PINECONE_API_KEY=your_pinecone_key

# AI
GEMINI_API_KEY=your_gemini_key
ANTHROPIC_API_KEY=your_claude_key

# CORS Origin (will be your Vercel URL)
FRONTEND_URL=https://your-app.vercel.app

# Optional
LOG_HTTP=false
```

### Step 5: Deploy
1. Click **"Create Web Service"**
2. Wait for deployment (3-5 minutes)
3. Copy your backend URL: `https://nyaaysahay-backend.onrender.com`

**Important Notes:**
- Render free tier: Service sleeps after 15 mins of inactivity
- First request after sleep takes ~1 minute to wake up
- Consider upgrading to paid plan ($7/month) for always-on service

---

## 🌐 Frontend Deployment (Vercel)

### Step 1: Update API Base URL
1. Edit `frontend/.env.production`
2. Replace with your actual Render URL:
```env
VITE_API_BASE_URL=https://nyaaysahay-backend.onrender.com/api
```

### Step 2: Create Vercel Account
1. Go to [vercel.com](https://vercel.com)
2. Sign up using GitHub

### Step 3: Import Project
1. Click **"Add New..."** → **"Project"**
2. Import your GitHub repository
3. Select the repository

### Step 4: Configure Build Settings
```
Framework Preset: Vite
Root Directory: frontend (or NyaySahayHack/frontend)
Build Command: npm run build
Output Directory: dist
Install Command: npm install
```

### Step 5: Add Environment Variables
In Vercel project settings → **Environment Variables**:
```env
VITE_API_BASE_URL=https://nyaaysahay-backend.onrender.com/api
```

### Step 6: Deploy
1. Click **"Deploy"**
2. Wait 1-2 minutes
3. Your app will be live at: `https://your-app.vercel.app`

### Step 7: Update Backend CORS
1. Go back to Render dashboard
2. Update `FRONTEND_URL` environment variable with your Vercel URL
3. Manually restart the backend service

---

## ✅ Post-Deployment Verification

### Test Backend
```bash
# Check health endpoint
curl https://nyaaysahay-backend.onrender.com/api/health

# Or visit in browser
https://nyaaysahay-backend.onrender.com/api/health
```

### Test Frontend
1. Open your Vercel URL
2. Try to sign up/login
3. Check browser console for any CORS errors
4. Test all features: Chat, Video Call, AI Assistant, Payments

### Common Issues & Fixes

#### ❌ CORS Error
**Problem**: "Access to XMLHttpRequest blocked by CORS policy"
**Solution**: 
- Verify `FRONTEND_URL` in Render matches your Vercel domain
- Check backend `cors` configuration in `src/app.js`
- Restart backend service after changes

#### ❌ Backend Not Responding
**Problem**: Request timeout or 502 errors
**Solution**:
- Render free tier: Wait 1 minute for service to wake up
- Check Render logs for errors
- Verify MongoDB connection string is correct

#### ❌ Environment Variables Not Working
**Problem**: Features not working (payments, chat, etc.)
**Solution**:
- Double-check all env variables in Render dashboard
- Ensure no extra spaces in values
- Redeploy after adding/changing variables

#### ❌ Build Fails on Vercel
**Problem**: "Command 'npm run build' exited with 1"
**Solution**:
- Check for ESLint errors locally: `npm run lint`
- Fix all warnings/errors
- Commit and push fixes

---

## 🔄 Continuous Deployment

Both Vercel and Render support automatic deployments:

### Auto-Deploy Setup
1. **Vercel**: Automatically deploys on every push to `main` branch
2. **Render**: Automatically deploys on every push to `main` branch

### Manual Deploy
- **Vercel**: Dashboard → Deployments → "Redeploy"
- **Render**: Dashboard → Manual Deploy → "Deploy latest commit"

---

## 📊 Monitoring & Logs

### Vercel
- Dashboard → Your Project → Logs
- Real-time function logs
- Build logs

### Render
- Dashboard → Your Service → Logs
- Real-time application logs
- Use for debugging backend issues

---

## 💰 Cost Breakdown

### Free Tier Limits
- **Vercel**: 
  - 100 GB bandwidth/month
  - Unlimited sites
  - Automatic HTTPS
  
- **Render**:
  - 750 hours/month (1 service)
  - Service sleeps after 15 min inactivity
  - 512 MB RAM

### Upgrade Recommendations
- **Production Use**: Render Starter ($7/month) for always-on backend
- **High Traffic**: Vercel Pro ($20/month) + Render Standard ($25/month)

---

## 🎯 Custom Domain (Optional)

### Add Custom Domain to Vercel
1. Go to Project Settings → Domains
2. Add your domain: `nyaaysahay.com`
3. Update DNS records as instructed
4. SSL certificate auto-provisioned

### Update Backend CORS
After adding custom domain, update Render's `FRONTEND_URL`:
```env
FRONTEND_URL=https://nyaaysahay.com
```

---

## 📞 Support

### Deployment Issues
- **Vercel**: [vercel.com/support](https://vercel.com/support)
- **Render**: [render.com/docs](https://render.com/docs)

### Project Issues
- Check [README.md](./README.md) troubleshooting section
- Review application logs
- Test locally first: `npm run dev`

---

**🎉 Congratulations! Your NyaySahay platform is now live!**

Share your deployment URLs:
- Frontend: `https://your-app.vercel.app`
- Backend: `https://nyaaysahay-backend.onrender.com`
