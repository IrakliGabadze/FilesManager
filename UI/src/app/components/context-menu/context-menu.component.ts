import { Component, EventEmitter, Input, Output, ViewChild, ViewEncapsulation } from '@angular/core';
import { MatMenuTrigger } from '@angular/material/menu';
import { FolderItemComponent } from '../folder-item/folder-item.component';

@Component({
  selector: 'context-menu',
  templateUrl: './context-menu.component.html',
  styleUrls: ['./context-menu.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class ContextMenuComponent<TItem> {

  FolderItemComponent = FolderItemComponent;

  @Input() menuItemsWithIcons?: [string, string][];

  @Output() menuItemClick = new EventEmitter<[string, TItem]>();

  @ViewChild(MatMenuTrigger)
  contextMenu!: MatMenuTrigger;

  contextMenuPosition = { x: '0px', y: '0px' };

  tItem?: TItem;

  onContextMenu(event: MouseEvent, tItem: TItem) {
    event.preventDefault();
    this.tItem = tItem;
    this.contextMenuPosition.x = event.clientX + 'px';
    this.contextMenuPosition.y = event.clientY + 'px';
    //this.contextMenu.menuData = { 'item': tItem };
    this.contextMenu.openMenu();
  }

  closeContextMenu() {
    this.tItem = undefined;
    this.contextMenu.closeMenu();
  }

  onContextMenuItemClicked(actionTypeName: string) {

    if (this.tItem != undefined)
      this.menuItemClick.emit([actionTypeName, this.tItem]);

    this.closeContextMenu();
  }
}
