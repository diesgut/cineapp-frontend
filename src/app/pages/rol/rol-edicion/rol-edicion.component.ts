import { switchMap } from 'rxjs/operators';
import { MatSnackBar } from '@angular/material';
import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { RolService } from 'src/app/_service/rol.service';
import { ActivatedRoute, Router, Params } from '@angular/router';
import { Rol } from 'src/app/_model/rol';
import * as moment from 'moment';
import { forkJoin } from 'rxjs';

@Component({
  selector: 'app-rol-edicion',
  templateUrl: './rol-edicion.component.html',
  styleUrls: ['./rol-edicion.component.css']
})
export class RolEdicionComponent implements OnInit {

  rol: Rol;
  id: number;
  edicion: boolean;
  form: FormGroup;

  constructor(private route: ActivatedRoute, private router: Router, private rolService: RolService,  private snackBar: MatSnackBar) { }

  ngOnInit() {
   
    this.form = new FormGroup({
      'idRol': new FormControl(0),
      'nombre': new FormControl('', [Validators.required, Validators.minLength(3)]),
      'descripcion': new FormControl('', Validators.required)
    });

    this.rol = new Rol();

    this.route.params.subscribe((params: Params) => {
      this.id = params['id'];
      this.edicion = this.id != null;
      this.initForm();
    });
  }

  get f() { return this.form.controls; }

  initForm() {

    if (this.edicion) {
      //cargar la data del servicio hacia el form 
      this.rolService.listarPorId(this.id).subscribe(data => {

        this.form = new FormGroup({
          'idRol': new FormControl(data.idRol),
          'nombre': new FormControl(data.nombre),
          'descripcion': new FormControl(data.descripcion)
        });

      });
    }
  }

  operar() {

    if (this.form.invalid) {
      return;
    }

    let rol = new Rol();
    rol.idRol = this.form.value['idRol'];
    rol.descripcion = this.form.value['descripcion'];
    rol.nombre = this.form.value['nombre'];

    if (rol.idRol > 0) {

      //Buena práctica
      this.rolService.modificar(rol).pipe(switchMap(() => {
        return this.rolService.listar();
      })).subscribe(data => {
        this.rolService.rolCambio.next(data);
        this.rolService.mensajeCambio.next('SE MODIFICO');
      });
    } else {
      //Práctica común
      this.rolService.registrar(rol).subscribe(() => {
        this.rolService.listar().subscribe(data => {
          this.rolService.rolCambio.next(data);
          this.rolService.mensajeCambio.next('SE REGISTRO');
        });
      });
    }

    this.router.navigate(['rol']);
  }

}
