import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { catchError, map, shareReplay } from 'rxjs/operators';
import { Permission } from 'src/app/modules/dash/models';
import { ApiService } from './api.service';

@Injectable({
  providedIn: 'root',
})
export class PermissionsService {
  private permissionsCache$: Observable<Permission[]> | null = null;

  constructor(
    private http: HttpClient,
    private api: ApiService,
  ) {}

  /**
   * Get all available permissions (with caching)
   */
  getPermissions(): Observable<Permission[]> {
    if (!this.permissionsCache$) {
      this.permissionsCache$ = this.http
        .get<any>(this.api.common.permissions)
        .pipe(
          map((response) => {
            if (!response.success || !response.data) {
              return [];
            }

            // Transform new API structure to flat array
            const allPermissions: Permission[] = [];
            response.data.forEach((categoryGroup: any) => {
              if (
                categoryGroup.permissions &&
                Array.isArray(categoryGroup.permissions)
              ) {
                categoryGroup.permissions.forEach((permission: any) => {
                  allPermissions.push({
                    id: permission.id,
                    name: permission.name,
                    code: permission.code,
                    description: permission.description,
                    category: categoryGroup.category,
                  });
                });
              }
            });
            return allPermissions;
          }),
          catchError((error) => {
            return of([]);
          }),
          shareReplay(1),
        );
    }
    return this.permissionsCache$;
  }

  /**
   * Get permissions grouped by category
   */
  getPermissionsByCategory(): Observable<{ [category: string]: Permission[] }> {
    return this.getPermissions().pipe(
      map((permissions) => {
        const grouped: { [category: string]: Permission[] } = {};
        permissions.forEach((permission) => {
          if (!grouped[permission.category]) {
            grouped[permission.category] = [];
          }
          grouped[permission.category].push(permission);
        });
        return grouped;
      }),
    );
  }

  /**
   * Get category display name
   */
  getCategoryName(category: string): string {
    const names: { [key: string]: string } = {
      USERS: 'Users Management',
      STATIONS: 'Stations Management',
      SUBSCRIBERS: 'Subscribers Management',
      WAREHOUSE: 'Warehouse Management',
      DEVICES: 'Devices Management',
    };
    return names[category] || category;
  }
}
