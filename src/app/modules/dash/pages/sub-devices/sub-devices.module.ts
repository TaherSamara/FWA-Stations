import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { NgbDropdownModule, NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { MdbDropdownModule } from 'mdb-angular-ui-kit/dropdown';
import { MdbRippleModule } from 'mdb-angular-ui-kit/ripple';
import { NgxPaginationModule } from 'ngx-pagination';
import { NgxSkeletonLoaderModule } from 'ngx-skeleton-loader';
import { DEVICE_TYPE_TABS } from '../../models';
import { SharedModule } from '../../shared/shared.module';
import { AddEditSubDevicesComponent } from './add-edit/add-edit.component';
import { SubDevicesComponent } from './sub-devices.component';

@NgModule({
  declarations: [
    SubDevicesComponent,
    AddEditSubDevicesComponent,
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule.forChild([
      {
        path: '',
        redirectTo: DEVICE_TYPE_TABS[0].slug,
        pathMatch: 'full',
      },
      ...DEVICE_TYPE_TABS.map((tab) => ({
        path: tab.slug,
        component: SubDevicesComponent,
        data: { deviceType: tab.type },
      })),
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
export class SubDevicesModule {}
