import { Component, EventEmitter, OnInit } from '@angular/core';

@Component({
  selector: 'app-warning',
  templateUrl: './warning.component.html',
  styleUrls: ['./warning.component.scss']
})
export class WarningComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  }

  onAdd = new EventEmitter();
  
  onButtonClick() {
    this.onAdd.emit();
  }
}
