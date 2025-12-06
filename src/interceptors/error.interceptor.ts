import {
	HttpErrorResponse,
	HttpEvent,
	HttpHandler,
	HttpInterceptor,
	HttpRequest,
} from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, Observable, throwError } from 'rxjs';
import { ToastEventType } from '../enums/toast-event-type';
import { IApiMessage } from '../interfaces/api-message';
import { ToastService } from '../services/toast.service';

@Injectable()
export class ErrorInterceptor implements HttpInterceptor {
	_router = inject(Router);
	_toastService = inject(ToastService);

	intercept(
		request: HttpRequest<unknown>,
		next: HttpHandler,
	): Observable<HttpEvent<unknown>> {
		return next.handle(request).pipe(
			catchError((err: IApiMessage | HttpErrorResponse) => {
				if (err?.error?.msg) {
					if (err.error.msg === 'Invalid token') {
						this._router.navigateByUrl('login');
					} else {
						this._toastService.showToast(
							'Error',
							err.error.msg,
							ToastEventType.Error,
							6000,
						);
					}
				} else if (err instanceof HttpErrorResponse) {
					this._toastService.showToast(
						'An error has occured',
						err.message,
						ToastEventType.Error,
						6000,
					);
				}
				return throwError(() => err);
			}),
		);
	}
}
