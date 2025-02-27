import { Component, OnInit } from '@angular/core';
import { SidebarComponent } from "../../../components/sidebar/sidebar.component";
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { CreateQuestionBankModalComponent } from '../../../components/create-question-bank/create-question-bank.component';
import { DetailsQuestionBankComponent } from '../../../components/details-question-bank/details-question-bank.component';
import { CreateExamTaskComponent } from '../../../components/title-exam-task/title-exam-task.component';

import { CreateQuestionBankService } from '../../../../common/services/create-question-bank.service';
import { CreateQuestionBank } from '../../../../common/models/create-question-bank';
import Swal from 'sweetalert2';
import { QuestionsComponent } from '../../../components/questions/questions.component';
import { FormsModule } from '@angular/forms';
import { ExamTasksComponent } from "../../../components/exam-tasks/exam-tasks.component";
import { QuesetionToTaskComponent } from "../../../components/quesetion-to-task/quesetion-to-task.component";


@Component({ 
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterLink, SidebarComponent, CreateQuestionBankModalComponent, DetailsQuestionBankComponent, QuestionsComponent, FormsModule, CreateExamTaskComponent, ExamTasksComponent, QuesetionToTaskComponent],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css'],
  providers: [CreateQuestionBankService]
})
export class TeacherDashboardComponent implements OnInit {

  questionBanks: CreateQuestionBank[] = [];
  paginatedQuestionBanks: CreateQuestionBank[] = [];
  selectedQuestionBank: CreateQuestionBank | null = null;
  isQuestionsModalOpen = false;
  page = 1;
  itemsPerPage = 5;
  totalPages = 1;
  showDeleted = true;
  isModalOpen = false;
  isDetailsModalOpen = false;
  isCreateExamTaskModalOpen = false;
  isExamTaskModalOpen = false;

  constructor(private questionBankService: CreateQuestionBankService, ) {}

  ngOnInit(): void {
    this.getQuestionBanks();
  }

  getQuestionBanks(): void {
    this.questionBankService.getFilteredQuestionBanks().subscribe({
      next: (response) => {
        this.questionBanks = response.data.sort((a, b) => 
          new Date(b.createdDate).getTime() - new Date(a.createdDate).getTime()
        );
        
        this.calculateTotalPages();
        this.updatePagination();
        this.filterQuestionBanks();
      },
      error: (err) => {
        console.error('Hata:', err);
      }
    });
  }

  filterQuestionBanks(): void {
    const filteredBanks = this.showDeleted
      ? this.questionBanks
      : this.questionBanks.filter(bank => !bank.isDeleted);

    this.totalPages = Math.ceil(filteredBanks.length / this.itemsPerPage);
    const startIndex = (this.page - 1) * this.itemsPerPage;
    const endIndex = startIndex + this.itemsPerPage;
    this.paginatedQuestionBanks = filteredBanks.slice(startIndex, endIndex);
  }

  calculateTotalPages() {
    this.totalPages = Math.ceil(this.questionBanks.length / this.itemsPerPage);
  }

  updatePagination() {
    const startIndex = (this.page - 1) * this.itemsPerPage;
    const endIndex = startIndex + this.itemsPerPage;
    this.paginatedQuestionBanks = this.questionBanks.slice(startIndex, endIndex);
  }

  nextPage(event: Event) {
    event.preventDefault();
    if (this.page < this.totalPages) {
      this.page++;
      
      this.updatePagination();
      this.filterQuestionBanks();
    }
  }
  
  prevPage(event: Event) {
    event.preventDefault();
    if (this.page > 1) {
      this.page--;
      
      this.updatePagination();
      this.filterQuestionBanks();
    }
  }

  openModal() {
    this.isModalOpen = true;
  }

  closeModal() {
    this.isModalOpen = false;
  }

  openDetailsModal(bank: CreateQuestionBank) {
    this.isDetailsModalOpen = true;
    this.selectedQuestionBank = bank;
  }

  closeDetailsModal() {
    this.isDetailsModalOpen = false;
  }

openExamTaskModal() {
    this.isExamTaskModalOpen = true;  // Modal açılır
  }

  closeExamTaskModal() {
    this.isExamTaskModalOpen = false;  // Modal kapanır
  }
  

  updateBankInList(updatedBank: CreateQuestionBank) {
    const index = this.questionBanks.findIndex(bank => bank.id === updatedBank.id);
    if (index !== -1) {
      this.questionBanks[index] = { ...updatedBank }; 
      
      this.updatePagination();
      this.filterQuestionBanks();                        
    }
  }

  deleteQuestionBank(bank: CreateQuestionBank) {
    Swal.fire({
      title: 'Emin misiniz?',
      text: `"${bank.konuBasligi}" başlıklı soru bankasını pasif hale mi getirmek istiyorsun?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Evet, sil!',
      cancelButtonText: 'İptal'
    }).then((result) => {
      if (result.isConfirmed) {
        this.questionBankService.deleteQuestionBank(bank.id!, 'emin').subscribe({
          next: () => {
            Swal.fire({
              icon: 'success',
              title: 'Silindi!',
              text: `"${bank.konuBasligi}" başlıklı soru bankası başarıyla pasif hale getirildi.`,
              timer: 2000,
              showConfirmButton: false
            });
            this.getQuestionBanks();
          },
          error: (err) => {
            console.error('Silme hatası:', err);
            Swal.fire({
              icon: 'error',
              title: 'Hata!',
              text: 'Soru bankası silinirken bir hata oluştu. Lütfen tekrar deneyin.'
            });
          }
        });
      }
    });
  }

  openQuestionsModal(bank: CreateQuestionBank) {
    if (!bank.id) {
      console.error('Soru bankası ID bulunamadı!');
      return;
    }
    this.selectedQuestionBank = bank;
    this.isQuestionsModalOpen = true;
  }

  closeQuestionsModal() {
    this.isQuestionsModalOpen = false;
  }

  openCreateExamTaskModal() {
    this.isCreateExamTaskModalOpen = true; // Modalı aç
  }
  
  closeCreateExamTaskModal() {
    this.isCreateExamTaskModalOpen = false; // Modalı kapat
  }
  
  onTaskCreated() {
    this.isCreateExamTaskModalOpen = false; // Modalı kapat
    this.getQuestionBanks(); // Güncellenmiş listeyi al
  }

  isQuesetionToTaskModalOpen = false; // Yeni modal için kontrol
taskId: string = ''; // Yeni oluşturulan task ID'yi tutacağız

openQuesetionToTaskModal(taskId: string) {
  this.taskId = taskId; // Task ID'yi set et
  this.isQuesetionToTaskModalOpen = true;
}

closeQuesetionToTaskModal() {
  this.isQuesetionToTaskModalOpen = false;
}
  
}