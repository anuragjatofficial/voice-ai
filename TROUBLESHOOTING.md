# 🔧 VeltrisX.ai Voice Assistant Troubleshooting Guide

## Table of Contents
- [Installation Issues](#installation-issues)
- [Database Connection Issues](#database-connection-issues)
- [API and Backend Issues](#api-and-backend-issues)
- [UI and Frontend Issues](#ui-and-frontend-issues)
- [Voice Call Issues](#voice-call-issues)
- [Authentication Issues](#authentication-issues)
- [Performance Issues](#performance-issues)

## Installation Issues

### `npm install` Fails
```
Problem: Error during dependency installation
```
**Solutions:**
1. Clear npm cache:
   ```bash
   npm cache clean --force
   rm -rf node_modules
   npm install
   ```
2. Check Node.js version:
   ```bash
   node -v   # Should be 18.x or higher
   ```
3. Delete package-lock.json and try again:
   ```bash
   rm package-lock.json
   npm install
   ```

### Environment Setup Issues
```
Problem: Application fails to start due to missing environment variables
```
**Solutions:**
1. Check if `.env.local` exists
2. Verify required variables are set:
   - MONGODB_URI
   - VAPI_API_KEY
   - NEXT_PUBLIC_API_URL

## Database Connection Issues

### MongoDB Connection Fails
```
Problem: Cannot connect to database
```
**Solutions:**
1. Test connection:
   ```bash
   curl http://localhost:3000/api/db-test
   ```
2. Check MongoDB URI format:
   - Local: `mongodb://localhost:27017/voice-ai`
   - Atlas: `mongodb+srv://<username>:<password>@<cluster>.mongodb.net/voice-ai`
3. Verify IP whitelist in MongoDB Atlas
4. Check database user permissions

### Data Not Loading
```
Problem: Pages show no data or loading indefinitely
```
**Solutions:**
1. Check MongoDB connection status
2. Verify database name in connection string
3. Check for any seeding errors:
   ```bash
   curl -X POST http://localhost:3000/api/patients/seed
   ```

## API and Backend Issues

### API Endpoints Return 404
```
Problem: API endpoints not found
```
**Solutions:**
1. Verify route files exist:
   - Check `/src/app/api/` directory
   - Ensure file naming follows Next.js conventions
2. Clear Next.js cache:
   ```bash
   rm -rf .next
   npm run dev
   ```

### API Returns 500 Errors
```
Problem: Internal server errors
```
**Solutions:**
1. Check server logs in terminal
2. Verify request payload format
3. Check MongoDB connection
4. Validate environment variables

## UI and Frontend Issues

### Pages Not Loading
```
Problem: Blank or error pages
```
**Solutions:**
1. Clear browser cache
2. Check console for JavaScript errors
3. Verify route files exist in `/src/app/` directory
4. Check for build errors:
   ```bash
   npm run build
   ```

### Style Issues
```
Problem: UI looks broken or unstyled
```
**Solutions:**
1. Verify Tailwind CSS is working:
   - Check `globals.css` imports
   - Verify PostCSS configuration
2. Clear browser cache
3. Rebuild the application:
   ```bash
   npm run build
   npm start
   ```

## Voice Call Issues

### VAPI Integration Fails
```
Problem: Cannot make or receive calls
```
**Solutions:**
1. Verify VAPI credentials:
   - Check VAPI_API_KEY
   - Verify VAPI_ASSISTANT_ID
   - Check VAPI_PHONE_NUMBER_ID
2. Test webhook endpoint:
   ```bash
   curl http://your-domain.com/api/vapi/webhook?action=health
   ```
3. Check webhook logs:
   ```bash
   GET /api/vapi/webhook?action=logs
   ```

### Call Transcripts Missing
```
Problem: Call records show no transcripts
```
**Solutions:**
1. Verify VAPI webhook configuration
2. Check call status in database
3. Manually sync call data:
   ```bash
   POST /api/calls/sync
   ```

## Authentication Issues

### Login Failures
```
Problem: Cannot log in to the application
```
**Solutions:**
1. Clear browser cookies
2. Check browser console for errors
3. Verify correct credentials
4. Reset browser cache and storage

### Session Expiry
```
Problem: Frequent logouts or session issues
```
**Solutions:**
1. Check session configuration
2. Clear browser cookies
3. Verify server time synchronization

## Performance Issues

### Slow Page Loads
```
Problem: Pages take long to load
```
**Solutions:**
1. Check Network tab in browser DevTools
2. Verify MongoDB indexes
3. Monitor server resources
4. Check for memory leaks:
   ```bash
   # Check Node.js memory usage
   process.memoryUsage()
   ```

### API Response Delays
```
Problem: API calls are slow
```
**Solutions:**
1. Check MongoDB query performance
2. Verify indexes exist for frequently queried fields
3. Monitor API response times
4. Check server resources

## Common Error Messages and Solutions

### "Cannot find module 'xyz'"
```
Solution: Reinstall dependencies
```
```bash
rm -rf node_modules
npm install
```

### "MongoDB Connection Failed"
```
Solution: Check connection string and network
```
1. Verify MongoDB is running
2. Check connection string
3. Verify network connectivity
4. Check MongoDB Atlas status

### "API Route Not Found"
```
Solution: Check route implementation
```
1. Verify file exists in correct location
2. Check file naming convention
3. Verify route handler implementation

### "VAPI Authentication Failed"
```
Solution: Verify VAPI credentials
```
1. Check VAPI_API_KEY
2. Verify webhook configuration
3. Test VAPI connectivity

## Best Practices for Prevention

1. **Regular Maintenance:**
   - Keep dependencies updated
   - Monitor error logs
   - Regular database backups

2. **Development Workflow:**
   - Use TypeScript strictly
   - Write comprehensive tests
   - Follow code review process

3. **Monitoring:**
   - Set up error tracking
   - Monitor API performance
   - Track database metrics

4. **Documentation:**
   - Keep API docs updated
   - Document common issues
   - Maintain troubleshooting guides

## Getting Additional Help

If you're still experiencing issues:
1. Check the GitHub repository issues
2. Review the documentation
3. Contact support team
4. Open a new issue with:
   - Detailed description
   - Steps to reproduce
   - Error messages
   - Environment details

---

⚠️ Note: This troubleshooting guide is continually updated. If you encounter an issue not listed here, please report it to help improve the guide.