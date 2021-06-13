import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CrudServiciosComponent } from './crud-servicios.component';

describe('CrudServiciosComponent', () => {
  let component: CrudServiciosComponent;
  let fixture: ComponentFixture<CrudServiciosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CrudServiciosComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CrudServiciosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
