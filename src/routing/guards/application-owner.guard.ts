import { ActivatedRouteSnapshot, CanActivateFn } from "@angular/router";

export const applicationOwnerGuard: CanActivateFn = (route: ActivatedRouteSnapshot, state) => {
    console.log(route.data);
    return false;
}