# 🚀 Deployment Guide

This guide covers deploying the EduLearn Platform to various hosting providers.

## 📋 Prerequisites

- Node.js 18+ and npm
- Python 3.9+
- Google Gemini API key
- Git repository

## 🌐 Frontend Deployment

### Vercel (Recommended)

1. **Connect Repository**
   ```bash
   # Push to GitHub
   git add .
   git commit -m "Deploy to production"
   git push origin main
   ```

2. **Deploy to Vercel**
   - Visit [vercel.com](https://vercel.com)
   - Import your GitHub repository
   - Configure build settings:
     - Framework Preset: `Vite`
     - Build Command: `npm run build`
     - Output Directory: `dist`
     - Install Command: `npm install`

3. **Environment Variables**
   ```env
   VITE_API_URL=https://your-backend-url.com
   VITE_ENVIRONMENT=production
   ```

### Netlify

1. **Build Settings**
   - Build command: `npm run build`
   - Publish directory: `dist`
   - Node version: `18`

2. **Environment Variables**
   ```env
   VITE_API_URL=https://your-backend-url.com
   VITE_ENVIRONMENT=production
   ```

3. **Redirects** (Create `public/_redirects`)
   ```
   /*    /index.html   200
   ```

### GitHub Pages

1. **Build and Deploy Script**
   ```bash
   npm run build
   npm run deploy
   ```

2. **GitHub Actions** (`.github/workflows/deploy.yml`)
   ```yaml
   name: Deploy to GitHub Pages
   
   on:
     push:
       branches: [ main ]
   
   jobs:
     deploy:
       runs-on: ubuntu-latest
       steps:
         - uses: actions/checkout@v3
         - uses: actions/setup-node@v3
           with:
             node-version: '18'
         - run: npm install
         - run: npm run build
         - uses: peaceiris/actions-gh-pages@v3
           with:
             github_token: ${{ secrets.GITHUB_TOKEN }}
             publish_dir: ./dist
   ```

## 🐍 Backend Deployment

### Railway (Recommended)

1. **Connect Repository**
   - Visit [railway.app](https://railway.app)
   - Connect your GitHub repository
   - Select the backend directory

2. **Environment Variables**
   ```env
   GOOGLE_API_KEY=your_google_api_key
   SECRET_KEY=your_production_secret_key
   DATABASE_URL=postgresql://user:pass@host:port/db
   ALLOWED_ORIGINS=https://your-frontend-url.com
   ENVIRONMENT=production
   PORT=8000
   ```

3. **Railway Configuration** (`railway.toml`)
   ```toml
   [build]
   builder = "NIXPACKS"
   buildCommand = "pip install -r requirements.txt"
   
   [deploy]
   startCommand = "uvicorn main:app --host 0.0.0.0 --port $PORT"
   restartPolicyType = "ON_FAILURE"
   restartPolicyMaxRetries = 10
   ```

### Heroku

1. **Heroku Configuration**
   ```bash
   # Install Heroku CLI
   heroku create your-app-name
   heroku config:set GOOGLE_API_KEY=your_key
   heroku config:set SECRET_KEY=your_secret
   heroku addons:create heroku-postgresql:hobby-dev
   ```

2. **Procfile**
   ```
   web: uvicorn main:app --host 0.0.0.0 --port $PORT
   release: alembic upgrade head
   ```

3. **Runtime** (`runtime.txt`)
   ```
   python-3.11.0
   ```

### DigitalOcean App Platform

1. **App Spec** (`.do/app.yaml`)
   ```yaml
   name: edulearn-backend
   services:
   - name: api
     source_dir: /backend
     github:
       repo: your-username/edu-learn-platform
       branch: main
     run_command: uvicorn main:app --host 0.0.0.0 --port $PORT
     environment_slug: python
     instance_count: 1
     instance_size_slug: basic-xxs
     envs:
     - key: GOOGLE_API_KEY
       value: your_api_key
     - key: SECRET_KEY
       value: your_secret_key
   databases:
   - name: edulearn-db
     engine: PG
     version: "13"
   ```

### Docker Deployment

1. **Frontend Dockerfile**
   ```dockerfile
   FROM node:18-alpine AS builder
   WORKDIR /app
   COPY package*.json ./
   RUN npm ci --only=production
   COPY . .
   RUN npm run build
   
   FROM nginx:alpine
   COPY --from=builder /app/dist /usr/share/nginx/html
   COPY nginx.conf /etc/nginx/nginx.conf
   EXPOSE 80
   CMD ["nginx", "-g", "daemon off;"]
   ```

2. **Backend Dockerfile**
   ```dockerfile
   FROM python:3.11-slim
   WORKDIR /app
   COPY requirements.txt .
   RUN pip install --no-cache-dir -r requirements.txt
   COPY . .
   EXPOSE 8000
   CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]
   ```

3. **Docker Compose**
   ```yaml
   version: '3.8'
   services:
     frontend:
       build: .
       ports:
         - "3000:80"
       depends_on:
         - backend
     
     backend:
       build: ./backend
       ports:
         - "8000:8000"
       environment:
         - DATABASE_URL=postgresql://user:pass@db:5432/edulearn
         - GOOGLE_API_KEY=${GOOGLE_API_KEY}
       depends_on:
         - db
     
     db:
       image: postgres:13
       environment:
         - POSTGRES_DB=edulearn
         - POSTGRES_USER=user
         - POSTGRES_PASSWORD=pass
       volumes:
         - postgres_data:/var/lib/postgresql/data
   
   volumes:
     postgres_data:
   ```

## 🔧 Production Configuration

### Frontend Environment Variables

```env
# Production API URL
VITE_API_URL=https://your-backend-url.com

# Environment
VITE_ENVIRONMENT=production

# Analytics (optional)
VITE_GOOGLE_ANALYTICS_ID=GA_MEASUREMENT_ID

# Sentry (optional)
VITE_SENTRY_DSN=your_sentry_dsn
```

### Backend Environment Variables

```env
# Database
DATABASE_URL=postgresql://user:pass@host:port/db

# AI Configuration
GOOGLE_API_KEY=your_google_api_key

# Security
SECRET_KEY=your_production_secret_key_min_32_chars
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=30

# CORS
ALLOWED_ORIGINS=https://your-frontend-url.com,https://www.your-domain.com

# Environment
ENVIRONMENT=production

# Optional: Monitoring
SENTRY_DSN=your_sentry_dsn
```

## 🔒 Security Checklist

- [ ] Use HTTPS for all communications
- [ ] Set strong SECRET_KEY (32+ characters)
- [ ] Configure CORS properly
- [ ] Use environment variables for secrets
- [ ] Enable rate limiting
- [ ] Set up monitoring and logging
- [ ] Regular security updates
- [ ] Database backups
- [ ] SSL certificates

## 📊 Monitoring

### Frontend Monitoring

1. **Vercel Analytics**
   - Automatic performance monitoring
   - Core Web Vitals tracking

2. **Google Analytics**
   ```typescript
   // Add to main.tsx
   import { gtag } from './utils/analytics';
   gtag('config', 'GA_MEASUREMENT_ID');
   ```

### Backend Monitoring

1. **Sentry Integration**
   ```python
   import sentry_sdk
   from sentry_sdk.integrations.fastapi import FastApiIntegration
   
   sentry_sdk.init(
       dsn="your_sentry_dsn",
       integrations=[FastApiIntegration()],
       traces_sample_rate=1.0,
   )
   ```

2. **Health Checks**
   ```python
   @app.get("/health")
   async def health_check():
       return {"status": "healthy", "timestamp": datetime.utcnow()}
   ```

## 🚀 CI/CD Pipeline

### GitHub Actions

```yaml
name: Deploy to Production

on:
  push:
    branches: [ main ]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
      - run: npm install
      - run: npm run test
      - run: npm run type-check
      - run: npm run lint

  deploy-frontend:
    needs: test
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
      - run: npm install
      - run: npm run build
      - uses: peaceiris/actions-gh-pages@v3
        with:
          github_token: ${{ secrets.GITHUB_TOKEN }}
          publish_dir: ./dist

  deploy-backend:
    needs: test
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-python@v4
        with:
          python-version: '3.11'
      - run: pip install -r backend/requirements.txt
      - run: pytest backend/tests/
      - name: Deploy to Railway
        run: |
          # Railway deployment commands
```

## 📝 Post-Deployment

1. **Test all functionality**
2. **Monitor performance**
3. **Check error logs**
4. **Verify SSL certificates**
5. **Test mobile responsiveness**
6. **Validate API endpoints**
7. **Check database connections**

## 🆘 Troubleshooting

### Common Issues

1. **Build Failures**
   - Check Node.js version
   - Clear npm cache: `npm cache clean --force`
   - Delete node_modules and reinstall

2. **Environment Variables**
   - Verify all required variables are set
   - Check variable names (case-sensitive)
   - Restart services after changes

3. **CORS Issues**
   - Update ALLOWED_ORIGINS
   - Check protocol (http vs https)
   - Verify domain names

4. **Database Connection**
   - Check DATABASE_URL format
   - Verify network connectivity
   - Run migrations: `alembic upgrade head`

For more help, check the [troubleshooting guide](TROUBLESHOOTING.md) or create an issue.
