# Recyclo

Recyclo is a circular fashion platform connecting household textile pickups, agent grading, instant payouts, and an upcycled apparel marketplace.

![Next.js](https://img.shields.io/badge/Next.js-16.2.6-black?style=for-the-badge&logo=next.js&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0-3178C6?style=for-the-badge&logo=typescript&logoColor=white)
![React](https://img.shields.io/badge/React-19.0-61DAFB?style=for-the-badge&logo=react&logoColor=black)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.4-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)
![Zustand](https://img.shields.io/badge/Zustand-5.0-443e38?style=for-the-badge&logo=react&logoColor=white)
![ESLint](https://img.shields.io/badge/ESLint-9.0-4B32C3?style=for-the-badge&logo=eslint&logoColor=white)

---

## Overview

Recyclo provides an end-to-end digital infrastructure for sustainable textile recycling and upcycled ecommerce. It bridges the gap between post-consumer fabric collection, quality verification, instant digital payouts, and upcycled fashion retail.

## Key Features

- **Doorstep Pickup Scheduling**: Schedule fabric pickups with instant estimated payout calculations based on fabric weight and textile category.
- **Agent Inspection Interface**: Field agent dashboard for inspecting collected garments, assigning quality grades, and releasing instant payouts.
- **100% Upcycled Clothing Store**: Multi-attribute filtering system (Department, Garment Size, Material, Color, Price Range, and Recycled %) with interactive pagination.
- **Batch Traceability Stories**: Each garment links to its origin processing batch (e.g., `PB1024`), presenting verified metrics for CO2 avoided and water conserved.
- **Recyclo Green Wallet**: Digital eco-wallet supporting instant balance credits, transaction history, and UPI withdrawals.
- **Impact Analytics**: Real-time carbon footprint metrics tracking total fabric weight diverted from landfills.
- **Admin Control Center**: Operations dashboard for managing pickup requests, inventory batches, pricing multipliers, and customer disputes.

## Tech Stack

| Component        | Technology                             |
| ---------------- | -------------------------------------- |
| Framework        | Next.js 16 (App Router with Turbopack) |
| Language         | TypeScript                             |
| UI & Styling     | TailwindCSS & Shadcn UI Components     |
| Icons            | Lucide React                           |
| State Management | Zustand with LocalStorage Persistence  |

## Getting Started

### Prerequisites

- Node.js 18.0.0 or higher
- npm 9.0.0 or higher

### Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/<username>/recyclo.git
   cd recyclo
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Run the development server:

   ```bash
   npm run dev
   ```

4. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Available Scripts

- `npm run dev` - Starts the development server with Turbopack.
- `npm run build` - Builds the application for production.
- `npm run start` - Starts the production server.
- `npm run lint` - Runs ESLint to check for code formatting and quality issues.
- `npm run typecheck` - Runs the TypeScript compiler to verify static type definitions.

## License

This project is licensed under Recyclo.
