# Contributing Guide

This project is split into clear module ownership so four members can work in parallel without conflict.

## Branching

- Create a branch from `main` for your own work.
- Suggested branch names:
  - `member1/resources`
  - `member2/bookings`
  - `member3/tickets`
  - `member4/auth`

## Ownership

- Member 1:
  - Backend: `backend/src/main/java/com/fms/resources`
  - Frontend: `frontend/src/pages/resources`
- Member 2:
  - Backend: `backend/src/main/java/com/fms/bookings`
  - Frontend: `frontend/src/pages/bookings`
- Member 3:
  - Backend: `backend/src/main/java/com/fms/tickets`
  - Frontend: `frontend/src/pages/tickets`
- Member 4:
  - Backend: `backend/src/main/java/com/fms/auth`
  - Backend: `backend/src/main/java/com/fms/notifications`
  - Frontend: `frontend/src/pages/auth`

## Shared Files

Only edit shared files when the whole team agrees on the change:

- `README.md`
- `CONTRIBUTING.md`
- `.gitignore`
- `backend/pom.xml`
- `backend/src/main/java/com/fms/FmsApplication.java`
- `backend/src/main/java/com/fms/config/CorsConfig.java`
- `backend/src/main/java/com/fms/config/SecurityConfig.java`
- `backend/src/main/java/com/fms/common/ApiResponse.java`
- `backend/src/main/resources/application.properties`
- `frontend/package.json`
- `frontend/vite.config.js`
- `frontend/src/App.jsx`
- `frontend/src/main.jsx`
- `frontend/src/api/axios.js`
- `frontend/src/context/AuthContext.jsx`
- `frontend/src/components/Navbar.jsx`
- `frontend/src/pages/Home.jsx`
- `frontend/src/pages/Home.css`

## Conflict Prevention

- Do not work outside your assigned module folders.
- Do not rename shared packages or shared route paths without team approval.
- Pull the latest `main` before starting new work.
- Rebase or merge often so conflicts stay small.
- Check `git status` before every push.
- Never commit `.env`, `node_modules`, `backend/target`, or `frontend/dist`.

## Merge Rules

- Open a pull request for review before merging into `main`.
- Make sure only your assigned folders changed unless you coordinated a shared edit.
- Resolve conflicts carefully and do not overwrite another member's work.
