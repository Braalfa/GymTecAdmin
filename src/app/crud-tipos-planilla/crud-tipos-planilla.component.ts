import {Component, OnInit, ViewChild} from '@angular/core';
import {TipoDispositivo} from "../models/Models";
import {SuccessDialogComponent} from "../success-dialog/success-dialog.component";
import {FailDialogComponent} from "../fail-dialog/fail-dialog.component";
import {ClientService} from "../services/client.service";
import {HttpErrorResponse} from "@angular/common/http";
import {Tipo_Planilla} from "../models/Tipo_Planilla";

@Component({
  selector: 'app-crud-tipos-planilla',
  templateUrl: './crud-tipos-planilla.component.html',
  styleUrls: ['./crud-tipos-planilla.component.css']
})
export class CrudTiposPlanillaComponent implements OnInit {

  descripciones = ["Mes", "Horas", "Clases"]
  tiposPlanilla: Tipo_Planilla[] = [];
  selectedPlanilla = new Tipo_Planilla();
  errorMsg: string ='';
  errorMsgHeader: string='Error';
  editing = false;
  @ViewChild(SuccessDialogComponent) successDialogComponent!: SuccessDialogComponent;
  @ViewChild(FailDialogComponent) failDialogComponent!: FailDialogComponent;


  constructor(private client: ClientService) { }

  ngOnInit(): void {
    this.update()
  }

  update(): void{
    this.client.getTiposPlanilla().subscribe(data=> this.tiposPlanilla = data, e=>this.handleError(e))
  }

  /**
   * @method addOrEditType
   * Método que se encarga de agregar o editar un tipo de dispositivo
   */
  addOrEditType(form: HTMLFormElement): void{
    this.client.putTipoPlanilla(this.selectedPlanilla)
      .subscribe(sucess=>{
        this.update()
        this.selectedPlanilla = new Tipo_Planilla();
        this.editing = false;
        form.reset();
      }, e=>this.handleError(e))
  }

  /**
   * @method toEditType
   * Método que se encarga de seleccionar el tipo de dispositivo por editar
   */
  toEditType(type: Tipo_Planilla){
    this.selectedPlanilla = type;
    this.editing = true;
  }

  /**
   * @method deleteType
   * Método que se encarga de eliminar un tipo de dispositivo
   */
  deleteType(form: HTMLFormElement){
    if(confirm("¿Está seguro de realizar esta acción?")){
      this.client.deleteTipoPlanilla(this.selectedPlanilla.Id)
        .subscribe(success=>{
          this.update()
          this.selectedPlanilla = new Tipo_Planilla();
          this.editing = false;
          form.reset();
        }, e=>this.handleError(e))
    }
  }

  cancel(form: HTMLFormElement){
    this.selectedPlanilla = new Tipo_Planilla();
    this.editing = false;
    form.reset();
  }

  handleError(errorResponse: HttpErrorResponse): void {
    console.log(errorResponse);
    this.errorMsg = 'No se pudo realizar la accion';
    this.failDialogComponent.openModal();
  }
}
