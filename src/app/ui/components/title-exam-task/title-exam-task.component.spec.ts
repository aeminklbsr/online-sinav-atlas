/* tslint:disable:no-unused-variable */
import {  ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { CreateExamTaskComponent } from './title-exam-task.component';

describe('CreateExamTaskComponent', () => {
  let component: CreateExamTaskComponent;
  let fixture: ComponentFixture<CreateExamTaskComponent>;

  beforeEach((() => {
    TestBed.configureTestingModule({
      declarations: [ CreateExamTaskComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateExamTaskComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
