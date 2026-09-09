import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from './api.service';
import { HttpService } from './http.service';

export interface SearchResultItem {
  id: number;
  type: 'Device' | 'SubDevice';
  title: string;
  subtitle: string;
  image: string | null;
}

export interface SearchResults {
  devices: {
    count: number;
    items: SearchResultItem[];
  };
  subDevices: {
    count: number;
    items: SearchResultItem[];
  };
  total: number;
}

@Injectable({
  providedIn: 'root',
})
export class SearchService {
  constructor(
    private api: ApiService,
    private http: HttpService,
  ) {}

  search(query: string): Observable<any> {
    return this.http.list(
      this.api.Search + '?q=' + encodeURIComponent(query),
      {},
      'search',
    );
  }

  getLoading(): Observable<boolean> {
    return this.http.getLoading('search');
  }
}
