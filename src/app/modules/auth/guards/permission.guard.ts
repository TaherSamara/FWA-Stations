import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Injectable({ providedIn: 'root' })
export class PermissionGuard implements CanActivate {
  constructor(
    private authService: AuthService,
    private router: Router,
  ) {}

  canActivate(route: ActivatedRouteSnapshot): boolean {
    const requiredPermission = route.data['permission'];
    const requiredPermissions = route.data['permissions'];

    // If no permission is required, allow access
    if (!requiredPermission && !requiredPermissions) {
      return true;
    }

    // Check single permission
    if (
      requiredPermission &&
      this.authService.hasPermission(requiredPermission)
    ) {
      return true;
    }

    // Check multiple permissions (user needs at least one)
    if (
      requiredPermissions &&
      this.authService.hasAnyPermission(requiredPermissions)
    ) {
      return true;
    }

    // User doesn't have required permission
    this.router.navigate(['/error/403']);
    return false;
  }
}
