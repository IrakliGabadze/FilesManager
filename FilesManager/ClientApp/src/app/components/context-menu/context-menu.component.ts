import { Component, ElementRef, EventEmitter, Input, Output, ViewChild, ViewEncapsulation } from '@angular/core';
import { MatMenuTrigger } from '@angular/material/menu';
import { FolderItemComponent } from '../folder-item/folder-item.component';

@Component({
  selector: 'context-menu',
  templateUrl: './context-menu.component.html',
  styleUrls: ['./context-menu.component.css']
})
export class ContextMenuComponent<TItem> {

  FolderItemComponent = FolderItemComponent;

  @Input() menuItemsWithIcons?: [string, string][];

  @Output() menuItemClick = new EventEmitter<[string, TItem]>();

  @ViewChild(MatMenuTrigger)
  contextMenu!: MatMenuTrigger;

  @ViewChild("contextMenuRenderer")
  renderDivRef!: ElementRef<HTMLDivElement>; 

  tItem?: TItem;

  onContextMenu(event: MouseEvent, tItem: TItem) {
    event.preventDefault();
    this.tItem = tItem;
    this.renderDivRef.nativeElement.style.left = event.clientX + 'px';
    this.renderDivRef.nativeElement.style.top = event.clientY + 'px';
    this.contextMenu.openMenu();
  }

  onContextMenuItemClicked(actionTypeName: string) {

    if (this.tItem != undefined)
      this.menuItemClick.emit([actionTypeName, this.tItem]);

    this.closeContextMenu();
  }

  closeContextMenu() {
    this.tItem = undefined;
    this.contextMenu.closeMenu();
  }
}
