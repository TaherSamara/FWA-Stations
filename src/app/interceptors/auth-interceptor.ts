import {
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { tap } from 'rxjs/operators';
import { AuthService } from '../modules/auth/services/auth.service';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  constructor(private authService: AuthService) {}

  intercept(req: HttpRequest<any>, next: HttpHandler) {
    const data = JSON.parse(localStorage.getItem('fwa-system-data') as any);
    if (data) {
      var req = req.clone({
        headers: req.headers.set('Authorization', `Bearer ${data.token}`),
      });
    }

    return next.handle(req).pipe(
      tap({
        next: (res: any) => {
          if (res.body?.statusCode == 401) {
            this.authService.logout();
            return;
          }
        },
      }),
    );
  }
}
