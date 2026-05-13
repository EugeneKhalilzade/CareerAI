# KaryerAI

**Practice smarter, interview better.** 🚀

KaryerAI is an AI-powered mock interview platform designed to help job seekers prepare for technical and behavioral interviews. Answer questions out loud, get instant AI feedback, and improve your interview performance with personalized guidance.

---

## ✨ Features

- **Personalized Interview Questions** – Generate questions based on your target role, tech stack, and experience level
- **Voice-Based Practice** – Answer questions using your microphone to simulate real interview pressure
- **Instant AI Feedback** – Receive detailed ratings, ideal answers, and specific improvement suggestions
- **Interview History** – Track previous interviews and review your progress over time
- **Modern UI** – Clean, responsive design with a purple/cyan gradient theme

---

## 🛠️ Tech Stack

- **Frontend**: Next.js 14.2.5, React, Tailwind CSS
- **Backend**: Next.js API routes, Drizzle ORM
- **Database**: PostgreSQL (via Drizzle)
- **Authentication**: Clerk
- **AI Integration**: Google Generative AI (Gemini)
- **Deployment**: Vercel ready

---

## 📦 Prerequisites

- Node.js 18+ and npm
- PostgreSQL database
- API keys for:
  - [Clerk](https://clerk.com) (authentication)
  - [Google Generative AI](https://ai.google.dev) (Gemini API)

---

## 🚀 Installation & Setup

### 1. Clone the repository
```bash
git clone <repo-url>
cd AI-mock-interview-master
```

### 2. Install dependencies
```bash
npm install
```

### 3. Configure environment variables
Create a `.env.local` file in the root directory:

```env
# Clerk Authentication
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=your_clerk_key
CLERK_SECRET_KEY=your_clerk_secret

# Database
DATABASE_URL=postgresql://user:password@localhost:5432/karyerai

# AI
GOOGLE_GENERATIVE_AI_API_KEY=your_gemini_api_key

# Public Variables
NEXT_PUBLIC_QUESTION_NOTE="Remember to speak clearly and concisely. Practice thinking out loud."
```

### 4. Set up the database
Run Drizzle migrations:
```bash
npm run db:push
```

### 5. Start the development server
```bash
npm run dev
```

Visit **http://localhost:3000** (or 3001 if 3000 is in use) in your browser.

---

## 📖 How to Use

### 1. **Sign Up / Sign In**
   - Create an account or log in via Clerk

### 2. **Create an Interview**
   - Go to Dashboard → "Create a new interview"
   - Fill in your target role, tech stack, and experience level
   - KaryerAI generates personalized questions

### 3. **Practice Live**
   - Click "Start Interview" on your interview
   - Read each question carefully
   - Click the microphone icon to record your answer
   - Speak naturally and concisely

### 4. **Review Feedback**
   - After answering all questions, go to "Feedback"
   - Review AI-generated ratings and suggestions
   - Compare your answer with the ideal response
   - Identify areas to improve

### 5. **Track Progress**
   - View all previous interviews on your dashboard
   - Monitor improvement over time

---

## 🏗️ Project Structure

```
ai-mock-interview-master/
├── app/
│   ├── layout.js                 # Root layout
│   ├── globals.css              # Global styles & theme
│   ├── page.js                  # Landing page
│   ├── (auth)/                  # Auth pages (sign-in, sign-up)
│   └── dashboard/               # Dashboard & interview pages
│       ├── page.jsx             # Dashboard home
│       ├── layout.jsx           # Dashboard layout
│       ├── _components/         # Header, Footer, AddNewInterview, etc.
│       └── interview/[interviewId]/
│           ├── page.jsx         # Interview setup
│           ├── start/           # Live interview session
│           └── feedback/        # Interview feedback
├── components/
│   ├── BrandLogo.jsx            # Reusable logo with gradient "A"
│   └── ui/                      # Shadcn UI components
├── utils/
│   ├── db.js                    # Drizzle database client
│   ├── schema.js                # Database schema
│   ├── interviewQuestions.js    # Question normalization utility
│   └── constants.js
├── public/                      # Static assets
├── middleware.js                # Clerk auth middleware
├── next.config.mjs
├── tailwind.config.js
└── README.md
```

---

## 🎨 Design System

### Colors
- **Primary**: Purple (`#7c3aed`)
- **Accent**: Cyan (`#06b6d4`)
- **Background**: Light Blue (`#f0f9ff`)
- **Glass Card**: Semi-transparent white with backdrop blur

### Key Utilities
- `.page-shell` – Centered container with responsive padding
- `.glass-card` – Modern frosted glass effect card
- `.brand-highlight` – Gradient text for the "A" in KaryerAI

---

## 🔧 Available Scripts

```bash
# Development
npm run dev          # Start dev server

# Production
npm run build        # Build for production
npm start           # Start production server

# Database
npm run db:push     # Push schema changes to database
npm run db:studio   # Open Drizzle Studio

# Linting
npm run lint        # Run ESLint
```

---

## 🐛 Troubleshooting

### Port Already in Use
If port 3000 is in use, the dev server will automatically try port 3001.

### CSS Not Loading
- Clear the `.next` cache: `rm -r .next`
- Restart the dev server
- Hard refresh the browser (Ctrl+Shift+R)

### Database Connection Error
- Verify `DATABASE_URL` in `.env.local`
- Ensure PostgreSQL is running
- Run `npm run db:push` to set up tables

### Questions Not Generating
- Verify `GOOGLE_GENERATIVE_AI_API_KEY` is correct
- Check API quota limits on Google Cloud Console

---

## 📝 API Endpoints

### Interview Management
- `POST /api/mockinterview` – Create new interview
- `GET /api/mockinterview` – Get all interviews
- `GET /api/mockinterview/[id]` – Get interview details
- `DELETE /api/mockinterview/[id]` – Delete interview

### Feedback
- `POST /api/feedback` – Generate AI feedback
- `GET /api/feedback/[id]` – Get feedback for interview

---

## 🤝 Contributing

Contributions are welcome! To contribute:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/your-feature`)
3. Commit changes (`git commit -m 'Add your feature'`)
4. Push to the branch (`git push origin feature/your-feature`)
5. Open a Pull Request

---

## 📄 License

This project is licensed under the MIT License. See LICENSE file for details.

---

## 🙏 Acknowledgments

- Built with [Next.js](https://nextjs.org)
- Styled with [Tailwind CSS](https://tailwindcss.com)
- Icons from [Lucide React](https://lucide.dev)
- UI Components from [Shadcn UI](https://ui.shadcn.com)
- Auth by [Clerk](https://clerk.com)
- AI powered by [Google Generative AI](https://ai.google.dev)

---

## 📧 Support

For issues or questions, please open an issue on GitHub or contact the development team.

**Happy interviewing! 🎉**
