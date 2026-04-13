# AI Student Portfolio – Full Stack

A production-ready portfolio for an undergraduate Artificial Intelligence student, built with:

- Frontend: HTML5, Tailwind CSS, JavaScript
- Backend: Node.js, Express.js
- Database: MongoDB (Mongoose)
- Auth: JWT
- Extras: Nodemailer contact form, image upload, simple AI chatbot widget

---

## 1. Prerequisites

- Node.js (LTS)
- MongoDB instance (local or cloud)
- SMTP credentials (for contact form)

---

## 2. Backend setup

```bash
cd backend
npm init -y
npm install express mongoose cors dotenv jsonwebtoken bcryptjs nodemailer multer