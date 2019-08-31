import { Component, OnInit, ViewChild, Inject } from '@angular/core';
import { MatTableDataSource, MatPaginator, MatSort, MatSnackBar, MatDialogRef } from '@angular/material';
import { Usuario } from 'src/app/_model/usuario';
import { UsuarioService } from 'src/app/_service/usuario.service';
import { Rol } from 'src/app/_model/rol';
import { RolService } from 'src/app/_service/rol.service';
import { SelectionModel } from '@angular/cdk/collections';
import { MAT_DIALOG_DATA } from '@angular/material';
import { switchMap } from 'rxjs/operators';

@Component({
  selector: 'app-usuario-rol',
  templateUrl: './usuario-rol.component.html',
  styleUrls: ['./usuario-rol.component.css']
})
export class UsuarioRolComponent implements OnInit {

  cantidad: number;
  dataSource: MatTableDataSource<Rol>;
  displayedColumns = ['select','idRol', 'nombre', 'descripcion'];
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;
  selection = new SelectionModel<Rol>(true, []);

  usuario: Usuario;

  constructor(private dialogRef: MatDialogRef<UsuarioRolComponent>, @Inject(MAT_DIALOG_DATA) public data: Usuario,
  private rolService: RolService, private usuarioService : UsuarioService, private snackBar: MatSnackBar) {
    this.usuario=data;
  }

  ngOnInit() {
    console.log("init");
    console.dir(this.usuario);
    this.rolService.listar().subscribe(data => {
      this.dataSource = new MatTableDataSource(data);
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;

      this.usuarioService.listarPorId(this.usuario.idUsuario).subscribe(data2 => {
        // this.selection = new SelectionModel<Rol>(true, data.roles); dont work
        // this.selection = new SelectionModel<Rol>(true, [this.dataSource.data[1]}); work
         let seleccionados = this.dataSource.data.filter(function (rol) {
           let exists= data2.roles.filter(x => x.idRol == rol.idRol);
           return exists.length>0;
         });
         this.selection = new SelectionModel<Rol>(true, seleccionados);
       });

    });

  }

  aceptar() {  
    console.log("aceptar");
    this.usuario.roles=this.selection.selected;
    this.usuarioService.asignarRoles(this.usuario).subscribe(data => {
      this.usuarioService.mensajeCambio.next('SE ASIGNO ROLES');
      this.dialogRef.close();
    });
  }
  cancelar() {   
    this.dialogRef.close();
  }

  isAllSelected() {
    if(this.dataSource==null){
      return false;
    }
    const numSelected = this.selection.selected.length;
    const numRows = this.dataSource.data.length;

    return numSelected === numRows;
  }

  /** Selects all rows if they are not all selected; otherwise clear selection. */
  masterToggle() {
    this.isAllSelected() ?
        this.selection.clear() :
        this.dataSource.data.forEach(row => this.selection.select(row));
  }

  /** The label for the checkbox on the passed row */
  checkboxLabel(row?: Rol): string {
    if (!row) {
      return `${this.isAllSelected() ? 'select' : 'deselect'} all`;
    }
    return `${this.selection.isSelected(row) ? 'deselect' : 'select'} row ${row.idRol + 1}`;
  }

}
