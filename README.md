# Planify-Task-File-Manager
Planify is a full-stack productivity application built around a monthly calendar view. Users can attach tasks and markdown-formatted files to any date, visualize their schedule at a glance, and manage their content with full CRUD capabilities.This repository focuses on the Spring Boot backend and PostgreSQL database layer.


# Planify — Task & File Manager

> **Beta v0.1.0** — A calendar-centric productivity app for managing tasks and markdown files, with real-time preview and upcoming collaboration features.

---

## Overview

**Planify** is a full-stack productivity application built around a monthly calendar view. Users can attach tasks and markdown-formatted files to any date, visualize their schedule at a glance, and manage their content with full CRUD capabilities.

The frontend was built with **React.js** and was fully implemented already it is included here for integration purposes and was not authored by me.. This repository focuses on the **Spring Boot** backend and **PostgreSQL** database layer.

---

## Features

### ✅ Implemented (Beta)
-  **Calendar view** — Monthly layout as the landing page
-  **Task management** — Create, read, update, and delete tasks per date
-  **File management** — Attach files to any calendar entry
-  **Markdown editor** — Live preview of markdown-formatted file content
-  **PostgreSQL database** — Persistent storage via Docker
-  **Docker Compose** — One-command local setup for Postgres + pgAdmin

### Planned (Upcoming)
-  **User accounts** — Registration, login, session management, and profile page
-  **Document sharing** — Share files and tasks between friends
-  **Encrypted messaging** — End-to-end encrypted chat between users

---

## 🛠️ Tech Stack

| Layer       | Technology              |
|-------------|-------------------------|
| Frontend    | React.js                |
| Backend     | Spring Boot (Java)      |
| Database    | PostgreSQL              |
| ORM         | Spring Data JPA         |
| Dev Tools   | Docker, Docker Compose, pgAdmin |

---

## Getting Started

### Prerequisites

Make sure you have the following installed:
- Docker
- Java
- Node.js (for the frontend)

---

### 1. Clone the repository

```bash
git clone https://github.com/samibentebbiche/Planify-Task-File-Manager.git
cd Planify-Task-File-Manager
```

---

### 2. Configure environment variables

Create an .env file Copy this example and fill in your own values:
Edit `.env` with your credentials:

```env
# pgAdmin
PGADMIN_DEFAULT_EMAIL=your_email@example.com
PGADMIN_DEFAULT_PASSWORD=your_secure_password

# PostgreSQL
POSTGRES_USER=your_db_user
POSTGRES_PASSWORD=your_secure_password

# Application
DB_USERNAME=your_db_user
DB_PASSWORD=your_secure_password
```

---

### 3. Start the database

```bash
docker-compose up -d
```

This will start:
- **PostgreSQL** on port `5432`
- **pgAdmin** on [http://localhost:5050](http://localhost:5050)

---

### 4. Run the backend

```bash
cd backend
./mvnw spring-boot:run
```

The API will be available at [http://localhost:8080](http://localhost:8080).

---

### 5. Run the frontend

```bash
cd frontend
npm install
npm run dev
```

The app will be available at [http://localhost:3000](http://localhost:3000).

---

##  API Endpoints (Backend)

Base URL: `http://localhost:8080`

> CORS is configured to allow requests from `http://localhost:3000` (React frontend).

### Challenges

| Method | Endpoint                        | Description                        |
|--------|---------------------------------|------------------------------------|
| GET    | `/challenges`                   | Get all challenges                 |
| GET    | `/challenges/{id}`              | Get a challenge by ID              |
| GET    | `/challenges/month/{month}`     | Get all challenges for a given month (integer, e.g. `3` for March) |
| GET    | `/challenges/day/{day}`         | Get all challenges for a specific date (format: `YYYY-MM-DD`) |
| POST   | `/challenges`                   | Create a new challenge             |
| PUT    | `/challenges/{id}`              | Update an existing challenge       |
| DELETE | `/challenges/{id}`              | Delete a challenge by ID           |

### Example — Create a challenge

```http
POST /challenges

{
    "eventDate":"2026-05-16",
    "title":"Read 30 pages",
    "description":"Read from the clean code book",
    "textMarkDown": "## Notes\n\nChapter 3 was great."
}
```

### Example — Get by month

```http
GET /challenges/month/7
```

### Example — Get by day

```http
GET /challenges/day/2026-05-15
```

---

## Docker Services

| Service   | URL                          | Default Credentials        |
|-----------|------------------------------|----------------------------|
| PostgreSQL| `localhost:5432`             | See your `.env` file        |
| pgAdmin   | http://localhost:5050        | See your `.env` file        |

---

## Contributing

This project is in **beta**. Contributions, issues, and feature requests are welcome!

1. Fork the project
2. Create your feature branch: `git checkout -b feature/your-feature`
3. Commit your changes: `git commit -m 'Add some feature'`
4. Push to the branch: `git push origin feature/your-feature`
5. Open a Pull Request

---

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.

---

## Author

**Sami Bentebbiche**
- GitHub: [@samibentebbiche](https://github.com/samibentebbiche)

---

>  This is a beta release. Some features are still under active development.
