import { HttpParams } from '@angular/common/http';
import { Component, HostListener } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { AuthService } from 'src/app/modules/auth/services/auth.service';
import { PermissionCode } from 'src/app/modules/dash/models';
import { ApiService } from '../../services/api.service';
import { HttpService } from '../../services/http.service';
import { PermissionsService } from '../../services/permissions.service';
import { PublicService } from '../../services/public.service';
import { ToastrsService } from '../../services/toater.service';
import { DeleteComponent } from '../../shared/delete/delete.component';
import { AddEditUsersComponent } from './add-edit/add-edit.component';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.css'],
})
export class UsersComponent {
  users: any = [];
  searchText: string = '';
  page: number = 1;
  size: number = 10;
  totalCount: number;
  totalRecords: number;

  // Permissions
  PermissionCode = PermissionCode;
  hoveredCategory: any = null;
  popPosition = { top: 0, left: 0 };

  constructor(
    public httpService: HttpService,
    private api: ApiService,
    public publicService: PublicService,
    private toastrsService: ToastrsService,
    private modalService: NgbModal,
    public authService: AuthService,
    private permissionsService: PermissionsService,
  ) {
    this.size = this.publicService.getNumOfRows(290, 70.57);
  }

  ngOnInit(): void {
    this.list(1);
  }

  list(p: number, withLoader: boolean = true): void {
    this.page = p;
    let params = new HttpParams()
      .set('q', this.searchText)
      .set('size', this.size)
      .set('page', this.page);

    this.httpService
      .list(this.api.users.list, { params }, withLoader ? 'usersList' : '')
      .subscribe({
        next: (res: any) => {
          if (res.success) {
            this.users = res.data.data;
            // Computed once so the chips keep a stable identity (needed for hover)
            this.users.forEach((u: any) => {
              u.permission_groups = this.getPermissionsByCategory(u.permissions);
            });
            this.totalCount = res.data.total_count;
            this.totalRecords = res.data.total_records;
          } else {
            this.toastrsService.Showerror(res.msg);
          }
        },
      });
  }

  add() {
    const modalRef = this.modalService.open(AddEditUsersComponent, {
      size: 'xl',
      centered: true,
    });
    modalRef.result.then(
      () => this.list(1, false),
      () => {},
    );
  }

  edit(user: any) {
    const modalRef = this.modalService.open(AddEditUsersComponent, {
      size: 'xl',
      centered: true,
    });
    modalRef.componentInstance.user = user;
    modalRef.result.then(
      () => this.list(1, false),
      () => {},
    );
  }

  delete(user: any) {
    const modalRef = this.modalService.open(DeleteComponent, {});
    modalRef.componentInstance.id = user.id;
    modalRef.componentInstance.type = 'user';
    modalRef.componentInstance.message = `Do you want to delete ${user.first_name} ${user.last_name}?`;
    modalRef.result.then(
      () => this.list(1, false),
      () => {},
    );
  }

  // Group permissions by category with count
  getPermissionsByCategory(permissions: any[]): any[] {
    if (!permissions || permissions.length === 0) return [];

    const grouped: { [key: string]: any } = {};

    permissions.forEach((perm: any) => {
      const category = perm.category || 'OTHER';
      const categoryName = this.formatCategoryName(category);

      if (!grouped[category]) {
        grouped[category] = {
          name: categoryName,
          count: 0,
          permissions: [],
        };
      }

      grouped[category].count++;
      grouped[category].permissions.push(perm);
    });

    return Object.keys(grouped)
      .sort(
        (a, b) =>
          this.permissionsService.categoryOrder(a) -
          this.permissionsService.categoryOrder(b),
      )
      .map((key) => grouped[key]);
  }

  // Hover details
  showPerms(event: MouseEvent, category: any): void {
    const rect = (event.currentTarget as HTMLElement).getBoundingClientRect();
    this.popPosition = { top: rect.bottom + 6, left: rect.left };
    this.hoveredCategory = category;
  }

  hidePerms(): void {
    this.hoveredCategory = null;
  }

  @HostListener('window:scroll')
  onScroll(): void {
    this.hidePerms();
  }

  // Format category name for display
  formatCategoryName(category: string): string {
    if (!category) return 'Other';

    // Convert "USERS" to "Users", "STATIONS" to "Stations", etc.
    const text = category.replace(/_/g, ' ').toLowerCase();
    return text.charAt(0).toUpperCase() + text.slice(1);
  }

  // Get tooltip with permission details
  getCategoryTooltip(category: any): string {
    if (!category.permissions || category.permissions.length === 0) {
      return category.name;
    }

    const permissionNames = category.permissions
      .map((p: any) => p.name)
      .join('\n• ');

    return `${category.name}:\n• ${permissionNames}`;
  }

  reset() {
    this.searchText = '';
    this.size = this.publicService.getNumOfRows(290, 70.57);
    this.list(1);
  }
}
