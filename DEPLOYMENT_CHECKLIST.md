# Railway Deployment Checklist

## Before Deployment

### Code Preparation
- [ ] Push all code to GitHub
- [ ] Verify `.gitignore` includes `.env` files
- [ ] Verify `package.json` has all dependencies
- [ ] Test `npm start` runs successfully locally
- [ ] Confirm `/api/health` endpoint responds

### Database Setup
- [ ] MongoDB instance created (Atlas or Railway)
  - [ ] Database user created with password
  - [ ] Database selected/created
  - [ ] Connection string obtained
  - [ ] IP whitelist updated (Atlas: allow all for testing)

### Configuration
- [ ] Create `.env` file locally with test data
- [ ] Verify app connects to MongoDB locally
- [ ] Note all required environment variables

## During Deployment

### Railway Setup
- [ ] Sign in to railway.app with GitHub
- [ ] Create new project
- [ ] Select repository and authorize
- [ ] Add environment variables:
  - [ ] `MONGO_URI` - MongoDB connection string
  - [ ] `NODE_ENV` - set to `production`
  - [ ] `PORT` - Railway will assign (optional)

### Monitoring
- [ ] Watch build logs for errors
- [ ] Confirm deployment completes
- [ ] Note Railway URL (e.g., `app.up.railway.app`)

## After Deployment

### Testing
- [ ] [ ] Test health endpoint: `https://[your-app]/api/health`
- [ ] [ ] Test API endpoints (projects, tasks, users)
- [ ] [ ] Verify data persistence with test data
- [ ] [ ] Check logs for errors
- [ ] [ ] Test from different device/network

### Performance & Monitoring
- [ ] [ ] Enable Railway alerts/notifications
- [ ] [ ] Monitor response times
- [ ] [ ] Check MongoDB connection logs
- [ ] [ ] Set up error tracking (optional: Sentry)

### Documentation
- [ ] [ ] Document Railway URL
- [ ] [ ] Document MongoDB credentials (secure location)
- [ ] [ ] Update README with production URL
- [ ] [ ] Document environment variables used

## Troubleshooting Quick Links

**MongoDB Connection Fails:**
- Verify `MONGO_URI` in Railway Variables
- Check IP whitelist in MongoDB Atlas
- Confirm database exists

**App Won't Start:**
- Check build logs in Railway
- Verify `package.json` and `server.js` exist
- Test locally with `npm start`

**Port Issues:**
- Railway auto-assigns PORT
- Verify code uses `process.env.PORT`

## Rollback Plan
- [ ] Previous working version tagged in GitHub
- [ ] Know how to redeploy if needed
- [ ] Have database backup
