# Hospital Management System

## Setup Instructions

1. Clone the repository
2. Install dependencies:
```bash
npm install
```

3. Create MongoDB Atlas Account and Database:
   - Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
   - Sign up or log in
   - Create a new cluster (free tier is fine)
   - Click "Connect" on your cluster
   - Choose "Connect your application"
   - Copy the connection string

4. Configure Environment Variables:
   - Rename `.env.example` to `.env`
   - Replace the placeholder MongoDB URI with your connection string
   - Replace `<username>`, `<password>`, `<cluster-url>`, and `<database-name>` with your values

5. Start the application:
```bash
# Run both frontend and backend
npm run dev

# Run only backend
npm run dev:backend

# Run only frontend
npm run dev:frontend
```

## Available Scripts

- `npm run dev` - Runs both frontend and backend
- `npm run dev:frontend` - Runs only the frontend (Vite)
- `npm run dev:backend` - Runs only the backend (Node.js/Express)
- `npm run build` - Builds the frontend for production
- `npm run preview` - Preview the production build locally