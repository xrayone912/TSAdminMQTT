import { Component, EventEmitter, OnInit } from '@angular/core';

@Component({
  selector: 'app-warning2',
  templateUrl: './warning2.component.html',
  styleUrls: ['./warning2.component.scss']
})
export class Warning2Component implements OnInit {

  constructor() { }

  ngOnInit() {
  }

  onAdd = new EventEmitter();
  
 public onButtonClick() {
    this.onAdd.emit();
  }
}
