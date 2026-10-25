# Horigine Staffing — Admin UI Prototype

A responsive React + TypeScript + Vite admin dashboard concept for a staffing/recruitment team.

## Run locally

```bash
npm install
npm run dev
```

On Windows PowerShell, if npm scripts are blocked, use `npm.cmd install` and `npm.cmd run dev`.

## Demo access

- Email/mobile: `admin@horigine.com`
- Password: `Horigine@123`

## Included screens

- Admin sign-in screen
- Overview dashboard with hiring metrics, recent job postings, and latest applicants
- Job postings list, search, status filter, create/edit job form, draft/publish/close actions
- Applicants list, search, status filter, applicant profile panel, candidate stage updates
- Responsive left navigation and mobile layout

## Important implementation note

This is a **front-end UI prototype**. Demo sign-in accepts a non-empty email/mobile and password of at least 6 characters; it is not secure authentication. Job posts and applicant stage changes are stored in browser `localStorage`, so they are local to that browser and do not sync between HR users or devices. Applicant entries are sample data. Before production, connect a backend/database, implement real authentication and role-based access control, secure resume upload/storage, server-side validation, audit logs, and privacy/data-retention controls. Never use this demo credential for a real admin account.

## Job form fields

Job title, department, employment type, location, work arrangement, experience, salary range, openings, application deadline, job summary/responsibilities, required skills, education/qualifications, and posting status.
