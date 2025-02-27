import { CommonModule } from '@angular/common';
import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-quesetion-to-task',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './quesetion-to-task.component.html',
  styleUrls: ['./quesetion-to-task.component.css']
})
export class QuesetionToTaskComponent implements OnInit {
  @Input() taskId!: string; // ✅ Task ID'yi dışarıdan alacak
  @Output() close = new EventEmitter<void>(); // Modal kapanışını yönetecek
  pointOptions: number[] = Array.from({ length: 101 }, (_, i) => i);
  constructor() { }

  ngOnInit() {
    console.log("Gelen Task ID:", this.taskId); // ✅ Task ID'nin geldiğini kontrol et
  }

  closeModal() {
    this.close.emit(); // Parent component'e kapatma sinyali gönder
  }
}