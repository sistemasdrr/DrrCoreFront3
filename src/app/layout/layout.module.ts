import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgScrollbarModule } from 'ngx-scrollbar';
import { SharedModule } from '../shared/shared.module';
import { MatListModule } from '@angular/material/list';
@NgModule({
  imports: [CommonModule, NgScrollbarModule, SharedModule,MatListModule],
  declarations: [],
})
export class LayoutModule {}
