import { ChangeDetectorRef, Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ApiService } from '../../services/api.service';
import { HttpService } from '../../services/http.service';

@Component({
  selector: 'app-delete',
  templateUrl: './delete.component.html',
  styleUrls: ['./delete.component.css'],
})
export class DeleteComponent {
  public id: number;
  public comment_id: number;
  public type: string;
  public message: string;
  alertMessage: string;
  messageType: string;

  constructor(
    public activeModal: NgbActiveModal,
    public httpService: HttpService,
    private api: ApiService,
    private changeDetectorRef: ChangeDetectorRef,
  ) {}

  showMsg(success: boolean, msg: string) {
    this.alertMessage = msg;
    this.messageType = success ? 'success' : 'danger';
    this.changeDetectorRef.detectChanges();
  }

  delete() {
    let url: string = '';
    let data: any = {};

    switch (this.type) {
      case 'user':
        url = this.api.users.delete(this.id);
        break;
      case 'station':
        url = this.api.stations.delete(this.id);
        break;
      case 'subscriber':
        url = this.api.subscribers.delete(this.id);
        break;
      case 'device':
        url = this.api.warehouse.delete(this.id);
        break;
    }

    this.httpService.action(url, data, 'deleteAction').subscribe({
      next: (res: any) => {
        if (res.success) {
          this.showMsg(true, res.message || res.msg);
          setTimeout(() => {
            this.activeModal.close();
          }, 1000);
        } else {
          this.showMsg(false, res.message || res.msg);
        }
      },
    });
  }
}
