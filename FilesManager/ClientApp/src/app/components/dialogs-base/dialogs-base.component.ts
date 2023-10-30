import { Component, ViewEncapsulation } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'dialogs-base',
  templateUrl: './dialogs-base.component.html',
  styleUrls: ['./dialogs-base.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class DialogsBaseComponent {

  constructor(private _dialogRef: MatDialogRef<DialogsBaseComponent>) {}

  close() {
    this._dialogRef.close();
  }
}
