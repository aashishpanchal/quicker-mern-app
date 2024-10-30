import config from '#/config';
import logger from '#/logger';
import {Redis} from 'ioredis';
import {container, singleton} from 'tsyringe';

@singleton()
export class Cache {
  #cache: Redis = null;

  constructor() {
    // Initialize Redis Instance
    this.#cache = new Redis(config.redisUrl);
    this.#cache.on('connect', () => logger.info('Redis connected'));
    this.#cache.on('error', err => logger.error('redis Error:', err));
  }

  /** Get Cache client instance. */
  get client(): Redis {
    return this.#cache;
  }

  /** Serialize the given value for storage in Cache. */
  private serialize(value: any): string | Buffer {
    return value instanceof Buffer ? value : JSON.stringify(value);
  }

  /** Deserialize the retrieved value from Cache. */
  private deserialize<T>(value: string | null): T | null {
    if (!value) return null;
    try {
      return JSON.parse(value) as T;
    } catch {
      return value as unknown as T;
    }
  }

  /** Set a value with optional TTL. */
  async set<T>(key: string, value: T, ttl?: number): Promise<boolean> {
    const data = this.serialize(value);
    const result = ttl
      ? await this.#cache.setex(key, ttl, data)
      : await this.#cache.set(key, data);
    return result === 'OK';
  }

  /** Get a value by key. retrieved value or null */
  async get<T>(key: string): Promise<T | null> {
    const data = await this.#cache.get(key);
    return this.deserialize<T>(data);
  }

  /** Set multiple key-value pairs with optional TTL for each. */
  async mset(
    ...list: {key: string; value: any; ttl?: number}[]
  ): Promise<boolean> {
    const pipeline = this.#cache.pipeline(); // Use Redis pipeline for batch commands
    list.forEach(({key, value, ttl}) => {
      const data = this.serialize(value);
      pipeline.set(key, data); // Set the key-value pair
      if (ttl) pipeline.expire(key, ttl); // Set TTL if provided
    });

    const results = await pipeline.exec(); // Execute pipeline
    return results.every(([err]) => !err); // Check if all operations succeeded
  }

  /** Get multiple values by keys. array of retrieved values or null */
  async mget<T>(...keys: string[]): Promise<(T | null)[]> {
    const values = await this.#cache.mget(...keys);
    return values.map(value => this.deserialize<T>(value));
  }

  /** Delete one or more keys. */
  async del(...keys: string[]): Promise<boolean> {
    return (await this.#cache.del(...keys)) > 0;
  }

  /** Check if a key exists. */
  async has(key: string): Promise<boolean> {
    return (await this.#cache.exists(key)) > 0;
  }

  /**
   * Get the TTL of a key.
   * @param {string} key - Redis key
   * @returns {Promise<number>} TTL in seconds, or -1 if no TTL is set
   */
  async ttl(key: string): Promise<number> {
    return await this.#cache.ttl(key);
  }

  /** Clear the entire cache. */
  async clear(): Promise<boolean> {
    return !!(await this.#cache.flushdb());
  }
}

// Get Cache instance from tsyringe container
export const cache = container.resolve(Cache);
