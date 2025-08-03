// Premium Local Storage Service for Offline Data Management
interface StorageItem<T = any> {
  data: T;
  timestamp: number;
  expires?: number;
  version: string;
  compressed?: boolean;
}

interface CacheConfig {
  defaultTTL: number; // Time to live in milliseconds
  maxItems: number;
  enableCompression: boolean;
  enableEncryption: boolean;
}

class PremiumStorageService {
  private config: CacheConfig;
  private readonly version = '1.0.0';
  private readonly storagePrefix = 'edulearn_';

  constructor() {
    this.config = {
      defaultTTL: 24 * 60 * 60 * 1000, // 24 hours
      maxItems: 1000,
      enableCompression: false, // Would require compression library
      enableEncryption: false    // Would require crypto library
    };

    // Initialize storage
    this.initializeStorage();
  }

  private initializeStorage() {
    try {
      // Check storage availability
      if (!this.isStorageAvailable()) {
        console.warn('LocalStorage not available, using memory fallback');
      }

      // Clean up expired items on initialization
      this.cleanupExpired();
      
      console.log('📦 Premium Storage Service initialized');
    } catch (error) {
      console.error('Storage initialization failed:', error);
    }
  }

  private isStorageAvailable(): boolean {
    try {
      const test = '__storage_test__';
      localStorage.setItem(test, 'test');
      localStorage.removeItem(test);
      return true;
    } catch (e) {
      return false;
    }
  }

  private generateKey(key: string): string {
    return `${this.storagePrefix}${key}`;
  }

  private compressData(data: any): string {
    // Simple compression simulation - in production would use actual compression
    return JSON.stringify(data);
  }

  private decompressData(data: string): any {
    // Simple decompression simulation
    return JSON.parse(data);
  }

  // Store data with advanced options
  async setItem<T>(
    key: string, 
    data: T, 
    options?: {
      ttl?: number;
      compress?: boolean;
      priority?: 'high' | 'medium' | 'low';
    }
  ): Promise<void> {
    try {
      const storageKey = this.generateKey(key);
      const ttl = options?.ttl || this.config.defaultTTL;
      const expires = Date.now() + ttl;

      const storageItem: StorageItem<T> = {
        data,
        timestamp: Date.now(),
        expires,
        version: this.version,
        compressed: options?.compress || false
      };

      let serializedData = JSON.stringify(storageItem);

      if (options?.compress && this.config.enableCompression) {
        serializedData = this.compressData(storageItem);
      }

      // Check storage limits
      await this.ensureStorageSpace(serializedData.length);

      localStorage.setItem(storageKey, serializedData);

      console.log(`📝 Stored item: ${key} (${serializedData.length} bytes)`);
    } catch (error) {
      console.error('Failed to store item:', error);
      throw new Error(`Storage failed for key: ${key}`);
    }
  }

  // Retrieve data with validation
  async getItem<T>(key: string): Promise<T | null> {
    try {
      const storageKey = this.generateKey(key);
      const serializedData = localStorage.getItem(storageKey);

      if (!serializedData) {
        return null;
      }

      let storageItem: StorageItem<T>;

      try {
        storageItem = JSON.parse(serializedData);
      } catch {
        // Try decompression if parsing fails
        storageItem = this.decompressData(serializedData);
      }

      // Check expiration
      if (storageItem.expires && Date.now() > storageItem.expires) {
        await this.removeItem(key);
        console.log(`🗑️ Expired item removed: ${key}`);
        return null;
      }

      // Version check
      if (storageItem.version !== this.version) {
        console.warn(`Version mismatch for ${key}, removing outdated item`);
        await this.removeItem(key);
        return null;
      }

      console.log(`📖 Retrieved item: ${key}`);
      return storageItem.data;
    } catch (error) {
      console.error('Failed to retrieve item:', error);
      return null;
    }
  }

  // Remove specific item
  async removeItem(key: string): Promise<void> {
    try {
      const storageKey = this.generateKey(key);
      localStorage.removeItem(storageKey);
      console.log(`🗑️ Removed item: ${key}`);
    } catch (error) {
      console.error('Failed to remove item:', error);
    }
  }

  // Clear all app data
  async clear(): Promise<void> {
    try {
      const keys = Object.keys(localStorage).filter(key => 
        key.startsWith(this.storagePrefix)
      );

      keys.forEach(key => localStorage.removeItem(key));
      console.log(`🧹 Cleared ${keys.length} items from storage`);
    } catch (error) {
      console.error('Failed to clear storage:', error);
    }
  }

  // Get storage statistics
  getStats(): {
    totalItems: number;
    totalSize: number;
    oldestItem: string | null;
    newestItem: string | null;
    expirationInfo: Array<{ key: string; expiresIn: number }>;
  } {
    const keys = Object.keys(localStorage).filter(key => 
      key.startsWith(this.storagePrefix)
    );

    let totalSize = 0;
    let oldestTimestamp = Date.now();
    let newestTimestamp = 0;
    let oldestItem: string | null = null;
    let newestItem: string | null = null;
    const expirationInfo: Array<{ key: string; expiresIn: number }> = [];

    keys.forEach(key => {
      const item = localStorage.getItem(key);
      if (item) {
        totalSize += item.length;
        
        try {
          const storageItem: StorageItem = JSON.parse(item);
          
          if (storageItem.timestamp < oldestTimestamp) {
            oldestTimestamp = storageItem.timestamp;
            oldestItem = key.replace(this.storagePrefix, '');
          }
          
          if (storageItem.timestamp > newestTimestamp) {
            newestTimestamp = storageItem.timestamp;
            newestItem = key.replace(this.storagePrefix, '');
          }

          if (storageItem.expires) {
            const expiresIn = storageItem.expires - Date.now();
            if (expiresIn > 0) {
              expirationInfo.push({
                key: key.replace(this.storagePrefix, ''),
                expiresIn
              });
            }
          }
        } catch (error) {
          console.warn(`Invalid storage item: ${key}`);
        }
      }
    });

    return {
      totalItems: keys.length,
      totalSize,
      oldestItem,
      newestItem,
      expirationInfo: expirationInfo.sort((a, b) => a.expiresIn - b.expiresIn)
    };
  }

  // Cleanup expired items
  private async cleanupExpired(): Promise<number> {
    const keys = Object.keys(localStorage).filter(key => 
      key.startsWith(this.storagePrefix)
    );

    let removedCount = 0;

    for (const key of keys) {
      try {
        const item = localStorage.getItem(key);
        if (item) {
          const storageItem: StorageItem = JSON.parse(item);
          
          if (storageItem.expires && Date.now() > storageItem.expires) {
            localStorage.removeItem(key);
            removedCount++;
          }
        }
      } catch (error) {
        // Remove invalid items
        localStorage.removeItem(key);
        removedCount++;
      }
    }

    if (removedCount > 0) {
      console.log(`🧹 Cleaned up ${removedCount} expired/invalid items`);
    }

    return removedCount;
  }

  // Ensure storage space by removing old items if needed
  private async ensureStorageSpace(newItemSize: number): Promise<void> {
    const stats = this.getStats();
    const estimatedNewTotal = stats.totalSize + newItemSize;
    
    // Rough estimate of localStorage limit (5MB)
    const storageLimit = 5 * 1024 * 1024;
    
    if (estimatedNewTotal > storageLimit || stats.totalItems >= this.config.maxItems) {
      console.log('⚠️ Storage limit approaching, cleaning up...');
      
      // First cleanup expired items
      await this.cleanupExpired();
      
      // If still over limit, remove oldest items
      const updatedStats = this.getStats();
      if (updatedStats.totalItems >= this.config.maxItems) {
        const keys = Object.keys(localStorage)
          .filter(key => key.startsWith(this.storagePrefix))
          .map(key => {
            const item = localStorage.getItem(key);
            if (item) {
              try {
                const storageItem: StorageItem = JSON.parse(item);
                return { key, timestamp: storageItem.timestamp };
              } catch {
                return { key, timestamp: 0 };
              }
            }
            return null;
          })
          .filter(Boolean)
          .sort((a, b) => a!.timestamp - b!.timestamp);

        // Remove oldest 25% of items
        const itemsToRemove = Math.ceil(keys.length * 0.25);
        for (let i = 0; i < itemsToRemove && i < keys.length; i++) {
          localStorage.removeItem(keys[i]!.key);
        }
        
        console.log(`🗑️ Removed ${itemsToRemove} oldest items to free space`);
      }
    }
  }

  // Cache management for AI responses
  async cacheAIResponse(
    prompt: string, 
    response: string, 
    model: string
  ): Promise<void> {
    const cacheKey = `ai_response_${this.hashString(prompt)}_${model}`;
    await this.setItem(cacheKey, {
      prompt,
      response,
      model,
      cached: true
    }, {
      ttl: 2 * 60 * 60 * 1000, // 2 hours cache for AI responses
      priority: 'medium'
    });
  }

  async getCachedAIResponse(prompt: string, model: string): Promise<string | null> {
    const cacheKey = `ai_response_${this.hashString(prompt)}_${model}`;
    const cached = await this.getItem<{
      prompt: string;
      response: string;
      model: string;
      cached: boolean;
    }>(cacheKey);

    return cached?.response || null;
  }

  // Simple hash function for cache keys
  private hashString(str: string): string {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      const char = str.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash; // Convert to 32-bit integer
    }
    return Math.abs(hash).toString(36);
  }

  // Save user preferences
  async saveUserPreferences(preferences: Record<string, any>): Promise<void> {
    await this.setItem('user_preferences', preferences, {
      ttl: 30 * 24 * 60 * 60 * 1000, // 30 days
      priority: 'high'
    });
  }

  async getUserPreferences(): Promise<Record<string, any> | null> {
    return this.getItem('user_preferences');
  }

  // Study session data
  async saveStudySession(sessionData: any): Promise<void> {
    const sessionKey = `study_session_${Date.now()}`;
    await this.setItem(sessionKey, sessionData, {
      ttl: 7 * 24 * 60 * 60 * 1000, // 7 days
      priority: 'high'
    });
  }

  async getStudySessions(): Promise<any[]> {
    const keys = Object.keys(localStorage).filter(key => 
      key.startsWith(`${this.storagePrefix}study_session_`)
    );

    const sessions = [];
    for (const key of keys) {
      const session = await this.getItem(key.replace(this.storagePrefix, ''));
      if (session) {
        sessions.push(session);
      }
    }

    return sessions.sort((a: any, b: any) => b.timestamp - a.timestamp);
  }

  // Export data for backup
  async exportData(): Promise<string> {
    const keys = Object.keys(localStorage).filter(key => 
      key.startsWith(this.storagePrefix)
    );

    const exportData: Record<string, any> = {};
    
    for (const key of keys) {
      const item = localStorage.getItem(key);
      if (item) {
        exportData[key] = item;
      }
    }

    return JSON.stringify({
      version: this.version,
      exportDate: new Date().toISOString(),
      data: exportData
    });
  }

  // Import data from backup
  async importData(exportedData: string): Promise<void> {
    try {
      const parsed = JSON.parse(exportedData);
      
      if (parsed.version !== this.version) {
        console.warn('Version mismatch in imported data');
      }

      // Clear existing data
      await this.clear();

      // Import new data
      Object.entries(parsed.data).forEach(([key, value]) => {
        localStorage.setItem(key, value as string);
      });

      console.log('📥 Data imported successfully');
    } catch (error) {
      console.error('Failed to import data:', error);
      throw new Error('Invalid backup data format');
    }
  }
}

// Create singleton instance
export const storageService = new PremiumStorageService();

export default storageService;
