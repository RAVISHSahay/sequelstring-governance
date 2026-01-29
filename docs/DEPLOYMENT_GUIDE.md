# 🚀 Deployment Guide
## SequelString CRM - Complete Deployment Documentation

---

## Table of Contents

1. [Prerequisites](#prerequisites)
2. [Environment Setup](#environment-setup)
3. [Local Development](#local-development)
4. [Docker Deployment](#docker-deployment)
5. [Kubernetes Deployment](#kubernetes-deployment)
6. [CI/CD Pipeline](#cicd-pipeline)
7. [Database Setup](#database-setup)
8. [Monitoring & Logging](#monitoring--logging)
9. [Troubleshooting](#troubleshooting)

---

## Prerequisites

### Required Software

| Software | Version | Purpose |
|----------|---------|---------|
| Node.js | 20.x LTS | Runtime |
| npm | 10.x | Package manager |
| Docker | 24.x+ | Containerization |
| Docker Compose | 2.20+ | Local orchestration |
| kubectl | 1.28+ | Kubernetes CLI |
| Helm | 3.x | K8s package manager |
| Git | 2.x | Version control |

### Cloud Accounts

- **AWS Account** - For S3 (recordings), SES (backup email)
- **MongoDB Atlas** - Production database (or self-hosted)
- **Redis Cloud** - Production cache (or self-hosted)
- **SendGrid** - Email delivery
- **OpenAI** - GPT-4 API access
- **Twilio** - CTI integration

---

## Environment Setup

### 1. Clone Repository

```bash
git clone https://github.com/sequelstring/crm.git
cd crm
```

### 2. Create Environment Files

```bash
# Copy example environment files
cp .env.example .env
cp server/.env.example server/.env
```

### 3. Configure Environment Variables

Edit `.env` with your values:

```env
# ============================================================
# APPLICATION
# ============================================================
NODE_ENV=development
PORT=4000
APP_URL=http://localhost:3000
API_URL=http://localhost:4000

# ============================================================
# DATABASE
# ============================================================
MONGODB_URI=mongodb://localhost:27017/sequelstring
REDIS_URL=redis://localhost:6379
ELASTICSEARCH_URL=http://localhost:9200

# ============================================================
# AUTHENTICATION
# ============================================================
JWT_SECRET=your-super-secret-jwt-key-min-32-chars
JWT_EXPIRES_IN=1d
REFRESH_TOKEN_EXPIRES_IN=7d
ENCRYPTION_KEY=your-32-character-encryption-key

# ============================================================
# EMAIL (SendGrid)
# ============================================================
SENDGRID_API_KEY=SG.xxxxxxxxxxxxxxxxxxxx
SENDER_EMAIL=noreply@sequelstring.com
SENDER_NAME=SequelString CRM

# ============================================================
# AI (OpenAI)
# ============================================================
OPENAI_API_KEY=sk-xxxxxxxxxxxxxxxxxxxx
OPENAI_MODEL=gpt-4-turbo

# ============================================================
# CTI (Twilio)
# ============================================================
TWILIO_ACCOUNT_SID=ACxxxxxxxxxxxxxxxxxxxx
TWILIO_AUTH_TOKEN=xxxxxxxxxxxxxxxxxxxx
TWILIO_PHONE_NUMBER=+15551234567

# ============================================================
# SOCIAL OAUTH
# ============================================================
LINKEDIN_CLIENT_ID=xxxxxxxxxxxx
LINKEDIN_CLIENT_SECRET=xxxxxxxxxxxxxxxxxxxx
LINKEDIN_REDIRECT_URI=http://localhost:4000/api/v1/contacts/oauth/linkedin/callback

TWITTER_CLIENT_ID=xxxxxxxxxxxx
TWITTER_CLIENT_SECRET=xxxxxxxxxxxxxxxxxxxx
TWITTER_REDIRECT_URI=http://localhost:4000/api/v1/contacts/oauth/twitter/callback

# ============================================================
# AWS S3
# ============================================================
AWS_ACCESS_KEY_ID=AKIAXXXXXXXXXXXX
AWS_SECRET_ACCESS_KEY=xxxxxxxxxxxxxxxxxxxx
AWS_REGION=us-east-1
AWS_S3_BUCKET=sequelstring-recordings

# ============================================================
# NEWS API (Intelligence)
# ============================================================
NEWSAPI_KEY=xxxxxxxxxxxxxxxxxxxx
```

---

## Local Development

### Quick Start

```bash
# Install dependencies
npm install
cd server && npm install && cd ..

# Start all services with Docker
docker-compose up -d mongo redis elasticsearch

# Start development servers
npm run dev
```

### Available Scripts

```bash
# Frontend only
npm run dev:client

# Backend only
npm run dev:server

# Both (concurrently)
npm run dev

# Run tests
npm test

# Build for production
npm run build

# Lint code
npm run lint

# Type check
npm run type-check
```

### Access Points

| Service | URL |
|---------|-----|
| Frontend | http://localhost:3000 |
| API | http://localhost:4000 |
| API Docs | http://localhost:4000/api/docs |
| Bull Board | http://localhost:3030 |
| Mongo Express | http://localhost:8081 |

---

## Docker Deployment

### Build Images

```bash
# Build all images
docker-compose build

# Build specific service
docker-compose build api
docker-compose build frontend
```

### Start Services

```bash
# Start all services (detached)
docker-compose up -d

# View logs
docker-compose logs -f

# View specific service logs
docker-compose logs -f api

# Check status
docker-compose ps
```

### Scale Services

```bash
# Scale API to 3 replicas
docker-compose up -d --scale api=3

# Scale workers
docker-compose up -d --scale worker=5
```

### Stop Services

```bash
# Stop all services
docker-compose down

# Stop and remove volumes (CAUTION: Deletes data)
docker-compose down -v
```

---

## Kubernetes Deployment

### 1. Cluster Setup

```bash
# Connect to your cluster
kubectl config use-context production-cluster

# Verify connection
kubectl cluster-info
```

### 2. Create Namespace

```bash
kubectl apply -f infrastructure/k8s/namespace.yaml
```

### 3. Create Secrets

```bash
# Create secrets from literal values
kubectl create secret generic sequelstring-secrets \
  --from-literal=mongodb-uri='mongodb+srv://user:pass@cluster.mongodb.net/sequelstring' \
  --from-literal=redis-url='redis://user:pass@redis-cluster:6379' \
  --from-literal=jwt-secret='your-super-secret-jwt-key' \
  --from-literal=openai-api-key='sk-xxxx' \
  --from-literal=sendgrid-api-key='SG.xxxx' \
  --from-literal=encryption-key='your-32-char-key' \
  -n sequelstring

# Create Docker registry secret
kubectl create secret docker-registry regcred \
  --docker-server=ghcr.io \
  --docker-username=YOUR_USERNAME \
  --docker-password=YOUR_PAT \
  -n sequelstring
```

### 4. Deploy Services

```bash
# Apply all configurations
kubectl apply -f infrastructure/k8s/

# Or apply individually
kubectl apply -f infrastructure/k8s/api-deployment.yaml
kubectl apply -f infrastructure/k8s/worker-deployment.yaml
kubectl apply -f infrastructure/k8s/frontend-deployment.yaml
kubectl apply -f infrastructure/k8s/ingress.yaml
```

### 5. Verify Deployment

```bash
# Check pods
kubectl get pods -n sequelstring

# Check services
kubectl get svc -n sequelstring

# Check ingress
kubectl get ingress -n sequelstring

# View pod logs
kubectl logs -f deployment/api -n sequelstring

# Describe pod for debugging
kubectl describe pod <pod-name> -n sequelstring
```

### 6. Scaling

```bash
# Manual scaling
kubectl scale deployment api --replicas=5 -n sequelstring

# Check HPA status
kubectl get hpa -n sequelstring

# Watch scaling events
kubectl get events -n sequelstring --watch
```

### 7. Updates & Rollbacks

```bash
# Update image
kubectl set image deployment/api api=sequelstring/api:v1.2.0 -n sequelstring

# Check rollout status
kubectl rollout status deployment/api -n sequelstring

# Rollback if needed
kubectl rollout undo deployment/api -n sequelstring

# View rollout history
kubectl rollout history deployment/api -n sequelstring
```

---

## CI/CD Pipeline

### GitHub Actions Workflow

Create `.github/workflows/deploy.yml`:

```yaml
name: Deploy

on:
  push:
    branches: [main]
  pull_request:
    branches: [main]

env:
  REGISTRY: ghcr.io
  IMAGE_NAME: ${{ github.repository }}

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      
      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'npm'
      
      - name: Install dependencies
        run: npm ci
      
      - name: Run tests
        run: npm test
      
      - name: Run linting
        run: npm run lint

  build-and-push:
    needs: test
    runs-on: ubuntu-latest
    if: github.event_name == 'push'
    permissions:
      contents: read
      packages: write
    
    steps:
      - uses: actions/checkout@v4
      
      - name: Login to Container Registry
        uses: docker/login-action@v3
        with:
          registry: ${{ env.REGISTRY }}
          username: ${{ github.actor }}
          password: ${{ secrets.GITHUB_TOKEN }}
      
      - name: Build and push API
        uses: docker/build-push-action@v5
        with:
          context: ./server
          push: true
          tags: ${{ env.REGISTRY }}/${{ env.IMAGE_NAME }}/api:${{ github.sha }}
      
      - name: Build and push Frontend
        uses: docker/build-push-action@v5
        with:
          context: .
          file: ./Dockerfile.frontend
          push: true
          tags: ${{ env.REGISTRY }}/${{ env.IMAGE_NAME }}/frontend:${{ github.sha }}

  deploy:
    needs: build-and-push
    runs-on: ubuntu-latest
    if: github.ref == 'refs/heads/main'
    
    steps:
      - uses: actions/checkout@v4
      
      - name: Configure kubectl
        uses: azure/k8s-set-context@v3
        with:
          kubeconfig: ${{ secrets.KUBE_CONFIG }}
      
      - name: Deploy to Kubernetes
        run: |
          kubectl set image deployment/api api=${{ env.REGISTRY }}/${{ env.IMAGE_NAME }}/api:${{ github.sha }} -n sequelstring
          kubectl set image deployment/frontend frontend=${{ env.REGISTRY }}/${{ env.IMAGE_NAME }}/frontend:${{ github.sha }} -n sequelstring
          kubectl rollout status deployment/api -n sequelstring
          kubectl rollout status deployment/frontend -n sequelstring
```

---

## Database Setup

### MongoDB Indexes

Run after initial deployment:

```bash
# Connect to MongoDB
mongosh "mongodb://localhost:27017/sequelstring"

# Create indexes
db.contacts.createIndex({ email: 1 }, { unique: true });
db.contacts.createIndex({ accountId: 1 });
db.contacts.createIndex({ ownerId: 1 });
db.contacts.createIndex({ "importantDates.nextSendAt": 1 });
db.contacts.createIndex({ "socialProfiles.platform": 1 });
db.contacts.createIndex({ tags: 1 });

db.calls.createIndex({ contactId: 1 });
db.calls.createIndex({ userId: 1, status: 1 });
db.calls.createIndex({ startedAt: -1 });
db.calls.createIndex({ "transcript.status": 1 });
db.calls.createIndex({ "aiSummary.status": 1 });

db.news_alerts.createIndex({ accountId: 1, publishedAt: -1 });
db.news_alerts.createIndex({ category: 1 });
db.news_alerts.createIndex({ expiresAt: 1 }, { expireAfterSeconds: 0 });
```

### Seed Data (Development)

```bash
# Run seed script
npm run seed

# Or manually
node server/scripts/seed.js
```

---

## Monitoring & Logging

### Prometheus Metrics

Add to `server/src/index.ts`:

```typescript
import promClient from 'prom-client';

// Enable default metrics
promClient.collectDefaultMetrics();

// Custom metrics
const httpRequestDuration = new promClient.Histogram({
  name: 'http_request_duration_seconds',
  help: 'Duration of HTTP requests in seconds',
  labelNames: ['method', 'route', 'status'],
  buckets: [0.1, 0.3, 0.5, 0.7, 1, 3, 5, 7, 10]
});

// Metrics endpoint
app.get('/metrics', async (req, res) => {
  res.set('Content-Type', promClient.register.contentType);
  res.end(await promClient.register.metrics());
});
```

### Grafana Dashboards

Import dashboard IDs:
- **Node.js Application**: 11159
- **MongoDB**: 2583
- **Redis**: 763
- **Kubernetes**: 315

### Log Aggregation

```bash
# Install Loki + Promtail
helm repo add grafana https://grafana.github.io/helm-charts
helm install loki grafana/loki-stack -n monitoring
```

---

## Troubleshooting

### Common Issues

#### API Not Starting

```bash
# Check logs
docker-compose logs api

# Common causes:
# 1. MongoDB not ready - wait for health check
# 2. Missing environment variables
# 3. Port already in use
```

#### Database Connection Failed

```bash
# Test MongoDB connection
mongosh "mongodb://localhost:27017/sequelstring"

# Check if MongoDB is running
docker-compose ps mongo
```

#### Worker Not Processing Jobs

```bash
# Check Redis connection
redis-cli ping

# Check queue status
docker-compose logs worker

# View Bull Board for queue details
open http://localhost:3030
```

#### Kubernetes Pods Crashing

```bash
# Check pod status
kubectl get pods -n sequelstring

# View logs
kubectl logs <pod-name> -n sequelstring

# Check events
kubectl describe pod <pod-name> -n sequelstring
```

### Health Checks

```bash
# API health
curl http://localhost:4000/api/v1/health

# MongoDB
mongosh --eval "db.adminCommand('ping')"

# Redis
redis-cli ping

# Elasticsearch
curl http://localhost:9200/_cluster/health
```

### Performance Tuning

```bash
# Increase Node.js memory
NODE_OPTIONS="--max-old-space-size=4096" npm start

# MongoDB connection pool
MONGODB_OPTIONS="?maxPoolSize=50&minPoolSize=10"

# Redis connection pool
REDIS_MAX_CONNECTIONS=100
```

---

## Quick Reference

### Commands Cheatsheet

```bash
# Development
npm run dev                     # Start dev environment
npm run build                   # Build for production
npm test                        # Run tests

# Docker
docker-compose up -d            # Start all services
docker-compose down             # Stop all services
docker-compose logs -f api      # View API logs
docker-compose exec api sh      # Shell into container

# Kubernetes
kubectl get pods -n sequelstring
kubectl logs -f deployment/api -n sequelstring
kubectl scale deployment api --replicas=5 -n sequelstring
kubectl rollout restart deployment/api -n sequelstring
```

### Support

- **Documentation**: https://docs.sequelstring.com
- **Issues**: https://github.com/sequelstring/crm/issues
- **Email**: support@sequelstring.com

---

*Last Updated: January 29, 2026*
