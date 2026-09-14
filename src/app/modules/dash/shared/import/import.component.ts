import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ApiService } from '../../services/api.service';
import { HttpService } from '../../services/http.service';
import { ToastrsService } from '../../services/toater.service';

@Component({
  selector: 'app-import',
  templateUrl: './import.component.html',
  styleUrls: ['./import.component.css'],
})
export class ImportComponent {
  selectedFile: File | null = null;
  submitted: boolean = false;
  public type: string = 'warehouse'; // 'warehouse' | 'subDevices'
  public deviceId: number;
  public templateUrl: string | null = null;

  constructor(
    public activeModal: NgbActiveModal,
    public httpService: HttpService,
    private api: ApiService,
    private toastrsService: ToastrsService,
  ) {}

  get title(): string {
    return this.type === 'subDevices'
      ? 'Import Sub Devices from Excel'
      : 'Import Warehouse Devices from Excel';
  }

  onFileSelected(event: any) {
    const file = event.target.files[0];
    if (file) {
      this.selectedFile = file;
    }
  }

  submit() {
    this.submitted = true;
    if (this.selectedFile) {
      const formData = new FormData();
      formData.append('file', this.selectedFile);

      const url =
        this.type === 'subDevices'
          ? this.api.subDevices.import(this.deviceId)
          : this.api.warehouse.import;

      this.httpService.action(url, formData, 'importAction').subscribe({
        next: (res: any) => {
          if (res.success) {
            this.activeModal.close();
            this.toastrsService.Showsuccess(res.msg || res.msg);
          } else {
            this.toastrsService.Showerror(res.msg || res.msg);
          }
        },
      });
    }
  }
}
