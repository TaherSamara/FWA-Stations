import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ApiService } from '../../services/api.service';
import { ExcelService } from '../../services/excel.service';
import { HttpService } from '../../services/http.service';
import { ToastrsService } from '../../services/toater.service';

const SUB_DEVICE_TEMPLATE_COLUMNS = [
  'device_name',
  'name',
  'station_name',
  'line_code',
  'order_number',
  'unit_type',
  'unit_direction',
  'link_mac_address',
  'connection_type',
  'speed',
  'management_ip',
  'management_vlan',
  'wan_ip',
  'mikrotik_id',
  'mikrotik_mac_address',
  'sas_port',
  'odf_name',
  'odf_port',
  'customer_address',
  'contact_person',
  'contact_person_phone_no',
  'other_details',
  'notes',
];

@Component({
  selector: 'app-import',
  templateUrl: './import.component.html',
  styleUrls: ['./import.component.css'],
})
export class ImportComponent {
  selectedFile: File | null = null;
  submitted: boolean = false;
  public type: string = 'warehouse'; // 'warehouse' | 'subDevices'
  public deviceType: number | null = null; // auto-detected from the current devices route
  public templateUrl: string | null = null;

  constructor(
    public activeModal: NgbActiveModal,
    public httpService: HttpService,
    private api: ApiService,
    private excelService: ExcelService,
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

  downloadTemplate(): void {
    if (this.type === 'subDevices') {
      this.excelService.exportToExcel(
        [SUB_DEVICE_TEMPLATE_COLUMNS.reduce((row: any, col) => {
          row[col] = '';
          return row;
        }, {})],
        'sub-devices-import-template',
      );
    }
  }

  submit() {
    this.submitted = true;
    if (this.type === 'subDevices' && !this.deviceType) {
      return;
    }
    if (this.selectedFile) {
      const formData = new FormData();
      formData.append('file', this.selectedFile);

      const url =
        this.type === 'subDevices'
          ? this.api.devices.import(this.deviceType!)
          : this.api.warehouse.import;

      this.httpService.action(url, formData, 'importAction').subscribe({
        next: (res: any) => {
          if (res.success) {
            this.activeModal.close();
            if (this.type === 'subDevices' && res.data) {
              const { created_devices_count, inserted_count, updated_count } =
                res.data;
              this.toastrsService.Showsuccess(
                `${created_devices_count ?? 0} devices created, ${inserted_count ?? 0} sub devices added, ${updated_count ?? 0} updated.`,
              );
            } else {
              this.toastrsService.Showsuccess(res.msg || res.msg);
            }
          } else {
            this.toastrsService.Showerror(res.msg || res.msg);
          }
        },
      });
    }
  }
}
