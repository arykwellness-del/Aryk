// Google Apps Script for Aryk Thoughts - Final Version

function doGet(e) {
  try {
    const sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
    const data = sheet.getDataRange().getValues();
    
    // Skip header row (row 0) and convert to objects
    const thoughts = data.slice(1)
      .filter(row => row[0] && row[2]) // Must have timestamp and message
      .map(row => ({
        timestamp: row[0] ? row[0].toString() : '',
        name: row[1] ? row[1].toString() : 'Anonymous',
        message: row[2] ? row[2].toString() : ''
      }))
      .reverse(); // Most recent first

    const response = { success: true, data: thoughts };
    return handleResponse(response, e.parameter.callback);
  } catch (error) {
    const errorResponse = { success: false, error: error.toString() };
    return handleResponse(errorResponse, e.parameter.callback);
  }
}

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

function handleResponse(data, callback) {
  const json = JSON.stringify(data);
  
  if (callback) {
    // JSONP response for GET requests
    return ContentService.createTextOutput(callback + '(' + json + ');')
      .setMimeType(ContentService.MimeType.JAVASCRIPT);
  } else {
    // Regular JSON response for POST requests
    return ContentService.createTextOutput(json)
      .setMimeType(ContentService.MimeType.JSON);
  }
}
