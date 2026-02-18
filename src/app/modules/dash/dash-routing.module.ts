import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PermissionCode } from 'src/app/modules/dash/models';
import { AuthGuard } from '../auth/guards/auth.guard';
import { PermissionGuard } from '../auth/guards/permission.guard';
import { DashComponent } from './dash.component';
import { RedirectComponent } from './redirect.component';

const routes: Routes = [
  {
    path: '',
    component: DashComponent,
    children: [
      {
        path: 'users',
        canActivate: [AuthGuard, PermissionGuard],
        data: { permission: PermissionCode.VIEW_USERS },
        loadChildren: () =>
          import('./pages/users/users.module').then((m) => m.UsersModule),
        title: 'Users | FWA System',
      },
      {
        path: 'stations',
        canActivate: [AuthGuard, PermissionGuard],
        data: { permission: PermissionCode.VIEW_STATIONS },
        loadChildren: () =>
          import('./pages/stations/stations.module').then(
            (m) => m.StationsModule,
          ),
        title: 'Stations | FWA System',
      },
      {
        path: 'subscribers',
        canActivate: [AuthGuard, PermissionGuard],
        data: { permission: PermissionCode.VIEW_SUBSCRIBERS },
        loadChildren: () =>
          import('./pages/subscribers/subscribers.module').then(
            (m) => m.SubscribersModule,
          ),
        title: 'Subscribers | FWA System',
      },
      {
        path: 'warehouse',
        canActivate: [AuthGuard, PermissionGuard],
        data: {
          permissions: [
            PermissionCode.VIEW_ALL_DEVICES,
            PermissionCode.VIEW_MY_DEVICES,
          ],
        },
        loadChildren: () =>
          import('./pages/warehouse/warehouse.module').then(
            (m) => m.WarehouseModule,
          ),
        title: 'Warehouse | FWA System',
      },
      {
        path: '',
        component: RedirectComponent,
        canActivate: [AuthGuard],
        pathMatch: 'full',
      },
      { path: '**', redirectTo: 'error/404' },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DashRoutingModule {}
