import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Event, NavigationEnd, Router } from '@angular/router';
import {
	BehaviorSubject,
	concatMap,
	EMPTY,
	filter,
	map,
	Observable,
	of,
} from 'rxjs';
import { environment } from '../environments/environment';
import { IAutorizeData } from '../interfaces/authorize';
import { ISettings } from '../interfaces/settings';
import { SettingsService } from './settings.service';

@Injectable({
	providedIn: 'root',
})
export class StateService {
	private myApiUrl: string;

	get currentUser$(): Observable<string> {
		return this._currentUser?.asObservable();
	}

	get currentUser(): string {
		return this._currentUser?.value;
	}

	get backgroundImage(): string {
		return this._backgroundImage?.value;
	}

	get backgroundImage$(): Observable<string> {
		return this._backgroundImage?.asObservable();
	}

	get openInNewTab(): boolean {
		return this._openInNewTab?.value;
	}

	get openInNewTab$(): Observable<boolean> {
		return this._openInNewTab?.asObservable();
	}

	get currentRoute(): string {
		return this._currentRoute?.value;
	}

	get currentRoute$(): Observable<string> {
		return this._currentRoute?.asObservable();
	}

	private _currentUser: BehaviorSubject<string>;
	private _backgroundImage: BehaviorSubject<string>;
	private _openInNewTab: BehaviorSubject<boolean>;
	private _currentRoute: BehaviorSubject<string>;

	constructor(
		private _http: HttpClient,
		private _router: Router,
		private _settingsSvc: SettingsService,
	) {
		this.myApiUrl = `${environment.endpoint}${environment.apiPrefix}`;
		this._currentUser = new BehaviorSubject<string>(null);
		this._backgroundImage = new BehaviorSubject<string>(null);
		this._openInNewTab = new BehaviorSubject<boolean>(true);
		this._currentRoute = new BehaviorSubject<string>('/');
		this._initialize();
		this._authorize();
	}

	/**
	 * Sets the current user's username.
	 * @param value The username.
	 */
	setCurrentUser(value: string): void {
		this._currentUser.next(value);
	}

	/**
	 * Sets the background image URL.
	 * @param value The URL of the background image.
	 */
	setBackgroundImage(value: string): void {
		this._backgroundImage.next(value);
	}

	/**
	 * Sets the preference for opening links in a new tab.
	 * @param value Boolean indicating if links should open in a new tab.
	 */
	setOpenNewTab(value: boolean): void {
		this._openInNewTab.next(value);
	}

	/**
	 * Subscribes to router events to keep track of the current route.
	 */
	private _initialize(): void {
		this._router.events
			.pipe(
				takeUntilDestroyed(),
				filter((event) => event instanceof NavigationEnd),
			)
			.subscribe((event: Event) => {
				this._currentRoute.next((event as NavigationEnd).urlAfterRedirects);
			});
	}

	/**
	 * Authorizes the user by checking for an existing session.
	 * If a session exists, it loads user settings; otherwise, it redirects to the login page.
	 */
	private _authorize(): void {
		if (!this.currentUser) {
			this._http
				.get(`${this.myApiUrl}/users/authorize`)
				.pipe(
					map((response: any) => response.data),
					concatMap((data: IAutorizeData) => {
						if (data?.username) {
							this.setCurrentUser(data.username);
							return this._settingsSvc.getByUser();
						}
						return of(null);
					}),
					concatMap((settings: ISettings) => {
						if (settings) {
							this.setBackgroundImage(settings.backgrounImage);
							this.setOpenNewTab(settings.openInNewTab);
						} else {
							this._router.navigateByUrl('login');
						}
						return EMPTY;
					}),
				)
				.subscribe();
		}
	}
}
