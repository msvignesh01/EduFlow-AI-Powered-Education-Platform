# 🎓 EduLearn Platform - Premium AI-Powered Educational Assistant

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![React](https://img.shields.io/badge/React-18.3.1-blue.svg)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.5.3-blue.svg)](https://www.typescriptlang.org/)
[![Firebase](https://img.shields.io/badge/Firebase-10.13.0-orange.svg)](https://firebase.google.com/)

A cutting-edge educational platform combining **Gemini 2.0 Flash** AI with **offline Gemma 3** capabilities, built with React 18, TypeScript, Firebase, and premium animations.

## ✨ Key Features

- 🤖 **Dual AI System**: Gemini 2.0 Flash (online) + Gemma 3 (offline)
- 🔥 **Firebase Backend**: Authentication, Firestore, Storage, Analytics
- 🎨 **Premium Animations**: Framer Motion with custom transitions
- 📱 **Fully Responsive**: Mobile-first design with Tailwind CSS
- 🔒 **Secure Authentication**: Firebase Auth with social login
- 📊 **Real-time Analytics**: Study patterns and progress tracking
- 🌙 **Dark/Light Theme**: System preference detection
- ♿ **Accessibility**: WCAG compliant with keyboard navigation

## 🚀 Super Quick Start (3 Commands)

```bash
git clone <your-repo-url>
npm install
npm run dev
```

The setup script will automatically create your `.env` file template!

## 🔧 Complete Setup Guide

### 1. Prerequisites

- **Node.js**: 18+ (LTS recommended)
- **npm**: 8+ or **yarn**: 1.22+
- **Git**: Latest version

### 2. Environment Setup

After running `npm install`, copy the generated `.env` file and add your API keys:

```bash
# Required API Keys
VITE_GEMINI_API_KEY=your_gemini_api_key_here
VITE_FIREBASE_API_KEY=your_firebase_api_key
VITE_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your-project-id
VITE_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=123456789
VITE_FIREBASE_APP_ID=1:123:web:abc123

# Optional Features (set to 'true' to enable)
VITE_ENABLE_ANALYTICS=true
VITE_ENABLE_OFFLINE_MODE=true
VITE_ENABLE_PREMIUM_FEATURES=true
```

### 3. Get API Keys

#### Gemini API Key
1. Visit [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Create a new API key
3. Copy to `VITE_GEMINI_API_KEY`

#### Firebase Configuration
1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Create a new project
3. Enable Authentication, Firestore, Storage
4. Copy config values from Project Settings

### 4. Available Scripts

```bash
# Development
npm run dev          # Start development server
npm run build        # Build for production
npm run preview      # Preview production build

# Maintenance
npm run setup        # Create .env file
npm run health       # Run type-check + lint
npm run type-check   # TypeScript validation
npm run lint         # ESLint check
npm run lint:fix     # Fix linting issues

# Utilities
npm run clean        # Clean node_modules and reinstall
npm run start        # Alias for dev
```

### 5. Development Workflow

```bash
# First time setup
npm run setup        # Creates .env file
# Edit .env with your API keys
npm run health       # Validate everything works
npm run dev          # Start coding!

# Regular development
npm run dev          # Development server
npm run type-check   # Check TypeScript
npm run build        # Test production build
```

## 🏗️ Project Structure

```
edu-learn-platform/
├── src/
│   ├── components/          # Reusable UI components
│   │   ├── animations/      # Premium motion components
│   │   ├── auth/           # Authentication forms
│   │   ├── layout/         # Layout components
│   │   └── ui/             # Base UI components
│   ├── pages/              # Route components
│   ├── lib/                # Utility libraries
│   ├── hooks/              # Custom React hooks
│   ├── context/            # React context providers
│   ├── types/              # TypeScript definitions
│   └── utils/              # Helper functions
├── public/                 # Static assets
├── dist/                   # Build output
├── .env                    # Environment variables
└── docs/                   # Documentation
```

## 🎯 Core Technologies

| Technology | Version | Purpose |
|------------|---------|---------|
| React | 18.3.1 | Frontend framework |
| TypeScript | 5.5.3 | Type safety |
| Vite | 5.4.2 | Build tool |
| Firebase | 10.13.0 | Backend services |
| Framer Motion | 12.23.12 | Animations |
| Tailwind CSS | 3.4.1 | Styling |
| React Router | 6.28.0 | Routing |
| Lucide React | 0.469.0 | Icons |

## 🔥 AI Integration

### Gemini 2.0 Flash (Online)
- Real-time responses
- Advanced reasoning
- Multimodal capabilities
- Rate limiting handled

### Gemma 3 (Offline) 
- Local processing
- Privacy focused
- Works without internet
- Automatic fallback

## 🎨 Premium Features

- **Micro-interactions**: Hover effects, loading states
- **Advanced Animations**: Custom Framer Motion variants
- **Responsive Design**: Mobile-first with breakpoint system
- **Theme System**: Dark/light mode with smooth transitions
- **Performance**: Code splitting, lazy loading, optimization
- **SEO**: Meta tags, Open Graph, structured data

## 🐛 Troubleshooting

### Common Issues

**Build Errors:**
```bash
npm run clean        # Clear cache and reinstall
npm run health       # Check for issues
```

**API Errors:**
- Verify API keys in `.env` file
- Check Firebase project configuration
- Ensure services are enabled in Firebase Console

**Development Server:**
```bash
# If dev server won't start
npm run setup        # Recreate .env
npm install          # Reinstall dependencies
npm run dev          # Try again
```

**TypeScript Errors:**
```bash
npm run type-check   # See specific errors
# Most issues are unused variables (warnings only)
```

### Performance Tips

1. **API Rate Limits**: Implemented automatic retry with backoff
2. **Bundle Size**: Automatic code splitting configured
3. **Offline Mode**: Service worker handles offline functionality
4. **Caching**: Firebase and browser caching optimized

## 📱 Browser Support

- **Chrome**: 90+
- **Firefox**: 88+
- **Safari**: 14+
- **Edge**: 90+

## 🚀 Deployment

### Netlify (Recommended)
```bash
npm run build
# Upload dist/ folder to Netlify
```

### Vercel
```bash
npm run build
vercel --prod
```

### Firebase Hosting
```bash
npm run build
firebase deploy
```

## 🤝 Contributing

1. Fork the repository
2. Create feature branch: `git checkout -b feature/amazing-feature`
3. Run tests: `npm run health`
4. Commit changes: `git commit -m 'Add amazing feature'`
5. Push branch: `git push origin feature/amazing-feature`
6. Open Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [Google AI](https://ai.google.dev/) for Gemini API
- [Firebase](https://firebase.google.com/) for backend services
- [Framer Motion](https://www.framer.com/motion/) for animations
- [Tailwind CSS](https://tailwindcss.com/) for styling
- [Lucide](https://lucide.dev/) for beautiful icons

## 📞 Support

- 📧 Email: support@edulearn.com
- 💬 Discord: [Join our community](https://discord.gg/edulearn)
- 📚 Docs: [Documentation](https://docs.edulearn.com)
- 🐛 Issues: [GitHub Issues](https://github.com/yourusername/edu-learn-platform/issues)

---

**Built with ❤️ by the EduLearn Team**
