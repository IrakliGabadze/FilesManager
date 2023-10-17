import {Component, Inject} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';

@Component({
  selector: 'dialog',
  templateUrl: './dialog.component.html',
  styleUrls: ['./dialog.component.css']
})
export class DialogComponent {
  constructor(@Inject(MAT_DIALOG_DATA) public data: {folderItemName: string}, private dialogRef: MatDialogRef<DialogComponent>) { }

  //closeDialog(confirmed: boolean) {
  //  this.dialogRef.close(confirmed);
  //}
}
