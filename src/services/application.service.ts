import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable, shareReplay } from 'rxjs';
import { environment } from '../environments/environment';
import { IApiMessage } from '../interfaces/api-message';
import { IApplication } from '../interfaces/application';
import { IFormBody } from '../interfaces/form-body';

@Injectable({
	providedIn: 'root',
})
export class ApplicationService {
	private myApiUrl: string;
	private API_SUFFIX = '/applications';

	constructor(private http: HttpClient) {
		this.myApiUrl = `${environment.endpoint}${environment.apiPrefix}${this.API_SUFFIX}`;
	}

	/**
	 * Fetches all applications and caches the result for subsequent subscribers.
	 * @returns An observable of the application array.
	 */
	getAll(): Observable<IApplication[]> {
		return this.http.get<IApplication[]>(`${this.myApiUrl}/all`).pipe(
			shareReplay(1),
			map((response: any) => response.data),
		);
	}

	/**
	 * Adds a new application.
	 * @param body The application data to add.
	 * @returns An observable of the API response message.
	 */
	add(body: IFormBody): Observable<IApiMessage> {
		return this.http
			.post(`${this.myApiUrl}/add`, { ...body })
			.pipe(map((response: IApiMessage) => response));
	}

	/**
	 * Updates an existing application.
	 * @param body The application data to update.
	 * @returns An observable of the API response message.
	 */
	update(body: IFormBody): Observable<IApiMessage> {
		return this.http
			.put(`${this.myApiUrl}/update/${body.id}`, { ...body })
			.pipe(map((response: IApiMessage) => response));
	}

	/**
	 * Deletes an application by its ID.
	 * @param applicationId The ID of the application to delete.
	 * @returns An observable of the API response message.
	 */
	delete(applicationId: number): Observable<IApiMessage> {
		return this.http
			.delete(`${this.myApiUrl}/delete/${applicationId}`)
			.pipe(map((response: IApiMessage) => response));
	}

	/**
	 * Gets a single application by its ID.
	 * @param applicationId The ID of the application to retrieve.
	 * @returns An observable of the application.
	 */
	get(applicationId: number): Observable<IApplication> {
		return this.http
			.get<IApplication>(`${this.myApiUrl}/get/${applicationId}`)
			.pipe(map((response: any) => response.data));
	}
}
