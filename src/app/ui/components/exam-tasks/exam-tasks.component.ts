import { Component, EventEmitter, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-exam-task',
  templateUrl: './exam-tasks.component.html',
  styleUrls: ['./exam-tasks.component.css']
})
export class ExamTasksComponent implements OnInit {
  @Output() close = new EventEmitter<void>();

  constructor() { }

  ngOnInit() {
  }

  closeModal() {
    this.close.emit();  // Parent component'e kapatma sinyali gönderir
  }
}
