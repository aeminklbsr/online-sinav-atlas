import { Component, Input } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { QuestionAddService } from '../../../common/services/question-add.service';
import { QuestionOptionService } from '../../../common/services/question-option.service';
import { QuestionAnswerKeyService } from '../../../common/services/question-answer-key.service';
import { CreateQuestionBankModalComponent } from '../create-question-bank/create-question-bank.component';
import { HttpClientModule } from '@angular/common/http';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-question-add',
  standalone: true,
  imports: [CommonModule, FormsModule, HttpClientModule],
  templateUrl: './question-add.component.html',
  styleUrls: ['./question-add.component.css'],
  providers: [QuestionAddService, QuestionOptionService, QuestionAnswerKeyService],
})
export class QuestionAddComponent {
  @Input() questionBankId!: string;
  @Input() progressValue: number = 67;
  questionId: string = '';
  optionIds: string[] = []; // Şık ID'lerini burada tutacağız

  pointOptions: number[] = Array.from({ length: 101 }, (_, i) => i);
  optionCounts: string[] = ['A, B', 'A, B, C', 'A, B, C, D', 'A, B, C, D, E', 'A, B, C, D, E, F'];

  questionData = {
    title: '',
    points: 0,
    difficulty: 'Kolay',
    type: 'Çoktan Seçmeli',
    optionCount: 'A, B, C',
    options: [] as { label: string; text: string; correct: boolean; id?: string; soruId?: string }[],
    status: 'Aktif'
    
  };

  constructor(
    private modalService: NgbModal,
    private questionAddService: QuestionAddService,
    private questionOptionService: QuestionOptionService,
    private questionAnswerKeyService: QuestionAnswerKeyService
  ) {}

  onQuestionTypeChange() {
    if (this.questionData.type !== 'Çoktan Seçmeli') {
      this.questionData.options = [];
    } else {
      this.generateOptions();
    }
  }

  generateOptions() {
    const optionLabels: { [key: string]: string[] } = {
      'A, B': ['A', 'B'],
      'A, B, C': ['A', 'B', 'C'],
      'A, B, C, D': ['A', 'B', 'C', 'D'],
      'A, B, C, D, E': ['A', 'B', 'C', 'D', 'E'],
      'A, B, C, D, E, F': ['A', 'B', 'C', 'D', 'E', 'F']
    };

    const selectedOptions = optionLabels[this.questionData.optionCount] || [];
    this.questionData.options = selectedOptions.map(label => ({
      label,
      text: '',
      correct: false,
      id: undefined, // Başlangıçta undefined, sonra API’den gelen ID ile güncellenecek
      soruId: undefined
    }));
  }

  saveQuestion() {
    
    if (!this.questionBankId) {
      alert('Önce soru bankası oluşturulmalı!');
      return;
    }
    if ( !this.questionData.title || !this.questionData.points || !this.questionData.difficulty || !this.questionData.type || !this.questionData.optionCount) {
      alert('Lütfen tüm alanları doldurun.');
      return;

    }
  
    const questionData = {
      questionId: this.questionId,
      soruBankasiId: this.questionBankId,
      soruMetni: this.questionData.title,
      puan: Number(this.questionData.points),
      zorluk: this.getDifficultyValue(),
      soruTipi: this.getQuestionTypeValue(),
      aktifMi: this.questionData.status === 'Aktif',
      dogruSecenek: this.getCorrectOptionIndex(),
      createdBy: 'emin',
      createdDate: new Date().toISOString(),
      modifiedBy: '',
      modifiedDate: new Date().toISOString(),
      deletedBy: '',
      deletedDate: null,
      isDeleted: false
    };
  
    console.log('API’ye Gönderilen Soru Verisi:', questionData);
  
    this.questionAddService.addQuestion(questionData).subscribe(
      response => {
        this.questionId = response.data.id!;
        console.log('Soru Eklendi. ID:', this.questionId);
        
        this.addOptionsAndAnswerKey();
      },
      error => {
        console.log('API Hata Detayı:', error.error);
      }
    );
  }
  
  addOptionsAndAnswerKey() {
    this.optionIds = [];
    console.log('📌 API’ye Gönderilecek Şıklar:', this.questionData.options);
  
    const secenekEklemeIslemleri = this.questionData.options.map((option, index) => {
      return new Promise<void>((resolve, reject) => {
        const optionData = {
          id: option.id || '',
          soruId: this.questionId, // **Doğru soru ID atanıyor**
          secenekSirasi: index + 1,
          secenekMetni: option.text,
          aktifMi: true,
          createdBy: 'emin',
          createdDate: new Date().toISOString(),
          modifiedBy: '',
          modifiedDate: new Date().toISOString(),
          deletedBy: '',
          deletedDate: null,
          isDeleted: false
        };
  
        this.questionOptionService.addQuestionOption(optionData).subscribe(response => {
          const optionId = response.data.id; // API’den dönen ID
          if (!optionId) {
            console.log('API’den geçerli bir şık ID dönmedi!');
            reject('Geçersiz ID');
            return;
          }
          option.id = optionId; // **Şık ID'sini güncelle**
          option.soruId = this.questionId;
          this.optionIds.push(optionId);
          console.log(`Şık ${index + 1} Eklendi. ID:`, optionId);
          resolve();
        }, error => {
          console.log('Şık Eklerken Hata:', error);
          reject(error);
        });
      });
    });
  
    // **Tüm şıklar başarıyla eklendikten sonra cevap anahtarını ekle**
    Promise.all(secenekEklemeIslemleri).then(() => {
      console.log('Tüm şıklar başarıyla eklendi.');
  
      // **Doğru şık ID'sini bul ve cevap anahtarına ekle**
      const correctOption = this.questionData.options.find(option => option.correct);
      
      if (correctOption && correctOption.id) {
        console.log(`Doğru şık ID’si bulundu: ${correctOption.id}`);
        this.addAnswerKey(correctOption.id);
      } else {
        console.log('Doğru şık bulunamadı veya ID boş.');
      }
    });
  }
  
  addAnswerKey(correctOptionId: string) {
    if (!this.questionId) {
      alert('Önce soru eklenmeli!');
      return;
    }
  
    const answerKeyData = {
      id: '',
      soruId: this.questionId, 
      soruSecenekId: correctOptionId, // **Doğru şık ID’sini burada gönderiyoruz**
      createdBy: 'emin',
      createdDate: new Date().toISOString(),
      modifiedBy: '',
      modifiedDate: new Date().toISOString(),
      deletedBy: '',
      deletedDate: null,
      isDeleted: false
    };
  
    console.log('API’ye Gönderilecek Cevap Anahtarı:', answerKeyData);
  
    this.questionAnswerKeyService.addAnswerKey(answerKeyData).subscribe(response => {
      console.log('Cevap Anahtarı Kaydedildi:', response);
      
      // **Backend’den dönen ID kontrolü**
      if (!response.data.soruSecenekId) {
        console.log('API’den dönen soruSecenekId NULL! Backend tarafını kontrol et.');
      } else {
        console.log(`API’den dönen soruSecenekId: ${response.data.soruSecenekId}`);
      }
  
      // **Formu sıfırla**
      this.resetForm();
  
      Swal.fire({
        position: "center",
        icon: "success",
        title: "Soru Başarıyla Eklendi",
        showConfirmButton: false,
        timer: 1500
      });
    });
  }

  getCorrectOptionIndex(): number {
    const correctOption = this.questionData.options.find(option => option.correct);
    return correctOption ? this.questionData.options.indexOf(correctOption) + 1 : 1; // Eğer doğru şık yoksa varsayılan olarak 1. şık seçilir
  }

  getDifficultyValue(): number {
    switch (this.questionData.difficulty) {
      case 'Kolay': return 1;
      case 'Orta': return 2;
      case 'Zor': return 3;
      default: return 1;
    }
  }

  getQuestionTypeValue(): number {
    return this.questionData.type === 'Çoktan Seçmeli' ? 1 : 2;
  }

  closeModal() {
    this.modalService.dismissAll();
    window.location.reload(); 
  }

  goBack() {
    this.progressValue = 33; // **Geri gidince progress %33 olacak**
    this.modalService.dismissAll();
    setTimeout(() => {
      this.modalService.open(CreateQuestionBankModalComponent, { size: 'lg', centered: true });
    }, 100);
  }
  ngOnInit() {
    this.generateOptions(); // Sayfa açıldığında şıkları otomatik oluştur
  }
  
  resetForm() {
    this.questionData = {
      title: '',
      points: 0,
      difficulty: 'Kolay',
      type: 'Çoktan Seçmeli',
      optionCount: 'A, B, C',
      options: [],
      status: 'Aktif'
    };
    this.optionIds = [];
    this.questionId = '';
    this.generateOptions(); // Regenerate options if needed

    
  }

}