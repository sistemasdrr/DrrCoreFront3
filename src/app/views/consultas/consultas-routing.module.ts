import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AbonadosComponent } from './abonados/abonados.component';
import { AgentesComponent } from './agentes/agentes.component';
import { FacturacionComponent } from './facturacion/facturacion.component';
import { InformesComponent } from './informes/informes.component';
import { ReporterosComponent } from './reporteros/reporteros.component';

const routes: Routes = [
  {
    path: 'abonados',
    component: AbonadosComponent,
    data: { title: 'Consultas Abonados - DRR Core V1' }
  },
  {
    path: 'agentes',
    component: AgentesComponent,
    data: { title: 'Consultas Agentes - DRR Core V1' }
  },
  {
    path: 'facturacion',
    component: FacturacionComponent,
    data: { title: 'Consultas Facturación - DRR Core V1' }
  },
  {
    path: 'informes',
    component: InformesComponent,
    data: { title: 'Consultas Informes - DRR Core V1' }
  },
  {
    path: 'reporteros',
    component: ReporterosComponent,
    data: { title: 'Consultas Reporteros - DRR Core V1' }
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ConsultasRoutingModule { }
