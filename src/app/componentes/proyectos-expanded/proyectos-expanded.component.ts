import { Component, OnInit, ViewChild, ViewChildren, QueryList, ChangeDetectorRef } from '@angular/core';
import { animate, state, style, transition, trigger } from '@angular/animations';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource, MatTable } from '@angular/material/table';

import { Grupo } from 'src/app/models/grupo';
import { ProyectosService } from 'src/app/services/proyectos.service';
import { Proyecto } from 'src/app/models/proyecto';
import { SiblingService } from 'src/app/services/sibling.service';
import { timer } from 'rxjs';
import { MatSnackBar } from '@angular/material/snack-bar';
import { GlobalConstants } from 'src/app/commons/global-constants';

@Component({
	selector: 'app-proyectos-expanded',
	templateUrl: './proyectos-expanded.component.html',
	styleUrls: ['./proyectos-expanded.component.css'],
	animations: [
		trigger('detailExpand', [
			state('collapsed', style({ height: '0px', minHeight: '0' })),
			state('expanded', style({ height: '*' })),
			transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
		]),
	],
})
export class ProyectosExpandedComponent implements OnInit {

	@ViewChild('outerSort', { static: true }) sort: MatSort;
	@ViewChildren('innerSort') innerSort: QueryList<MatSort>;
	//@ViewChildren('innerTables') innerTables: QueryList<MatTable<Address>>;
	@ViewChildren('innerTables') innerTables: QueryList<MatTable<Proyecto>>;

	grupos: Grupo[] = [];

	dataSource2: MatTableDataSource<Grupo>;
	gruposData: Grupo[] = [];

	//columnsToDisplay = ['name', 'email', 'phone'];
	columnsToDisplay = ['nombre', 'cantidadMaxima', 'cantidadEstudiantes'];
	columnsToDisplay2 = [
		{
			field: "nombre",
			name: "Grupo",
			display: true
		},
		{
			field: "cantidadMaxima",
			name: "Cantidad maxima de estudiantes",
			display: true
		},
		{
			field: "cantidadEstudiantes",
			name: "Estudiantes registrados",
			display: true
		},

	];
	innerDisplayedColumns = ['nombre', 'descripcion', 'cantidadEstudiantes','acciones'];
	innerDisplayedColumns2 = [
		{
			field: "nombre",
			name: "Nombre",
		},
		{
			field: "descripcion",
			name: "Descripcion",
		},		
		{
			field: "cantidadEstudiantes",
			name: "Cantidad estudiantes",
		},
		{
			field: "acciones",
			name: "Acciones",
		},
	];

	expandedElement: Grupo | null;

	constructor(
		private cd: ChangeDetectorRef,
		private proyectosService: ProyectosService,
		private siblingService: SiblingService,
		private snackBar: MatSnackBar,
	) { 
		/*
		this.siblingService.callFindEstudianteMeetings.subscribe((data) => {
            this.findGrupos();
        });
		*/
		this.siblingService.messageSource$.subscribe((data) => {			
			timer(500).subscribe(x => { 
				console.log('Method: siblingService.messageSource$.subscribe()');
				this.findGrupos();
				//this.resetTable();
			  });            
        });
	}

	resetTable() {
		console.log('Method: resetTable()');
		let emp = [];
		this.dataSource2 = new MatTableDataSource<Grupo>(emp);
		if (this.dataSource2 !== null && this.dataSource2 !== undefined) {
			console.log('dataSource2 undefined');
			this.dataSource2.data = [];
		}
		//this.dataSource = new MatTableDataSource<Element>(this.newSource);
		//this.cd.detectChanges();
		this.findGrupos();
	}

	ngOnInit() {
		console.log('Method: ngOnInit()');		
	}

	private findGrupos() {
		console.log('Method: findGrupos()');

		let objParams: any = {};
		objParams.estado = '1';

		console.log('objParams:');
		console.log(objParams);

		this.dataSource2 = null;

		this.proyectosService.findGrupos(objParams).subscribe(response => {
			console.log('response findGrupos()');
			console.log(response);
			if (response != undefined) {
				if (response.error === 0) {
					// Cierra el modal
					this.grupos = response.grupos;

					this.grupos.forEach(grupo => {
						if (grupo.proyectos && Array.isArray(grupo.proyectos) && grupo.proyectos.length) {
							this.gruposData = [...this.gruposData, { ...grupo, proyectos: new MatTableDataSource(grupo.proyectos)}];
						} else {
							this.gruposData = [...this.gruposData, grupo];
						}
					});
			
					console.log('gruposData: ');
					console.log(this.gruposData);
			
					this.dataSource2 = new MatTableDataSource(this.gruposData);
					this.dataSource2.sort = this.sort;

					//this.dataSource2.data = this.gruposData;

					//this.cd.detectChanges();

				} else {
					this.snackBar.open(response?.message, '', {
						duration: GlobalConstants.timeMessages,
						panelClass: "error-dialog"
					});
				}
			} else {
				this.snackBar.open(response?.message, '', {
					duration: GlobalConstants.timeMessages,
					panelClass: "error-dialog"
				});
			}
		}, (err) => {
			console.log(err);
		}
		);
	}

	toggleRow(element: Grupo) {
		element.proyectos && (element.proyectos as MatTableDataSource<Proyecto>).data.length ? (this.expandedElement = this.expandedElement === element ? null : element) : null;
		this.cd.detectChanges();
		this.innerTables.forEach((table, index) => (table.dataSource as MatTableDataSource<Proyecto>).sort = this.innerSort.toArray()[index]);
	}

	applyFilter(filterValue: string) {
		this.innerTables.forEach((table, index) => (table.dataSource as MatTableDataSource<Proyecto>).filter = filterValue.trim().toLowerCase());
	}

}



