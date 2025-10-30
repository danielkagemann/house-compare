import { User } from "@/model/user";
import Database from "better-sqlite3";

const db = new Database("villaya-data.db", { verbose: console.log });

// create user table if not existing
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

// create table basedon Listing model
db.prepare(
  `
  CREATE TABLE IF NOT EXISTS LISTING (
    uuid TEXT NOT NULL UNIQUE,
    userId INTEGER NOT NULL,
    creationdate DATETIME DEFAULT CURRENT_TIMESTAMP,
    title TEXT,
    url TEXT,
    price TEXT,
    sqm TEXT,
    rooms TEXT,
    location TEXT,   
    image TEXT,
    description TEXT,
    contact TEXT,
    year TEXT,
    features TEXT,
    notes TEXT
  )
`
).run();

export default db;

export function getUserIdFromAccessToken(accessToken?: string): number | null {
  if (!accessToken) {
    return null;
  }

  const user = db
    .prepare("SELECT * FROM USER WHERE access = ?")
    .get(accessToken) as User;

  if (!user) {
    return null;
  }

  return user.id;
}
