// Google Apps Script for Aryk Thoughts
// Deploy this as a Web App in your Google Sheet

function doGet(e) {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
  const data = sheet.getDataRange().getValues();
  
  // Skip header row and convert to objects
  const thoughts = data.slice(1).map(row => ({
    timestamp: row[0],
    name: row[1],
    message: row[2]
  })).reverse(); // Most recent first
  
  const output = ContentService
    .createTextOutput(JSON.stringify({ success: true, data: thoughts }))
    .setMimeType(ContentService.MimeType.JSON);
  
  // Add CORS headers
  return output;
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
