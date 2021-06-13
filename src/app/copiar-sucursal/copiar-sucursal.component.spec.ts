import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CopiarSucursalComponent } from './copiar-sucursal.component';

describe('CopiarSucursalComponent', () => {
  let component: CopiarSucursalComponent;
  let fixture: ComponentFixture<CopiarSucursalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CopiarSucursalComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CopiarSucursalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
