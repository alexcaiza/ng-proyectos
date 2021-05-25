import { Component, OnInit } from '@angular/core';
import { MAT_RADIO_DEFAULT_OPTIONS } from '@angular/material/radio';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Empleado } from 'src/app/models/empleado';
import { EmpleadosService } from 'src/app/services/empleados.service';
import { Router, ActivatedRoute } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
	selector: 'app-empleados-add-edit',
	templateUrl: './empleados-add-edit.component.html',
	styleUrls: ['./empleados-add-edit.component.css'],
	providers: [{
		provide: MAT_RADIO_DEFAULT_OPTIONS,
		useValue: { color: 'primary' },
	}]
})
export class EmpleadosAddEditComponent implements OnInit {

	estadosCiviles: any[] = ['Soltero', 'Casado', 'Divorciado'];
	idEmpleado: any;
	accion = 'Crear';
  
	myForm: FormGroup;
	constructor(private fb: FormBuilder,
				private empleadoService: EmpleadosService, 
				private route: Router,
				private snackBar: MatSnackBar,
				private aRoute: ActivatedRoute) { 
	  this.myForm = this.fb.group({
		nombreCompleto: ['', [Validators.required, Validators.maxLength(20)]],
		correo: ['',  [Validators.required, Validators.email]],
		fechaIngreso: ['',  [Validators.required]],
		telefono: ['', [Validators.required]],
		estadoCivil: ['', [Validators.required]],
		sexo: ['', [Validators.required]],
	  });
	  const idParam = 'id';
	  this.idEmpleado = this.aRoute.snapshot.params[idParam];
  
	}
  
	ngOnInit(): void {
	  if (this.idEmpleado !== undefined) {
		this.accion = 'Editar';
		this.esEditar();
	  }
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
  
	agregarEmpleado(empleado: Empleado) {
	  this.empleadoService.agregarEmpleado(empleado);
	  this.snackBar.open('El empleado fue registrado con exito!', '', {
		duration: 3000
	  });
	  this.route.navigate(['/']);
	}
  
	editarEmpleado(empleado: Empleado) {
	  this.empleadoService.editEmpleado(empleado, this.idEmpleado);
	  this.snackBar.open('El empleado fue actualizado con exito!', '', {
		duration: 3000
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
  
  }
