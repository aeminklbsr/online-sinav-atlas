import { Component, OnInit } from '@angular/core';
import { SidebarComponent } from "../../../../components/sidebar/sidebar.component";
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-create-exam',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule, ReactiveFormsModule, SidebarComponent],
  templateUrl: './create-exam.component.html',
  styleUrls: ['./create-exam.component.css'],

})
export class CreateExamComponent implements OnInit {

  examForm: FormGroup;
  isLoading = false;

  // Mock data
  courses = [
    { id: 1, name: 'Matematik' },
    { id: 2, name: 'Fizik' },
    { id: 3, name: 'Kimya' },
    { id: 4, name: 'Biyoloji' }
  ];

  questionBank = [
    { 
      id: 1, 
      text: 'İntegral nedir?', 
      type: 'multiple',
      options: ['A) Türevin tersi', 'B) Limit', 'C) Toplam', 'D) Çarpım'],
      correctAnswer: 'A',
      difficulty: 'Orta',
      points: 10,
      course: 'Matematik'
    },
    { 
      id: 2, 
      text: 'Newton\'un 1. hareket yasası nedir?', 
      type: 'multiple',
      options: [
        'A) Kuvvet = Kütle x İvme', 
        'B) Etki-Tepki Yasası', 
        'C) Eylemsizlik Yasası', 
        'D) Enerji Korunumu'
      ],
      correctAnswer: 'C',
      difficulty: 'Kolay',
      points: 5,
      course: 'Fizik'
    },
    { 
      id: 3, 
      text: 'Fotosentez sürecini açıklayınız.', 
      type: 'essay',
      difficulty: 'Zor',
      points: 20,
      course: 'Biyoloji'
    }
  ];

  selectedQuestions: any[] = [];

  constructor(private fb: FormBuilder) {
    this.examForm = this.fb.group({
      title: ['', Validators.required],
      course: ['', Validators.required],
      description: [''],
      date: ['', Validators.required],
      startTime: ['', Validators.required],
      duration: [60, [Validators.required, Validators.min(1)]],
      totalPoints: [100, [Validators.required, Validators.min(0)]],
      passingGrade: [50, [Validators.required, Validators.min(0), Validators.max(100)]],
      shuffleQuestions: [false],
      showResults: [true],
      allowLateSubmissions: [false],
      requireWebcam: [false]
    });
  }

  ngOnInit(): void {}

  addQuestion(question: any): void {
    if (!this.selectedQuestions.find(q => q.id === question.id)) {
      this.selectedQuestions.push(question);
    }
  }

  removeQuestion(questionId: number): void {
    this.selectedQuestions = this.selectedQuestions.filter(q => q.id !== questionId);
  }

  calculateTotalPoints(): number {
    return this.selectedQuestions.reduce((sum, q) => sum + q.points, 0);
  }

  onSubmit(): void {
    if (this.examForm.valid && this.selectedQuestions.length > 0) {
      this.isLoading = true;
      
      const examData = {
        ...this.examForm.value,
        questions: this.selectedQuestions,
        totalPoints: this.calculateTotalPoints()
      };

      console.log('Creating exam:', examData);
      
      // Simulate API call
      setTimeout(() => {
        this.isLoading = false;
        // Show success message and redirect
      }, 1500);
    }
  }

}
