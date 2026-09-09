import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ApiService } from '../../../services/api.service';
import { HttpService } from '../../../services/http.service';
import { ToastrsService } from '../../../services/toater.service';

@Component({
  selector: 'app-add-edit-sub-devices',
  templateUrl: './add-edit.component.html',
  styleUrls: ['./add-edit.component.css'],
})
export class AddEditSubDevicesComponent {
  public subDevice: any;
  public devices: any[] = [];
  public deviceId: number;
  form: FormGroup;
  submitted: boolean = false;

  constructor(
    public activeModal: NgbActiveModal,
    public httpService: HttpService,
    private api: ApiService,
    private toastrsService: ToastrsService,
  ) {}

  ngOnInit() {
    this.initForm();
  }

  get f() {
    return this.form.controls;
  }

  submit() {
    this.submitted = true;
    if (this.form.valid) {
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
        device_id: +this.f.DeviceId.value,
      };

      let url = this.subDevice
        ? this.api.subDevices.edit(this.subDevice.id)
        : this.api.subDevices.add;
      this.httpService.action(url, requestData, 'addEditAction').subscribe({
        next: (res: any) => {
          if (res.success) {
            this.activeModal.close();
            this.toastrsService.Showsuccess(res.msg);
          } else {
            this.toastrsService.Showerror(res.msg);
          }
        },
      });
    }
  }

  initForm() {
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
      DeviceId: new FormControl(
        this.subDevice?.device_id || this.deviceId || '',
        Validators.required,
      ),
    });
  }
}
