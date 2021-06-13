import { Component, OnInit, Output } from '@angular/core';
import { Router } from '@angular/router';
import { LoginDataService } from '../services/login-data.service';
import { ClientService } from '../services/client.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-main-admin',
  templateUrl: './main-admin.component.html',
  styleUrls: ['./main-admin.component.css']
})
export class MainAdminComponent implements OnInit {

  id: any;
  subscription: Subscription = new Subscription();
  mainMenuClicked = false;
  constructor(private _data: LoginDataService, private client: ClientService, public router: Router) { }

  ngOnInit(): void {
    this.subscription = this._data.currentID.subscribe(id => this.id = id);
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  /**
   * Metodo para salir de la sesion
   */
  exit(): void{
    // this.cookieService.deleteAll();
    this.router.navigate(['']);
  }

}
