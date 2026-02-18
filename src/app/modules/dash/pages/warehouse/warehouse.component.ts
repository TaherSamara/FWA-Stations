import { HttpParams } from '@angular/common/http';
import { Component } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { AuthService } from 'src/app/modules/auth/services/auth.service';
import { PermissionCode } from 'src/app/modules/dash/models';
import { ApiService } from '../../services/api.service';
import { HttpService } from '../../services/http.service';
import { PublicService } from '../../services/public.service';
import { ToastrsService } from '../../services/toater.service';
import { DeleteComponent } from '../../shared/delete/delete.component';
import { ImportComponent } from '../../shared/import/import.component';
import { AddEditWarehouseComponent } from './add-edit/add-edit.component';

@Component({
  selector: 'app-warehouse',
  templateUrl: './warehouse.component.html',
  styleUrls: ['./warehouse.component.css'],
})
export class WarehouseComponent {
  devices: any = [];
  searchText: string = '';
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
    public authService: AuthService,
  ) {
    this.size = this.publicService.getNumOfRows(290, 70.57);
  }

  ngOnInit(): void {
    this.list(1);
  }

  list(p: number, withLoader: boolean = true): void {
    this.page = p;
    let params = new HttpParams()
      .set('q', this.searchText)
      .set('size', this.size)
      .set('page', this.page);

    this.httpService
      .list(
        this.api.warehouse.list,
        { params },
        withLoader ? 'warehouseList' : '',
      )
      .subscribe({
        next: (res: any) => {
          if (res.success) {
            this.devices = res.data.data;
            this.totalCount = res.data.total_count;
            this.totalRecords = res.data.total_records;
          } else {
            this.toastrsService.Showerror(res.message || res.msg);
          }
        },
      });
  }

  add() {
    const modalRef = this.modalService.open(AddEditWarehouseComponent, {
      size: 'lg',
      centered: true,
    });
    modalRef.result.then(
      () => this.list(1, false),
      () => {},
    );
  }

  edit(device: any) {
    const modalRef = this.modalService.open(AddEditWarehouseComponent, {
      size: 'lg',
      centered: true,
    });
    modalRef.componentInstance.device = device;
    modalRef.componentInstance.isFullEdit = true;
    modalRef.result.then(
      () => this.list(1, false),
      () => {},
    );
  }

  updateLineCode(device: any) {
    const modalRef = this.modalService.open(AddEditWarehouseComponent, {
      size: 'md',
      centered: true,
    });
    modalRef.componentInstance.device = device;
    modalRef.componentInstance.isFullEdit = false;
    modalRef.result.then(
      () => this.list(1, false),
      () => {},
    );
  }

  delete(device: any) {
    const modalRef = this.modalService.open(DeleteComponent, {});
    modalRef.componentInstance.id = device.id;
    modalRef.componentInstance.type = 'device';
    modalRef.componentInstance.message = `Do you want to delete device with serial number ${device.serial_number}?`;
    modalRef.result.then(
      () => this.list(1, false),
      () => {},
    );
  }

  importExcel() {
    const modalRef = this.modalService.open(ImportComponent, {
      size: 'md',
      centered: true,
    });
    modalRef.componentInstance.type = 'warehouse';
    modalRef.result.then(
      () => this.list(1, false),
      () => {},
    );
  }

  reset() {
    this.searchText = '';
    this.size = this.publicService.getNumOfRows(290, 70.57);
    this.list(1);
  }
}
