import { Component, Input, OnInit } from '@angular/core';
import { Dispositivo_Region } from '../models/Dispositivo_Region';
import { Dispositivo_Usuario } from '../models/Dispositivo_Usuario';
import { ClientService } from '../services/client.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  
  public asociatedDevices:number=0;
  public averageDevicesPerUser:string='';
  public listedDevices:Dispositivo_Usuario[] = [];
  public devicesPerRegion:Dispositivo_Region[] = [];
  
  constructor(private client: ClientService) {
  }

  ngOnInit(): void {
    this.client.getListado().subscribe(data => this.listedDevices = data);
    this.client.getAsociatedDevices().subscribe(data => this.asociatedDevices = data.cantidad);
    this.client.getAverageDevicesPerUser().subscribe(data => this.averageDevicesPerUser = data.cantidad.toFixed(2));
    this.client.getDevicesPerRegion().subscribe(data => this.devicesPerRegion = data);
    console.log("aaaa")
  }


}
