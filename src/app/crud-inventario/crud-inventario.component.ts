import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit, ViewChild } from '@angular/core';
import { FailDialogComponent } from '../fail-dialog/fail-dialog.component';
import { BasicModel } from '../models/BasicModel';
import { Equipo } from '../models/Equipo';
import { Sucursal } from '../models/Sucursal';
import { ClientService } from '../services/client.service';
import { SuccessDialogComponent } from '../success-dialog/success-dialog.component';

@Component({
  selector: 'app-crud-inventario',
  templateUrl: './crud-inventario.component.html',
  styleUrls: ['./crud-inventario.component.css']
})
export class CrudInventarioComponent implements OnInit {
  @ViewChild(SuccessDialogComponent) successDialogComponent!: SuccessDialogComponent;
  @ViewChild(FailDialogComponent) failDialogComponent!: FailDialogComponent;
  errorMsg: string ='';
  errorMsgHeader: string='';
  editing = false;
  sucursales:Sucursal[] = [];
  tipos_equipo:BasicModel[] = [];
  inventario:Equipo[] = [];
  allInventario:Equipo[] = [];
  selectedequipo:Equipo = new Equipo();

  constructor(private client: ClientService) { }

  ngOnInit(): void {
    this.update()
  }

  tipoEquipo(id:number|undefined){
    return this.tipos_equipo.find(e=>e.Identificador==id)?.Descripcion
  }

  update(): void{
    this.client.getTiposEquipo().subscribe(data=> this.tipos_equipo = data, e=>this.handleError(e))
    this.client.getEquipos().subscribe(data=> {
      this.inventario = data;
      this.allInventario = data;
    }, e=>this.handleError(e))
    this.client.getSucursales().subscribe(data=>this.sucursales = data, e=>this.handleError(e))
  }

  changeSuc(){
    console.log('a')
    if(this.selectedequipo.NombreSucursal!='undefined'){
      this.inventario = this.allInventario.filter(e=>e.NombreSucursal==this.selectedequipo.NombreSucursal);
    }else {
      this.inventario = this.allInventario;
    }
  }

  /**
   * @method addOrEdit
   * Método que se encarga de agregar o editar un elemento
   */
  addOrEdit(form: HTMLFormElement): void{
    if(this.selectedequipo.NombreSucursal=='undefined'){
      this.selectedequipo.NombreSucursal = null;
    }
    this.client.putEquipo(this.selectedequipo)
      .subscribe(sucess=>{
        this.update()
        this.selectedequipo = new Equipo();
        this.editing = false;
        form.reset();
      }, e=>this.handleError(e))
  }

  /**
   * @method toEdit
   * Método que se encarga de seleccionar el elemento por editar
   */
  toEdit(toedit: Equipo){
    console.log(toedit)
    this.selectedequipo = toedit;
    this.editing = true;
  }

  /**
   * @method delete
   * Método que se encarga de eliminar un elemento
   */
  delete(form: HTMLFormElement){
    if(confirm("¿Está seguro de realizar esta acción?")){
      this.client.deleteEquipo(this.selectedequipo.NumeroSerie!)
        .subscribe(success=>{
          this.update()
          this.selectedequipo = new Equipo();
          this.editing = false;
          form.reset();
        }, e=>this.handleError(e))
    }
  }

  cancel(form: HTMLFormElement){
    this.selectedequipo = new Equipo();
    this.editing = false;
    form.reset();
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