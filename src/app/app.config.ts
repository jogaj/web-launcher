import {
	HTTP_INTERCEPTORS,
	provideHttpClient,
	withFetch,
	withInterceptorsFromDi,
} from '@angular/common/http';
import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter, withComponentInputBinding } from '@angular/router';
import { ErrorInterceptor } from '../interceptors/error.interceptor';
import { TokenInterceptor } from '../interceptors/token.interceptor';
import { routes } from '../routing/app.routes';

export const appConfig: ApplicationConfig = {
	providers: [
		provideZoneChangeDetection({ eventCoalescing: true }),
		provideRouter(routes, withComponentInputBinding()),
		provideHttpClient(withFetch(), withInterceptorsFromDi()),
		// provideHttpClient(withInterceptors([ErrorInterceptor]))
		{ provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true },
		{ provide: HTTP_INTERCEPTORS, useClass: TokenInterceptor, multi: true },
	],
};
