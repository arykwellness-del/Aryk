// Google Apps Script - Debug Version with Logging

function doPost(e) {
  try {
    // Log the incoming request for debugging
    console.log('POST request received');
    console.log('Parameters:', e.parameter);
    console.log('Post data:', e.postData);
    
    const sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
    console.log('Sheet name:', sheet.getName());
    
    // Get data from form parameters
    const name = (e.parameter && e.parameter.name) || 'Anonymous';
    const message = (e.parameter && e.parameter.message) || '';
    
    console.log('Name:', name);
    console.log('Message:', message);

    if (!message.trim()) {
      console.log('Error: Empty message');
      return ContentService.createTextOutput(JSON.stringify({ 
        success: false, 
        error: 'Message is required' 
      })).setMimeType(ContentService.MimeType.JSON);
    }

    // Get current row count for debugging
    const lastRow = sheet.getLastRow();
    console.log('Last row before append:', lastRow);

    // Append new row: [timestamp, name, message]
    const timestamp = new Date().toISOString();
    sheet.appendRow([timestamp, name.trim(), message.trim()]);
    
    console.log('Row appended successfully');
    console.log('New last row:', sheet.getLastRow());

    return ContentService.createTextOutput(JSON.stringify({ 
      success: true, 
      message: 'Thought saved successfully',
      debug: {
        timestamp: timestamp,
        name: name.trim(),
        message: message.trim(),
        lastRow: sheet.getLastRow()
      }
    })).setMimeType(ContentService.MimeType.JSON);
    
  } catch (error) {
    console.error('Error in doPost:', error);
    return ContentService.createTextOutput(JSON.stringify({ 
      success: false, 
      error: error.toString(),
      stack: error.stack
    })).setMimeType(ContentService.MimeType.JSON);
  }
}

function doGet(e) {
  return ContentService.createTextOutput(JSON.stringify({ 
    success: true, 
    message: 'Apps Script is working. Use POST to store thoughts.',
    timestamp: new Date().toISOString()
  })).setMimeType(ContentService.MimeType.JSON);
}

// Test function you can run manually
function testAppend() {
  try {
    const sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
    sheet.appendRow([new Date().toISOString(), 'Test User', 'Test message from script']);
    console.log('Test append successful');
  } catch (error) {
    console.error('Test append failed:', error);
  }
}
