# Countdown Timer Platform Setup

## 1. Google Sheets Backend Setup

### Step 1: Create the Google Sheet
1. Go to [Google Sheets](https://sheets.google.com)
2. Create a new sheet named `timers-db`
3. Create three tabs: `rooms`, `timers`, `messages`

### Step 2: Set up sheet headers

**rooms tab:**
```
room_id | title | owner_email | created_at
```

**timers tab:**
```
timer_id | room_id | order | title | speaker | duration_sec | start_time | mode | wrap_yellow_pct | wrap_red_pct | linked_to | status | updated_at
```

**messages tab:**
```
msg_id | room_id | text | color | is_flashing | is_shown | created_at
```

### Step 3: Share the sheet
1. Click **File** → **Share**
2. Set to **Anyone with the link** → **Viewer**
3. Copy the sheet ID from the URL (between `/d/` and `/edit`)

### Step 4: Set up Google Apps Script
1. Go to [Google Apps Script](https://script.google.com)
2. Create a new project named `timer-platform-api`
3. Copy the code from `Code.gs`
4. Replace `SHEET_ID` with your actual sheet ID
5. Deploy as web app with access for "Anyone"

**Deployed Apps Script URL:**
```
https://script.google.com/macros/s/AKfycbwT_mQC1ms5lmOKh_U-LrbTJ-NXjTvSmopf01jkzTMLINVR148vPvHYZRs2s4HnT8nF/exec
```

## 2. Deployment

### Live Platform
- **Operator Interface**: https://timer-platform.vercel.app/
- **Presenter View**: https://timer-platform.vercel.app/presenter.html
- **GitHub Repository**: https://github.com/doubleflannel/timer-platform

### Local Setup (Optional)
Open `index.html` in a web browser to access the operator interface.
Open `presenter.html` in fullscreen mode for the presenter view.

## Configuration

The platform is pre-configured with the deployed Apps Script API URL. No additional configuration needed for the live version.