import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/modules/auth/services/auth.service';
import { PermissionCode } from './models';

@Component({
  selector: 'app-redirect',
  template:
    '<div class="d-flex justify-content-center align-items-center" style="height: 100vh;"><div class="spinner-border text-primary" role="status"></div></div>',
})
export class RedirectComponent implements OnInit {
  constructor(
    private authService: AuthService,
    private router: Router,
  ) {}

  ngOnInit(): void {
    this.redirectToFirstAvailablePage();
  }

  redirectToFirstAvailablePage(): void {
    // Check permissions in order and redirect to first available page
    if (this.authService.hasPermission(PermissionCode.VIEW_USERS)) {
      this.router.navigate(['/users']);
    } else if (this.authService.hasPermission(PermissionCode.VIEW_STATIONS)) {
      this.router.navigate(['/stations']);
    } else if (
      this.authService.hasPermission(PermissionCode.VIEW_SUBSCRIBERS)
    ) {
      this.router.navigate(['/subscribers']);
    } else if (
      this.authService.hasPermission(PermissionCode.VIEW_ALL_DEVICES) ||
      this.authService.hasPermission(PermissionCode.VIEW_MY_DEVICES)
    ) {
      this.router.navigate(['/warehouse']);
    } else {
      // No permissions, redirect to 403
      this.router.navigate(['/error/403']);
    }
  }
}
