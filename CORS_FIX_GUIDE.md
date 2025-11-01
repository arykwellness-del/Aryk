# CORS Error Fix Guide

## The Problem

You're seeing this error:
```
Access to fetch at 'https://script.google.com/...' from origin 'http://localhost:8082' 
has been blocked by CORS policy: Response to preflight request doesn't pass access 
control check: No 'Access-Control-Allow-Origin' header is present on the requested resource.
```

## Why This Happens

Google Apps Script Web Apps handle CORS automatically, but **only when deployed correctly**. The issue is usually one of these:

1. ❌ Using the wrong URL (development URL instead of exec URL)
2. ❌ Deployment settings not set to "Anyone"
3. ❌ Script not properly deployed after changes

## Solution: Re-deploy Your Script

### Step 1: Open Your Google Sheet

1. Open the Google Sheet you created for thoughts
2. Click **Extensions** → **Apps Script**

### Step 2: Verify Your Code

Make sure your script matches the updated `google-apps-script.js` file. The code should look like this:

```javascript
function doGet(e) {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
  const data = sheet.getDataRange().getValues();
  
  const thoughts = data.slice(1).map(row => ({
    timestamp: row[0],
    name: row[1],
    message: row[2]
  })).reverse();
  
  const output = ContentService
    .createTextOutput(JSON.stringify({ success: true, data: thoughts }))
    .setMimeType(ContentService.MimeType.JSON);
  
  return output;
}

function doPost(e) {
  try {
    const sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
    const data = JSON.parse(e.postData.contents);
    
    sheet.appendRow([
      new Date().toISOString(),
      data.name || 'Anonymous',
      data.message
    ]);
    
    const output = ContentService
      .createTextOutput(JSON.stringify({ success: true, message: 'Thought saved successfully' }))
      .setMimeType(ContentService.MimeType.JSON);
    
    return output;
  } catch (error) {
    const output = ContentService
      .createTextOutput(JSON.stringify({ success: false, error: error.toString() }))
      .setMimeType(ContentService.MimeType.JSON);
    
    return output;
  }
}
```

### Step 3: Create a NEW Deployment

**IMPORTANT**: Don't try to update the existing deployment. Create a NEW one.

1. In Apps Script editor, click **Deploy** → **New deployment**
2. Click the gear icon (⚙️) next to "Select type"
3. Choose **Web app**
4. Configure:
   - **Description**: "Aryk Thoughts API v2" (or any new version)
   - **Execute as**: **Me** (your email)
   - **Who has access**: **Anyone** ⚠️ THIS IS CRITICAL
5. Click **Deploy**
6. If asked to authorize, complete the authorization flow
7. **Copy the NEW Web app URL**

### Step 4: Update Your .env File

1. Open `.env` in your project
2. Replace the old URL with the NEW one:
   ```
   VITE_GOOGLE_SHEETS_API_URL=https://script.google.com/macros/s/NEW_DEPLOYMENT_ID/exec
   ```
3. **IMPORTANT**: Make sure the URL ends with `/exec` (NOT `/dev`)
4. Save the file

### Step 5: Restart Your Dev Server

1. Stop the current server (Ctrl+C in terminal)
2. Run: `npm run dev`
3. Wait for server to start

### Step 6: Test Again

1. Open your browser to the Relaxing Corner page
2. Try submitting a thought
3. Check browser console - CORS error should be gone

## Verification Checklist

✅ Script code is correct (matches the template above)
✅ Created a NEW deployment (not updated existing)
✅ Deployment set to "Execute as: Me"
✅ Deployment set to "Who has access: Anyone"
✅ Copied the correct URL (ends with `/exec`)
✅ Updated `.env` with new URL
✅ Restarted dev server
✅ Cleared browser cache (Ctrl+Shift+Delete)

## Still Not Working?

### Test the URL Directly

1. Copy your Web App URL
2. Paste it in a new browser tab
3. You should see JSON response like:
   ```json
   {"success":true,"data":[]}
   ```
4. If you see an error or HTML page, the deployment is wrong

### Common Mistakes

❌ **Using /dev URL**: Must use `/exec` URL
```
Wrong: https://script.google.com/.../dev
Right: https://script.google.com/.../exec
```

❌ **Wrong Access Setting**: Must be "Anyone"
```
Wrong: "Only myself"
Wrong: "Anyone with Google account"
Right: "Anyone"
```

❌ **Not Re-deploying**: After code changes, you MUST create a new deployment

❌ **Old Browser Cache**: Clear cache or use incognito mode

### Alternative: Test with cURL

Open terminal and run:
```bash
curl "YOUR_WEB_APP_URL"
```

You should see JSON response. If you see HTML or error, the deployment is incorrect.

## Why "Anyone" Access is Safe

- The script only reads/writes to YOUR Google Sheet
- No sensitive data is exposed
- Users can only add thoughts (controlled by your script)
- You can monitor and moderate the sheet
- You can revoke access anytime by deleting the deployment

## Need More Help?

1. Check Apps Script execution logs:
   - In Apps Script editor: **View** → **Executions**
   - Look for errors or failed requests

2. Verify sheet structure:
   - Column A: `timestamp`
   - Column B: `name`
   - Column C: `message`

3. Test with a simple GET request:
   - Open the Web App URL in browser
   - Should return JSON (not HTML)

## Quick Fix Summary

```bash
# 1. Update script code in Apps Script editor
# 2. Deploy → New deployment → Web app → Anyone
# 3. Copy new URL
# 4. Update .env with new URL
# 5. Restart dev server
npm run dev
# 6. Test in browser
```

---

**After following these steps, your CORS error should be resolved!**
