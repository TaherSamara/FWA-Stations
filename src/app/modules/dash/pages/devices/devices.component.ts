import { HttpParams } from '@angular/common/http';
import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { AuthService } from 'src/app/modules/auth/services/auth.service';
import { DeviceType, getDeviceTypeTab, PermissionCode } from 'src/app/modules/dash/models';
import { ApiService } from '../../services/api.service';
import { HttpService } from '../../services/http.service';
import { PublicService } from '../../services/public.service';
import { ToastrsService } from '../../services/toater.service';
import { DeleteComponent } from '../../shared/delete/delete.component';
import { AddEditDevicesComponent } from './add-edit/add-edit.component';

@Component({
  selector: 'app-devices',
  templateUrl: './devices.component.html',
  styleUrls: ['./devices.component.css'],
})
export class DevicesComponent {
  devices: any = [];
  searchText: string = '';
  page: number = 1;
  size: number = 18;
  totalCount: number;
  totalRecords: number;
  deviceType: DeviceType;

  // Permissions
  PermissionCode = PermissionCode;

  constructor(
    public httpService: HttpService,
    private api: ApiService,
    public publicService: PublicService,
    private toastrsService: ToastrsService,
    private modalService: NgbModal,
    private router: Router,
    private route: ActivatedRoute,
    public authService: AuthService,
  ) {}

  ngOnInit(): void {
    this.route.data.subscribe((data) => {
      this.deviceType = data['deviceType'];
      this.list(1);
    });
  }

  list(p: number, withLoader: boolean = true): void {
    this.page = p;
    let params = new HttpParams()
      .set('q', this.searchText)
      .set('size', this.size)
      .set('page', this.page)
      .set('type', this.deviceType);

    this.httpService
      .list(
        this.api.devices.list,
        { params },
        withLoader ? 'devicesList' : '',
      )
      .subscribe({
        next: (res: any) => {
          if (res.success) {
            this.devices = res.data.data;
            this.totalCount = res.data.total_count;
            this.totalRecords = res.data.total_records;
          } else {
            this.toastrsService.Showerror(res.msg);
          }
        },
      });
  }

  add() {
    const modalRef = this.modalService.open(AddEditDevicesComponent, {
      size: 'md',
      centered: true,
    });
    modalRef.componentInstance.deviceType = this.deviceType;
    modalRef.result.then(() => this.list(1, false));
  }

  edit(device: any) {
    const modalRef = this.modalService.open(AddEditDevicesComponent, {
      size: 'md',
      centered: true,
    });
    modalRef.componentInstance.device = device;
    modalRef.result.then(() => this.list(1, false));
  }

  delete(device: any) {
    const modalRef = this.modalService.open(DeleteComponent, {});
    modalRef.componentInstance.id = device.id;
    modalRef.componentInstance.type = 'device';
    modalRef.componentInstance.message = `Do you want to delete ${device.name}?`;
    modalRef.result.then(() => this.list(1, false));
  }

  viewSubDevices(device: any) {
    const slug = getDeviceTypeTab(device.type)?.slug || '';
    this.router.navigate(['/sub-devices', slug], {
      queryParams: { deviceId: device.id },
    });
  }
}
