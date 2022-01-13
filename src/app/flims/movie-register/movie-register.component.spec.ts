import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MovieRegisterComponent } from './movie-register.component';

describe('MovieRegisterComponent', () => {
  let component: MovieRegisterComponent;
  let fixture: ComponentFixture<MovieRegisterComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MovieRegisterComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MovieRegisterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
