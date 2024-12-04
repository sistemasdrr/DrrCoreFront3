import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PedidosRoutingModule } from './pedidos-routing.module';
import { ListaComponent } from './lista/lista.component';
import { DetalleComponent } from './detalle/detalle.component';


import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatPaginatorModule} from '@angular/material/paginator';
import { MatSortModule} from '@angular/material/sort';
import { MatTableModule} from '@angular/material/table';
import {MatInputModule} from '@angular/material/input';
import {MatFormFieldModule} from '@angular/material/form-field';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import { SharedModule } from '@shared';
import { ComponentsModule } from '@shared/components/components.module';
import { AsignacionComponent } from './asignacion/asignacion.component';
import { Asignacion2Component } from './asignacion2/asignacion2.component';
import { SeleccionarAgenteComponent } from './asignacion2/seleccionar-agente/seleccionar-agente.component';
import { ListaEmpresasComponent } from './detalle/lista-empresas/lista-empresas.component';
import { ConsultarComponent } from './lista/consultar/consultar.component';
import { ListaAbonadosComponent } from './detalle/lista-abonados/lista-abonados.component';
import { ListaPersonasComponent } from './detalle/lista-personas/lista-personas.component';
import { ReferenciasComercialesComponent } from './asignacion2/referencias-comerciales/referencias-comerciales.component';
import { CKEditorModule } from '@ckeditor/ckeditor5-angular';

import { MatSelectModule } from '@angular/material/select';
import { MatListModule } from '@angular/material/list';
import { NgScrollbarModule } from 'ngx-scrollbar';
import { FeatherIconsModule } from '@shared/components/feather-icons/feather-icons.module';
import { MatTooltipModule } from '@angular/material/tooltip';
import { ComentarioComponent } from './asignacion/comentario/comentario.component';
import { StopPropagationDirective } from './asignacion2/stop-propagation.directive';
@NgModule({
  declarations: [
    ListaComponent,
    DetalleComponent,
    AsignacionComponent,
    Asignacion2Component,
    SeleccionarAgenteComponent,
    ListaEmpresasComponent,
    ConsultarComponent,
    ListaAbonadosComponent,
    ListaPersonasComponent,
    ReferenciasComercialesComponent,
    ComentarioComponent,
    StopPropagationDirective
  ],
  imports: [
    CommonModule,
    PedidosRoutingModule,
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
    MatIconModule,
    CKEditorModule,
    FormsModule,
    MatSelectModule,
    MatListModule,
    ReactiveFormsModule,
    NgScrollbarModule,
    FeatherIconsModule,
    MatTooltipModule
  ]
})
export class PedidosModule { }
