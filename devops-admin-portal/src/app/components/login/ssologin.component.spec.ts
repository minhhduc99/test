import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SSOLoginComponent } from './ssologin.component';

describe('SSOLoginComponent', () => {
  let component: SSOLoginComponent;
  let fixture: ComponentFixture<SSOLoginComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SSOLoginComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SSOLoginComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
