# Google Sheets Integration - Setup Checklist

Use this checklist to ensure you complete all setup steps correctly.

## Pre-Setup Checklist

- [ ] I have a Google account
- [ ] I have access to Google Sheets
- [ ] I have the project files ready
- [ ] I understand the basic concept

---

## Step 1: Create Google Sheet

- [ ] Opened [Google Sheets](https://sheets.google.com)
- [ ] Created a new blank spreadsheet
- [ ] Named it "Aryk Thoughts" (or similar)
- [ ] Added column headers in Row 1:
  - [ ] Cell A1: `timestamp`
  - [ ] Cell B1: `name`
  - [ ] Cell C1: `message`
- [ ] Saved the sheet (auto-saves)

**Screenshot location**: (Optional - take a screenshot for reference)

---

## Step 2: Set Up Apps Script

- [ ] Clicked **Extensions** → **Apps Script** in Google Sheets
- [ ] Saw the Apps Script editor open
- [ ] Deleted all existing code in the editor
- [ ] Opened `google-apps-script.js` from project folder
- [ ] Copied all code from the file
- [ ] Pasted into Apps Script editor
- [ ] Clicked Save (💾) or pressed Ctrl+S
- [ ] Named the project "Aryk Thoughts API"

**Project name**: ___________________________

---

## Step 3: Deploy Web App

- [ ] Clicked **Deploy** → **New deployment**
- [ ] Clicked gear icon (⚙️) next to "Select type"
- [ ] Selected **Web app**
- [ ] Configured deployment:
  - [ ] Description: "Aryk Thoughts API v1"
  - [ ] Execute as: **"Me"**
  - [ ] Who has access: **"Anyone"**
- [ ] Clicked **Deploy**
- [ ] Completed authorization:
  - [ ] Clicked **Review permissions**
  - [ ] Selected Google account
  - [ ] Clicked **Advanced**
  - [ ] Clicked **Go to [Project Name] (unsafe)**
  - [ ] Clicked **Allow**
- [ ] Copied the Web app URL

**Web App URL**: ___________________________________________

---

## Step 4: Update Project Configuration

- [ ] Opened `.env` file in project root
- [ ] Found line: `VITE_GOOGLE_SHEETS_API_URL=`
- [ ] Pasted Web App URL after the `=` sign
- [ ] Verified URL ends with `/exec`
- [ ] Saved the `.env` file
- [ ] Closed and reopened the file to verify changes

**Configured URL**: ___________________________________________

---

## Step 5: Restart Development Server

- [ ] Stopped the current dev server (Ctrl+C)
- [ ] Ran `npm run dev` to restart
- [ ] Server started successfully
- [ ] No errors in terminal

**Server URL**: http://localhost:_____ (usually 5173)

---

## Step 6: Test the Integration

### Test 1: Submit a Thought

- [ ] Opened browser to Relaxing Corner page
- [ ] Scrolled to "Share Your Thoughts" section
- [ ] Entered test name: "Test User"
- [ ] Entered test message: "Testing Google Sheets integration"
- [ ] Clicked **Share** button
- [ ] Saw "Saving..." text briefly
- [ ] Saw success toast notification
- [ ] Form cleared after submission

### Test 2: Verify in Google Sheet

- [ ] Opened Google Sheet in another tab
- [ ] Saw new row with:
  - [ ] Timestamp in column A
  - [ ] Name in column B
  - [ ] Message in column C
- [ ] Data matches what was submitted

### Test 3: Reload Page

- [ ] Refreshed the Relaxing Corner page
- [ ] Saw "Loading thoughts..." briefly
- [ ] Test thought appeared in the list
- [ ] Timestamp displayed correctly

### Test 4: Submit Another Thought

- [ ] Submitted a second thought
- [ ] Appeared at the top of the list
- [ ] Google Sheet updated with new row
- [ ] Both thoughts visible on page

---

## Troubleshooting Checklist

If something doesn't work, check these:

### Thoughts Not Saving

- [ ] Verified Web App URL is correct in `.env`
- [ ] URL ends with `/exec` (not `/dev`)
- [ ] Restarted dev server after updating `.env`
- [ ] Checked browser console for errors (F12)
- [ ] Verified Apps Script deployment is "Anyone" access

### Thoughts Not Loading

- [ ] Column headers are exactly: `timestamp`, `name`, `message`
- [ ] Column headers are in Row 1
- [ ] Google Sheet has at least one data row
- [ ] Checked browser console for errors
- [ ] Verified network tab shows successful requests

### Authorization Issues

- [ ] Completed all authorization steps
- [ ] Selected correct Google account
- [ ] Clicked "Allow" on permissions screen
- [ ] Re-deployed if authorization was cancelled

### CORS Errors

- [ ] Deployment set to "Anyone" access
- [ ] Using `/exec` URL (not `/dev`)
- [ ] Cleared browser cache
- [ ] Tried in incognito/private window

---

## Post-Setup Verification

- [ ] Can submit thoughts successfully
- [ ] Thoughts appear in Google Sheet
- [ ] Thoughts load when page refreshes
- [ ] Multiple thoughts work correctly
- [ ] Loading states show properly
- [ ] Error handling works (tested by breaking URL)
- [ ] Local storage fallback works

---

## Optional Enhancements

Consider these after basic setup works:

- [ ] Add email notifications for new thoughts
- [ ] Set up data validation in Google Sheet
- [ ] Add spam filtering
- [ ] Create a backup/export routine
- [ ] Add analytics tracking
- [ ] Set up monitoring/alerts

---

## Documentation Review

- [ ] Read QUICK_START_GOOGLE_SHEETS.md
- [ ] Reviewed GOOGLE_SHEETS_SETUP.md
- [ ] Understood ARCHITECTURE_DIAGRAM.md
- [ ] Checked IMPLEMENTATION_SUMMARY.md

---

## Final Checks

- [ ] All tests passed
- [ ] No console errors
- [ ] Google Sheet updating correctly
- [ ] UI looks good
- [ ] Loading states work
- [ ] Error messages are clear
- [ ] Ready for production (or further development)

---

## Notes & Issues

Use this space to note any issues or customizations:

```
Date: ___________
Issue/Note: 




Resolution: 




```

---

## Completion

✅ **Setup Complete!**

Date completed: ___________

Completed by: ___________

Next steps:
- [ ] Test with real users
- [ ] Monitor for issues
- [ ] Plan enhancements
- [ ] Document any customizations

---

**Need help?** Refer to the troubleshooting sections in:
- QUICK_START_GOOGLE_SHEETS.md
- GOOGLE_SHEETS_SETUP.md
