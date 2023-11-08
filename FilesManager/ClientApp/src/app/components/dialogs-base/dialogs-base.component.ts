import { Component, Inject, Input, ViewEncapsulation } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'dialogs-base',
  templateUrl: './dialogs-base.component.html',
  styleUrls: ['./dialogs-base.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class DialogsBaseComponent {

  @Input() headerText?: string;

  constructor(private _dialogRef: MatDialogRef<DialogsBaseComponent>, @Inject(MAT_DIALOG_DATA) public data: { headerText: string }) {}

  close() {
    this._dialogRef.close();
  }
}
