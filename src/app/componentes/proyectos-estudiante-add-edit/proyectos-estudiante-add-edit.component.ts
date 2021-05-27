import { Component, OnInit } from '@angular/core';
import { MAT_RADIO_DEFAULT_OPTIONS } from '@angular/material/radio';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Empleado } from 'src/app/models/empleado';
import { Estudiante } from 'src/app/models/estudiante';
import { EmpleadosService } from 'src/app/services/empleados.service';
import { Router, ActivatedRoute } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ProyectosService } from 'src/app/services/proyectos.service';
import { Proyecto } from 'src/app/models/proyecto';
import { SiblingService } from 'src/app/services/sibling.service';

import { GlobalConstants } from 'src/app/commons/global-constants';


@Component({
	selector: 'app-proyectos-estudiante-add-edit',
	templateUrl: './proyectos-estudiante-add-edit.component.html',
	styleUrls: ['./proyectos-estudiante-add-edit.component.css'],
	providers: [{
		provide: MAT_RADIO_DEFAULT_OPTIONS,
		useValue: { color: 'primary' },
	}]
})
export class ProyectosEstudianteAddEditComponent implements OnInit {

	estadosCiviles: any[] = ['Soltero', 'Casado', 'Divorciado'];

	idEmpleado: any;
	codigoProyecto: any;

	accion = 'Crear';

	estudiante: Estudiante;
	proyecto: Proyecto;

	myForm: FormGroup;

	constructor(private fb: FormBuilder,
		private empleadoService: EmpleadosService,
		private route: Router,
		private snackBar: MatSnackBar,
		private aRoute: ActivatedRoute,
		private proyectosService: ProyectosService,
		private siblingService: SiblingService,
	) {
		this.myForm = this.fb.group({
			cedula: ['', [Validators.required, Validators.maxLength(10)]],
			nombreEstudiante: [' '],
			curso: [' '],
			nombreProyecto: ['', [Validators.required]],
			descripcionProyecto: ['', [Validators.required]],
		});
		const idParam = 'id';
		this.idEmpleado = this.aRoute.snapshot.params[idParam];

		const paramCodigoProyecto = 'codigoProyecto';
		this.codigoProyecto = this.aRoute.snapshot.params[paramCodigoProyecto];

		console.log(`aRoute: ${this.aRoute}`);

		console.log(`codigoProyecto: ${this.codigoProyecto}`);

	}

	ngOnInit(): void {
		console.log('Metodo: ngOnInit()');
		/*
		if (this.idEmpleado !== undefined) {
			this.accion = 'Editar';
			this.esEditar();
		}
		*/

		if (this.codigoProyecto !== undefined) {
			this.accion = 'Registrar';
			this.loadProyecto(this.codigoProyecto);
		}
	}

	buscarEstudiante() {
		console.log('Metodo: buscarEstudiante()');

		let cedula = this.myForm.get('cedula').value;

		if (cedula === '') {
			this.snackBar.open('Ingrese la cédula para realizar la búsqueda del estudiante', 'ERROR', {
				duration: GlobalConstants.timeMessages,
				panelClass: "error-dialog"
			});
			return;
		}

		console.log(cedula);

		let objParams: any = {};
		objParams.estado = '1';
		objParams.cedula = cedula;

		console.log('objParams:');
		console.log(objParams);

		this.estudiante = null;
		this.myForm.patchValue({
			nombreEstudiante: ""
		});

		this.proyectosService.findEstudianteByCedula(objParams).subscribe(response => {
			console.log('response findEstudianteByCedula()');
			console.log(response);
			if (response != undefined) {
				if (response.error === 0) {
					// Cierra el modal
					this.estudiante = response.estudiante;

					console.log(`Estudiante:`);
					console.log(this.estudiante);

					if (this.estudiante !== undefined) {

						const est = this.estudiante;

						this.myForm.patchValue({
							nombreEstudiante: est.nombrecompleto,
							curso: est.curso
						});
					} else {
						this.snackBar.open(response.message, '', {
							duration: GlobalConstants.timeMessages,
							panelClass: "error-dialog"
						});
					}

				} else {
					this.snackBar.open(response.message, 'ERROR', {
						duration: GlobalConstants.timeMessages,
						panelClass: "error-dialog"
					});
				}
			} else {
				this.snackBar.open('Error al realizar la consulta del estudiante', '', {
					duration: GlobalConstants.timeMessages
				});
			}
		}, (err) => {
			console.log(err);
		}
		);
	}

	guardarEmpleado() {
		const empleado: Empleado = {
			nombreCompleto: this.myForm.get('nombreCompleto').value,
			correo: this.myForm.get('correo').value,
			fechaIngreso: this.myForm.get('fechaIngreso').value,
			telefono: this.myForm.get('telefono').value,
			estadoCivil: this.myForm.get('estadoCivil').value,
			sexo: this.myForm.get('sexo').value,
		};

		if (this.idEmpleado !== undefined) {
			this.editarEmpleado(empleado);
		} else {
			this.agregarEmpleado(empleado);
		}
	}

	guardarEstudianteProyecto() {
		if (this.estudiante !== undefined
			&& this.estudiante.codigoestudiante !== undefined) {

			if (this.estudiante !== undefined
				&& this.estudiante.codigoestudiante !== undefined) {

				let objParams: any = {};
				objParams.estado = '1';
				objParams.codigoestudiante = this.estudiante.codigoestudiante;

				console.log('objParams:');
				console.log(objParams);

				let responseCountEstudiante = this.proyectosService.countProyectoEstudiantePromise(objParams);

				responseCountEstudiante.then((dataCountEstudiante) => {
					
					console.log("Promise resolved with: " + JSON.stringify(dataCountEstudiante));

					if (dataCountEstudiante.error === 0) {

						if (dataCountEstudiante.count === 0) {

							let objParamsInsert: any = {};
							objParamsInsert.estado = '1';
							objParamsInsert.codigoestudiante = this.estudiante.codigoestudiante;
							objParamsInsert.codigoProyecto = this.proyecto.codigoproyecto;

							console.log('objParamsInsert:');
							console.log(objParamsInsert);

							// Guarda el proyecto con el estudiante
							this.proyectosService.insertProyectoEstudiante(objParamsInsert).subscribe(response => {
								console.log('response insertProyectoEstudiante()');
								console.log(response);
								if (response != undefined) {
									if (response.error === 0) {
										this.snackBar.open(response.message, 'OK', {
											duration: GlobalConstants.timeMessages,
											panelClass: "success-dialog"
										});									
									} else {
										this.snackBar.open(response.message, 'ERROR', {
											duration: GlobalConstants.timeMessages,
											panelClass: "error-dialog"
										});
									}
									//this.changeMessage();
								} else {
									this.snackBar.open('Error al realizar la consulta del estudiante', 'ERROR', {
										duration: GlobalConstants.timeMessages,
										panelClass: "error-dialog"
									});

								}
							}, (err) => {
								console.log(err);
							}
							);

						} else {
							
							this.proyectosService.findProyectoByEstudiante(objParams).subscribe(response => {
								console.log('response findProyectoById()');
								console.log(response);
								if (response != undefined) {
									if (response.error === 0) {
										// Cierra el modal
										let proyectoEst = response.proyecto;
					
										this.snackBar.open(
											`El estudiante: ${this.estudiante.nombrecompleto} ya esta registrado en el proyecto: ${proyectoEst.nombre}`,
											'', {
												duration: GlobalConstants.timeMessages,
												panelClass: "error-dialog"
											}
										);
					
									} else {
										this.snackBar.open(response.message, '', {
											duration: GlobalConstants.timeMessages,
											panelClass: "error-dialog"
										});
									}
								} else {
									//this.alertService.error("A ocurrido un problema al registar los datos de la reunion", AppMessages.optionsMessages);
								}
							}, (err) => {
								console.log(err);
							}
							);
							
						}
					} else {
						this.snackBar.open(
							`${dataCountEstudiante.message}`,
							'', {
								duration: GlobalConstants.timeMessages,
								panelClass: "error-dialog"
							}
						);
						
					}
				}).catch((error) => {
					console.log("Promise rejected with " + JSON.stringify(error));
				});
				/*
				
				*/
			}
			else {
				this.snackBar.open('Los datos del proyecto seleccionado no son validos!', '', {
					duration: GlobalConstants.timeMessages,
					panelClass: "error-dialog"
				});
			}

		} else {
			this.snackBar.open('Ingrese la cedula del estudiante y realize la busqueda!', '', {
				duration: GlobalConstants.timeMessages,
				panelClass: "error-dialog"
			});
		}

		//this.changeMessage();

		//this.route.navigate(['/proyectos']);
		this.route.navigate(['/']);
	}

	agregarEmpleado(empleado: Empleado) {
		this.empleadoService.agregarEmpleado(empleado);
		this.snackBar.open('El empleado fue registrado con exito!', '', {
			duration: GlobalConstants.timeMessages
		});
		this.route.navigate(['/']);
	}

	editarEmpleado(empleado: Empleado) {
		this.empleadoService.editEmpleado(empleado, this.idEmpleado);
		this.snackBar.open('El empleado fue actualizado con exito!', '', {
			duration: GlobalConstants.timeMessages
		});
		this.route.navigate(['/']);
	}

	esEditar() {
		const empleado: Empleado = this.empleadoService.getEmpleado(this.idEmpleado);
		console.log(empleado);
		this.myForm.patchValue({
			nombreCompleto: empleado.nombreCompleto,
			correo: empleado.correo,
			fechaIngreso: empleado.fechaIngreso,
			telefono: empleado.telefono,
			estadoCivil: empleado.estadoCivil,
			sexo: empleado.sexo,
		});
	}

	loadProyecto(codigoProyecto: any) {

		let objParams: any = {};
		objParams.estado = '1';
		objParams.codigoProyecto = codigoProyecto;

		console.log('objParams:');
		console.log(objParams);

		this.proyecto = null;
		this.myForm.patchValue({
			nombreProyecto: "",
			descripcionProyecto: ""
		});

		this.proyectosService.findProyectoById(objParams).subscribe(response => {
			console.log('response findProyectoById()');
			console.log(response);
			if (response != undefined) {
				if (response.error === 0) {
					// Cierra el modal
					this.proyecto = response.proyecto;

					console.log(`Proyecto: ${this.proyecto}`);

					if (this.proyecto !== undefined) {

						this.myForm.patchValue({
							nombreProyecto: this.proyecto.nombre,
							descripcionProyecto: this.proyecto.descripcion
						});
					}

				} else {
					this.snackBar.open(response.message, '', {
						duration: GlobalConstants.timeMessages,
						panelClass: "error-dialog"
					});
				}
			} else {
				//this.alertService.error("A ocurrido un problema al registar los datos de la reunion", AppMessages.optionsMessages);
			}
		}, (err) => {
			console.log(err);
		}
		);
	}

	changeMessage() {
		console.log('Method changeMessage()');
		//this.siblingService.callFindEstudianteMeetings.next(true);
		this.siblingService.changeMessage(true);
	  }

}
