# Manasthali Backend

## Setup
1. `npm install`
2. Copy `.env.example` to `.env` and fill in values
3. `npm start` (or `npm test`)

## Environment Variables
| Variable | Description |
|----------|-------------|
| DB_URI | MongoDB connection string |
| JWT_SECRET | Secret for signing JWT tokens |
| GEMINI_API_KEY | Google Gemini AI API key |
| MAIL_USER | Email for sending OTP emails |
| MAIL_PASS | Email password/app password |
| MAIL_PORT | SMTP port (default: 465) |
| AWS_ACCESS_KEY_ID | AWS S3 access key |
| AWS_SECRET_ACCESS_KEY | AWS S3 secret key |
| AWS_REGION | AWS region (default: us-east-1) |
| AWS_BUCKET_NAME | S3 bucket name |
| FRONTEND_URL | Frontend URL for reset links |
| NODE_ENV | development or production |

## API Overview
- `/users` — Auth, profile, follow/unfollow
- `/posts` — CRUD, like/unlike, share, community feed
- `/comments` — Add, update, delete, like
- `/groups` — CRUD, join/leave, members
- `/messages` — DM send/receive
- `/group-messages` — Group chat messages
- `/stories` — Upload, view, delete
- `/quiz` — Submit, calculate personality type
- `/notifications` — Create, fetch, mark read
- `/communities` — CRUD by personality type
- `/admin` — Admin signup/login
- `/mental-coach` — AI chat with Gemini
- `/challenges` — Daily challenges by personality

## Tech Stack
Express 4, Mongoose 8, JWT, bcryptjs, Winston, Socket.IO, AWS S3
