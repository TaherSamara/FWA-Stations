import { HttpParams } from '@angular/common/http';
import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { AuthService } from 'src/app/modules/auth/services/auth.service';
import { PermissionCode } from 'src/app/modules/dash/models';
import { ApiService } from '../../services/api.service';
import { HttpService } from '../../services/http.service';
import { PublicService } from '../../services/public.service';
import { ToastrsService } from '../../services/toater.service';
import { DeleteComponent } from '../../shared/delete/delete.component';
import { ImportComponent } from '../../shared/import/import.component';
import { PingComponent } from '../../shared/ping/ping.component';
import { AddEditSubscribersComponent } from './add-edit/add-edit.component';

@Component({
  selector: 'app-subscribers',
  templateUrl: './subscribers.component.html',
  styleUrls: ['./subscribers.component.css'],
})
export class SubscribersComponent {
  subscribers: any = [];
  stations: any = [];
  searchText: string = '';
  selectedStationId: number = 0;
  selectedServiceTypes: number[] = [10, 20, 30]; // Default: all filters selected
  serviceTypeCounts: any = { 10: 0, 20: 0, 30: 0 }; // Counts for each service type
  page: number = 1;
  size: number = 10;
  totalCount: number;
  totalRecords: number;

  // Permissions
  PermissionCode = PermissionCode;

  constructor(
    public httpService: HttpService,
    private api: ApiService,
    public publicService: PublicService,
    private toastrsService: ToastrsService,
    private modalService: NgbModal,
    private route: ActivatedRoute,
    public authService: AuthService,
  ) {
    this.size = this.publicService.getNumOfRows(290, 70.57);
  }

  ngOnInit(): void {
    this.loadStations();

    // Check if stationId is passed from route
    this.route.queryParams.subscribe((params) => {
      if (params['stationId']) {
        this.selectedStationId = +params['stationId'];
      }
      this.list(1);
    });
  }

  loadStations(): void {
    let params = new HttpParams().set('page', 1).set('size', 1000);
    this.httpService
      .list(this.api.stations.list, { params }, 'stationsDropdown')
      .subscribe({
        next: (res: any) => {
          if (res.success) {
            this.stations = res.data.data;
          }
        },
      });
  }

  list(p: number, withLoader: boolean = true): void {
    this.page = p;
    let params = new HttpParams()
      .set('q', this.searchText)
      .set('size', this.size)
      .set('page', this.page);

    if (this.selectedStationId > 0) {
      params = params.set('stationId', this.selectedStationId);
    }

    // Add service type filters
    if (this.selectedServiceTypes.length > 0) {
      params = params.set('serviceTypes', this.selectedServiceTypes.join(','));
    }

    this.httpService
      .list(
        this.api.subscribers.list,
        { params },
        withLoader ? 'subscribersList' : '',
      )
      .subscribe({
        next: (res: any) => {
          if (res.success) {
            this.subscribers = res.data.data;
            this.totalCount = res.data.total_count;
            this.totalRecords = res.data.total_records;
            this.updateServiceTypeCounts();
          } else {
            this.toastrsService.Showerror(res.msg);
          }
        },
      });
  }

  toggleServiceType(type: number): void {
    const index = this.selectedServiceTypes.indexOf(type);
    if (index > -1) {
      this.selectedServiceTypes.splice(index, 1);
    } else {
      this.selectedServiceTypes.push(type);
    }
    this.list(1);
  }

  isServiceTypeSelected(type: number): boolean {
    return this.selectedServiceTypes.indexOf(type) > -1;
  }

  updateServiceTypeCounts(): void {
    // Get counts from all subscribers (without filter)
    let params = new HttpParams()
      .set('q', this.searchText)
      .set('size', 1000)
      .set('page', 1);

    if (this.selectedStationId > 0) {
      params = params.set('stationId', this.selectedStationId);
    }

    this.httpService
      .list(this.api.subscribers.list, { params }, 'countsLoading')
      .subscribe({
        next: (res: any) => {
          if (res.success) {
            const allSubscribers = res.data.data;
            this.serviceTypeCounts = {
              10: allSubscribers.filter((s: any) => s.service_type === 10)
                .length,
              20: allSubscribers.filter((s: any) => s.service_type === 20)
                .length,
              30: allSubscribers.filter((s: any) => s.service_type === 30)
                .length,
            };
          }
        },
      });
  }

  add() {
    const modalRef = this.modalService.open(AddEditSubscribersComponent, {
      size: 'xl',
      centered: true,
    });
    modalRef.componentInstance.stations = this.stations;
    modalRef.result.then(() => this.list(1, false));
  }

  edit(subscriber: any) {
    const modalRef = this.modalService.open(AddEditSubscribersComponent, {
      size: 'xl',
      centered: true,
    });
    modalRef.componentInstance.subscriber = subscriber;
    modalRef.componentInstance.stations = this.stations;
    modalRef.result.then(() => this.list(1, false));
  }

  delete(subscriber: any) {
    const modalRef = this.modalService.open(DeleteComponent, {});
    modalRef.componentInstance.id = subscriber.id;
    modalRef.componentInstance.type = 'subscriber';
    modalRef.componentInstance.message = `Do you want to delete ${subscriber.name}?`;
    modalRef.result.then(() => this.list(1, false));
  }

  importExcel() {
    const modalRef = this.modalService.open(ImportComponent, {
      size: 'md',
      centered: true,
    });
    modalRef.result.then(() => this.list(1, false));
  }

  getServiceTypeName(type: number): string {
    const types: any = {
      10: 'Mobadara',
      20: 'PTP',
      30: 'Base Station',
    };
    return types[type] || 'Unknown';
  }

  pingIP(subscriber: any) {
    if (!subscriber.management_ip) {
      this.toastrsService.Showerror('No IP address available');
      return;
    }
    const modalRef = this.modalService.open(PingComponent, {
      size: 'lg',
      centered: true,
    });
    modalRef.componentInstance.ip = subscriber.management_ip;
  }
}
