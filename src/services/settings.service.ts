import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { environment } from '../environments/environment';
import { ISettings } from '../interfaces/settings';

@Injectable({
	providedIn: 'root',
})
export class SettingsService {
	private myApiUrl: string;
	private API_SUFFIX = '/settings';

	constructor(private http: HttpClient) {
		this.myApiUrl = `${environment.endpoint}${environment.apiPrefix}${this.API_SUFFIX}`;
	}

	/**
	 * Fetches the settings for the current user.
	 * @returns An observable of the user's settings.
	 */
	getByUser(): Observable<ISettings> {
		return this.http
			.get(`${this.myApiUrl}/getByUser`)
			.pipe(map((response: any) => response.data));
	}
}
