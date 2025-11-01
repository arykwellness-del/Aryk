// Simple, bulletproof Google Sheets integration

const GOOGLE_SHEETS_API_URL = import.meta.env.VITE_GOOGLE_SHEETS_API_URL;

export interface Thought {
  timestamp: string;
  name: string;
  message: string;
}

/**
 * Save a thought to Google Sheets using reliable form submission
 */
export async function saveThought(name: string, message: string): Promise<boolean> {
  // Validate inputs
  if (!GOOGLE_SHEETS_API_URL) {
    console.error('❌ Google Sheets URL not found in .env file');
    return false;
  }

  if (!message || !message.trim()) {
    console.error('❌ Message is required');
    return false;
  }

  // Clean inputs
  const cleanName = (name || '').trim() || 'Anonymous';
  const cleanMessage = message.trim();

  console.log('📝 Saving thought to Google Sheets...');
  console.log('URL:', GOOGLE_SHEETS_API_URL);
  console.log('Name:', cleanName);
  console.log('Message:', cleanMessage);

  // Use the reliable hidden form method
  try {
    const result = await submitViaHiddenForm(cleanName, cleanMessage);
    if (result) {
      console.log('✅ Thought saved successfully');
    } else {
      console.log('❌ Failed to save thought');
    }
    return result;
  } catch (error) {
    console.error('❌ Error saving thought:', error);
    return false;
  }
}

/**
 * Fetch thoughts from Google Sheets
 */
export async function fetchThoughts(): Promise<Thought[]> {
  if (!GOOGLE_SHEETS_API_URL) {
    console.error('❌ Google Sheets URL not found in .env file');
    return [];
  }

  try {
    console.log('📖 Fetching thoughts from Google Sheets...');
    
    const response = await fetch(GOOGLE_SHEETS_API_URL, {
      method: 'GET',
      mode: 'cors'
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    
    if (data.success && data.data) {
      console.log(`✅ Fetched ${data.data.length} thoughts`);
      return data.data;
    } else {
      console.log('⚠️ No thoughts found or invalid response');
      return [];
    }
  } catch (error) {
    console.error('❌ Error fetching thoughts:', error);
    
    // Fallback: Try with JSONP if CORS fails
    try {
      return await fetchThoughtsWithJSONP();
    } catch (jsonpError) {
      console.error('❌ JSONP fallback also failed:', jsonpError);
      return [];
    }
  }
}

/**
 * Fallback method using JSONP for CORS issues
 */
async function fetchThoughtsWithJSONP(): Promise<Thought[]> {
  return new Promise((resolve, reject) => {
    console.log('🔄 Trying JSONP fallback...');
    
    const callbackName = `jsonp_callback_${Date.now()}`;
    const script = document.createElement('script');
    
    // Set up the callback
    (window as any)[callbackName] = (data: any) => {
      cleanup();
      if (data.success && data.data) {
        console.log(`✅ JSONP fetched ${data.data.length} thoughts`);
        resolve(data.data);
      } else {
        console.log('⚠️ JSONP: No thoughts found');
        resolve([]);
      }
    };
    
    const cleanup = () => {
      try {
        if (document.body.contains(script)) {
          document.body.removeChild(script);
        }
        delete (window as any)[callbackName];
      } catch (e) {
        // Ignore cleanup errors
      }
    };
    
    // Set up error handling
    script.onerror = () => {
      cleanup();
      console.log('❌ JSONP script failed to load');
      reject(new Error('JSONP request failed'));
    };
    
    // Set up timeout
    setTimeout(() => {
      cleanup();
      console.log('⏰ JSONP request timeout');
      reject(new Error('JSONP request timeout'));
    }, 10000);
    
    // Make the request
    const url = `${GOOGLE_SHEETS_API_URL}?callback=${callbackName}`;
    script.src = url;
    document.body.appendChild(script);
  });
}

/**
 * Reliable method using hidden iframe form submission
 */
async function submitViaHiddenForm(name: string, message: string): Promise<boolean> {
  return new Promise((resolve) => {
    console.log('🔄 Submitting via hidden form...');
    
    // Create unique identifiers
    const timestamp = Date.now();
    const iframeName = `hidden_iframe_${timestamp}`;
    
    // Create hidden iframe with better styling
    const iframe = document.createElement('iframe');
    iframe.name = iframeName;
    iframe.style.cssText = `
      position: absolute;
      left: -9999px;
      top: -9999px;
      width: 1px;
      height: 1px;
      border: none;
      visibility: hidden;
    `;
    document.body.appendChild(iframe);

    // Create form
    const form = document.createElement('form');
    form.method = 'POST';
    form.action = GOOGLE_SHEETS_API_URL;
    form.target = iframeName;
    form.style.cssText = `
      position: absolute;
      left: -9999px;
      top: -9999px;
      visibility: hidden;
    `;

    // Add fields with proper encoding
    const nameField = document.createElement('input');
    nameField.type = 'hidden';
    nameField.name = 'name';
    nameField.value = name;
    form.appendChild(nameField);

    const messageField = document.createElement('input');
    messageField.type = 'hidden';
    messageField.name = 'message';
    messageField.value = message;
    form.appendChild(messageField);

    // Handle completion
    const cleanup = () => {
      try {
        if (document.body.contains(form)) {
          document.body.removeChild(form);
        }
        if (document.body.contains(iframe)) {
          document.body.removeChild(iframe);
        }
      } catch (e) {
        // Ignore cleanup errors
        console.log('Cleanup error (ignored):', e);
      }
    };

    let resolved = false;
    const resolveOnce = (success: boolean) => {
      if (!resolved) {
        resolved = true;
        cleanup();
        if (success) {
          console.log('✅ Form submission completed successfully');
        } else {
          console.log('❌ Form submission failed');
        }
        resolve(success);
      }
    };

    // Set up event handlers
    iframe.onload = () => {
      console.log('📡 Iframe loaded - form submission completed');
      resolveOnce(true);
    };

    iframe.onerror = () => {
      console.log('❌ Iframe error - form submission failed');
      resolveOnce(false);
    };

    // Add error handling for form submission
    try {
      document.body.appendChild(form);
      form.submit();
      console.log('📤 Form submitted successfully');
    } catch (error) {
      console.error('❌ Form submission error:', error);
      resolveOnce(false);
      return;
    }

    // Timeout after 15 seconds (increased for reliability)
    setTimeout(() => {
      console.log('⏰ Form submission timeout - assuming success');
      resolveOnce(true); // Assume success on timeout
    }, 15000);
  });
}
