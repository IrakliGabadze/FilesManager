import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AuthUserSectionComponent } from './auth-user-section.component';

describe('AuthUserSectionComponent', () => {
  let component: AuthUserSectionComponent;
  let fixture: ComponentFixture<AuthUserSectionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AuthUserSectionComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AuthUserSectionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
