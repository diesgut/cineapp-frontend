import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Menu } from './../_model/menu';
import { environment } from './../../environments/environment';
import { Subject } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class MenuService {

  url: string = `${environment.HOST}`;  
  urlFull: string = `${environment.HOST}/menus`;
  menuCambio = new Subject<Menu[]>();
  mensajeCambio = new Subject<string>();

  constructor(private http: HttpClient) { }

  listar() {
    let access_token = JSON.parse(sessionStorage.getItem(environment.TOKEN_NAME)).access_token;

    return this.http.get<Menu[]>(`${this.url}/menus`, {
      headers: new HttpHeaders().set('Authorization', `bearer ${access_token}`).set('Content-Type', 'application/json')
    });
  }

  listarPorUsuario(nombre: string) {
    let access_token = JSON.parse(sessionStorage.getItem(environment.TOKEN_NAME)).access_token;
    return this.http.post<Menu[]>(`${this.url}/menus/usuario`, nombre, {
      headers: new HttpHeaders().set('Authorization', `bearer ${access_token}`).set('Content-Type', 'application/json')
    });
  }

  listarPorId(id: number) {
    return this.http.get<Menu>(`${this.urlFull}/${id}`);
  }

  registrar(menu: Menu) {
    return this.http.post(this.urlFull, menu);
  }

  modificar(menu: Menu) {
    return this.http.put(this.urlFull, menu);
  }

  eliminar(id: number) {
    return this.http.delete(`${this.urlFull}/${id}`);
  }
}
