import Database from 'better-sqlite3';
import path from 'path';
import { app } from 'electron';

const dbPath = path.join(app.getPath('userData'), 'employee-images.db');
const db = new Database(dbPath); //creates db file 

//imagePath is json array of strings
db.prepare(`
    CREATE TABLE IF NOT EXISTS employees (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        imagePath TEXT 
    )
`).run();

export default db;