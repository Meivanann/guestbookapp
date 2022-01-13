import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FlimViewComponent } from './flim-view.component';

describe('FlimViewComponent', () => {
  let component: FlimViewComponent;
  let fixture: ComponentFixture<FlimViewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FlimViewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FlimViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
