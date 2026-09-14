import { HttpParams } from '@angular/common/http';
import { Component, Input } from '@angular/core';
import { Router } from '@angular/router';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import {
  DeviceType,
  DeviceTypeTab,
  getDeviceTypeTab,
} from 'src/app/modules/dash/models';
import { AddEditSubDevicesComponent } from '../../pages/sub-devices/add-edit/add-edit.component';
import { ApiService } from '../../services/api.service';
import { HttpService } from '../../services/http.service';
import { ToastrsService } from '../../services/toater.service';
import { SearchResultItem, SearchResults } from '../../services/search.service';

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
    private modalService: NgbModal,
    private api: ApiService,
    private httpService: HttpService,
    private toastrsService: ToastrsService,
  ) {}

  navigateTo(item: SearchResultItem) {
    switch (item.type) {
      case 'Device': {
        this.activeModal.close();
        const tab = this.getDeviceTab(item);
        const slug = tab?.slug || '';
        this.router.navigate(['/devices', slug], {
          queryParams: { highlight: item.id },
        });
        break;
      }
      case 'SubDevice':
        this.openSubDevice(item);
        break;
    }
  }

  openSubDevice(item: SearchResultItem) {
    const params = new HttpParams()
      .set('q', item.title)
      .set('size', 50)
      .set('page', 1);

    this.httpService.list(this.api.subDevices.list, { params }).subscribe({
      next: (res: any) => {
        const subDevice = res.success
          ? res.data.data.find((x: any) => x.id === item.id)
          : null;

        if (subDevice) {
          this.activeModal.close();
          const modalRef = this.modalService.open(AddEditSubDevicesComponent, {
            size: 'xl',
            centered: true,
          });
          modalRef.componentInstance.subDevice = subDevice;
        } else {
          this.toastrsService.Showerror('Sub Device Not Found!');
        }
      },
    });
  }

  // Device items carry their type only inside the "Type: X" subtitle
  // sent by the backend (X is the DeviceType enum name, e.g. "Router").
  getDeviceTab(item: SearchResultItem): DeviceTypeTab | undefined {
    const match = item.subtitle?.match(/Type:\s*([A-Za-z]+)/);
    if (!match) {
      return undefined;
    }
    const type = (DeviceType as any)[match[1]] as DeviceType | undefined;
    return type !== undefined ? getDeviceTypeTab(type) : undefined;
  }

  getCategoryIcon(item: SearchResultItem): string {
    if (item.type === 'Device') {
      return this.getDeviceTab(item)?.icon || 'fe-server';
    }
    return 'fe-radio';
  }

  getCategoryColor(type: string): string {
    switch (type) {
      case 'Device':
        return 'primary';
      case 'SubDevice':
        return 'success';
      default:
        return 'secondary';
    }
  }

  hasResults(): boolean {
    return this.results && this.results.total > 0;
  }
}
