import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { InlineSVGModule } from 'ng-inline-svg-2';
import { NgxPaginationModule } from 'ngx-pagination';
import { NgxSkeletonLoaderModule } from 'ngx-skeleton-loader';
import { ChangePasswordComponent } from './components/change-password/change-password.component';
import { ConfirmationDialogComponent } from './components/confirmation-dialog/confirmation-dialog.component';
import { ConfirmationDialogService } from './components/confirmation-dialog/confirmation-dialog.service';
import { SearchResultsComponent } from './components/search-results/search-results.component';
import { SidebarComponent } from './components/side-bar/side-bar.component';
import { DashRoutingModule } from './dash-routing.module';
import { DashComponent } from './dash.component';
import { RedirectComponent } from './redirect.component';
import { SharedModule } from './shared/shared.module';

@NgModule({
  declarations: [
    DashComponent,
    SidebarComponent,
    RedirectComponent,
    ConfirmationDialogComponent,
    SearchResultsComponent,
    ChangePasswordComponent,
  ],
  imports: [
    CommonModule,
    DashRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    NgbModule,
    InlineSVGModule,
    NgxPaginationModule,
    NgxSkeletonLoaderModule,
    SharedModule,
  ],
  providers: [ConfirmationDialogService],
})
export class DashModule {}
