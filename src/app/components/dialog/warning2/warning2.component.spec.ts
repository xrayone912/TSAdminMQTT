/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { Warning2Component } from './warning2.component';

describe('Warning2Component', () => {
  let component: Warning2Component;
  let fixture: ComponentFixture<Warning2Component>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ Warning2Component ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(Warning2Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
