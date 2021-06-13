import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CrudPuestosComponent } from './crud-puestos.component';

describe('CrudPuestosComponent', () => {
  let component: CrudPuestosComponent;
  let fixture: ComponentFixture<CrudPuestosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CrudPuestosComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CrudPuestosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
