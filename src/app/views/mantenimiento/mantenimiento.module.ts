import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MantenimientoRoutingModule } from './mantenimiento-routing.module';
import { ListaPersonalComponent } from './personal/lista/lista.component';
import { ComponentsModule } from '@shared/components/components.module';
import { SharedModule } from '@shared';
import { DetallePersonalComponent } from './personal/detalle/detalle.component';
import { AgregarEssaludComponent } from './personal/detalle/agregar-essalud/agregar-essalud.component';
import { NgxMaskDirective, NgxMaskPipe, provideNgxMask } from 'ngx-mask';
import { NgxDropzoneModule } from 'ngx-dropzone';
import { MantenedorComponent } from './mantenedor/mantenedor.component';
import { MatSortModule } from '@angular/material/sort';
import { MatIconModule } from '@angular/material/icon';
import { FeatherIconsModule } from '@shared/components/feather-icons/feather-icons.module';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { ListaAbonadoComponent } from './abonado/lista/lista.component';
import { DetalleAbonadoComponent } from './abonado/detalle/detalle.component';
import { DatosGeneralesAbonadoComponent } from './abonado/detalle/datos-generales/datos-generales.component';
import { PreciosAbonadoComponent } from './abonado/detalle/precios/precios.component';
import { CuponeraComponent } from './abonado/detalle/cuponera/cuponera.component';
import { AgregarEditarPrecioAbonadoComponent } from './abonado/detalle/precios/agregar-editar/agregar-editar.component';
import { DetalleAgenteComponent } from './agente/detalle/detalle.component';
import { ListaAgenteComponent } from './agente/lista/lista.component';
import { PreciosAgenteComponent } from './agente/detalle/precios/precios.component';
import { DatosGeneralesAgenteComponent } from './agente/detalle/datos-generales/datos-generales.component';
import { AgregarEditarAgenteComponent } from './agente/detalle/precios/agregar-editar/agregar-editar.component';
import { FacturacionWebComponent } from './abonado/detalle/facturacion-web/facturacion-web.component';
import { FacturacionPorCuponComponent } from './abonado/detalle/facturacion-por-cupon/facturacion-por-cupon.component';
import { AgregarCuponComponent } from './abonado/detalle/facturacion-por-cupon/agregar-cupon/agregar-cupon.component';
import { PermisosComponent } from './personal/lista/permisos/permisos.component';
import { CalendarioComponent } from './calendario/calendario.component';

import { FullCalendarModule } from '@fullcalendar/angular';
import { DetalleCalendarioComponent } from './calendario/detalle-calendario/detalle-calendario.component';
import {
  OwlDateTimeModule,
  OwlNativeDateTimeModule,
} from '@danielmoncada/angular-datetime-picker';

import { LOCALE_ID } from '@angular/core';
import { registerLocaleData } from '@angular/common';
import localeEs from '@angular/common/locales/es';
import { PrecioPersonalComponent } from './personal/lista/precio-personal/precio-personal.component';
import { AgregarPrecioPersonalComponent } from './personal/lista/precio-personal/agregar-precio-personal/agregar-precio-personal.component';

registerLocaleData(localeEs);

@NgModule({
  declarations: [
    ListaPersonalComponent,
    DetallePersonalComponent,
    ListaAbonadoComponent,
    DetalleAbonadoComponent,
    AgregarEssaludComponent,
    MantenedorComponent,
    DatosGeneralesAbonadoComponent,
    DatosGeneralesAgenteComponent,
    PreciosAbonadoComponent,
    PreciosAgenteComponent,
    CuponeraComponent,
    AgregarEditarPrecioAbonadoComponent,
    AgregarEditarAgenteComponent,
    DetalleAgenteComponent,
    ListaAgenteComponent,
    FacturacionWebComponent,
    FacturacionPorCuponComponent,
    AgregarCuponComponent,
    PermisosComponent,
    CalendarioComponent,
    DetalleCalendarioComponent,
    PrecioPersonalComponent,
    AgregarPrecioPersonalComponent,
  ],
  imports: [
    CommonModule,
    MantenimientoRoutingModule,
    ComponentsModule,
    SharedModule,
    NgxMaskDirective,
    NgxMaskPipe,
    NgxDropzoneModule,
    MatSortModule,
    MatIconModule,
    FeatherIconsModule,
    MatProgressBarModule,
    FullCalendarModule,

    OwlDateTimeModule,
    OwlNativeDateTimeModule,
  ],
  providers: [provideNgxMask(),{ provide: LOCALE_ID, useValue: 'es' }],

})
export class MantenimientoModule { }
