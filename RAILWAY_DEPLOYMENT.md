# Railway Deployment Guide

## Prerequisites
- GitHub account with your repo pushed
- MongoDB instance (Atlas or Railway)
- Railway account (railway.app)

## Step-by-Step Deployment

### 1. Prepare MongoDB
**Option A: MongoDB Atlas (Recommended for beginners)**
- Go to [mongodb.com/cloud/atlas](https://mongodb.com/cloud/atlas)
- Create free account
- Create a cluster (free tier)
- Create database user with password
- Get connection string: `mongodb+srv://username:password@cluster.mongodb.net/database`

**Option B: Railway MongoDB**
- Add MongoDB service in Railway dashboard
- Copy the `MONGO_URI` provided

### 2. Connect to Railway

1. Go to [railway.app](https://railway.app)
2. Sign up with GitHub
3. Create new project
4. Select "Deploy from GitHub repo"
5. Authorize and select your repository

### 3. Configure Environment Variables

In Railway dashboard, go to **Variables** and add:

```
MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/database
NODE_ENV=production
PORT=5000
```

### 4. Deploy

Railway should auto-detect `package.json` and:
- Run `npm install` automatically
- Execute `npm start` (runs `node server.js`)
- Expose the application

### 5. Verify Deployment

1. Get your Railway URL (railway.app shows it)
2. Test the health endpoint:
   ```
   https://your-app.up.railway.app/api/health
   ```
3. Test API endpoints
4. Check MongoDB connection in logs

## Troubleshooting

| Issue | Solution |
|-------|----------|
| **"MONGO_URI is not defined"** | Add `MONGO_URI` in Railway Variables |
| **Port already in use** | Railway assigns PORT automatically, use `process.env.PORT` |
| **Build fails** | Check `backend/package.json` exists and `npm start` works locally |
| **Can't connect to MongoDB** | Verify connection string, check IP whitelist in MongoDB Atlas |

## Useful Commands

- View logs: Railway dashboard → Logs tab
- Redeploy: Push to GitHub (auto-deploys on push)
- Stop app: Railway dashboard → Settings → Delete

## Post-Deployment

✅ Your app is live at: `https://your-app.up.railway.app`

### Next Steps:
1. Test all API endpoints with production data
2. Set up custom domain (optional)
3. Monitor performance in Railway dashboard
4. Set up error alerts
