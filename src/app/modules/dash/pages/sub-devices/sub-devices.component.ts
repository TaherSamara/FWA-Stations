import { HttpParams } from '@angular/common/http';
import { Component, HostListener } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { AuthService } from 'src/app/modules/auth/services/auth.service';
import { DeviceType, getDeviceTypeTab, PermissionCode } from 'src/app/modules/dash/models';
import { ApiService } from '../../services/api.service';
import { HttpService } from '../../services/http.service';
import { PublicService } from '../../services/public.service';
import { escapeHtml, printHtml } from '../../services/print.util';
import { ToastrsService } from '../../services/toater.service';
import { DeleteComponent } from '../../shared/delete/delete.component';
import { PingComponent } from '../../shared/ping/ping.component';
import { AddEditSubDevicesComponent } from './add-edit/add-edit.component';
import { ViewSubDeviceComponent } from './view/view.component';

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
  selectedDevice: any = null;
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
    private router: Router,
    public authService: AuthService,
  ) {
    this.size = this.publicService.getNumOfRows(290, 70.57);
  }

  ngOnInit(): void {
    this.selectedDeviceType = this.route.snapshot.data['deviceType'];

    this.loadDevices();

    // Check if deviceId is passed from route
    this.route.queryParams.subscribe((params) => {
      if (params['deviceId']) {
        this.selectedDeviceId = +params['deviceId'];
        this.selectedDevice = {
          id: this.selectedDeviceId,
          name: params['deviceName'] || '',
        };
      }
      this.list(1);
    });
  }

  loadDevices(): void {
    let params = new HttpParams().set('page', 1).set('size', 1000);
    if (this.selectedDeviceType) {
      params = params.set('type', this.selectedDeviceType);
    }
    this.httpService
      .list(this.api.devices.list, { params }, 'devicesDropdown')
      .subscribe({
        next: (res: any) => {
          if (res.success) {
            this.devices = res.data.data;
            const found = this.devices.find(
              (d: any) => d.id === this.selectedDeviceId,
            );
            if (found) this.selectedDevice = found;
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

            // Fallback: take the device name from the sub devices themselves
            const deviceName = this.subDevices[0]?.device?.name;
            if (this.selectedDeviceId > 0 && !this.selectedDevice?.name && deviceName) {
              this.selectedDevice = { id: this.selectedDeviceId, name: deviceName };
            }
          } else {
            this.toastrsService.Showerror(res.msg);
          }
        },
      });
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

  view(subDevice: any) {
    const modalRef = this.modalService.open(ViewSubDeviceComponent, {
      size: 'xl',
      centered: true,
      scrollable: true,
    });
    modalRef.componentInstance.subDevice = subDevice;
    modalRef.result.then(
      (action) => {
        if (action === 'edit') this.edit(subDevice);
      },
      () => {},
    );
  }

  /** Prints the device name followed by ALL of its sub devices (not just the current page) */
  printAll(): void {
    const params = new HttpParams()
      .set('q', '')
      .set('size', 100000)
      .set('page', 1)
      .set('device_id', this.selectedDeviceId);

    this.httpService
      .list(this.api.subDevices.list, { params }, 'printAction')
      .subscribe({
        next: (res: any) => {
          if (!res.success) {
            this.toastrsService.Showerror(res.msg);
            return;
          }
          const rows: any[] = res.data.data || [];
          if (rows.length === 0) {
            this.toastrsService.Showerror('No sub devices to print');
            return;
          }
          this.printSubDevices(rows);
        },
      });
  }

  private printSubDevices(rows: any[]): void {
    const columns: { label: string; get: (s: any) => any; mono?: boolean }[] = [
      { label: 'Name', get: (s) => s.name },
      { label: 'Station', get: (s) => s.station_name },
      { label: 'Line Code', get: (s) => s.line_code, mono: true },
      { label: 'Order No.', get: (s) => s.order_number, mono: true },
      { label: 'Unit Type', get: (s) => s.unit_type },
      { label: 'Connection', get: (s) => s.connection_type },
      { label: 'Speed', get: (s) => s.speed },
      { label: 'MGMT IP', get: (s) => s.management_ip, mono: true },
      { label: 'WAN IP', get: (s) => s.wan_ip, mono: true },
      { label: 'Contact Person', get: (s) => s.contact_person },
      { label: 'Phone', get: (s) => s.contact_person_phone_no, mono: true },
    ];

    const deviceName =
      this.selectedDevice?.name || rows[0]?.device?.name || 'Device';
    const typeLabel = getDeviceTypeTab(this.selectedDeviceType)?.label || '';

    const head = columns
      .map((c) => `<th>${escapeHtml(c.label)}</th>`)
      .join('');
    const body = rows
      .map((s, i) => {
        const cells = columns
          .map((c) => {
            const v = c.get(s);
            const empty = v === null || v === undefined || v === '';
            return `<td class="${c.mono ? 'mono' : ''}${empty ? ' empty' : ''}">${
              empty ? '—' : escapeHtml(v)
            }</td>`;
          })
          .join('');
        return `<tr><td class="num">${i + 1}</td>${cells}</tr>`;
      })
      .join('');

    const html = `<!DOCTYPE html>
<html><head><meta charset="utf-8">
<title>${escapeHtml(deviceName)}</title>
<style>
  @page { size: A4 landscape; margin: 12mm; }
  * { box-sizing: border-box; -webkit-print-color-adjust: exact; print-color-adjust: exact; }
  body { margin: 0; font-family: "Segoe UI", Arial, sans-serif; color: #2c3e50; font-size: 11px; }
  header { display: flex; align-items: center; justify-content: space-between; padding-bottom: 10px; border-bottom: 3px solid #76bc21; margin-bottom: 14px; }
  header h1 { margin: 0 0 4px; font-size: 22px; }
  header p { margin: 0; color: #6e7b8c; font-size: 12px; }
  header p b { color: #4f7a15; }
  header img { height: 44px; }
  table { width: 100%; border-collapse: collapse; }
  thead { display: table-header-group; }
  th { padding: 6px 7px; text-align: left; font-size: 9.5px; letter-spacing: .04em; text-transform: uppercase; color: #fff; background: #76bc21; }
  td { padding: 5px 7px; border-bottom: 1px solid #eef0f4; vertical-align: top; word-break: break-word; }
  tr { break-inside: avoid; }
  tbody tr:nth-child(even) td { background: #f8faf6; }
  td.num { width: 24px; color: #8a94a6; }
  td.mono { font-family: Consolas, monospace; }
  td.empty { color: #c2c8d3; }
  footer { margin-top: 10px; color: #8a94a6; font-size: 10px; display: flex; justify-content: space-between; }
</style></head>
<body>
  <header>
    <div>
      <h1>${escapeHtml(deviceName)}</h1>
      <p>${typeLabel ? escapeHtml(typeLabel) + ' · ' : ''}<b>${rows.length}</b> sub device${rows.length === 1 ? '' : 's'}</p>
    </div>
    <img src="${location.origin}/assets/img/logo.svg" alt="FWA">
  </header>
  <table>
    <thead><tr><th>#</th>${head}</tr></thead>
    <tbody>${body}</tbody>
  </table>
  <footer><span>FWA System</span><span>Printed on ${escapeHtml(new Date().toLocaleString())}</span></footer>
</body></html>`;

    printHtml(html);
  }

  goBack(): void {
    const slug = getDeviceTypeTab(this.selectedDeviceType)?.slug || '';
    this.router.navigate(['/devices', slug]);
  }

  edit(subDevice: any) {
    const modalRef = this.modalService.open(AddEditSubDevicesComponent, {
      size: 'xl',
      centered: true,
    });
    modalRef.componentInstance.subDevice = subDevice;
    modalRef.componentInstance.devices = this.devices;
    modalRef.componentInstance.deviceId = this.selectedDeviceId;
    modalRef.result.then(
      () => this.list(1, false),
      () => {},
    );
  }

  delete(subDevice: any) {
    const modalRef = this.modalService.open(DeleteComponent, {});
    modalRef.componentInstance.id = subDevice.id;
    modalRef.componentInstance.type = 'subDevice';
    modalRef.componentInstance.message = `Do you want to delete ${subDevice.name}?`;
    modalRef.result.then(() => this.list(1, false));
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
