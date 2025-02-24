import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Output } from '@angular/core';
import { Course } from '../../../common/models/course';
import { FormsModule } from '@angular/forms';
import { QuestionAddComponent } from '../question-add/question-add.component';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { CreateQuestionBankService } from '../../../common/services/create-question-bank.service';
import { HttpClientModule } from '@angular/common/http';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-create-question-bank-modal',
  standalone: true,
  imports: [CommonModule, FormsModule, HttpClientModule],
  templateUrl: './create-question-bank.component.html',
  styleUrls: ['./create-question-bank.component.css'],
  providers: [CreateQuestionBankService],
})
export class CreateQuestionBankModalComponent {
  @Output() modalClosed = new EventEmitter<void>();

  progressValue: number = 33;

  coursePeriod = ['2022-2023', '2023-2024', '2024-2025'];
  courseSeason = ['Güz', 'Bahar'];
  examCategory = ['Vize', 'Final', 'Quiz', 'Deneme', 'Ödev', 'Proje', 'Bütünleme'];

  courses = [
    { dersAdi: 'Fizik', dersKodu: '20250201' },
    { dersAdi: 'Kimya', dersKodu: '20250202' },
    { dersAdi: 'Matematik', dersKodu: '20250203' },
    { dersAdi: 'Biyoloji', dersKodu: '20250204' }
  ];

  examCategoryMap: { [key: string]: number } = {
    'Vize': 1,
    'Final': 2,
    'Quiz': 3,
    'Deneme': 4,
    'Ödev': 5,
    'Proje': 6,
    'Bütünleme': 7
  };

  questionBankTitle: string = '';
  selectedExamCategory: string | null = null;
  selectedCourse: any | null = null;
  selectedPeriod: string = '';
  selectedSeason: string = '';
  questionBankId: string = ''; // ID değişkenini string olarak başlattım

  constructor(private modalService: NgbModal, private questionBankService: CreateQuestionBankService) { }

  closeModal() {
    this.modalClosed.emit();
    this.modalService.dismissAll();
  }

  createQuestionBank() {
    if (!this.questionBankTitle || !this.selectedCourse || !this.selectedExamCategory || !this.selectedPeriod || !this.selectedSeason) {
      Swal.fire({
        icon: "error",
        text: "Lütfen tüm alanları doldurunuz!",
      });
      return;
    }

    const requestBody = {
      createdBy: 'emin',
      modifiedBy: '',
      deletedBy: '',
      createdDate: new Date().toISOString(),
      modifiedDate: new Date().toISOString(),
      deletedDate: new Date().toISOString(),
      isDeleted: false,
      dersAdi: this.selectedCourse.dersAdi,
      dersKodu: this.selectedCourse.dersKodu,
      dersSezonu: this.selectedSeason,
      dersDonemi: this.selectedPeriod,
      kategori: this.examCategoryMap[this.selectedExamCategory] || 0,
      kullaniciId: '121',
      kullaniciAdi: 'admin',
      konuBasligi: this.questionBankTitle
    };

    this.questionBankService.createQuestionBank(requestBody).subscribe(
      response => {
        this.questionBankId = response.data.id!;
        console.log('Soru Bankası:', response.data);
        console.log('Soru Bankası ID:', this.questionBankId);
        Swal.fire({
          position: "center",
          icon: "success",
          title: "Soru Bankası Oluşturuldu!",
          showConfirmButton: false,
          timer: 2000
        }).then(() => {
          this.modalClosed.emit();
          this.modalService.dismissAll();
          this.progressValue = 67;
          this.openQuestionAdd();
        })
      },
      error => {
        console.error('Soru bankası oluşturulurken hata oluştu:', error);
        alert('Soru bankası oluşturulamadı. Lütfen tekrar deneyin.');
      }
    );
  }

  openQuestionAdd() {
    if (!this.questionBankId) {
      alert('Soru bankası oluşturulmadan devam edemezsiniz.');
      return;
    }

    const modalRef = this.modalService.open(QuestionAddComponent, { size: 'lg', centered: true });
    modalRef.componentInstance.questionBankId = this.questionBankId;
    modalRef.componentInstance.progressValue = this.progressValue; 
  }

}