const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const cors = require('cors');
const path = require('path');

const app = express();
const PORT = 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static('.'));

// Initialize SQLite Database
const db = new sqlite3.Database('survey_responses.db', (err) => {
  if (err) console.error(err.message);
  else console.log('Connected to SQLite database');
});

// Create table if it doesn't exist
db.run(`
  CREATE TABLE IF NOT EXISTS responses (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    date TEXT,
    question_1 TEXT,
    question_2 TEXT,
    question_3 TEXT,
    question_4 TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  )
`);

// API endpoint to save survey response
app.post('/api/submit-survey', (req, res) => {
  const { answers } = req.body;
  
  if (!answers || !answers['1'] || !answers['2'] || !answers['3'] || !answers['4']) {
    return res.status(400).json({ error: 'Incomplete survey data' });
  }

  const stmt = db.prepare(`
    INSERT INTO responses (date, question_1, question_2, question_3, question_4)
    VALUES (?, ?, ?, ?, ?)
  `);

  stmt.run(
    new Date().toISOString().split('T')[0],
    answers['1'],
    answers['2'],
    answers['3'],
    answers['4'],
    (err) => {
      if (err) {
        console.error(err);
        return res.status(500).json({ error: 'Failed to save response' });
      }
      res.json({ success: true, message: 'Survey saved!' });
    }
  );

  stmt.finalize();
});

// API endpoint to get all responses
app.get('/api/results', (req, res) => {
  db.all(`SELECT * FROM responses ORDER BY created_at DESC`, (err, rows) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ error: 'Failed to fetch results' });
    }
    res.json(rows);
  });
});

// Results Dashboard Page
app.get('/results', (req, res) => {
  res.send(`
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Survey Results Dashboard</title>
      <style>
        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }
        
        body {
          font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
          background: linear-gradient(135deg, #ffecd2 0%, #fcb69f 50%, #ffecd2 100%);
          min-height: 100vh;
          padding: 40px 20px;
        }
        
        .container {
          max-width: 1000px;
          margin: 0 auto;
          background: white;
          border-radius: 20px;
          padding: 40px;
          box-shadow: 0 20px 60px rgba(252, 182, 159, 0.4);
        }
        
        h1 {
          color: #5a5a5a;
          margin-bottom: 10px;
          text-align: center;
        }
        
        .subtitle {
          text-align: center;
          color: #888;
          margin-bottom: 30px;
        }
        
        table {
          width: 100%;
          border-collapse: collapse;
          margin-bottom: 20px;
        }
        
        th {
          background: linear-gradient(135deg, #ff9a9e, #fecfef);
          color: white;
          padding: 15px;
          text-align: left;
          font-weight: 600;
        }
        
        td {
          padding: 12px 15px;
          border-bottom: 1px solid #f0f0f0;
        }
        
        tr:hover {
          background: #fef6f6;
        }
        
        .no-data {
          text-align: center;
          color: #888;
          padding: 40px;
          font-size: 18px;
        }
        
        .stats {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: 20px;
          margin-bottom: 30px;
        }
        
        .stat-card {
          background: linear-gradient(135deg, #a8edea, #fed6e3);
          padding: 20px;
          border-radius: 15px;
          text-align: center;
        }
        
        .stat-number {
          font-size: 32px;
          font-weight: bold;
          color: #5a5a5a;
        }
        
        .stat-label {
          color: #666;
          margin-top: 5px;
        }

        .refresh-btn {
          background: linear-gradient(135deg, #ff9a9e, #fecfef);
          color: white;
          border: none;
          padding: 12px 24px;
          border-radius: 25px;
          cursor: pointer;
          font-weight: 600;
          transition: all 0.3s ease;
        }

        .refresh-btn:hover {
          transform: scale(1.05);
        }
      </style>
    </head>
    <body>
      <div class="container">
        <h1>🎉 Survey Results Dashboard</h1>
        <p class="subtitle">All Birthday Survey Responses</p>
        
        <div class="stats">
          <div class="stat-card">
            <div class="stat-number" id="totalCount">0</div>
            <div class="stat-label">Total Responses</div>
          </div>
        </div>

        <button class="refresh-btn" onclick="location.reload()">🔄 Refresh Results</button>
        
        <table id="resultsTable">
          <thead>
            <tr>
              <th>#</th>
              <th>Date</th>
              <th>Which Date? 🌸</th>
              <th>Activity 🍰</th>
              <th>Color 🎨</th>
              <th>Cuisine ✨</th>
              <th>Submitted</th>
            </tr>
          </thead>
          <tbody id="tableBody">
            <tr><td colspan="7" class="no-data">Loading results...</td></tr>
          </tbody>
        </table>
      </div>

      <script>
        async function loadResults() {
          try {
            const response = await fetch('/api/results');
            const data = await response.json();
            
            const tableBody = document.getElementById('tableBody');
            const totalCount = document.getElementById('totalCount');
            
            if (data.length === 0) {
              tableBody.innerHTML = '<tr><td colspan="7" class="no-data">No responses yet. Share the survey link! 📝</td></tr>';
              totalCount.textContent = '0';
              return;
            }
            
            totalCount.textContent = data.length;
            
            tableBody.innerHTML = data.map((row, index) => \`
              <tr>
                <td>\${index + 1}</td>
                <td>\${row.date}</td>
                <td>\${row.question_1}</td>
                <td>\${row.question_2}</td>
                <td>\${row.question_3}</td>
                <td>\${row.question_4}</td>
                <td>\${new Date(row.created_at).toLocaleString()}</td>
              </tr>
            \`).join('');
          } catch (error) {
            console.error('Error loading results:', error);
            document.getElementById('tableBody').innerHTML = '<tr><td colspan="7" class="no-data">Error loading results</td></tr>';
          }
        }
        
        // Load results when page opens
        loadResults();
        
        // Auto-refresh every 5 seconds
        setInterval(loadResults, 5000);
      </script>
    </body>
    </html>
  `);
});

// Serve the survey HTML
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'cdsbday.html'));
});

app.listen(PORT, () => {
  console.log(`
  ╔════════════════════════════════════════╗
  ║  Birthday Survey Server Running! 🎉   ║
  ║  Survey: http://localhost:${PORT}       ║
  ║  Results: http://localhost:${PORT}/results ║
  ╚════════════════════════════════════════╝
  `);
});
