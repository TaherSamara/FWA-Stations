import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { AuthService } from 'src/app/modules/auth/services/auth.service';
import { PermissionCode } from '../../../models';
import { ApiService } from '../../../services/api.service';
import { HttpService } from '../../../services/http.service';
import { ToastrsService } from '../../../services/toater.service';

@Component({
  selector: 'app-add-edit-warehouse',
  templateUrl: './add-edit.component.html',
  styleUrls: ['./add-edit.component.css'],
})
export class AddEditWarehouseComponent {
  public device: any;
  public isFullEdit: boolean = true; // true = full edit, false = update line code only
  form: FormGroup;
  submitted: boolean = false;
  users: any[] = [];
  PermissionCode = PermissionCode;

  constructor(
    public activeModal: NgbActiveModal,
    public httpService: HttpService,
    private api: ApiService,
    private toastrsService: ToastrsService,
    public authService: AuthService,
  ) {}

  ngOnInit() {
    this.initForm();
    if (this.isFullEdit) {
      this.loadUsers();
    }
  }

  get f() {
    return this.form.controls;
  }

  loadUsers() {
    // Load users for the assigned_user_id dropdown (if editing full device)
    this.httpService
      .list(
        this.api.users.list,
        { params: { size: 1000, page: 1 } },
        'usersDropdown',
      )
      .subscribe({
        next: (res: any) => {
          if (res.success) {
            this.users = res.data.data;
          }
        },
      });
  }

  submit() {
    this.submitted = true;
    if (this.form.valid) {
      const formData = new FormData();

      if (this.isFullEdit) {
        // Full edit
        formData.append('device_type', this.f.DeviceType.value);
        formData.append('serial_number', this.f.SerialNumber.value);
        formData.append('source_location', this.f.SourceLocation.value || '');
        // Only include line code and notes if user has permission
        if (
          this.authService.hasPermission(
            PermissionCode.UPDATE_CUSTOMER_LINE_CODE,
          )
        ) {
          formData.append(
            'customer_line_code',
            this.f.CustomerLineCode?.value || '',
          );
          formData.append('notes', this.f.Notes?.value || '');
        }
        if (this.f.AssignedUserId.value) {
          formData.append('assigned_user_id', this.f.AssignedUserId.value);
        }

        let url = this.device
          ? this.api.warehouse.edit(this.device.id)
          : this.api.warehouse.add;

        this.httpService.action(url, formData, 'addEditAction').subscribe({
          next: (res: any) => {
            if (res.success) {
              this.activeModal.close();
              this.toastrsService.Showsuccess(res.msg || res.msg);
            } else {
              this.toastrsService.Showerror(res.msg || res.msg);
            }
          },
        });
      } else {
        // Update line code only
        const body = {
          customer_line_code: this.f.CustomerLineCode.value,
          notes: this.f.Notes.value || '',
        };

        this.httpService
          .action(
            this.api.warehouse.updateCustomerLineCode(this.device.id),
            body,
            'updateLineCodeAction',
          )
          .subscribe({
            next: (res: any) => {
              if (res.success) {
                this.activeModal.close();
                this.toastrsService.Showsuccess(res.msg || res.msg);
              } else {
                this.toastrsService.Showerror(res.msg || res.msg);
              }
            },
          });
      }
    }
  }

  initForm() {
    if (this.isFullEdit) {
      // Full edit form
      const formFields: any = {
        DeviceType: new FormControl(
          this.device ? this.device.device_type : '',
          Validators.required,
        ),
        SerialNumber: new FormControl(
          this.device ? this.device.serial_number : '',
          Validators.required,
        ),
        SourceLocation: new FormControl(
          this.device ? this.device.source_location : '',
        ),
        AssignedUserId: new FormControl(
          this.device ? this.device.assigned_user_id : null,
        ),
      };

      // Add Line Code and Notes fields only if user has permission
      if (
        this.authService.hasPermission(PermissionCode.UPDATE_CUSTOMER_LINE_CODE)
      ) {
        formFields.CustomerLineCode = new FormControl(
          this.device ? this.device.customer_line_code : '',
        );
        formFields.Notes = new FormControl(
          this.device ? this.device.notes : '',
        );
      }

      this.form = new FormGroup(formFields);
    } else {
      // Update line code only form
      this.form = new FormGroup({
        CustomerLineCode: new FormControl(
          this.device ? this.device.customer_line_code : '',
          Validators.required,
        ),
        Notes: new FormControl(this.device ? this.device.notes : ''),
      });
    }
  }
}
