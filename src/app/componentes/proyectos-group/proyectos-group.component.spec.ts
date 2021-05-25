import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProyectosGroupComponent } from './proyectos-group.component';

describe('ProyectosGroupComponent', () => {
  let component: ProyectosGroupComponent;
  let fixture: ComponentFixture<ProyectosGroupComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProyectosGroupComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProyectosGroupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
