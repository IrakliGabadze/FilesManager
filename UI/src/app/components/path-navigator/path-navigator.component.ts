import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges } from '@angular/core';

@Component({
  selector: 'path-navigator',
  templateUrl: './path-navigator.component.html',
  styleUrls: ['./path-navigator.component.css']
})
export class PathNavigatorComponent implements OnChanges {

  ngOnChanges(changes: SimpleChanges): void {

    if (this.currentFolderItemPath == undefined) {
      this.currentPathItems = PathNavigatorComponent.rootPathItem;
    } else {
      let splitPath = this.currentFolderItemPath.split("\\");
      this.currentPathItems = PathNavigatorComponent.rootPathItem.concat(splitPath);
    }

    this.defineReturnBackIconClass(this.currentFolderItemPath);
  }

  @Input() currentFolderItemPath?: string;

  @Output() pathItemClick: EventEmitter<string> = new EventEmitter();

  static rootPathItem: Array<string> = ["Root"];

  static navbackIconEnabledClassName = "navBackIconEnabled";
  static navbackIconDisabledClassName = "navBackIconDisabled";

  currentPathItems!: Array<string>;
  returnBackIconClass?: string;

  pathItemNeedsSlashToEnd(index: number): boolean {

    if ((index == 1 && this.currentPathItems.length == 1) || index == this.currentPathItems.length - 1)
      return false;

    return true;
  }

  pathItemClicked(index: number) {

    let path = undefined;

    if (index != 0) {
      var wantedPathItems = this.currentPathItems.slice(1, index + 1);
      path = wantedPathItems.join("\\");
    }

    this.pathItemClick.emit(path);
  }

  returnBackIconClicked() {
    this.pathItemClicked(this.currentPathItems.length - 2);
  }

  defineReturnBackIconClass(path?:string) {
    this.returnBackIconClass = path == undefined ?
    PathNavigatorComponent.navbackIconDisabledClassName :
    PathNavigatorComponent.navbackIconEnabledClassName;
  }
}
