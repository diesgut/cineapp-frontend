import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Rol } from '../_model/rol';
import { environment } from 'src/environments/environment';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class RolService {

  url: string = `${environment.HOST}/roles`;

  rolCambio = new Subject<Rol[]>();
  mensajeCambio = new Subject<string>();

  constructor(private http: HttpClient) { }

  listar() {
    return this.http.get<Rol[]>(this.url);
  }

  listarPorId(id: number) {
    return this.http.get<Rol>(`${this.url}/${id}`);
  }

  registrar(rol: Rol) {
    return this.http.post(this.url, rol);
  }

  modificar(rol: Rol) {
    return this.http.put(this.url, rol);
  }

  eliminar(id: number) {
    return this.http.delete(`${this.url}/${id}`);
  }
}
