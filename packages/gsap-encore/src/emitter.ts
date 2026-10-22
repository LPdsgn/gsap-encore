type Listener<A extends unknown[]> = (...args: A) => void;

/** Minimal typed event emitter; `on` returns the unsubscribe function */
export class Emitter<E extends Record<string, unknown[]>> {
	private listeners: { [K in keyof E]?: Listener<E[K]>[] } = {};

	on<K extends keyof E>(event: K, listener: Listener<E[K]>): () => void {
		const list = this.listeners[event] ?? [];
		this.listeners[event] = list;
		list.push(listener);
		return () => this.off(event, listener);
	}

	off<K extends keyof E>(event: K, listener: Listener<E[K]>): void {
		this.listeners[event] = this.listeners[event]?.filter((l) => l !== listener);
	}

	emit<K extends keyof E>(event: K, ...args: E[K]): void {
		this.listeners[event]?.forEach((listener) => {
			listener(...args);
		});
	}

	destroy(): void {
		this.listeners = {};
	}
}
