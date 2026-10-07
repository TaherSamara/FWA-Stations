import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { AuthLayoutComponent } from './auth-layout.component';

@NgModule({
  declarations: [AuthLayoutComponent],
  imports: [CommonModule],
  exports: [AuthLayoutComponent],
})
export class AuthLayoutModule {}
