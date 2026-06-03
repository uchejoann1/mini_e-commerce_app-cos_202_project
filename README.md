# T3ch World

*Executive Summary*

This project is a full-stack digital marketplace designed to simulate a modern e-commerce storefront. Developed as a project for COS 202, the application, named T3chWorld, provides an end-to-end retail experience where users can seamlessly browse hardware products, filter inventory by device categories, and walk through a simulated order checkout pipeline.

The primary objective of this project is twofold: first, to engineer a responsive, database-driven web application; and second, to practice modern, industry-standard collaborative engineering workflows using decentralized version control, interactive UI/UX prototyping, and cloud infrastructure.

---

### 🎨 The Design Phase (UI/UX Foundation)

Before a single line of code was written for T3chWorld, the platform underwent a rigorous user experience design cycle to map out the customer journey and screen layouts. This phase was divided into two distinct engineering steps:

*Low-Fidelity (Lo-Fi) Wireframes:* The design process began with structural, black-and-white layouts. These wireframes focused entirely on page blueprints—mapping out where the navigation bar, product catalog grid, and filter sidebar should sit. By stripping away colors, logos, and images, the team was able to finalize user navigation paths and button placements without visual distractions.
<img width="1600" height="856" alt="4614cc07-413e-4578-ab04-7c345fb4cbeb" src="https://github.com/user-attachments/assets/9a49ada5-3569-47f9-b4de-aadd2cd15687" />

*High-Fidelity (Hi-Fi) Prototypes:* Once the basic structure was locked, it was transformed into an interactive, high-fidelity digital mock-up using Figma. This stage introduced the actual system branding, typography, color palettes, and real product hardware imagery. The hi-fi prototype simulated working clickable elements and page transitions, serving as an exact visual contract for the frontend engineers to follow during development.
<img width="1600" height="859" alt="8f27ab07-0e47-438a-96a2-0ec78f2a4fbe" src="https://github.com/user-attachments/assets/6419561e-36f4-4b4c-baaf-88c4942a75fd" />

---

### 🏗️ Architectural Overview

The T3chWorld platform is designed around a decoupled, three-tier software architecture. 

(Note on Architecture Evolution: While initially planned with a traditional Express.js backend server, the architecture was pivoted to utilize Next.js Serverless API routes. Express was scrapped to drastically simplify the deployment pipeline, allowing both the frontend and backend to be hosted uniformly on Vercel, while ensuring lower coupling and faster asynchronous request handling).

```text
[ Client Browser ]  <--- Next.js React UI (Vercel)
        │
        ▼  HTTP Requests (REST / Fetch API)
[ Serverless API ]  <--- Next.js App Router /api/ (Vercel)
        │
        ▼  Supabase Client (Secure SQL Queries)
[ Cloud Database ]  <--- Supabase PostgreSQL

```
The Presentation Layer (Frontend Client)
The user interface is built using React, Next.js, and TypeScript, utilizing Tailwind CSS for styling. This layer handles everything the customer interacts with on their screen. It is built using a component-driven design and communicates dynamically with the backend via asynchronous wrapper functions to display inventory items in real-time.

The Logic Layer (Backend Serverless APIs)
The core business logic runs on Next.js Serverless Route Handlers (app/api/...). Instead of a monolithic server constantly running in the background, these lightweight endpoints spin up instantly to intercept incoming web requests. They validate payloads, verify secure user authentication tokens, communicate with the database via the Supabase client, and return structured JSON data.

The Storage Layer (Relational Database)
Data persistence and user authentication are handled by Supabase, a Backend-as-a-Service built on PostgreSQL. The database is built on a highly relational schema separating products, orders, and cart_items. Crucially, it utilizes strict Row Level Security (RLS) policies directly at the database level to ensure users can only ever access or modify their own private data.

🔄 The Team Workflow & Operational Flow
To effectively build T3chWorld in parallel without team members blocking each other’s progress, the project operated across three structured development stages:

Phase 1: Structural Setup & DevOps Initialization

Repository Architecture: The Team Lead constructed the core repository structure, ensuring standard configuration files and environment variable templates (.env.example) were established.

Cloud Infrastructure Setup: The DevOps specialist initialized the cloud ecosystems. A live PostgreSQL database was spun up on Supabase, and Vercel was configured to securely host the Next.js environments.

Phase 2: Parallelized Coding & Local Mocking

Frontend Design: The frontend engineers built the visual elements using mock data arrays (catalog.ts). This allowed them to map out the UI and test layouts without waiting for the live database to be finished.

Backend Routings & Schema Build: The backend developers wrote the Next.js API routes locally. Simultaneously, the database specialist ran raw SQL migration scripts (create_t3chworld_schema.sql) to construct the live tables and inject seed data directly into Supabase.

Phase 3: Live Integration & Verification

Data Swapping: Once the API routes and Supabase tables were live, the frontend team swapped the local mock data for live fetch requests pointing to the serverless backend.

Cloud Deployment: Because of the Next.js Serverless architecture, deploying to Vercel automatically bundled and hosted both the React frontend and the backend API routes seamlessly.

Quality Assurance (QA): The QA testers cross-examined the live application and evaluated raw API endpoints using tools like Postman to ensure database queries and Row Level Security policies were functioning perfectly before final submission.

🚨 Git Branching Strategy & Contribution Rules
To prevent code conflicts and maintain a clean history, the team operates strictly under a professional Fork & Pull Request workflow. No member is permitted to commit to the main branch directly.

The Fork & Sync Cycle: Developers fork the main repository to their local environment. Before starting any new feature, they must sync their fork with the central repository's latest stable code.

Conventional Branching: Developers spin up isolated sandbox branches named specifically after the module they are building, utilizing standardized prefixes (e.g., feat/shopping-cart, fix/login-bug).

Conventional Commits: All changes must be saved using descriptive labels that describe the nature of the update. Prefixes used: feat() for new capabilities, fix() for addressing bugs, and docs() for updates to manuals.

Code Review (PRs): Once a feature is completed and tested locally, the developer opens a Pull Request (PR) against the main repository. The Team Lead audits the code changes for structural integrity and low-coupling standards before merging it into the project's main branch.

