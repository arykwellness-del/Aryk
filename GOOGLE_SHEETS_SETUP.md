# Google Sheets Integration Setup Guide

## Step 1: Create a Google Sheet

1. Go to [Google Sheets](https://sheets.google.com)
2. Create a new spreadsheet
3. Name it "Aryk Thoughts"
4. In the first row, add these column headers:
   - Column A: `timestamp`
   - Column B: `name`
   - Column C: `message`

## Step 2: Open Apps Script Editor

1. In your Google Sheet, click on `Extensions` > `Apps Script`
2. Delete any existing code in the editor
3. Copy and paste the code from `google-apps-script.js` (see below)

## Step 3: Deploy as Web App

1. In the Apps Script editor, click on `Deploy` > `New deployment`
2. Click the gear icon next to "Select type" and choose `Web app`
3. Fill in the following:
   - **Description**: "Aryk Thoughts API"
   - **Execute as**: "Me"
   - **Who has access**: "Anyone"
4. Click `Deploy`
5. Copy the **Web app URL** (it will look like: `https://script.google.com/macros/s/...../exec`)
6. Authorize the app when prompted

## Step 4: Update Your Environment Variables

1. Open the `.env` file in your project
2. Add this line (replace with your actual URL):
   ```
   VITE_GOOGLE_SHEETS_API_URL=https://script.google.com/macros/s/YOUR_DEPLOYMENT_ID/exec
   ```

## Step 5: Test the Integration

1. Run your development server: `npm run dev`
2. Go to the Relaxing Corner page
3. Try submitting a thought
4. Check your Google Sheet to see if the data appears

## Troubleshooting

- **CORS errors**: Make sure you deployed the script with "Anyone" access
- **Data not appearing**: Check the Apps Script execution logs (View > Executions)
- **Authorization issues**: Re-deploy the script and re-authorize

## Google Apps Script Code

Copy this code into your Apps Script editor:

```javascript
// This script handles storing and retrieving thoughts from Google Sheets

function doGet(e) {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
  const data = sheet.getDataRange().getValues();
  
  // Skip header row and convert to objects
  const thoughts = data.slice(1).map(row => ({
    timestamp: row[0],
    name: row[1],
    message: row[2]
  })).reverse(); // Most recent first
  
  return ContentService
    .createTextOutput(JSON.stringify({ success: true, data: thoughts }))
    .setMimeType(ContentService.MimeType.JSON);
}

function doPost(e) {
  try {
    const sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
    const data = JSON.parse(e.postData.contents);
    
    // Append new row with timestamp, name, and message
    sheet.appendRow([
      new Date().toISOString(),
      data.name || 'Anonymous',
      data.message
    ]);
    
    return ContentService
      .createTextOutput(JSON.stringify({ success: true, message: 'Thought saved successfully' }))
      .setMimeType(ContentService.MimeType.JSON);
  } catch (error) {
    return ContentService
      .createTextOutput(JSON.stringify({ success: false, error: error.toString() }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}
```

## Security Notes

- This setup allows anyone to read and write to your sheet
- For production, consider adding authentication
- You can restrict access by checking user emails in the script
- Monitor your sheet regularly for spam or inappropriate content
