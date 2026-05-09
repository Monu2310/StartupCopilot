import Redis from "ioredis";

type CacheValue = unknown;

type CacheEntry = {
  value: CacheValue;
  expiresAt: number;
};

const memoryCache = new Map<string, CacheEntry>();

const redisUrl = process.env.REDIS_URL;
const redis = redisUrl ? new Redis(redisUrl) : null;

const now = () => Date.now();

export const cacheGet = async <T>(key: string): Promise<T | null> => {
  if (redis) {
    const value = await redis.get(key);
    return value ? (JSON.parse(value) as T) : null;
  }
  const entry = memoryCache.get(key);
  if (!entry) return null;
  if (entry.expiresAt < now()) {
    memoryCache.delete(key);
    return null;
  }
  return entry.value as T;
};

export const cacheSet = async (key: string, value: CacheValue, ttlMs = 5 * 60 * 1000) => {
  if (redis) {
    await redis.set(key, JSON.stringify(value), "PX", ttlMs);
    return;
  }
  memoryCache.set(key, { value, expiresAt: now() + ttlMs });
};
