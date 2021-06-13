import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CrudSucursalComponent } from './crud-sucursal.component';

describe('CrudSucursalComponent', () => {
  let component: CrudSucursalComponent;
  let fixture: ComponentFixture<CrudSucursalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CrudSucursalComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CrudSucursalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
