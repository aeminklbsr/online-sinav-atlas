import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent {

  registerData = {
    fullName: '',
    email: '',
    password: '',
    confirmPassword: ''
  };

  onSubmit() {
    // Kayıt işlemleri burada yapılacak
    console.log('Register attempt:', this.registerData);
  }

}
