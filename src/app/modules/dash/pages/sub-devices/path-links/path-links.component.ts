import { HttpParams } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import {
  DeviceType,
  getDeviceTypeTab,
  PathEndpoint,
  PathLink,
  PermissionCode,
} from 'src/app/modules/dash/models';
import { ApiService } from '../../../services/api.service';
import { HttpService } from '../../../services/http.service';
import { escapeHtml, printHtml } from '../../../services/print.util';
import { ToastrsService } from '../../../services/toater.service';
import { DeleteComponent } from '../../../shared/delete/delete.component';
import { AddEditPathLinkComponent } from './add-edit-path-link/add-edit-path-link.component';

@Component({
  selector: 'app-path-links',
  templateUrl: './path-links.component.html',
  styleUrls: ['./path-links.component.css'],
})
export class PathLinksComponent implements OnInit {
  public subDevice: any;
  public deviceType: DeviceType | null = null;

  paths: PathLink[] = [];
  loaded = false;
  PermissionCode = PermissionCode;

  constructor(
    public activeModal: NgbActiveModal,
    public httpService: HttpService,
    private api: ApiService,
    private modalService: NgbModal,
    private toastrsService: ToastrsService,
  ) {}

  ngOnInit(): void {
    this.load();
  }

  load(): void {
    const params = new HttpParams().set('sub_device_id', this.subDevice.id);
    this.httpService.list(this.api.pathLinks.list, { params }, 'pathLinksList').subscribe({
      next: (res: any) => {
        this.loaded = true;
        if (res.success) {
          this.paths = res.data || [];
        } else {
          this.toastrsService.Showerror(res.msg);
        }
      },
    });
  }

  isCurrent(endpoint: PathEndpoint): boolean {
    return endpoint?.sub_device_id === this.subDevice?.id;
  }

  typeLabel(endpoint: PathEndpoint): string {
    return endpoint?.device_type ? getDeviceTypeTab(endpoint.device_type)?.label || '' : '';
  }

  add(): void {
    const modalRef = this.modalService.open(AddEditPathLinkComponent, {
      size: 'xl',
      centered: true,
    });
    modalRef.componentInstance.fromSubDevice = this.subDevice;
    modalRef.componentInstance.fromDeviceType = this.deviceType;
    modalRef.result.then(
      () => this.load(),
      () => {},
    );
  }

  edit(path: PathLink): void {
    const modalRef = this.modalService.open(AddEditPathLinkComponent, {
      size: 'xl',
      centered: true,
    });
    modalRef.componentInstance.pathLink = path;
    modalRef.result.then(
      () => this.load(),
      () => {},
    );
  }

  delete(path: PathLink): void {
    const modalRef = this.modalService.open(DeleteComponent, {});
    modalRef.componentInstance.id = path.id;
    modalRef.componentInstance.type = 'pathLink';
    modalRef.componentInstance.message = `Do you want to delete this path (${path.from?.device_name} → ${path.to?.device_name})?`;
    modalRef.result.then(
      () => this.load(),
      () => {},
    );
  }

  print(path: PathLink): void {
    const cell = (v: any) => (v === null || v === undefined || v === '' ? '—' : escapeHtml(v));
    const endpointTable = (title: string, cls: string, e: PathEndpoint) => `
      <table class="ep ${cls}">
        <thead><tr><th>${title}</th><th>Slot</th><th>Port</th></tr></thead>
        <tbody><tr><td>${cell(e?.device_name)}</td><td>${cell(e?.slot)}</td><td>${cell(e?.port)}</td></tr></tbody>
      </table>`;
    const odfRows = path.odfs
      .map(
        (o) =>
          `<tr><td>${o.order}</td><td>${cell(o.endpoint?.device_name)}</td><td>${cell(o.endpoint?.slot)}</td><td>${cell(o.endpoint?.port)}</td></tr>`,
      )
      .join('');

    const html = `<!DOCTYPE html>
<html><head><meta charset="utf-8">
<title>Path Links</title>
<style>
  @page { size: A4 landscape; margin: 12mm; }
  * { box-sizing: border-box; -webkit-print-color-adjust: exact; print-color-adjust: exact; }
  body { margin: 0; font-family: "Segoe UI", Arial, sans-serif; color: #2c3e50; font-size: 12px; }
  header { display: flex; align-items: center; justify-content: space-between; padding-bottom: 10px; border-bottom: 3px solid #76bc21; margin-bottom: 18px; }
  header h1 { margin: 0; font-size: 22px; }
  header img { height: 44px; }
  .layout { display: grid; grid-template-columns: 1fr 1.6fr 1fr; gap: 16px; align-items: start; }
  table { width: 100%; border-collapse: collapse; }
  th { padding: 7px 8px; text-align: left; color: #fff; font-size: 11px; }
  td { padding: 7px 8px; border-bottom: 1px solid #e3e6f0; }
  .from th { background: #e8a23a; }
  .odf th { background: #26397a; }
  .to th { background: #2e9e4f; }
  .odf td:first-child { width: 40px; text-align: center; color: #8a94a6; }
  footer { margin-top: 14px; color: #8a94a6; font-size: 10px; display: flex; justify-content: space-between; }
</style></head>
<body>
  <header><h1>Path Links</h1><img src="${location.origin}/assets/img/logo.svg" alt="FWA"></header>
  <div class="layout">
    ${endpointTable('Connected From', 'from', path.from)}
    <table class="odf">
      <thead><tr><th>Order</th><th>ODF Name</th><th>ODF Slot</th><th>ODF Port</th></tr></thead>
      <tbody>${odfRows || '<tr><td colspan="4">—</td></tr>'}</tbody>
    </table>
    ${endpointTable('Connected To', 'to', path.to)}
  </div>
  <footer><span>FWA System</span><span>Printed on ${escapeHtml(new Date().toLocaleString())}</span></footer>
</body></html>`;

    printHtml(html);
  }
}
