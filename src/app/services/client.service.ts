import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { Administrador, Dispositivo, Distribuidor, DistribuidorUbicacion, TipoDispositivo, Usuario } from '../models/Models';
import { Cantidad } from '../models/Cantidad';
import { Dispositivo_Usuario } from '../models/Dispositivo_Usuario';
import { Dispositivo_Region } from '../models/Dispositivo_Region';
import { Dispositivo_Distribuidor } from '../models/Dispositivo_Distribuidor';
import { Distribuidor_Tipo } from '../models/Distribuidor_Tipo';
import {Tipo_Planilla} from "../models/Tipo_Planilla";
import {Empleado} from "../models/Empleado";
import {Planilla} from "../models/Planilla";
import { BasicModel } from '../models/BasicModel';
import { Equipo } from '../models/Equipo';
import { Producto } from '../models/Producto';
import { Sucursal } from '../models/Sucursal';
import { Spa } from '../models/Spa';
import { Clase } from '../models/Clase';
import { CopiarSucursal } from '../models/CopiarSucursal';
import { CopiarClases } from '../models/CopiarClases';


@Injectable({
  providedIn: 'root'
})

/**
 * Servicio para conectarse con el servidor
 */
export class ClientService {

  url:string = 'https://localhost:44351/api/';

  deleteClase(clase:Clase){
    return this._http.delete(this.url+'Clase/'+clase.Identificador);
  }

  updateClass(clase:Clase){
    console.log(clase.Identificador)
    if(!clase.Identificador){
      clase.Identificador=-1;
    }
    return this._http.put(this.url+'Clase/'+clase.Identificador, clase);
  }

  /**
   * Metodo que devuelve todas las clases en la base de datos
   * @returns Observable
   */
  getClases(){
    return this._http.get(this.url+'Clase');
  }

  /**
   * Metodo que asigna un producto a la tienda de una sucursal
   * @param productoId Producto a desasignar
   * @param nombreSucursal Nombre de la sucursal donde se va a signas
   * @returns Observable
   */
  unassignProducto(productoId:any, nombreSucursal:any){
    return this._http.delete(this.url+'/PRODUCTOes/'+productoId+'/'+nombreSucursal+'/Tienda Default/unAssign',{})
  }

  /**
   * Metodo que asigna un producto a una sucursal
   * @param productoId Id del producto a agregar
   * @param nombreSucursal Nombre de la sucursal donde se agregara el producto
   * @returns Observable
   */
  assignProducto(productoId:any, nombreSucursal:any){
    return this._http.post(this.url+'/PRODUCTOes/'+productoId+'/'+nombreSucursal+'/Tienda Default/assignTo',{});
  }

  /**
   * Metodo que devuelve los productos asociados a una tienda
   * @param sucursal Sucursal a la cual se le agregan los productos
   * @returns Observable
   */
  getProductosTienda(sucursal:Sucursal){
    return this._http.get(this.url+'/PRODUCTOes/'+sucursal.Nombre+'/Tienda Default/assignedTo');
  }

  /**
   * Constructor del servicio
   * @param _http Cliente http
   */
  constructor(private _http: HttpClient) {
  }

  deletePuesto(puesto:any){
    return this._http.delete(this.url+'/Puesto/'+puesto.Id);
  }

  /**
   * Metodo que actualiza un puesto
   * @param puesto Puesto a actualizar
   * @returns Observable
   */
  putPuesto(puesto:any){
    return this._http.post(this.url+'/Puesto/'+puesto.Id,puesto);
  }

  /**
   * Metodo que crea un puesto
   * @param puesto Puesto a crear
   * @returns Observable
   */
  postPuesto(puesto:any){
    return this._http.post(this.url+'/Puesto',{Descripcion:puesto.Descripcion});
  }

  /**
   * Metodo que devuelve todos los puestos
   * @returns Observable
   */
  getPuestos(){
    return this._http.get(this.url+'/Puesto')
  }

  /**
   * Metodo que se encarga de eliminar un tratamiento
   * @param idTratamiento Id del tratamiento a eliminar
   * @returns Observable
   */
  deleteTratamiento(idTratamiento:number|undefined){
    return this._http.delete(this.url+'TRATAMIENTOes/'+idTratamiento);
  }

  /**
   * Metodo que se encarga de desasignar un tratamiento de un spa
   * @param idTratamiento Id del tratamiento a desasignar
   * @param sucursal Sucursal del spa a desasignar
   * @param spa Nombre del spa a desasignar
   * @returns Observable
   */
  unassignTratamiento(idTratamiento:number|undefined, sucursal:string|undefined, spa:string|undefined){
    return this._http.delete(this.url+'/TRATAMIENTOes/'+idTratamiento+'/'+sucursal+'/'+spa+'/unAssign');
  }

  /**
   * Metodo encargado de actualizar un tratamiento
   * @param idTratamiento Id del tratamiendo a actualziar
   * @param nombre Nuevo nombre del tratamiento
   * @returns Observable que actualiza el tratamiento
   */
  putTratamiento(idTratamiento:number|undefined, nombre:string|undefined){
    const body = {id:idTratamiento, nombre};
    return this._http.put<any>(this.url+'TRATAMIENTOes/'+idTratamiento, body);
  }

  /**
   * Metodo que asigna un tratamiento a un spa
   * @param idTratamiento Id del tratamiento
   * @param nombreSucursal Nombre de la sucursal donde se va a asignar
   * @param nombreSpa Nombre del spa dentro de la sucursal donde se va a asignar
   */
  assignTratamiento(idTratamiento:number|undefined, nombreSucursal:string, nombreSpa:string){
    return this._http.post<any>(this.url+'TRATAMIENTOes/'+idTratamiento+'/'+nombreSucursal+'/'+nombreSpa+'/assignTo',{})
  }

  /**
   * Metodo que crea un nuevo tratamiento
   * @param Nombre Nombre del nuevo tratamiento
   */
  postTratamiento(Nombre:string|undefined){
    const body = {Nombre};
    return this._http.post<any>(this.url+'TRATAMIENTOes',body);
  }

  /**
   * Metodo para traer los tratamientos de un spa especifico
   */
  getTratamientosSpa(spa:Spa){
    return this._http.get<any>(this.url+'TRATAMIENTOes/'+spa.NombreSucursal+'/'+spa.Nombre+'/assignedTo');
  }

  /**
   * Metodo para conseguir todos los spas existentes
   */
  getSpas(){
    return this._http.get<any>(this.url+'Spa');
  }

  getTratamientos(){
    return this._http.get<any>(this.url+'TRATAMIENTOes');
  }

  /**
   * Metodo para crear un spa
   * @param spa Spa a crear
   */
  postSpa(spa:Spa){
    return this._http.post<any>(this.url+'Spa', spa);
  }

  deleteSpa(spa:Spa){
    return this._http.delete<any>(this.url+'Spa/'+spa.NombreSucursal+'/'+spa.Nombre);
  }

  /**
   * Metodo encargado de hacer login
   */
  login(id:string, contra:string){
    const body = {id, password:contra};
    return this._http.post<JSON>(this.url+'login',body);
  }

  /**
   * Metodo encargado de traerse las sucursales
   */
  getSucursales(){
    return this._http.get<any>(this.url+'Sucursal');
  }

  /**
   * Metodo que crea una sucursal
   */
  postSucursal(sucursal:Sucursal){
    return this._http.post<any>(this.url+'Sucursal/', sucursal)
  }

  /**
   * Metodo que actualiza una sucursal
   */
   putSucursal(sucursal:Sucursal){
    return this._http.put<any>(this.url+'Sucursal/'+sucursal.Nombre, sucursal)
  }

  deleteSucursal(sucursal:Sucursal){
    return this._http.delete<any>(this.url+'Sucursal/'+sucursal.Nombre);
  }

  /**
   * Metodo para obtener los administradores existentes
   */
  test(): Observable<any> {
    return this._http.get<any>('https://localhost:44351/api/CLASEs');
  }

  /**
  * Metodo para obtener los administradores existentes
  */
  getAdmins(): Observable<Administrador[]> {
    return this._http.get<any>(this.url + 'administrador');
  }
  /**
  * Metodo para obtener los usuarios existentes
  */
  getUsers(): Observable<Usuario[]> {
    return this._http.get<any>(this.url + 'usuario');
  }
  /**
     * Metodo para obtener los dispositivos asociados
     */
  getAsociatedDevices(): Observable<Cantidad> {
    return this._http.get<any>(this.url + 'dispositivo/asociados');
  }
  /**
     * Metodo para obtener los dispositivos por usuario
     */
   getAverageDevicesPerUser(): Observable<Cantidad> {
    return this._http.get<any>(this.url + 'dispositivo/porUsuario');
  }
  /**
     * Metodo para obtener los dispositivos asociados y no
     */
   getListado(): Observable<Dispositivo_Usuario[]> {
    return this._http.get<any>(this.url + 'dispositivo/listado');
  }
  /**
     * Metodo para obtener los dispositivos por region
     */
   getDevicesPerRegion(): Observable<Dispositivo_Region[]> {
    return this._http.get<any>(this.url + 'dispositivo/porRegion');
  }

   /**
     * Metodo para obtener los dispositivos de la tienda en línea
     */
    getOnlineShop(): Observable<Dispositivo_Distribuidor[]> {
      return this._http.get<any>(this.url + 'dispositivo/tienda');
    }
     /**
     * Metodo para obtener la cantidad de tipos por distribuidor
     */
   getDistribuidorTipo(): Observable<Distribuidor_Tipo[]> {
    return this._http.get<any>(this.url + 'dispositivo/porDistribuidor');
  }


  /**
   * Metodo para obtener los tipos de dispositivos existentes
   */
  getTypes(): Observable<TipoDispositivo[]> {
    return this._http.get<any>(this.url + 'tipodispositivo');
  }
  /**
   * Metodo para postear un mensaje al servidor
   */
  postType(type: TipoDispositivo): Observable<TipoDispositivo> {
    return this._http.post<TipoDispositivo>(this.url + 'tipodispositivo', type);
  }
  /**
   * Metodo para actualizar un tipo de dispositivo
   */
  updateType(type: TipoDispositivo): Observable<TipoDispositivo> {
    const _url = this.url + 'tipodispositivo/' + type.nombre;
    return this._http.put<TipoDispositivo>(_url, type);
  }
  /**
   * Metodo para hacer un delete
   */
  deleteType(id: any): Observable<{}> {
    const _url = this.url + 'tipodispositivo/' + id;
    return this._http.delete(_url);
  }


  /**
   * Metodo para obtener los tipos de dispositivos existentes
   */
  getDevices(): Observable<Dispositivo[]> {
    return this._http.get<any>(this.url + 'dispositivo/GetDispositivos');
  }
  /**
   * Metodo para postear un mensaje al servidor
  */
  postDevice(dispositivo: Dispositivo): Observable<Dispositivo> {
    return this._http.post<Dispositivo>(this.url + 'dispositivo', dispositivo);
  }
  /**
   * Metodo para actualizar un tipo de dispositivo
   */
  updateDevice(dispositivo: Dispositivo): Observable<Dispositivo> {
    const _url = this.url + 'dispositivo/PutDispositivo/' + dispositivo.numeroserie;
    return this._http.put<Dispositivo>(_url, dispositivo);
  }
  /**
  * Metodo para hacer un delete
  */
  deleteDevice(id: any): Observable<{}> {
    const _url = this.url + 'dispositivo/' + id;
    return this._http.delete(_url);
  }

  /**
   * Metodo para obtener los distribuidores existentes
   */
   getDistributors(): Observable<Distribuidor[]> {
    return this._http.get<any>(this.url + 'distribuidor');
  }
  /**
   * Metodo para postear un distribuidor
  */
   postDistributor(distributor: Distribuidor): Observable<Distribuidor> {
    return this._http.post<Distribuidor>(this.url + 'distribuidor', distributor);
  }
  /**
   * Metodo para actualizar un distribuidor
   */
  updateDistributor(distributor: Distribuidor): Observable<Distribuidor> {
    const _url = this.url + 'distribuidor/' + distributor.cedulajuridica;
    return this._http.put<Distribuidor>(_url, distributor);
  }

  /**
   * Metodo para actualizar un tipo de dispositivo
   */
   updateDistr_Ubic(distr_ubic: DistribuidorUbicacion): Observable<DistribuidorUbicacion> {
    const _url = this.url + 'distribuidorubicacion/' + distr_ubic.cedulajuridicadistribuidor;
    return this._http.put<DistribuidorUbicacion>(_url, distr_ubic);
  }

  /**
   * Metodo para hacer un get
   */
  get(url: any, json: any) {
    return this._http.get<any>(url, json);
  }

  /**
   * CRUD TIPO PLANILLA
   */
  getTiposPlanilla(): Observable<Tipo_Planilla[]> {
    return this._http.get<Tipo_Planilla[]>(this.url + 'TIPO_PLANILLA');
  }

  putTipoPlanilla(tipoPlanilla: Tipo_Planilla): Observable<any> {
    return this._http.put<any>(this.url + 'TIPO_PLANILLA/'+tipoPlanilla.Id, tipoPlanilla);
  }

  postTipoPlanilla(tipoPlanilla: Tipo_Planilla): Observable<any> {
    return this._http.post<any>(this.url + 'TIPO_PLANILLA', tipoPlanilla);
  }

  deleteTipoPlanilla(id: number): Observable<any> {
    return this._http.delete<any>(this.url + 'TIPO_PLANILLA/'+id);
  }

  /**
   * CRUD EMPLEADO
   */
  getEmpleados(): Observable<Empleado[]> {
    return this._http.get<Empleado[]>(this.url + 'empleadoes');
  }

  putEmpleado(empleado: Empleado): Observable<any> {
    console.log(empleado)
    return this._http.put<Empleado>(this.url + 'empleadoes/'+empleado.NumeroCedula, empleado);
  }

  postEmpleado(empleado: Empleado): Observable<any> {
    return this._http.post<any>(this.url + 'empleadoes', empleado);
  }

  deleteEmpleado(cedula: number): Observable<any> {
    return this._http.delete<any>(this.url + 'empleadoes/'+cedula);
  }

  /**
   * CRUD TIPO EQUIPO
   */
   getTiposEquipo(): Observable<BasicModel[]> {
    return this._http.get<BasicModel[]>(this.url + 'TIPO_EQUIPO');
  }

  putTiposEquipo(tipos_equipo: BasicModel): Observable<any> {
    return this._http.put<BasicModel>(this.url + 'TIPO_EQUIPO/'+tipos_equipo.Identificador, tipos_equipo);
  }

  postTiposEquipo(tipos_equipo: BasicModel): Observable<any> {
    return this._http.post<any>(this.url + 'TIPO_EQUIPO', tipos_equipo);
  }

  deleteTiposEquipo(identificador: number): Observable<any> {
    return this._http.delete<any>(this.url + 'TIPO_EQUIPO/'+identificador);
  }

  /**
   * CRUD SERVICIOS
   */
   getServicios(): Observable<BasicModel[]> {
    return this._http.get<BasicModel[]>(this.url + 'servicios');
  }

  putServicio(servicio: BasicModel): Observable<any> {
    return this._http.put<BasicModel>(this.url + 'servicios/'+servicio.Identificador, servicio);
  }

  postServicio(servicio: BasicModel): Observable<any> {
    return this._http.post<any>(this.url + 'servicios', servicio);
  }

  deleteServicio(identificador: number): Observable<any> {
    return this._http.delete<any>(this.url + 'servicios/'+identificador);
  }

  /**
 * CRUD INVENTARIO
 */
  getEquipos(): Observable<Equipo[]> {
    return this._http.get<Equipo[]>(this.url + 'equipoes');
  }

  putEquipo(equipo: Equipo): Observable<any> {
    return this._http.put<Equipo>(this.url + 'equipoes/'+equipo.NumeroSerie, equipo);
  }

  postEquipo(equipo: Equipo): Observable<any> {
    return this._http.post<any>(this.url + 'equipoes', equipo);
  }

  deleteEquipo(identificador: string): Observable<any> {
    return this._http.delete<any>(this.url + 'equipoes/'+identificador);
  }

  /**
 * CRUD PRODUCTOS
 */
  getProductos(): Observable<Producto[]> {
    return this._http.get<Producto[]>(this.url + 'productoes');
  }

  putProducto(producto: Producto): Observable<any> {
    return this._http.put<Producto>(this.url + 'productoes/'+producto.CodigoBarras, producto);
  }

  postProducto(producto: Producto): Observable<any> {
    return this._http.post<any>(this.url + 'productoes', producto);
  }

  deleteProducto(identificador: string): Observable<any> {
    return this._http.delete<any>(this.url + 'productoes/'+identificador);
  }


  /**
   * Generación de planilla
   */
  getPlanilla(): Observable<Planilla[]> {
    return this._http.get<Planilla[]>(this.url + 'planilla');
  }

  /**
 * Copiar Sucursal
 */
  copiarSucursal(newSucursal: CopiarSucursal): Observable<any> {
    return this._http.post<any>(this.url + 'CopiarSucursal', newSucursal);
  }

  /**
   * CRUD CLASES
   */
  getClases2(): Observable<Clase[]> {
    return this._http.get<Clase[]>(this.url + 'clases');
  }

   /**
 * Copiar Clases
 */
  copiarClases(copiar: CopiarClases): Observable<any> {
    return this._http.post<any>(this.url + 'CopiarClases', copiar);
  }
  
  
  
}
