import {Component, OnInit, ViewChild} from '@angular/core';
import {TipoDispositivo} from "../models/Models";
import {SuccessDialogComponent} from "../success-dialog/success-dialog.component";
import {FailDialogComponent} from "../fail-dialog/fail-dialog.component";
import {ClientService} from "../services/client.service";
import {HttpErrorResponse} from "@angular/common/http";
import {Tipo_Planilla} from "../models/Tipo_Planilla";

export class BasicModel {
  Id:string|undefined;
  Descripcion:string|undefined;
}

@Component({
  selector: 'app-crud-puestos',
  templateUrl: './crud-puestos.component.html',
  styleUrls: ['./crud-puestos.component.css']
})
export class CrudPuestosComponent implements OnInit {

  puestos: BasicModel[] = [];
  selectedPuesto = new BasicModel();
  errorMsg: string ='';
  errorMsgHeader: string='';
  editing = false;
  @ViewChild(SuccessDialogComponent) successDialogComponent!: SuccessDialogComponent;
  @ViewChild(FailDialogComponent) failDialogComponent!: FailDialogComponent;


  constructor(private client: ClientService) { }

  ngOnInit(): void {
    this.update();
  }

  update(): void{
    this.client.getPuestos().subscribe(data=>{
      this.puestos = data as BasicModel[];
    },err=>console.log());
  }

  /**
   * @method addOrEditType
   * Método que se encarga de agregar o editar un tipo de dispositivo
   */
  addOrEditType(form: HTMLFormElement): void{
    /* this.client.putTipoPlanilla(this.selectedPlanilla)
      .subscribe(sucess=>{
        this.update()
        this.selectedPlanilla = new Tipo_Planilla();
        this.editing = false;
        form.reset();
      }, e=>this.handleError(e)) */
      this.client.putPuesto(this.selectedPuesto).subscribe(data=>{
        this.selectedPuesto = new BasicModel();
        this.editing=false;
        form.reset();
        this.update();
      },err=>console.log(err));
  }

  /**
   * @method toEditType
   * Método que se encarga de seleccionar el tipo de dispositivo por editar
   */
  toEditType(type: BasicModel){
    this.selectedPuesto = type;
    this.editing = true;
  }

  /**
   * @method deleteType
   * Método que se encarga de eliminar un tipo de dispositivo
   */
  deleteType(form: HTMLFormElement){
    /* if(confirm("¿Está seguro de realizar esta acción?")){
      this.client.deleteTipoPlanilla(this.selectedPlanilla.Id)
        .subscribe(success=>{
          this.update()
          this.selectedPlanilla = new Tipo_Planilla();
          this.editing = false;
          form.reset();
        }, e=>this.handleError(e))
    } */
    this.client.deletePuesto(this.selectedPuesto).subscribe(data=>{
      this.selectedPuesto=new BasicModel();
      this.editing =false;
      form.reset();
      this.update();
    },err=>console.log(err));
  }

  cancel(form: HTMLFormElement){
    this.selectedPuesto = new BasicModel();
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
