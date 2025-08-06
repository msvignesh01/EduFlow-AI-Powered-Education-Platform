# 🎓 EduFlow - AI Educational Platform

> A modern educational platform with dual AI support (Gemini 2.0 + Gemma 3), Firebase backend, and premium responsive design.

[![React](https://img.shields.io/badge/React-18.3.1-blue.svg)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.5.3-blue.svg)](https://www.typescriptlang.org/)
[![Firebase](https://img.shields.io/badge/Firebase-10.13.0-orange.svg)](https://firebase.google.com/)
[![Vite](https://img.shields.io/badge/Vite-5.4.2-purple.svg)](https://vitejs.dev/)
[![License](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)

## ✨ Key Features

### 🧠 **Dual AI Architecture**
- **Gemini 2.0 Flash**: Online AI for high-quality educational responses
- **Gemma 3 Offline**: Simulated offline AI for uninterrupted learning
- **Smart Model Switching**: Automatic fallback between online/offline modes
- **Response Caching**: Intelligent caching for improved performance

### 🔥 **Firebase Backend (No SQL Database)**
- **Authentication**: Email/password login with Firebase Auth
- **Firestore Database**: NoSQL document database with offline sync
- **Cloud Storage**: File uploads for PDFs, documents, images
- **Real-time Updates**: Live data synchronization across devices
- **Analytics**: User behavior tracking and insights

### 🎨 **Premium UI/UX**
- **Responsive Design**: Perfect experience on all screen sizes
- **Premium Animations**: Framer Motion micro-interactions
- **Dark/Light Mode**: Automatic theme switching
- **Accessibility**: WCAG 2.1 AA compliant design

## 🚀 Quick Start

### ⚡ Super Quick Setup (3 commands)

```bash
# 1. Clone and navigate
git clone https://github.com/msrishav-28/Educational-Platform.git
cd Educational-Platform

# 2. Install everything and setup
npm install

# 3. Start development server
npm run dev
```

**🌐 Open http://localhost:5173 in your browser**

### 🔑 Configure API Keys (Required for AI features)

The setup automatically creates a `.env` file. Edit it with your API keys:

```bash
# Edit .env file with your actual keys
VITE_GEMINI_API_KEY=your_actual_gemini_api_key_here
VITE_FIREBASE_API_KEY=your_firebase_api_key
# ... other Firebase config
```

**📋 [Get API Keys Guide](#-api-keys-setup)** | **📖 [Detailed Setup](QUICKSTART.md)**

### Prerequisites
```bash
# Required
Node.js 18+ and npm 9+
```

**That's it! The project includes all dependencies and auto-setup.**

## 🔑 API Keys Setup

### 1. Google Gemini API Key
1. Go to [Google AI Studio](https://aistudio.google.com/)
2. Sign in and click "Get API Key"
3. Create a new API key
4. Add to `.env` file:
```env
VITE_GEMINI_API_KEY=your_actual_gemini_api_key_here
```

### 2. Firebase Configuration
1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Create a new project
3. Enable these services:
   - **Authentication** (Email/Password provider)
   - **Firestore Database** (Start in test mode)
   - **Storage** (Start in test mode)
4. Go to Project Settings > General > Your apps
5. Add a web app and copy the config
6. Add to `.env` file:
```env
VITE_FIREBASE_API_KEY=your_firebase_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_project.firebasestorage.app
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id
```

## 🏗️ Project Architecture

### Frontend-Only Design
This is a **single-page application (SPA)** that runs entirely in the browser:

```
Frontend (React + TypeScript)
├── AI Services (Gemini 2.0 + Gemma 3)
├── Firebase Backend Services
│   ├── Authentication
│   ├── Firestore Database  
│   ├── Cloud Storage
│   └── Analytics
└── Local Storage (Offline Caching)
```

### Why No Traditional Backend?
- **Firebase handles everything**: Database, auth, storage, hosting
- **AI runs client-side**: Direct API calls to Gemini
- **Offline-first**: Works without internet connection
- **Scalable**: Firebase auto-scales based on usage
- **Cost-effective**: Pay only for what you use

## 📁 Project Structure

```
src/
├── components/           # React components
│   ├── auth/            # Login/register forms
│   ├── layout/          # Header, sidebar, navigation
│   ├── premium/         # AI chat components
│   └── ui/              # Reusable UI components
├── hooks/               # Custom React hooks
│   ├── useOfflineSync.ts   # Firebase offline sync
│   └── useApi.ts           # API management
├── lib/                 # Core services
│   ├── aiService.ts     # Dual AI model service
│   ├── firebase.ts      # Firebase configuration
│   ├── gemini.ts        # Gemini API integration
│   └── storageService.ts # Local storage management
├── pages/               # Main application pages
│   ├── Dashboard.tsx    # User dashboard
│   ├── ChatPage.tsx     # AI chat interface
│   └── Profile.tsx      # User profile
├── store/               # State management (Zustand)
├── types/               # TypeScript definitions
└── utils/               # Helper functions
```

## 🎯 Core Functionality

### AI Chat System
```typescript
// Dual AI with automatic fallback
import { aiService } from './lib/aiService';

const response = await aiService.generateContent(prompt, {
  model: 'auto', // Switches between Gemini 2.0 and Gemma 3
  context: 'educational'
});
```

### Firebase Integration
```typescript
// Real-time data with offline support
import { useOfflineSync } from './hooks/useOfflineSync';

const { syncStatus, saveData, getData } = useOfflineSync({
  enableRealTime: true,
  collections: ['user_data', 'study_sessions']
});
```

### Offline-First Storage
```typescript
// Smart caching with compression
import { storageService } from './lib/storageService';

await storageService.setItem('study_data', data, {
  ttl: 24 * 60 * 60 * 1000, // 24 hours
  compress: true
});
```

## 🛠️ Available Scripts

```bash
# Development
npm run dev              # Start development server
npm run build           # Build for production
npm run preview         # Preview production build

# Code Quality
npm run lint            # ESLint code checking
npm run type-check      # TypeScript validation
npm run format          # Prettier code formatting

# Testing
npm run test            # Run unit tests
npm run test:coverage   # Test coverage report

# Deployment
npm run firebase:deploy # Deploy to Firebase Hosting
```

## 🧪 Testing the Application

### 1. AI Features (Without API Keys)
- Chat interface will show "Please configure API keys" message
- Offline mode will use simulated Gemma 3 responses
- All UI interactions work normally

### 2. AI Features (With API Keys)
- Real Gemini 2.0 responses for online mode
- Automatic fallback to offline mode when disconnected
- Response caching for improved performance

### 3. Firebase Features
- User registration and login
- Real-time data synchronization
- File upload functionality
- Offline data persistence

## 🚀 Deployment Options

### Firebase Hosting (Recommended)
```bash
# Install Firebase CLI
npm install -g firebase-tools

# Login and initialize
firebase login
firebase init hosting

# Deploy
npm run build
firebase deploy
```

### Vercel (Alternative)
```bash
# Install Vercel CLI
npm install -g vercel

# Deploy
vercel
```

### Netlify (Alternative)
```bash
# Build the project
npm run build

# Upload dist/ folder to Netlify
```

## 🔧 Configuration Options

### Environment Variables
```env
# AI Configuration
VITE_GEMINI_API_KEY=your_gemini_api_key
VITE_ENABLE_GEMMA_OFFLINE=true

# Firebase Configuration
VITE_FIREBASE_API_KEY=your_firebase_api_key
# ... other Firebase config

# Feature Flags
VITE_ENABLE_ANALYTICS=true
VITE_ENABLE_OFFLINE_MODE=true
VITE_DEBUG=false
```

### Firebase Security Rules
```javascript
// Firestore rules (for production)
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
  }
}
```

## 🎓 Educational Features

### Study Management
- **PDF Upload & Analysis**: Upload study materials for AI analysis
- **Note Generation**: AI-powered note creation from content
- **Quiz Creation**: Automatic quiz generation from study materials
- **Progress Tracking**: Detailed learning analytics and insights

### AI Tutoring
- **Personalized Help**: AI adapts to individual learning styles
- **Code Assistance**: Programming help and debugging support
- **Concept Explanation**: Complex topics explained simply
- **Practice Problems**: Generated based on knowledge gaps

### Collaboration
- **Real-time Sharing**: Share notes and quizzes with classmates
- **Group Study**: Collaborative study sessions
- **Teacher Dashboard**: Instructor tools for monitoring progress

## 🔒 Security & Privacy

- **Firebase Auth**: Secure authentication with email/password
- **Data Encryption**: Sensitive data encrypted at rest
- **API Key Security**: Keys stored securely in environment variables
- **Privacy First**: No unnecessary data collection
- **GDPR Compliant**: User data rights respected

## � Performance Features

- **Code Splitting**: Automatic route-based code splitting
- **Lazy Loading**: Components load on demand
- **Smart Caching**: AI responses and data cached intelligently
- **Offline Support**: Full functionality without internet
- **Bundle Optimization**: Minimized bundle sizes for fast loading

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Make your changes and test thoroughly
4. Commit: `git commit -m 'Add amazing feature'`
5. Push: `git push origin feature/amazing-feature`
6. Open a Pull Request

### Development Guidelines
- Follow TypeScript best practices
- Maintain responsive design principles
- Write tests for new features
- Update documentation for changes
- Follow existing code style and conventions

## 🐛 Troubleshooting

### Common Issues

**1. Build Errors**
```bash
# Clear cache and reinstall
npm run clean
rm -rf node_modules package-lock.json
npm install
```

**2. API Key Issues**
```bash
# Check .env file exists and has correct format
cat .env

# Restart dev server after adding keys
npm run dev
```

**3. Firebase Connection**
```bash
# Verify Firebase config in browser console
# Should see: firebase.app() returns [object Object]
```

**4. TypeScript Errors**
```bash
# Run type checking
npm run type-check

# Update dependencies if needed
npm update
```

### Getting Help
- 🐛 **Issues**: [GitHub Issues](https://github.com/msrishav-28/Educational-Platform/issues)
- 💬 **Discussions**: [GitHub Discussions](https://github.com/msrishav-28/Educational-Platform/discussions)
- � **Wiki**: [Project Wiki](https://github.com/msrishav-28/Educational-Platform/wiki)

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🎉 Acknowledgments

- **Google AI** for Gemini 2.0 Flash API
- **Firebase** for backend infrastructure
- **React Team** for the amazing framework
- **Vite** for lightning-fast development
- **Open Source Community** for inspiration and tools

---

## 📈 Project Status

- ✅ **Frontend**: React + TypeScript + Vite
- ✅ **Backend**: Firebase (Auth + Firestore + Storage)
- ✅ **AI Models**: Gemini 2.0 Flash + Gemma 3 (simulated)
- ✅ **Deployment**: Ready for Firebase Hosting
- ✅ **Documentation**: Complete setup guide
- ✅ **Testing**: Unit tests and type checking

**Made with ❤️ for education**

[![GitHub stars](https://img.shields.io/github/stars/msrishav-28/Educational-Platform?style=social)](https://github.com/msrishav-28/Educational-Platform)
[![GitHub forks](https://img.shields.io/github/forks/msrishav-28/Educational-Platform?style=social)](https://github.com/msrishav-28/Educational-Platform)

## 🛠️ Technology Stack

### Core Framework
- **React 18.3.1** with TypeScript for type safety
- **Vite 5.4.2** for lightning-fast development
- **Tailwind CSS** for utility-first styling

### AI & Backend
- **Google Gemini 2.0 Flash** for online AI responses
- **Gemma 3 Offline** (simulated) for offline functionality
- **Firebase** for authentication, database, and storage

### Premium Features
- **Framer Motion** for premium animations
- **React Router** for navigation
- **Zustand** for state management
- **React Hook Form** with Zod validation

## 📱 Screenshots

![Dashboard](screenshots/dashboard.png)
*Premium dashboard with real-time analytics*

![AI Chat](screenshots/ai-chat.png)
*Dual AI chat with online/offline support*

![Responsive Design](screenshots/responsive.png)
*Perfect responsive design across all devices*

## 🎯 Core Components

### AI Chat System
```typescript
import { PremiumAIChat } from './components/premium/PremiumAIChat';

<PremiumAIChat 
  enableDualAI={true}
  offlineFallback={true}
  cacheResponses={true}
/>
```

### Firebase Integration
```typescript
import { useOfflineSync } from './hooks/useOfflineSync';

const { syncStatus, saveData, getData } = useOfflineSync({
  enableRealTime: true,
  collections: ['user_data', 'study_sessions']
});
```

### Premium Storage
```typescript
import { storageService } from './lib/storageService';

await storageService.setItem('data', value, {
  ttl: 24 * 60 * 60 * 1000,
  compress: true
});
```

## 📊 Performance Features

- **Code Splitting**: Automatic route-based splitting
- **Lazy Loading**: Components load on demand
- **Smart Caching**: AI response and data caching
- **Offline Support**: Full functionality without internet
- **Bundle Analysis**: Optimized build sizes

## 🔧 Available Scripts

```bash
# Development
npm run dev              # Start development server
npm run build           # Build for production
npm run preview         # Preview production build

# Code Quality
npm run lint            # Check for issues
npm run type-check      # TypeScript validation
npm run format          # Format code

# Testing
npm run test            # Run tests
npm run test:coverage   # Coverage report

# Firebase
npm run firebase:emulators  # Local development
npm run firebase:deploy     # Deploy to Firebase
```

## 🔑 Environment Configuration

Create a `.env` file with your API keys:

```env
# Required: Gemini AI
VITE_GEMINI_API_KEY=your_gemini_api_key_here

# Required: Firebase
VITE_FIREBASE_API_KEY=your_firebase_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_project.firebasestorage.app
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id

# Optional: Features
VITE_ENABLE_ANALYTICS=true
VITE_ENABLE_OFFLINE_MODE=true
```

## 🎓 Educational Features

### Study Management
- **PDF Processing**: Upload and analyze study materials
- **Note Taking**: AI-powered note generation
- **Quiz Creation**: Automatic quiz generation from content
- **Progress Tracking**: Detailed learning analytics

### AI Tutoring
- **Personalized Help**: AI adapts to learning style
- **Code Assistance**: Programming help and debugging
- **Concept Explanation**: Complex topics made simple
- **Practice Problems**: Generated based on knowledge gaps

## 🔒 Security & Privacy

- **Secure Authentication**: Firebase Auth with email/password
- **Data Encryption**: Sensitive data encrypted at rest
- **Privacy First**: No unnecessary data collection
- **GDPR Compliant**: User data rights respected

## 🚀 Deployment Options

### Firebase Hosting (Recommended)
```bash
npm run firebase:deploy
```

### Vercel
```bash
npm install -g vercel
vercel
```

### Netlify
```bash
npm run build
# Upload dist/ folder
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Commit changes: `git commit -m 'Add amazing feature'`
4. Push to branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

### Development Guidelines
- Follow TypeScript best practices
- Maintain responsive design principles
- Write tests for new features
- Update documentation

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

- 📧 **Email**: support@edulearn.com
- 🐛 **Issues**: [GitHub Issues](https://github.com/msrishav-28/Educational-Platform/issues)
- 💬 **Discussions**: [GitHub Discussions](https://github.com/msrishav-28/Educational-Platform/discussions)
- 📖 **Documentation**: [Complete Setup Guide](SETUP.md)

## 🎉 Acknowledgments

- Google AI for Gemini 2.0 Flash API
- Firebase for backend infrastructure
- React team for the amazing framework
- Open source community for inspiration

---

**Made with ❤️ for education**

[![GitHub stars](https://img.shields.io/github/stars/msrishav-28/Educational-Platform?style=social)](https://github.com/msrishav-28/Educational-Platform)
[![GitHub forks](https://img.shields.io/github/forks/msrishav-28/Educational-Platform?style=social)](https://github.com/msrishav-28/Educational-Platform)
