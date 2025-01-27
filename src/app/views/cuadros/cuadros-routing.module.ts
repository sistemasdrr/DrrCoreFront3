import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AbonadosComponent } from './abonados/abonados.component';
import { ReporterosComponent } from './reporteros/reporteros.component';
import { AgentesComponent } from './agentes/agentes.component';
import { DigitadoresComponent } from './digitadores/digitadores.component';
import { TraductorasComponent } from './traductoras/traductoras.component';
import { SupervisoresComponent } from './supervisores/supervisores.component';
import { ReferencistasComponent } from './referencistas/referencistas.component';

const routes: Routes = [
  {
    path: 'abonados',
    component: AbonadosComponent,
    data: { title: 'Cuadro de Abonados - DRR Core V1' }
  },
  {
    path: 'reporteros',
    component: ReporterosComponent,
    data: { title: 'Cuadro de Reporteros - DRR Core V1' }
  },
  {
    path: 'agentes',
    component: AgentesComponent,
    data: { title: 'Cuadro de Agentes - DRR Core V1' }
  },
  {
    path: 'digitadores',
    component: DigitadoresComponent,
    data: { title: 'Cuadro de Digitadores - DRR Core V1' }
  },
  {
    path: 'traductores',
    component: TraductorasComponent,
    data: { title: 'Cuadro de Traductoras - DRR Core V1' }
  },
  {
    path: 'supervisores',
    component: SupervisoresComponent,
    data: { title: 'Cuadro de Supervisores - DRR Core V1' }
  },
  {
    path: 'referencistas',
    component: ReferencistasComponent,
    data: { title: 'Cuadro de Referencistas - DRR Core V1' }
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CuadrosRoutingModule { }
