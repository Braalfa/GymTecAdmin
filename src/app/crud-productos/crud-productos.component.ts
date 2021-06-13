import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit, ViewChild } from '@angular/core';
import { FailDialogComponent } from '../fail-dialog/fail-dialog.component';
import { Producto } from '../models/Producto';
import { Sucursal } from '../models/Sucursal';
import { ClientService } from '../services/client.service';
import { SuccessDialogComponent } from '../success-dialog/success-dialog.component';

@Component({
  selector: 'app-crud-productos',
  templateUrl: './crud-productos.component.html',
  styleUrls: ['./crud-productos.component.css']
})
export class CrudProductosComponent implements OnInit {
  @ViewChild(SuccessDialogComponent) successDialogComponent!: SuccessDialogComponent;
  @ViewChild(FailDialogComponent) failDialogComponent!: FailDialogComponent;
  errorMsg: string ='';
  errorMsgHeader: string='';
  editing = false;
  productos:Producto[]=[];
  sucursales:Sucursal[]=[];
  selectedproducto:Producto = new Producto();
  allProductos:Producto[]=[];
  selectedSucursal: Sucursal = new Sucursal();
  selectedNombreSucursal:string|undefined = '';
  
  constructor(private client: ClientService) { }

  ngOnInit(): void {
    this.update()
  }

  update(): void{
    this.client.getProductos().subscribe(data=> {
      this.productos = data;
    }, e=>this.handleError(e))
    this.client.getSucursales().subscribe(data=>this.sucursales=data,e=>this.handleError(e))
  }

  /**
   * @method addOrEdit
   * Método que se encarga de agregar o editar un elemento
   */
  addOrEdit(form: HTMLFormElement): void{
    this.client.putProducto(this.selectedproducto)
      .subscribe(sucess=>{
        if(this.selectedNombreSucursal!=''){
          this.client.assignProducto(this.selectedproducto.CodigoBarras, this.selectedNombreSucursal).subscribe(data=>{
            this.update();
            this.selectedproducto = new Producto();
            this.editing = false;
            form.reset();
          },e=>this.handleError(e));
        }else{
          this.update();
          this.selectedproducto = new Producto();
          this.editing = false;
          form.reset();
        }
      }, e=>this.handleError(e))
  }

  toEditSuc(sucursal:Sucursal){
    this.selectedSucursal = sucursal;
    this.client.getProductosTienda(this.selectedSucursal).subscribe(data=>{
      this.productos = data as Producto[];
    });
    this.selectedNombreSucursal = this.selectedSucursal.Nombre;
  }

  cancelSuc(){
    this.selectedSucursal = new Sucursal();
    this.update();
  }

  /**
   * @method toEdit
   * Método que se encarga de seleccionar el elemento por editar
   */
  toEdit(toedit: Producto){
    console.log(toedit)
    this.selectedproducto = toedit;
    this.editing = true;
    if(this.selectedSucursal.Nombre){
      this.selectedNombreSucursal = this.selectedSucursal.Nombre;
    }
  }

  /**
   * @method delete
   * Método que se encarga de eliminar un elemento
   */
  delete(form: HTMLFormElement){
    if(confirm("¿Está seguro de realizar esta acción?")){

      if(this.selectedNombreSucursal){
        this.client.unassignProducto(this.selectedproducto.CodigoBarras,this.selectedNombreSucursal).subscribe(
          data=>{
            this.update();
            this.selectedproducto = new Producto();
            this.editing =false;
            form.reset();
            this.cancelSuc();
          },
          e=>this.handleError(e)
        )
        return;
      }

      this.client.deleteProducto(this.selectedproducto.CodigoBarras!)
        .subscribe(success=>{
          this.update()
          this.selectedproducto = new Producto();
          this.editing = false;
          form.reset();
        }, e=>this.handleError(e))
    }
  }

  cancel(form: HTMLFormElement){
    this.selectedproducto = new Producto();
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

