import { inject } from "@angular/core";
import { ActivatedRoute, ActivatedRouteSnapshot, RouterStateSnapshot } from "@angular/router";
import { AuthService } from "../services/auth.service";

export const ModeratorGuard = (
route: ActivatedRouteSnapshot,
state: RouterStateSnapshot,
) => {
  const authService = inject(AuthService);
  return authService.isModerator();
}
