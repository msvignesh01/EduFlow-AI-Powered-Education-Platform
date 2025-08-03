# 🤖 Ollama Setup Guide for Local Gemma 3

## 🚀 **Quick Setup (5 minutes)**

### **1. Install Ollama**

**Windows:**
```powershell
# Download from https://ollama.ai/download
# Or use winget
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

### **2. Download Gemma 3 Model**

```bash
# Start Ollama service (if not auto-started)
ollama serve

# Download Gemma 3 (choose one based on your hardware)
ollama pull gemma2:3b    # Recommended: 3B model (4GB RAM)
ollama pull gemma2:7b    # Better quality: 7B model (8GB RAM)
ollama pull gemma2:27b   # Best quality: 27B model (32GB RAM)
```

### **3. Test Local Setup**

```bash
# Test Gemma 3 is working
ollama run gemma2:3b "Hello, how are you?"

# Check available models
ollama list

# Check Ollama status
curl http://localhost:11434/api/tags
```

### **4. Configure EduLearn Platform**

Update your `.env` file:
```bash
# Enable local AI
VITE_OLLAMA_ENDPOINT=http://localhost:11434
VITE_ENABLE_OFFLINE_MODE=true
VITE_PREFERRED_AI_MODEL=auto  # Will auto-select best available
```

## 🎯 **Usage in EduLearn Platform**

The platform will automatically:
- ✅ **Detect Ollama** availability
- ✅ **Fallback to local** when online AI is unavailable
- ✅ **Show status** in AI Service Status component
- ✅ **Use best model** based on your preferences

## 🔧 **Advanced Configuration**

### **Custom Ollama Settings**

Create `~/.ollama/config.json`:
```json
{
  "origins": ["http://localhost:5173", "http://localhost:3000"],
  "host": "0.0.0.0:11434",
  "models_path": "/path/to/models"
}
```

### **Performance Tuning**

```bash
# Set environment variables for better performance
export OLLAMA_HOST=0.0.0.0:11434
export OLLAMA_ORIGINS="http://localhost:*"
export OLLAMA_NUM_PARALLEL=2
export OLLAMA_MAX_LOADED_MODELS=2
```

## 🚨 **Troubleshooting**

### **Issue: Ollama not starting**
```bash
# Check if service is running
ps aux | grep ollama

# Start manually
ollama serve

# Check logs
journalctl -u ollama  # Linux
```

### **Issue: CORS errors**
Add to Ollama config:
```json
{
  "origins": ["*"]
}
```

### **Issue: Model not downloading**
```bash
# Clear cache and retry
ollama rm gemma2:3b
ollama pull gemma2:3b

# Check disk space
df -h
```

### **Issue: High memory usage**
- Use smaller model: `gemma2:3b` instead of `gemma2:7b`
- Limit concurrent requests in platform settings
- Close other applications

## 📊 **Model Comparison**

| Model | Size | RAM Required | Speed | Quality |
|-------|------|--------------|-------|---------|
| gemma2:3b | 2GB | 4GB | Fast | Good |
| gemma2:7b | 4GB | 8GB | Medium | Better |
| gemma2:27b | 16GB | 32GB | Slow | Best |

## 🎉 **Verification**

Once setup is complete:

1. ✅ **Platform Status**: Check AI Service Status in the app
2. ✅ **Test Chat**: Try asking a question with internet disabled
3. ✅ **Check Logs**: Look for "Using gemma-3-local via ollama" in console

Your EduLearn Platform now has **true offline AI capabilities**! 🎯

## 🔗 **Useful Links**

- [Ollama Documentation](https://ollama.ai/docs)
- [Gemma 3 Model Card](https://huggingface.co/google/gemma-2-3b)
- [Performance Optimization](https://ollama.ai/docs/performance)
- [API Reference](https://ollama.ai/docs/api)
