import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit, ViewChild } from '@angular/core';
import { FailDialogComponent } from '../fail-dialog/fail-dialog.component';
import { BasicModel } from '../models/BasicModel';
import { Spa } from '../models/Spa';
import { Sucursal } from '../models/Sucursal';
import { ClientService } from '../services/client.service';
import { SuccessDialogComponent } from '../success-dialog/success-dialog.component';

class Tratamiento{
  Id:number|undefined;
  Nombre:string|undefined;
}

@Component({
  selector: 'app-crud-spa',
  templateUrl: './crud-spa.component.html',
  styleUrls: ['./crud-spa.component.css']
})
export class CrudSpaComponent implements OnInit {
  @ViewChild(SuccessDialogComponent) successDialogComponent!: SuccessDialogComponent;
  @ViewChild(FailDialogComponent) failDialogComponent!: FailDialogComponent;
  errorMsg: string ='';
  errorMsgHeader: string='';
  editing = false;
  editingTra=false;
  spas:Spa[] = [];
  spasDisplay:Spa[]=[];
  selectedSpa:Spa = new Spa();
  sucursales:string[]=[];
  allTratamientos:Tratamiento[]=[];
  tratamientos:Tratamiento[]=[];
  selectedTratamiento:Tratamiento=new Tratamiento();
  selectedTratamientoSucursal:string='';
  selectedTratamientoNombreSpa:string="";


  constructor(private client: ClientService) { }

  ngOnInit(): void {
    // this.client.getTypes().subscribe(data => this.typesArray = data);
    this.client.getSpas().subscribe(data=>{
      this.spas = data as Spa[];
    },err=>console.log(err));

    this.client.getSucursales().subscribe(data=>{
      const fetchedSucursales = data as Sucursal[];
      fetchedSucursales.forEach(e => {
        e.Nombre!=undefined?this.sucursales.push(e.Nombre):'';
      });
    }, err=>console.log(err));

    this.client.getTratamientos().subscribe(data=>{
      this.allTratamientos = data as Tratamiento[];
      this.tratamientos = this.allTratamientos;
      console.log(this.tratamientos);
    }, (err:any)=>console.log(err));
  }

  spasFilter(){
    this.spasDisplay= this.spas.filter(e=>e.NombreSucursal==this.selectedTratamientoSucursal);
  }

  addOrEditTra(form:HTMLFormElement){
    if(this.editingTra){ // Si se esta editando un tratamiento
      // Actualizo el nombre del tratamiento (en caso de que se quisiera actualizar)
      this.client.putTratamiento(this.selectedTratamiento.Id, this.selectedTratamiento.Nombre).subscribe(data=>{
        // Asigno el tratamiento
        this.client.assignTratamiento(this.selectedTratamiento.Id,this.selectedTratamientoSucursal,this.selectedTratamientoNombreSpa).subscribe(data=>{
          this.selectedTratamiento = new Tratamiento();
          form.reset();
        },err=>{
          // Un error esperado es que el tratamiento ya esté asociado a un spa
          if(err.status==409){
            this.selectedTratamiento = new Tratamiento();
            form.reset();
          }else{
            console.log(err)}
          }
        ); 
      }, err=>console.log(err));
      
      
    }else{ // Si no se está editando ninguno o solo se está editando un spa...
      if(this.selectedTratamientoNombreSpa==''&&this.selectedTratamientoSucursal==''){ // Si no se especifica una ubicacion
        // Quiero unicamente crear un tratamiento sin asignarlo
        console.log(this.selectedTratamientoSucursal);
        this.client.postTratamiento(this.selectedTratamiento.Nombre).subscribe(data=>{
          const nuevoTratamiento = data as Tratamiento;
          this.allTratamientos.push(nuevoTratamiento);
          this.selectedTratamiento = new Tratamiento();
          form.reset();
        },err=>console.log(err));
      }else if(this.selectedTratamientoNombreSpa!=''){ // Si se especifica un spa
        // Quiero crear un tratamiento y despues asignarlo al spa correspondiente
        this.client.postTratamiento(this.selectedTratamiento.Nombre).subscribe(data=>{
          const nuevoTratamiento = data as Tratamiento;
          this.allTratamientos.push(nuevoTratamiento);
          this.client.assignTratamiento(nuevoTratamiento.Id,this.selectedTratamientoSucursal,this.selectedTratamientoNombreSpa).subscribe(data=>{
            this.selectedTratamiento = new Tratamiento();
            form.reset();
          },err=>console.log(err));
        },err=>console.log(err));
      }
      
    }
    this.editingTra=false;
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
    this.client.postSpa(JSON.parse(JSON.stringify(this.selectedSpa))).subscribe( // Los spas no se pueden actualizar
      (data)=>{
        const nSpa = data as Spa;
        
        const foundIndex = this.spas.findIndex(item=>item.Nombre==nSpa.Nombre)
        if(foundIndex<-1){
          this.spas.push(nSpa);
        }else{
          this.spas[foundIndex] = nSpa;
        }
        form.reset();
      }, err=>{console.log(err)}
    )
    this.editing = false;
    //form.reset();
  }

  toEditTra(toEdit:Tratamiento){
    this.selectedTratamiento = toEdit;
    this.editingTra=true;
  }

  /**
   * @method toEdit
   * Método que se encarga de seleccionar el tipo de dispositivo por editar
   */
  toEdit(toedit: Spa){
    this.selectedSpa = toedit;
    this.client.getTratamientosSpa(this.selectedSpa).subscribe(data=>{
      this.tratamientos = data as Tratamiento[];
      this.selectedTratamientoSucursal = this.selectedSpa.NombreSucursal as string;
      this.spasFilter();
      this.selectedTratamientoNombreSpa = this.selectedSpa.Nombre as string;
    },err=>console.log(err))
    this.editing = true;
  }

  deleteTra(form:HTMLFormElement){
    if(this.editing){ // Tengo seleccionado un spa?
      // Entonces desasigno
      this.client.unassignTratamiento(this.selectedTratamiento.Id, this.selectedTratamientoSucursal, this.selectedTratamientoNombreSpa).subscribe(data=>{
        this.cancelTra(form);
      },err=>console.log(err));

    }else{ // si no
      // Elimino el tratamiento
      this.client.deleteTratamiento(this.selectedTratamiento.Id).subscribe(data=>{
        this.allTratamientos = this.allTratamientos.filter(e=>e!=this.selectedTratamiento);
        this.cancelTra(form);
      },err=>console.log(err));
    }
  }

  /**
   * @method delete
   * Método que se encarga de eliminar un tipo de dispositivo
   */
  delete(form: HTMLFormElement){
    if(confirm("¿Está seguro de realizar esta acción?")){
      this.client.deleteSpa(this.selectedSpa).subscribe(
        data=>{
          this.spas = this.spas.filter(y=>y!=this.selectedSpa);
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
      this.cancel(form);
    }
  }

  cancelTra(form:HTMLFormElement){
    this.editingTra = false;
    this.selectedTratamiento = new Tratamiento();
    form.reset();
  }

  cancel(form: HTMLFormElement){
    //this.selectedEmpleado = new Empleado();
    this.editing = false;
    this.selectedSpa = new Spa();
    this.tratamientos = this.allTratamientos;
    this.selectedTratamiento = new Tratamiento();
    this.selectedTratamientoNombreSpa = '';
    this.selectedTratamientoSucursal = '';
    this.editingTra=false;
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