import { Component, Input, OnInit } from '@angular/core';
import {
  DEVICE_TYPE_TABS,
  DeviceType,
  LookupDevice,
  LookupPort,
  PathEndpointSelection,
} from 'src/app/modules/dash/models';
import { PathLinkLookupService } from '../../../../services/path-link-lookup.service';

@Component({
  selector: 'app-endpoint-picker',
  templateUrl: './endpoint-picker.component.html',
  styleUrls: ['./endpoint-picker.component.css'],
})
export class EndpointPickerComponent implements OnInit {
  @Input() selection!: PathEndpointSelection;
  @Input() fixedType: DeviceType | null = null;
  @Input() disabled = false;
  @Input() compact = false;
  @Input() invalid = false;
  @Input() deviceLabel = 'Device';

  deviceTypes = DEVICE_TYPE_TABS;
  devices: LookupDevice[] = [];
  slots: string[] = [];
  ports: LookupPort[] = [];
  hasEmptySlot = false;
  emptyPortId: number | null = null;
  loading = { devices: false, slots: false, ports: false };

  constructor(private lookup: PathLinkLookupService) {}

  ngOnInit(): void {
    if (this.fixedType) {
      this.selection.device_type = this.fixedType;
    }
    if (this.selection.device_type) {
      this.loadDevices(true);
    }
  }

  onTypeChange(): void {
    this.selection.device_id = null;
    this.resetSlot();
    this.devices = [];
    if (this.selection.device_type) {
      this.loadDevices(false);
    }
  }

  onDeviceChange(): void {
    this.resetSlot();
    if (this.selection.device_id) {
      this.loadSlots(false);
    }
  }

  onSlotChange(): void {
    this.selection.sub_device_id = null;
    this.ports = [];
    this.emptyPortId = null;
    if (this.selection.slot !== null) {
      this.loadPorts();
    }
  }

  private resetSlot(): void {
    this.selection.slot = null;
    this.selection.sub_device_id = null;
    this.slots = [];
    this.ports = [];
    this.hasEmptySlot = false;
    this.emptyPortId = null;
  }

  private loadDevices(restore: boolean): void {
    this.loading.devices = true;
    this.lookup.devices(this.selection.device_type!).subscribe((devices) => {
      this.devices = devices;
      this.loading.devices = false;
      if (restore && this.selection.device_id) {
        this.loadSlots(true);
      }
    });
  }

  private loadSlots(restore: boolean): void {
    this.loading.slots = true;
    this.lookup.slots(this.selection.device_id!).subscribe((slots) => {
      this.hasEmptySlot = slots.includes('');
      this.slots = slots.filter((s) => s !== '');
      this.loading.slots = false;
      if (restore && this.selection.slot !== null) {
        this.loadPorts();
      } else if (!restore && (this.hasEmptySlot || this.slots.length === 1)) {
        this.selection.slot = this.hasEmptySlot ? '' : this.slots[0];
        this.loadPorts();
      }
    });
  }

  private loadPorts(): void {
    this.loading.ports = true;
    this.lookup
      .ports(this.selection.device_id!, this.selection.slot ?? '')
      .subscribe((ports) => {
        this.emptyPortId = ports.find((p) => !p.port)?.id ?? null;
        this.ports = ports.filter((p) => !!p.port);
        this.loading.ports = false;
        if (!this.selection.sub_device_id && this.emptyPortId) {
          this.selection.sub_device_id = this.emptyPortId;
        }
      });
  }
}
