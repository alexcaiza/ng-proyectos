import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TableExpandedComponent } from './table-expanded.component';

describe('TableExpandedComponent', () => {
  let component: TableExpandedComponent;
  let fixture: ComponentFixture<TableExpandedComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TableExpandedComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TableExpandedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
