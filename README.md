# Trading Bot

A modern, full-stack trading automation platform that allows users to create, manage, and execute automated trading workflows with visual node-based configuration.

## Overview

Trading Bot is a sophisticated trading automation system built with a monorepo architecture using **Turbo**. It enables traders to design complex trading strategies through an intuitive visual interface and execute them automatically based on configurable triggers.

### Key Features

- **Visual Workflow Builder**: Create trading strategies using a drag-and-drop node-based interface
- **Multiple Triggers**: Support for price-based triggers, time-based triggers, and more
- **Trading Actions**: Execute trades on multiple platforms (HyperLiquid, Lighter, and more)
- **Execution History**: Track all workflow executions with detailed status and results
- **User Authentication**: Secure user accounts with JWT-based authentication
- **Real-time Monitoring**: Monitor active workflows and their execution status

## Project Structure

This is a **Monorepo** project managed with **Turbo** and **Bun**, containing:

### Apps

- **Frontend** (`apps/frontend/`) - Vue 3 + Vite + TypeScript
  - Interactive UI for workflow creation and management
  - Real-time dashboard for monitoring executions
  - Authentication and user management interface

- **Backend** (`apps/backend/`) - Express + MongoDB + TypeScript
  - REST API for workflow management and execution
  - User authentication and authorization
  - Database models for users, workflows, nodes, edges, and executions

- **Executor** (`apps/executor/`) - Node.js + TypeScript
  - Background service that processes and executes workflows
  - Monitors triggers (timers, price events, etc.)
  - Handles transaction execution on trading platforms

### Packages

- **Common** (`packages/common/`) - Shared types and metadata
  - Zod schemas for data validation
  - Shared TypeScript types across all apps

- **DB** (`packages/db/`) - Database client and models
  - MongoDB models and connections
  - Data access layer for all applications

- **ESLint Config** (`packages/eslint-config/`) - Shared linting configuration

- **TypeScript Config** (`packages/typescript-config/`) - Shared TypeScript configuration

## Tech Stack

- **Runtime**: [Bun](https://bun.com) (v1.3.6+)
- **Package Manager**: Bun
- **Build Tool**: Turbo (monorepo orchestration)
- **Frontend**: Vue 3 + Vite + TypeScript
- **Backend**: Express.js + MongoDB + Mongoose
- **Database**: MongoDB
- **Authentication**: JWT
- **Styling**: Tailwind CSS (via UI components)
- **Language**: TypeScript

## Prerequisites

- **Bun** v1.3.6 or higher - [Install Bun](https://bun.sh)
- **MongoDB** running locally or remote connection string
- **Node.js** (optional, but recommended for some tools)

## Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd trading-bot
   ```

2. **Install dependencies**
   ```bash
   bun install
   ```

3. **Environment Setup**
   Create `.env` files in the root and respective app directories with required variables:

   **Root `.env`:**
   ```
   MONGO_URL=mongodb://localhost:27017/trading-bot
   JWT_SECRET=your-secret-key
   WEB_URL=http://localhost:5173
   ```

   **Backend `.env`:**
   ```
   MONGO_URL=mongodb://localhost:27017/trading-bot
   JWT_SECRET=your-secret-key
   WEB_URL=http://localhost:5173
   ```

   **Frontend `.env`:**
   ```
   VITE_API_URL=http://localhost:3000
   ```

## Development

### Start all services in development mode

```bash
bun run dev
```

This will start:
- Frontend on `http://localhost:5173`
- Backend on `http://localhost:3000`
- Executor service in the background

### Individual service commands

**Frontend:**
```bash
cd apps/frontend
bun dev
```

**Backend:**
```bash
cd apps/backend
bun run index.ts
```

**Executor:**
```bash
cd apps/executor
bun run index.ts
```

## Building

Build all apps and packages:

```bash
bun run build
```

This generates optimized production builds in the `dist/` directories of each app.

## Linting & Code Quality

Run linting across the monorepo:

```bash
bun run lint
```

Format code with Prettier:

```bash
bun run format
```

## API Endpoints

### Authentication
- `POST /signup` - Create a new user account
- `POST /signin` - Sign in to existing account

### Workflows
- `GET /workflows` - List user's workflows
- `POST /workflows` - Create a new workflow
- `GET /workflows/:id` - Get workflow details
- `PUT /workflows/:id` - Update workflow
- `DELETE /workflows/:id` - Delete workflow

### Executions
- `GET /executions` - List workflow executions
- `GET /executions/:id` - Get execution details

## Workflow Components

### Triggers
- **Timer** - Execute at fixed intervals
- **Price Trigger** - Execute when price meets conditions

### Actions
- **HyperLiquid** - Execute trades on HyperLiquid DEX
- **Lighter** - Execute trades on Lighter protocol (using Lighter SDK)
- **Backpack** - Manage Backpack wallet interactions

## Project Scripts

| Script | Description |
|--------|-------------|
| `bun run dev` | Start all services in development mode |
| `bun run build` | Build all apps and packages |
| `bun run lint` | Run ESLint across the monorepo |
| `bun run format` | Format code with Prettier |

## SDK & Integration References

For implementing live trading capabilities, you can reference the following external SDKs:

- **Lighter SDK** - TypeScript SDK for Lighter protocol trading
  - Reference: [hkirat/ai-trading-agent](https://github.com/hkirat/ai-trading-agent) (lighter-sdk-ts directory)
  - Supports market orders, limit orders, and position management
  - Live trading on Lighter DEX

## Troubleshooting

**MongoDB Connection Error**
- Ensure MongoDB is running: `mongod`
- Check `MONGO_URL` environment variable is correct

**Port Already in Use**
- Frontend default: 5173, Backend default: 3000
- Modify `vite.config.ts` for frontend or port binding in backend

**Bun Installation Issues**
- Update Bun: `bun upgrade`
- Clear cache: `rm -rf node_modules .bun`
