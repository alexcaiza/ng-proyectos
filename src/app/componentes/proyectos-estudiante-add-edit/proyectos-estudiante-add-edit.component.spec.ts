import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProyectosEstudianteAddEditComponent } from './proyectos-estudiante-add-edit.component';

describe('ProyectosEstudianteAddEditComponent', () => {
  let component: ProyectosEstudianteAddEditComponent;
  let fixture: ComponentFixture<ProyectosEstudianteAddEditComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProyectosEstudianteAddEditComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProyectosEstudianteAddEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
