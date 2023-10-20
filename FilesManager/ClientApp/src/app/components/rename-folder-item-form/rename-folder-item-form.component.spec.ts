import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RenameFolderItemFormComponent } from './rename-folder-item-form.component';

describe('RenameFolderItemFormComponent', () => {
  let component: RenameFolderItemFormComponent;
  let fixture: ComponentFixture<RenameFolderItemFormComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [RenameFolderItemFormComponent]
    });
    fixture = TestBed.createComponent(RenameFolderItemFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
