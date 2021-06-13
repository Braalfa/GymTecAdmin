import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {Tipo_Planilla} from "../models/Tipo_Planilla";
import {SuccessDialogComponent} from "../success-dialog/success-dialog.component";
import {FailDialogComponent} from "../fail-dialog/fail-dialog.component";
import {ClientService} from "../services/client.service";
import {HttpErrorResponse} from "@angular/common/http";
import {Empleado} from "../models/Empleado";
import {Form} from "@angular/forms";
import {Sucursal} from "../models/Sucursal";

@Component({
  selector: 'app-crud-empleado',
  templateUrl: './crud-empleado.component.html',
  styleUrls: ['./crud-empleado.component.css']
})
export class CrudEmpleadoComponent implements OnInit {
  empleados: Empleado[] =[]
  tiposPlanilla: Tipo_Planilla[] = [];
  sucursales: Sucursal[] = [];
  puestos = [{Descripcion: "Manager", Id: 1}];
  selectedEmpleado = new Empleado();
  errorMsg: string ='';
  errorMsgHeader: string='Error';
  editing = false;
  @ViewChild(SuccessDialogComponent) successDialogComponent!: SuccessDialogComponent;
  @ViewChild(FailDialogComponent) failDialogComponent!: FailDialogComponent;

  constructor(private client: ClientService) { }

  ngOnInit(): void {
    this.client.getTiposPlanilla().subscribe(d=>this.tiposPlanilla=d, e=>this.handleError(e))
    this.client.getSucursales().subscribe(data=>this.sucursales = data, e=>this.handleError(e))
    this.update()
  }

  update(): void{
    this.client.getEmpleados().subscribe(data=>{this.empleados = data; console.log(data)},
                                        e=>this.handleError(e))
  }

  /**
   * @method addOrEditType
   * Método que se encarga de agregar o editar un tipo de dispositivo
   */
  addOrEditType(form: HTMLFormElement): void{
    this.client.putEmpleado(this.selectedEmpleado).subscribe(s=>{
      console.log("success?")
      this.update();
      this.selectedEmpleado = new Empleado();
      this.editing = false;
      form.reset();
    },e=>this.handleError(e))
  }

  /**
   * @method toEditType
   * Método que se encarga de seleccionar el tipo de dispositivo por editar
   */
  toEditType(empl: Empleado){
    this.selectedEmpleado = empl;
    this.editing = true;
  }

  /**
   * @method deleteType
   * Método que se encarga de eliminar un tipo de dispositivo
   */
  deleteType(form: HTMLFormElement){
    if(confirm("¿Está seguro de realizar esta acción?")){
      if(this.selectedEmpleado.NumeroCedula) {
        this.client.deleteEmpleado(this.selectedEmpleado.NumeroCedula).subscribe(
          d => {
            this.update();
            this.selectedEmpleado = new Empleado();
            this.editing = false;
            form.reset();
          }, e => this.handleError(e)
        )
      }
    }
  }

  cancel(form: HTMLFormElement){
    this.selectedEmpleado = new Empleado();
    this.editing = false;
    form.reset();
  }

  handleError(errorResponse: HttpErrorResponse): void {
    console.log(errorResponse);
    this.errorMsg = 'No se pudo realizar la accion';
    this.failDialogComponent.openModal();
  }
}
