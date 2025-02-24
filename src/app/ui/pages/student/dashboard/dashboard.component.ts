import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class StudentDashboardComponent {

  student = {
    name: 'Ahmet Yılmaz',
    department: 'Bilgisayar Mühendisliği',
    semester: '6. Dönem'
  };

  upcomingExams = [
    {
      id: 1,
      courseName: 'Veri Yapıları',
      date: '2024-02-01',
      time: '10:00',
      duration: 60,
      status: 'upcoming'
    },
    {
      id: 2,
      courseName: 'Algoritma Analizi',
      date: '2024-02-03',
      time: '14:00',
      duration: 90,
      status: 'upcoming'
    }
  ];

  recentResults = [
    {
      id: 1,
      courseName: 'Nesne Yönelimli Programlama',
      date: '2024-01-25',
      score: 85,
      totalQuestions: 20,
      correctAnswers: 17
    },
    {
      id: 2,
      courseName: 'Veritabanı Yönetimi',
      date: '2024-01-20',
      score: 92,
      totalQuestions: 25,
      correctAnswers: 23
    }
  ];

  enrolledCourses = [
    {
      id: 1,
      name: 'Veri Yapıları',
      instructor: 'Dr. Mehmet Öz',
      progress: 75
    },
    {
      id: 2,
      name: 'Algoritma Analizi',
      instructor: 'Prof. Dr. Ayşe Kaya',
      progress: 60
    },
    {
      id: 3,
      name: 'Nesne Yönelimli Programlama',
      instructor: 'Doç. Dr. Ali Veli',
      progress: 90
    }
  ];
}
