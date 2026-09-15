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
        station_name: this.f.StationName.value,
        line_code: this.f.LineCode.value,
        order_number: this.f.OrderNumber.value,
        unit_type: this.f.UnitType.value,
        unit_direction: this.f.UnitDirection.value,
        link_mac_address: this.f.LinkMacAddress.value,
        connection_type: this.f.ConnectionType.value,
        service_type: +this.f.ServiceType.value,
        speed: this.f.Speed.value,
        management_ip: this.f.ManagementIp.value,
        management_vlan: this.f.ManagementVlan.value,
        wan_ip: this.f.WanIp.value,
        mikrotik_id: this.f.MikrotikId.value,
        mikrotik_mac_address: this.f.MikrotikMacAddress.value,
        sas_name: this.f.SasName.value,
        sas_port: this.f.SasPort.value,
        odf_name: this.f.OdfName.value,
        odf_port: this.f.OdfPort.value,
        customer_address: this.f.CustomerAddress.value,
        contact_person: this.f.ContactPerson.value,
        contact_person_phone_no: this.f.ContactPersonPhoneNo.value,
        other_details: this.f.OtherDetails.value,
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
      StationName: new FormControl(this.subDevice?.station_name || ''),
      LineCode: new FormControl(this.subDevice?.line_code || ''),
      OrderNumber: new FormControl(this.subDevice?.order_number || ''),
      UnitType: new FormControl(this.subDevice?.unit_type || ''),
      UnitDirection: new FormControl(this.subDevice?.unit_direction || ''),
      LinkMacAddress: new FormControl(this.subDevice?.link_mac_address || ''),
      ConnectionType: new FormControl(this.subDevice?.connection_type || ''),
      ServiceType: new FormControl(this.subDevice?.service_type ?? 0),
      Speed: new FormControl(this.subDevice?.speed || ''),
      ManagementIp: new FormControl(this.subDevice?.management_ip || ''),
      ManagementVlan: new FormControl(this.subDevice?.management_vlan || ''),
      WanIp: new FormControl(this.subDevice?.wan_ip || ''),
      MikrotikId: new FormControl(this.subDevice?.mikrotik_id || ''),
      MikrotikMacAddress: new FormControl(
        this.subDevice?.mikrotik_mac_address || '',
      ),
      SasName: new FormControl(this.subDevice?.sas_name || ''),
      SasPort: new FormControl(this.subDevice?.sas_port || ''),
      OdfName: new FormControl(this.subDevice?.odf_name || ''),
      OdfPort: new FormControl(this.subDevice?.odf_port || ''),
      CustomerAddress: new FormControl(this.subDevice?.customer_address || ''),
      ContactPerson: new FormControl(this.subDevice?.contact_person || ''),
      ContactPersonPhoneNo: new FormControl(
        this.subDevice?.contact_person_phone_no || '',
      ),
      OtherDetails: new FormControl(this.subDevice?.other_details || ''),
      DeviceId: new FormControl(
        this.subDevice?.device_id || this.deviceId || '',
        Validators.required,
      ),
    });
  }
}
