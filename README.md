# 🎉 Birthday Survey with Results Dashboard

A beautiful, interactive birthday survey with a live results dashboard. Perfect for collecting preferences for a birthday celebration!

## Features

✨ **Beautiful UI** - Gradient design with smooth animations
📊 **Live Results Dashboard** - See responses in real-time
💾 **Database Storage** - Responses saved to SQLite
🔄 **Easy Setup** - Deploy to Replit in minutes
📱 **Mobile Friendly** - Works on all devices

## Quick Start with Replit

### Step 1: Fork to Replit
1. Go to [Replit](https://replit.com)
2. Click **"Create Repl"**
3. Choose **"Import from GitHub"**
4. Paste: `https://github.com/yayap-bit/cd`
5. Click **"Import from GitHub"**

### Step 2: Install Dependencies
Replit will automatically detect and install `package.json` dependencies. If not:
1. Click the **"Shell"** tab at the bottom
2. Type: `npm install`
3. Press Enter

### Step 3: Run the Server
1. Click the **"Run"** button at the top
2. Your app will start! 🚀

### Step 4: Share the Survey
- **Survey URL**: `https://your-replit-name.repl.co`
- **Results Dashboard**: `https://your-replit-name.repl.co/results`

Share the survey URL with friends! Results update live on the dashboard.

---

## Local Setup (On Your Computer)

### Prerequisites
- Node.js installed ([Download](https://nodejs.org))

### Steps
1. **Clone the repository**
```bash
git clone https://github.com/yayap-bit/cd.git
cd cd
```

2. **Install dependencies**
```bash
npm install
```

3. **Start the server**
```bash
npm start
```

4. **Open in browser**
- Survey: `http://localhost:3000`
- Results: `http://localhost:3000/results`

---

## File Structure

```
.
├── package.json          # Node.js dependencies
├── server.js             # Express backend server
├── cdsbday.html          # Survey form
├── survey_responses.db   # SQLite database (created automatically)
└── README.md             # This file
```

---

## How It Works

1. **User fills survey** → 4 questions with multiple choice answers
2. **Clicks Submit** → Response sent to backend
3. **Backend saves to database** → SQLite stores the data
4. **View results** → Open `/results` page to see all responses
5. **Live updates** → Dashboard auto-refreshes every 5 seconds

---

## API Endpoints

### POST `/api/submit-survey`
Submit a completed survey response.

**Request:**
```json
{
  "answers": {
    "1": "friday",
    "2": "chill",
    "3": "pink",
    "4": "japanese"
  }
}
```

**Response:**
```json
{
  "success": true,
  "message": "Survey saved!"
}
```

### GET `/api/results`
Get all survey responses as JSON.

**Response:**
```json
[
  {
    "id": 1,
    "date": "2026-06-06",
    "question_1": "friday",
    "question_2": "chill",
    "question_3": "pink",
    "question_4": "japanese",
    "created_at": "2026-06-06T13:08:17.000Z"
  }
]
```

---

## Customization

### Change Survey Questions
Edit `cdsbday.html`:
- Find the `<!-- Question X -->` sections
- Modify the question text and options
- Update the emoji if desired

### Styling
All CSS is in the `<style>` tag in `cdsbday.html`. Colors and fonts can be easily customized.

### Database
SQLite database is automatically created at `survey_responses.db`. To reset:
1. Stop the server
2. Delete `survey_responses.db`
3. Restart the server

---

## Troubleshooting

### "Port 3000 is already in use"
Change the port in `server.js` line `const PORT = 3000;` to something like `3001`

### Results not saving
1. Check browser console for errors (F12 → Console)
2. Make sure server is running
3. Check that the survey questions have values selected

### Can't see results on dashboard
- Refresh the page (Ctrl+R / Cmd+R)
- Make sure the URL is correct: `/results`
- Wait 5 seconds for auto-refresh

---

## Deployment Options

### Replit (Recommended - Free & Easy)
Already covered above! ⭐

### Heroku (Free tier ending 11/2022)
Use Procfile and Config Vars for environment setup

### Railway / Render / Fly.io
Alternative cloud platforms with free tiers

---

## License

Feel free to use and modify for your needs! 💕

---

## Questions?

If you need help:
1. Check the troubleshooting section
2. Review the code comments in `server.js`
3. Check browser console for error messages

Enjoy your survey! 🎉
