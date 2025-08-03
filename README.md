# EduLearn Platform

A modern educational platform built with React, TypeScript, FastAPI, and Google Gemini AI.

## Features

- 📚 PDF and document processing
- 🤖 AI-powered content generation using Google Gemini 2.0 Flash
- 👤 User authentication and authorization
- 📊 Study session tracking
- 🎯 Quiz generation
- 📱 Responsive design with dark/light theme
- 🔒 Secure API with JWT authentication

## Tech Stack

### Frontend
- **React 18** with TypeScript
- **Vite** for fast development
- **Tailwind CSS** for styling
- **Zustand** for state management
- **React Router** for navigation
- **Firebase** for authentication
- **Lucide React** for icons

### Backend
- **FastAPI** with Python
- **SQLAlchemy** with SQLite database
- **Google Gemini 2.0 Flash** for AI content generation
- **JWT** for authentication
- **Pydantic** for data validation
- **Alembic** for database migrations

## Setup Instructions

### Prerequisites
- Node.js 18+ and npm
- Python 3.8+
- Google Gemini API key

### Backend Setup

1. Navigate to the backend directory:
   ```bash
   cd project/backend
   ```

2. Create a virtual environment:
   ```bash
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   ```

3. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```

4. Create environment file:
   ```bash
   cp .env.example .env
   ```

5. Update `.env` with your configuration:
   ```env
   GEMINI_API_KEY=your_gemini_api_key_here
   SECRET_KEY=your_secret_key_here_change_in_production
   DATABASE_URL=sqlite:///./app.db
   ALLOWED_ORIGINS=http://localhost:5173,http://localhost:3000
   ENVIRONMENT=development
   ```

6. Run the backend server:
   ```bash
   python run.py
   ```

The API will be available at `http://localhost:8000`

### Frontend Setup

1. Navigate to the project directory:
   ```bash
   cd project
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create environment file:
   ```bash
   cp .env.example .env
   ```

4. Update `.env` with your configuration:
   ```env
   VITE_API_URL=http://localhost:8000
   VITE_GEMINI_API_KEY=your_gemini_api_key_here
   VITE_FIREBASE_API_KEY=your_firebase_api_key
   VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
   VITE_FIREBASE_PROJECT_ID=your_project_id
   VITE_FIREBASE_STORAGE_BUCKET=your_project.firebasestorage.app
   VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
   VITE_FIREBASE_APP_ID=your_app_id
   ```

5. Run the development server:
   ```bash
   npm run dev
   ```

The frontend will be available at `http://localhost:5173`

## API Documentation

Once the backend is running, visit `http://localhost:8000/docs` for interactive API documentation.

## Key Improvements Made

1. **Security Enhancements**:
   - Environment variables for sensitive data
   - JWT authentication
   - Proper CORS configuration
   - Password hashing with bcrypt

2. **Database Layer**:
   - SQLAlchemy ORM with SQLite
   - User management
   - Content generation tracking
   - File upload logging

3. **AI Integration**:
   - Migrated from OpenAI to Google Gemini 2.0 Flash
   - Improved error handling
   - Backend-only API calls for security

4. **Production Ready**:
   - Proper logging
   - Input validation with Pydantic
   - Error handling
   - Health check endpoints

5. **Developer Experience**:
   - TypeScript throughout
   - Centralized API client
   - Environment configuration
   - Clear project structure

## Development

### Running the Development Server

```bash
# Frontend
npm run dev

# Backend (in separate terminal)
cd backend
python run.py
```

### Building for Production

```bash
npm run build
npm run preview  # Test production build locally
```

### Docker Deployment

```bash
# Build Docker image
npm run docker:build

# Run Docker container
npm run docker:run
```

## Architecture

### Frontend Architecture
- **React 18** with TypeScript for type safety
- **Zustand** for state management with persistence
- **React Router** for client-side routing
- **Tailwind CSS** for utility-first styling
- **Custom hooks** for API integration and reusable logic
- **Error boundaries** for graceful error handling
- **Performance monitoring** and optimization

### Backend Architecture
- **FastAPI** with async/await support
- **SQLAlchemy** ORM with SQLite database
- **JWT authentication** with secure token handling
- **Pydantic** for data validation and serialization
- **Google Gemini 2.0 Flash** for AI content generation
- **Comprehensive error handling** and logging

### Security Features
- Environment variable configuration
- JWT token authentication
- CORS protection
- Input validation and sanitization
- Security headers in production
- Error handling without information leakage

## Performance Optimizations

- Code splitting and lazy loading
- Bundle optimization with Vite
- Image optimization
- Gzip compression
- Caching strategies
- Performance monitoring

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Make your changes
4. Run tests and linting (`npm run lint`)
5. Commit your changes (`git commit -m 'Add amazing feature'`)
6. Push to the branch (`git push origin feature/amazing-feature`)
7. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Support

For support, email support@edulearn.com or join our Slack channel.
