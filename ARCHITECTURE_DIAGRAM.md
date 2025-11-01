# Google Sheets Integration Architecture

## System Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                         USER BROWSER                             │
│                                                                   │
│  ┌───────────────────────────────────────────────────────────┐  │
│  │           Relaxing Corner Page Component                   │  │
│  │                                                             │  │
│  │  ┌─────────────────┐        ┌──────────────────┐          │  │
│  │  │  Submit Form    │        │  Thoughts List   │          │  │
│  │  │  - Name input   │        │  - Loading state │          │  │
│  │  │  - Message area │        │  - Display cards │          │  │
│  │  │  - Share button │        │  - Timestamps    │          │  │
│  │  └────────┬────────┘        └────────▲─────────┘          │  │
│  │           │                           │                     │  │
│  │           │ submitThought()           │ fetchThoughts()    │  │
│  │           │                           │                     │  │
│  │           ▼                           │                     │  │
│  │  ┌──────────────────────────────────────────────────────┐  │  │
│  │  │      googleSheetsService.ts                          │  │  │
│  │  │  ┌────────────────┐    ┌──────────────────┐         │  │  │
│  │  │  │ saveThought()  │    │ fetchThoughts()  │         │  │  │
│  │  │  └───────┬────────┘    └────────▲─────────┘         │  │  │
│  │  └──────────┼──────────────────────┼───────────────────┘  │  │
│  └─────────────┼──────────────────────┼──────────────────────┘  │
└────────────────┼──────────────────────┼─────────────────────────┘
                 │                      │
                 │ POST                 │ GET
                 │ (save)               │ (fetch)
                 │                      │
                 ▼                      │
┌─────────────────────────────────────────────────────────────────┐
│                    GOOGLE CLOUD                                  │
│                                                                   │
│  ┌───────────────────────────────────────────────────────────┐  │
│  │         Google Apps Script Web App                         │  │
│  │                                                             │  │
│  │  ┌──────────────┐              ┌──────────────┐           │  │
│  │  │  doPost()    │              │  doGet()     │           │  │
│  │  │  - Parse JSON│              │  - Read data │           │  │
│  │  │  - Validate  │              │  - Format    │           │  │
│  │  │  - Append row│              │  - Return    │           │  │
│  │  └──────┬───────┘              └──────▲───────┘           │  │
│  │         │                             │                    │  │
│  │         │ appendRow()                 │ getDataRange()    │  │
│  │         │                             │                    │  │
│  │         ▼                             │                    │  │
│  │  ┌──────────────────────────────────────────────────────┐ │  │
│  │  │           Google Sheets API                          │ │  │
│  │  └──────────────────────────────────────────────────────┘ │  │
│  └───────────────────────────────────────────────────────────┘  │
│                              │                                   │
│                              ▼                                   │
│  ┌───────────────────────────────────────────────────────────┐  │
│  │              Your Google Sheet                             │  │
│  │  ┌─────────────────────────────────────────────────────┐  │  │
│  │  │ A          │ B        │ C                           │  │  │
│  │  │ timestamp  │ name     │ message                     │  │  │
│  │  ├────────────┼──────────┼─────────────────────────────┤  │  │
│  │  │ 2025-10... │ John     │ Great product!              │  │  │
│  │  │ 2025-10... │ Sarah    │ Love the relaxing corner    │  │  │
│  │  │ 2025-10... │ Anonymous│ This is amazing!            │  │  │
│  │  └─────────────────────────────────────────────────────┘  │  │
│  └───────────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────────┘
```

## Data Flow Diagram

### Saving a Thought

```
User fills form
     │
     ▼
Clicks "Share" button
     │
     ▼
submitThought() called
     │
     ├─── Set isSyncing = true (show "Saving...")
     │
     ▼
saveThought(name, message)
     │
     ├─── Fetch POST to Google Apps Script URL
     │
     ▼
Google Apps Script doPost()
     │
     ├─── Parse JSON data
     ├─── Add timestamp
     ├─── Append to sheet
     │
     ▼
Return success/failure
     │
     ▼
Update UI
     │
     ├─── Show success toast
     ├─── Add to local state
     ├─── Save to localStorage (backup)
     ├─── Clear form
     └─── Set isSyncing = false
```

### Loading Thoughts

```
Page loads
     │
     ▼
useEffect() triggered
     │
     ├─── Set isLoading = true (show "Loading...")
     │
     ▼
fetchThoughts()
     │
     ├─── Fetch GET from Google Apps Script URL
     │
     ▼
Google Apps Script doGet()
     │
     ├─── Read all rows from sheet
     ├─── Convert to JSON
     ├─── Reverse order (newest first)
     │
     ▼
Return thoughts array
     │
     ▼
Process response
     │
     ├─── Convert to Review format
     ├─── Update state
     ├─── Save to localStorage (backup)
     └─── Set isLoading = false
     │
     ▼
Display thoughts in UI
```

## Fallback Strategy

```
Try Google Sheets
     │
     ├─── Success? → Use Google Sheets data
     │
     └─── Failed?
           │
           ▼
     Try localStorage
           │
           ├─── Data exists? → Use cached data
           │
           └─── No data? → Show "No thoughts yet"
```

## Component Structure

```
RelaxingCorner.tsx
│
├── State Management
│   ├── reviews: Review[]
│   ├── name: string
│   ├── message: string
│   ├── isLoading: boolean
│   └── isSyncing: boolean
│
├── Effects
│   ├── Load thoughts on mount
│   └── Persist to localStorage
│
├── Handlers
│   ├── submitThought()
│   └── onCanvasClick()
│
└── UI Components
    ├── Bubble Canvas
    ├── Video Testimonials
    └── Share Your Thoughts
        ├── Input Form
        │   ├── Name field
        │   ├── Message field
        │   └── Submit button (with loading state)
        └── Thoughts List
            └── Thought cards (with loading state)
```

## Environment Configuration

```
.env file
    │
    └── VITE_GOOGLE_SHEETS_API_URL
            │
            ▼
    vite-env.d.ts (TypeScript definitions)
            │
            ▼
    googleSheetsService.ts (reads via import.meta.env)
            │
            ▼
    RelaxingCorner.tsx (uses service)
```

## Security Flow

```
User submits thought
     │
     ▼
POST to Google Apps Script URL
     │
     ▼
Google verifies deployment settings
     │
     ├─── "Execute as": Me (your account)
     └─── "Who has access": Anyone
     │
     ▼
Script runs with your permissions
     │
     ▼
Data written to your Google Sheet
```

## Error Handling

```
Operation attempted
     │
     ├─── Success → Update UI, show success message
     │
     └─── Error
           │
           ├─── Log to console
           ├─── Show error toast
           ├─── Try fallback (localStorage)
           └─── Graceful degradation
```

---

This architecture ensures:
- ✅ Resilience (fallback to localStorage)
- ✅ User feedback (loading states, toasts)
- ✅ Type safety (TypeScript)
- ✅ Separation of concerns (service layer)
- ✅ Easy maintenance (clear structure)
