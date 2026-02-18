import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { NgxPaginationModule } from 'ngx-pagination';
import { NgxSkeletonLoaderModule } from 'ngx-skeleton-loader';
import { SharedModule } from '../../shared/shared.module';
import { AddEditWarehouseComponent } from './add-edit/add-edit.component';
import { WarehouseComponent } from './warehouse.component';

@NgModule({
  declarations: [WarehouseComponent, AddEditWarehouseComponent],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule.forChild([
      {
        path: '',
        component: WarehouseComponent,
      },
    ]),
    NgxPaginationModule,
    NgxSkeletonLoaderModule,
    NgbModule,
    SharedModule,
  ],
})
export class WarehouseModule {}
