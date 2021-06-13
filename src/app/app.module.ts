import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule, routingComponents } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoginComponent } from './login/login.component';
import { FormsModule } from '@angular/forms';
import { MainAdminComponent } from './main-admin/main-admin.component';
import { ShopComponent } from './shop/shop.component';
import { CrudDevicesComponent } from './crud-devices/crud-devices.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { HttpClientModule } from '@angular/common/http';
import { FailDialogComponent } from './fail-dialog/fail-dialog.component';
import { SuccessDialogComponent } from './success-dialog/success-dialog.component';
import { ModalModule } from 'ngx-bootstrap/modal';
import { ClientService } from './services/client.service';
import {CrudTiposPlanillaComponent} from "./crud-tipos-planilla/crud-tipos-planilla.component";
import { CrudEmpleadoComponent } from './crud-empleado/crud-empleado.component';
import { GeneracionPlanillaComponent } from './generacion-planilla/generacion-planilla.component';
import {DevExtremeModule} from "devextreme-angular";
import {NgxPrintModule} from 'ngx-print';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { CrudTiposEquipoComponent } from './crud-tipos-equipo/crud-tipos-equipo.component';
import { CrudServiciosComponent } from './crud-servicios/crud-servicios.component';
import { CrudInventarioComponent } from './crud-inventario/crud-inventario.component';
import { CrudProductosComponent } from './crud-productos/crud-productos.component';
import { CalendarModule, DateAdapter } from 'angular-calendar';
import { adapterFactory } from 'angular-calendar/date-adapters/date-fns';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

// De material
import {MatSelectModule} from '@angular/material/select';
import { CrudSucursalComponent } from './crud-sucursal/crud-sucursal.component';
import { CrudSpaComponent } from './crud-spa/crud-spa.component';
import { CrudPuestosComponent } from './crud-puestos/crud-puestos.component';
import { CalendarioComponent } from './calendario/calendario.component';
import { CopiarSucursalComponent } from './copiar-sucursal/copiar-sucursal.component';

/**
 * Declaraciones y importaciones
 */
@NgModule({
  declarations: [
    AppComponent,
    routingComponents,
    LoginComponent,
    MainAdminComponent,
    ShopComponent,
    CrudDevicesComponent,
    DashboardComponent,
    FailDialogComponent,
    SuccessDialogComponent,
    CrudTiposPlanillaComponent,
    CrudEmpleadoComponent,
    GeneracionPlanillaComponent,
    CrudTiposEquipoComponent,
    CrudServiciosComponent,
    CrudInventarioComponent,
    CrudProductosComponent,
    CrudSucursalComponent,
    CrudSpaComponent,
    CalendarioComponent,
    CopiarSucursalComponent,
    CrudSpaComponent,
    CrudPuestosComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    HttpClientModule,
    ModalModule.forRoot(),
    DevExtremeModule,
    NgxPrintModule,
    NoopAnimationsModule,
    MatSelectModule,
    CalendarModule.forRoot({
      provide: DateAdapter,
      useFactory: adapterFactory,
    }),
    NgbModule
  ],
  providers: [ClientService],
  bootstrap: [AppComponent]
})
export class AppModule { }
