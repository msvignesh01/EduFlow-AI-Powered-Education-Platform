# 🚀 First-Time Setup Instructions

## Quick Start (3 commands)

```bash
# 1. Install dependencies
npm install

# 2. Setup environment file
npm run setup

# 3. Start development server
npm run dev
```

Then visit http://localhost:5173

## ⚠️ Important: Configure API Keys

After running the setup, edit the `.env` file with your actual API keys:

### 1. Google Gemini API Key
1. Go to https://aistudio.google.com/
2. Sign in and click "Get API Key" 
3. Create a new API key
4. Replace `your_gemini_api_key_here` in `.env`

### 2. Firebase Configuration  
1. Go to https://console.firebase.google.com/
2. Create a new project
3. Enable Authentication, Firestore, and Storage
4. Go to Project Settings > General > Your apps
5. Add a web app and copy the config values
6. Replace the Firebase values in `.env`

## 🔍 Verify Everything Works

```bash
# Check TypeScript compilation
npm run type-check

# Check code quality
npm run health

# Run tests (optional)
npm run test
```

## 🆘 Having Issues?

- **Dependencies not installing?** Use `npm install --legacy-peer-deps`
- **TypeScript errors?** Run `npm run type-check` to see details
- **Port 5173 in use?** Vite will automatically use the next available port
- **Need help?** Check the main README.md or open an issue

## 📁 What Gets Created

- `.env` - Your environment variables (add your API keys here)
- `node_modules/` - Project dependencies 
- `dist/` - Built files (after running `npm run build`)

## 🎯 Next Steps

1. Configure your API keys in `.env`
2. Start coding in the `src/` directory
3. The app will hot-reload as you make changes
4. Use `npm run build` when ready to deploy
