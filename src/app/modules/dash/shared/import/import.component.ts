import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ApiService } from '../../services/api.service';
import { HttpService } from '../../services/http.service';
import { ToastrsService } from '../../services/toater.service';

@Component({
  selector: 'app-import-subscribers',
  templateUrl: './import.component.html',
  styleUrls: ['./import.component.css'],
})
export class ImportComponent {
  selectedFile: File | null = null;
  submitted: boolean = false;
  public type: string = 'subscribers'; // 'subscribers' or 'warehouse'

  constructor(
    public activeModal: NgbActiveModal,
    public httpService: HttpService,
    private api: ApiService,
    private toastrsService: ToastrsService,
  ) {}

  onFileSelected(event: any) {
    const file = event.target.files[0];
    if (file) {
      this.selectedFile = file;
    }
  }

  submit() {
    this.submitted = true;
    if (this.selectedFile) {
      const formData = new FormData();
      formData.append('file', this.selectedFile);

      const url =
        this.type === 'warehouse'
          ? this.api.warehouse.import
          : this.api.subscribers.import;

      this.httpService.action(url, formData, 'importAction').subscribe({
        next: (res: any) => {
          if (res.success) {
            this.activeModal.close();
            this.toastrsService.Showsuccess(res.message || res.msg);
          } else {
            this.toastrsService.Showerror(res.message || res.msg);
          }
        },
      });
    }
  }
}
