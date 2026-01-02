import { inject } from '@angular/core';
import { CanActivateFn } from '@angular/router';
import { StateService } from '../../services/state.service';

export const isAuthenticatedGuard: CanActivateFn = () => {
	const _stateSvc = inject(StateService);

	return _stateSvc.currentUser != null;
};
