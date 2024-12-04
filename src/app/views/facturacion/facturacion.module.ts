import { MatTableModule } from '@angular/material/table';
import { MatIconModule } from '@angular/material/icon';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { FacturacionRoutingModule } from './facturacion-routing.module';
import { FacturacionAgenteComponent } from './facturacion-agente/facturacion-agente.component';
import { FacturacionMensualComponent } from './facturacion-abonado/facturacion-mensual/facturacion-mensual.component';
import { FacturacionConCuponesComponent } from './facturacion-abonado/facturacion-con-cupones/facturacion-con-cupones.component';
import { ComponentsModule } from '@shared/components/components.module';
import { MatTabsModule } from '@angular/material/tabs';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatSelectModule } from '@angular/material/select';
import { FeatherModule } from 'angular-feather';
import { FeatherIconsModule } from '@shared/components/feather-icons/feather-icons.module';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort';
import { EditarFacturaAgenteComponent } from './facturacion-agente/editar-factura-agente/editar-factura-agente.component';
import { CancelarFacturaComponent } from './facturacion-agente/cancelar-factura/cancelar-factura.component';
import { CancelarFacturaAbonadoComponent } from './facturacion-abonado/facturacion-mensual/cancelar-factura-abonado/cancelar-factura-abonado.component';
import { EditarPorFacturarComponent } from './facturacion-abonado/facturacion-mensual/editar-por-facturar/editar-por-facturar.component';
import { EditarPorCobrarAbonadoComponent } from './facturacion-abonado/facturacion-mensual/editar-por-cobrar/editar-por-cobrar.component';
import { FacturacionInternaComponent } from './facturacion-interna/facturacion-interna.component';
import { MatButtonToggleModule } from '@angular/material/button-toggle';


@NgModule({
  declarations: [
    FacturacionAgenteComponent,
    FacturacionMensualComponent,
    FacturacionConCuponesComponent,
    EditarFacturaAgenteComponent,
    EditarPorCobrarAbonadoComponent,
    CancelarFacturaComponent,
    CancelarFacturaAbonadoComponent,
    EditarPorFacturarComponent,
    FacturacionInternaComponent
  ],
  imports: [
    CommonModule,
    FacturacionRoutingModule,
    ComponentsModule,
    MatTabsModule,
    MatDatepickerModule,
    MatFormFieldModule,
    MatInputModule,
    MatFormFieldModule,
    FormsModule,
    MatIconModule,
    MatTooltipModule,
    MatButtonModule,
    MatFormFieldModule,
    ReactiveFormsModule,
    MatTableModule,
    MatCheckboxModule,
    MatSelectModule,
    FeatherModule,
    MatSortModule,
    FeatherIconsModule,
    MatPaginatorModule,
    MatButtonToggleModule
  ]
})
export class FacturacionModule { }
