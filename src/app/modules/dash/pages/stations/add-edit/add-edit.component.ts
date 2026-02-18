import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ApiService } from '../../../services/api.service';
import { HttpService } from '../../../services/http.service';
import { ToastrsService } from '../../../services/toater.service';

@Component({
  selector: 'app-add-edit-stations',
  templateUrl: './add-edit.component.html',
  styleUrls: ['./add-edit.component.css'],
})
export class AddEditStationsComponent {
  public station: any;
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
      };

      let url = this.station
        ? this.api.stations.edit(this.station.id)
        : this.api.stations.add;
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
        this.station ? this.station.name : '',
        Validators.required,
      ),
    });
  }
}
