import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NgGdComponent } from './ng-gd.component';

describe('NgGdComponent', () => {
  let component: NgGdComponent;
  let fixture: ComponentFixture<NgGdComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NgGdComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NgGdComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
