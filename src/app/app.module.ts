import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { ProyectosListComponent } from './componentes/proyectos-list/proyectos-list.component';
import { ProyectosGroupComponent } from './componentes/proyectos-group/proyectos-group.component';
import { MensajeConfirmacionComponent } from './componentes/mensaje-confirmacion/mensaje-confirmacion.component';

import { AngularMaterialModule } from './angular-material.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { EmpleadosListComponent } from './componentes/empleados-list/empleados-list.component';
import { EmpleadosAddEditComponent } from './componentes/empleados-add-edit/empleados-add-edit.component';
import { NavbarComponent } from './componentes/navbar/navbar.component';
import { ProyectosExpandedComponent } from './componentes/proyectos-expanded/proyectos-expanded.component';
import { TableExpandedComponent } from './componentes/table-expanded/table-expanded.component';

import { HttpClientModule } from '@angular/common/http';

import { ReactiveFormsModule } from '@angular/forms';
import { ProyectosEstudianteAddEditComponent } from './componentes/proyectos-estudiante-add-edit/proyectos-estudiante-add-edit.component';

import { SiblingService } from './services/sibling.service';

@NgModule({
  declarations: [
    AppComponent,
    ProyectosListComponent,
    ProyectosGroupComponent,
    MensajeConfirmacionComponent,
    EmpleadosListComponent,
    EmpleadosAddEditComponent,
    NavbarComponent,
    ProyectosExpandedComponent,
    TableExpandedComponent,
    ProyectosEstudianteAddEditComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    AngularMaterialModule,
    BrowserAnimationsModule,
    HttpClientModule,
    ReactiveFormsModule,
  ],
  providers: [
    SiblingService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
