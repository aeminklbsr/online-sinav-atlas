import { Routes } from '@angular/router';
import { TeacherDashboardComponent } from './ui/pages/teacher/dashboard/dashboard.component';
import { CreateExamComponent } from './ui/pages/teacher/exams/create-exam/create-exam.component';
import { TakeExamComponent } from './ui/pages/teacher/exams/take-exam/take-exam.component';
import { StudentDashboardComponent } from './ui/pages/student/dashboard/dashboard.component';
import { LoginComponent } from './ui/pages/auth/login/login.component';
import { RegisterComponent } from './ui/pages/auth/register/register.component';

export const routes: Routes = [

    {
        path: 'teacher',
        children: [
            { path: 'dashboard', component: TeacherDashboardComponent },
            { path: 'exams/create', component: CreateExamComponent },
            { path: 'exams/take/:id', component: TakeExamComponent },
            { path: '', redirectTo: 'dashboard', pathMatch: 'full' }
        ]
    },
    { path: 'login', component: LoginComponent },
    { path: 'register', component: RegisterComponent },
    { path: 'dashboard', component: StudentDashboardComponent },
    { path: '', redirectTo: '/teacher/dashboard', pathMatch: 'full' }
];
