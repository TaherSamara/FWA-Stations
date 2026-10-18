import { Component, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import {
  DeviceType,
  PathEndpoint,
  PathEndpointSelection,
  PathLink,
} from 'src/app/modules/dash/models';
import { ApiService } from '../../../../services/api.service';
import { HttpService } from '../../../../services/http.service';
import { ToastrsService } from '../../../../services/toater.service';

interface OdfRow {
  key: number;
  selection: PathEndpointSelection;
}

@Component({
  selector: 'app-add-edit-path-link',
  templateUrl: './add-edit-path-link.component.html',
  styleUrls: ['./add-edit-path-link.component.css'],
})
export class AddEditPathLinkComponent implements OnInit {
  public fromSubDevice: any;
  public fromDeviceType: DeviceType | null = null;
  public pathLink: PathLink | null = null;

  readonly OdfType = DeviceType.TransmissionODF;

  from!: PathEndpointSelection;
  to!: PathEndpointSelection;
  odfs: OdfRow[] = [];
  submitted = false;
  private nextKey = 1;

  constructor(
    public activeModal: NgbActiveModal,
    public httpService: HttpService,
    private api: ApiService,
    private toastrsService: ToastrsService,
  ) {}

  ngOnInit(): void {
    if (this.pathLink) {
      this.from = this.fromEndpoint(this.pathLink.from);
      this.to = this.fromEndpoint(this.pathLink.to);
      this.pathLink.odfs.forEach((o) => this.addOdf(this.fromEndpoint(o.endpoint)));
    } else {
      this.from = {
        device_type: this.fromDeviceType ?? this.fromSubDevice?.device?.type ?? null,
        device_id: this.fromSubDevice?.device_id ?? this.fromSubDevice?.device?.id ?? null,
        slot: this.fromSubDevice?.slot ?? '',
        sub_device_id: this.fromSubDevice?.id ?? null,
      };
      this.to = this.emptySelection();
      this.addOdf();
    }
  }

  get fromSummary(): string {
    const s = this.pathLink?.from ?? this.fromSubDevice;
    if (!s) return '';
    const name = this.pathLink ? s.device_name : s.device?.name;
    return [name, s.slot, s.port].filter((x) => !!x).join(' · ');
  }

  addOdf(selection?: PathEndpointSelection): void {
    this.odfs.push({
      key: this.nextKey++,
      selection: selection ?? { ...this.emptySelection(), device_type: this.OdfType },
    });
  }

  removeOdf(index: number): void {
    this.odfs.splice(index, 1);
  }

  moveOdf(index: number, step: number): void {
    const target = index + step;
    if (target < 0 || target >= this.odfs.length) return;
    [this.odfs[index], this.odfs[target]] = [this.odfs[target], this.odfs[index]];
  }

  trackByKey(_: number, row: OdfRow): number {
    return row.key;
  }

  submit(): void {
    this.submitted = true;

    if (!this.from.sub_device_id || !this.to.sub_device_id) {
      this.toastrsService.Showerror('Please select both Connect From and Connect To ports');
      return;
    }

    if (this.odfs.some((o) => !o.selection.sub_device_id)) {
      this.toastrsService.Showerror('Please complete or remove the empty ODF rows');
      return;
    }

    const requestData = {
      from_sub_device_id: this.from.sub_device_id,
      to_sub_device_id: this.to.sub_device_id,
      odf_sub_device_ids: this.odfs.map((o) => o.selection.sub_device_id),
    };

    const url = this.pathLink
      ? this.api.pathLinks.edit(this.pathLink.id)
      : this.api.pathLinks.add;

    this.httpService.action(url, requestData, 'pathLinkAction').subscribe({
      next: (res: any) => {
        if (res.success) {
          this.toastrsService.Showsuccess(res.msg);
          this.activeModal.close(true);
        } else {
          this.toastrsService.Showerror(res.msg);
        }
      },
    });
  }

  private emptySelection(): PathEndpointSelection {
    return { device_type: null, device_id: null, slot: null, sub_device_id: null };
  }

  private fromEndpoint(e: PathEndpoint): PathEndpointSelection {
    return {
      device_type: e?.device_type ?? null,
      device_id: e?.device_id ?? null,
      slot: e?.slot ?? '',
      sub_device_id: e?.sub_device_id ?? null,
    };
  }
}
