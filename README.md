# Lovelle Clinic CRM

Lovelle is a luxury medspa CRM portfolio project built with React, Firebase, and Tailwind CSS. It is designed for boutique wellness clinics to manage clients, appointments, notes, treatment history, and workspace settings through a calm SaaS interface.

## Features

- Firebase Authentication login
- Protected application routes
- Real-time Firestore client records
- Client profiles with editable details
- Client notes and tags
- Appointment booking, editing, deletion, and completion
- Completed appointments saved into client treatment history
- Firestore-backed workspace settings
- Responsive SaaS layout with reusable UI components

## Tech Stack

- React
- Vite
- Tailwind CSS
- Firebase Authentication
- Firebase Firestore
- Firebase Storage setup
- React Router
- Lucide React

## Getting Started

Install dependencies:

```bash
npm install
```

Run the development server:

```bash
npm run dev
```

Build for production:

```bash
npm run build
```

## Project Structure

```text
src/
  components/
  components/ui/
  constants/
  pages/
  utils/
  App.jsx
  firebase.js
  index.css
  main.jsx
```

## Portfolio Note

This project is a polished portfolio SaaS prototype. Core CRM workflows use real Firebase data, while external services such as email reminders are intentionally not included.
