import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { DeviceType } from 'src/app/modules/dash/models';
import { ApiService } from '../../../services/api.service';
import { HttpService } from '../../../services/http.service';
import { ToastrsService } from '../../../services/toater.service';

@Component({
  selector: 'app-add-edit-devices',
  templateUrl: './add-edit.component.html',
  styleUrls: ['./add-edit.component.css'],
})
export class AddEditDevicesComponent {
  public device: any;
  public deviceType: DeviceType;
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
        type: this.device ? this.device.type : this.deviceType,
      };

      let url = this.device
        ? this.api.devices.edit(this.device.id)
        : this.api.devices.add;
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
      Name: new FormControl(
        this.device ? this.device.name : '',
        Validators.required,
      ),
    });
  }
}
