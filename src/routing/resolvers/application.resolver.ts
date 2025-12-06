import { inject } from '@angular/core';
import {
	ActivatedRouteSnapshot,
	ResolveFn,
	RouterStateSnapshot,
} from '@angular/router';
import { IApplication } from '../../interfaces/application';
import { ApplicationService } from '../../services/application.service';

export const applicationResolver: ResolveFn<IApplication> = (
	route: ActivatedRouteSnapshot,
	_: RouterStateSnapshot,
) => {
	const _appSvc = inject(ApplicationService);
	const appId = route.params['id'];
	return _appSvc.get(appId);
};
