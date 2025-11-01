// Google Apps Script - Works with Google Sheets Tables

function doPost(e) {
  try {
    const sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
    
    const name = (e.parameter && e.parameter.name) || 'Anonymous';
    const message = (e.parameter && e.parameter.message) || '';

    if (!message.trim()) {
      return ContentService.createTextOutput(JSON.stringify({ 
        success: false, 
        error: 'Message is required' 
      })).setMimeType(ContentService.MimeType.JSON);
    }

    // Get the last row with data
    const lastRow = sheet.getLastRow();
    const nextRow = lastRow + 1;
    
    // Add data to specific cells (works with tables)
    sheet.getRange(nextRow, 1).setValue(new Date().toISOString()); // timestamp
    sheet.getRange(nextRow, 2).setValue(name.trim());              // name
    sheet.getRange(nextRow, 3).setValue(message.trim());           // message

    return ContentService.createTextOutput(JSON.stringify({ 
      success: true, 
      message: 'Thought saved successfully to table',
      row: nextRow
    })).setMimeType(ContentService.MimeType.JSON);
    
  } catch (error) {
    return ContentService.createTextOutput(JSON.stringify({ 
      success: false, 
      error: error.toString() 
    })).setMimeType(ContentService.MimeType.JSON);
  }
}

function doGet(e) {
  return ContentService.createTextOutput(JSON.stringify({ 
    success: true, 
    message: 'Google Sheets Table integration is working!' 
  })).setMimeType(ContentService.MimeType.JSON);
}

// Alternative method using insertRowAfter (also works with tables)
function doPostAlternative(e) {
  try {
    const sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
    
    const name = (e.parameter && e.parameter.name) || 'Anonymous';
    const message = (e.parameter && e.parameter.message) || '';

    if (!message.trim()) {
      return ContentService.createTextOutput(JSON.stringify({ 
        success: false, 
        error: 'Message is required' 
      })).setMimeType(ContentService.MimeType.JSON);
    }

    // Insert a new row after the last row
    const lastRow = sheet.getLastRow();
    sheet.insertRowAfter(lastRow);
    const newRow = lastRow + 1;
    
    // Set values in the new row
    sheet.getRange(newRow, 1, 1, 3).setValues([[
      new Date().toISOString(),
      name.trim(),
      message.trim()
    ]]);

    return ContentService.createTextOutput(JSON.stringify({ 
      success: true, 
      message: 'Thought saved successfully to table',
      row: newRow
    })).setMimeType(ContentService.MimeType.JSON);
    
  } catch (error) {
    return ContentService.createTextOutput(JSON.stringify({ 
      success: false, 
      error: error.toString() 
    })).setMimeType(ContentService.MimeType.JSON);
  }
}
