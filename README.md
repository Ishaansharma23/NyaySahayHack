# NyaySahay

NyaySahay is a legal assistance platform connecting clients and advocates with AI-powered guidance, incident reporting, consultation management, real-time chat, and optional video calls.

## Features

- **Role-based authentication** for clients and advocates
- **Client dashboard** with AI access, report incident, find advocates, and connections
- **Advocate dashboard** with client management and consultation requests
- **AI Legal Assistant (NyaySahay AI)** with chat history and formatted responses
- **Incident reporting** with evidence uploads and email notifications
- **Consultation requests** with **first 5 free** and **Razorpay payments** thereafter
- **Real-time chat** powered by Stream Chat
- **Video call entry** powered by Stream SDK
- **Profile onboarding & settings** for both roles
- **Notifications UI** and dark premium SaaS UI theme

## Tech Stack

**Frontend**
- React (Vite)
- React Router
- TanStack Query
- Tailwind CSS
- Stream Chat React + Stream Video SDK

**Backend**
- Node.js + Express
- MongoDB + Mongoose
- JWT auth (cookies)
- Razorpay SDK
- Stream server SDK
- Email via Nodemailer
- Pinecone (vector search)
- Gemini / Claude (AI)

## Project Structure

```
NyaySahayHack/
  backend/
    package.json
    server.js
    src/
      app.js
      controllers/
      db/
      middlewares/
      models/
      routes/
      service/
      sockets/
      utils/
  frontend/
    package.json
    index.html
    vite.config.js
    src/
      common/
      components/
      hooks/
      pages/
      routes/
      services/
```

## Local Setup

### 1) Backend

```bash
cd backend
npm install
npm run dev
```

### 2) Frontend

```bash
cd frontend
npm install
npm run dev
```

Frontend runs on Vite (default :5173), backend on :3000.

## Environment Variables

Create `.env` files in both backend and frontend.

### Backend `.env`

```
NODE_ENV=development
PORT=3000
MONGODB_URL=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
FRONTEND_URL=http://localhost:5173

# Stream
STREAM_API_KEY=your_stream_key
STREAM_API_SECRET=your_stream_secret

# Razorpay
RAZORPAY_KEY_ID=your_razorpay_key_id
RAZORPAY_KEY_SECRET=your_razorpay_key_secret

# Email
EMAIL_USER=your_email
EMAIL_PASS=your_email_app_password

# AI
AI_PROVIDER=gemini
GEMINI_API_KEY=your_gemini_key
CLAUDE_API_KEY=your_claude_key

# Vector Search
PINECONE_API_KEY=your_pinecone_key

# Optional
LOG_HTTP=false
LOG_LEVEL=debug
```

### Frontend `.env`

```
VITE_STREAM_API_KEY=your_stream_key
VITE_RAZORPAY_KEY_ID=your_razorpay_key_id
```

## Key Frontend Routes

- `/client/dashboard`
- `/client/ai-chat`
- `/client/report-incident`
- `/client/advocates`
- `/client/my-advocates`
- `/advocate/dashboard`
- `/advocate/clients`
- `/advocate/consultation-requests`

## Payments

- First **5 accepted consultations are free**.
- On the 6th request and beyond, Razorpay payment is required before sending the request.

## Notes

- Stream Chat requires matching Stream API keys in both backend and frontend.
- If you don’t want HTTP logs in the console, leave `LOG_HTTP` unset or set it to `false`.

## Scripts

**Backend**
- `npm run dev`
- `npm start`

**Frontend**
- `npm run dev`
- `npm run build`
- `npm run preview`
- `npm run lint`
