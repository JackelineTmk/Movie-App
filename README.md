# Movie App

This project consists of a movie search and rating application powered by the TMDB public API.

## 🛠️ Tech Stack
- **Frontend:** React with TypeScript (Vite) 
- **Backend:** Python with Flask 
- **Database:** SQLite (Local)
- **Infrastructure:** Docker and Docker Compose 

## ✨ Features
- Movie search using the TMDB public API.
- Detailed movie information.
- Local rating system (1 to 5 stars) with SQLite.
- Full application Dockerization.

## 🚀 How to Run (Single Command)

Thanks to Docker Compose, the application can be launched with a single command, running both the Frontend and Backend simultaneously.

### Prerequisites
- Docker and Docker Compose installed.
- A valid TMDB API Key.

### ⚠️ Important Note on Permissions
Depending on your Operating System, you might need **administrator privileges** (root access) to run Docker commands:
- **Linux (e.g., Ubuntu):** For most Linux distros you can simply prefix the command with `sudo` (e.g., `sudo docker-compose up --build`).


### Step-by-Step

1. Inside the `frontend/` folder, create a `.env.local` file and add your TMDB token:
   ```env
   VITE_TMDB_TOKEN=your_api_read_access_token_here

2. From the project root, run the following command:
   ```env
   docker-compose up --build

3. Access the application in your browser:

   ```env
   http://localhost:5173
   ```

Thank you!
