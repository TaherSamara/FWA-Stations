import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { PermissionCode } from 'src/app/modules/dash/models';
import { printHtml } from '../../../services/print.util';

interface ViewField {
  label: string;
  key: string;
  type?: 'text' | 'link' | 'mono' | 'long';
  full?: boolean;
}

interface ViewSection {
  title: string;
  icon: string;
  inline?: boolean;
  fields: ViewField[];
}

@Component({
  selector: 'app-view-sub-device',
  templateUrl: './view.component.html',
  styleUrls: ['./view.component.css'],
})
export class ViewSubDeviceComponent {
  public subDevice: any;
  PermissionCode = PermissionCode;

  sections: ViewSection[] = [
    {
      title: 'Basic Information',
      icon: 'fe-info',
      fields: [
        { label: 'Station Name', key: 'station_name' },
        { label: 'Line Code', key: 'line_code', type: 'mono' },
        { label: 'Order Number', key: 'order_number', type: 'mono' },
      ],
    },
    {
      title: 'Unit Information',
      icon: 'fe-cpu',
      fields: [
        { label: 'Unit Type', key: 'unit_type' },
        { label: 'Unit Direction', key: 'unit_direction' },
        { label: 'Link MAC Address', key: 'link_mac_address', type: 'mono' },
      ],
    },
    {
      title: 'Connection',
      icon: 'fe-link',
      fields: [
        { label: 'Connection Type', key: 'connection_type' },
        { label: 'Speed', key: 'speed' },
      ],
    },
    {
      title: 'Network',
      icon: 'fe-globe',
      fields: [
        { label: 'Management IP', key: 'management_ip', type: 'link' },
        { label: 'Management VLAN', key: 'management_vlan', type: 'mono' },
        { label: 'WAN IP', key: 'wan_ip', type: 'mono' },
      ],
    },
    {
      title: 'MikroTik',
      icon: 'fe-server',
      fields: [
        { label: 'MikroTik ID', key: 'mikrotik_id', type: 'mono' },
        { label: 'MikroTik MAC Address', key: 'mikrotik_mac_address', type: 'mono' },
      ],
    },
    {
      title: 'SAS & ODF',
      icon: 'fe-database',
      fields: [
        { label: 'SAS Port', key: 'sas_port' },
        { label: 'ODF Name', key: 'odf_name' },
        { label: 'ODF Port', key: 'odf_port' },
      ],
    },
    {
      title: 'Customer & Contact',
      icon: 'fe-user',
      inline: true,
      fields: [
        { label: 'Contact Person', key: 'contact_person' },
        { label: 'Contact Phone', key: 'contact_person_phone_no', type: 'mono' },
        { label: 'Customer Address', key: 'customer_address' },
      ],
    },
    {
      title: 'Additional Details',
      icon: 'fe-file-text',
      fields: [
        { label: 'Other Details', key: 'other_details', type: 'long', full: true },
      ],
    },
  ];

  constructor(public activeModal: NgbActiveModal) {}

  /** Prints a clean A4 sheet of this sub device (rendered in a hidden iframe) */
  print(): void {
    const esc = (s: string) =>
      s.replace(/[&<>"']/g, (c) => `&#${c.charCodeAt(0)};`);

    const sections = this.sections
      .map((section) => {
        const items = section.fields
          .map(
            (f) => `
            <div class="item${f.full || section.inline ? ' wide' : ''}">
              <div class="label">${esc(f.label)}</div>
              <div class="value${f.type === 'mono' ? ' mono' : ''}${this.value(f.key) ? '' : ' empty'}">${
                this.value(f.key) ? esc(this.value(f.key)) : '—'
              }</div>
            </div>`,
          )
          .join('');
        return `<section class="${section.inline || section.fields.length === 1 ? 'full' : ''}">
          <h3>${esc(section.title)}</h3>
          <div class="grid">${items}</div>
        </section>`;
      })
      .join('');

    const html = `<!DOCTYPE html>
<html><head><meta charset="utf-8">
<title>${esc(this.subDevice?.name || 'Sub Device')}</title>
<style>
  @page { size: A4; margin: 14mm; }
  * { box-sizing: border-box; -webkit-print-color-adjust: exact; print-color-adjust: exact; }
  body { margin: 0; font-family: "Segoe UI", Arial, sans-serif; color: #2c3e50; font-size: 12px; }
  header { display: flex; align-items: center; justify-content: space-between; padding-bottom: 12px; border-bottom: 3px solid #76bc21; margin-bottom: 16px; }
  header .title h1 { margin: 0 0 4px; font-size: 22px; }
  header .title p { margin: 0; color: #6e7b8c; font-size: 12px; }
  header img { height: 44px; }
  .cols { columns: 2; column-gap: 14px; }
  section { break-inside: avoid; border: 1px solid #e3e6f0; border-radius: 8px; padding: 10px 12px; margin-bottom: 12px; }
  section.full { column-span: all; }
  h3 { margin: 0 0 8px; padding-bottom: 6px; border-bottom: 1px solid #eef0f4; font-size: 10px; letter-spacing: .05em; text-transform: uppercase; color: #76bc21; }
  .grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(150px, 1fr)); gap: 8px 14px; }
  .label { font-size: 10px; color: #8a94a6; margin-bottom: 1px; }
  .value { font-weight: 600; word-break: break-word; white-space: pre-wrap; }
  .value.mono { font-family: Consolas, monospace; }
  .value.empty { color: #c2c8d3; font-weight: 400; }
  footer { margin-top: 8px; padding-top: 8px; border-top: 1px solid #eef0f4; color: #8a94a6; font-size: 10px; display: flex; justify-content: space-between; }
</style></head>
<body>
  <header>
    <div class="title">
      <h1>${esc(this.subDevice?.name || '—')}</h1>
      <p>${esc(this.subDevice?.device?.name || '')}${
        this.subDevice?.station_name ? ' · ' + esc(this.subDevice.station_name) : ''
      }</p>
    </div>
    <img src="${location.origin}/assets/img/logo.svg" alt="FWA">
  </header>
  <div class="cols">${sections}</div>
  <footer><span>FWA System</span><span>Printed on ${esc(new Date().toLocaleString())}</span></footer>
</body></html>`;

    printHtml(html);
  }

  value(key: string): string {
    const v = this.subDevice?.[key];
    return v === null || v === undefined || v === '' ? '' : String(v);
  }
}
