// Google Apps Script - Store Thoughts Only (No Loading)

function doPost(e) {
  try {
    const sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
    
    // Get data from form parameters
    const name = (e.parameter && e.parameter.name) || 'Anonymous';
    const message = (e.parameter && e.parameter.message) || '';

    if (!message.trim()) {
      return ContentService.createTextOutput(JSON.stringify({ 
        success: false, 
        error: 'Message is required' 
      })).setMimeType(ContentService.MimeType.JSON);
    }

    // Append new row: [timestamp, name, message]
    sheet.appendRow([
      new Date().toISOString(),
      name.trim(),
      message.trim()
    ]);

    return ContentService.createTextOutput(JSON.stringify({ 
      success: true, 
      message: 'Thought saved successfully' 
    })).setMimeType(ContentService.MimeType.JSON);
    
  } catch (error) {
    return ContentService.createTextOutput(JSON.stringify({ 
      success: false, 
      error: error.toString() 
    })).setMimeType(ContentService.MimeType.JSON);
  }
}

// Optional: Handle GET requests with a simple message
function doGet(e) {
  return ContentService.createTextOutput(JSON.stringify({ 
    success: true, 
    message: 'This endpoint only stores thoughts. No data retrieval available.' 
  })).setMimeType(ContentService.MimeType.JSON);
}
