import { Directive, Input, TemplateRef, ViewContainerRef } from '@angular/core';
import { AuthService } from '../../auth/services/auth.service';

@Directive({
  selector: '[hasPermission]',
})
export class HasPermissionDirective {
  private hasView = false;

  constructor(
    private templateRef: TemplateRef<any>,
    private viewContainer: ViewContainerRef,
    private authService: AuthService,
  ) {}

  @Input() set hasPermission(permission: string | string[]) {
    const hasPermission = Array.isArray(permission)
      ? this.authService.hasAnyPermission(permission)
      : this.authService.hasPermission(permission);

    if (hasPermission && !this.hasView) {
      this.viewContainer.createEmbeddedView(this.templateRef);
      this.hasView = true;
    } else if (!hasPermission && this.hasView) {
      this.viewContainer.clear();
      this.hasView = false;
    }
  }
}
