import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EmpleadosAddEditComponent } from './empleados-add-edit.component';

describe('EmpleadosAddEditComponent', () => {
  let component: EmpleadosAddEditComponent;
  let fixture: ComponentFixture<EmpleadosAddEditComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EmpleadosAddEditComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EmpleadosAddEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
