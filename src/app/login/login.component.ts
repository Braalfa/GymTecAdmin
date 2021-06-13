import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { Router } from '@angular/router';
import { LoginDataService } from '../services/login-data.service';
import { ClientService } from '../services/client.service';
import { Administrador } from '../models/Models';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})

/**
 * Componente que muestra la pagina de inicio
 */
export class LoginComponent implements OnInit{

  userModel:{id:string,contra:string}={id:'',contra:''};
  usersData: any;
  //subscription: Subscription;
  loginError = false;

  /**
   * Constructor del componente
   * @param clientService Servicio http
   * @param _data Servicio de manejo de datos de sesion
   * @param router Router de navegacion
   */

  constructor(private clientService: ClientService,
              private _data: LoginDataService,
              private router: Router) { }

  ngOnInit(): void {
    this.clientService.getAdmins().subscribe(
      data => {this.usersData = data; return data},
      error => console.log(error)
    );
  }

  /**
   * Metodo para verificar si las credenciales estan correctas y acceder a la pagina adecuada
   */
   onSubmit(): void {
    //this.clientService.postMessage('Iniciando Sesion').subscribe(
      //data => console.log(data),
    //);
    /* let userData = {ok: false};
    this.usersData.forEach((user: any) => {
      if (this.userModel.correo === user.correo
        && this.userModel.contrasena === user.contrasena){
        userData = {ok: true};
      }
    });

    if (!userData.ok){
      this.loginError = true;
    }else{
      this.router.navigate(['/principal']);
    } */
    this.clientService.login(this.userModel.id, this.userModel.contra).subscribe(data=>{
      this.router.navigate(['/principal']);
    },err=>{
      console.log(err);
    })

  }

  /**
   * Metodo para cerrar el mensaje de error
   */
   closeError(): void {
    this.loginError = false;
  }

  /**
   * Metodo llamado al destruir el componente
   */
  ngOnDestroy(): void {
  }


}
