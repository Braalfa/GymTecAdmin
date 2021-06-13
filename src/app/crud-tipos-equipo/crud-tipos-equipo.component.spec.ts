import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CrudTiposEquipoComponent } from './crud-tipos-equipo.component';

describe('CrudTiposEquipoComponent', () => {
  let component: CrudTiposEquipoComponent;
  let fixture: ComponentFixture<CrudTiposEquipoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CrudTiposEquipoComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CrudTiposEquipoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
