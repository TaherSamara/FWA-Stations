import { Component } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { debounceTime, distinctUntilChanged, Subject } from 'rxjs';
import { PermissionCode } from 'src/app/modules/dash/models';
import { AuthService } from '../../../auth/services/auth.service';
import { PublicService } from '../../services/public.service';
import { SearchService } from '../../services/search.service';
import { ChangePasswordComponent } from '../change-password/change-password.component';
import { SearchResultsComponent } from '../search-results/search-results.component';

@Component({
  selector: 'app-side-bar',
  templateUrl: './side-bar.component.html',
  styleUrls: ['./side-bar.component.css'],
})
export class SidebarComponent {
  user: any = {};
  PermissionCode = PermissionCode;
  searchQuery: string = '';
  private searchSubject = new Subject<string>();
  private currentSearchModal: any = null;

  constructor(
    public authService: AuthService,
    private modalService: NgbModal,
    public publicService: PublicService,
    private searchService: SearchService,
  ) {
    // Setup debounced search
    this.searchSubject
      .pipe(debounceTime(500), distinctUntilChanged())
      .subscribe((query) => {
        if (query && query.trim().length >= 2) {
          this.performSearch(query.trim());
        }
      });
  }

  ngOnInit(): void {
    this.user = this.publicService.getUserData();
  }

  onSearchInput(event: any): void {
    const query = event.target.value;
    this.searchSubject.next(query);
  }

  onSearchKeyup(event: KeyboardEvent): void {
    if (event.key === 'Enter' && this.searchQuery.trim().length >= 2) {
      this.performSearch(this.searchQuery.trim());
    }
  }

  performSearch(query: string): void {
    this.searchService.search(query).subscribe({
      next: (response: any) => {
        if (response.success && response.data) {
          this.openSearchResults(response.data, query);
        }
      },
      error: (error) => {
        console.error('Search error:', error);
      },
    });
  }

  openSearchResults(results: any, query: string): void {
    // Close any existing search modal before opening a new one
    if (this.currentSearchModal) {
      this.currentSearchModal.dismiss();
    }

    this.currentSearchModal = this.modalService.open(SearchResultsComponent, {
      size: 'lg',
      centered: true,
      scrollable: true,
    });
    this.currentSearchModal.componentInstance.results = results;
    this.currentSearchModal.componentInstance.query = query;

    // Clear the reference when modal is closed
    this.currentSearchModal.result.finally(() => {
      this.currentSearchModal = null;
    });
  }

  openSm(content: any): void {
    this.modalService.open(content, { centered: true });
  }

  openChangePassword(): void {
    this.modalService.open(ChangePasswordComponent, { centered: true });
  }

  logout() {
    this.authService.logout();
  }
}
