import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProyectosExpandedComponent } from './proyectos-expanded.component';

describe('ProyectosExpandedComponent', () => {
  let component: ProyectosExpandedComponent;
  let fixture: ComponentFixture<ProyectosExpandedComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProyectosExpandedComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProyectosExpandedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
