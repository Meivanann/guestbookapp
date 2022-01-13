import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FlimListComponent } from './flim-list.component';

describe('FlimListComponent', () => {
  let component: FlimListComponent;
  let fixture: ComponentFixture<FlimListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FlimListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FlimListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
