import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FlimsComponent } from './flims.component';

describe('FlimsComponent', () => {
  let component: FlimsComponent;
  let fixture: ComponentFixture<FlimsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FlimsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FlimsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
