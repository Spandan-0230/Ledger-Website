# Ledger Website

A modern, interactive financial and expense ledger web application built with **React**, **TypeScript**, and **Vite**. This project includes a dynamic marketing landing page with 3D UI effects, a login flow, and a full-featured financial dashboard powered by React Context and pre-configured demo data.

## ✨ Features

* **Interactive Landing Page:**

  * **Hero & Features Sections:** Engaging layout showcasing the platform's core capabilities.

  * **Dashboard Mockup:** Interactive preview of the ledger interface right on the home page.

  * **3D Tilt Cards:** Smooth, interactive card components (`TiltCard.tsx`) for enhanced visual polish.

  * **Dynamic Header:** Responsive navigation with scroll-fade effects and active section tracking.

* **Comprehensive Dashboard & Expense Ledger:**

  * Multi-tab dashboard interface for managing and analyzing financial records.

  * Centralized state management using React Context (`DashboardContext.tsx`).

  * Pre-populated with rich mock data (`demoData.ts`) for immediate testing and demonstration.

* **Authentication Flow:**

  * Dedicated login view (`Login.tsx`) for user access.

* **Automated GitHub Pages Deployment:**

  * Pre-configured GitHub Actions workflow (`deploy.yml`) for seamless CI/CD.

  * Includes Single Page Application (SPA) routing support for GitHub Pages via `404.html` and `.nojekyll`.

## 🛠️ Tech Stack

* **Framework:** [React](https://react.dev/) (with TypeScript)

* **Build Tool:** [Vite](https://vitejs.dev/)

* **Package Manager & Runtime:** [Bun](https://bun.sh/) (also compatible with npm/yarn/pnpm)

* **Styling:** Modern CSS / Tailwind CSS

* **CI/CD:** GitHub Actions (GitHub Pages deployment)

## 📂 Project Structure

```
Ledger-Website/
├── .github/
│   └── workflows/
│       └── deploy.yml             # GitHub Actions CI/CD workflow
├── assets/                        # Project and AI Studio configuration assets
├── public/
│   ├── .nojekyll                  # Bypasses Jekyll processing on GitHub Pages
│   └── 404.html                   # SPA client-side routing fallback
├── src/
│   ├── components/
│   │   ├── DashboardMockup.tsx    # Visual dashboard preview component
│   │   ├── Features.tsx           # Landing page features showcase
│   │   ├── Header.tsx             # Navigation bar with active/fade states
│   │   ├── Hero.tsx               # Landing page hero section
│   │   └── TiltCard.tsx           # Interactive 3D tilt wrapper component
│   ├── context/
│   │   └── DashboardContext.tsx   # Global state for ledger & dashboard data
│   ├── pages/
│   │   ├── Dashboard.tsx          # Main application & expense ledger view
│   │   ├── Landing.tsx            # Public marketing landing page
│   │   └── Login.tsx              # User authentication page
│   ├── App.tsx                    # Root component & routing setup
│   ├── demoData.ts                # Seed data for the ledger and dashboard
│   ├── index.css                  # Global styles
│   ├── main.tsx                   # Application entry point
│   └── types.ts                   # TypeScript interfaces & type definitions
├── .env.example                   # Template for environment variables
├── bun.lock                       # Bun lockfile
├── index.html                     # HTML entry point
├── metadata.json                  # Project metadata
├── package.json                   # Dependencies and scripts
├── tsconfig.json                  # TypeScript configuration
└── vite.config.ts                 # Vite configuration

```

## 🚀 Getting Started

### Prerequisites

Make sure you have [Bun](https://bun.sh/) installed on your machine (or [Node.js](https://nodejs.org/) v18+ if you prefer `npm`).

### 1. Clone the Repository

```
git clone <your-repo-url>
cd Ledger-Website

```

### 2. Install Dependencies

Using **Bun** (recommended):

```
bun install

```

Or using **npm**:

```
npm install

```

### 3. Configure Environment Variables

Copy the example environment file and update it with your keys (if applicable):

```
cp .env.example .env

```

### 4. Start the Development Server

```
bun run dev
# or: npm run dev

```

Open your browser and navigate to `http://localhost:5173` (or the port shown in your terminal).

## 📦 Building for Production

To create an optimized production build in the `dist/` directory:

```
bun run build
# or: npm run build

```

To preview the production build locally:

```
bun run preview
# or: npm run preview

```

## 🌐 Deployment

This repository is configured to deploy automatically to **GitHub Pages** via GitHub Actions.

1. Go to your repository on GitHub and navigate to **Settings > Pages**.

2. Under **Build and deployment**, set the **Source** to **GitHub Actions**.

3. Push your changes to the `main` branch. The workflow defined in `.github/workflows/deploy.yml` will automatically build and deploy your application.