import { Component, OnInit } from '@angular/core';
import { SidebarComponent } from "../../../../components/sidebar/sidebar.component";
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { Question } from "../../../../../common/models/question";

@Component({
  selector: 'app-take-exam',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule, SidebarComponent],
  templateUrl: './take-exam.component.html',
  styleUrls: ['./take-exam.component.css'],

})
export class TakeExamComponent implements OnInit {

  currentQuestion = 0;
  timeLeft = 120; // 2 hours in minutes
  answers: { [key: number]: string } = {};
  isSubmitting = false;
  examFinished = false;
  flaggedQuestions: Set<number> = new Set();

  // Mock data
  exam = {
    title: 'Final Sınavı',
    course: 'Matematik',
    totalQuestions: 5,
    duration: 120,
    points: 100
  };

  questions: Question[] = [
    {
      id: 1,
      text: 'Aşağıdakilerden hangisi bir fonksiyonun türevini ifade eder?',
      type: 'multiple',
      options: [
        'f(x)',
        'f\'(x)',
        'f∫(x)',
        'f^2(x)'
      ],
      correctAnswer: 'f\'(x)',
      points: 20
    },
    {
      id: 2,
      text: 'İntegral kavramını ve kullanım alanlarını açıklayınız.',
      type: 'essay',
      points: 20
    },
    {
      id: 3,
      text: 'Limit kavramının matematikteki önemini açıklayınız.',
      type: 'essay',
      points: 20
    },
    {
      id: 4,
      text: '2x² + 3x - 5 fonksiyonunun türevi nedir?',
      type: 'multiple',
      options: [
        '4x + 3',
        '2x + 3',
        '4x - 3',
        '2x - 3'
      ],
      correctAnswer: '4x + 3',
      points: 20
    },
    {
      id: 5,
      text: 'Süreklilik kavramını bir örnek üzerinden açıklayınız.',
      type: 'essay',
      points: 20
    }
  ];

  ngOnInit() {
    this.startTimer();
  }

  startTimer() {
    const timer = setInterval(() => {
      if (this.timeLeft > 0) {
        this.timeLeft--;
      } else {
        clearInterval(timer);
        this.submitExam();
      }
    }, 60000); // Her dakika
  }

  formatTime(minutes: number): string {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}`;
  }

  previousQuestion() {
    if (this.currentQuestion > 0) {
      this.currentQuestion--;
    }
  }

  nextQuestion() {
    if (this.currentQuestion < this.questions.length - 1) {
      this.currentQuestion++;
    }
  }

  goToQuestion(index: number) {
    this.currentQuestion = index;
  }

  isQuestionAnswered(index: number): boolean {
    return !!this.answers[this.questions[index].id];
  }

  toggleFlagQuestion(index: number) {
    if (this.flaggedQuestions.has(index)) {
      this.flaggedQuestions.delete(index);
    } else {
      this.flaggedQuestions.add(index);
    }
  }

  isQuestionFlagged(index: number): boolean {
    return this.flaggedQuestions.has(index);
  }

  submitExam() {
    this.isSubmitting = true;
    // Simüle edilmiş API çağrısı
    setTimeout(() => {
      this.examFinished = true;
      this.isSubmitting = false;
    }, 2000);
  }

  // Yardımcı metodlar
  getAnsweredCount(): number {
    return Object.keys(this.answers).length;
  }

  getUnansweredCount(): number {
    return this.questions.length - this.getAnsweredCount();
  }

  getProgressPercentage(): number {
    return (this.getAnsweredCount() / this.questions.length) * 100;
  }

}
