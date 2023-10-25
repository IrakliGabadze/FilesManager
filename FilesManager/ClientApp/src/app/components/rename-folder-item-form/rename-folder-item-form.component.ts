import { Component, Inject } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms'
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'rename-folder-item-form',
  templateUrl: './rename-folder-item-form.component.html',
  styleUrls: ['./rename-folder-item-form.component.css']
})
export class RenameFolderItemFormComponent {

  constructor(@Inject(MAT_DIALOG_DATA) public data: { folderItemName: string }, private _dialogRef: MatDialogRef<RenameFolderItemFormComponent>) {
    this.renameForm.controls['newName'].setValue(data.folderItemName);
  }

  renameForm: FormGroup = new FormGroup({
    newName: new FormControl("", [Validators.required, Validators.maxLength(64)])
  });

  onFormSubmit() {

    if (!this.renameForm.valid)
      return;

    this._dialogRef.close(this.renameForm.get('newName')?.value)
  }
}
