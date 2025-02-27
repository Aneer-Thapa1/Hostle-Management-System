# Hostel Ease - Hostel Finding and Management Platform

## Overview

Hostel Ease is a web platform that helps users find hostels based on their location, budget, and preferences. It allows users to browse hostels based on price, facilities, and other filters. The platform also includes an admin panel where hostel owners can manage hostel listings, and a superadmin who verifies the authenticity of hostels.

## Features

### Best Features:

- 💬 **Real-time Chat:** Users can chat with hostel owners and admins in real-time for quick inquiries.
- 🗺️ **Interactive Map:** Users can explore hostel locations through an interactive map.
- 📅 **Online Booking System:** Users can book hostels directly through the platform.



### User Features:

- 🔍 **Search for Hostels:** Users can search hostels by location and personal needs.
- 💰 **Filter by Price:** Users can browse hostels according to their budget.
- 🏠 **View Hostel Details:** Each hostel listing includes images, amenities, pricing, and location details.
- 📝 **Booking Inquiry:** Users can contact hostel owners for inquiries or reservations.

### Admin Features:

- 🏠 **Manage Hostel Listings:** Admins can add, edit, or delete hostel details.
- 📊 **Control Visibility:** Admins decide what information is displayed to users.
- 📩 **Manage User Inquiries:** Admins can respond to user inquiries regarding hostel availability.

### Superadmin Features:

- ✅ **Verify Hostel Authenticity:** Ensures that listed hostels are genuine before they appear on the platform.
- 🏗️ **Manage Admins:** Controls access and permissions for hostel admins.
- 🔒 **Platform Security & Compliance:** Ensures all hostels meet platform guidelines.

## Tech Stack

- **Frontend:** React.js, Tailwind CSS
- **Backend:** Node.js, Express.js
- **Database:** PostgreSQL (with Prisma ORM)
- **Authentication:** JWT Authentication
- **Hosting:** Vercel (Frontend), Render/Heroku (Backend)

## Installation & Setup

### Prerequisites

Ensure you have the following installed:

- Node.js (>= 16.x)
- PostgreSQL
- Git

### Clone the Repository

```sh
git clone https://github.com/yourusername/hostel-ease.git
cd hostel-ease
```

### Backend Setup

```sh
cd backend
npm install
cp .env.example .env # Configure your database & secrets
npx prisma migrate dev  # Run database migrations
npm start
```

### Frontend Setup

```sh
cd frontend
npm install
npm run dev
```

### Running the Project

Once both frontend and backend are running, open `http://localhost:5173` to access the platform.

## Future Enhancements

- ⭐ **Advanced Payment Integration**

- ⭐ **AI-based Hostel Recommendations**

- ⭐ **Enhanced Security Features**

- ⭐ **Payment Integration**

##

## License

MIT License

