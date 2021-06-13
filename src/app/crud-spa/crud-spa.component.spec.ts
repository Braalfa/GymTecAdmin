import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CrudSpaComponent } from './crud-spa.component';

describe('CrudSpaComponent', () => {
  let component: CrudSpaComponent;
  let fixture: ComponentFixture<CrudSpaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CrudSpaComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CrudSpaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
