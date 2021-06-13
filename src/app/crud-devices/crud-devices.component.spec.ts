import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CrudDevicesComponent } from './crud-devices.component';

describe('CrudDevicesComponent', () => {
  let component: CrudDevicesComponent;
  let fixture: ComponentFixture<CrudDevicesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CrudDevicesComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CrudDevicesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
