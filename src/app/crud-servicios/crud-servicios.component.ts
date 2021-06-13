import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit, ViewChild } from '@angular/core';
import { FailDialogComponent } from '../fail-dialog/fail-dialog.component';
import { BasicModel } from '../models/BasicModel';
import { ClientService } from '../services/client.service';
import { SuccessDialogComponent } from '../success-dialog/success-dialog.component';

@Component({
  selector: 'app-crud-servicios',
  templateUrl: './crud-servicios.component.html',
  styleUrls: ['./crud-servicios.component.css']
})
export class CrudServiciosComponent implements OnInit {
  @ViewChild(SuccessDialogComponent) successDialogComponent!: SuccessDialogComponent;
  @ViewChild(FailDialogComponent) failDialogComponent!: FailDialogComponent;
  errorMsg: string ='';
  errorMsgHeader: string='';
  editing = false;
  servicios:BasicModel[] = [];
  selectedservicio:BasicModel = new BasicModel();

  constructor(private client: ClientService) { }

  ngOnInit(): void {
    this.update()
  }

  update(): void{
    this.client.getServicios().subscribe(data=> this.servicios = data, e=>this.handleError(e))
  }

  /**
   * @method addOrEdit
   * Método que se encarga de agregar o editar un elemento
   */
  addOrEdit(form: HTMLFormElement): void{
    this.client.putServicio(this.selectedservicio)
      .subscribe(sucess=>{
        this.update()
        this.selectedservicio = new BasicModel();
        this.editing = false;
        form.reset();
      }, e=>this.handleError(e))
  }

  /**
   * @method toEdit
   * Método que se encarga de seleccionar el elemento por editar
   */
  toEdit(toedit: BasicModel){
    this.selectedservicio = toedit;
    this.editing = true;
  }

  /**
   * @method delete
   * Método que se encarga de eliminar un elemento
   */
  delete(form: HTMLFormElement){
    if(confirm("¿Está seguro de realizar esta acción?")){
      this.client.deleteServicio(this.selectedservicio.Identificador!)
        .subscribe(success=>{
          this.update()
          this.selectedservicio = new BasicModel();
          this.editing = false;
          form.reset();
        }, e=>this.handleError(e))
    }
  }

  cancel(form: HTMLFormElement){
    this.selectedservicio = new BasicModel();
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