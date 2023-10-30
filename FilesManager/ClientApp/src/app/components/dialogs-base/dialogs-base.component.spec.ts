import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogsBaseComponent } from './dialogs-base.component';

describe('DialogsBaseComponent', () => {
  let component: DialogsBaseComponent;
  let fixture: ComponentFixture<DialogsBaseComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DialogsBaseComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DialogsBaseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
