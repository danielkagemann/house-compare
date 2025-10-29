import Database from "better-sqlite3";

const db = new Database("data.db", { verbose: console.log });

// Tabelle anlegen, falls sie noch nicht existiert
db.prepare(
  `
  CREATE TABLE IF NOT EXISTS USER (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    creationdate DATETIME DEFAULT CURRENT_TIMESTAMP,
    email TEXT NOT NULL UNIQUE,
    access TEXT NOT NULL,
    editlink TEXT,
    sharelink TEXT
  )
`
).run();

export default db;
