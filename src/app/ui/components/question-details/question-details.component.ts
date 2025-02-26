import { Component, Input, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { QuestionAddService } from '../../../common/services/question-add.service';
import { QuestionAdd } from '../../../common/models/question-add';
import Swal from 'sweetalert2';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { QuestionOptionService } from '../../../common/services/question-option.service';
import { QuestionAnswerKeyService } from '../../../common/services/question-answer-key.service';
import { QuestionAnswerKey } from '../../../common/models/question-answer-key';
import { QuestionOption } from '../../../common/models/question-option';

@Component({
  selector: 'app-question-details',
  standalone: true,
  imports: [CommonModule, FormsModule, HttpClientModule],
  templateUrl: './question-details.component.html',
  styleUrls: ['./question-details.component.css'],
  providers: [QuestionAddService, QuestionOptionService, QuestionAnswerKeyService]
})
export class QuestionDetailsComponent implements OnInit {
  @Input() question!: QuestionAdd;
  @Input() questionBankId!: string;
  editableQuestion!: QuestionAdd;
  editableDifficulty!: string;  // Zorluk için geçici string değer
  questionDifficulty: string[] = ['Kolay', 'Orta', 'Zor'];
  options: QuestionOption[] = [];
  answerKey!: QuestionAnswerKey;
  optionLetters: string[] = ['A', 'B', 'C', 'D', 'E', 'F'];

  constructor(
    public activeModal: NgbActiveModal,
    private questionAddService: QuestionAddService,
    private questionOptionService: QuestionOptionService,
    private questionAnswerKeyService: QuestionAnswerKeyService
  ) {}

  ngOnInit() {
    this.editableQuestion = { ...this.question };
    this.editableDifficulty = this.questionDifficulty[(this.question.zorluk || 1) - 1];  
    this.fetchOptions();
    this.fetchAnswerKey();
  }

  saveAllChanges() {
  const updatedQuestion: QuestionAdd = {
    ...this.editableQuestion,
    soruBankasiId: this.questionBankId,
    modifiedBy: 'emin',
    modifiedDate: new Date().toISOString(),
    zorluk: this.questionDifficulty.indexOf(this.editableDifficulty) + 1
  };

  const updatedOptions = this.options.map(option => ({
    ...option,
    modifiedBy: 'emin',
    modifiedDate: new Date().toISOString()
  }));

  const updatedAnswerKey: QuestionAnswerKey = {
    ...this.answerKey,
    soruSecenekId: this.answerKey.soruSecenekId,
    modifiedBy: 'emin',
    modifiedDate: new Date().toISOString()
  };

  // Tüm güncellemeleri paralel çalıştır
  Promise.all([
    this.questionAddService.updateQuestion(updatedQuestion).toPromise(),
    ...updatedOptions.map(option => this.questionOptionService.updateQuestionOption(option).toPromise()),
    this.questionAnswerKeyService.updateAnswerKey(updatedAnswerKey).toPromise()
  ])
    .then(() => {
      Swal.fire({
        icon: 'success',
        title: 'Başarı!',
        text: 'Tüm değişiklikler başarıyla kaydedildi.',
        timer: 1500,
        showConfirmButton: false
      }).then(() => {
        this.activeModal.close();  // Modal kapatılır
      });
    })
    .catch(() => {
      Swal.fire({
        icon: 'error',
        title: 'Hata!',
        text: 'Güncelleme sırasında bir hata oluştu.'
      });
    });
}

  fetchOptions() {
    this.questionOptionService.getOptionsByQuestionId(this.question.id!).subscribe({
      next: (response) => {
        this.options = response.data.sort((a, b) => a.secenekSirasi - b.secenekSirasi);
      },
      error: (err) => console.error('Seçenekler getirilirken hata:', err)
    });
  }

  fetchAnswerKey() {
    this.questionAnswerKeyService.getAnswerKeyByQuestionId(this.question.id!).subscribe({
      next: (response) => {
        if (response.data.length > 0) {
          this.answerKey = response.data[0];
        }
      },
      error: (err) => console.error('Cevap anahtarı getirilirken hata:', err)
    });
  }

  updateOption(option: QuestionOption) {
    const updatedOption: QuestionOption = {
      ...option,
      modifiedBy: 'emin',
      modifiedDate: new Date().toISOString()
    };
  
    this.questionOptionService.updateQuestionOption(updatedOption).subscribe({
      next: () => {
        console.log('Seçenek başarıyla güncellendi.');
      },
      error: () => {
        console.error('Seçenek güncellenirken hata oluştu.');
      }
    });
  }

  updateAnswerKey(optionId: string) {
    const updatedAnswerKey: QuestionAnswerKey = {
      ...this.answerKey,
      soruSecenekId: optionId,
      modifiedBy: 'emin',
      modifiedDate: new Date().toISOString()
    };
  
    this.questionAnswerKeyService.updateAnswerKey(updatedAnswerKey).subscribe({
      next: () => {
        this.answerKey.soruSecenekId = optionId;  // Başarı sonrası veriyi güncelle
        console.log('Cevap anahtarı başarıyla güncellendi.');
      },
      error: () => {
        console.error('Cevap anahtarı güncellenirken hata oluştu.');
      }
    });
  }
}