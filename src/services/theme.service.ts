import { DOCUMENT } from '@angular/common';
import { Inject, Injectable, inject } from '@angular/core';
import { Constants } from '../enums/constants';
import { ThemeType } from '../enums/theme';
import { LocalStoreService } from './local-store.service';

@Injectable({
	providedIn: 'root',
})
export class ThemeService {
	private _localStorageSvc = inject(LocalStoreService);

	get storedTheme(): string | null {
		return this._localStorageSvc.get(Constants.ThemeKey);
	}

	constructor(@Inject(DOCUMENT) private _document: Document) {
		if (this.storedTheme) {
			this.applyThemeToBody(this.storedTheme);
		} else {
			const systemTheme = this.getThemeFromSystem();
			this.applyThemeToBody(systemTheme);
			this.storeTheme(systemTheme);
		}
	}

	/**
	 * Detects the user's preferred color scheme from the OS/browser.
	 * @returns The system's preferred theme (dark or light).
	 */
	getThemeFromSystem(): ThemeType {
		return window.matchMedia('(prefers-color-scheme:dark)').matches
			? ThemeType.Dark
			: ThemeType.Light;
	}

	/**
	 * Applies the given theme to the document's body element.
	 * @param theme The theme to apply ('dark' or 'light').
	 */
	applyThemeToBody(theme: ThemeType | string): void {
		const body = this._document.getElementsByTagName('body')[0];
		body.setAttribute('data-bs-theme', theme);
	}

	/**
	 * Stores the selected theme in local storage.
	 * @param theme The theme to store.
	 */
	storeTheme(theme: ThemeType | string): void {
		this._localStorageSvc.set(Constants.ThemeKey, theme);
	}

	/**
	 * Toggles the current theme between dark and light, applying and storing it.
	 */
	toggleTheme(): void {
		const newTheme =
			this.storedTheme === ThemeType.Dark ? ThemeType.Light : ThemeType.Dark;
		this.applyThemeToBody(newTheme);
		this.storeTheme(newTheme);
	}
}
