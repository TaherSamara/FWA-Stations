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
        path: 'devices',
        canActivate: [AuthGuard, PermissionGuard],
        data: { permission: PermissionCode.VIEW_DEVICES },
        loadChildren: () =>
          import('./pages/devices/devices.module').then(
            (m) => m.DevicesModule,
          ),
        title: 'Devices | FWA System',
      },
      {
        path: 'sub-devices',
        canActivate: [AuthGuard, PermissionGuard],
        data: { permission: PermissionCode.VIEW_SUBDEVICES },
        loadChildren: () =>
          import('./pages/sub-devices/sub-devices.module').then(
            (m) => m.SubDevicesModule,
          ),
        title: 'Sub Devices | FWA System',
      },
      {
        path: 'warehouse',
        canActivate: [AuthGuard, PermissionGuard],
        data: {
          permissions: [
            PermissionCode.VIEW_ALL_WAREHOUSE_DEVICES,
            PermissionCode.VIEW_MY_WAREHOUSE_DEVICES,
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
export class DashRoutingModule { }
