import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { NgxPaginationModule } from 'ngx-pagination';
import { HasPermissionDirective } from '../directives/has-permission.directive';
import { DeleteComponent } from './delete/delete.component';
import { ImportComponent } from './import/import.component';
import { NoResultsComponent } from './no-results/no-results.component';
import { PaginationComponent } from './pagination/pagination.component';
import { PingComponent } from './ping/ping.component';

@NgModule({
  declarations: [
    PaginationComponent,
    NoResultsComponent,
    DeleteComponent,
    ImportComponent,
    PingComponent,
    HasPermissionDirective,
  ],
  imports: [
    CommonModule,
    NgxPaginationModule,
    ReactiveFormsModule,
    FormsModule,
    NgbModule,
  ],
  exports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    NgxPaginationModule,
    NgbModule,
    PaginationComponent,
    NoResultsComponent,
    DeleteComponent,
    ImportComponent,
    PingComponent,
    HasPermissionDirective,
  ],
})
export class SharedModule {}
