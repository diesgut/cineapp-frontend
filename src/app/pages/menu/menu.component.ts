import { Component, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource, MatPaginator, MatSort, MatSnackBar,MatDialog } from '@angular/material';
import { Rol } from 'src/app/_model/rol';
import { MenuService } from 'src/app/_service/menu.service';
import { Menu } from 'src/app/_model/menu';
import { MenuRolComponent } from './menu-rol/menu-rol.component';
@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.css']
})
export class MenuComponent implements OnInit {

  cantidad: number;
  dataSource: MatTableDataSource<Menu>;
  displayedColumns = ['idMenu', 'icono', 'nombre', 'url', 'acciones'];
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;

  constructor(private menuService: MenuService, private snackBar: MatSnackBar, private dialog: MatDialog) {
  }

  ngOnInit() {

    this.menuService.menuCambio.subscribe(data => {
      this.dataSource = new MatTableDataSource(data);
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
    });

    this.menuService.mensajeCambio.subscribe(data => {
      this.snackBar.open(data, 'AVISO', {
        duration: 2000
      });
    });

    this.menuService.listar().subscribe(data => {
      this.dataSource = new MatTableDataSource(data);
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
    });

  }

  eliminar(idMenu: number) {
    this.menuService.eliminar(idMenu).subscribe(() => {
      this.menuService.listar().subscribe(data => {
        this.menuService.menuCambio.next(data);
        this.menuService.mensajeCambio.next('Se eliminó');
      });
    });
  }

  applyFilter(filterValue: string) {
    filterValue = filterValue.trim();
    filterValue = filterValue.toLowerCase();
    this.dataSource.filter = filterValue;
  }

  asignar(menu?: Menu) {
    let usu = menu != null ? menu : new Menu();
    this.dialog.open(MenuRolComponent, {
      width: '612px',
      data: usu
    });
  }

}
