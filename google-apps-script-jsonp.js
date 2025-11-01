// Google Apps Script for Aryk Thoughts with JSONP support

function doGet(e) {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('Sheet1');
  if (!sheet) {
    const errorResponse = { success: false, error: 'Sheet not found' };
    return handleResponse(errorResponse, e.parameter.callback);
  }

  const data = sheet.getDataRange().getValues();
  const thoughts = data.slice(1).map(row => ({
    timestamp: row[0],
    name: row[1],
    message: row[2]
  })).filter(row => row.timestamp).reverse(); // Most recent first

  const response = { success: true, data: thoughts };
  return handleResponse(response, e.parameter.callback);
}

function doPost(e) {
  try {
    const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('Sheet1');
    if (!sheet) {
      return ContentService.createTextOutput(JSON.stringify({ success: false, error: 'Sheet not found' }))
        .setMimeType(ContentService.MimeType.JSON);
    }

    // Get data from URL-encoded form parameters
    const name = (e.parameter && e.parameter.name) || 'Anonymous';
    const message = (e.parameter && e.parameter.message) || '';

    if (!message) {
      return ContentService.createTextOutput(JSON.stringify({ success: false, error: 'Message is required' }))
        .setMimeType(ContentService.MimeType.JSON);
    }

    // Append new row
    sheet.appendRow([
      new Date().toISOString(),
      name,
      message
    ]);

    return ContentService.createTextOutput(JSON.stringify({ success: true, message: 'Thought saved successfully' }))
      .setMimeType(ContentService.MimeType.JSON);
  } catch (error) {
    return ContentService.createTextOutput(JSON.stringify({ success: false, error: error.toString() }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

function handleResponse(data, callback) {
  const json = JSON.stringify(data);
  
  if (callback) {
    // JSONP response
    return ContentService.createTextOutput(callback + '(' + json + ');')
      .setMimeType(ContentService.MimeType.JAVASCRIPT);
  } else {
    // Regular JSON response
    return ContentService.createTextOutput(json)
      .setMimeType(ContentService.MimeType.JSON);
  }
}
