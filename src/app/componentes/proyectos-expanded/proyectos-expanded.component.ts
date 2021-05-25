import { Component, OnInit, ViewChild, ViewChildren, QueryList, ChangeDetectorRef } from '@angular/core';
import { animate, state, style, transition, trigger } from '@angular/animations';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource, MatTable } from '@angular/material/table';

import { Grupo } from 'src/app/models/grupo';
import { ProyectosService } from 'src/app/services/proyectos.service';
import { Proyecto } from 'src/app/models/proyecto';
import { SiblingService } from 'src/app/services/sibling.service';
import { timer } from 'rxjs';

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

	dataSource: MatTableDataSource<User>;
	usersData: User[] = [];

	dataSource2: MatTableDataSource<Grupo>;
	gruposData: Grupo[] = [];

	//columnsToDisplay = ['name', 'email', 'phone'];
	columnsToDisplay = ['nombre', 'cantidadMaxima', 'cantidadEstudiantes'];
	columnsToDisplay2 = [
		{
			field: "nombre",
			name: "Grupo",
		},
		{
			field: "cantidadMaxima",
			name: "Cantidad maxima de estudiantes",
		},
		{
			field: "cantidadEstudiantes",
			name: "Estudiantes registrados",
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
			  });
            
        });

	}

	ngOnInit() {

		console.log('Method: ngOnInit()');

		USERS.forEach(user => {
			if (user.addresses && Array.isArray(user.addresses) && user.addresses.length) {
				this.usersData = [...this.usersData, { ...user, addresses: new MatTableDataSource(user.addresses) }];
			} else {
				this.usersData = [...this.usersData, user];
			}
		});
		this.dataSource = new MatTableDataSource(this.usersData);
		this.dataSource.sort = this.sort;

		//this.findGrupos();				
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

				} else {
					//this.alertService.error(response.message, AppMessages.optionsMessages);
				}
			} else {
				//this.alertService.error("A ocurrido un problema al registar los datos de la reunion", AppMessages.optionsMessages);
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

export interface User {
	name: string;
	email: string;
	phone: string;
	cantidadMaxima: number;
	cantidadEstudiantes: number;
	addresses?: Address[] | MatTableDataSource<Address>;

}

export class Address {
	street: string;
	zipCode: string;
	city: string;
}

export class UserDataSource {
	name: string;
	email: string;
	phone: string;
	addresses?: MatTableDataSource<Address>;
}

const USERS: User[] = [
	{
		name: "Grupo1",
		email: "mason@test.com",
		phone: "9864785214",
		cantidadMaxima: 20,
		cantidadEstudiantes: 0,
		addresses: [
			{
				street: "Contabilidad 1.1",
				zipCode: "78542",
				city: "Kansas"
			},
			{
				street: "Contabilidad 1.2",
				zipCode: "78554",
				city: "Texas"
			},
			{
				street: "Contabilidad 1.3",
				zipCode: "78554",
				city: "Texas"
			}
		]
	},
	{
		name: "Grupo 2",
		email: "eugene@test.com",
		phone: "8786541234",
		cantidadMaxima: 25,
		cantidadEstudiantes: 0,
	},
	{
		name: "Grupo 3",
		email: "jason@test.com",
		phone: "7856452187",
		cantidadMaxima: 30,
		cantidadEstudiantes: 0,
		addresses: [
			{
				street: "Street 5",
				zipCode: "23547",
				city: "Utah"
			},
			{
				street: "Street 5",
				zipCode: "23547",
				city: "Ohio"
			}
		]
	}
];
