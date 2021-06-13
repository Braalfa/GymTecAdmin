import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit, ViewChild } from '@angular/core';
import { FailDialogComponent } from '../fail-dialog/fail-dialog.component';
import { BasicModel } from '../models/BasicModel';
import { Clase } from '../models/Clase';
import { Sucursal } from '../models/Sucursal';
import { ClientService } from '../services/client.service';
import { SuccessDialogComponent } from '../success-dialog/success-dialog.component';

@Component({
  selector: 'app-crud-sucursal',
  templateUrl: './crud-sucursal.component.html',
  styleUrls: ['./crud-sucursal.component.css']
})
export class CrudSucursalComponent implements OnInit {
  @ViewChild(SuccessDialogComponent) successDialogComponent!: SuccessDialogComponent;
  @ViewChild(FailDialogComponent) failDialogComponent!: FailDialogComponent;
  errorMsg: string ='';
  errorMsgHeader: string='';
  editing = false;
  editingCla=false;
  sucursales:Sucursal[] = [];
  clases:Clase[] =[];
  selectedClase:Clase = new Clase();
  selectedSucursal:Sucursal = new Sucursal();


  constructor(private client: ClientService) { }

  ngOnInit(): void {
    // this.client.getTypes().subscribe(data => this.typesArray = data);
    this.client.getSucursales().subscribe(data=>{
      this.sucursales = data as Sucursal[];
    });
    this.client.getClases().subscribe(data=>this.clases=data as Clase[], e=>this.handleError(e));
  }

  update(){
    this.client.getClases().subscribe(data=>this.clases=data as Clase[], e=>this.handleError(e));
    this.client.getSucursales().subscribe(data=>this.sucursales=data as Sucursal[],e=>this.handleError(e));;
  }

  addOrEditCla(form:HTMLFormElement){
    this.selectedClase.Imagen='https://upload.wikimedia.org/wikipedia/commons/d/d7/H%C3%A0bit_Saludable.jpg';
    this.client.updateClass(this.selectedClase).subscribe(data=>{
      this.selectedClase = new Clase();
      this.update();
      form.reset();
      this.editing = false;
    },e=>this.handleError(e));
  }

  /**
   * @method addOrEdit
   * Método que se encarga de agregar o editar un tipo de dispositivo
   */
  addOrEdit(form: HTMLFormElement): void{
    //Agregar
    /*
        this.client.updateType(this.selectedPlanilla).subscribe(
            data => {this.typesArray[this.typesArray.findIndex(item => item.nombre == this.selectedType.nombre)] = data},
            error => this.handleError(error)
        )
    */
    //console.log(this.selectedEmpleado)
    //this.selectedEmpleado = new Empleado();
    if(this.selectedSucursal.FechaApertura == null){ // La unica manera de que este campo sea null es si es una nueva sucursal, entonces..
      this.selectedSucursal.FechaApertura = '2000-01-01T00:00:00'; // Fecha generica a la que se le va a caer encima
    }
    this.client.putSucursal(JSON.parse(JSON.stringify(this.selectedSucursal))).subscribe(
      (data)=>{
        const nSucursal = data as Sucursal;
        console.log(nSucursal);
        const foundIndex = this.sucursales.findIndex(item=>item.Nombre==nSucursal.Nombre)
        if(foundIndex<-1){
          this.sucursales.push(nSucursal);
        }else{
          this.sucursales[foundIndex] = nSucursal;
        }
        form.reset();
        this.update
      }, err=>{console.log(err)}
    )
    this.editing = false;
    //form.reset();
  }

  toEditCla(toedit:Clase){
    this.selectedClase = toedit;
    this.editingCla=true;
  }

  /**
   * @method toEdit
   * Método que se encarga de seleccionar el tipo de dispositivo por editar
   */
  toEdit(toedit: Sucursal){
    this.selectedSucursal = toedit;
    this.editing = true;
  }

  deleteCla(form:HTMLFormElement){
    if(confirm("¿Está seguro de realizar esta accion?")){
      this.client.deleteClase(this.selectedClase).subscribe(data=>{
        this.update();
        form.reset();
        this.editingCla = false;
        this.selectedClase = new Clase();
      },e=>this.handleError(e));
    }
  }

  /**
   * @method delete
   * Método que se encarga de eliminar un tipo de dispositivo
   */
  delete(form: HTMLFormElement){
    if(confirm("¿Está seguro de realizar esta acción?")){
      this.client.deleteSucursal(this.selectedSucursal).subscribe(
        data=>{
          this.sucursales = this.sucursales.filter(y=>y!=this.selectedSucursal);
          this.update();
        },
        err=>{
          console.log(err);
        }
      )
      // this.client.deleteType(this.selectedPlanilla.nombre).subscribe(
      //   //data => {this.typesArray = this.typesArray.filter(y => y != this.selectedType);
      //   //},
      //   data => console.log("Eliminado"),
      //   error => this.handleError(error)
      // );
      // this.client.getTypes().subscribe(
      //   data => this.tiposPlanilla = data
      // )
      //this.selectedEmpleado = new Empleado();
      this.editing = false;
      form.reset();
    }
  }

  cancelCla(form:HTMLFormElement){
    this.editingCla=false;
    this.selectedClase = new Clase();
    form.reset();
  }

  cancel(form: HTMLFormElement){
    //this.selectedEmpleado = new Empleado();
    this.editing = false;
    form.reset();
  }

  handleError(errorResponse: HttpErrorResponse): void {
    console.log(errorResponse.status);
    console.log(errorResponse);
    switch (errorResponse.status) {
      case 409:
        this.errorMsg = 'Ya se encuentra registrado una sucursal con este nombre';
        break;
      case 0:
        this.errorMsg = 'No se pudo conectar con el Servidor';
        break;
      case 404:
        this.errorMsg = 'No se pudo encontrar lo buscado';
        break;
      default:
        this.errorMsg = errorResponse.error.Message;
        break;
    }
    this.failDialogComponent.openModal();
  }
}