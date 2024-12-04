import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CuadrosRoutingModule } from './cuadros-routing.module';
import { AbonadosComponent } from './abonados/abonados.component';
import { ReporterosComponent } from './reporteros/reporteros.component';
import { AgentesComponent } from './agentes/agentes.component';
import { DigitadoresComponent } from './digitadores/digitadores.component';
import { TraductorasComponent } from './traductoras/traductoras.component';
import { SupervisoresComponent } from './supervisores/supervisores.component';
import { ObservacionesComponent } from './observaciones/observaciones.component';
import { PdfViewerModule } from 'ng2-pdf-viewer';
import { MatSortModule } from '@angular/material/sort';
import { MatTableModule } from '@angular/material/table';
import { ComponentsModule } from '@shared/components/components.module';
import { SharedModule } from '@shared';

import { NgxExtendedPdfViewerModule } from 'ngx-extended-pdf-viewer'
import { FeatherModule } from 'angular-feather';
@NgModule({
  declarations: [
    AbonadosComponent,
    ReporterosComponent,
    AgentesComponent,
    DigitadoresComponent,
    TraductorasComponent,
    SupervisoresComponent,
    ObservacionesComponent
  ],
  imports: [
    CommonModule,
    CuadrosRoutingModule,
    SharedModule,
    ComponentsModule,
    MatTableModule,
    MatSortModule,
    PdfViewerModule,
    NgxExtendedPdfViewerModule,
    FeatherModule
  ]
})
export class CuadrosModule { }
