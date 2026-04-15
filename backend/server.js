require('dotenv').config();
const express = require('express');
const Database = require('better-sqlite3');
const cors = require('cors');

const app = express();
const port = process.env.PORT || 3000;

// Enable CORS so the frontend can access the API
app.use(cors());
app.use(express.json());

// Database
let db;

async function initDB() {
    try {
        console.log("Initializing SQLite database...");
        db = new Database('gantt.db');

        // Create tasks table
        const createTableQuery = `
            CREATE TABLE IF NOT EXISTS tasks (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                name TEXT NOT NULL,
                start INTEGER NOT NULL,
                duration INTEGER NOT NULL,
                color TEXT DEFAULT '#4f46e5',
                status TEXT DEFAULT 'todo'
            )
        `;
        db.exec(createTableQuery);
        
        // Add status column if it doesn't exist (migration for existing tables)
        try {
            db.exec('ALTER TABLE tasks ADD COLUMN status TEXT DEFAULT "todo"');
        } catch (e) {
            // Column already exists, ignore
        }
        console.log("Database and tasks table initialized successfully");
    } catch (error) {
        console.error("Database initialization failed:", error);
    }
}

// Get all tasks
app.get('/tasks', async (req, res) => {
    try {
        const stmt = db.prepare('SELECT * FROM tasks');
        const rows = stmt.all();
        res.json(rows);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Create task
app.post('/tasks', async (req, res) => {
    const { name, start, duration, color, status } = req.body;
    try {
        const stmt = db.prepare(
            'INSERT INTO tasks (name, start, duration, color, status) VALUES (?, ?, ?, ?, ?)'
        );
        const result = stmt.run(name, start, duration, color || '#4f46e5', status || 'todo');
        res.status(201).json({ id: result.lastInsertRowid, name, start, duration, color, status: status || 'todo' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Delete task
app.delete('/tasks/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const stmt = db.prepare('DELETE FROM tasks WHERE id = ?');
        stmt.run(id);
        res.json({ message: 'Task deleted' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Update task completely or partially (e.g. for color change)
app.put('/tasks/:id', async (req, res) => {
    const { id } = req.params;
    const { name, start, duration, color, status } = req.body;
    try {
        // Find existing task to allow partial updates
        const stmt = db.prepare('SELECT * FROM tasks WHERE id = ?');
        const rows = stmt.all(id);
        if (rows.length === 0) {
            return res.status(404).json({ error: 'Task not found' });
        }
        
        const task = rows[0];
        const newName = name !== undefined ? name : task.name;
        const newStart = start !== undefined ? start : task.start;
        const newDuration = duration !== undefined ? duration : task.duration;
        const newColor = color !== undefined ? color : task.color;
        const newStatus = status !== undefined ? status : task.status;

        const updateStmt = db.prepare(
            'UPDATE tasks SET name = ?, start = ?, duration = ?, color = ?, status = ? WHERE id = ?'
        );
        updateStmt.run(newName, newStart, newDuration, newColor, newStatus, id);
        res.json({ message: 'Task updated' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.listen(port, async () => {
    await initDB();
    console.log(`Gantt backend listening at http://localhost:${port}`);
});
