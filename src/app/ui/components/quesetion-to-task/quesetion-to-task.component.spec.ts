/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { QuesetionToTaskComponent } from './quesetion-to-task.component';

describe('QuesetionToTaskComponent', () => {
  let component: QuesetionToTaskComponent;
  let fixture: ComponentFixture<QuesetionToTaskComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ QuesetionToTaskComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(QuesetionToTaskComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
