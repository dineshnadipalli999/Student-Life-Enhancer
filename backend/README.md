# Student Life Enhancer+ Backend

NestJS + PostgreSQL + Prisma backend foundation.

## Database setup
1. Install PostgreSQL.
2. Create a database named `student_life_enhancer`.
3. Copy `.env.example` to `.env`.
4. Edit only `DATABASE_URL` in `.env`.
5. Run:
   npm install
   npx prisma generate
   npx prisma migrate dev --name init
   npm run start:dev

Backend runs at http://localhost:5010
Health check: http://localhost:5010/api/health

IMPORTANT:
Your PostgreSQL connection code/config belongs ONLY in:
`backend/.env`
Do not put the database password in TypeScript files.

The frontend will later connect to the backend APIs, not directly to PostgreSQL.
