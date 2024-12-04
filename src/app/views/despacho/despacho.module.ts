import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DespachoRoutingModule } from './despacho-routing.module';
import { ListaComponent } from './lista/lista.component';
import { ComponentsModule } from '@shared/components/components.module';
import { SharedModule } from '@shared';
import { MovimientoInformeComponent } from './lista/movimiento-informe/movimiento-informe.component';
import { DetalleComponent } from './lista/detalle/detalle.component';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { FormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSortModule } from '@angular/material/sort';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatTableModule } from '@angular/material/table';
import { EnviarInformeComponent } from './lista/enviar-informe/enviar-informe.component';


@NgModule({
  declarations: [
    ListaComponent,
    MovimientoInformeComponent,
    DetalleComponent,
    EnviarInformeComponent
  ],
  imports: [
    CommonModule,
    DespachoRoutingModule,
    ComponentsModule,
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
    
  ]
})
export class DespachoModule { }
