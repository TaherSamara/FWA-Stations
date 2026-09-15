import { HttpParams } from '@angular/common/http';
import { Component, HostListener } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { AuthService } from 'src/app/modules/auth/services/auth.service';
import { DeviceType, PermissionCode } from 'src/app/modules/dash/models';
import { ApiService } from '../../services/api.service';
import { HttpService } from '../../services/http.service';
import { PublicService } from '../../services/public.service';
import { ToastrsService } from '../../services/toater.service';
import { DeleteComponent } from '../../shared/delete/delete.component';
import { ImportComponent } from '../../shared/import/import.component';
import { PingComponent } from '../../shared/ping/ping.component';
import { AddEditSubDevicesComponent } from './add-edit/add-edit.component';

@Component({
  selector: 'app-sub-devices',
  templateUrl: './sub-devices.component.html',
  styleUrls: ['./sub-devices.component.css'],
})
export class SubDevicesComponent {
  subDevices: any = [];
  devices: any = [];
  searchText: string = '';
  selectedDeviceId: number = 0;
  selectedDeviceType: DeviceType;
  selectedServiceType: number | null = null; // null = all service types
  serviceTypeCounts: any = { 10: 0, 20: 0, 30: 0 }; // Counts for each service type
  page: number = 1;
  size: number = 10;
  totalCount: number;
  totalRecords: number;

  // Actions menu (rendered fixed to the viewport so it never gets clipped by the table's scroll container)
  activeMenuSubDevice: any = null;
  menuPosition = { top: 0, left: 0 };

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
    this.loadDevices();

    this.selectedDeviceType = this.route.snapshot.data['deviceType'];

    // Check if deviceId is passed from route
    this.route.queryParams.subscribe((params) => {
      if (params['deviceId']) {
        this.selectedDeviceId = +params['deviceId'];
      }
      this.list(1);
    });
  }

  loadDevices(): void {
    let params = new HttpParams().set('page', 1).set('size', 1000);
    this.httpService
      .list(this.api.devices.list, { params }, 'devicesDropdown')
      .subscribe({
        next: (res: any) => {
          if (res.success) {
            this.devices = res.data.data;
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

    if (this.selectedDeviceId > 0) {
      params = params.set('device_id', this.selectedDeviceId);
    }

    // Add service type filter
    if (this.selectedServiceType !== null) {
      params = params.set('service_type', this.selectedServiceType);
    }

    this.httpService
      .list(
        this.api.subDevices.list,
        { params },
        withLoader ? 'subDevicesList' : '',
      )
      .subscribe({
        next: (res: any) => {
          if (res.success) {
            this.subDevices = res.data.data;
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
    this.selectedServiceType = this.selectedServiceType === type ? null : type;
    this.list(1);
  }

  isServiceTypeSelected(type: number): boolean {
    return this.selectedServiceType === type;
  }

  updateServiceTypeCounts(): void {
    // Get counts from all sub devices (without filter)
    let params = new HttpParams()
      .set('q', this.searchText)
      .set('size', 1000)
      .set('page', 1);

    if (this.selectedDeviceId > 0) {
      params = params.set('device_id', this.selectedDeviceId);
    }

    this.httpService
      .list(this.api.subDevices.list, { params }, 'countsLoading')
      .subscribe({
        next: (res: any) => {
          if (res.success) {
            const allSubDevices = res.data.data;
            this.serviceTypeCounts = {
              10: allSubDevices.filter((s: any) => s.service_type === 10)
                .length,
              20: allSubDevices.filter((s: any) => s.service_type === 20)
                .length,
              30: allSubDevices.filter((s: any) => s.service_type === 30)
                .length,
            };
          }
        },
      });
  }

  importExcel() {
    const modalRef = this.modalService.open(ImportComponent, {
      size: 'md',
      centered: true,
    });
    modalRef.componentInstance.type = 'subDevices';
    modalRef.componentInstance.deviceId = this.selectedDeviceId;
    modalRef.componentInstance.templateUrl =
      'https://docs.google.com/spreadsheets/d/1JswRyT2jGyZ1broehD-fGkG-ZjfxozLyLMu6PVTgMDY/edit?usp=sharing';
    modalRef.result.then(
      () => this.list(1, false),
      () => { },
    );
  }

  add() {
    const modalRef = this.modalService.open(AddEditSubDevicesComponent, {
      size: 'xl',
      centered: true,
    });
    modalRef.componentInstance.devices = this.devices;
    modalRef.componentInstance.deviceId = this.selectedDeviceId;
    modalRef.result.then(() => this.list(1, false));
  }

  edit(subDevice: any) {
    const modalRef = this.modalService.open(AddEditSubDevicesComponent, {
      size: 'xl',
      centered: true,
    });
    modalRef.componentInstance.subDevice = subDevice;
    modalRef.componentInstance.devices = this.devices;
    modalRef.result.then(() => this.list(1, false));
  }

  delete(subDevice: any) {
    const modalRef = this.modalService.open(DeleteComponent, {});
    modalRef.componentInstance.id = subDevice.id;
    modalRef.componentInstance.type = 'subDevice';
    modalRef.componentInstance.message = `Do you want to delete ${subDevice.name}?`;
    modalRef.result.then(() => this.list(1, false));
  }

  getServiceTypeName(type: number): string {
    const types: any = {
      0: 'None',
      10: 'Mobadara',
      20: 'PTP',
      30: 'Base Station',
    };
    return types[type] ?? 'Unknown';
  }

  pingIP(subDevice: any) {
    if (!subDevice.management_ip) {
      this.toastrsService.Showerror('No IP address available');
      return;
    }
    const modalRef = this.modalService.open(PingComponent, {
      size: 'lg',
      centered: true,
    });
    modalRef.componentInstance.ip = subDevice.management_ip;
  }

  toggleMenu(event: MouseEvent, subDevice: any): void {
    event.stopPropagation();

    if (this.activeMenuSubDevice === subDevice) {
      this.activeMenuSubDevice = null;
      return;
    }

    const rect = (event.currentTarget as HTMLElement).getBoundingClientRect();
    const menuWidth = 200;
    this.menuPosition = {
      top: rect.bottom + 4,
      left: Math.max(8, rect.right - menuWidth),
    };
    this.activeMenuSubDevice = subDevice;
  }

  closeMenu(): void {
    this.activeMenuSubDevice = null;
  }

  @HostListener('document:click')
  onDocumentClick(): void {
    this.closeMenu();
  }

  @HostListener('window:scroll')
  @HostListener('window:resize')
  onViewportChange(): void {
    this.closeMenu();
  }
}
