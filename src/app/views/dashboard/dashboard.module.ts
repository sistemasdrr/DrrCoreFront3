import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DashboardRoutingModule } from './dashboard-routing.module';
import { DashAdminComponent } from './dash-admin/dash-admin.component';
import { DashSupervisorComponent } from './dash-supervisor/dash-supervisor.component';
import { DashDigitadorComponent } from './dash-digitador/dash-digitador.component';
import { SharedModule } from '@shared';
import { ComponentsModule } from '@shared/components/components.module';


@NgModule({
  declarations: [
    DashAdminComponent,
    DashSupervisorComponent,
    DashDigitadorComponent,
  ],
  imports: [
    CommonModule,
    DashboardRoutingModule,
    SharedModule,
    ComponentsModule
  ]
})
export class DashboardModule { }
