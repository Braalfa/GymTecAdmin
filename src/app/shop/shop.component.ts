import { HttpErrorResponse } from '@angular/common/http';
import { Component, Input, OnInit, ViewChild } from '@angular/core';
import * as XLSX from 'xlsx'
import { FailDialogComponent } from '../fail-dialog/fail-dialog.component';
import { Dispositivo_Distribuidor } from '../models/Dispositivo_Distribuidor';
import { Distribuidor_Tipo } from '../models/Distribuidor_Tipo';
import { Dispositivo, Distribuidor, DistribuidorUbicacion } from '../models/Models';
import { ClientService } from '../services/client.service';

@Component({
  selector: 'app-shop',
  templateUrl: './shop.component.html',
  styleUrls: ['./shop.component.css']
})
export class ShopComponent implements OnInit {

  public distributorArray:Distribuidor[] = [];
  public data:any[][] = [];
  public shopDevices:Dispositivo_Distribuidor[] = [];
  public typeQuantity:Distribuidor_Tipo[] = [];
  errorMsg: string ='';
  errorMsgHeader: string='';
  @ViewChild(FailDialogComponent) failDialogComponent!: FailDialogComponent;


  constructor(private client: ClientService) { }

  ngOnInit(): void {
    this.client.getOnlineShop().subscribe(data => this.shopDevices = data);
    this.client.getDistribuidorTipo().subscribe(data => this.typeQuantity = data);
    this.client.getDistributors().subscribe(data => this.distributorArray = data)
  }

  onFileChange(evt: any){
    const target: DataTransfer = <DataTransfer>(evt.target);

    if (target.files.length !== 1) throw new Error("Solo se permite cargar un archivo");

    const reader: FileReader = new FileReader();
    reader.onload = (e: any)=>{
      const bstr: string = e.target.result;
      const wb: XLSX.WorkBook = XLSX.read(bstr, {type: 'binary'});
      const wsname: string = wb.SheetNames[0];
      const ws: XLSX.WorkSheet = wb.Sheets[wsname];
      //console.log(ws);
      this.data = (XLSX.utils.sheet_to_json(ws, {header: 1}));
      console.log(this.data)
      for(let linea of this.data){
        if(linea.length != 0){
          let currentDevice = new Dispositivo();
          let currentDistributor = new Distribuidor();

          currentDevice.numeroserie = linea[0];
          currentDevice.nombre = linea[1];
          currentDevice.nombretipodispositivo = linea[2];
          currentDevice.marca = linea[3];
          currentDevice.consumoelectrico = linea[4];
          currentDevice.precio = linea[5]
          currentDevice.cedulajuridicadistribuidor = linea[7];
          currentDistributor.cedulajuridica = linea[7];
          currentDistributor.nombre = linea[6];
          

          this.client.updateDistributor(currentDistributor).subscribe(
            data => console.log("Actualizado distribuidor"), 
            error => this.handleError(error)
          )
          this.client.updateDevice(currentDevice).subscribe(
            data => console.log("Actualizado dispositivo"), 
            error => this.handleError(error)
          )
        }
        
      }
    };    
    if (this.errorMsg != ''){
      this.failDialogComponent.openModal();
    }
    reader.readAsBinaryString(target.files[0]);

  }

  handleError(errorResponse: HttpErrorResponse): void {
    console.log(errorResponse.status);
    switch (errorResponse.status) {
      case 409:
        this.errorMsg = 'Registros con identificadores duplicados';
        break;
      case 500:
        this.errorMsg = 'Uno de los tipos especificados no existe';
        break;
      case 0:
        this.errorMsg = 'No se pudo conectar con el Servidor';
        break;
      case 404:
        this.errorMsg = 'No se pudo encontrar lo buscado';
        break;
      default:
        this.errorMsg = 'No se pudo crear o actualizar uno de los registros';
        break;
    }
  }
}
