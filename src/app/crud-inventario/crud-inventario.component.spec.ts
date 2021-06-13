import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CrudInventarioComponent } from './crud-inventario.component';

describe('CrudInventarioComponent', () => {
  let component: CrudInventarioComponent;
  let fixture: ComponentFixture<CrudInventarioComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CrudInventarioComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CrudInventarioComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
