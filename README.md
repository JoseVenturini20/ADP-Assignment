# ADP Ventures Brazil Labs - Transaction Dashboard

Node.js application that fetches transaction data from an API, identifies last year's top earner, filters their alpha transactions, and submits the result — all displayed in a React dashboard.

## Setup

```bash
npm install
```

## Usage

```bash
npm start
```

Open `http://localhost:3000` in your browser.

1. Click **Fetch Data** to retrieve transactions from the API
2. Review the data using search, filters, and pagination
3. Click **Submit Result** to send the computed result

## Scripts

| Command | Description |
|---------|-------------|
| `npm start` | Build frontend and start server |
| `npm test` | Run unit tests |
| `npm run lint` | Run ESLint |
| `npm run build` | Build React frontend |
| `npm run typecheck` | Run TypeScript type checking |
| `npm run validate` | Run typecheck + lint |

## Tech Stack

- **Backend:** Node.js, Express 5, TypeScript
- **Frontend:** React 19, Material UI
- **Build:** esbuild
- **Testing:** Jest, ts-jest
- **Linting:** ESLint with TypeScript plugin
