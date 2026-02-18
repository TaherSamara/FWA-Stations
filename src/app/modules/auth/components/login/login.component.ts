import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent {
  form: FormGroup;
  submitted: boolean = false;
  message: string;
  messageType: string;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    public authService: AuthService,
  ) {}

  ngOnInit(): void {
    this.form = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
    });
  }

  get f() {
    return this.form.controls;
  }

  showMsg(success: boolean, msg: string) {
    this.message = msg;
    this.messageType = success ? 'success' : 'danger';
  }

  submit() {
    this.submitted = true;
    if (this.form.valid) {
      const { email, password } = this.form.value;

      this.showMsg(false, '');
      this.authService.login(email, password).subscribe({
        next: (res: any) => {
          if (res.success) {
            localStorage.setItem('fwa-system-data', JSON.stringify(res.data));
            this.router.navigate(['/']);
          } else {
            this.showMsg(false, res.msg);
          }
        },
      });
    }
  }
}
