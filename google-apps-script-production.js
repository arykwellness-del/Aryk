// Google Apps Script - Production Version for Aryk Thoughts
// This script handles storing thoughts in your Google Sheet

function doPost(e) {
  try {
    // Get the active sheet
    const sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
    
    // Get data from form parameters
    const name = (e.parameter && e.parameter.name) || 'Anonymous';
    const message = (e.parameter && e.parameter.message) || '';

    // Validate message
    if (!message.trim()) {
      return ContentService.createTextOutput(JSON.stringify({ 
        success: false, 
        error: 'Message is required' 
      })).setMimeType(ContentService.MimeType.JSON);
    }

    // Create timestamp
    const timestamp = new Date().toISOString();
    
    // Append new row: [timestamp, name, message]
    sheet.appendRow([timestamp, name.trim(), message.trim()]);

    // Return success response
    return ContentService.createTextOutput(JSON.stringify({ 
      success: true, 
      message: 'Thought saved successfully',
      timestamp: timestamp
    })).setMimeType(ContentService.MimeType.JSON);
    
  } catch (error) {
    // Return error response
    return ContentService.createTextOutput(JSON.stringify({ 
      success: false, 
      error: error.toString() 
    })).setMimeType(ContentService.MimeType.JSON);
  }
}

function doGet(e) {
  try {
    const sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
    const data = sheet.getDataRange().getValues();
    
    // Skip header row and convert to objects
    const thoughts = data.slice(1)
      .filter(row => row[0] && row[2]) // Must have timestamp and message
      .map(row => ({
        timestamp: row[0] ? row[0].toString() : '',
        name: row[1] ? row[1].toString() : 'Anonymous',
        message: row[2] ? row[2].toString() : ''
      }))
      .reverse(); // Most recent first

    const response = { success: true, data: thoughts };
    
    // Check if this is a JSONP request
    if (e.parameter && e.parameter.callback) {
      const callback = e.parameter.callback;
      const jsonpResponse = callback + '(' + JSON.stringify(response) + ');';
      return ContentService.createTextOutput(jsonpResponse)
        .setMimeType(ContentService.MimeType.JAVASCRIPT);
    } else {
      // Regular JSON response
      return ContentService.createTextOutput(JSON.stringify(response))
        .setMimeType(ContentService.MimeType.JSON);
    }
  } catch (error) {
    const errorResponse = { success: false, error: error.toString() };
    
    if (e.parameter && e.parameter.callback) {
      const callback = e.parameter.callback;
      const jsonpResponse = callback + '(' + JSON.stringify(errorResponse) + ');';
      return ContentService.createTextOutput(jsonpResponse)
        .setMimeType(ContentService.MimeType.JAVASCRIPT);
    } else {
      return ContentService.createTextOutput(JSON.stringify(errorResponse))
        .setMimeType(ContentService.MimeType.JSON);
    }
  }
}
