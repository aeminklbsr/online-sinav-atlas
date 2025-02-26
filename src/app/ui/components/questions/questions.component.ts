import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';
import { QuestionAdd } from '../../../common/models/question-add';
import { QuestionAddService } from '../../../common/services/question-add.service';
import { CommonModule } from '@angular/common';
import { QuestionOption } from '../../../common/models/question-option';
import { QuestionOptionService } from '../../../common/services/question-option.service';
import { QuestionAnswerKeyService } from '../../../common/services/question-answer-key.service';
import { QuestionDetailsComponent } from '../question-details/question-details.component';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { QuestionAddComponent } from '../question-add/question-add.component';

@Component({
  selector: 'app-questions',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './questions.component.html',
  styleUrls: ['./questions.component.css'],
  providers: [QuestionAddService, QuestionOptionService, QuestionAnswerKeyService]
})
export class QuestionsComponent implements OnInit {
  @Output() modalClosed = new EventEmitter<void>();
  @Input() questionBankId!: string;
  questions: QuestionAdd[] = [];
  optionsMap: { [soruId: string]: QuestionOption[] } = {};
  answerKeyMap: { [soruId: string]: string } = {};
  optionLetters: string[] = ['A', 'B', 'C', 'D', 'E', 'F'];
  questionDifficulty: string[] = ['Kolay', 'Orta', 'Zor'];

  constructor(
    private questionAddService: QuestionAddService,
    private questionOptionService: QuestionOptionService,
    private questionAnswerKeyService: QuestionAnswerKeyService,
    private modalService: NgbModal
  ) {}

  ngOnInit(): void {
    if (this.questionBankId) {
      this.fetchQuestions();
    }
  }

  fetchQuestions(): void {
    this.questionAddService.getQuestionsByQuestionBankId(this.questionBankId).subscribe({
      next: (response) => {
        this.questions = response.data;
        this.questions.forEach(question => {

          this.fetchOptionsForQuestion(question.id!);
          this.fetchAnswerKeyForQuestion(question.id!);
        });
      },
      error: (err) => {
        console.error('Sorular getirilirken hata:', err);
      }
    });
  }

  fetchOptionsForQuestion(soruId: string): void {
    this.questionOptionService.getOptionsByQuestionId(soruId).subscribe({
      next: (response) => {
        this.optionsMap[soruId] = response.data.sort((a, b) => a.secenekSirasi - b.secenekSirasi);
        this.optionsMap[soruId].forEach(option => {
          
        });
      },
      error: (err) => {
        console.error(`Seçenekler getirilirken hata (soruId: ${soruId}):`, err);
      }
    });
  }

  fetchAnswerKeyForQuestion(soruId: string): void {
    this.questionAnswerKeyService.getAnswerKeyByQuestionId(soruId).subscribe({
      next: (response) => {
        if (response.data.length > 0) {
          const cevapAnahtariId = response.data[0].id;
          const soruSecenekId = response.data[0].soruSecenekId;
          this.answerKeyMap[soruId] = soruSecenekId;

          
        }
      },
      error: (err) => console.error(`Cevap anahtarı getirilirken hata (soruId: ${soruId}):`, err)
    });
  }

  isCorrectOption(soruId: string, optionId: string): boolean {
    return this.answerKeyMap[soruId] === optionId;
  }

  closeModal() {
    this.modalClosed.emit();
  }

  openEditModal(question: QuestionAdd) {
    const modalRef = this.modalService.open(QuestionDetailsComponent, { size: 'lg', centered: true });
    modalRef.componentInstance.question = question;
    modalRef.componentInstance.questionBankId = this.questionBankId;

    modalRef.result.then(() => {
      this.fetchQuestions(); //soruları tekrar çağırıp yenileme
    }).catch(() => {});
  }

  openAddQuestionModal() {
    const modalRef = this.modalService.open(QuestionAddComponent, { size: 'lg', centered: true });
    modalRef.componentInstance.questionBankId = this.questionBankId; // Soru bankası ID'sini gönderiyoruz
  
    modalRef.result.then(() => {
      this.fetchQuestions(); // Modal kapandıktan sonra soru listesini güncelle
    }).catch(() => {});
  }
  
}
