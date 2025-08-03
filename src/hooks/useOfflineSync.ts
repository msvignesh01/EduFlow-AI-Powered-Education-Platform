// Premium Offline Sync Hook for SaaS Platform
import { useState, useEffect, useCallback } from 'react';
import { 
  collection, 
  doc, 
  onSnapshot, 
  setDoc, 
  deleteDoc, 
  query, 
  where, 
  orderBy,
  limit,
  getDocs,
  enableNetwork,
  disableNetwork
} from 'firebase/firestore';
import { db } from '../lib/firebase';
import { storageService } from '../lib/storageService';
import { useAuthStore } from '../store/authStore';

interface SyncItem {
  id: string;
  data: any;
  timestamp: number;
  action: 'create' | 'update' | 'delete';
  synced: boolean;
  collection: string;
}

interface UseSyncOptions {
  enableRealTime?: boolean;
  syncInterval?: number;
  maxRetries?: number;
  collections?: string[];
}

interface SyncStatus {
  isOnline: boolean;
  isSyncing: boolean;
  lastSync: Date | null;
  pendingChanges: number;
  syncErrors: string[];
}

export const useOfflineSync = (options: UseSyncOptions = {}) => {
  const {
    enableRealTime = true,
    syncInterval = 30000, // 30 seconds
    maxRetries = 3,
    collections = ['user_data', 'study_sessions', 'preferences']
  } = options;

  const [syncStatus, setSyncStatus] = useState<SyncStatus>({
    isOnline: navigator.onLine,
    isSyncing: false,
    lastSync: null,
    pendingChanges: 0,
    syncErrors: []
  });

  const { user, isAuthenticated } = useAuthStore();
  const [syncQueue, setSyncQueue] = useState<SyncItem[]>([]);
  const [realtimeUnsubscribes, setRealtimeUnsubscribes] = useState<(() => void)[]>([]);

  // Monitor online/offline status
  useEffect(() => {
    const handleOnline = async () => {
      setSyncStatus(prev => ({ ...prev, isOnline: true }));
      if (isAuthenticated) {
        await enableNetwork(db);
        performSync();
      }
    };

    const handleOffline = async () => {
      setSyncStatus(prev => ({ ...prev, isOnline: false }));
      await disableNetwork(db);
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, [isAuthenticated]);

  // Load pending sync queue on mount
  useEffect(() => {
    loadSyncQueue();
  }, []);

  // Setup real-time sync when authenticated and online
  useEffect(() => {
    if (isAuthenticated && syncStatus.isOnline && enableRealTime) {
      setupRealtimeSync();
    } else {
      cleanupRealtimeSync();
    }

    return () => cleanupRealtimeSync();
  }, [isAuthenticated, syncStatus.isOnline, enableRealTime]);

  // Periodic sync
  useEffect(() => {
    if (!isAuthenticated || !syncStatus.isOnline) return;

    const interval = setInterval(() => {
      performSync();
    }, syncInterval);

    return () => clearInterval(interval);
  }, [isAuthenticated, syncStatus.isOnline, syncInterval]);

  const loadSyncQueue = async () => {
    try {
      const queue = await storageService.getItem<SyncItem[]>('sync_queue') || [];
      setSyncQueue(queue);
      setSyncStatus(prev => ({ ...prev, pendingChanges: queue.length }));
    } catch (error) {
      console.error('Failed to load sync queue:', error);
    }
  };

  const saveSyncQueue = async (queue: SyncItem[]) => {
    try {
      await storageService.setItem('sync_queue', queue, { ttl: 7 * 24 * 60 * 60 * 1000 });
      setSyncStatus(prev => ({ ...prev, pendingChanges: queue.length }));
    } catch (error) {
      console.error('Failed to save sync queue:', error);
    }
  };

  const addToSyncQueue = useCallback(async (item: Omit<SyncItem, 'timestamp' | 'synced'>) => {
    const syncItem: SyncItem = {
      ...item,
      timestamp: Date.now(),
      synced: false
    };

    const newQueue = [...syncQueue, syncItem];
    setSyncQueue(newQueue);
    await saveSyncQueue(newQueue);

    // Also save to local storage immediately
    await storageService.setItem(`${item.collection}_${item.id}`, item.data);

    // If online, try to sync immediately
    if (syncStatus.isOnline && isAuthenticated) {
      performSync();
    }
  }, [syncQueue, syncStatus.isOnline, isAuthenticated]);

  const setupRealtimeSync = () => {
    if (!user?.id) return;

    const unsubscribes: (() => void)[] = [];

    collections.forEach(collectionName => {
      const q = query(
        collection(db, collectionName),
        where('userId', '==', user.id),
        orderBy('updatedAt', 'desc'),
        limit(100)
      );

      const unsubscribe = onSnapshot(q, 
        (snapshot) => {
          snapshot.docChanges().forEach(async (change) => {
            const data = { id: change.doc.id, ...change.doc.data() };
            
            if (change.type === 'added' || change.type === 'modified') {
              // Update local storage
              await storageService.setItem(`${collectionName}_${change.doc.id}`, data);
            } else if (change.type === 'removed') {
              // Remove from local storage
              await storageService.removeItem(`${collectionName}_${change.doc.id}`);
            }
          });

          console.log(`✅ Real-time sync updated ${collectionName}`);
        },
        (error) => {
          console.error(`Real-time sync error for ${collectionName}:`, error);
          setSyncStatus(prev => ({
            ...prev,
            syncErrors: [...prev.syncErrors, `Real-time sync failed for ${collectionName}`]
          }));
        }
      );

      unsubscribes.push(unsubscribe);
    });

    setRealtimeUnsubscribes(unsubscribes);
  };

  const cleanupRealtimeSync = () => {
    realtimeUnsubscribes.forEach(unsubscribe => unsubscribe());
    setRealtimeUnsubscribes([]);
  };

  const performSync = async () => {
    if (!isAuthenticated || !user?.id || syncQueue.length === 0) return;

    setSyncStatus(prev => ({ ...prev, isSyncing: true, syncErrors: [] }));

    try {
      const syncPromises = syncQueue.map(async (item) => {
        let retries = 0;
        
        while (retries < maxRetries) {
          try {
            const docRef = doc(db, item.collection, item.id);
            
            if (item.action === 'delete') {
              await deleteDoc(docRef);
            } else {
              await setDoc(docRef, {
                ...item.data,
                userId: user.id,
                updatedAt: new Date(),
                syncedAt: new Date()
              }, { merge: item.action === 'update' });
            }

            // Mark as synced
            return { ...item, synced: true };
          } catch (error) {
            retries++;
            if (retries >= maxRetries) {
              console.error(`Failed to sync item ${item.id} after ${maxRetries} retries:`, error);
              setSyncStatus(prev => ({
                ...prev,
                syncErrors: [...prev.syncErrors, `Failed to sync ${item.id}: ${error}`]
              }));
              return item; // Return unsynced
            }
            // Wait before retry
            await new Promise(resolve => setTimeout(resolve, 1000 * retries));
          }
        }
        return item;
      });

      const syncedItems = await Promise.all(syncPromises);
      const remainingQueue = syncedItems.filter(item => !item.synced);

      setSyncQueue(remainingQueue);
      await saveSyncQueue(remainingQueue);

      setSyncStatus(prev => ({
        ...prev,
        lastSync: new Date(),
        pendingChanges: remainingQueue.length
      }));

      console.log(`🔄 Sync completed. ${syncQueue.length - remainingQueue.length} items synced, ${remainingQueue.length} remaining.`);

    } catch (error) {
      console.error('Sync failed:', error);
      setSyncStatus(prev => ({
        ...prev,
        syncErrors: [...prev.syncErrors, `Sync failed: ${error}`]
      }));
    } finally {
      setSyncStatus(prev => ({ ...prev, isSyncing: false }));
    }
  };

  // Public API methods
  const saveData = useCallback(async (
    collection: string, 
    id: string, 
    data: any, 
    action: 'create' | 'update' = 'create'
  ) => {
    // Save locally first
    await storageService.setItem(`${collection}_${id}`, data);

    // Add to sync queue
    await addToSyncQueue({
      id,
      data,
      action,
      collection
    });

    console.log(`📝 Data saved locally: ${collection}/${id}`);
  }, [addToSyncQueue]);

  const deleteData = useCallback(async (collection: string, id: string) => {
    // Remove locally
    await storageService.removeItem(`${collection}_${id}`);

    // Add to sync queue
    await addToSyncQueue({
      id,
      data: null,
      action: 'delete',
      collection
    });

    console.log(`🗑️ Data deleted locally: ${collection}/${id}`);
  }, [addToSyncQueue]);

  const getData = useCallback(async (collectionName: string, id: string) => {
    try {
      // Try local storage first
      const localData = await storageService.getItem(`${collectionName}_${id}`);
      if (localData) {
        return localData;
      }

      // If online and no local data, try fetching from Firebase
      if (syncStatus.isOnline && isAuthenticated && user?.id) {
        const collectionRef = collection(db, collectionName);
        const q = query(collectionRef, where('userId', '==', user.id));
        const docSnap = await getDocs(q);
        
        if (!docSnap.empty) {
          const data = docSnap.docs[0].data();
          // Cache locally
          await storageService.setItem(`${collectionName}_${id}`, data);
          return data;
        }
      }

      return null;
    } catch (error) {
      console.error('Failed to get data:', error);
      return null;
    }
  }, [syncStatus.isOnline, isAuthenticated, user?.id]);

  const forcSync = useCallback(async () => {
    if (syncStatus.isOnline && isAuthenticated) {
      await performSync();
    }
  }, [syncStatus.isOnline, isAuthenticated]);

  const clearSyncQueue = useCallback(async () => {
    setSyncQueue([]);
    await storageService.removeItem('sync_queue');
    setSyncStatus(prev => ({ ...prev, pendingChanges: 0 }));
  }, []);

  const exportOfflineData = useCallback(async () => {
    try {
      const data = await storageService.exportData();
      return data;
    } catch (error) {
      console.error('Failed to export offline data:', error);
      throw error;
    }
  }, []);

  const importOfflineData = useCallback(async (data: string) => {
    try {
      await storageService.importData(data);
      await loadSyncQueue();
      
      // If online, sync the imported data
      if (syncStatus.isOnline) {
        await performSync();
      }
    } catch (error) {
      console.error('Failed to import offline data:', error);
      throw error;
    }
  }, [syncStatus.isOnline]);

  return {
    syncStatus,
    saveData,
    deleteData,
    getData,
    forcSync,
    clearSyncQueue,
    exportOfflineData,
    importOfflineData
  };
};
