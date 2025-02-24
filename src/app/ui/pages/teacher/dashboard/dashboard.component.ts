import { Component, OnInit } from '@angular/core';
import { SidebarComponent } from "../../../components/sidebar/sidebar.component";
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { CreateQuestionBankModalComponent } from '../../../components/create-question-bank/create-question-bank.component';
import { DetailsQuestionBankComponent } from '../../../components/details-question-bank/details-question-bank.component';
import { CreateQuestionBankService } from '../../../../common/services/create-question-bank.service';
import { CreateQuestionBank } from '../../../../common/models/create-question-bank';
import Swal from 'sweetalert2';
import { QuestionsComponent } from '../../../components/questions/questions.component';

@Component({ 
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterLink, SidebarComponent, CreateQuestionBankModalComponent, DetailsQuestionBankComponent,QuestionsComponent],
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

  constructor(private questionBankService: CreateQuestionBankService) {}

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
        console.log('Soru Bankaları:', this.questionBanks);
      },
      error: (err) => {
        console.error('Hata:', err);
      }
    });
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
    event.preventDefault(); // Sayfanın yenilenmesini önler
    if (this.page < this.totalPages) {
      this.page++;
      this.updatePagination();
    }
  }
  
  prevPage(event: Event) {
    event.preventDefault(); // Sayfanın yenilenmesini önler
    if (this.page > 1) {
      this.page--;
      this.updatePagination();
    }
  }
  

  isModalOpen = false;
  isDetailsModalOpen = false;

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

  updateBankInList(updatedBank: CreateQuestionBank) {
    const index = this.questionBanks.findIndex(bank => bank.id === updatedBank.id);
    if (index !== -1) {
      this.questionBanks[index] = { ...updatedBank };  // Ana listeyi güncelle
      this.updatePagination();                         // Sayfalama ve liste görünümünü yenile
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
            this.getQuestionBanks(); // Listeyi yenile
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
}