import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { AuthService } from 'src/app/modules/auth/services/auth.service';
import { ToastrsService } from '../../services/toater.service';

@Component({
  selector: 'app-change-password',
  templateUrl: './change-password.component.html',
  styleUrls: ['./change-password.component.css'],
})
export class ChangePasswordComponent {
  changePasswordForm: FormGroup;
  isLoading = false;
  showOldPassword = false;
  showNewPassword = false;
  showConfirmPassword = false;

  constructor(
    public activeModal: NgbActiveModal,
    private fb: FormBuilder,
    private authService: AuthService,
    private toasterService: ToastrsService,
  ) {
    this.changePasswordForm = this.fb.group(
      {
        old_password: ['', Validators.required],
        new_password: ['', [Validators.required, Validators.minLength(6)]],
        confirm_password: ['', Validators.required],
      },
      {
        validators: this.passwordMatchValidator,
      },
    );
  }

  passwordMatchValidator(form: FormGroup) {
    const newPassword = form.get('new_password');
    const confirmPassword = form.get('confirm_password');

    if (
      newPassword &&
      confirmPassword &&
      newPassword.value !== confirmPassword.value
    ) {
      confirmPassword.setErrors({ passwordMismatch: true });
      return { passwordMismatch: true };
    }
    return null;
  }

  togglePasswordVisibility(field: string) {
    if (field === 'old') {
      this.showOldPassword = !this.showOldPassword;
    } else if (field === 'new') {
      this.showNewPassword = !this.showNewPassword;
    } else if (field === 'confirm') {
      this.showConfirmPassword = !this.showConfirmPassword;
    }
  }

  onSubmit() {
    if (this.changePasswordForm.invalid) {
      Object.keys(this.changePasswordForm.controls).forEach((key) => {
        this.changePasswordForm.get(key)?.markAsTouched();
      });
      return;
    }

    this.isLoading = true;
    const formData = this.changePasswordForm.value;

    this.authService
      .changePassword(
        formData.old_password,
        formData.new_password,
        formData.confirm_password,
      )
      .subscribe({
        next: (res: any) => {
          this.isLoading = false;
          if (res.success) {
            this.toasterService.Showsuccess('Password changed successfully');
            this.activeModal.close(true);
          } else {
            this.toasterService.Showerror(
              res.msg || 'Failed to change password',
            );
          }
        },
        error: (error) => {
          this.isLoading = false;
          this.toasterService.Showerror(
            error.error?.message || 'Failed to change password',
          );
        },
      });
  }

  get oldPassword() {
    return this.changePasswordForm.get('old_password');
  }

  get newPassword() {
    return this.changePasswordForm.get('new_password');
  }

  get confirmPassword() {
    return this.changePasswordForm.get('confirm_password');
  }
}
