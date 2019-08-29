import { switchMap } from 'rxjs/operators';
import { MatSnackBar } from '@angular/material';
import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { MenuService } from 'src/app/_service/menu.service';
import { ActivatedRoute, Router, Params } from '@angular/router';
import { Menu } from 'src/app/_model/menu';
import * as moment from 'moment';
import { forkJoin } from 'rxjs';

@Component({
  selector: 'app-menu-edicion',
  templateUrl: './menu-edicion.component.html',
  styleUrls: ['./menu-edicion.component.css']
})
export class MenuEdicionComponent implements OnInit {

  menu: Menu;
  id: number;
  edicion: boolean;
  form: FormGroup;

  constructor(private route: ActivatedRoute, private router: Router, private menuService: MenuService,  private snackBar: MatSnackBar) { }

  ngOnInit() {
   
    this.form = new FormGroup({
      'idMenu': new FormControl(0),
      'nombre': new FormControl('', [Validators.required, Validators.minLength(3)]),
      'icono': new FormControl('', [Validators.required, Validators.minLength(3)]),
      'url': new FormControl('', [Validators.required, Validators.minLength(3)])
    });

    this.menu = new Menu();

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
      this.menuService.listarPorId(this.id).subscribe(data => {

        this.form = new FormGroup({
          'idMenu': new FormControl(data.idMenu),
          'nombre': new FormControl(data.nombre),
          'icono': new FormControl(data.icono),
          'url': new FormControl(data.url)
        });

      });
    }
  }

  operar() {

    if (this.form.invalid) {
      return;
    }

    let menu = new Menu();
    menu.idMenu = this.form.value['idMenu'];
    menu.icono = this.form.value['icono'];
    menu.nombre = this.form.value['nombre'];
    menu.url = this.form.value['url'];

    if (menu.idMenu > 0) {

      //Buena práctica
      this.menuService.modificar(menu).pipe(switchMap(() => {
        return this.menuService.listar();
      })).subscribe(data => {
        this.menuService.menuCambio.next(data);
        this.menuService.mensajeCambio.next('SE MODIFICO');
      });
    } else {
      //Práctica común
      this.menuService.registrar(menu).subscribe(() => {
        this.menuService.listar().subscribe(data => {
          this.menuService.menuCambio.next(data);
          this.menuService.mensajeCambio.next('SE REGISTRO');
        });
      });
    }

    this.router.navigate(['menu']);
  }

}
