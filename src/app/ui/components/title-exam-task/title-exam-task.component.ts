import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ExamTaskService } from '../../../common/services/exam-task.service';
import { ExamTask } from '../../../common/models/exam-task';
import { CreateQuestionBank } from '../../../common/models/create-question-bank';
import Swal from 'sweetalert2';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-create-exam-task',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './title-exam-task.component.html',
  styleUrls: ['./title-exam-task.component.css'],
  providers: [ExamTaskService]
})

export class CreateExamTaskComponent implements OnInit {
  @Input() questionBanks: CreateQuestionBank[] = []; // **Tüm soru bankalarını al**
  @Output() taskCreated = new EventEmitter<void>(); 
  @Output() close = new EventEmitter<void>();
  @Output() openQuesetionToTask = new EventEmitter<string>();

  selectedQuestionBankId: string = ''; // **Kullanıcının seçtiği soru bankası ID**

  examTaskData: ExamTask = {
    soruBankasiId: '',
    soruTaslakAdi: '',
    aciklama: '',
    isDeleted: false,
    createdBy: 'emin',
    createdDate: new Date().toISOString()
  };

  constructor(private examTaskService: ExamTaskService) {}

  ngOnInit() {}


createExamTask() {
  if (!this.selectedQuestionBankId) {
    Swal.fire({
      icon: 'warning',
      title: 'Uyarı!',
      text: 'Lütfen bir soru bankası seçin!'
    });
    return;
  }
  
  if (!this.examTaskData.soruTaslakAdi.trim() || !this.examTaskData.aciklama.trim()) {
    Swal.fire({
      icon: 'warning',
      title: 'Uyarı!',
      text: 'Taslak adı ve açıklama boş bırakılamaz!'
    });
    return;
  }

  this.examTaskData.soruBankasiId = this.selectedQuestionBankId;

  this.examTaskService.createExamTask(this.examTaskData).subscribe({
    next: (response) => {
      console.log('Taslak Başarıyla Eklendi:', response.data);

      Swal.fire({
        position: "center",
        icon: "success",
        title: "Soru Taslağı Başarıyla Oluşturuldu!",
        showConfirmButton: false,
        timer: 1500
      });

      this.taskCreated.emit();
      this.resetForm();
      this.close.emit(); // **Bu modalı kapat**
      this.openQuesetionToTask.emit(response.data.id); // **Yeni modalı aç**
    },
    error: (err) => {
      console.error('Hata:', err);
      Swal.fire({
        icon: "error",
        title: "Hata!",
        text: "Soru taslağı oluşturulurken bir hata oluştu!"
      });
    }
  });
}
  resetForm() {
    this.examTaskData.soruTaslakAdi = '';
    this.examTaskData.aciklama = '';
    this.selectedQuestionBankId = '';
  }

  closeModal() {
    this.close.emit();
  }

  nextModal() {
    this.close.emit(); // 🔥 Mevcut modali kapat
    this.openQuesetionToTask.emit(); // 🔥 Yeni modali aç
  }
}