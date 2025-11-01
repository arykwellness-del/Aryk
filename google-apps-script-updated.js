// Google Apps Script for Aryk Thoughts
// Updated to use specific sheet name

function doGet(e) {
  // Use specific sheet name instead of getActiveSheet()
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('Sheet1');
  
  if (!sheet) {
    return ContentService
      .createTextOutput(JSON.stringify({ success: false, error: 'Sheet not found' }))
      .setMimeType(ContentService.MimeType.JSON);
  }
  
  const data = sheet.getDataRange().getValues();
  
  // Skip header row and convert to objects
  const thoughts = data.slice(1).map(row => ({
    timestamp: row[0],
    name: row[1],
    message: row[2]
  })).filter(row => row.timestamp); // Filter out empty rows
  
  // Reverse to show most recent first
  const reversedThoughts = thoughts.reverse();
  
  return ContentService
    .createTextOutput(JSON.stringify({ success: true, data: reversedThoughts }))
    .setMimeType(ContentService.MimeType.JSON);
}

function doPost(e) {
  try {
    // Use specific sheet name
    const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('Sheet1');
    
    if (!sheet) {
      return ContentService
        .createTextOutput(JSON.stringify({ success: false, error: 'Sheet not found' }))
        .setMimeType(ContentService.MimeType.JSON);
    }
    
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
