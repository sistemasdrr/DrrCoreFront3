import {  NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MainPageComponent } from './main-page/main-page.component';
import { AuthSubscriberGuard } from '../../authentication/auth/auth-subscriber.guard';
import { PedidosOnlineComponent } from './pedidos-online/pedidos-online.component';
import { PedidosOfflineComponent } from './pedidos-offline/pedidos-offline.component';
import { HistorialPedidosComponent } from './historial-pedidos/historial-pedidos.component';
import { PerfilComponent } from './perfil/perfil.component';

const routes: Routes = [
  {
    path: 'main',
    component: MainPageComponent,
    data: { title: 'Inicio - Solicitud de Informes' }
    ,canActivate: [AuthSubscriberGuard]
  },
  {
    path: 'perfil',
    component: PerfilComponent,
    data: { title: 'Perfil del Abonado' }
    ,canActivate: [AuthSubscriberGuard]
  },
  {
    path: 'online',
    component: PedidosOnlineComponent,
    data: { title: 'Solicitud de Informe - Online' }
    ,canActivate: [AuthSubscriberGuard]
  },
  {
    path: 'offline',
    component: PedidosOfflineComponent,
    data: { title: 'Solicitud de Informe - Offline' }
    ,canActivate: [AuthSubscriberGuard]
  },
  {
    path: 'offline/:idCompany',
    component: PedidosOfflineComponent,
    data: { title: 'Solicitud de Informe - Offline' }
    ,canActivate: [AuthSubscriberGuard]
  },
  {
    path: 'historial',
    component: HistorialPedidosComponent,
    data: { title: 'Historial de Pedidos' }
    ,canActivate: [AuthSubscriberGuard]
  },
];


@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SubscriberRoutingModule { }
