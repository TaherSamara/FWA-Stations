import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { PermissionCode } from 'src/app/modules/dash/models';
import { environment } from 'src/environments/environment';
import { ApiService } from '../../dash/services/api.service';

const API_BASE_URL = `${environment.apiUrl}/api/auth`;

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  isAuthLoading$: Observable<boolean>;
  isAuthLoadingSubject: BehaviorSubject<boolean>;

  constructor(
    private http: HttpClient,
    private router: Router,
    private apiService: ApiService,
  ) {
    this.isAuthLoadingSubject = new BehaviorSubject<boolean>(false);
    this.isAuthLoading$ = this.isAuthLoadingSubject.asObservable();
  }

  login(email: string, password: string): Observable<any> {
    this.isAuthLoadingSubject.next(true);
    return this.http
      .post<any>(`${API_BASE_URL}/login`, { email, password })
      .pipe(
        tap({
          next: (res: any) => {
            if (res.success) {
              localStorage.setItem('fwa-system-data', JSON.stringify(res.data));
            }
            return res;
          },
          error: (err: any) => err,
          finalize: () => this.isAuthLoadingSubject.next(false),
        }),
      );
  }

  forget(email: string): Observable<any> {
    this.isAuthLoadingSubject.next(true);
    return this.http
      .post<any>(`${API_BASE_URL}/forget-password`, { email })
      .pipe(
        tap({
          next: (res: any) => res,
          error: (err: any) => err,
          finalize: () => this.isAuthLoadingSubject.next(false),
        }),
      );
  }

  reset(id: string, password: string): Observable<any> {
    this.isAuthLoadingSubject.next(true);
    return this.http
      .post<any>(`${API_BASE_URL}/reset-password`, { id, password })
      .pipe(
        tap({
          next: (res: any) => res,
          error: (err: any) => err,
          finalize: () => this.isAuthLoadingSubject.next(false),
        }),
      );
  }

  changePassword(
    old_password: string,
    new_password: string,
    confirm_password: string,
  ): Observable<any> {
    this.isAuthLoadingSubject.next(true);
    return this.http
      .post<any>(`${API_BASE_URL}/change-password`, {
        old_password,
        new_password,
        confirm_password,
      })
      .pipe(
        tap({
          next: (res: any) => res,
          error: (err: any) => err,
          finalize: () => this.isAuthLoadingSubject.next(false),
        }),
      );
  }

  logout() {
    localStorage.removeItem('fwa-system-data');
    this.router.navigate(['/auth/login']);
  }

  /**
   * Get user permissions from localStorage
   */
  getUserPermissions(): string[] {
    const data = localStorage.getItem('fwa-system-data');
    if (!data) {
      return [];
    }

    const userData = JSON.parse(data);

    // Check both possible locations for permissions
    let permissions =
      userData?.permissions || userData?.user?.permissions || [];

    // Handle both formats: array of strings or array of objects with code property
    if (permissions.length > 0) {
      // If first element is a string, return as is
      if (typeof permissions[0] === 'string') {
        return permissions;
      }
      // If first element is an object, extract code property
      const codes = permissions.map((p: any) => p.code);
      return codes;
    }

    return [];
  }

  /**
   * Check if user has a specific permission
   */
  hasPermission(permissionCode: string | PermissionCode): boolean {
    const permissions = this.getUserPermissions();
    return permissions.includes(permissionCode as string);
  }

  /**
   * Check if user has any of the specified permissions
   */
  hasAnyPermission(permissionCodes: string[]): boolean {
    const permissions = this.getUserPermissions();
    return permissionCodes.some((code) => permissions.includes(code));
  }

  /**
   * Check if user has all of the specified permissions
   */
  hasAllPermissions(permissionCodes: string[]): boolean {
    const permissions = this.getUserPermissions();
    return permissionCodes.every((code) => permissions.includes(code));
  }
}
