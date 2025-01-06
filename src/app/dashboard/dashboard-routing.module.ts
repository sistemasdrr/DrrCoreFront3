import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { MainComponent } from './main/main.component';

import { ProduccionDiariaComponent } from 'app/dashboard/produccion-diaria/produccion-diaria.component';
import { ProduccionMensualComponent } from './produccion-mensual/produccion-mensual.component';
import { ReportesComponent } from './reportes/reportes.component';
import { ListaObservadosComponent } from './lista-observados/lista-observados.component';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'main',
    pathMatch: 'full',
  },
  {
    path: 'main',
    component: MainComponent
  },
  
  {
    path: 'reports',
    component: ReportesComponent,
  },
  {
    path: 'produccion/diaria', component: ProduccionDiariaComponent,
    title : 'Producción Diaria - DRR Core V1'
  },
  {
    path: 'produccion/mensual', component: ProduccionMensualComponent,
    title : 'Producción Mensual - DRR Core V1'
  },
  {
    path: 'cupones-observados', component: ListaObservadosComponent,
    title : 'Listado de Cupones Observados - DRR Core V1'
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DashboardRoutingModule {}
