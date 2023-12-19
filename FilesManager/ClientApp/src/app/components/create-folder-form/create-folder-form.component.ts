import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'create-folder-form',
  templateUrl: './create-folder-form.component.html',
  styleUrl: './create-folder-form.component.css'
})
export class CreateFolderFormComponent {
  constructor(private _dialogRef: MatDialogRef<CreateFolderFormComponent>) {}

  createFolderForm: FormGroup = new FormGroup({
    name: new FormControl("", [Validators.required, Validators.maxLength(64)])
  });

  onFormSubmit() {

    if (!this.createFolderForm.valid)
      return;

    this._dialogRef.close(this.createFolderForm.get('name')?.value)
  }
}
