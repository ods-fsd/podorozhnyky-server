# Podorozhnyky Server

A RESTful API backend for the "Podorozhnyky" (Travelers) application. The platform allows users to create, read, and manage travel stories, add favorite stories, update user profiles, and use Google OAuth for seamless authentication.

## 🚀 Features

- **Authentication & Authorization**: Email/password registration, login, and JWT-based session management.
- **Google OAuth**: Alternative sign-in using Google accounts.
- **Password Reset**: Secure password recovery via email (using Nodemailer & Brevo SMTP).
- **Users Profile Management**: Update avatar and description.
- **Stories**: CRUD operations for travel stories with image uploads.
- **Image Uploads**: Cloudinary integration for storing story images and user avatars.
- **Categories**: Browse stories by predefined categories.
- **Favorites**: Users can save stories to their favorites list.
- **API Documentation**: Interactive Swagger UI documentation.

## 🛠 Technologies & Tools

- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MongoDB with Mongoose ORM
- **Authentication**: JWT, bcrypt, google-auth-library
- **File Uploads**: Multer, Cloudinary
- **Emails**: Nodemailer, Handlebars
- **Validation**: Joi
- **Documentation**: Swagger UI
- **Logging**: Pino

## 🏁 Getting Started

### Prerequisites

- Node.js (v18 or higher recommended)
- MongoDB instance (local or Atlas)
- Cloudinary account for media
- Google Cloud Console project configured for OAuth
- Brevo (or any SMTP) account for email sending

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/ods-fsd/podorozhnyky-server.git
   cd podorozhnyky-server
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Configure Environment Variables:
   Create a `.env` file in the root directory and configure it using the provided `.env.example` structure. See [Environment Variables](#-environment-variables) for details.

4. Start the server:
   ```bash
   # Development mode (with auto-reload)
   npm run dev

   # Production mode
   npm start
   ```

The server will run at `http://localhost:<PORT>` (default is usually 5000).

## ⚙️ Environment Variables

Create a `.env` file in the root of the project with the following variables:

```env
# Server
PORT=5000
APP_DOMAIN=http://localhost:3000

# MongoDB Configuration
MONGODB_USER=your_db_username
MONGODB_PASSWORD=your_db_password
MONGODB_URL=mongodb+srv://...
MONGODB_DB=your_db_name

# JSON Web Token
JWT_SECRET=your_jwt_secret_key

# Cloudinary (Image Uploads)
CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
CLOUDINARY_URL=cloudinary://API_KEY:API_SECRET@CLOUD_NAME

# Google OAuth
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
GOOGLE_REDIRECT_URI=http://localhost:3000/auth/google-redirect

# SMTP Configuration (For Password Rest)
SMTP_PORT=587
SMTP_HOST=smtp-relay.brevo.com
SMTP_USER=your_smtp_username
SMTP_PASSWORD=your_smtp_password
SMTP_FROM=your_sender_email@example.com
```

## 📚 API Documentation

Once the server is running, the interactive Swagger documentation will be available at:

```
http://localhost:<PORT>/api-docs
```
*(If the `/api-docs` route is configured differently, adjust the path accordingly, often it's `/api-docs` or `/docs`)*

## 📝 Scripts

- `npm run dev`: Starts the application in development mode with `node --watch`.
- `npm start`: Starts the application for production.

## 📄 License

This project is licensed under the ISC License.
