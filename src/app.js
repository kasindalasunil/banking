const express = require('express')
const pool = require('./config/db')
const userrouter = require('./routes/userroute');
const branchrouter = require('./routes/branchroute');
const accountrouter = require('./routes/accountroute');




const app = express();
app.use(express.json()); // for parsing data


app.get("/ping", async (req, res) => {
  try {
    const [rows] = await pool.query("SELECT 1 + 1 AS result");
    res.json({ success: true, db_result: rows[0].result });
  } catch (err) {
    console.error("DB connection failed:", err.message);
    res.status(500).json({ error: "Database connection failed" });
  }
});


app.use('/api/user',userrouter);
app.use('/api/branch',branchrouter);
app.use('/api/account',accountrouter);




module.exports = app;











