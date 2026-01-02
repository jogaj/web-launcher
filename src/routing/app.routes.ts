import { Routes } from '@angular/router';
import { FormComponent } from '../components/form/form.component';
import { LoginComponent } from '../components/login/login.component';
import { MainViewComponent } from '../components/main-view/main-view.component';
import { isAuthenticatedGuard } from './guards/is-authenticated.guard';
import { applicationResolver } from './resolvers/application.resolver';

export const routes: Routes = [
	{ path: '', component: LoginComponent },
	{ path: 'login', component: LoginComponent, pathMatch: 'full' },
	{
		path: 'main-view',
		component: MainViewComponent,
		pathMatch: 'full',
		canActivate: [isAuthenticatedGuard],
	},
	{
		path: 'new',
		component: FormComponent,
		pathMatch: 'full',
		canActivate: [isAuthenticatedGuard],
	},
	{
		path: 'edit/:id',
		component: FormComponent,
		pathMatch: 'full',
		resolve: { application: applicationResolver },
		canActivate: [isAuthenticatedGuard],
	},
];
