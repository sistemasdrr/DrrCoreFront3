import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DashboardRoutingModule } from './dashboard-routing.module';
import { MainComponent } from './main/main.component';

import { NgChartsModule } from 'ng2-charts';

import { NgxGaugeModule } from 'ngx-gauge';
import { NgScrollbarModule } from 'ngx-scrollbar';
import { NgApexchartsModule } from 'ng-apexcharts';
import { ComponentsModule } from '../shared/components/components.module';
import { SharedModule } from './../shared/shared.module';
import { ProduccionDiariaComponent } from 'app/dashboard/produccion-diaria/produccion-diaria.component';
import { ProduccionMensualComponent } from './produccion-mensual/produccion-mensual.component';
import { MatSidenavModule } from '@angular/material/sidenav';
import { EnviarComplementoComponent } from './produccion-mensual/enviar-complemento/enviar-complemento.component';
import { MatMenuModule } from '@angular/material/menu';
import { MatTableModule } from '@angular/material/table';
import { MatSortModule } from '@angular/material/sort';
import { PdfViewerModule } from 'ng2-pdf-viewer';
import { NgxExtendedPdfViewerModule } from 'ngx-extended-pdf-viewer';
import { FeatherModule } from 'angular-feather';
import { ReportesComponent } from './reportes/reportes.component';
import { ListaObservadosComponent } from './lista-observados/lista-observados.component';

@NgModule({
  declarations: [MainComponent,
    ProduccionDiariaComponent,
    ProduccionMensualComponent,
    EnviarComplementoComponent,ReportesComponent,ListaObservadosComponent],
  imports: [
    CommonModule,
    DashboardRoutingModule,
    NgChartsModule,
    NgScrollbarModule,
    NgApexchartsModule,
    NgxGaugeModule,
    ComponentsModule,
    SharedModule,
    MatSidenavModule,
    MatMenuModule,
    SharedModule,
    MatTableModule,
    MatSortModule,
    PdfViewerModule,
    NgxExtendedPdfViewerModule,
    FeatherModule,

  ],
})
export class DashboardModule {}
