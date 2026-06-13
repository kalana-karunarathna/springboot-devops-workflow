# Smart Campus Facility Management System

A full-stack facility management platform built with Spring Boot, MongoDB, React, and Vite. The repository also contains a DevOps workflow for local containers, Jenkins CI/CD, Docker image publishing to AWS ECR, Kubernetes deployment, Argo CD GitOps sync, and Prometheus-compatible monitoring.

## Project Overview

- `backend/` contains the Spring Boot API for resources, bookings, tickets, comments, authentication, and notifications.
- `frontend/` contains the React + Vite client for the facility management dashboard.
- `docker-compose.yml` runs MongoDB, the backend, and the frontend together for local container testing.
- `Jenkinsfile` defines the CI/CD workflow for tests, builds, SonarQube analysis, Docker builds, and AWS ECR pushes.
- `k8s/` contains Kubernetes manifests for MongoDB, backend, frontend, services, ingress, config, storage, and monitoring.
- `argocd-app.yaml` defines the Argo CD application that continuously syncs the `k8s/` folder.
- `kind-config.yaml` defines a local Kind cluster with useful NodePort mappings.

## Technology Stack

| Layer | Technology |
| --- | --- |
| Frontend | React 18, Vite, Axios, React Router, Vitest |
| Backend | Java 17, Spring Boot 3.3, Spring Web, Spring Security, OAuth2 Client, Spring Data MongoDB |
| Database | MongoDB 7 |
| Build tools | Maven, npm |
| Containers | Docker, Docker Compose, Nginx |
| CI/CD | Jenkins, SonarQube, AWS CLI, AWS ECR |
| Deployment | Kubernetes, Kind, Argo CD |
| Monitoring | Spring Boot Actuator, Micrometer Prometheus, ServiceMonitor |

## Repository Structure

```text
.
|-- backend/                 # Spring Boot API
|-- frontend/                # React + Vite client
|-- k8s/                     # Kubernetes manifests
|-- Jenkinsfile              # Jenkins CI/CD pipeline
|-- docker-compose.yml       # Local container workflow
|-- argocd-app.yaml          # Argo CD application definition
|-- kind-config.yaml         # Local Kind cluster config
`-- README.md
```

## Prerequisites

Install these tools before running the project locally:

- Java 17
- Maven 3.9+ or the Maven wrapper in `backend/`
- Node.js 18+ and npm
- Docker and Docker Compose
- MongoDB, if running the backend outside Docker
- kubectl, Kind, and Argo CD CLI for Kubernetes/GitOps work
- Jenkins, SonarQube, AWS CLI, and AWS credentials for the CI/CD workflow

## Environment Variables

Copy the example environment file and fill in local values when needed:

```bash
cp .env.example .env
```

Common variables:

| Variable | Purpose | Local default |
| --- | --- | --- |
| `SERVER_PORT` | Backend port | `8080` |
| `MONGODB_URI` | MongoDB connection string | `mongodb://localhost:27017/smartcampus` |
| `FRONTEND_URL` | Frontend URL used by backend redirects/CORS | `http://localhost:5173` |
| `GOOGLE_CLIENT_ID` | Google OAuth client ID | `local-google-client-id` |
| `GOOGLE_CLIENT_SECRET` | Google OAuth client secret | `local-google-client-secret` |
| `VITE_API_BASE_URL` | Frontend API base URL | `http://localhost:8080/api` |

Do not commit real `.env` values or credentials.

## Run Locally

Start MongoDB locally first, then run the backend and frontend in separate terminals.

### Backend

```bash
cd backend
./mvnw spring-boot:run
```

On Windows:

```powershell
cd backend
.\mvnw.cmd spring-boot:run
```

Backend API runs at:

```text
http://localhost:8080
```

### Frontend

```bash
cd frontend
npm install
npm run dev
```

Frontend runs at:

```text
http://localhost:5173
```

## Run With Docker Compose

Use Docker Compose when you want the full stack, including MongoDB, to run the same way on every machine.

```bash
docker compose up --build
```

Services:

| Service | URL |
| --- | --- |
| Frontend | `http://localhost:3000` |
| Backend | `http://localhost:8080` |
| MongoDB | `mongodb://localhost:27017` |

Stop the stack:

```bash
docker compose down
```

Remove local volumes as well:

```bash
docker compose down -v
```

## Tests And Builds

Run backend tests:

```bash
cd backend
mvn test
```

Run backend verification:

```bash
cd backend
mvn verify
```

Run frontend tests:

```bash
cd frontend
npm run test
```

Build frontend production files:

```bash
cd frontend
npm run build
```

Build Docker images locally:

```bash
docker compose build
```

## API And App Routes

Main frontend routes:

| Route | Page |
| --- | --- |
| `/` | Home |
| `/resources` | Resource catalogue |
| `/admin` | Resource admin dashboard |
| `/bookings` | Booking page |
| `/bookings/admin` | Booking admin page |
| `/tickets` | Ticket page |
| `/tickets/create` | Create ticket |
| `/tickets/admin` | Ticket admin |
| `/tickets/technician` | Technician panel |
| `/notifications` | Notifications |
| `/login` | Login |

Backend modules are organized under:

- `com.fms.resources`
- `com.fms.bookings`
- `com.fms.tickets`
- `com.fms.auth`
- `com.fms.notifications`
- `com.fms.common`
- `com.fms.config`

## DevOps Workflow

This repository supports a complete development-to-deployment workflow:

1. Developers push code to GitHub.
2. Jenkins checks out the repository.
3. Jenkins verifies tool versions for Java, Maven, Node, npm, Docker, Docker Compose, and AWS CLI.
4. Backend unit tests run with `mvn test`.
5. Backend integration/verification tests run with `mvn verify`.
6. Frontend dependencies install with `npm ci` or `npm install`.
7. Frontend tests run with `npm run test`.
8. Frontend production build runs with `npm run build`.
9. SonarQube scans the backend project.
10. Jenkins waits for the SonarQube quality gate.
11. Docker Compose builds and starts the local stack as a smoke test.
12. Jenkins logs in to AWS ECR.
13. Backend and frontend Docker images are built, tagged as `build-${BUILD_NUMBER}`, and pushed to ECR.
14. Jenkins sends success or failure email notifications.
15. Kubernetes manifests in `k8s/` deploy the app.
16. Argo CD continuously syncs the Kubernetes state from Git.
17. Prometheus can scrape backend metrics from `/actuator/prometheus`.

## Jenkins CI/CD Pipeline

The `Jenkinsfile` uses these important environment values:

| Name | Purpose |
| --- | --- |
| `SONARQUBE_SERVER` | Jenkins SonarQube server name |
| `BACKEND_DIR` | Backend folder path |
| `FRONTEND_DIR` | Frontend folder path |
| `AWS_REGION` | AWS region for ECR |
| `AWS_ACCOUNT_ID` | AWS account ID |
| `ECR_BACKEND_REPO` | Backend ECR repository URI |
| `ECR_FRONTEND_REPO` | Frontend ECR repository URI |
| `IMAGE_TAG` | Build-specific Docker image tag |
| `MAIL_TO` | Pipeline notification email |

Required Jenkins configuration:

- Jenkins agent with Java 17, Maven, Node.js, npm, Docker, Docker Compose, and AWS CLI.
- Jenkins SonarQube server named `SonarQube`.
- Jenkins credentials:
  - `aws-access-key-id`
  - `aws-secret-access-key`
- Jenkins Email Extension plugin configured for `emailext`.
- Docker permission for the Jenkins user.

Current ECR image repositories used by the pipeline:

```text
016170083143.dkr.ecr.us-east-1.amazonaws.com/fma-backend
016170083143.dkr.ecr.us-east-1.amazonaws.com/fma-frontend
```

After Jenkins pushes new images, update the image tags in:

- `k8s/backend-deployment.yaml`
- `k8s/frontend-deployment.yaml`

Then commit and push the manifest change so Argo CD can sync the new version.

## Kubernetes Deployment

The Kubernetes manifests deploy into the `fma` namespace.

Main resources:

| File | Purpose |
| --- | --- |
| `k8s/namespace.yaml` | Creates the `fma` namespace |
| `k8s/mongo-pvc.yaml` | Persistent storage for MongoDB |
| `k8s/mongo-deployment.yaml` | MongoDB deployment |
| `k8s/mongo-service.yaml` | MongoDB service |
| `k8s/backend-configmap.yaml` | Backend runtime configuration |
| `k8s/backend-deployment.yaml` | Backend deployment from ECR |
| `k8s/backend-service.yaml` | Backend ClusterIP service |
| `k8s/frontend-deployment.yaml` | Frontend deployment from ECR |
| `k8s/frontend-service.yaml` | Frontend NodePort service |
| `k8s/fma-ingress.yaml` | Ingress routes for frontend and backend |
| `k8s/backend-servicemonitor.yaml` | Prometheus Operator ServiceMonitor |

Apply manifests manually:

```bash
kubectl apply -f k8s/
```

Check workloads:

```bash
kubectl get all -n fma
```

View backend logs:

```bash
kubectl logs -n fma deployment/backend
```

View frontend logs:

```bash
kubectl logs -n fma deployment/frontend
```

## Local Kubernetes With Kind

Create the local cluster:

```bash
kind create cluster --config kind-config.yaml
```

Deploy the app:

```bash
kubectl apply -f k8s/
```

Open the frontend NodePort:

```text
http://localhost:30080
```

The Kind config also maps common local ports for Grafana, Prometheus, and Argo CD:

| Tool | Local URL |
| --- | --- |
| Frontend | `http://localhost:30080` |
| Grafana | `http://localhost:30180` |
| Prometheus | `http://localhost:30190` |
| Argo CD HTTPS | `https://localhost:8082` |

## Argo CD GitOps

The Argo CD application in `argocd-app.yaml` watches:

```text
https://github.com/kalana-karunarathna/springboot-devops-workflow.git
```

It syncs the `k8s/` folder from the `main` branch into the `fma` namespace.

Apply the Argo CD application:

```bash
kubectl apply -f argocd-app.yaml
```

Check the app:

```bash
argocd app get fma-app
```

Sync manually if needed:

```bash
argocd app sync fma-app
```

Automated sync is enabled with prune and self-heal:

- `prune: true` removes Kubernetes resources that were deleted from Git.
- `selfHeal: true` reverts manual cluster drift back to the Git state.

## Monitoring

The backend exposes Spring Boot Actuator and Prometheus metrics.

Useful endpoints:

```text
http://localhost:8080/actuator/health
http://localhost:8080/actuator/prometheus
```

In Kubernetes, `k8s/backend-servicemonitor.yaml` allows Prometheus Operator to scrape:

```text
/actuator/prometheus
```

The ServiceMonitor expects a Prometheus Operator release label:

```yaml
release: monitoring
```

If your Prometheus Helm release uses another label, update the ServiceMonitor labels to match it.

Shared files such as `ApiResponse`, `CorsConfig`, `SecurityConfig`, `App.jsx`, `Navbar.jsx`, Docker files, Kubernetes files, and the Jenkins pipeline should be changed carefully and reviewed by the team.

## Git Workflow

1. Create a branch from `main`.
2. Keep feature work inside the matching backend package and frontend page folder when possible.
3. Pull the latest `main` before opening a pull request.
4. Run backend and frontend tests before pushing.
5. Confirm `git status` does not include unrelated files.
6. Open a pull request for review.
7. Merge only after the team reviews the change.


## Conflict Prevention

- Do not rename shared backend packages unless the whole team agrees.
- Do not change the MongoDB database name without informing everyone.
- Do not remove the shared `ApiResponse` format unless all modules are updated.
- Do not move shared frontend routing files unless imports are updated together.
- Do not commit `.env`, `node_modules`, `target`, `dist`, or local IDE files.
- Do not overwrite another member's folder when merging.
- Coordinate before changing `Jenkinsfile`, `docker-compose.yml`, `argocd-app.yaml`, or files in `k8s/`.

## Troubleshooting

If the frontend cannot reach the backend:

- Check `VITE_API_BASE_URL`.
- Confirm the backend is running on port `8080`.
- Confirm CORS allows the frontend origin.

If Docker Compose backend cannot reach MongoDB:

- Confirm the `mongo` service is healthy.
- Check `MONGODB_URI=mongodb://mongo:27017/smartcampus` inside Compose.

If Kubernetes pods cannot pull ECR images:

- Confirm the image tag exists in ECR.
- Confirm the `ecr-secret` image pull secret exists in the `fma` namespace.
- Confirm the deployment image URI and AWS region are correct.

If Argo CD does not update the app:

- Confirm `argocd-app.yaml` points to the correct repository and branch.
- Confirm the image tag change was committed to Git.
- Check `argocd app get fma-app`.

If Prometheus does not scrape metrics:

- Confirm `/actuator/prometheus` works from the backend service.
- Confirm the ServiceMonitor label matches the Prometheus Operator release.
- Confirm the backend service port is named `http`.

## Useful Commands

```bash
# Backend
cd backend && mvn test
cd backend && mvn verify
cd backend && ./mvnw spring-boot:run

# Frontend
cd frontend && npm install
cd frontend && npm run test
cd frontend && npm run build
cd frontend && npm run dev

# Docker
docker compose build
docker compose up -d
docker compose ps
docker compose logs -f backend
docker compose down

# Kubernetes
kubectl apply -f k8s/
kubectl get pods -n fma
kubectl get svc -n fma
kubectl logs -n fma deployment/backend

# Argo CD
kubectl apply -f argocd-app.yaml
argocd app get fma-app
argocd app sync fma-app
```
