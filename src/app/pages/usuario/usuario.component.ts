import { Component, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource, MatPaginator, MatSort, MatSnackBar, MatDialog } from '@angular/material';
import { Usuario } from 'src/app/_model/usuario';
import { UsuarioService } from 'src/app/_service/usuario.service';
import { UsuarioRolComponent } from './usuario-rol/usuario-rol.component';

@Component({
  selector: 'app-usuario',
  templateUrl: './usuario.component.html',
  styleUrls: ['./usuario.component.css']
})
export class UsuarioComponent implements OnInit {

  cantidad: number;
  dataSource: MatTableDataSource<Usuario>;
  displayedColumns = ['idUsuario', 'username', 'nombres', 'apellidos','acciones'];
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;

  constructor(private usuarioService: UsuarioService, private snackBar: MatSnackBar, private dialog: MatDialog) {
  }

  ngOnInit() {
    
    this.usuarioService.usuarioCambio.subscribe(data => {
      this.dataSource = new MatTableDataSource(data);
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
    });

    this.usuarioService.mensajeCambio.subscribe(data => {
      this.snackBar.open(data, 'AVISO', {
        duration: 2000
      });
    });

    this.usuarioService.listar().subscribe(data => {
      this.dataSource = new MatTableDataSource(data);
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
    });

  }

  applyFilter(filterValue: string) {
    filterValue = filterValue.trim();
    filterValue = filterValue.toLowerCase();
    this.dataSource.filter = filterValue;
  }

  asignar(usuario?: Usuario) {
    let usu = usuario != null ? usuario : new Usuario();
    this.dialog.open(UsuarioRolComponent, {
      width: '612px',
      data: usu
    });
  }

}
