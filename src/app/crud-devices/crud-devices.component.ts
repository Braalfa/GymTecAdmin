import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { Dispositivo, TipoDispositivo } from '../models/Models';
import { ClientService } from '../services/client.service';
import {SuccessDialogComponent} from '../success-dialog/success-dialog.component';
import {FailDialogComponent} from '../fail-dialog/fail-dialog.component';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-crud-devices',
  templateUrl: './crud-devices.component.html',
  styleUrls: ['./crud-devices.component.css']
})

/**
 * @class CrudDevicesComponent
 * Clase que maneja la visualización, creación, edición y eliminación 
 * de dispositivos
 */
export class CrudDevicesComponent implements OnInit {

  public typesArray: TipoDispositivo[] = [];
  public deviceArray: Dispositivo[] = []; 
  selectedDevice = new Dispositivo();
  errorMsg: string ='';
  errorMsgHeader: string='';
  @ViewChild(SuccessDialogComponent) successDialogComponent!: SuccessDialogComponent;
  @ViewChild(FailDialogComponent) failDialogComponent!: FailDialogComponent;

  constructor(private client: ClientService) { }

  ngOnInit(): void {
    this.client.getDevices().subscribe(data => this.deviceArray = data)
    this.client.getTypes().subscribe(data => this.typesArray = data);
  }

  /**
   * @method addOrEditDevice
   * Método que se encarga de agregar o editar un dispositivo
   */
  addOrEditDevice(): void{ //hacer un post
    this.client.updateDevice(this.selectedDevice).subscribe( //mandarle el json con la info del form
      data => {console.log("Operación exitosa")
                this.updateDeviceList()
      }, 
      error => this.handleError(error)
    )

    this.selectedDevice = new Dispositivo();
  }

  /**
   * @method toEditDevice
   * Método que se encarga de seleccionar el dispositivo por editar
   */
  toEditDevice(device: Dispositivo){
    this.selectedDevice = device;
  }

  /**
   * @method deleteDevice
   * Método que se encarga de eliminar un dispositivo
   */
  deleteDevice(){
    if(confirm("¿Está seguro de realizar esta acción?")){
      console.log(this.selectedDevice)

      this.client.deleteDevice(this.selectedDevice.numeroserie).subscribe(
        data => {console.log("Eliminado")
                  this.updateDeviceList()
        }, 
        error => this.handleError(error));

      

      this.selectedDevice = new Dispositivo();
    }
  }

  updateDeviceList(){
    this.client.getDevices().subscribe(
      data => this.deviceArray = data
    )
  }

  cancel(){
    this.selectedDevice = new Dispositivo();
  }

  handleError(errorResponse: HttpErrorResponse): void {
    console.log(errorResponse.status);
    switch (errorResponse.status) {
      case 409:
        this.errorMsg = 'Ya se encuentra registrado un dispositivo con ese número de serie';
        break;
      case 500:
        this.errorMsg = 'Campos con demasiados caracteres';
        break;
      case 0:
        this.errorMsg = 'No se pudo conectar con el Servidor';
        break;
      case 404:
        this.errorMsg = 'No se pudo realizar la acción';
        break;
      default:
        this.errorMsg = errorResponse.error;
        break;
    }
    this.failDialogComponent.openModal();
  }
  
}

/**
 * addOrEditDevice(): void{ //hacer un post
    if(!this.selectedDevice.correoelectronicousuario && this.selectedDevice.nombre){
      console.log("Posteado")
      this.client.postDevice(this.selectedDevice).subscribe( //mandarle el json con la info del form
        data => this.deviceArray.push(data), 
        error => this.handleError(error)
      )
    }else{
      console.log("Puteado")
      this.client.updateDevice(this.selectedDevice).subscribe( //mandarle el json con la info del form
        data => {this.deviceArray[this.deviceArray.findIndex(item => item.numeroserie == this.selectedDevice.numeroserie)] = data}, 
        error => this.handleError(error)
      )
    }
    this.selectedDevice = new Dispositivo();
  }
 */