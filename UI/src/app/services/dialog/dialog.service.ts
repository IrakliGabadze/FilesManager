import { Injectable, reflectComponentType } from '@angular/core';
import { MatDialog, MAT_DIALOG_DATA, MatDialogRef, MatDialogModule } from '@angular/material/dialog';

@Injectable({
  providedIn: 'root'
})
export class DialogService {

  constructor(private dialog: MatDialog) { }

  openWithResult<T, R>(component: { new(...args: any[]): T }, config?: any): MatDialogRef<T, R> {
    return this.dialog.open(component, config);
  }

  open<T>(component: { new(...args: any[]): T }, config?: any): MatDialogRef<T> {
    return this.dialog.open(component, config);
  }
}
