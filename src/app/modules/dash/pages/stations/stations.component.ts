import { HttpParams } from '@angular/common/http';
import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { AuthService } from 'src/app/modules/auth/services/auth.service';
import { PermissionCode } from 'src/app/modules/dash/models';
import { ApiService } from '../../services/api.service';
import { HttpService } from '../../services/http.service';
import { PublicService } from '../../services/public.service';
import { ToastrsService } from '../../services/toater.service';
import { DeleteComponent } from '../../shared/delete/delete.component';
import { ImportComponent } from '../../shared/import/import.component';
import { AddEditStationsComponent } from './add-edit/add-edit.component';

@Component({
  selector: 'app-stations',
  templateUrl: './stations.component.html',
  styleUrls: ['./stations.component.css'],
})
export class StationsComponent {
  stations: any = [];
  searchText: string = '';
  page: number = 1;
  size: number = 54;
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
    private router: Router,
    public authService: AuthService,
  ) {}

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
        this.api.stations.list,
        { params },
        withLoader ? 'stationsList' : '',
      )
      .subscribe({
        next: (res: any) => {
          if (res.success) {
            this.stations = res.data.data;
            this.totalCount = res.data.total_count;
            this.totalRecords = res.data.total_records;
          } else {
            this.toastrsService.Showerror(res.msg);
          }
        },
      });
  }

  add() {
    const modalRef = this.modalService.open(AddEditStationsComponent, {
      size: 'md',
      centered: true,
    });
    modalRef.result.then(() => this.list(1, false));
  }

  edit(station: any) {
    const modalRef = this.modalService.open(AddEditStationsComponent, {
      size: 'md',
      centered: true,
    });
    modalRef.componentInstance.station = station;
    modalRef.result.then(() => this.list(1, false));
  }

  delete(station: any) {
    const modalRef = this.modalService.open(DeleteComponent, {});
    modalRef.componentInstance.id = station.id;
    modalRef.componentInstance.type = 'station';
    modalRef.componentInstance.message = `Do you want to delete ${station.name}?`;
    modalRef.result.then(() => this.list(1, false));
  }

  viewSubscribers(station: any) {
    this.router.navigate(['/subscribers'], {
      queryParams: { stationId: station.id },
    });
  }

  importExcel() {
    const modalRef = this.modalService.open(ImportComponent, {
      size: 'md',
      centered: true,
    });
    modalRef.result.then(() => this.list(1, false));
  }
}
