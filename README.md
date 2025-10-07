# Info Submission Page

A simple full-stack (Express + TypeScript + Vanilla HTML/JS) web application that allows a user to submit identifying information (Government ID, Full Name, Email, Phone Number, Mandate ID). After submission, the backend validates the data, stores it in an in-memory list, and sends a confirmation email: 

> "Congrats <Full Name>! You have signed Mandate <Mandate ID>. Please contact the agency for further information." 

## Features
- Frontend: Minimal static HTML form with fetch-based submission.
- Backend: Express + TypeScript, validation via Zod.
- Email: Nodemailer (configurable SMTP via environment variables).
- In-Memory Storage: Easily swappable for a database later.

## Quick Start

### 1. Install dependencies
From the project root (this folder):

```bash
npm install --workspaces
```

This installs server workspace dependencies.

### 2. (Optional) Create a test SMTP account
For local development you can use [Ethereal Email](https://ethereal.email/):

```bash
node -e "import('nodemailer').then(async m=>{const a=await m.createTestAccount();console.log(a);});"
```
Set the returned credentials in a `.env` file inside `server/`:

```
SMTP_HOST=smtp.ethereal.email
SMTP_PORT=587
SMTP_USER=your_generated_user
SMTP_PASS=your_generated_pass
MAIL_FROM="Mandate Team <no-reply@example.com>"
```

### 3. Run the dev server
```bash
npm run dev
```
Then open: http://localhost:3000

### 4. Submit the form
Check the terminal for a preview URL when using Ethereal (will show a link to view the rendered email).

## API
`POST /api/mandates/submit`
Body JSON:
```json
{
  "govId": "ABC12345",
  "fullName": "Jane Doe",
  "email": "jane@example.com",
  "phone": "+1234567890",
  "mandateId": "M-001"
}
```
Returns 201 with a message and generated id.

## Future Enhancements
- Persist submissions to a database (e.g., SQLite, Postgres, Prisma).
- Add rate limiting & captcha.
- Add email template theming.
- Add frontend bundler (Vite/React) if UI needs to expand.

## License
MIT
