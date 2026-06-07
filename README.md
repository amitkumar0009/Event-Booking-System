# Event Booking App

A full-stack event booking application with a React + Vite frontend and an Nodejs + Express + MongoDB backend.

## Overview

This project provides:
- User registration, login, and OTP-based email verification.
- Event browsing, event detail pages, and category/location filtering.
- Booking request flow with email OTP confirmation.
- Admin routes for creating, updating, deleting events, and confirming bookings.
- Role-based access control using JWT authentication.

## Technology Stack

- Frontend: React, Vite, Tailwind CSS, React Router, Axios
- Backend: Node.js, Express, MongoDB, Mongoose, JSON Web Tokens
- Email: Nodemailer (Gmail SMTP)

## Project Structure

- `Backend/` - Express API server
  - `controllers/` - request handlers for auth, events, bookings
  - `middleware/` - JWT protection and role checks
  - `models/` - Mongoose schemas for users, events, bookings, OTPs
  - `routes/` - API route definitions
  - `utils/` - email helpers
  - `db/` - MongoDB connection
- `Frontend/` - React client
  - `src/` - React pages, components, context, and API utilities

## Requirements

- Node.js 18+ (or compatible)
- npm
- MongoDB database
- Gmail account credentials for sending OTP and booking confirmation emails

## Backend Setup

1. Open a terminal in `Backend/`
2. Install dependencies:
   ```bash
   cd Backend
   npm install
   ```
3. Create a `.env` file in `Backend/` with the following values:
   ```env
   MONGO_URI=<your-mongo-connection-string>
   JWT_SECRET_KEY=<your-jwt-secret>
   EMAIL_USER=<your-gmail-address>
   EMAIL_PASSWORD=<your-gmail-app-password>
   PORT=5000
   ```
4. Start the backend server:
   ```bash
   npm run dev
   ```

The backend listens by default on `http://localhost:5000`.

## Frontend Setup

1. Open a terminal in `Frontend/`
2. Install dependencies:
   ```bash
   cd Frontend
   npm install
   ```
3. Start the frontend development server:
   ```bash
   npm run dev
   ```

The frontend uses `http://localhost:5000/api` as the API base URL and will open in Vite's local development server.

## Environment Variables

For the backend, the app expects:
- `MONGO_URI` - MongoDB connection string
- `JWT_SECRET_KEY` - secret key for signing JWTs
- `EMAIL_USER` - Gmail email address used for sending OTPs
- `EMAIL_PASSWORD` - Gmail app password or SMTP password
- `PORT` - optional backend port (default is `5000`)

## Available API Endpoints

### Auth
- `POST /api/auth/register` - register a new user
- `POST /api/auth/login` - login and generate JWT
- `POST /api/auth/verify-otp` - verify email OTP and activate account

### Events
- `GET /api/events` - list events, optional query params `category` and `location`
- `GET /api/events/:id` - get event details
- `POST /api/events` - create an event (admin only)
- `PUT /api/events/:id` - update an event (admin only)
- `DELETE /api/events/:id` - delete an event (admin only)

### Bookings
- `POST /api/bookings/send-otp` - send booking OTP to authenticated user
- `POST /api/bookings` - create a booking request with OTP
- `PUT /api/bookings/:id/confirm` - confirm a booking (admin only)
- `GET /api/bookings/my` - fetch bookings for current user or all bookings for admin
- `DELETE /api/bookings/:id` - cancel a booking

## Notes

- The backend uses JWT tokens stored in `localStorage` by the frontend.
- Booking confirmation sends email notifications using the configured Gmail account.
- Admin users have access to event management and booking confirmation routes.

## Running in Production

- Build the frontend:
  ```bash
  cd Frontend
  npm run build
  ```
- Configure a production server for the built frontend and deploy the backend separately.

## License

This project does not include a license file. Add one if you want to share or publish it publicly.
