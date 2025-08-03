# 🤖 Hybrid AI Setup Guide - Complete Implementation

## 🎯 **Overview: Best of Both Worlds**

Your EduLearn Platform now features a **Hybrid AI System** with:

- 🚀 **Gemini 2.0 Flash** (Primary online AI)
- 🧠 **Gemma 3 API** (Secondary online AI)  
- 🏠 **Gemma 3 Local** (Offline AI via Ollama)
- 🔄 **Intelligent routing** based on availability

## 🔧 **Setup Options**

### **Option 1: API-Only Setup (5 minutes)**
Perfect for most users who want reliable AI without local installation.

### **Option 2: Full Hybrid Setup (15 minutes)**
Includes local Ollama for true offline capabilities.

---

## 🚀 **Option 1: API-Only Setup**

### **1. Get API Keys**

**Google AI Studio** (for both Gemini & Gemma):
1. Visit [Google AI Studio](https://aistudio.google.com/)
2. Create API key
3. Copy the key

### **2. Configure Environment**

Update your `.env` file:
```bash
# Primary AI (Required)
VITE_GEMINI_API_KEY=your_api_key_here

# Secondary AI (Same key works)
VITE_GEMMA_API_KEY=your_api_key_here

# Preferences (Optional)
VITE_PREFERRED_AI_MODEL=auto
VITE_PREFERRED_AI_PROVIDER=auto
VITE_ENABLE_AI_FALLBACK=true
```

### **3. Test Your Setup**

```bash
npm run dev
```

You should see:
- ✅ AI Service Status showing "Gemini 2.0 Flash Available"
- ✅ Chat working with automatic model selection
- ✅ Fallback to Gemma API if Gemini is unavailable

---

## 🏠 **Option 2: Full Hybrid Setup (with Local AI)**

### **1. Complete Option 1 First**
Ensure API setup is working.

### **2. Install Ollama**

**Windows:**
```powershell
# Download installer from https://ollama.ai/download
# Or use package manager
winget install Ollama.Ollama
```

**macOS:**
```bash
brew install ollama
```

**Linux:**
```bash
curl -fsSL https://ollama.ai/install.sh | sh
```

### **3. Download Gemma 3 Model**

```bash
# Start Ollama (if not auto-started)
ollama serve

# Download model (choose based on your RAM)
ollama pull gemma2:3b    # 4GB RAM required
# OR
ollama pull gemma2:7b    # 8GB RAM required (better quality)
```

### **4. Test Local Setup**

```bash
# Test Ollama is working
ollama run gemma2:3b "Hello!"

# Check API endpoint
curl http://localhost:11434/api/tags
```

### **5. Update Configuration**

Add to your `.env`:
```bash
# Local AI Configuration
VITE_OLLAMA_ENDPOINT=http://localhost:11434
VITE_ENABLE_OFFLINE_MODE=true
```

### **6. Verify Full Setup**

```bash
npm run dev
```

You should now see:
- ✅ All three AI services available in status
- ✅ "Local" indicator when using offline model
- ✅ Seamless switching between online/offline

---

## 🎯 **How It Works**

### **Intelligent AI Selection**

The system automatically chooses the best AI based on:

1. **Availability**: Which services are online
2. **Preferences**: Your configured preferences  
3. **Performance**: Speed and reliability
4. **Fallback**: Graceful degradation

### **Priority Order**

1. **Gemini 2.0 Flash** (fastest, most capable)
2. **Gemma 3 API** (good fallback)
3. **Gemma 3 Local** (offline when needed)

### **Smart Features**

- 🔄 **Auto-retry** with different models on failure
- 📊 **Performance tracking** (response time, confidence)
- 🔍 **Health monitoring** every 30 seconds
- 💾 **Offline detection** and automatic fallback

---

## 🎨 **Using the New Components**

### **AI Service Status**

```tsx
import { AIServiceStatus } from './components/ai/AIServiceStatus';

// Compact view
<AIServiceStatus variant="compact" />

// Detailed view
<AIServiceStatus variant="detailed" />

// Minimal indicator
<AIServiceStatus variant="minimal" />
```

### **Hybrid AI Chat**

```tsx
import { HybridAIChat } from './components/ai/HybridAIChat';

<HybridAIChat 
  showStatus={true}
  enableStreaming={true}
  placeholder="Ask me anything!"
/>
```

### **Direct AI Hook Usage**

```tsx
import { useHybridAI } from './hooks/useHybridAI';

const { generateContent, networkStatus, bestAvailableModel } = useHybridAI();

const handleGenerate = async () => {
  const response = await generateContent("Hello AI!");
  console.log(`Response from ${response.provider}: ${response.content}`);
};
```

---

## 🔧 **Configuration Options**

### **Model Preferences**

```bash
# Auto-select best available (default)
VITE_PREFERRED_AI_MODEL=auto

# Force specific model (if available)
VITE_PREFERRED_AI_MODEL=gemini-2.0-flash
VITE_PREFERRED_AI_MODEL=gemma-3-api
VITE_PREFERRED_AI_MODEL=gemma-3-local
```

### **Provider Preferences**

```bash
# Auto-select best provider (default)
VITE_PREFERRED_AI_PROVIDER=auto

# Prefer specific provider
VITE_PREFERRED_AI_PROVIDER=google-gemini
VITE_PREFERRED_AI_PROVIDER=google-gemma
VITE_PREFERRED_AI_PROVIDER=ollama
```

### **Fallback Behavior**

```bash
# Enable fallback to offline when online fails
VITE_ENABLE_AI_FALLBACK=true

# Disable fallback (fail fast)
VITE_ENABLE_AI_FALLBACK=false
```

---

## 📊 **Monitoring & Status**

### **AI Service Status Component**

Shows real-time status of all AI services:
- 🟢 **Green**: Service available and working
- 🔴 **Red**: Service unavailable or failing
- 🟡 **Yellow**: Service partially available

### **Response Metadata**

Each AI response includes:
- **Model used**: Which AI generated the response
- **Provider**: Google Gemini, Google Gemma, or Ollama
- **Processing time**: How long it took
- **Confidence score**: Quality estimation
- **Offline status**: Whether it used local AI

---

## 🐛 **Troubleshooting**

### **No AI Services Available**

1. Check API keys in `.env` file
2. Verify internet connection
3. Test API endpoints manually
4. Check Ollama service if using local

### **Ollama Not Working**

```bash
# Check if Ollama is running
ps aux | grep ollama

# Start Ollama manually
ollama serve

# Test API
curl http://localhost:11434/api/tags

# Check logs
journalctl -u ollama  # Linux
brew services log ollama  # macOS
```

### **High Memory Usage**

- Use smaller model: `gemma2:3b` instead of `gemma2:7b`
- Limit concurrent requests
- Close unnecessary applications

### **Slow Responses**

- Check your internet connection
- Try different model preferences
- Monitor system resources

---

## 🎉 **Benefits of Hybrid Approach**

✅ **Reliability**: Multiple fallbacks ensure AI is always available
✅ **Performance**: Uses fastest available option
✅ **Privacy**: Local AI for sensitive conversations  
✅ **Offline Support**: Works without internet when Ollama is setup
✅ **Cost Efficiency**: Uses local AI to reduce API costs
✅ **Flexibility**: Easy to configure based on needs

Your EduLearn Platform now has **enterprise-grade AI reliability** with the **flexibility of local processing**! 🚀

---

## 📞 **Support**

- 🐛 **Issues**: Check console logs for detailed error messages
- 📖 **Docs**: See `OLLAMA_SETUP.md` for detailed Ollama configuration
- 💬 **Chat**: Test the hybrid system in the platform's chat interface
- 🔧 **Config**: Adjust settings in `.env` file and restart dev server
