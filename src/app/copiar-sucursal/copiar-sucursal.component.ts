import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit, ViewChild } from '@angular/core';
import { FailDialogComponent } from '../fail-dialog/fail-dialog.component';
import { CopiarSucursal } from '../models/CopiarSucursal';
import { Sucursal } from '../models/Sucursal';
import { ClientService } from '../services/client.service';
import { SuccessDialogComponent } from '../success-dialog/success-dialog.component';

@Component({
  selector: 'app-copiar-sucursal',
  templateUrl: './copiar-sucursal.component.html',
  styleUrls: ['./copiar-sucursal.component.css']
})
export class CopiarSucursalComponent implements OnInit {

  @ViewChild(SuccessDialogComponent) successDialogComponent!: SuccessDialogComponent;
  @ViewChild(FailDialogComponent) failDialogComponent!: FailDialogComponent;
  errorMsg: string ='';
  errorMsgHeader: string='';
  editing = false;
  sucursales:Sucursal[] = [];
  newSucursal:Sucursal = new Sucursal();
  //sucursalPorCopiar:Sucursal = new Sucursal();
  sucursalPorCopiar:string='';
  model=1;

  constructor(private client: ClientService) { }

  ngOnInit(): void {
    this.client.getSucursales().subscribe(data=>{
      this.sucursales = data as Sucursal[];
    })
  }

  update(): void{
    this.client.getSucursales().subscribe(data=> this.sucursales = data, e=>this.handleError(e))
  }
  /**
   * @method addOrEdit
   * Método que se encarga de agregar o editar un tipo de dispositivo
   */
  addOrEdit(form: HTMLFormElement): void{
    /*this.client.putTiposEquipo(this.newSucursal, sucursalPorCopiar)
      .subscribe(sucess=>{
        this.update()
        this.newtipo_equipo = new BasicModel();
        this.editing = false;
        form.reset();
      }, e=>this.handleError(e))*/
  }

  cancel(form: HTMLFormElement){
    this.newSucursal = new Sucursal();
    this.editing = false;
    form.reset();
  }

  copy(){
    console.log("Copiando " + this.sucursalPorCopiar + " en " + this.newSucursal.Nombre)
    var copy = new CopiarSucursal()
    copy.Nombre = this.newSucursal.Nombre
    copy.Distrito = this.newSucursal.Distrito
    copy.Canton = this.newSucursal.Canton
    copy.Provincia = this.newSucursal.Provincia
    copy.Horario = this.newSucursal.Horario
    copy.Capacidad = this.newSucursal.Capacidad
    copy.CedulaAdministrador = this.newSucursal.CedulaAdministrador
    copy.SucursalPorCopiar = this.sucursalPorCopiar
    this.client.copiarSucursal(copy).subscribe(sucess=> console.log('Copiada'), e=>this.handleError(e));
    this.update()
    this.newSucursal = new Sucursal();
    this.sucursalPorCopiar='';
  }

  handleError(errorResponse: HttpErrorResponse): void {
    console.log(errorResponse.status);
    switch (errorResponse.status) {
      case 409:
        this.errorMsg = 'Ya se encuentra registrado un tipo de dispositivo con ese nombre';
        break;
      case 500:
        this.errorMsgHeader = 'No se puede eliminar este tipo de dispositivo'
        this.errorMsg = 'Ya existen dispositivos que pertenecen a él';
        break;
      case 0:
        this.errorMsg = 'No se pudo conectar con el Servidor';
        break;
      case 404:
        this.errorMsg = 'No se pudo encontrar lo buscado';
        break;
      default:
        this.errorMsg = errorResponse.error;
        break;
    }
    this.failDialogComponent.openModal();
  }
}