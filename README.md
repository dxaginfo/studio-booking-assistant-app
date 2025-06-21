# Studio Booking Assistant

A comprehensive web application for managing recording studio bookings, coordinating with staff, and sending preparation materials to clients.

## 🎵 Overview

Studio Booking Assistant is designed to streamline the operations of recording studios, providing an intuitive interface for both studio managers and musicians. It handles the entire booking lifecycle, from availability management to post-session follow-ups.

## ✨ Features

- **User Management** - Role-based accounts for admins, staff, and clients
- **Studio Management** - Add and manage multiple studios with detailed information
- **Equipment Inventory** - Track available equipment and attach to bookings
- **Smart Booking System** - Real-time availability, conflict resolution, and calendar views
- **Staff Coordination** - Assign staff to sessions and manage their schedules
- **Automated Notifications** - Send booking confirmations, reminders, and updates
- **Preparation Materials** - Create and send session prep instructions to clients
- **Payment Processing** - Secure online payments with comprehensive reporting
- **Calendar Integration** - Sync bookings with personal calendars

## 🛠️ Technology Stack

### Frontend:
- React.js with TypeScript
- Redux for state management
- Material-UI for responsive interface
- Formik with Yup for form validation
- Axios for API communication
- FullCalendar.js for calendar functionality

### Backend:
- Node.js with Express
- RESTful API architecture
- JWT authentication
- Nodemailer for email services

### Database:
- PostgreSQL for data storage
- Redis for caching and performance

### DevOps:
- Docker containerization
- GitHub Actions for CI/CD
- AWS hosting

### Third-Party Integrations:
- Stripe for payments
- Google Calendar/iCal integration
- SendGrid for email delivery
- Twilio for SMS notifications

## 🚀 Getting Started

### Prerequisites
- Node.js (v14.x or higher)
- npm or yarn
- PostgreSQL
- Redis

### Installation

1. Clone the repository
```bash
git clone https://github.com/dxaginfo/studio-booking-assistant-app.git
cd studio-booking-assistant-app
```

2. Install dependencies
```bash
# Install frontend dependencies
cd client
npm install

# Install backend dependencies
cd ../server
npm install
```

3. Set up environment variables
```bash
# Copy the sample environment files
cp client/.env.example client/.env
cp server/.env.example server/.env

# Update the environment variables with your settings
```

4. Initialize the database
```bash
cd server
npm run db:migrate
npm run db:seed
```

5. Start the application
```bash
# Start the backend server
cd server
npm run dev

# In a new terminal, start the frontend
cd client
npm start
```

## 📊 Project Structure

```
studio-booking-assistant/
├── client/                 # Frontend React application
│   ├── public/             # Static files
│   ├── src/                # Source files
│   │   ├── components/     # Reusable UI components
│   │   ├── pages/          # Page components
│   │   ├── services/       # API services
│   │   ├── store/          # Redux store
│   │   └── utils/          # Utility functions
│   └── package.json        # Frontend dependencies
│
├── server/                 # Backend Node.js/Express application
│   ├── src/                # Source files
│   │   ├── config/         # Configuration files
│   │   ├── controllers/    # Request controllers
│   │   ├── models/         # Database models
│   │   ├── routes/         # API routes
│   │   ├── services/       # Business logic
│   │   └── utils/          # Utility functions
│   ├── migrations/         # Database migrations
│   └── package.json        # Backend dependencies
│
├── docker/                 # Docker configuration
├── .github/                # GitHub Actions workflows
└── README.md               # Project documentation
```

## 🔒 Security Considerations

- Secure authentication with JWT
- HTTPS for all communications
- Input validation on both client and server
- Parameterized queries to prevent SQL injection
- Regular security updates
- Secure storage of sensitive information
- Rate limiting to prevent abuse

## 📝 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the project
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📧 Contact

For any questions or feedback, please reach out to us at [contact@studiobookingassistant.com](mailto:contact@studiobookingassistant.com)