import { Component, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { Constants } from '../../enums/constants';
import { ThemeType } from '../../enums/theme';
import { LocalStoreService } from '../../services/local-store.service';
import { StateService } from '../../services/state.service';
import { ThemeService } from '../../services/theme.service';
import { SearchBoxComponent } from '../search-box/search-box.component';

@Component({
	selector: 'app-mini-toolbar',
	standalone: true,
	imports: [SearchBoxComponent],
	templateUrl: './mini-toolbar.component.html',
	styleUrl: './mini-toolbar.component.scss',
	host: {
		class: 'app-mini-toolbar',
	},
})
export class MiniToolbarComponent {
	private _themeSvc = inject(ThemeService);
	private _localStoreSvc = inject(LocalStoreService);
	private _router = inject(Router);
	private _stateSvc = inject(StateService);
	readonly ThemeType = ThemeType;

	isSearchOpen = signal<boolean>(false);

	get currentTheme(): string | null {
		return this._themeSvc.storedTheme;
	}

	get btnThemeCssClass(): string {
		return this.currentTheme === ThemeType.Dark ? 'btn-dark' : 'btn-light';
	}

	get isLogged(): boolean {
		return this._localStoreSvc.exists(Constants.AuthKey);
	}

	get currentRoute(): string {
		return this._stateSvc.currentRoute;
	}

	get shouldBeVisible(): boolean {
		return this.isLogged && this.currentRoute === '/main-view';
	}

	/**
	 * Toggles the application theme between light and dark mode.
	 */
	onToggleTheme(): void {
		this._themeSvc.toggleTheme();
	}

	/**
	 * Logs the current user out, clears session data, and navigates to the login page.
	 */
	logOut(): void {
		if (!this.isLogged) return;

		this._localStoreSvc.remove(Constants.AuthKey);
		this._stateSvc.setCurrentUser(null);
		this._stateSvc.setBackgroundImage(null);
		this._stateSvc.setOpenNewTab(true);
		this._router.navigateByUrl('login');
	}

	/**
	 * Toggles the visibility of the search bar.
	 */
	onToggleSearch(): void {
		this.isSearchOpen.set(!this.isSearchOpen());
	}
}
