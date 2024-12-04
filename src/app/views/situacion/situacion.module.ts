import { MatPaginatorModule } from '@angular/material/paginator';
import { NgModule } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';

import { ListaSituacionComponent } from './lista/lista.component';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatTableModule } from '@angular/material/table';
import { MatSortModule } from '@angular/material/sort';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { FormsModule } from '@angular/forms';
import { SharedModule } from '@shared';
import { ComponentsModule } from '@shared/components/components.module';
import { SituacionRoutingModule } from './situacion-routing.module';
import { HistorialComponent } from './historial/historial.component';
import { HistorialPedidoComponent } from './lista/historial-pedido/historial-pedido.component';
import { ObservacionComponent } from './lista/observacion/observacion.component';
import { ConcluirObservacionComponent } from './lista/observacion-pedido/concluir-observacion/concluir-observacion.component';
import { ObservacionPedidoComponent } from './lista/observacion-pedido/observacion-pedido.component';
import { MatChipsModule } from '@angular/material/chips';
import { MatAutocompleteModule } from '@angular/material/autocomplete';


@NgModule({
  declarations: [
    ListaSituacionComponent,
    HistorialComponent,
    HistorialPedidoComponent,
    ObservacionComponent,
    ObservacionPedidoComponent,
    ConcluirObservacionComponent
  ],
  imports: [
    SituacionRoutingModule,
    CommonModule,
    MatIconModule,
    MatButtonModule,
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    MatFormFieldModule,
    MatInputModule,
    FormsModule,
    SharedModule,
    ComponentsModule,
    MatChipsModule,
    MatAutocompleteModule
  ],
  providers:[
    DatePipe
  ]
})
export class SituacionModule { }
