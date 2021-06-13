import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit, ViewChild } from '@angular/core';
import { FailDialogComponent } from '../fail-dialog/fail-dialog.component';
import { BasicModel } from '../models/BasicModel';
import { ClientService } from '../services/client.service';
import { SuccessDialogComponent } from '../success-dialog/success-dialog.component';

@Component({
  selector: 'app-crud-tipos-equipo',
  templateUrl: './crud-tipos-equipo.component.html',
  styleUrls: ['./crud-tipos-equipo.component.css']
})
export class CrudTiposEquipoComponent implements OnInit {
  @ViewChild(SuccessDialogComponent) successDialogComponent!: SuccessDialogComponent;
  @ViewChild(FailDialogComponent) failDialogComponent!: FailDialogComponent;
  errorMsg: string ='';
  errorMsgHeader: string='';
  editing = false;
  tipos_equipo:BasicModel[] = [];
  selectedtipo_equipo:BasicModel = new BasicModel();
  
  constructor(private client: ClientService) { }

  ngOnInit(): void {
    this.update()
  }

  update(): void{
    this.client.getTiposEquipo().subscribe(data=> this.tipos_equipo = data, e=>this.handleError(e))
  }

  /**
   * @method addOrEdit
   * Método que se encarga de agregar o editar un elemento
   */
  addOrEdit(form: HTMLFormElement): void{
    this.client.putTiposEquipo(this.selectedtipo_equipo)
      .subscribe(sucess=>{
        this.update()
        this.selectedtipo_equipo = new BasicModel();
        this.editing = false;
        form.reset();
      }, e=>this.handleError(e))
  }

  /**
   * @method toEdit
   * Método que se encarga de seleccionar el elemento por editar
   */
  toEdit(toedit: BasicModel){
    console.log(toedit)
    this.selectedtipo_equipo = toedit;
    this.editing = true;
  }

  /**
   * @method delete
   * Método que se encarga de eliminar un elemento
   */
  delete(form: HTMLFormElement){
    if(confirm("¿Está seguro de realizar esta acción?")){
      this.client.deleteTiposEquipo(this.selectedtipo_equipo.Identificador!)
        .subscribe(success=>{
          this.update()
          this.selectedtipo_equipo = new BasicModel();
          this.editing = false;
          form.reset();
        }, e=>this.handleError(e))
    }
  }

  cancel(form: HTMLFormElement){
    this.selectedtipo_equipo = new BasicModel();
    this.editing = false;
    this.update();
    form.reset();
  }

  handleError(errorResponse: HttpErrorResponse): void {
    console.log(errorResponse.status);
    switch (errorResponse.status) {
      case 409:
        this.errorMsg = 'Ya se encuentra registrado un elemento con ese nombre';
        break;
      case 500:
        this.errorMsgHeader = 'No se puede eliminar este elemento'
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

