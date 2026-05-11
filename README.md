# LiveFlag

LiveFlag is a lightweight backend feature flagging system built with TypeScript, Fastify, and PostgreSQL.

It demonstrates how modern applications can enable or disable features in real time without redeploying services.

---

# Features

* Feature flag CRUD operations
* Live feature evaluation
* Environment support (`dev`, `staging`, `prod`)
* Percentage rollout system
* Audit logging
* PostgreSQL persistence
* Fastify REST API
* TypeScript strict mode
* Dockerized PostgreSQL setup

---

# Tech Stack

| Technology     | Purpose                        |
| -------------- | ------------------------------ |
| TypeScript     | Backend language               |
| Fastify        | High-performance API framework |
| PostgreSQL     | Persistent storage             |
| Docker Compose | Local database setup           |
| Zod            | Request validation             |
| Node.js        | Runtime                        |

---

# Project Structure

```txt
src/
  plugins/
    error-handler.ts

  routes/
    flags.ts

  utils/
    rollout.ts

  db.ts
  init-db.ts
  server.ts
```

---

# Getting Started

## Prerequisites

* Node.js 24+
* Docker Desktop
* npm

---

# Installation

Clone the repository:

```bash
git clone <your-repo-url>
cd liveflag
```

Install dependencies:

```bash
npm install
```

---

# Environment Variables

Create a `.env` file:

```env
PORT=3000
DATABASE_URL=postgres://liveflag:liveflag@localhost:5432/liveflag
```

---

# Running PostgreSQL

Start PostgreSQL using Docker:

```bash
docker compose up -d
```

---

# Running the API

Start development server:

```bash
npm run dev
```

Server runs on:

```txt
http://localhost:3000
```

Expected response:

```json
{
  "status": "ok",
  "service": "liveflag"
}
```

---

# API Endpoints

## Create Feature Flag

```http
POST /flags
```

Example request:

```json
{
  "key": "new_checkout",
  "description": "Enable new checkout flow",
  "rolloutPercentage": 25
}
```

---

## Get All Flags

```http
GET /flags
```

---

## Toggle Feature Flag

```http
PATCH /flags/:key/toggle
```

Example:

```bash
curl -X PATCH http://localhost:3000/flags/new_checkout/toggle
```

---

## Evaluate Feature Flag

```http
GET /evaluate/:key
```

Example:

```bash
curl "http://localhost:3000/evaluate/new_checkout?userId=user_1"
```

Example response:

```json
{
  "key": "new_checkout",
  "enabled": true,
  "rolloutPercentage": 25,
  "userId": "user_1"
}
```

---

## Get Audit Logs

```http
GET /audit-logs
```

---

# Percentage Rollout

LiveFlag supports deterministic percentage rollouts.

Example:

* `25% rollout`
* Some users receive feature access
* Same user always receives consistent results

This is implemented using hashing-based bucket assignment.

---

# Audit Logging

Every feature toggle is recorded:

* old value
* new value
* timestamp
* action type
* changed_by

This simulates production-grade observability.

---

# Development Notes

## Why Fastify?

Fastify is:

* lightweight
* fast
* memory efficient
* excellent for 16GB development environments

---

## Why PostgreSQL?

PostgreSQL provides:

* reliable persistence
* transactional consistency
* realistic production architecture

---

# Future Improvements

* Swagger/OpenAPI docs
* Authentication
* Admin dashboard
* SDK client
* User targeting rules
* Scheduled rollouts
* WebSocket live updates

---

# Example Use Cases

* A/B testing
* Gradual rollouts
* Beta feature releases
* Kill switches
* Canary deployments
