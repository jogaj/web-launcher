import {
	HTTP_INTERCEPTORS,
	provideHttpClient,
	withFetch,
	withInterceptorsFromDi,
} from '@angular/common/http';
import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import {
	createUrlTreeFromSnapshot,
	provideRouter,
	ViewTransitionInfo,
	withComponentInputBinding,
	withViewTransitions,
} from '@angular/router';
import { ErrorInterceptor } from '../interceptors/error.interceptor';
import { TokenInterceptor } from '../interceptors/token.interceptor';
import { routes } from '../routing/app.routes';

export const appConfig: ApplicationConfig = {
	providers: [
		provideZoneChangeDetection({ eventCoalescing: true }),
		provideRouter(
			routes,
			withComponentInputBinding(),
			withViewTransitions({ onViewTransitionCreated }),
		),
		provideHttpClient(withFetch(), withInterceptorsFromDi()),
		// provideHttpClient(withInterceptors([ErrorInterceptor]))
		{ provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true },
		{ provide: HTTP_INTERCEPTORS, useClass: TokenInterceptor, multi: true },
	],
};

async function onViewTransitionCreated(info: ViewTransitionInfo) {
	const fromRoute = createUrlTreeFromSnapshot(info.from, []).toString();
	const toRoute = createUrlTreeFromSnapshot(info.to, []).toString();
	const doc = document.documentElement;

	if (
		((fromRoute === '/new' || fromRoute.includes('/edit/')) &&
			toRoute === '/main-view') ||
		(fromRoute != '' && toRoute === '/login')
	) {
		doc.classList.add('slide-backward');
		doc.classList.remove('slide-forward');
	} else {
		doc.classList.add('slide-forward');
		doc.classList.remove('slide-backward');
	}
}
