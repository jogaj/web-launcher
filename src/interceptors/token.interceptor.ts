import {
	HttpEvent,
	HttpHandler,
	HttpInterceptor,
	HttpRequest,
} from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { Constants } from '../enums/constants';
import { LocalStoreService } from '../services/local-store.service';

@Injectable()
export class TokenInterceptor implements HttpInterceptor {
	_router = inject(Router);
	_localStoreSvc = inject(LocalStoreService);

	intercept(
		request: HttpRequest<unknown>,
		next: HttpHandler,
	): Observable<HttpEvent<unknown>> {
		const token = this._localStoreSvc.get(Constants.AuthKey);
		if (token) {
			request = request.clone({
				setHeaders: { Authorization: `Bearer ${token}` },
			});
		}
		return next.handle(request);
	}
}
