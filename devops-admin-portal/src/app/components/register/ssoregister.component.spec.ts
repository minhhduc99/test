import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SSORegisterComponent } from './ssoregister.component';

describe('SSORegisterComponent', () => {
  let component: SSORegisterComponent;
  let fixture: ComponentFixture<SSORegisterComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SSORegisterComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SSORegisterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
