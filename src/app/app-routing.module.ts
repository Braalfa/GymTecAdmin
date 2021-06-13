import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CrudDevicesComponent } from './crud-devices/crud-devices.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { LoginComponent } from './login/login.component';
import { MainAdminComponent } from './main-admin/main-admin.component';
import { ShopComponent } from './shop/shop.component';
import {CrudTiposPlanillaComponent} from "./crud-tipos-planilla/crud-tipos-planilla.component";
import {CrudEmpleadoComponent} from "./crud-empleado/crud-empleado.component";
import {GeneracionPlanillaComponent} from "./generacion-planilla/generacion-planilla.component";
import { CrudTiposEquipoComponent } from './crud-tipos-equipo/crud-tipos-equipo.component';
import { CrudServiciosComponent } from './crud-servicios/crud-servicios.component';
import { CrudInventarioComponent } from './crud-inventario/crud-inventario.component';
import { CrudProductosComponent } from './crud-productos/crud-productos.component';
import { CrudSucursalComponent } from './crud-sucursal/crud-sucursal.component';
import { CrudSpaComponent } from './crud-spa/crud-spa.component';
import { CrudPuestosComponent } from './crud-puestos/crud-puestos.component';
import { CalendarioComponent } from './calendario/calendario.component';
import { CopiarSucursalComponent } from './copiar-sucursal/copiar-sucursal.component';

const routes: Routes = [
  { path: '', component: LoginComponent},
  { path: 'principal', component: MainAdminComponent,
    children:[
      {
        path: '',
        redirectTo: 'dashboard',
        pathMatch: 'full'
      },
      {
        path: 'dashboard',
        component: DashboardComponent
      },
      {
        path: 'sucursales',
        component: CrudSucursalComponent
      },
      {
        path: 'servicios',
        component: CrudServiciosComponent
      },
      {
        path: 'tiposequipo',
        component: CrudTiposEquipoComponent
      },
      {
        path: 'inventario',
        component: CrudInventarioComponent
      },
      {
        path: 'productos',
        component: CrudProductosComponent
      },
      {
        path: 'shop',
        component: ShopComponent
      },
      {
        path: 'tiposplanilla',
        component: CrudTiposPlanillaComponent
      },
      {
        path: 'empleados',
        component: CrudEmpleadoComponent
      },
      {
        path: 'generacionplanilla',
        component: GeneracionPlanillaComponent
      },
      {
        path:'spas',
        component: CrudSpaComponent
      },{
        path:'puestos',
        component:CrudPuestosComponent
      },
      {
        path:'calendario',
        component: CalendarioComponent
      },
      {
        path:'copiarsucursal',
        component: CopiarSucursalComponent
      }
    ]
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
export const routingComponents = [
  LoginComponent,
  MainAdminComponent,
  CrudDevicesComponent,
  CrudTiposEquipoComponent,
  ShopComponent,
  DashboardComponent
];
