# Anansys Narrative Game Engine

Welcome to Anansys, a modular, AI-powered narrative game engine.

## Overview

Anansys is designed to provide a robust platform for creating dynamic, choice-driven narrative games. It features a modern backend built with Node.js, Fastify, and Drizzle ORM, and is designed to be paired with a flexible frontend (e.g., React).

## What's Anansys?
Anansys is inspired by Anansi, the West African trickster god and master storyteller. In folklore, Anansi is known for his cleverness, love of riddles, and ability to weave stories—often using his wit to outsmart gods and kings alike.
We adapted the name to Anansys to reflect two things:

- Anansi’s mythic roots in narrative and wisdom
- The idea of a system (sys) that powers rich, replayable storytelling

## Tech Stack

-   **Backend**:
    -   **Framework**: [Fastify](https://www.fastify.io/)
    -   **Language**: TypeScript
    -   **ORM**: [Drizzle ORM](https://orm.drizzle.team/)
    -   **Database**: PostgreSQL
-   **Frontend**: (Decoupled, example with React)
-   **Shared**: Shared types between backend and frontend.

## Project Structure

The project is organized into a monorepo using `pnpm` workspaces.

-   `apps/backend`: The Fastify backend application.
-   `apps/frontend`: The frontend application.
-   `packages/`: Shared packages (e.g., `eslint-config`, `tsconfig`).
-   `shared/`: Shared code, like TypeScript types.

### Backend Structure (`apps/backend`)

-   `src/`: Source code for the backend.
    -   `db/`: Drizzle ORM schema and query logic.
    -   `routes/`: API route handlers.
    -   `services/`: Business logic.
    -   `prompts/`: AI prompt templates.
    -   `utils/`: Utility functions.
    -   `server.ts`: Fastify server setup.
    -   `index.ts`: Application entry point.
-   `routes/`: This directory uses a file-based routing system.

### Frontend Structure (`apps/frontend`)

-   `src/`: Source code for the frontend application.
    -   `components/`: Reusable React components used by the routes.
    -   `routes/`: Route definitions using TanStack Router's file-based routing system.
    -   `main.tsx`: The main application entry point, which sets up the Mantine provider and TanStack Router.
    -   `tanstack-router.d.ts`: TypeScript declarations for extending the router's metadata capabilities.

## File-based Routing

The backend uses a convention-based routing system that automatically maps file and directory structures in `apps/backend/src/routes` to API endpoints.

### How it Works

-   **HTTP Methods**: Export `GET`, `POST`, `PUT`, `DELETE`, etc., from a route file to create an endpoint for that method.
-   **File Path to Route Path**:
    -   `routes/index.ts` -> `/`
    -   `routes/users/index.ts` -> `/users`
    -   `routes/users.ts` -> `/users`
    -   `routes/users/[id].ts` -> `/users/:id`
    -   `routes/users/[userId]/posts/[postId].ts` -> `/users/:userId/posts/:postId`

### Example Routes

-   `GET /`: Defined in `routes/index.ts`
-   `POST /`: Defined in `routes/index.ts`
-   `GET /users`: Defined in `routes/users/index.ts`
-   `POST /users`: Defined in `routes/users/index.ts`
-   `GET /users/:id`: Defined in `routes/users/[id].ts`

## Getting Started

1.  **Install dependencies**:
    ```bash
    pnpm install
    ```
2.  **Run the backend server**:
    ```bash
    pnpm --filter backend dev
    ```

The server will start on the port defined in your environment variables or a default port (e.g., 3000).

## Contributing

Please follow the coding standards and conventions outlined in the project.
All contributions should be well-documented and tested. 
