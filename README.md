# Concert Ticketing System - Microservices Architecture

This repository contains a SaaS platform for managing concerts and events. It is designed to handle both small events (such as a school play) and large-scale concerts involving international artists. The project is built around a microservices architecture to ensure scalability and flexibility.

## Overview

The application is organized into four main services:

1. **Auth Service** – Manages user registration, login, and JWT-based authentication.
2. **Webd Service** – Handles the core business logic for events, ticketing, and user operations at an administrative level.
3. **Frontend** – Provides a user interface built in JavaScript for browsing events, buying tickets, and managing events (if the user has sufficient privileges).
4. **Load Balancer (lb)** – An Nginx server that routes incoming traffic to the appropriate microservices or the frontend.

Each microservice runs in its own container, and Docker Compose orchestrates them. This design makes the system easier to maintain, scale, and deploy.  

## Features and Functionality

This platform allows users to create, update, read, and delete events. Each event has a maximum capacity (number of available seats), which cannot be exceeded during ticket purchase. The Auth Service handles user authentication and supports three roles with different permissions: **Admin**, **EventCreator**, and **User**. A fourth type of user, which we can call a basic user, can access the system with fewer privileges.  

Ticket purchases are simulated to demonstrate how a user can pay by credit card (the system checks for a valid but placeholder card number). Whenever a ticket is purchased, the system confirms the sale asynchronously and ensures that the event’s seat limits are respected. Users are notified in case of any error, and logs are produced to help diagnose problems.  

The application supports both English and French. Through simple mechanisms in each microservice, the request header `Accept-Language` determines which language is used for responses. Passwords are always stored securely in hashed form, and important operations are logged to ensure that debugging information is available in case of issues.

## Architecture Details

- **Auth Service (auth/)**  
  Exposes endpoints for user registration and login (`/api/auth/register`, `/api/auth/login`). It uses JWT to issue tokens that include the user’s role. It stores user data in a local SQLite database via Sequelize.
  
- **Webd Service (webd/)**  
  Handles events, ticket purchases, and additional user CRUD operations (restricted to Admin for certain routes). It manages a separate local SQLite database. Payment is simulated, and the system prevents overselling seats by locking and updating records within a transaction.

- **Frontend (frontend/)**  
  A JavaScript-based interface served by an Nginx container. It includes HTML pages that allow users to log in, view events, and buy tickets. Users with elevated roles (Admin or EventCreator) can manage events (create, edit, or delete).  

- **Load Balancer (lb/)**  
  Uses Nginx to direct traffic from port 80 to the appropriate service:  
  - `auth:3001` for authentication.  
  - `webd:3000` for events, tickets, and user management.  
  - `frontend:80` for the web interface.

## Getting Started

### Prerequisites

You need to have Docker and Docker Compose installed on your machine. The system is set up so that all services run in their respective containers without requiring any additional local installations besides Docker.

### Installation and Launch

1. **Clone this repository** to your local machine.
2. Open a terminal in the root directory, which contains the `docker-compose.yml` file.
3. Run the following commands:
   ```bash
   docker-compose build
   docker-compose up
   ```
4. When all containers have started successfully, you can visit:
   - **http://localhost** : The main entry point handled by the load balancer.
   - **http://localhost/api-docs** : Swagger documentation for the Webd microservice.
   - **http://localhost/api/auth/api-docs** : Swagger documentation for the Auth microservice.
   - **http://localhost:8080** : The frontend served by Nginx (or through the load balancer at port 80).

The system will synchronize the databases upon the first launch. Since SQLite is used, each microservice stores its data in a local file named `database.sqlite` inside its container.  

## Testing and Development

Tests are written with **Jest** and **Supertest**. Each microservice contains its own tests under the `tests/` folder. You can run these tests by entering the service container and using `npm test`, or by installing dependencies locally and running tests directly from your host system.  

For instance, to test the “webd” microservice:

```bash
cd webd
npm install
npm test
```

You can do the same for the “auth” microservice in its directory.
