import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ApiService } from '../../../services/api.service';
import { HttpService } from '../../../services/http.service';
import { ToastrsService } from '../../../services/toater.service';

@Component({
  selector: 'app-add-edit-subscribers',
  templateUrl: './add-edit.component.html',
  styleUrls: ['./add-edit.component.css'],
})
export class AddEditSubscribersComponent {
  public subscriber: any;
  public stations: any[] = [];
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
        service_type: this.f.ServiceType.value,
        notes: this.f.Notes.value,
        station_id: this.f.StationId.value,
      };

      let url = this.subscriber
        ? this.api.subscribers.edit(this.subscriber.id)
        : this.api.subscribers.add;
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
      Name: new FormControl(this.subscriber?.name || '', Validators.required),
      LineCode: new FormControl(this.subscriber?.line_code || ''),
      UnitType: new FormControl(this.subscriber?.unit_type || ''),
      LinkMacAddress: new FormControl(this.subscriber?.link_mac_address || ''),
      UnitDirection: new FormControl(this.subscriber?.unit_direction || ''),
      ManagementIp: new FormControl(this.subscriber?.management_ip || ''),
      MikrotikId: new FormControl(this.subscriber?.mikrotik_id || ''),
      MikrotikMacAddress: new FormControl(
        this.subscriber?.mikrotik_mac_address || '',
      ),
      SasName: new FormControl(this.subscriber?.sas_name || ''),
      SasPort: new FormControl(this.subscriber?.sas_port || ''),
      OdfName: new FormControl(this.subscriber?.odf_name || ''),
      OdfPort: new FormControl(this.subscriber?.odf_port || ''),
      ManagementVlan: new FormControl(this.subscriber?.management_vlan || ''),
      ServiceType: new FormControl(
        this.subscriber?.service_type || 0,
        Validators.required,
      ),
      Notes: new FormControl(this.subscriber?.notes || ''),
      StationId: new FormControl(
        this.subscriber?.station_id || '',
        Validators.required,
      ),
    });
  }
}
