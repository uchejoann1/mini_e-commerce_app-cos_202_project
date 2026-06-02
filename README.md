# T3ch World
 Executive Summary

This project is a full-stack digital marketplace designed to simulate a modern e-commerce storefront. Developed as a project for COS 202, the application, named T3chWorld, provides an end-to-end retail experience where users can seamlessly browse hardware products, filter inventory by device categories, and walk through a simulated order checkout pipeline.

The primary objective of this project is twofold: first, to engineer a responsive, database-driven web application; and second, to practice modern, industry-standard collaborative engineering workflows using decentralized version control, interactive UI/UX prototyping, and cloud infrastructure.

🎨 The Design Phase (UI/UX Foundation)

Before a single line of code was written for T3chWorld, the platform underwent a rigorous user experience design cycle to map out the customer journey and screen layouts. This phase was divided into two distinct engineering steps:

Low-Fidelity (Lo-Fi) Wireframes: The design process began with structural, black-and-white layouts. These wireframes focused entirely on page blueprints—mapping out where the navigation bar, product catalog grid, and filter sidebar should sit. By stripping away colors, logos, and images, the team was able to finalize user navigation paths and button placements without visual distractions.
<img width="1600" height="856" alt="4614cc07-413e-4578-ab04-7c345fb4cbeb" src="https://github.com/user-attachments/assets/9a49ada5-3569-47f9-b4de-aadd2cd15687" />


High-Fidelity (Hi-Fi) Prototypes: Once the basic structure was locked, it was transformed into an interactive, high-fidelity digital mock-up using Figma. This stage introduced the actual system branding, typography, color palettes, and real product hardware imagery. The hi-fi prototype simulated working clickable elements and page transitions, serving as an exact visual contract for the frontend engineers to follow during development.
<img width="1600" height="859" alt="8f27ab07-0e47-438a-96a2-0ec78f2a4fbe" src="https://github.com/user-attachments/assets/6419561e-36f4-4b4c-baaf-88c4942a75fd" />


🏗️ Architectural Overview

The T3chWorld platform is designed around a decoupled, three-tier software architecture. By isolating the visual layout, the server management, and the storage engine, the system ensures that components can be updated, scaled, or debugged independently without breaking the entire application.

[ Client Browser ]  <--- React Web UI (Vercel)
               │
               ▼  HTTP Requests (REST API)
       [ Application Server ] <--- Express.js App (Render)
               │
               ▼  SQL Queries (pg Pool Connection)
       [ Relational Database ] <--- PostgreSQL (Render)

The Presentation Layer (Frontend Client)
The user interface is built using React and TypeScript, packaged via the Vite build pipeline. This layer handles everything the customer interacts with on their screen while browsing the T3chWorld catalog. It communicates dynamically with the backend server via asynchronous network calls to display inventory items in real time.

The Logic Layer (Backend Application Server)
The core business logic runs on a Node.js environment powered by the Express.js web framework. The server acts as a secure intermediary or "waiter." It intercepts incoming web requests from the frontend browser, handles the routing logic, validates parameters, communicates with the database, and packages data back into structured JSON formats.

The Storage Layer (Relational Database)
Data persistence is handled by a cloud-hosted PostgreSQL relational database management system. The database is built on a structured schema that securely stores information across separate tables—specifically separating product inventory metrics (names, descriptions, prices, image locations) from customer order logs.

🔄 The Team Workflow & Operational Flow

To effectively build T3chWorld in parallel without team members blocking each other’s progress, the project operates across three structured development stages:

Phase 1: Structural Setup & DevOps Initialization

Repository Architecture: The Team Lead constructs the core repository structure, establishing empty folders for both the frontend and backend with placeholders to ensure the team has a uniform canvas.

Cloud Infrastructure Setup: The DevOps specialist initializes cloud platform ecosystems on Render and Vercel under a shared credential pool. They spin up the cloud PostgreSQL instance and generate the live web server shells.

Phase 2: Parallelized Coding & Local Mocking

Frontend Design: The frontend engineers build the visual elements of the T3chWorld storefront based on the High-Fidelity prototype specs. They point all network requests to a single local file (config.ts) configured to talk to localhost, isolating their tests.

Backend Routings & Schema Build: The backend developers write Express routes. Because the database is being built simultaneously, they initially pass "fake/mock arrays" of products so the frontend can test visual connections immediately. Simultaneously, the database specialist runs structural SQL scripts directly into the live Render cloud to construct the live tables and inject starter data.

Phase 3: Live Integration & Verification

Data Swapping: Once the database tables are live, the backend team swaps the fake product arrays with live SQL queries.

Cloud Deployment: The DevOps specialist updates the build paths, pulling code directly from the GitHub repository to the cloud. Local network URLs are swapped for live, production-ready cloud server URLs.

Quality Assurance (QA) & Sign-off: The QA tester cross-examines the live T3chWorld application on web browsers and evaluates raw API endpoints using tools like Postman to ensure zero breaking bugs exist before final submission.

🚨 Git Branching Strategy & Contribution Rules

To prevent code conflicts and keep a clean history, Group 6 operates strictly under a decentralized Git flow. No member is permitted to modify the main branch directly.

1.The Sync Cycle: Before starting any new feature, developers must update their local workspace with the central repository's latest stable code by running a manual sync pull.

2.Feature Branching: Developers spin up isolated sandbox branches named specifically after the module they are building (e.g., feature/home-page-ui or feature/product-routes).

3.Conventional Commits: All changes must be saved using descriptive labels that describe the nature of the update. Prefixes used: feat() for new capabilities, fix() for addressing bugs, and docs() for updates to manuals and text overviews.

4.Code Review: Once a feature is completed and tested locally, the developer pushes the branch to their personal fork and opens a Pull Request (PR). The Team Lead audits the code changes for structural integrity before merging it into the project's main branch.
