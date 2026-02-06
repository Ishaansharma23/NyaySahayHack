# ⚖️ NyaySahay Platform

A legal assistance platform connecting clients and advocates with AI-powered guidance, incident reporting, consultation management, real-time chat, and optional video calls.

## 🚀 Features

- **Role-based Authentication** — Client and Advocate flows
- **Client Dashboard** — AI access, report incident, find advocates, and connections
- **Advocate Dashboard** — Client management and consultation requests
- **NyaySahay AI** — AI Legal Assistant with chat history and formatted responses
- **Incident Reporting** — Evidence uploads + email notifications
- **Consultation Requests** — First 5 free, then Razorpay payments
- **Real-time Chat** — Stream Chat integration
- **Video Call Entry** — Stream Video SDK
- **Profile Onboarding & Settings** — For both roles
- **Premium Dark UI** — Consistent SaaS style across app

## 🛠️ Tech Stack

**Frontend**: React (Vite), React Router, TanStack Query, Tailwind CSS, Stream Chat React, Stream Video SDK

**Backend**: Node.js, Express, MongoDB (Mongoose), JWT (cookies), Razorpay, Stream server SDK, Nodemailer, Pinecone, Gemini/Claude AI

## 📋 Prerequisites

- Node.js (v16+ recommended)
- MongoDB (local or Atlas)
- npm

## ⚡ Quick Start

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

Frontend runs on `http://localhost:5173` and backend on `http://localhost:3000`.

## 🔐 Environment Variables

Create `.env` files in both backend and frontend.

### Backend `.env`
```env
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
```

### Frontend `.env`
```env
VITE_API_BASE_URL=http://localhost:3000/api
VITE_STREAM_API_KEY=your_stream_key
VITE_RAZORPAY_KEY_ID=your_razorpay_key_id
```

## 📍 Key Routes

**Client**
- `/client/dashboard`
- `/client/ai-chat`
- `/client/report-incident`
- `/client/advocates`
- `/client/my-advocates`

**Advocate**
- `/advocate/dashboard`
- `/advocate/clients`
- `/advocate/consultation-requests`

## 💳 Payments

- First **5 accepted consultations are free**.
- 6th request onward requires Razorpay payment before sending.

## 🔌 Real-time & AI

- **Chat**: Stream Chat (frontend + backend keys must match)
- **AI**: Gemini or Claude based on `AI_PROVIDER`

## 📁 Project Structure

```
NyaySahayHack/
├── backend/                        # Express Backend
│   ├── package.json
│   ├── server.js
│   └── src/
│       ├── app.js
│       ├── controllers/
│       ├── db/
│       ├── middlewares/
│       ├── models/
│       ├── routes/
│       ├── service/
│       ├── sockets/
│       └── utils/
├── frontend/                       # React Frontend
│   ├── package.json
│   ├── index.html
│   ├── vite.config.js
│   └── src/
│       ├── common/
│       ├── components/
│       ├── hooks/
│       ├── pages/
│       ├── routes/
│       └── services/
└── README.md
```

## 🧪 Scripts

**Backend**
- `npm run dev`
- `npm start`

**Frontend**
- `npm run dev`
- `npm run build`
- `npm run preview`
- `npm run lint`

## 🛣️ Deployment (Vercel + Render)

- **Render**: Deploy backend from `backend/` with `node server.js`.
- **Vercel**: Deploy frontend from `frontend/` with `npm run build`.
- Set `FRONTEND_URL` on backend to the Vercel domain.
- Set `VITE_API_BASE_URL` on frontend to Render URL + `/api`.

## 🔭 Future Improvements

- Admin dashboard (moderation, disputes, analytics)
- Push/email notifications
- Advanced advocate search + filtering
- Case timelines and document management
- Multi-language UI
- Accessibility enhancements (ARIA, keyboard navigation)
- End-to-end tests for auth, payments, and chat

## 🆘 Support

If something doesn’t work:
1) Verify all environment variables
2) Ensure MongoDB is reachable
3) Confirm Stream/Razorpay keys match
4) Check backend logs for errors

---

**Happy Building!**

