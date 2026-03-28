/**
 * Persists small key/value without crashing when AsyncStorage native bridge
 * is unavailable (e.g. web, misconfigured dev client, or module load race).
 */
import { Platform } from 'react-native';

const memory: Record<string, string> = {};

function webGet(key: string): string | null {
  try {
    if (typeof localStorage !== 'undefined') {
      return localStorage.getItem(key);
    }
  } catch {
    /* ignore */
  }
  return memory[key] ?? null;
}

function webSet(key: string, value: string): void {
  try {
    if (typeof localStorage !== 'undefined') {
      localStorage.setItem(key, value);
      return;
    }
  } catch {
    /* ignore */
  }
  memory[key] = value;
}

async function getNativeAsyncStorage(): Promise<{
  getItem: (k: string) => Promise<string | null>;
  setItem: (k: string, v: string) => Promise<void>;
} | null> {
  try {
    const mod = await import('@react-native-async-storage/async-storage');
    return mod.default;
  } catch {
    return null;
  }
}

export async function safeStorageGet(key: string): Promise<string | null> {
  if (Platform.OS === 'web') {
    return webGet(key);
  }
  const AsyncStorage = await getNativeAsyncStorage();
  if (!AsyncStorage) {
    return memory[key] ?? null;
  }
  try {
    return await AsyncStorage.getItem(key);
  } catch {
    return memory[key] ?? null;
  }
}

export async function safeStorageSet(key: string, value: string): Promise<void> {
  if (Platform.OS === 'web') {
    webSet(key, value);
    return;
  }
  const AsyncStorage = await getNativeAsyncStorage();
  if (!AsyncStorage) {
    memory[key] = value;
    return;
  }
  try {
    await AsyncStorage.setItem(key, value);
  } catch {
    memory[key] = value;
  }
}
