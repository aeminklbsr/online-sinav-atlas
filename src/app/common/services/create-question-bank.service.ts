import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { CreateQuestionBank } from '../models/create-question-bank';

@Injectable({
  providedIn: 'root'
})
export class CreateQuestionBankService {
  private apiUrl = 'https://apievaluation.atlas.edu.tr/api/SoruBankasi';

  constructor(private http: HttpClient) {}

  createQuestionBank(questionBankData: CreateQuestionBank): Observable<{ data: CreateQuestionBank }> {
    return this.http.post<{ data: CreateQuestionBank }>(this.apiUrl, questionBankData);
  }

  getFilteredQuestionBanks(): Observable<{ data: CreateQuestionBank[] }> {
    const url = `${this.apiUrl}/filter?kullaniciAdi=admin`;
    return this.http.get<{ data: CreateQuestionBank[] }>(url);
  }

  deleteQuestionBank(id: string, disabledBy: string): Observable<{ data: CreateQuestionBank }> {
    const url = `${this.apiUrl}/${id}?disabledBy=${disabledBy}`;
    return this.http.delete<{ data: CreateQuestionBank }>(url);
  }

  updateQuestionBank(updatedBank: CreateQuestionBank): Observable<{ data: CreateQuestionBank }> {
    return this.http.put<{ data: CreateQuestionBank }>(this.apiUrl, updatedBank);
  }
  

  
}