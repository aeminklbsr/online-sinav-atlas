import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { CreateQuestionBank } from '../../../common/models/create-question-bank';
import { CreateQuestionBankService } from '../../../common/services/create-question-bank.service';

import Swal from 'sweetalert2';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-details-question-bank',
  standalone: true,
  imports: [RouterModule, CommonModule, FormsModule],
  templateUrl: './details-question-bank.component.html',
  styleUrls: ['./details-question-bank.component.css'],

})
export class DetailsQuestionBankComponent implements OnInit {
  @Input() bank!: CreateQuestionBank;
  @Output() modalClosed = new EventEmitter<void>();
  @Output() bankUpdated = new EventEmitter<CreateQuestionBank>();

  editMode: boolean = false;
  updatedBank: CreateQuestionBank = {} as CreateQuestionBank;

  courseSeasons: string[] = ['Bahar', 'Güz'];
  coursePeriods: string[] = ['2022-2023', '2023-2024', '2024-2025'];


  constructor(private questionBankService: CreateQuestionBankService) { }

  ngOnInit() {
    this.updatedBank = { ...this.bank }; // Gelen veriyi kopyala
  }

  saveChanges() {
    this.updatedBank.modifiedBy = 'emin'; // Düzenleyen kişi
    this.updatedBank.modifiedDate = new Date().toISOString(); // Güncel tarih

    this.questionBankService.updateQuestionBank(this.updatedBank).subscribe({
      next: (response) => {
        Swal.fire({
          icon: 'success',
          title: 'Güncellendi!',
          text: `Soru bankası başarıyla güncellendi.`,
          timer: 2000,
          showConfirmButton: false
        }).then(() => {
          this.bank = { ...this.updatedBank }; // Modalde güncellenmiş veriler görünsün
          this.editMode = false;               // Düzenleme modundan çık
          this.bankUpdated.emit(this.updatedBank);
        });
      },
      error: (err) => {
        console.error('Güncelleme hatası:', err);
        Swal.fire({
          icon: 'error',
          title: 'Hata!',
          text: 'Güncelleme sırasında bir hata oluştu. Lütfen tekrar deneyin.'
        });
      }
    });
  }

  closeModal() {
    this.modalClosed.emit();

  }
}


