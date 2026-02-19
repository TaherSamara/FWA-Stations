import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Permission } from 'src/app/modules/dash/models';
import { ApiService } from '../../../services/api.service';
import { HttpService } from '../../../services/http.service';
import { PermissionsService } from '../../../services/permissions.service';
import { ToastrsService } from '../../../services/toater.service';

@Component({
  selector: 'app-add-edit-users',
  templateUrl: './add-edit.component.html',
  styleUrls: ['./add-edit.component.css'],
})
export class AddEditUsersComponent {
  public user: any;
  form: FormGroup;
  submitted: boolean = false;
  imageFile: File | null = null;

  // Permissions
  permissionsByCategory: { [category: string]: Permission[] } = {};
  categoryKeys: string[] = [];
  selectedPermissions: number[] = [];

  constructor(
    public activeModal: NgbActiveModal,
    public httpService: HttpService,
    private api: ApiService,
    private toastrsService: ToastrsService,
    public permissionsService: PermissionsService,
  ) {}

  ngOnInit() {
    this.initForm();

    // Load permissions first, then set selected permissions
    if (this.user) {
    }

    this.loadPermissions();
  }

  loadPermissions() {
    this.permissionsService.getPermissionsByCategory().subscribe((grouped) => {
      this.permissionsByCategory = grouped;
      this.categoryKeys = Object.keys(grouped);

      // Load user's selected permissions after categories are loaded
      if (
        this.user &&
        this.user.permissions &&
        Array.isArray(this.user.permissions)
      ) {
        this.selectedPermissions = this.user.permissions.map((p: any) => {
          // Ensure we get a number, not a string
          return Number(p.permission_id || p.id);
        });
      } else if (!this.user) {
        // If adding new user, select all permissions by default
        this.selectedPermissions = [];
        Object.values(grouped).forEach((permissions: Permission[]) => {
          permissions.forEach((permission) => {
            this.selectedPermissions.push(permission.id);
          });
        });
      }
    });
  }

  get f() {
    return this.form.controls;
  }

  onPermissionChange(permissionId: number, event: any) {
    // Ensure permissionId is a number
    const id = Number(permissionId);

    if (event.target.checked) {
      if (!this.selectedPermissions.includes(id)) {
        this.selectedPermissions.push(id);
      }
    } else {
      const index = this.selectedPermissions.indexOf(id);
      if (index > -1) {
        this.selectedPermissions.splice(index, 1);
      }
    }
  }

  onCategoryChange(category: string, event: any) {
    const categoryPermissions = this.permissionsByCategory[category];
    if (event.target.checked) {
      // Select all permissions in this category
      categoryPermissions.forEach((permission) => {
        if (!this.selectedPermissions.includes(permission.id)) {
          this.selectedPermissions.push(permission.id);
        }
      });
    } else {
      // Deselect all permissions in this category
      categoryPermissions.forEach((permission) => {
        const index = this.selectedPermissions.indexOf(permission.id);
        if (index > -1) {
          this.selectedPermissions.splice(index, 1);
        }
      });
    }
  }

  isCategorySelected(category: string): boolean {
    const categoryPermissions = this.permissionsByCategory[category];
    if (!categoryPermissions || categoryPermissions.length === 0) {
      return false;
    }
    return categoryPermissions.every((permission) =>
      this.selectedPermissions.includes(permission.id),
    );
  }

  isPermissionSelected(permissionId: number): boolean {
    return this.selectedPermissions.includes(permissionId);
  }

  onImageSelected(event: any) {
    const file = event.target.files[0];
    if (file) {
      this.imageFile = file;
    }
  }

  submit() {
    this.submitted = true;
    if (this.form.valid) {
      const formData = new FormData();
      formData.append('first_name', this.f.FirstName.value);
      formData.append('last_name', this.f.LastName.value);
      formData.append('email', this.f.Email.value);

      if (this.imageFile) {
        formData.append('image', this.imageFile);
      }

      // Add selected permissions
      this.selectedPermissions.forEach((id) => {
        formData.append('permission_ids[]', id.toString());
      });

      let url = this.user
        ? this.api.users.edit(this.user.id)
        : this.api.users.add;
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
    }
  }

  initForm() {
    this.form = new FormGroup({
      FirstName: new FormControl(
        this.user ? this.user.first_name : '',
        Validators.required,
      ),
      LastName: new FormControl(
        this.user ? this.user.last_name : '',
        Validators.required,
      ),
      Email: new FormControl(this.user ? this.user.email : '', [
        Validators.required,
        Validators.email,
      ]),
    });
  }
}
