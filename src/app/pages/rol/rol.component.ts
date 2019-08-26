import { Component, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource, MatPaginator, MatSort, MatSnackBar } from '@angular/material';
import { Rol } from 'src/app/_model/rol';
import { RolService } from 'src/app/_service/rol.service';

@Component({
  selector: 'app-rol',
  templateUrl: './rol.component.html',
  styleUrls: ['./rol.component.css']
})
export class RolComponent implements OnInit {

  cantidad: number;
  dataSource: MatTableDataSource<Rol>;
  displayedColumns = ['idRol', 'nombre', 'descripcion', 'acciones'];
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;

  constructor(private rolService: RolService, private snackBar: MatSnackBar) {
  }

  ngOnInit() {
    
    this.rolService.rolCambio.subscribe(data => {
      this.dataSource = new MatTableDataSource(data);
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
    });

    this.rolService.mensajeCambio.subscribe(data => {
      this.snackBar.open(data, 'AVISO', {
        duration: 2000
      });
    });

    this.rolService.listar().subscribe(data => {
      this.dataSource = new MatTableDataSource(data);
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
    });

  }

  eliminar(idRol: number) {
    this.rolService.eliminar(idRol).subscribe(() => {
      this.rolService.listar().subscribe(data => {
        this.rolService.rolCambio.next(data);
        this.rolService.mensajeCambio.next('Se eliminó');
      });
    });
  }

 
  applyFilter(filterValue: string) {
    filterValue = filterValue.trim();
    filterValue = filterValue.toLowerCase();
    this.dataSource.filter = filterValue;
  }

}
