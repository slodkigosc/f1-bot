const Database = require("better-sqlite3");

const db = new Database("database.db");

db.prepare(`
CREATE TABLE IF NOT EXISTS jokers (
  user_id TEXT PRIMARY KEY,
  count INTEGER DEFAULT 2
)
`).run();

module.exports = db;