import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { EmpleadosAddEditComponent } from './componentes/empleados-add-edit/empleados-add-edit.component';
import { EmpleadosListComponent } from './componentes/empleados-list/empleados-list.component';
import { ProyectosEstudianteAddEditComponent } from './componentes/proyectos-estudiante-add-edit/proyectos-estudiante-add-edit.component';
import { ProyectosExpandedComponent } from './componentes/proyectos-expanded/proyectos-expanded.component';
import { ProyectosGroupComponent } from './componentes/proyectos-group/proyectos-group.component';
import { TableExpandedComponent } from './componentes/table-expanded/table-expanded.component';

const routes: Routes = [
  //{ path: '', component: ProyectosExpandedComponent },
  //{ path: 'empleados', component: EmpleadosListComponent },
  //{ path: 'add', component: EmpleadosAddEditComponent },
  //{ path: 'empleados/edit/:id', component: EmpleadosAddEditComponent },  
  { path: '', component: ProyectosExpandedComponent },
  //{ path: 'pexpanded', component: ProyectosExpandedComponent },  
  { path: 'register/:codigoProyecto', component: ProyectosEstudianteAddEditComponent },  
  //{ path: 'texpanded', component: TableExpandedComponent },  
  { path: '**', component: ProyectosExpandedComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
