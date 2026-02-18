import { Component, Input } from '@angular/core';
import { Router } from '@angular/router';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { SearchResults } from '../../services/search.service';

@Component({
  selector: 'app-search-results',
  templateUrl: './search-results.component.html',
  styleUrls: ['./search-results.component.css'],
})
export class SearchResultsComponent {
  @Input() results!: SearchResults;
  @Input() query!: string;

  constructor(
    public activeModal: NgbActiveModal,
    private router: Router,
  ) {}

  navigateTo(item: any) {
    this.activeModal.close();

    switch (item.type) {
      case 'User':
        this.router.navigate(['/users'], {
          queryParams: { highlight: item.id },
        });
        break;
      case 'Station':
        this.router.navigate(['/stations'], {
          queryParams: { highlight: item.id },
        });
        break;
      case 'Subscriber':
        this.router.navigate(['/subscribers'], {
          queryParams: { highlight: item.id },
        });
        break;
      case 'Device':
        this.router.navigate(['/warehouse'], {
          queryParams: { highlight: item.id },
        });
        break;
    }
  }

  getCategoryIcon(type: string): string {
    switch (type) {
      case 'User':
        return 'fe-users';
      case 'Station':
        return 'fe-server';
      case 'Subscriber':
        return 'fe-radio';
      case 'Device':
        return 'fe-package';
      default:
        return 'fe-search';
    }
  }

  getCategoryColor(type: string): string {
    switch (type) {
      case 'User':
        return 'primary';
      case 'Station':
        return 'info';
      case 'Subscriber':
        return 'success';
      case 'Device':
        return 'warning';
      default:
        return 'secondary';
    }
  }

  hasResults(): boolean {
    return this.results && this.results.total > 0;
  }
}
