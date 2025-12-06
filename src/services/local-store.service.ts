import { Injectable } from '@angular/core';

@Injectable({
	providedIn: 'root',
})
export class LocalStoreService {
	/**
	 * Sets a value in local storage.
	 * @param key The key to set.
	 * @param value The value to store.
	 */
	set(key: string, value: string): void {
		localStorage.setItem(key, value);
	}

	/**
	 * Gets a value from local storage.
	 * @param key The key to retrieve.
	 * @returns The value associated with the key, or null if not found.
	 */
	get(key: string): string | null {
		return localStorage.getItem(key);
	}

	/**
	 * Removes a value from local storage.
	 * @param key The key to remove.
	 */
	remove(key: string): void {
		localStorage.removeItem(key);
	}

	/**
	 * Checks if a key exists in local storage.
	 * @param key The key to check.
	 * @returns True if the key exists, otherwise false.
	 */
	exists(key: string): boolean {
		return this.get(key) != undefined;
	}
}
