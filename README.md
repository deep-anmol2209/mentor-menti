<h1 align="center">Mentor Menti</h1>

<p align="center">
A full-stack mentorship booking platform that connects mentors and mentees for <b>1-on-1 sessions</b> and <b>structured courses</b> with secure payments and automated meeting scheduling.
</p>

<p align="center">
Book • Pay • Meet • Get Notified
</p>

---

## Table of Contents
- [About the Project](#about-the-project)
- [Roles & Access](#roles--access)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [System Workflow](#system-workflow)
- [Dummy Section for Scroll Test](#dummy-section-for-scroll-test)


---

## About the Project

**Mentor Menti** is a mentorship marketplace where users can sign up either as a **Mentor** or a **Mentee**.

Mentors can create paid services, manage bookings, view payments, and reschedule sessions.  
Mentees can discover mentors, book services, make payments, and attend sessions via **automatically generated Zoom meeting links**.

### Platform Focus
- Smooth booking experience
- Secure payments
- Real-time scheduling updates
- Automated email notifications

---

## Roles & Access

### Mentor
- Sign up & log in
- Create, edit, and delete services
- Manage bookings and schedules
- View payment details
- Reschedule sessions

### Mentee
- Sign up & log in
- Browse mentors and services
- Book sessions and complete payments
- View bookings and meeting details
- Confirm rescheduled time slots

---

## Features

### Authentication
- Mentor & Mentee signup/login
- Forgot password functionality
- Change password from dashboard

### Mentor Features
- Create services with:
  - Service name
  - Price
  - Description
  - Available time slots
- Two service types:
  - Fixed Course
  - One-on-One Session
- View bookings in dashboard
- View payments
- Reschedule bookings by updating time slots

### Mentee Features
- View mentors and their services
- Book services by selecting time slots
- Secure payment flow
- Receive updated slots if mentor reschedules
- Confirm new schedule from dashboard
- View bookings and meeting links

---

## 📹 Zoom Integration
- Zoom API is triggered after successful payment
- Automatically creates a meeting for the booked date & time
- Meeting link is stored in the database
- Accessible to both mentor and mentee

---

## 📧 Email Notifications
Emails are sent to **both mentor and mentee** when:
- Booking is completed
- Session is scheduled or rescheduled

---

## Tech Stack

### Frontend
- React / Next.js
- Tailwind CSS
- Axios

### Backend
- Node.js
- Express.js
- REST APIs

### Database
- MongoDB

### Integrations & Tools
- Zoom API (Meeting creation)
- Nodemailer (Email notifications)
- JWT Authentication
- Git & GitHub

---

## System Workflow

### Booking Flow

- Mentee selects a mentor  
  ↓
- Chooses a service  
  ↓
- Selects an available time slot  
  ↓
- Completes payment  
  ↓
- Zoom API generates meeting link  
  ↓
- Booking stored in database  
  ↓
- Email notifications sent  
  ↓
- Session visible in both dashboards



