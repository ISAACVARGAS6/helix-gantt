# Helix Gantt Project

A dynamic Gantt chart application for planning tasks by week in 2026.

## Features

- Interactive Gantt chart with weekly timeline
- Task management (create, update, delete)
- Multiple themes (light, dark, sepia, high contrast)
- Multiple views (cards, table, kanban)
- Color customization for tasks
- Status tracking (todo, in progress, done)

## Tech Stack

- **Backend**: Node.js + Express + SQLite
- **Frontend**: Vanilla HTML/CSS/JavaScript
- **Database**: SQLite (local file)

## Local Development

### Prerequisites

- Node.js (v18 or later)
- Python 3 (for serving frontend)

### Setup

1. **Clone the repository**:
   ```bash
   git clone <your-repo-url>
   cd helix
   ```

2. **Backend Setup**:
   ```bash
   cd backend
   cp ../.env.example ../.env  # Copy environment variables
   npm install
   npm start
   ```
   The backend will run on http://localhost:3000

3. **Frontend Setup**:
   ```bash
   cd frontend
   python3 -m http.server 8080
   ```
   The frontend will be available at http://localhost:8080

4. Open your browser and go to http://localhost:8080

### API Endpoints

- `GET /tasks` - Get all tasks
- `POST /tasks` - Create a new task
- `PUT /tasks/:id` - Update a task
- `DELETE /tasks/:id` - Delete a task

## Docker (Alternative)

If you prefer Docker:

1. Ensure Docker and Docker Compose are installed
2. Run `docker-compose up` (if docker-compose.yml is added)

## Project Structure

```
helix/
├── backend/
│   ├── server.js
│   ├── package.json
│   └── gantt.db (created automatically)
├── frontend/
│   ├── index.html
│   └── nginx.conf
└── README.md
```