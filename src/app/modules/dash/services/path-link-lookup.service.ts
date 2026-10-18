import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { catchError, map, shareReplay } from 'rxjs/operators';
import { LookupDevice, LookupPort } from '../models';
import { ApiService } from './api.service';

@Injectable({
  providedIn: 'root',
})
export class PathLinkLookupService {
  private cache = new Map<string, Observable<any[]>>();

  constructor(
    private http: HttpClient,
    private api: ApiService,
  ) {}

  devices(type: number): Observable<LookupDevice[]> {
    return this.get(this.api.pathLinks.devices, new HttpParams().set('type', type));
  }

  slots(deviceId: number): Observable<string[]> {
    return this.get(this.api.pathLinks.slots, new HttpParams().set('device_id', deviceId));
  }

  ports(deviceId: number, slot: string): Observable<LookupPort[]> {
    return this.get(
      this.api.pathLinks.ports,
      new HttpParams().set('device_id', deviceId).set('slot', slot ?? ''),
    );
  }

  clear(): void {
    this.cache.clear();
  }

  private get<T>(url: string, params: HttpParams): Observable<T[]> {
    const key = url + '?' + params.toString();
    if (!this.cache.has(key)) {
      this.cache.set(
        key,
        this.http.get<any>(url, { params }).pipe(
          map((res) => (res?.success ? res.data || [] : [])),
          catchError(() => {
            this.cache.delete(key);
            return of([]);
          }),
          shareReplay(1),
        ),
      );
    }
    return this.cache.get(key)! as Observable<T[]>;
  }
}
