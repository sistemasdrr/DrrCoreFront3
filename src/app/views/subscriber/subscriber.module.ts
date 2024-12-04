import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SubscriberRoutingModule } from './subscriber-routing.module';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatIconModule } from '@angular/material/icon';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MainPageComponent } from './main-page/main-page.component';
import { PedidosOnlineComponent } from './pedidos-online/pedidos-online.component';
import { PedidosOfflineComponent } from './pedidos-offline/pedidos-offline.component';
import { HistorialPedidosComponent } from './historial-pedidos/historial-pedidos.component';
import { SharedModule } from '@shared';
import { ComponentsModule } from '@shared/components/components.module';
import { ConfirmarPedidoComponent } from './pedidos-online/confirmar-pedido/confirmar-pedido.component';
import { PerfilComponent } from './perfil/perfil.component';



@NgModule({
  declarations: [
    MainPageComponent,
    PedidosOnlineComponent,
    PedidosOfflineComponent,
    HistorialPedidosComponent,
    ConfirmarPedidoComponent,
    PerfilComponent,
  ],
  imports: [
    CommonModule,
    SubscriberRoutingModule,
    MatCheckboxModule,
    MatIconModule,
    FormsModule,
    ReactiveFormsModule,
    SharedModule,
    ComponentsModule
  ]
})
export class SubscriberModule { }
