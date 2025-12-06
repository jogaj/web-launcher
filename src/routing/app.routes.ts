import { Routes } from '@angular/router';
import { FormComponent } from '../components/form/form.component';
import { LoginComponent } from '../components/login/login.component';
import { MainViewComponent } from '../components/main-view/main-view.component';
import { applicationResolver } from './resolvers/application.resolver';

export const routes: Routes = [
	{ path: '', component: LoginComponent },
	{ path: 'login', component: LoginComponent, pathMatch: 'full' },
	{ path: 'main-view', component: MainViewComponent, pathMatch: 'full' },
	{ path: 'new', component: FormComponent, pathMatch: 'full' },
	{
		path: 'edit/:id',
		component: FormComponent,
		pathMatch: 'full',
		resolve: { application: applicationResolver },
	},
];
