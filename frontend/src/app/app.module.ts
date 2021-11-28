import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http'
import { CommonModule } from '@angular/common';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { ExplorerComponent } from './components/dashboard/explorer/explorer.component';
import { ElTypeFilterPipe } from './pipes/el-type-filter.pipe';
import { LoginComponent } from './components/login/login.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { FormsModule } from '@angular/forms';
import { QueuesComponent } from './components/dashboard/queues/queues.component';

@NgModule({
  declarations: [
    AppComponent,
    ExplorerComponent,
    ElTypeFilterPipe,
    LoginComponent,
    DashboardComponent,
    QueuesComponent
  ],
  imports: [
    BrowserModule,
    CommonModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
