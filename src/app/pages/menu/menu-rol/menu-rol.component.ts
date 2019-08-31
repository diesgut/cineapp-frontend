import { Component, OnInit, ViewChild, Inject } from '@angular/core';
import { MatTableDataSource, MatPaginator, MatSort, MatSnackBar, MatDialogRef } from '@angular/material';
import { Menu } from 'src/app/_model/menu';
import { MenuService } from 'src/app/_service/menu.service';
import { Rol } from 'src/app/_model/rol';
import { RolService } from 'src/app/_service/rol.service';
import { SelectionModel } from '@angular/cdk/collections';
import { MAT_DIALOG_DATA } from '@angular/material';
import { switchMap } from 'rxjs/operators';

@Component({
  selector: 'app-menu-rol',
  templateUrl: './menu-rol.component.html',
  styleUrls: ['./menu-rol.component.css']
})
export class MenuRolComponent implements OnInit {

  cantidad: number;
  dataSource: MatTableDataSource<Rol>;
  displayedColumns = ['select','idRol', 'nombre', 'descripcion'];
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;
  selection = new SelectionModel<Rol>(true, []);

  menu: Menu;

  constructor(private dialogRef: MatDialogRef<MenuRolComponent>, @Inject(MAT_DIALOG_DATA) public data: Menu,
  private rolService: RolService, private menuService : MenuService, private snackBar: MatSnackBar) {
    this.menu=data;
  }

  ngOnInit() {
    console.log("init");
    console.dir(this.menu);
    this.rolService.listar().subscribe(data => {
      this.dataSource = new MatTableDataSource(data);
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;

      this.menuService.listarPorId(this.menu.idMenu).subscribe(data2 => {
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
    this.menu.roles=this.selection.selected;
    this.menuService.asignarRoles(this.menu).subscribe(data => {
      this.menuService.mensajeCambio.next('SE ASIGNO ROLES');
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
