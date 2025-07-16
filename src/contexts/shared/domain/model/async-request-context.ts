import { AsyncLocalStorage } from 'node:async_hooks';

export interface AsyncRequestContextObject {
    pid: string;
}

/**
 * The `AsyncRequestContext` class provides a way to manage asynchronous request context data.
 */
export abstract class AsyncRequestContext {
    private static storage = new AsyncLocalStorage<AsyncRequestContextObject>();

    /**
     * Sets the asynchronous request context data.
     * @param data - The data to set in the context.
     * @param context - The function to run with the context.
     */
    static setData(data: AsyncRequestContextObject, context: (...args: unknown[]) => unknown): void {
        this.storage.run(data, context);
    }

    /**
     * Sets the asynchronous request context data.
     * @param key - The key of the value to set in the context.
     * @param value - The value to set in the context.
     * @throws Error if no context is set.
     */
    static setDataForCurrentContext<T extends keyof AsyncRequestContextObject>(
        key: T,
        value: AsyncRequestContextObject[T],
    ): void {
        const currentContext = this.storage.getStore();
        if (!currentContext) {
            throw new Error('No context set. Use setData to set the context first.');
        }
        currentContext[key] = value;
        this.storage.enterWith(currentContext);
    }

    /**
     * Retrieves the asynchronous request context data.
     * @returns The current context data or undefined if no context is set.
     */
    static getData(): AsyncRequestContextObject | undefined {
        return this.storage.getStore();
    }

    /**
     * Retrieves a specific value from the asynchronous request context data.
     * @template T - The key type of the context object.
     * @param key - The key of the value to retrieve from the context.
     * @returns The value associated with the key or undefined if no context is set or the key does not exist.
     */
    static get<T extends keyof AsyncRequestContextObject>(key: T): AsyncRequestContextObject[T] | undefined {
        return this.storage.getStore()?.[key];
    }
}
