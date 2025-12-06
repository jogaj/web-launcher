import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../environments/environment';
import { IUser } from '../interfaces/user';

@Injectable({
	providedIn: 'root',
})
export class UserService {
	private myApiUrl: string;
	private API_SUFFIX = '/users';

	constructor(private http: HttpClient) {
		this.myApiUrl = `${environment.endpoint}${environment.apiPrefix}${this.API_SUFFIX}`;
	}

	/**
	 * Authenticates a user and returns an auth token.
	 * @param user The user's credentials.
	 * @returns An observable containing the auth token.
	 */
	login(user: IUser): Observable<string> {
		return this.http.post<string>(`${this.myApiUrl}/login`, user);
	}
}
