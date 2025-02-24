import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { QuestionAdd } from '../models/question-add';

@Injectable({
  providedIn: 'root'
})
export class QuestionAddService {
  private apiUrl = 'https://apievaluation.atlas.edu.tr/api/Soru';

  constructor(private http: HttpClient) {}

  addQuestion(questionData: QuestionAdd): Observable<{ data: QuestionAdd }> {
    return this.http.post<{ data: QuestionAdd }>(this.apiUrl, questionData);
  }
  getQuestionsByQuestionBankId(questionBankId: string): Observable<{ data: QuestionAdd[] }> {
    const url = `${this.apiUrl}/filter?soruBankasiId=${questionBankId}`;
    return this.http.get<{ data: QuestionAdd[] }>(url);
  }

  updateQuestion(updatedQuestion: QuestionAdd) {
    return this.http.put<{ data: QuestionAdd }>(this.apiUrl, updatedQuestion);
  }
  
  
}