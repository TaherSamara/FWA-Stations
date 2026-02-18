import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { NgbDropdownModule, NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { MdbDropdownModule } from 'mdb-angular-ui-kit/dropdown';
import { MdbRippleModule } from 'mdb-angular-ui-kit/ripple';
import { NgxPaginationModule } from 'ngx-pagination';
import { NgxSkeletonLoaderModule } from 'ngx-skeleton-loader';
import { SharedModule } from '../../shared/shared.module';
import { AddEditSubscribersComponent } from './add-edit/add-edit.component';
import { SubscribersComponent } from './subscribers.component';

@NgModule({
  declarations: [SubscribersComponent, AddEditSubscribersComponent],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule.forChild([
      {
        path: '',
        component: SubscribersComponent,
      },
    ]),
    NgxPaginationModule,
    NgxSkeletonLoaderModule,
    NgbModule,
    NgbDropdownModule,
    MdbDropdownModule,
    MdbRippleModule,
    SharedModule,
  ],
})
export class SubscribersModule {}
