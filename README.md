# facility-management-system

Root scaffold for a Spring Boot + MongoDB + React (Vite) facility management platform. The repository is organized so four group members can clone the same project and work only inside their assigned module folders.

## Project Overview

- `backend/` contains the Spring Boot API skeleton.
- `frontend/` contains the React + Vite client skeleton.
- Shared helpers are already in place for API responses, routing, CORS, auth context, and navigation.
- No feature implementation is included yet, so each member can build on a clean module boundary.

## Prerequisites

- Java 17
- Node 18 or newer
- MongoDB running locally

## Run Backend

```bash
cd backend
.\mvnw.cmd spring-boot:run
```

## Run Frontend

```bash
cd frontend
npm install
npm run dev
```

## Module Ownership

| Member | Folder | Responsibility |
| --- | --- | --- |
| Member 1 | `backend/src/main/java/com/fms/resources` and `frontend/src/pages/resources` | Resources module |
| Member 2 | `backend/src/main/java/com/fms/bookings` and `frontend/src/pages/bookings` | Bookings module |
| Member 3 | `backend/src/main/java/com/fms/tickets` and `frontend/src/pages/tickets` | Tickets module |
| Member 4 | `backend/src/main/java/com/fms/auth`, `backend/src/main/java/com/fms/notifications`, and `frontend/src/pages/auth` | Auth and notifications |

## Git Workflow

- Each member works only in their own assigned backend package and frontend folder.
- Shared files such as `ApiResponse`, `CorsConfig`, `SecurityConfig`, `App.jsx`, and `Navbar.jsx` should be treated as common infrastructure.
- Avoid creating controllers, services, repositories, or models outside your own module folder unless the team agrees on a shared utility.
- Do not commit `.env`, `node_modules`, `target`, or `dist`.

## GitHub Workflow

1. One person creates the GitHub repository and pushes this starter scaffold.
2. Everyone else clones the same repo from GitHub.
3. Each member creates their own branch from `main`, for example:
   - `member1/resources`
   - `member2/bookings`
   - `member3/tickets`
   - `member4/auth`
4. Each member only edits their own module folder unless the team has agreed on a shared file change.
5. Before pushing, run `git status` and make sure you are not including files from another member's module.
6. Pull the latest `main` before opening a pull request or merging.
7. Merge only after the code is reviewed by the team.

## Conflict Prevention

- Keep backend work inside the correct package:
  - Member 1: `backend/src/main/java/com/fms/resources`
  - Member 2: `backend/src/main/java/com/fms/bookings`
  - Member 3: `backend/src/main/java/com/fms/tickets`
  - Member 4: `backend/src/main/java/com/fms/auth` and `backend/src/main/java/com/fms/notifications`
- Keep frontend work inside the matching page folders:
  - Member 1: `frontend/src/pages/resources`
  - Member 2: `frontend/src/pages/bookings`
  - Member 3: `frontend/src/pages/tickets`
  - Member 4: `frontend/src/pages/auth`
- Shared files should be changed by only one person at a time.
- If two members need the same shared file, coordinate first before editing.

## Keep Same

These files and rules should stay the same for everyone unless the whole team agrees to change them:

- Root structure:
  - `backend/`
  - `frontend/`
  - `.gitignore`
  - `README.md`
  - `.env` only for local secrets, not for Git commits
- Backend shared files:
  - `backend/pom.xml`
  - `backend/src/main/java/com/fms/FmsApplication.java`
  - `backend/src/main/java/com/fms/config/CorsConfig.java`
  - `backend/src/main/java/com/fms/config/SecurityConfig.java`
  - `backend/src/main/java/com/fms/common/ApiResponse.java`
  - `backend/src/main/resources/application.properties`
- Frontend shared files:
  - `frontend/package.json`
  - `frontend/vite.config.js`
  - `frontend/src/App.jsx`
  - `frontend/src/main.jsx`
  - `frontend/src/api/axios.js`
  - `frontend/src/context/AuthContext.jsx`
  - `frontend/src/components/Navbar.jsx`
  - `frontend/src/pages/Home.jsx`
  - `frontend/src/pages/Home.css`
- Routing and API rules:
  - Backend stays under `com.fms.*`
  - Frontend API base stays `http://localhost:8080/api`
  - Frontend proxy stays pointed to `http://localhost:8080`
  - The temporary security setup stays `permitAll` until Member 4 replaces it

## Do Not Change Alone

- Do not rename shared backend packages unless the whole team agrees.
- Do not change the MongoDB database name without informing everyone.
- Do not remove the `ApiResponse` wrapper or make custom response formats in separate modules.
- Do not move shared frontend routing files unless the whole group updates imports together.
- Do not edit `.env` and commit it to GitHub.
- Do not overwrite another member's folder when merging.

## MongoDB

- Local backend database name: `facility_management_db`
- The root `.env` file also includes the provided Atlas connection string for `smartcampus`

### MongoDB Compass

1. Open MongoDB Compass.
2. Paste the connection string you want to use:
   - Local: `mongodb://localhost:27017/facility_management_db`
   - Atlas: use the `MONGODB_URI` value from `.env`
3. Connect and verify the database name:
   - Local database: `facility_management_db`
   - Atlas database: `smartcampus`

## Notes

- Backend security is temporarily open for development.
- Member 4 will later replace the temporary security setup with OAuth2 and role-based access.
- The backend uses a local Maven wrapper-style setup in `backend/.mvn`, `backend/mvnw`, and `backend/mvnw.cmd`.
