import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { AuthService } from 'src/app/modules/auth/services/auth.service';
import { getDeviceTypeTab, PermissionCode } from 'src/app/modules/dash/models';
import { ApiService } from '../../../services/api.service';
import { HttpService } from '../../../services/http.service';
import { ToastrsService } from '../../../services/toater.service';
import { PingComponent } from '../../../shared/ping/ping.component';

@Component({
  selector: 'app-sub-device-details',
  templateUrl: './details.component.html',
  styleUrls: ['./details.component.css'],
})
export class SubDeviceDetailsComponent implements OnInit {
  subDevice: any;
  id: number;
  form: FormGroup;
  submitted: boolean = false;

  PermissionCode = PermissionCode;

  constructor(
    public httpService: HttpService,
    private api: ApiService,
    private route: ActivatedRoute,
    private router: Router,
    private toastrsService: ToastrsService,
    private modalService: NgbModal,
    public authService: AuthService,
  ) {}

  ngOnInit(): void {
    this.id = +(this.route.snapshot.paramMap.get('id') ?? 0);
    this.load();
  }

  get f() {
    return this.form.controls;
  }

  load(): void {
    this.httpService
      .list(this.api.subDevices.details(this.id), {}, 'subDeviceDetails')
      .subscribe({
        next: (res: any) => {
          if (res.success) {
            this.subDevice = res.data;
            this.initForm();
          } else {
            this.toastrsService.Showerror(res.msg);
          }
        },
      });
  }

  initForm(): void {
    this.form = new FormGroup({
      Name: new FormControl(this.subDevice?.name || '', Validators.required),
      LineCode: new FormControl(this.subDevice?.line_code || ''),
      UnitType: new FormControl(this.subDevice?.unit_type || ''),
      LinkMacAddress: new FormControl(this.subDevice?.link_mac_address || ''),
      UnitDirection: new FormControl(this.subDevice?.unit_direction || ''),
      ManagementIp: new FormControl(this.subDevice?.management_ip || ''),
      MikrotikId: new FormControl(this.subDevice?.mikrotik_id || ''),
      MikrotikMacAddress: new FormControl(
        this.subDevice?.mikrotik_mac_address || '',
      ),
      SasName: new FormControl(this.subDevice?.sas_name || ''),
      SasPort: new FormControl(this.subDevice?.sas_port || ''),
      OdfName: new FormControl(this.subDevice?.odf_name || ''),
      OdfPort: new FormControl(this.subDevice?.odf_port || ''),
      ManagementVlan: new FormControl(this.subDevice?.management_vlan || ''),
      ServiceType: new FormControl(
        this.subDevice?.service_type || '',
        Validators.required,
      ),
      Notes: new FormControl(this.subDevice?.notes || ''),
    });
  }

  save(): void {
    this.submitted = true;
    if (this.form.invalid) {
      return;
    }

    const requestData: any = {
      name: this.f.Name.value,
      line_code: this.f.LineCode.value,
      unit_type: this.f.UnitType.value,
      link_mac_address: this.f.LinkMacAddress.value,
      unit_direction: this.f.UnitDirection.value,
      management_ip: this.f.ManagementIp.value,
      mikrotik_id: this.f.MikrotikId.value,
      mikrotik_mac_address: this.f.MikrotikMacAddress.value,
      sas_name: this.f.SasName.value,
      sas_port: this.f.SasPort.value,
      odf_name: this.f.OdfName.value,
      odf_port: this.f.OdfPort.value,
      management_vlan: this.f.ManagementVlan.value,
      service_type: +this.f.ServiceType.value,
      notes: this.f.Notes.value,
      device_id: this.subDevice.device_id,
    };

    this.httpService
      .action(this.api.subDevices.edit(this.id), requestData, 'saveAction')
      .subscribe({
        next: (res: any) => {
          if (res.success) {
            this.toastrsService.Showsuccess(res.msg);
            this.submitted = false;
            this.load();
          } else {
            this.toastrsService.Showerror(res.msg);
          }
        },
      });
  }

  getDeviceTypeLabel(type: number): string {
    return getDeviceTypeTab(type)?.label || 'Device';
  }

  getDeviceTypeIcon(type: number): string {
    return getDeviceTypeTab(type)?.icon || 'fe-server';
  }

  pingIP(): void {
    const ip = this.f.ManagementIp.value;
    if (!ip) {
      this.toastrsService.Showerror('No IP address available');
      return;
    }
    const modalRef = this.modalService.open(PingComponent, {
      size: 'lg',
      centered: true,
    });
    modalRef.componentInstance.ip = ip;
  }

  back(): void {
    this.router.navigate(['/sub-devices']);
  }
}
